# TraceAnvaya — Architecture & System Design

## 1. System Philosophy

TraceAnvaya is engineered around three foundational tenets:

1. **Deterministic Telemetry First**: LLMs are powerful reasoning engines but unreliable pattern matchers for thousands of raw log lines. We parse timestamps, services, severity levels, and anomalies deterministically before presenting candidate evidence to the model.
2. **Typed Bidirectional Shared State**: Both user actions in the browser and agent tool invocations modify a shared, typed data contract (`InvestigationState`).
3. **Forensic Evidence Grounding**: Every diagnostic finding must reference existing evidence identifiers (`[ev-104]`). Hallucinated error codes or logs are strictly prevented by tool validation.

---

## 2. Component Architecture

### A. Frontend Layer (Next.js 15 App Router + React 19)
- **App Router Layout (`src/app/layout.tsx`)**: Wraps application with `<CopilotKit runtimeUrl="/api/copilotkit" agent="incidentAgent">`.
- **CopilotRuntime Proxy Route (`src/app/api/copilotkit/route.ts`)**: Bridges browser event streams to FastAPI AG-UI endpoint (`http://127.0.0.1:8000/agent`).
- **Interactive Workspace (`src/app/workspace/page.tsx`)**:
  - Center: AI Investigation chat with streaming markdown, tool badges, and clickable evidence citations.
  - Right Tab 1: Investigation Canvas (Live shared state: severity, service, hypotheses, remediations).
  - Right Tab 2: Evidence Explorer (Filtered log viewer with monospace telemetry and detail drawer).
  - Right Tab 3: Chronological Replay (Step scrubber with play/pause and anomaly spotlight).
  - Modal: Postmortem Studio (Markdown preview and export).

### B. Protocol Bridge (AG-UI)
- AG-UI (Agent-User Interaction Protocol) defines the event model between CopilotKit and Pydantic AI:
  - `RUN_STARTED`: Initiates an agent execution pass.
  - `TEXT_DELTA`: Streams partial token outputs to the UI.
  - `TOOL_CALL_START` & `TOOL_CALL_END`: Emits typed tool execution events.
  - `STATE_UPDATE`: Synchronizes modified state back to the UI.

### C. Agentic Backend (FastAPI + Pydantic AI)
- **`investigation_agent` (`app/agents/incident_agent.py`)**:
  - Bound to `StateDeps[InvestigationState]`.
  - Tools: `search_logs`, `get_log_entry`, `summarize_log_patterns`, `update_investigation`, `add_hypothesis`, `propose_remediation`, `generate_postmortem`.
- **`EvidenceStore` (`app/services/evidence_store.py`)**:
  - Manages session-scoped evidence items, scenario pre-loading, and active state cache.
- **`LogParser` (`app/services/log_parser.py`)**:
  - High-performance regex parser with automatic secret redaction, ISO timestamp normalization, and anomaly scoring.
- **Persistence Layer (`app/db/session.py` & `app/models/entities.py`)**:
  - SQLAlchemy async models for sessions, evidence records, hypotheses, and human approval decisions.

---

## 3. Bidirectional State Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Operator (Browser)
    participant CK as Next.js (CopilotKit)
    participant AG as AG-UI Protocol Bridge
    participant PAI as FastAPI (Pydantic AI Agent)
    participant DB as Evidence Store & DB

    %% TEST A: Agent updates state
    Note over User, PAI: TEST A — Agent Updates Shared Canvas
    User->>CK: "Investigate root cause of 500 errors"
    CK->>AG: POST /api/copilotkit (messages, state)
    AG->>PAI: Dispatch AGUIAdapter (StateDeps)
    PAI->>DB: Tool: search_logs(query="timeout")
    DB-->>PAI: Returns ev-105, ev-106
    PAI->>DB: Tool: update_investigation(severity="CRITICAL", status="HYPOTHESIS_FORMED")
    PAI-->>AG: Stream TOOL_CALL, STATE_UPDATE, TEXT_DELTA
    AG-->>CK: SSE Stream Events
    CK-->>User: Canvas immediately updates to CRITICAL; chat shows citations

    %% TEST B: User edits state
    Note over User, PAI: TEST B — User Edits State Manually
    User->>CK: Edits Incident Title & Severity in UI Canvas
    CK->>DB: PUT /api/investigation/state
    DB-->>CK: State stored
    User->>CK: "What is our current risk posture?"
    CK->>AG: POST /api/copilotkit (includes modified state)
    AG->>PAI: Injects updated StateDeps into RunContext
    PAI-->>CK: Agent acknowledges user-edited title and severity
    CK-->>User: Response reflects human operator edits
```
