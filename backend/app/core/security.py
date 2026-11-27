import hashlib
import hmac
import secrets
import time
from collections import defaultdict
from typing import Dict, List, Optional, Tuple
from fastapi import HTTPException, Request, status
from app.core.config import settings

# Ephemeral fallback secret for local development only when SESSION_SECRET is unset
_PROCESS_FALLBACK_SECRET = secrets.token_urlsafe(32)


def validate_production_security() -> None:
    """Fail fast at startup if production is missing a strong SESSION_SECRET."""
    if settings.ENVIRONMENT.strip().lower() == "production":
        secret = settings.SESSION_SECRET.strip()
        if len(secret) < 32:
            raise RuntimeError(
                "SESSION_SECRET must be set to at least 32 characters when ENVIRONMENT=production."
            )


def _get_signing_key() -> bytes:
    secret = settings.SESSION_SECRET.strip()
    if settings.ENVIRONMENT.strip().lower() == "production" and len(secret) < 32:
        raise RuntimeError(
            "SESSION_SECRET must be set to at least 32 characters when ENVIRONMENT=production."
        )
    return (secret or _PROCESS_FALLBACK_SECRET).encode("utf-8")


def generate_session_id() -> str:
    return f"sess-{secrets.token_hex(8)}"


def create_session_token(session_id: str, ttl_seconds: Optional[int] = None) -> str:
    ttl = ttl_seconds if ttl_seconds is not None else settings.SESSION_TTL_SECONDS
    exp_ts = int(time.time()) + ttl
    payload = f"{session_id}.{exp_ts}"
    sig = hmac.new(_get_signing_key(), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload}.{sig}"


def verify_session_token(token: Optional[str]) -> Optional[str]:
    if not token or not isinstance(token, str):
        return None
    parts = token.strip().split(".")
    if len(parts) != 3:
        return None
    session_id, exp_str, provided_sig = parts
    if not session_id or not exp_str.isdigit():
        return None
    if int(exp_str) <= int(time.time()):
        return None
    payload = f"{session_id}.{exp_str}"
    expected_sig = hmac.new(_get_signing_key(), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(provided_sig, expected_sig):
        return None
    return session_id


def extract_client_ip(request: Request) -> str:
    """
    Extract client IP safely. Only honors X-Forwarded-For when TRUST_PROXY_HEADERS is enabled
    (e.g. behind Render / Vercel reverse proxies).
    """
    if settings.TRUST_PROXY_HEADERS:
        forwarded_for = request.headers.get("x-forwarded-for", "")
        if forwarded_for:
            first_ip = forwarded_for.split(",")[0].strip()
            if first_ip and len(first_ip) <= 64:
                return first_ip
        real_ip = request.headers.get("x-real-ip", "").strip()
        if real_ip and len(real_ip) <= 64:
            return real_ip
    return request.client.host if request.client else "unknown"


async def read_body_with_limit(request: Request, max_bytes: int) -> bytes:
    """
    Stream request body chunk-by-chunk and abort with HTTP 413 as soon as max_bytes is exceeded,
    preventing unnecessary memory buffering on oversized payloads.
    """
    content_length = request.headers.get("content-length")
    if content_length and content_length.isdigit() and int(content_length) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"Request payload exceeds maximum allowed size ({max_bytes} bytes).",
        )

    chunks: List[bytes] = []
    total = 0
    async for chunk in request.stream():
        total += len(chunk)
        if total > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_CONTENT_TOO_LARGE,
                detail=f"Request payload exceeds maximum allowed size ({max_bytes} bytes).",
            )
        chunks.append(chunk)
    return b"".join(chunks)


class AIRateAndQuotaGuard:
    """
    In-memory single-process safeguard for public demo deployments:
    - Per-IP sliding-window requests per minute
    - Per-session hourly AI runs
    - Per-session concurrent AI runs
    - Global hourly AI safeguard across all visitors
    """

    def __init__(self) -> None:
        self._ip_buckets: Dict[str, List[float]] = defaultdict(list)
        self._session_hourly: Dict[str, List[float]] = defaultdict(list)
        self._session_inflight: Dict[str, int] = defaultdict(int)
        self._global_hourly: List[float] = []

    def check_ip_rate(self, client_ip: str) -> Tuple[bool, str]:
        now = time.monotonic()
        cutoff = now - 60.0
        timestamps = [ts for ts in self._ip_buckets[client_ip] if ts > cutoff]
        if len(timestamps) >= settings.RATE_LIMIT_PER_MINUTE:
            self._ip_buckets[client_ip] = timestamps
            return False, "Rate limit exceeded. Please wait before retrying."
        timestamps.append(now)
        self._ip_buckets[client_ip] = timestamps
        return True, ""

    def acquire_ai_slot(self, session_id: str) -> Tuple[bool, int, str]:
        now = time.monotonic()
        hour_cutoff = now - 3600.0

        # Global hourly safeguard
        self._global_hourly = [ts for ts in self._global_hourly if ts > hour_cutoff]
        if len(self._global_hourly) >= settings.GLOBAL_AI_LIMIT_PER_HOUR:
            return False, status.HTTP_429_TOO_MANY_REQUESTS, (
                "Public live AI hourly capacity reached. Switch to Demo Mode or try again shortly."
            )

        # Per-session concurrency safeguard
        if self._session_inflight[session_id] >= settings.MAX_CONCURRENT_AI_PER_SESSION:
            return False, status.HTTP_429_TOO_MANY_REQUESTS, (
                "Too many concurrent AI requests in this session. Wait for the active response to finish."
            )

        # Per-session hourly safeguard
        sess_ts = [ts for ts in self._session_hourly[session_id] if ts > hour_cutoff]
        if len(sess_ts) >= settings.SESSION_AI_LIMIT_PER_HOUR:
            self._session_hourly[session_id] = sess_ts
            return False, status.HTTP_429_TOO_MANY_REQUESTS, (
                "Session live AI limit reached for this hour. Continue in Demo Mode or start a fresh session later."
            )

        sess_ts.append(now)
        self._session_hourly[session_id] = sess_ts
        self._global_hourly.append(now)
        self._session_inflight[session_id] += 1
        return True, 200, ""

    def release_ai_slot(self, session_id: str) -> None:
        if self._session_inflight[session_id] > 0:
            self._session_inflight[session_id] -= 1
        if self._session_inflight[session_id] == 0:
            self._session_inflight.pop(session_id, None)


ai_guard = AIRateAndQuotaGuard()
