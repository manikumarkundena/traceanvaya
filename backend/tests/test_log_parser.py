import json
from app.services.log_parser import LogParser, redact_secrets, extract_severity


def test_secret_redaction():
    text_with_jwt = "User auth token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozG4B_d3Q"
    text_with_api_key = 'Calling downstream api_key="sk-live-abcdef1234567890_secret"'
    text_with_bearer = "Authorization: Bearer my_secret_token_value_xyz123"

    assert "[REDACTED_JWT]" in redact_secrets(text_with_jwt)
    assert "[REDACTED_API_KEY]" in redact_secrets(text_with_api_key)
    assert "[REDACTED_TOKEN]" in redact_secrets(text_with_bearer)


def test_severity_extraction():
    assert extract_severity("CRITICAL: Out of memory") == "CRITICAL"
    assert extract_severity("FATAL connection refused") == "FATAL"
    assert extract_severity("Error occurred during checkout") == "ERROR"
    assert extract_severity("Warning: HikariPool connection count high") == "WARN"
    assert extract_severity("Debug: session active") == "DEBUG"
    assert extract_severity("Standard request completed") == "INFO"


def test_log_parser_json_and_text():
    raw_content = """
{"id": "ev-001", "timestamp": "2026-11-26T14:15:02Z", "service": "order-service", "severity": "INFO", "message": "Health check 200"}
2026-11-26T14:15:32Z [order-billing-service] WARN HikariPool-1 usage high
2026-11-26T14:15:45Z [order-billing-service] ERROR Connection lease timeout after 30000ms
"""
    items = LogParser.parse_log_content(raw_content, session_id="test-session")
    assert len(items) == 3
    assert items[0].id == "ev-001"
    assert items[0].severity == "INFO"
    assert items[1].severity == "WARN"
    assert items[2].severity == "ERROR"
    assert items[2].is_anomaly is True
