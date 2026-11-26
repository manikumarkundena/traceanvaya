import json
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from app.schemas.incident import EvidenceItem


SECRET_PATTERNS = [
    (r'(?i)(bearer\s+)[a-zA-Z0-9_\-\.]{15,}', r'\1[REDACTED_TOKEN]'),
    (r'(?i)(api[_-]?key["\']?\s*[:=]\s*["\']?)[a-zA-Z0-9_\-]{16,}(["\']?)', r'\1[REDACTED_API_KEY]\2'),
    (r'(?i)(password["\']?\s*[:=]\s*["\']?)[^"\'\s]{6,}(["\']?)', r'\1[REDACTED_PASSWORD]\2'),
    (r'(?i)(authorization["\']?\s*[:=]\s*["\']?)[^"\'\s]{15,}(["\']?)', r'\1[REDACTED_AUTH]\2'),
    (r'eyJ[a-zA-Z0-9_\-]{10,}\.eyJ[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]{10,}', '[REDACTED_JWT]'),
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


def extract_service(text: str, metadata: Dict[str, Any]) -> str:
    if "service" in metadata and isinstance(metadata["service"], str):
        return metadata["service"]
    if "service_name" in metadata and isinstance(metadata["service_name"], str):
        return metadata["service_name"]

    # Match bracketed service tags like [order-service] or service=checkout
    match = re.search(r'\[([a-zA-Z0-9_\-]+(?:-service|-api|-gateway|-worker|-db)?)\]', text)
    if match:
        return match.group(1).lower()

    match_kv = re.search(r'(?:service|app|component)=([a-zA-Z0-9_\-]+)', text, re.IGNORECASE)
    if match_kv:
        return match_kv.group(1).lower()

    return "system"


def normalize_timestamp(text: str) -> str:
    # Try ISO-8601 pattern
    iso_match = re.search(r'\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?', text)
    if iso_match:
        raw_ts = iso_match.group(0).replace(' ', 'T')
        if not raw_ts.endswith('Z') and '+' not in raw_ts and '-' not in raw_ts[10:]:
            raw_ts += 'Z'
        return raw_ts

    # Fallback to current UTC timestamp
    return datetime.now(timezone.utc).isoformat()


class LogParser:
    @staticmethod
    def parse_log_content(content: str, session_id: str = "default-session") -> List[EvidenceItem]:
        lines = content.strip().splitlines()
        items: List[EvidenceItem] = []
        index = 1

        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue

            redacted_line = redact_secrets(line_str)
            item_id = f"ev-{index:03d}"
            timestamp = datetime.now(timezone.utc).isoformat()
            service = "system"
            severity = "INFO"
            message = redacted_line
            metadata: Dict[str, Any] = {}

            # Attempt JSON line parsing
            if redacted_line.startswith('{') and redacted_line.endswith('}'):
                try:
                    data = json.loads(redacted_line)
                    if isinstance(data, dict):
                        if "id" in data:
                            item_id = str(data["id"])
                        timestamp = str(data.get("timestamp") or normalize_timestamp(redacted_line))
                        service = str(data.get("service") or extract_service(redacted_line, data))
                        severity = str(data.get("severity") or extract_severity(redacted_line)).upper()
                        message = str(data.get("message") or redacted_line)
                        metadata = {k: v for k, v in data.items() if k not in ["id", "timestamp", "service", "severity", "message"]}
                except Exception:
                    # Fallback to standard textual parsing
                    pass

            if not metadata and not (redacted_line.startswith('{') and redacted_line.endswith('}')):
                timestamp = normalize_timestamp(redacted_line)
                severity = extract_severity(redacted_line)
                service = extract_service(redacted_line, metadata)
                message = redacted_line

            # Determine anomaly
            is_anomaly = severity in ["ERROR", "CRITICAL", "FATAL"] or any(
                term in message.lower() for term in ["timeout", "exhausted", "rolled back", "lease timeout", "spike"]
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
                    correlated_ids=[]
                )
            )
            index += 1

        # Correlate timestamps & services within 10-second windows for anomalies
        for i, item in enumerate(items):
            if item.is_anomaly:
                for j in range(max(0, i - 2), min(len(items), i + 3)):
                    if i != j and items[j].id not in item.correlated_ids:
                        if items[j].severity in ["WARN", "ERROR", "CRITICAL", "FATAL"] or items[j].service == item.service:
                            item.correlated_ids.append(items[j].id)

        return items
