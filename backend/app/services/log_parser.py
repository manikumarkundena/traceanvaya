import json
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.schemas.incident import EvidenceItem


SECRET_PATTERNS = [
    (r'(?i)(bearer\s+)[a-zA-Z0-9_\-\.]{15,}', r'\1[REDACTED_TOKEN]'),
    (r'(?i)(api[_-]?key["\']?\s*[:=]\s*["\']?)[a-zA-Z0-9_\-]{16,}(["\']?)', r'\1[REDACTED_API_KEY]\2'),
    (r'(?i)(password["\']?\s*[:=]\s*["\']?)[^"\'\s]{6,}(["\']?)', r'\1[REDACTED_PASSWORD]\2'),
    (r'(?i)(authorization["\']?\s*[:=]\s*["\']?)[^"\'\s]{15,}(["\']?)', r'\1[REDACTED_AUTH]\2'),
    (r'eyJ[a-zA-Z0-9_\-]{10,}\.eyJ[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]{10,}', '[REDACTED_JWT]'),
    (r'(?i)((?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|amqp)(?:\+[a-z0-9]+)?://[^:\s/]+:)[^@\s]+(@)', r'\1[REDACTED_DB_PASS]\2'),
    (r'\b(ghp_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9\-]{10,}|AKIA[0-9A-Z]{16})\b', '[REDACTED_ACCESS_TOKEN]'),
]


def redact_secrets(text: str) -> str:
    cleaned = text
    for pattern, replacement in SECRET_PATTERNS:
        cleaned = re.sub(pattern, replacement, cleaned)
    return cleaned


def extract_severity(text: str) -> str:
    upper = text.upper()
    if any(k in upper for k in ["FATAL", "PANIC", "EMERGENCY"]):
        return "FATAL"
    if "CRITICAL" in upper:
        return "CRITICAL"
    if any(k in upper for k in ["ERROR", "ERR", "FAIL", "FAILED", "EXCEPTION"]):
        return "ERROR"
    if any(k in upper for k in ["WARN", "WARNING"]):
        return "WARN"
    if "DEBUG" in upper:
        return "DEBUG"
    return "INFO"


def extract_service(text: str, metadata: Dict[str, Any], fallback_service: str = "system") -> str:
    if "service" in metadata and isinstance(metadata["service"], str) and metadata["service"].strip():
        return metadata["service"].strip()
    if "service_name" in metadata and isinstance(metadata["service_name"], str) and metadata["service_name"].strip():
        return metadata["service_name"].strip()

    match = re.search(r'\[([a-zA-Z0-9_\-]+(?:-service|-api|-gateway|-worker|-db)?)\]', text)
    if match:
        return match.group(1).lower()

    match_kv = re.search(r'(?:service|app|component)=([a-zA-Z0-9_\-]+)', text, re.IGNORECASE)
    if match_kv:
        return match_kv.group(1).lower()

    return fallback_service or "system"


def extract_trace_id(text: str, metadata: Dict[str, Any]) -> Optional[str]:
    for key in ("trace_id", "traceId", "request_id", "requestId", "correlation_id", "correlationId", "req_id"):
        val = metadata.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()

    match = re.search(
        r'(?:trace[_-]?id|request[_-]?id|correlation[_-]?id|req[_-]?id|x-request-id)["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_\-\.]{4,64})',
        text,
        re.IGNORECASE,
    )
    if match:
        return match.group(1)
    return None


def normalize_timestamp(text: str) -> str:
    iso_match = re.search(r'\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?', text)
    if iso_match:
        raw_ts = iso_match.group(0).replace(' ', 'T')
        if not raw_ts.endswith('Z') and '+' not in raw_ts and '-' not in raw_ts[10:]:
            raw_ts += 'Z'
        return raw_ts
    # Preserve original evidence without inventing missing timestamps
    return ""


def _parse_iso_epoch(ts: str) -> Optional[float]:
    if not ts:
        return None
    try:
        normalized = ts.replace("Z", "+00:00")
        dt = datetime.fromisoformat(normalized)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.timestamp()
    except Exception:
        return None


class LogParser:
    @staticmethod
    def parse_log_content(
        content: str,
        session_id: str = "default-session",
        source_label: Optional[str] = None,
        start_index: int = 1,
    ) -> List[EvidenceItem]:
        lines = content.strip().splitlines()
        items: List[EvidenceItem] = []
        index = start_index
        clean_source = (source_label or "").strip()

        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue

            redacted_line = redact_secrets(line_str)
            item_id = f"ev-{index:03d}"
            timestamp = ""
            service = clean_source or "system"
            severity = "INFO"
            message = redacted_line
            metadata: Dict[str, Any] = {}
            trace_id: Optional[str] = None

            if redacted_line.startswith('{') and redacted_line.endswith('}'):
                try:
                    data = json.loads(redacted_line)
                    if isinstance(data, dict):
                        if "id" in data:
                            item_id = str(data["id"])
                        timestamp = str(data.get("timestamp") or normalize_timestamp(redacted_line))
                        service = str(
                            data.get("service")
                            or extract_service(redacted_line, data, fallback_service=clean_source or "system")
                        )
                        severity = str(data.get("severity") or extract_severity(redacted_line)).upper()
                        message = str(data.get("message") or redacted_line)
                        trace_id = extract_trace_id(redacted_line, data)
                        metadata = {
                            k: v
                            for k, v in data.items()
                            if k not in ["id", "timestamp", "service", "severity", "message"]
                        }
                except Exception:
                    pass

            if not metadata and not (redacted_line.startswith('{') and redacted_line.endswith('}')):
                timestamp = normalize_timestamp(redacted_line)
                severity = extract_severity(redacted_line)
                service = extract_service(redacted_line, metadata, fallback_service=clean_source or "system")
                trace_id = extract_trace_id(redacted_line, metadata)
                message = redacted_line

            if clean_source:
                metadata["source_label"] = clean_source

            is_anomaly = severity in ["ERROR", "CRITICAL", "FATAL"] or any(
                term in message.lower()
                for term in ["timeout", "exhausted", "rolled back", "lease timeout", "spike", "502", "503", "504"]
            )

            items.append(
                EvidenceItem(
                    id=item_id,
                    timestamp=timestamp,
                    service=service,
                    severity=severity,
                    message=message,
                    metadata=metadata,
                    raw_log=redacted_line,
                    is_anomaly=is_anomaly,
                    correlated_ids=[],
                    source_label=clean_source or service,
                    trace_id=trace_id,
                )
            )
            index += 1

        return LogParser.correlate_evidence(items)

    @staticmethod
    def correlate_evidence(items: List[EvidenceItem]) -> List[EvidenceItem]:
        """Sort chronologically where timestamps exist and link records by trace_id or 10s anomaly window."""
        if not items:
            return items

        indexed = list(enumerate(items))
        indexed.sort(
            key=lambda pair: (
                0 if _parse_iso_epoch(pair[1].timestamp) is not None else 1,
                _parse_iso_epoch(pair[1].timestamp) or 0.0,
                pair[0],
            )
        )
        sorted_items = [pair[1] for pair in indexed]

        # Reset correlations before recomputing across all sources
        for item in sorted_items:
            item.correlated_ids = []

        epochs = [_parse_iso_epoch(item.timestamp) for item in sorted_items]

        for i, item in enumerate(sorted_items):
            # 1. Cross-service correlation by shared trace/request ID
            if item.trace_id:
                for j, other in enumerate(sorted_items):
                    if i != j and other.trace_id == item.trace_id and other.id not in item.correlated_ids:
                        item.correlated_ids.append(other.id)

            # 2. Temporal correlation within 10s window for anomalies
            if item.is_anomaly:
                t_i = epochs[i]
                for j, other in enumerate(sorted_items):
                    if i == j or other.id in item.correlated_ids:
                        continue
                    t_j = epochs[j]
                    within_window = (
                        t_i is not None and t_j is not None and abs(t_i - t_j) <= 10.0
                    ) or (t_i is None and abs(i - j) <= 2)
                    if within_window and (
                        other.severity in ["WARN", "ERROR", "CRITICAL", "FATAL"] or other.service == item.service
                    ):
                        item.correlated_ids.append(other.id)

        return sorted_items
