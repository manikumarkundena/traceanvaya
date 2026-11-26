# TraceAnvaya — Architecture & System Design

## 1. System Philosophy

TraceAnvaya is engineered around three foundational tenets:

1. **Deterministic Telemetry First**: LLMs are powerful reasoning engines but unreliable pattern matchers for thousands of raw log lines. We parse timestamps, services, severity levels, and anomalies deterministically before presenting candidate evidence to the model.
2. **Typed Bidirectional Shared State**: Both user actions in the browser and agent tool invocations modify a shared, typed data contract (`InvestigationState`).
3. **Forensic Evidence Grounding**: Every diagnostic finding must reference existing evidence identifiers (`[ev-104]`). Hallucinated error codes or logs are strictly prevented by tool validation.

---

## 2. Component Architecture

### A. Frontend Layer (Next.js 15 App Router + React 19 + TypeScript Strict)
- **Root Layout (`src/app/layout.tsx`)**: Global metadata and Geist Sans typography font injection (`geist/font/sans` & `geist/font/mono`).
- **Workspace Layout (`src/app/workspace/layout.tsx`)**: Scoped `<CopilotKit runtimeUrl="/api/copilotkit" agent="incidentAgent">` ensuring the public landing page remains clean, fast, and unencumbered by agent polling.
- **CopilotRuntime App Router Endpoint (`src/app/api/copilotkit/route.ts`)**: Implements `copilotRuntimeNextJSAppRouterEndpoint` with `CopilotRuntime` and `@ag-ui/client` `HttpAgent`, answering runtime info queries with 200 OK and routing agent runs directly to FastAPI.
- **Modular Component Architecture (`src/components/`)**:
  - `landing/`: `HeroSection`, `TechStrip`, `FeatureBento`, `WorkflowWalkthrough`, `ArchitectureDiagram`, `ScenarioShowcase`, `LandingFooter`.
  - `workspace/`: `WorkspaceHeader`, `InvestigationCanvas`, `EvidenceExplorer`, `IncidentReplay`, `PostmortemModal`, `types.ts`.
  - `chat/`: `ChatPanel`, `MessageItem`.
  - `navigation/`: `Navbar`.
  - `brand/`: `Logo`.

### B. Protocol Bridge (AG-UI)
- AG-UI (Agent-User Interaction Protocol) defines the official event model between CopilotKit and Pydantic AI:
  - `RUN_STARTED` & `RUN_FINISHED`: Lifecycle boundaries of the agent pass.
  - `TEXT_MESSAGE_CHUNK`: Streams partial token outputs to the UI.
  - `TOOL_CALL_START` & `TOOL_CALL_RESULT`: Emits typed tool execution events.
  - `STATE_SNAPSHOT` & `STATE_DELTA`: Official AG-UI protocol events for synchronizing full state trees and fine-grained differential updates back to the UI.

### C. Agentic Backend (FastAPI + Pydantic AI)
- **`investigation_agent` (`app/agents/incident_agent.py`)**:
  - Bound to `StateDeps[InvestigationState]`.
  - Tools: `search_logs`, `get_log_entry`, `summarize_log_patterns`, `update_investigation`, `add_hypothesis`, `propose_remediation`, `generate_postmortem`.
- **`EvidenceStore` (`app/services/evidence_store.py`)**:
  - Manages session-scoped evidence items, scenario pre-loading, and active state cache.
- **`LogParser` (`app/services/log_parser.py`)**:
  - High-performance regex parser with automatic secret redaction, ISO timestamp normalization, and anomaly scoring.
- **Persistence & Migrations Layer (`app/db/session.py`, `app/models/entities.py`, `migrations/`)**:
  - SQLAlchemy 2.0 async engine and declarative models for sessions, evidence records, hypotheses, remediations, and activity events.
  - Alembic async migration suite (`migrations/versions/`) supporting seamless upgrades across SQLite (`sqlite+aiosqlite`) and PostgreSQL (`postgresql+asyncpg`).

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
