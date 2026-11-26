# TraceAnvaya Developer Handover Guide

This guide explains how TraceAnvaya is structured and how data flows through the system, written for quick onboarding and technical walkthroughs.

---

## 1. Repository Layout

- `frontend/` — Next.js 15 App Router application (landing page, `/workspace` UI, and `/api/copilotkit` runtime route).
  - `src/app/page.tsx` — Marketing landing page.
  - `src/app/workspace/page.tsx` — Main investigation workspace controller.
  - `src/app/api/copilotkit/route.ts` — CopilotKit `HttpAgent` bridge to the backend `/agent` endpoint.
  - `src/components/chat/` — `ChatPanel`, `MessageItem`, and safe `MarkdownContent` renderer.
  - `src/components/workspace/` — `WorkspaceHeader`, `InvestigationCanvas`, `EvidenceExplorer`, `IncidentReplay`, `PostmortemModal`, and `scenarioData.ts`.
- `backend/` — FastAPI + Pydantic AI service.
  - `app/main.py` — FastAPI app entry point, CORS middleware, `/api` router, and `/agent` mount.
  - `app/api/routes.py` — REST endpoints (`/health`, `/scenarios`, `/evidence`, `/investigation/state`, `/postmortem`) and AG-UI SSE `/agent`.
  - `app/agents/incident_agent.py` — Pydantic AI `Agent` with `StateDeps[InvestigationState]` and 6 forensic tools.
  - `app/services/log_parser.py` — Parses `.log`, `.txt`, `.json` files and redacts secrets (JWTs, API keys, passwords).
  - `app/services/evidence_store.py` — Session-isolated evidence and `InvestigationState` manager.
  - `app/db/session.py` & `migrations/` — Async SQLAlchemy engine and Alembic database migrations.
- `scenarios/` — Pre-loaded synthetic incident logs (`scenario-1`, `scenario-2`, `scenario-3`).
- `docs/` — Architecture, protocol, testing, deployment, and handover guides.

---

## 2. How a Chat Message Reaches the Agent

1. You type a message (or click a suggested prompt) in `ChatPanel.tsx`.
2. `workspace/page.tsx` checks `aiMode` (discovered from `GET /api/health` -> `ai_configured`):
   - **Live AI Mode**: Sends a `POST` request to `/api/agent` with the conversation history and current `canvasState`.
   - **Demo Mode**: If no LLM API key is configured or the backend is offline, runs deterministic scenario-grounded analysis locally so every workflow remains testable.
3. On the backend, `run_agent()` in `app/api/routes.py` validates the payload, merges any client-side `InvestigationState` edits into `evidence_store`, wraps it in `StateDeps(state=current_state)`, and invokes `AGUIAdapter(agent=investigation_agent, ...)`.
4. `AGUIAdapter` streams official AG-UI Server-Sent Events (`TEXT_MESSAGE_CONTENT`, `TOOL_CALL_START`, `STATE_SNAPSHOT`, `STATE_DELTA`) back to the browser.

---

## 3. How Pydantic AI Tools & Shared State Work

In `app/agents/incident_agent.py`, the agent has two categories of tools:
- **Read-only Telemetry Tools**: `search_logs`, `get_log_entry`, `summarize_log_patterns` query `evidence_store` for the current `session_id`.
- **State-Mutating Tools**: `update_investigation`, `add_hypothesis`, `propose_remediation` modify `ctx.deps.state`.

When the user edits **Incident title**, **Severity**, or **Affected service** in the **Overview** panel:
1. The frontend updates local React state immediately and sends `PUT /api/investigation/state?session_id=...`.
2. The next `/api/agent` request passes the updated `state` in the payload, and `@investigation_agent.instructions` injects the latest `InvestigationState` into the model's system context.

---

## 4. Database Persistence (SQLite & PostgreSQL)

- Local development defaults to async SQLite (`sqlite+aiosqlite:///./traceanvaya.db`).
- Production uses PostgreSQL (`postgresql+asyncpg://...`). `Settings.async_database_url` in `config.py` automatically normalizes `postgres://` and `postgresql://` URLs for `asyncpg`.
- Schema changes are managed via Alembic (`alembic upgrade head` in `backend/`).

---

## 5. Running, Stopping & Troubleshooting

### Start Locally
```bash
# Terminal 1 (Backend)
cd backend
.\.venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

### Enable Live Gemini AI
1. Get a key from Google AI Studio.
2. Add `GEMINI_API_KEY=your_key` to `backend/.env`.
3. Restart Uvicorn (`Ctrl+C`, then re-run `uvicorn`). Refresh `/workspace` — the badge switches from **Demo Mode** to **Live AI**.

### Common Issues
- **Workspace shows Demo Mode when backend is running**: `GEMINI_API_KEY` is empty in `backend/.env`, or `NEXT_PUBLIC_API_URL` in `frontend/.env.local` doesn't match the backend port.
- **Port 3000 or 8000 already in use**: Stop the existing Node/Python process before restarting.
- **Alembic import error**: Run `alembic upgrade head` from inside the `backend/` directory so `app` is on `sys.path`.
