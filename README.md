# TraceAnvaya

**Agentic Incident Investigation & Replay Platform**

TraceAnvaya helps software engineers and SREs investigate simulated software failures by correlating application logs, surfacing evidence-backed findings, replaying incident timelines, and reviewing remediation plans before approval.

---

## Problem & Solution

During production incidents, engineers spend significant time manually grepping across fragmented service logs, piecing together failure sequences, and writing postmortems under pressure. TraceAnvaya pairs a structured **Pydantic AI** investigator with a split-panel **Next.js / CopilotKit** workspace synchronized through the **AG-UI** protocol:

- **Evidence-Grounded Investigation**: Every diagnostic finding and hypothesis cites concrete evidence IDs (`[ev-104]`) linked directly to raw log payloads.
- **Progressive Workspace Flow**: Scenarios initialize with preloaded telemetry and metadata; findings, hypotheses, and remediation proposals populate as the investigator runs or as an operator loads an example walkthrough.
- **Safe Simulation Boundaries**: Remediation approvals are recorded in an audit trail without executing shell commands or mutating live infrastructure.

---

## Core Features

- **Incident Investigator Chat**: Safe Markdown rendering (headings, lists, code blocks, tables) with clickable `[ev-XXX]` citations, suggested prompts, multiline auto-resizing composer, and `.log` / `.txt` / `.json` file upload.
- **Investigation Overview**: Editable incident title, severity, and affected service synchronized with the backend, alongside Findings, Root-cause hypotheses, Supporting evidence, and Remediation review.
- **Evidence Explorer**: Searchable, severity-filterable log viewer with raw payload inspection and correlated event navigation.
- **Incident Timeline**: Chronological playback scrubber (`Play`, `Pause`, `Step Back`, `Step Forward`) to trace how failures unfolded across services.
- **Postmortem Studio**: Generates and exports structured Markdown postmortem reports covering summary, timeline, findings, hypotheses, remediation decisions, and follow-up actions.
- **Pre-loaded Synthetic Scenarios**:
  1. `scenario-1`: Database Connection Pool Exhaustion (`order-billing-service`)
  2. `scenario-2`: Payment Gateway Timeout & Cascade (`checkout-gateway`)
  3. `scenario-3`: Auth Token Refresh Storm (`auth-service`)

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js `15.1.7` (App Router), React `19.0.0`, TypeScript `5.7.3`, Tailwind CSS `3.4.17`, Motion `12.4.7`, Lucide Icons |
| **Typography** | Space Grotesk (display headings), Geist Sans (UI & body), Geist Mono (logs, timestamps, code, evidence IDs) |
| **Agent Integration** | CopilotKit (`@copilotkit/react-core`, `@copilotkit/runtime` `1.90.2`), AG-UI Client (`@ag-ui/client` `1.0.5`) |
| **Backend** | FastAPI, Pydantic AI (`StateDeps[InvestigationState]`, `AGUIAdapter`), Uvicorn |
| **Persistence** | SQLAlchemy (AsyncIO), Alembic migrations, SQLite (dev) / PostgreSQL (prod) |
| **Testing** | Pytest + pytest-asyncio (backend), Playwright (E2E & responsive visual verification) |

---

## Architecture & Shared-State Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                    Next.js 15 Frontend (Port 3000)                 │
│  - CopilotKit Runtime (/api/copilotkit -> HttpAgent)               │
│  - Workspace: Investigator Chat | Overview | Evidence | Timeline   │
└───────────────▲────────────────────────────────────▲───────────────┘
                │ AG-UI SSE Stream (/api/agent)      │ REST Sync
                │ TEXT_MESSAGE_CONTENT               │ PUT /api/investigation/state
                │ TOOL_CALL_START                    │ POST /api/evidence/upload
                │ STATE_SNAPSHOT / STATE_DELTA       │ GET /api/investigation/postmortem
┌───────────────▼────────────────────────────────────▼───────────────┐
│                   FastAPI & Pydantic AI (Port 8000)                │
│  - AGUIAdapter(agent=investigation_agent, deps=StateDeps)          │
│  - LogParser (secret redaction for JWTs, API keys, passwords)      │
│  - EvidenceStore & Async SQLAlchemy / Alembic Persistence          │
└────────────────────────────────────────────────────────────────────┘
```

### How Shared State Synchronization Works
1. **UI → Agent**: When an operator edits the incident title, severity, or affected service in the Overview panel, the frontend persists the update via `PUT /api/investigation/state?session_id=...` and includes the latest `InvestigationState` in subsequent `/api/agent` requests. `AGUIAdapter` injects this state into `StateDeps[InvestigationState]`, so `@investigation_agent.instructions` exposes user edits on the next agent turn.
2. **Agent → UI**: Agent tools (`update_investigation`, `add_hypothesis`, `propose_remediation`) mutate `ctx.deps.state` and emit AG-UI `STATE_SNAPSHOT` / `STATE_DELTA` events over SSE, updating the frontend Overview panel.

### Agent Tools
- `search_logs(query, severity, service, limit)`: Queries ingested telemetry in the active session.
- `get_log_entry(evidence_id)`: Retrieves full structured metadata and raw log payload for an evidence ID.
- `summarize_log_patterns()`: Aggregates log volume, severity distribution, and anomaly IDs.
- `update_investigation(incident_title, severity, status, affected_service, finding, selected_evidence_ids)`: Updates shared investigation state.
- `add_hypothesis(hypothesis, evidence_ids)`: Records a root-cause hypothesis linked to evidence IDs.
- `propose_remediation(title, risk_level, steps)`: Queues a remediation plan for operator review (`PENDING`).

---

## Local Installation & Setup

### Prerequisites
- Node.js 20+ & npm
- Python 3.12+ (tested on 3.15)
- Git

### 1. Environment Configuration
```bash
git clone <repository_url>
cd TraceAnvaya
cp .env.example .env
```

### 2. Backend Setup & Migrations
```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/workspace](http://localhost:3000/workspace) for the investigation workspace.

---

## Live AI Mode vs. Deterministic Demo Mode

- **Live AI Mode**: Set `GEMINI_API_KEY` (or `OPENAI_API_KEY`) and `AI_PROVIDER=gemini` in `.env` and restart the FastAPI backend. The workspace detects `ai_configured: true` from `/api/health`, displays **Live AI**, and streams responses from the Pydantic AI agent over `/api/agent` SSE.
- **Deterministic Demo Mode**: When no external LLM API key is configured (or when running the frontend standalone without the backend), the workspace clearly displays **Demo Mode**. Suggested prompts and queries execute deterministic, scenario-grounded analysis so every feature—evidence citations, progressive state updates, timeline replay, remediation review, and postmortem export—remains testable without external API credentials.

---

## Testing & Verification

### Backend Tests (Pytest)
```bash
cd backend
.\.venv\Scripts\pytest -v
```
Covers log parsing, secret redaction, session isolation, Pydantic AI tools (`TestModel`), human-gated remediation workflow, database persistence, and AG-UI event validation (`15 passed`).

### Frontend Checks & E2E Tests (Playwright)
```bash
cd frontend
npx tsc --noEmit
npm run lint
npm run build
npx playwright test tests/workspace.spec.ts tests/stage31-motion.spec.ts
```

---

## Safety Boundaries & Known Limitations

- **Synthetic Environment**: TraceAnvaya is an educational and diagnostic simulation platform. Approving a remediation plan records an operator decision in the audit log (`Simulated Mitigation`) and never executes shell commands or modifies live infrastructure.
- **In-Memory Session Store**: Active session evidence and state are stored in `EvidenceStore` for fast AG-UI state synchronization alongside SQLAlchemy/Alembic relational models.
- **Live LLM Dependency**: Real natural-language reasoning beyond the built-in deterministic demo scenarios requires a valid `GEMINI_API_KEY` or `OPENAI_API_KEY`.

---

## Documentation

- [Deployment Guide](docs/DEPLOYMENT.md) — Vercel, Render/Railway, Neon PostgreSQL, and Docker Compose setup.
- [Developer Handover Guide](docs/DEVELOPER_GUIDE.md) — Beginner-friendly walkthrough of folders, AG-UI data flow, and troubleshooting.
- [Architecture Blueprint](docs/ARCHITECTURE.md)
- [AG-UI Protocol Specification](docs/AGENT_PROTOCOL.md)

