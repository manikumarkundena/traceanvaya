# TraceAnvaya

**Agentic Incident Investigation & Replay Platform**

TraceAnvaya is a full-stack AI incident investigation workspace built with **Next.js 15**, **CopilotKit**, **AG-UI**, and **Pydantic AI**. It helps software engineers and SREs investigate simulated software failures by correlating application logs, surfacing evidence-backed findings, replaying incident timelines, and reviewing remediation plans before approval.

![TraceAnvaya Landing Page](screenshots/final/landing-1440x900-viewport.png)

---

## Core Capabilities

- **Incident Investigator Chat**: Streams responses over AG-UI SSE with safe Markdown rendering, clickable `[ev-XXX]` citations, suggested prompts, and `.log` / `.txt` / `.json` log upload (up to 10 MB with automatic secret redaction).
- **Bidirectional Shared State (`Overview`)**: Editable incident title, severity, and affected service synchronized with the backend, alongside Findings, Root-cause hypotheses, Supporting evidence, and Remediation review.
- **Evidence Explorer**: Searchable, severity-filterable log viewer with raw payload inspection and correlated event navigation.
- **Incident Replay**: Chronological playback scrubber (`Play`, `Pause`, `Step Back`, `Step Forward`) to trace how failures unfolded across services.
- **Postmortem Studio**: Generates and exports structured Markdown postmortem reports covering summary, timeline, findings, hypotheses, remediation decisions, and follow-up actions.
- **Pre-loaded Synthetic Scenarios**:
  1. `scenario-1`: Database Connection Pool Exhaustion (`order-billing-service`)
  2. `scenario-2`: Payment Gateway Timeout & Cascade (`checkout-gateway`)
  3. `scenario-3`: Auth Token Refresh Storm (`auth-service`)

| Live Investigation & Tool Calling | Bidirectional State Sync & Remediation | Postmortem Studio |
| :---: | :---: | :---: |
| ![Live Investigation](screenshots/live-verification/live-1-investigation.png) | ![State Sync](screenshots/live-verification/live-2-state-sync-and-remediation.png) | ![Postmortem Studio](screenshots/live-verification/live-3-postmortem.png) |

---

## Architecture & Shared-State Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                    Next.js 15 Frontend (Vercel)                    │
│  - CopilotKit Runtime (/api/copilotkit -> HttpAgent)               │
│  - Workspace: Investigator Chat | Overview | Evidence | Timeline   │
└───────────────▲────────────────────────────────────▲───────────────┘
                │ AG-UI SSE Stream (/agent)          │ REST Sync
                │ TEXT_MESSAGE_CONTENT               │ PUT /api/investigation/state
                │ TOOL_CALL_START / TOOL_CALL_RESULT │ POST /api/evidence/upload
                │ STATE_SNAPSHOT                     │ GET /api/investigation/postmortem
┌───────────────▼────────────────────────────────────▼───────────────┐
│               FastAPI & Pydantic AI Backend (Render)               │
│  - AGUIAdapter(agent=investigation_agent, deps=StateDeps)          │
│  - Gemini 3.5 Flash-Lite (GoogleModel / GoogleProvider)            │
│  - LogParser (secret redaction for JWTs, API keys, passwords)      │
│  - EvidenceStore & Async SQLAlchemy / Alembic (Neon PostgreSQL)    │
└────────────────────────────────────────────────────────────────────┘
```

### CopilotKit, AG-UI & Pydantic AI Integration
1. **CopilotKit Runtime (`/api/copilotkit`)**: `frontend/src/app/api/copilotkit/route.ts` mounts `CopilotRuntime` with an `@ag-ui/client` `HttpAgent` pointing to the FastAPI `/agent` endpoint (`BACKEND_AGENT_URL` or `${NEXT_PUBLIC_API_URL}/agent`).
2. **UI → Agent State Sync**: When an operator edits the incident title, severity, or affected service in the Overview panel, the frontend persists the update via `PUT /api/investigation/state?session_id=...` and sends the latest `InvestigationState` in subsequent CopilotKit `agent/run` requests. `AGUIAdapter` injects this state into `StateDeps[InvestigationState]`, and `@investigation_agent.instructions` exposes user edits on the next agent turn.
3. **Agent → UI State Sync**: Agent tools (`search_logs`, `get_log_entry`, `summarize_log_patterns`, `update_investigation`, `add_hypothesis`, `propose_remediation`) mutate `ctx.deps.state`. The backend wraps `AGUIAdapter.run_stream()` to persist state and emit an AG-UI `STATE_SNAPSHOT` event before `RUN_FINISHED`, updating the Overview panel in real time.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js `15.1.7` (App Router), React `19.0.0`, TypeScript `5.7.3`, Tailwind CSS `3.4.17`, Motion `12.4.7` |
| **Typography** | Space Grotesk (display headings), Geist Sans (UI & body), Geist Mono (logs, timestamps, evidence IDs) |
| **Agent Protocol** | CopilotKit (`@copilotkit/react-core`, `@copilotkit/runtime` `1.90.2`), AG-UI (`@ag-ui/client` `1.0.5`, `ag-ui-protocol`) |
| **Backend** | FastAPI, Pydantic AI (`StateDeps[InvestigationState]`, `AGUIAdapter`), Google Gemini (`gemini-3.5-flash-lite`), Uvicorn |
| **Persistence** | SQLAlchemy (AsyncIO), Alembic migrations, SQLite (`aiosqlite` dev) / Neon PostgreSQL (`asyncpg` prod) |
| **Testing** | Pytest + `pytest-asyncio` (backend), Playwright (E2E, live AI, & responsive visual verification) |

---

## Local Setup

### Prerequisites
- **Node.js**: 20+ & npm
- **Python**: 3.12+
- **Git**

### 1. Environment Configuration
```bash
git clone <repository_url>
cd TraceAnvaya
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```
Set `GEMINI_API_KEY` in `.env` for **Live AI Mode**, or leave it blank to run in **Demo Mode**.

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

## Environment Variables

| Scope | Variable | Secret | Required | Format / Example |
| :--- | :--- | :---: | :---: | :--- |
| **Backend** | `ENVIRONMENT` | No | Yes | `development` or `production` |
| **Backend** | `DATABASE_URL` | Yes (prod) | Yes | `sqlite+aiosqlite:///./traceanvaya.db` or `postgresql+asyncpg://...` |
| **Backend** | `CORS_ORIGINS` | No | Yes | `http://localhost:3000` or `https://your-app.vercel.app` |
| **Backend** | `AI_PROVIDER` | No | Yes | `gemini` (or `openai`) |
| **Backend** | `AI_MODEL` | No | Yes | `gemini-3.5-flash-lite` |
| **Backend** | `GEMINI_API_KEY` | Yes | Optional | Google AI Studio key (omit for Demo Mode) |
| **Backend** | `RATE_LIMIT_PER_MINUTE` | No | No | `30` (per-IP `/agent` requests per minute) |
| **Frontend** | `NEXT_PUBLIC_API_URL` | No | Yes | `http://127.0.0.1:8000` or `https://traceanvaya-api.onrender.com` |
| **Frontend** | `BACKEND_AGENT_URL` | No | Yes | `http://127.0.0.1:8000/agent` or `https://traceanvaya-api.onrender.com/agent` |

Never expose `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `DATABASE_URL` in `NEXT_PUBLIC_*` variables.

---

## Live AI Mode vs. Deterministic Demo Mode

- **Live AI Mode**: When `GEMINI_API_KEY` is configured on the backend, `/api/health` returns `ai_configured: true`. The workspace displays **Live AI**, routes chat turns through `/api/copilotkit` → FastAPI `/agent`, and surfaces explicit provider errors (e.g., 429 quota or 503 availability) without silently falling back to fake responses.
- **Deterministic Demo Mode**: When no LLM API key is configured (or when running the frontend standalone), the workspace displays **Demo Mode** and runs deterministic, scenario-grounded analysis so every feature remains testable without external API credentials.

---

## Testing & Verification

### Backend Tests (Pytest)
```bash
cd backend
.\.venv\Scripts\pytest -v
```
Covers log parsing, secret redaction, session isolation, Pydantic AI tools (`TestModel`), human-gated remediation workflow, database persistence, and AG-UI event validation (`15 passed`).

### Frontend Checks & Playwright E2E
```bash
cd frontend
npx tsc --noEmit
npm run lint
npm run build
npx playwright test tests/workspace.spec.ts tests/stage31-motion.spec.ts --workers=1
```
To include the live Gemini + CopilotKit E2E test (requires `GEMINI_API_KEY` and running backend/frontend servers):
```bash
npx playwright test tests/live-ai.spec.ts
```

---

## Production Deployment

TraceAnvaya is pre-configured for **Vercel** (frontend), **Render** (backend via [render.yaml](render.yaml)), and **Neon** (managed PostgreSQL). See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step instructions.

---

## Safety Boundaries & Known Limitations

- **Simulated Remediation Only**: Approving a remediation plan records an operator decision in the audit trail (`APPROVED` / `REJECTED`) and never executes shell commands or modifies live infrastructure.
- **Public Demo Session Scoping**: Without user authentication, scenarios map to deterministic session IDs (`session-scenario-1`, etc.) in the backend's in-memory `EvidenceStore`. Concurrent public visitors inspecting the same scenario share that scenario's in-memory session state until reset.
- **In-Memory Rate Limiter**: `/api/agent` enforces a per-IP sliding-window limit (`RATE_LIMIT_PER_MINUTE`, default `30` req/min) and `128 KB` body cap in memory; `/api/evidence/upload` enforces a `10 MB` cap and `.log`/`.txt`/`.json`/`.jsonl` extension allowlist. Multi-worker deployments should place rate limiting at the API gateway or Redis layer.
- **Free-Tier LLM Quotas**: Public live inference depends on the configured Gemini API tier and may return transient `429` or `503` provider responses under high load.

---

## Documentation

- [Deployment Guide](docs/DEPLOYMENT.md) — Vercel, Render, Neon PostgreSQL, and Docker Compose setup.
- [Developer Handover Guide](docs/DEVELOPER_GUIDE.md) — Folder structure, AG-UI data flow, and troubleshooting.
- [Architecture Blueprint](docs/ARCHITECTURE.md)
- [AG-UI Protocol Specification](docs/AGENT_PROTOCOL.md)
- [Design Decisions](docs/DESIGN_DECISIONS.md)
