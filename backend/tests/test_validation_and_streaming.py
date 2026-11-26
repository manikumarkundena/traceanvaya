import pytest
import uuid
from app.services.log_parser import LogParser, redact_secrets, extract_severity
from app.schemas.incident import (
    InvestigationState,
    EvidenceItem,
    HypothesisItem,
    RemediationItem,
)
from app.agents.incident_agent import (
    investigation_agent,
    search_logs,
    get_log_entry,
    add_hypothesis,
    propose_remediation,
    update_investigation,
    generate_postmortem,
)
from ag_ui.core import EventType


class TestLogParserValidation:
    """Rigorous boundary and validation testing for LogParser."""

    def test_empty_log_input(self):
        records = LogParser.parse_log_content("", session_id="test-session")
        assert records == []

    def test_malformed_unstructured_lines(self):
        raw = "random unformatted junk line 1\n\n   \nanother unstructured error without brackets\n"
        records = LogParser.parse_log_content(raw, session_id="custom-srv")
        assert len(records) == 2
        assert records[0].id.startswith("ev-")

    def test_secret_redaction_comprehensive(self):
        text_with_jwt = "User auth token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozG4B_d3Q"
        text_with_api_key = 'Calling downstream api_key="sk-live-abcdef1234567890_secret"'
        text_with_bearer = "Authorization: Bearer my_secret_token_value_xyz123"

        assert "[REDACTED_JWT]" in redact_secrets(text_with_jwt)
        assert "[REDACTED_API_KEY]" in redact_secrets(text_with_api_key)
        assert "[REDACTED_TOKEN]" in redact_secrets(text_with_bearer)

    def test_json_lines_parsing_and_anomaly_flagging(self):
        json_log = (
            '{"id": "ev-fatal-1", "timestamp": "2026-11-26T14:15:46Z", "service": "order-srv", "severity": "FATAL", "message": "SQLTransientConnectionException: HikariPool exhausted"}\n'
            '{"id": "ev-info-1", "timestamp": "2026-11-26T14:15:47Z", "service": "order-srv", "severity": "INFO", "message": "Health check OK"}\n'
        )
        records = LogParser.parse_log_content(json_log, session_id="json-test")
        assert len(records) == 2
        assert records[0].is_anomaly is True
        assert records[0].severity == "FATAL"
        assert records[1].is_anomaly is False


class TestSessionIsolationAndTools:
    """Verifies that separate investigation sessions remain strictly isolated."""

    def test_session_state_isolation(self):
        state_a = InvestigationState(
            session_id="session-alpha",
            incident_title="Alpha Outage",
            severity="CRITICAL",
            status="INVESTIGATING",
            affected_service="alpha-service",
            findings=["Alpha finding"],
        )
        state_b = InvestigationState(
            session_id="session-beta",
            incident_title="Beta Outage",
            severity="LOW",
            status="RESOLVED",
            affected_service="beta-service",
            findings=["Beta finding"],
        )

        class MockCtx:
            def __init__(self, s):
                self.deps = type("Deps", (), {"state": s})()

        ctx_a = MockCtx(state_a)
        ctx_b = MockCtx(state_b)

        # Mutate Alpha
        update_investigation(ctx_a, status="HYPOTHESIS_FORMED", finding="Alpha updated")

        assert state_a.status == "HYPOTHESIS_FORMED"
        assert "Alpha updated" in state_a.findings
        # Beta must remain untouched
        assert state_b.status == "RESOLVED"
        assert state_b.findings == ["Beta finding"]
        assert state_b.session_id == "session-beta"

    def test_remediation_proposal_human_gated(self):
        state = InvestigationState(
            session_id=str(uuid.uuid4()),
            incident_title="Lock Contention",
            severity="HIGH",
            status="INVESTIGATING",
            affected_service="order-billing-service",
        )

        class MockCtx:
            def __init__(self, s):
                self.deps = type("Deps", (), {"state": s})()

        ctx = MockCtx(state)
        res = propose_remediation(
            ctx,
            title="Kill rogue process",
            description="Terminate batch query PID 41920",
            risk_level="HIGH",
            steps=["Inspect pg_stat_activity", "Invoke pg_terminate_backend(41920)"],
        )

        assert "Awaiting human operator approval" in res
        assert state.active_remediation_approval == "PENDING"
        assert len(state.proposed_remediations) == 1
        assert "[HIGH] Kill rogue process" in state.proposed_remediations[0]


class TestAGUIProtocolStandards:
    """Ensures conformance to official ag-ui-protocol specifications."""

    def test_official_event_types_verified(self):
        expected_events = [
            "RUN_STARTED",
            "RUN_FINISHED",
            "RUN_ERROR",
            "STEP_STARTED",
            "STEP_FINISHED",
            "TEXT_MESSAGE_CHUNK",
            "TEXT_MESSAGE_CONTENT",
            "TOOL_CALL_START",
            "TOOL_CALL_RESULT",
            "STATE_SNAPSHOT",
            "STATE_DELTA",
        ]
        enum_names = [e.name for e in EventType]
        for ev in expected_events:
            assert ev in enum_names, f"Missing standard AG-UI event: {ev}"

        # Confirm non-standard event STATE_UPDATE is not in official protocol
        assert "STATE_UPDATE" not in enum_names, "STATE_UPDATE is not an official AG-UI EventType; STATE_SNAPSHOT or STATE_DELTA must be used"
