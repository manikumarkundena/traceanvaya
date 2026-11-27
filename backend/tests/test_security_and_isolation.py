import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings
from app.core.security import AIRateAndQuotaGuard


@pytest.mark.asyncio
async def test_anonymous_session_init_and_ownership():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client_a, \
               AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client_b:
        # Unauthenticated access must be rejected with 401
        unauth_res = await client_a.get("/api/investigation/state")
        assert unauth_res.status_code == 401

        # Forged token must be rejected with 403
        forged_res = await client_a.get(
            "/api/investigation/state",
            headers={"X-TraceAnvaya-Session": "sess-fake.9999999999.badsignature"},
        )
        assert forged_res.status_code == 403

        # Visitor A initializes an anonymous session
        res_a = await client_a.post("/api/sessions/init")
        assert res_a.status_code == 200
        sess_a = res_a.json()
        assert sess_a["session_id"].startswith("sess-")
        headers_a = {"X-TraceAnvaya-Session": sess_a["token"]}

        # Visitor B initializes an independent anonymous session
        res_b = await client_b.post("/api/sessions/init")
        assert res_b.status_code == 200
        sess_b = res_b.json()
        assert sess_b["session_id"] != sess_a["session_id"]
        headers_b = {"X-TraceAnvaya-Session": sess_b["token"]}

        # Visitor A loads scenario-1 and mutates title
        load_a = await client_a.post(
            f"/api/scenarios/scenario-1/load?session_id={sess_a['session_id']}",
            headers=headers_a,
        )
        assert load_a.status_code == 200

        state_a = load_a.json()["state"]
        state_a["incident_title"] = "Visitor A Private Title"
        put_a = await client_a.put(
            f"/api/investigation/state?session_id={sess_a['session_id']}",
            json=state_a,
            headers=headers_a,
        )
        assert put_a.status_code == 200

        # Visitor B cannot read or mutate Visitor A's session (403 Forbidden)
        cross_read = await client_b.get(
            f"/api/investigation/state?session_id={sess_a['session_id']}",
            headers=headers_b,
        )
        assert cross_read.status_code == 403

        cross_write = await client_b.put(
            f"/api/investigation/state?session_id={sess_a['session_id']}",
            json=state_a,
            headers=headers_b,
        )
        assert cross_write.status_code == 403


@pytest.mark.asyncio
async def test_request_body_size_limits():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        sess = (await client.post("/api/sessions/init")).json()
        headers = {"X-TraceAnvaya-Session": sess["token"]}

        # Oversized raw evidence payload (> MAX_RAW_EVIDENCE_BYTES)
        oversized_raw = "x" * (settings.MAX_RAW_EVIDENCE_BYTES + 1024)
        res_raw = await client.post(
            "/api/evidence/raw",
            content=oversized_raw,
            headers={**headers, "Content-Type": "application/json"},
        )
        assert res_raw.status_code == 413

        # Oversized /api/agent payload (> MAX_AGENT_BODY_BYTES)
        oversized_agent = "y" * (settings.MAX_AGENT_BODY_BYTES + 1024)
        res_agent = await client.post(
            "/api/agent",
            content=oversized_agent,
            headers={**headers, "Content-Type": "application/json"},
        )
        assert res_agent.status_code == 413


@pytest.mark.asyncio
async def test_upload_validation_and_secret_redaction():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        sess = (await client.post("/api/sessions/init")).json()
        headers = {"X-TraceAnvaya-Session": sess["token"]}

        bad_upload = await client.post(
            f"/api/evidence/upload?session_id={sess['session_id']}",
            files={"file": ("malware.exe", b"binary", "application/octet-stream")},
            headers=headers,
        )
        assert bad_upload.status_code == 400

        log_payload = b'2026-11-27T10:00:00Z ERROR auth-service api_key="sk-live-secret1234567890abcdef" failed\n'
        good_upload = await client.post(
            f"/api/evidence/upload?session_id={sess['session_id']}",
            files={"file": ("app.log", log_payload, "text/plain")},
            headers=headers,
        )
        assert good_upload.status_code == 200

        ev_list = (
            await client.get(
                f"/api/evidence?session_id={sess['session_id']}",
                headers=headers,
            )
        ).json()
        assert len(ev_list) == 1
        assert "[REDACTED_API_KEY]" in ev_list[0]["raw_log"]
        assert "sk-live-secret1234567890abcdef" not in ev_list[0]["raw_log"]


def test_rate_limit_and_quota_guard():
    guard = AIRateAndQuotaGuard()

    # IP rate limit check
    for _ in range(settings.RATE_LIMIT_PER_MINUTE):
        ok, _ = guard.check_ip_rate("203.0.113.10")
        assert ok is True
    ok, _ = guard.check_ip_rate("203.0.113.10")
    assert ok is False

    # Per-session concurrency limit check
    for _ in range(settings.MAX_CONCURRENT_AI_PER_SESSION):
        ok, status_code, _ = guard.acquire_ai_slot("sess-test-1")
        assert ok is True
        assert status_code == 200
    ok, status_code, _ = guard.acquire_ai_slot("sess-test-1")
    assert ok is False
    assert status_code == 429

    # Releasing slots allows subsequent requests
    guard.release_ai_slot("sess-test-1")
    ok, status_code, _ = guard.acquire_ai_slot("sess-test-1")
    assert ok is True


def test_production_requires_session_secret(monkeypatch):
    from app.core.security import validate_production_security

    monkeypatch.setattr(settings, "ENVIRONMENT", "production")
    monkeypatch.setattr(settings, "SESSION_SECRET", "")
    with pytest.raises(RuntimeError, match="SESSION_SECRET"):
        validate_production_security()

    monkeypatch.setattr(settings, "SESSION_SECRET", "short-secret")
    with pytest.raises(RuntimeError, match="SESSION_SECRET"):
        validate_production_security()

    monkeypatch.setattr(settings, "SESSION_SECRET", "a" * 32)
    validate_production_security()
