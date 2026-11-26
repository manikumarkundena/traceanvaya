# TraceAnvaya — AG-UI Protocol & Event Specification

## 1. Protocol Overview

The **Agent-User Interaction (AG-UI) Protocol** defines a lightweight, streaming event specification over HTTP Server-Sent Events (SSE) that connects AI backend agents with interactive web frontends.

In TraceAnvaya, the protocol connects:
```
Frontend (CopilotKit) ──> Next.js Proxy (/api/copilotkit) ──> FastAPI AGUIAdapter (/agent)
```

---

## 2. Event Types & Payloads

### `RUN_STARTED`
Emitted immediately when an agent run begins.
```json
{
  "type": "RUN_STARTED",
  "run_id": "run-9941a8",
  "timestamp": "2026-11-26T14:15:30.100Z"
}
```

### `TEXT_DELTA`
Streams partial text content as the LLM generates tokens.
```json
{
  "type": "TEXT_DELTA",
  "content": "The HikariCP pool was exhausted due to... "
}
```

### `TOOL_CALL_START`
Notifies the frontend that the agent is invoking a structured backend tool.
```json
{
  "type": "TOOL_CALL_START",
  "tool_call_id": "call-1",
  "tool_name": "search_logs",
  "args": {
    "query": "lease timeout",
    "severity": "ERROR"
  }
}
```

### `TOOL_CALL_END`
Delivers the result of the tool execution back to the agent reasoning context.
```json
{
  "type": "TOOL_CALL_END",
  "tool_call_id": "call-1",
  "result": "Found 2 matching entries: [ev-105], [ev-106]"
}
```

### `STATE_SNAPSHOT` & `STATE_DELTA`
Official AG-UI protocol state events emitted when the agent modifies `ctx.deps.state`:

- **`STATE_SNAPSHOT`**: Emits complete serialized state tree upon run start or full synchronization.
```json
{
  "type": "STATE_SNAPSHOT",
  "state": {
    "session_id": "session-884",
    "incident_title": "Database Connection Pool Exhaustion",
    "severity": "CRITICAL",
    "status": "HYPOTHESIS_FORMED",
    "affected_service": "order-billing-service",
    "selected_evidence_ids": ["ev-104", "ev-105", "ev-106"],
    "findings": [
      "HikariCP connection pool exhausted on order-billing-service."
    ],
    "hypotheses": [
      "HikariPool-1 exhaustion caused by exclusive row lock"
    ],
    "active_remediation_approval": "PENDING"
  }
}
```

- **`STATE_DELTA`**: Emits JSON patch or scoped delta operations for fine-grained differential updates.
```json
{
  "type": "STATE_DELTA",
  "delta": {
    "status": "MITIGATED",
    "active_remediation_approval": "APPROVED"
  }
}
```

### `RUN_FINISHED`
Terminates the SSE stream.
```json
{
  "type": "RUN_FINISHED",
  "run_id": "run-9941a8",
  "usage": {
    "prompt_tokens": 420,
    "completion_tokens": 180
  }
}
```

---

## 3. Pydantic AI Adapter Implementation

In `backend/app/api/routes.py`:
```python
@router.post("/agent")
async def run_agent(request: Request) -> Response:
    accept = request.headers.get("accept", "text/event-stream")
    body = await request.body()
    run_input = AGUIAdapter.build_run_input(body)
    
    current_state = evidence_store.get_or_create_state(session_id)
    state_deps = StateDeps(state=current_state)
    
    adapter = AGUIAdapter(agent=investigation_agent, run_input=run_input, accept=accept)
    event_stream = adapter.run_stream(deps=state_deps)
    return adapter.streaming_response(event_stream)
```
