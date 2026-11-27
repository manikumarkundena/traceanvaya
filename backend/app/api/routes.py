import json
import os
import time
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, File, HTTPException, Request, Response, UploadFile, status
from pydantic import ValidationError
from pydantic_ai.ui.ag_ui import AGUIAdapter
from pydantic_ai.ui import StateDeps
from app.agents.incident_agent import investigation_agent
from app.core.config import settings
from app.schemas.incident import (
    EvidenceItem,
    IngestLogRequest,
    IngestResponse,
    InvestigationState,
    PostmortemReport,
)
from app.services.evidence_store import evidence_store
from app.services.log_parser import LogParser


router = APIRouter()

# Locate scenarios directory relative to project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCENARIOS_DIR = os.path.join(os.path.dirname(BASE_DIR), "scenarios")


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "traceanvaya-backend",
        "ai_provider": settings.AI_PROVIDER,
        "ai_model": settings.AI_MODEL,
        "ai_configured": bool(settings.GEMINI_API_KEY or settings.OPENAI_API_KEY),
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ==============================================================================
# AG-UI PROTOCOL INTEGRATION (CopilotKit / AG-UI client endpoint)
# ==============================================================================

# Lightweight per-IP sliding window rate limiter for public demo protection
_agent_rate_buckets: Dict[str, List[float]] = defaultdict(list)


def _check_rate_limit(client_ip: str) -> bool:
    now = time.monotonic()
    window_start = now - 60.0
    timestamps = [ts for ts in _agent_rate_buckets[client_ip] if ts > window_start]
    if len(timestamps) >= settings.RATE_LIMIT_PER_MINUTE:
        _agent_rate_buckets[client_ip] = timestamps
        return False
    timestamps.append(now)
    _agent_rate_buckets[client_ip] = timestamps
    return True


@router.post("/agent")
async def run_agent(request: Request) -> Response:
    """
    AG-UI protocol streaming endpoint.
    Receives frontend run input, synchronizes shared state (StateDeps),
    and streams AG-UI protocol events (RUN_STARTED, TEXT_DELTA, TOOL_CALL_START, STATE_UPDATE, etc.)
    back to CopilotKit or any AG-UI compliant client.
    """
    forwarded_for = request.headers.get("x-forwarded-for", "")
    client_ip = (
        forwarded_for.split(",")[0].strip()
        if forwarded_for
        else (request.client.host if request.client else "unknown")
    )
    if not _check_rate_limit(client_ip):
        return Response(
            content=json.dumps({"error": "Rate limit exceeded. Please wait before retrying."}),
            media_type="application/json",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    accept = request.headers.get("accept", "text/event-stream")
    body = await request.body()
    if len(body) > settings.MAX_AGENT_BODY_BYTES:
        return Response(
            content=json.dumps({"error": "Request payload exceeds maximum allowed size."}),
            media_type="application/json",
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
        )

    try:
        run_input = AGUIAdapter.build_run_input(body)
    except ValidationError as e:
        return Response(
            content=json.dumps({"error": "Invalid AG-UI protocol payload", "details": e.errors()}),
            media_type="application/json",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    # Extract session_id or state from input if present
    session_id = "default-session"
    client_state_dict: Dict[str, Any] = {}

    if hasattr(run_input, "state") and run_input.state:
        if isinstance(run_input.state, dict):
            client_state_dict = run_input.state
            session_id = client_state_dict.get("session_id", session_id)
        elif hasattr(run_input.state, "model_dump"):
            client_state_dict = run_input.state.model_dump()
            session_id = client_state_dict.get("session_id", session_id)

    # Synchronize state: start with store's state, overlaid with client modifications (TEST B)
    current_state = evidence_store.get_or_create_state(session_id)
    if client_state_dict:
        try:
            # Merge client-provided edits into current state
            for key, val in client_state_dict.items():
                if hasattr(current_state, key) and val is not None:
                    setattr(current_state, key, val)
            evidence_store.update_state(session_id, current_state)
        except Exception:
            pass

    # Instantiate StateDeps with verified state
    state_deps = StateDeps(state=current_state)

    adapter = AGUIAdapter(agent=investigation_agent, run_input=run_input, accept=accept)
    raw_stream = adapter.run_stream(deps=state_deps)

    async def stream_with_state():
        from ag_ui.core import EventType, StateSnapshotEvent

        async for event in raw_stream:
            evt_type = getattr(event, "type", None)
            if evt_type == EventType.RUN_FINISHED or evt_type == "RUN_FINISHED":
                evidence_store.update_state(session_id, state_deps.state)
                yield StateSnapshotEvent(
                    type=EventType.STATE_SNAPSHOT,
                    snapshot=state_deps.state.model_dump(),
                )
            yield event

    return adapter.streaming_response(stream_with_state())


# ==============================================================================
# SCENARIOS ENDPOINTS
# ==============================================================================

@router.get("/scenarios")
async def get_scenarios():
    index_file = os.path.join(SCENARIOS_DIR, "scenarios_index.json")
    if not os.path.exists(index_file):
        return []
    with open(index_file, "r", encoding="utf-8") as f:
        return json.load(f)


@router.post("/scenarios/{scenario_id}/load")
async def load_scenario(scenario_id: str, session_id: str = "default-session"):
    try:
        items = evidence_store.load_scenario(session_id, scenario_id, SCENARIOS_DIR)
        state = evidence_store.get_or_create_state(session_id)
        return {
            "status": "loaded",
            "scenario_id": scenario_id,
            "session_id": session_id,
            "total_evidence": len(items),
            "state": state
        }
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load scenario: {str(e)}")


@router.get("/scenarios/{scenario_id}/evidence", response_model=List[EvidenceItem])
async def get_scenario_evidence(scenario_id: str, session_id: str = "default-session"):
    try:
        items = evidence_store.load_scenario(session_id, scenario_id, SCENARIOS_DIR)
        return items
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ==============================================================================
# EVIDENCE MANAGEMENT ENDPOINTS
# ==============================================================================

@router.post("/evidence/upload", response_model=IngestResponse)
async def upload_evidence_file(
    file: UploadFile = File(...),
    session_id: str = "default-session"
):
    # Validate extension & content type
    allowed_exts = [".log", ".txt", ".json", ".jsonl"]
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Please upload .log, .txt, or .json files."
        )

    # 10MB file limit
    content_bytes = await file.read()
    if len(content_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 10MB.")

    content = content_bytes.decode("utf-8", errors="replace")
    items = LogParser.parse_log_content(content, session_id=session_id)
    evidence_store.store_evidence(session_id, items)

    # Tally metrics
    services = list({e.service for e in items})
    severities: Dict[str, int] = {}
    anomalies = 0
    for e in items:
        severities[e.severity] = severities.get(e.severity, 0) + 1
        if e.is_anomaly:
            anomalies += 1

    # Update state notes
    state = evidence_store.get_or_create_state(session_id)
    state.findings.append(f"Ingested log file '{file.filename}' with {len(items)} records ({anomalies} anomalies).")
    evidence_store.update_state(session_id, state)

    return IngestResponse(
        session_id=session_id,
        total_parsed=len(items),
        anomalies_detected=anomalies,
        services=services,
        severity_breakdown=severities
    )


@router.post("/evidence/raw", response_model=IngestResponse)
async def ingest_raw_evidence(payload: IngestLogRequest):
    items = LogParser.parse_log_content(payload.raw_content, session_id=payload.session_id)
    evidence_store.store_evidence(payload.session_id, items)

    services = list({e.service for e in items})
    severities: Dict[str, int] = {}
    anomalies = 0
    for e in items:
        severities[e.severity] = severities.get(e.severity, 0) + 1
        if e.is_anomaly:
            anomalies += 1

    return IngestResponse(
        session_id=payload.session_id,
        total_parsed=len(items),
        anomalies_detected=anomalies,
        services=services,
        severity_breakdown=severities
    )


@router.get("/evidence", response_model=List[EvidenceItem])
async def list_evidence(
    session_id: str = "default-session",
    query: Optional[str] = None,
    severity: Optional[str] = None,
    service: Optional[str] = None,
    limit: int = 100
):
    return evidence_store.get_evidence(
        session_id=session_id,
        query=query,
        severity=severity,
        service=service,
        limit=limit
    )


@router.get("/evidence/{evidence_id}", response_model=EvidenceItem)
async def get_evidence_detail(evidence_id: str, session_id: str = "default-session"):
    item = evidence_store.get_evidence_by_id(session_id, evidence_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Evidence ID '{evidence_id}' not found.")
    return item


# ==============================================================================
# INVESTIGATION STATE MANAGEMENT (Bidirectional Sync)
# ==============================================================================

@router.get("/investigation/state", response_model=InvestigationState)
async def get_investigation_state(session_id: str = "default-session"):
    return evidence_store.get_or_create_state(session_id)


@router.put("/investigation/state", response_model=InvestigationState)
async def update_investigation_state(
    state_update: InvestigationState,
    session_id: str = "default-session"
):
    """
    Direct user modification of shared investigation state (TEST B).
    Updates state in store so subsequent agent runs receive the new values.
    """
    updated = evidence_store.update_state(session_id, state_update)
    return updated


@router.post("/investigation/remediation/{remediation_id}/decision")
async def record_remediation_decision(
    remediation_id: str,
    decision: str,  # "APPROVED" or "REJECTED"
    session_id: str = "default-session",
    operator: str = "Human Operator"
):
    """
    Human-in-the-loop approval or rejection of a proposed remediation.
    Records decision without executing raw shell commands.
    """
    state = evidence_store.get_or_create_state(session_id)
    decision_upper = decision.upper()
    if decision_upper not in ["APPROVED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Decision must be APPROVED or REJECTED.")

    state.active_remediation_approval = decision_upper
    state.findings.append(
        f"Remediation '{remediation_id}' was {decision_upper} by {operator} at {datetime.now(timezone.utc).strftime('%H:%M:%SZ')}."
    )
    if decision_upper == "APPROVED":
        state.status = "MITIGATED"

    evidence_store.update_state(session_id, state)
    return {
        "status": "recorded",
        "remediation_id": remediation_id,
        "decision": decision_upper,
        "operator": operator,
        "investigation_status": state.status
    }


@router.get("/investigation/postmortem", response_model=PostmortemReport)
async def generate_postmortem_endpoint(session_id: str = "default-session"):
    state = evidence_store.get_or_create_state(session_id)
    items = evidence_store.get_evidence(session_id=session_id, limit=50)

    timeline_points = [
        f"[{e.timestamp}] {e.service} ({e.severity}): {e.message[:70]}"
        for e in items if e.is_anomaly or e.severity in ["WARN", "ERROR", "CRITICAL", "FATAL"]
    ][:8]

    report_md = f"""# Incident Postmortem: {state.incident_title}

**Generated**: {datetime.now(timezone.utc).isoformat()}  
**Severity**: {state.severity} | **Status**: {state.status} | **Affected Service**: {state.affected_service}  
**Session ID**: `{state.session_id}`  

## 1. Executive Summary
During this incident, `{state.affected_service}` suffered an outage characterized by severe operational degradation.
Evidence analysis and automated correlation confirmed anomalies across {len(items)} ingested events.

## 2. Impact Assessment
- Severity Level: `{state.severity}`
- Primary Degraded Service: `{state.affected_service}`
- Root Cause Hypotheses Formed: {len(state.hypotheses)}

## 3. Incident Timeline
{chr(10).join(f"- {p}" for p in timeline_points) if timeline_points else "- Log records collected chronologically."}

## 4. Key Diagnostic Evidence
{chr(10).join(f"- **{e_id}**: Correlated diagnostic event." for e_id in state.selected_evidence_ids) if state.selected_evidence_ids else "- Diagnostic signals verified in log stream."}

## 5. Root Cause Analysis
{chr(10).join(f"- {h}" for h in state.hypotheses) if state.hypotheses else f"- Root cause isolated to {state.affected_service}."}

## 6. Action Items & Remediation
{chr(10).join(f"- {r}" for r in state.proposed_remediations) if state.proposed_remediations else "- Standard automated recovery runbook."}
- Operator Approval State: **{state.active_remediation_approval}**

---
*TraceAnvaya Incident Intelligence Platform — Postmortem Studio*
"""

    return PostmortemReport(
        session_id=session_id,
        incident_title=state.incident_title,
        summary=f"Incident in {state.affected_service} with severity {state.severity}.",
        observed_impact=f"Observed service degradation across {state.affected_service}.",
        timeline_summary=timeline_points,
        root_cause=state.hypotheses[0] if state.hypotheses else "System resource contention",
        evidence_references=state.selected_evidence_ids,
        findings=state.findings,
        remediation_recommendations=state.proposed_remediations,
        preventive_actions=[
            "Tune connection pool timeouts and max connections",
            "Implement circuit breaker tripping thresholds",
            "Set up automated anomaly alerting on error spike ratios"
        ],
        unresolved_questions=["Were downstream dependencies saturated before the error cascade?"],
        markdown_content=report_md,
        generated_at=datetime.now(timezone.utc).isoformat()
    )
