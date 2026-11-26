import pytest
from pydantic_ai import RunContext
from pydantic_ai.usage import RunUsage
from pydantic_ai.ui import StateDeps
from app.schemas.incident import InvestigationState
from app.agents.incident_agent import (
    investigation_agent,
    search_logs,
    get_log_entry,
    update_investigation,
    add_hypothesis,
    propose_remediation,
    generate_postmortem,
)
from app.services.evidence_store import evidence_store
from app.services.log_parser import LogParser


@pytest.fixture
def populated_store():
    session_id = "test-agent-session"
    logs = """
{"id": "ev-101", "timestamp": "2026-11-26T14:15:00Z", "service": "billing", "severity": "INFO", "message": "Started batch"}
{"id": "ev-104", "timestamp": "2026-11-26T14:15:10Z", "service": "billing", "severity": "WARN", "message": "Slow query lock held"}
{"id": "ev-105", "timestamp": "2026-11-26T14:15:20Z", "service": "billing", "severity": "ERROR", "message": "Lease timeout 30s"}
"""
    items = LogParser.parse_log_content(logs, session_id=session_id)
    evidence_store.store_evidence(session_id, items)
    state = evidence_store.get_or_create_state(session_id)
    return session_id, state


def test_tool_search_logs(populated_store):
    session_id, state = populated_store
    ctx = RunContext(deps=StateDeps(state=state), model=investigation_agent.model, usage=RunUsage())

    result = search_logs(ctx, query="timeout")
    assert "[ev-105]" in result
    assert "Lease timeout" in result


def test_bidirectional_state_sync_test_a_and_b(populated_store):
    session_id, state = populated_store
    ctx = RunContext(deps=StateDeps(state=state), model=investigation_agent.model, usage=RunUsage())

    # TEST A: Agent updates investigation state via tool
    update_result = update_investigation(
        ctx,
        incident_title="Database Pool Starvation Outage",
        severity="CRITICAL",
        status="HYPOTHESIS_FORMED",
        affected_service="billing",
        finding="Batch query holding exclusive table locks for 30s."
    )
    assert "synchronized successfully" in update_result
    assert ctx.deps.state.incident_title == "Database Pool Starvation Outage"
    assert ctx.deps.state.severity == "CRITICAL"
    assert ctx.deps.state.status == "HYPOTHESIS_FORMED"
    assert "Batch query holding" in ctx.deps.state.findings[0]

    # Verify store reflected agent tool update
    stored_state = evidence_store.get_or_create_state(session_id)
    assert stored_state.severity == "CRITICAL"

    # TEST B: User manually updates state in store/canvas
    stored_state.severity = "HIGH"
    stored_state.incident_title = "User Edited Title: Contention Isolated"
    evidence_store.update_state(session_id, stored_state)

    # Next agent run receives the modified state in StateDeps
    ctx_next = RunContext(deps=StateDeps(state=stored_state), model=investigation_agent.model, usage=None, prompt=None)
    assert ctx_next.deps.state.severity == "HIGH"
    assert ctx_next.deps.state.incident_title == "User Edited Title: Contention Isolated"


def test_human_remediation_approval_workflow(populated_store):
    session_id, state = populated_store
    ctx = RunContext(deps=StateDeps(state=state), model=investigation_agent.model, usage=RunUsage())

    # Agent proposes remediation
    prop_result = propose_remediation(
        ctx,
        title="Terminate locking query pid=41920",
        description="Terminates idle-in-transaction query to release connection locks.",
        risk_level="HIGH",
        steps=["Identify query PID", "Issue terminate query signal", "Verify pool recovery"]
    )
    assert "proposed with risk level HIGH" in prop_result
    assert ctx.deps.state.active_remediation_approval == "PENDING"

    # Postmortem generation includes evidence citations and proposed remediations
    pm_md = generate_postmortem(ctx)
    assert "# Postmortem Report" in pm_md
    assert "Terminate locking query pid=41920" in pm_md
    assert "Operator Approval Status: PENDING" in pm_md
