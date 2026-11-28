<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&amp;color=0:071B24,45:0F766E,100:4338CA&amp;height=190&amp;section=header&amp;text=TraceAnvaya&amp;fontSize=56&amp;fontColor=FFFFFF&amp;animation=fadeIn&amp;fontAlignY=40&amp;desc=Trace%20the%20failure.%20Connect%20the%20evidence.&amp;descSize=17&amp;descAlignY=67" alt="TraceAnvaya — Trace the failure. Connect the evidence." width="100%" />

# TraceAnvaya

### Agentic Incident Investigation & Replay Platform

**From scattered logs to a connected investigation.**

![Next.js](https://img.shields.io/badge/Next.js-15-111827?logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?logo=typescript&logoColor=white)
![Pydantic AI](https://img.shields.io/badge/Pydantic_AI-Agent-9333EA)
![AG--UI](https://img.shields.io/badge/AG--UI-Streaming-2563EB)
![CopilotKit](https://img.shields.io/badge/CopilotKit-Runtime-0D9488)
[![CI](https://github.com/manikumarkundena/traceanvaya/actions/workflows/ci.yml/badge.svg)](https://github.com/manikumarkundena/traceanvaya/actions/workflows/ci.yml)

[![Live application](https://img.shields.io/badge/EXPLORE-Live_Application-0F766E?style=for-the-badge&logo=vercel&logoColor=white)](https://traceanvaya.vercel.app)
[![Workspace](https://img.shields.io/badge/OPEN-Investigation_Workspace-4338CA?style=for-the-badge)](https://traceanvaya.vercel.app/workspace)

**[Product tour](#product-tour) · [Architecture](#architecture--shared-state-flow) · [Local setup](#local-setup) · [Documentation](#documentation)**

</div>

- **Live App (Vercel)**: [https://traceanvaya.vercel.app](https://traceanvaya.vercel.app) ([Open Workspace](https://traceanvaya.vercel.app/workspace))
- **Live Backend API (Render)**: [https://traceanvaya.onrender.com](https://traceanvaya.onrender.com) ([Health Check](https://traceanvaya.onrender.com/api/health))

TraceAnvaya is a full-stack AI incident investigation workspace built with **Next.js 15**, **CopilotKit**, **AG-UI**, and **Pydantic AI**. It helps software engineers and SREs investigate software failures by correlating application logs, surfacing evidence-backed findings, replaying incident timelines, and reviewing remediation plans before approval.

<p align="center">
  <img src="screenshots/final/landing-1440x900-viewport.png" alt="TraceAnvaya landing page" width="100%" />
</p>

## Why TraceAnvaya?

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:071B24,100:0F766E&amp;height=66&amp;text=01%20%2F%20The%20Vision&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="01 / The Vision" width="100%" />

When a failure spans multiple services, the evidence is often scattered across logs, timestamps and error messages. TraceAnvaya brings those pieces into one interactive workspace, where an agent can retrieve evidence, maintain investigation context and propose next steps while the engineer remains in control.

| Investigation challenge | TraceAnvaya approach |
| --- | --- |
| Scattered logs across services | Source-labelled evidence and trace correlation |
| Unstructured AI answers | Evidence citations, findings and hypotheses |
| Lost investigation context | Bidirectional shared state |
| Unclear sequence of failures | Chronological incident replay |
| Risky automated fixes | Human-reviewed, simulated remediation |
| Manual incident documentation | Exportable Markdown postmortem |

> **Design principle:** AI assists the investigation; the engineer owns the decision.

<div align="center">

| **8** | **3** | **26** |
| :---: | :---: | :---: |
| Registered agent tools | Synthetic incident scenarios | Backend tests reported passing at submission |

</div>

---

## How it works

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:0F766E,100:0369A1&amp;height=66&amp;text=02%20%2F%20Investigation%20Workflow&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="02 / Investigation Workflow" width="100%" />

```mermaid
flowchart TD
    A["01 · Choose scenario or upload logs"] --> B["02 · Parse and redact"]
    B --> C["03 · Search and correlate evidence"]
    C --> D["04 · Review findings and hypotheses"]
    D --> E["05 · Replay incident timeline"]
    E --> F["06 · Review proposed remediation"]
    F --> G["07 · Export postmortem"]
    classDef input fill:#0f766e,stroke:#2dd4bf,color:#ffffff
    classDef analysis fill:#1d4ed8,stroke:#60a5fa,color:#ffffff
    classDef review fill:#6d28d9,stroke:#a78bfa,color:#ffffff
    class A,B input
    class C,D,E analysis
    class F,G review
```

**Try it in two minutes:** open the workspace, load Database Connection Pool Exhaustion, ask "What caused this incident? Cite the relevant evidence", inspect the citations and timeline, then review a proposed remediation and export a postmortem. On the hosted free tier, allow time for the backend to wake up.

## Product tour

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:0369A1,100:4338CA&amp;height=66&amp;text=03%20%2F%20Product%20Experience&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="03 / Product Experience" width="100%" />

### Core capabilities

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

### Workspace in action

<p align="center">
  <img src="screenshots/final/workspace-active-investigation.png" alt="Active investigation with chat and shared-state canvas" width="100%" />
</p>

*The investigation workspace combines conversational analysis with structured evidence, hypotheses and operator decisions.*

| Evidence explorer | Incident replay |
| :---: | :---: |
| ![Evidence explorer](screenshots/final/workspace-evidence-explorer.png) | ![Incident replay](screenshots/final/workspace-replay-timeline.png) |

| Remediation review | Postmortem studio |
| :---: | :---: |
| ![Remediation review](screenshots/final/workspace-remediation-review.png) | ![Postmortem studio](screenshots/final/workspace-postmortem-studio.png) |

---

## Architecture & Shared-State Flow

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:4338CA,100:7C3AED&amp;height=66&amp;text=04%20%2F%20System%20Architecture&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="04 / System Architecture" width="100%" />

The architecture separates the presentation layer, agent transport, investigation logic and data handling. CopilotKit connects the React workspace to Pydantic AI through AG-UI; REST endpoints complement the stream for explicit user actions.

```mermaid
flowchart TD
    U["Engineer / SRE"] <--> W["Next.js workspace · Vercel"]
    W -->|"agent/run + current state"| C["CopilotKit Runtime · HttpAgent"]
    C -->|"AG-UI request"| A["FastAPI · AGUIAdapter · Render"]
    A -->|"SSE: text, tool events, state snapshot"| C
    C -->|"Streamed events"| W
    W <-->|"REST: sessions, evidence, state, decisions"| R["FastAPI REST routes"]
    A <--> P["Pydantic AI · StateDeps"]
    P <--> L["Gemini · optional OpenAI / Ollama"]
    P <--> E["Typed investigation tools"]
    E <--> S["In-memory EvidenceStore + investigation state"]
    R <--> S
    R --> F["Log parser · redaction"]
    F --> S
    R -.-> D["SQLAlchemy / Alembic · relational DB layer"]
    classDef ui fill:#0f766e,stroke:#2dd4bf,color:#ffffff
    classDef protocol fill:#1d4ed8,stroke:#60a5fa,color:#ffffff
    classDef agent fill:#6d28d9,stroke:#a78bfa,color:#ffffff
    classDef data fill:#92400e,stroke:#fbbf24,color:#ffffff
    class U,W ui
    class C,A,R protocol
    class P,L,E agent
    class S,F,D data
```

The live workspace uses in-memory session state; the relational database layer is not a durable store for all active investigations.

### CopilotKit, AG-UI & Pydantic AI Integration
1. **CopilotKit Runtime (`/api/copilotkit`)**: `frontend/src/app/api/copilotkit/route.ts` mounts `CopilotRuntime` with an `@ag-ui/client` `HttpAgent` pointing to the FastAPI `/agent` endpoint (`BACKEND_AGENT_URL` or `${NEXT_PUBLIC_API_URL}/agent`).
2. **UI → Agent State Sync**: When an operator edits the incident title, severity, or affected service in the Overview panel, the frontend persists the update via `PUT /api/investigation/state?session_id=...` and sends the latest `InvestigationState` in subsequent CopilotKit `agent/run` requests. `AGUIAdapter` injects this state into `StateDeps[InvestigationState]`, and `@investigation_agent.instructions` exposes user edits on the next agent turn.
3. **Agent → UI State Sync**: Agent tools can retrieve evidence and update `ctx.deps.state`. The backend wraps `AGUIAdapter.run_stream()` to persist state and emit an AG-UI `STATE_SNAPSHOT` event before `RUN_FINISHED`, updating the Overview panel in real time.

### Message and shared-state lifecycle

```mermaid
sequenceDiagram
    actor User
    participant UI as React workspace
    participant CK as CopilotKit Runtime
    participant API as FastAPI / AGUIAdapter
    participant AI as Pydantic AI
    User->>UI: Send investigation question
    UI->>CK: agent/run with messages and state
    CK->>API: AG-UI run request
    API->>AI: Run agent with StateDeps
    AI-->>API: Text and tool events
    API-->>CK: SSE stream
    CK-->>UI: Text and tool events
    API-->>CK: STATE_SNAPSHOT before RUN_FINISHED
    CK-->>UI: Updated investigation state
    User->>UI: Edit incident metadata
    UI->>API: PUT investigation/state
    API-->>UI: Synchronized state
    Note over UI,AI: Next agent run includes the latest state
```

### Eight registered agent tools

| Tool | Responsibility |
| --- | --- |
| `search_logs` | Find relevant log evidence |
| `get_log_entry` | Inspect a specific evidence record |
| `summarize_log_patterns` | Summarize patterns across logs |
| `correlate_services` | Connect evidence across service sources |
| `update_investigation` | Update structured investigation information |
| `add_hypothesis` | Record a root-cause hypothesis |
| `propose_remediation` | Propose a plan for human review |
| `generate_postmortem` | Generate a structured incident summary |

### Codebase map

| Area | Source |
| --- | --- |
| Workspace orchestration | [workspace/page.tsx](frontend/src/app/workspace/page.tsx) |
| Chat and Markdown UI | [components/chat](frontend/src/components/chat) |
| Evidence, replay and review UI | [components/workspace](frontend/src/components/workspace) |
| CopilotKit bridge | [route.ts](frontend/src/app/api/copilotkit/route.ts) |
| API and SSE lifecycle | [routes.py](backend/app/api/routes.py) |
| Agent and tools | [incident_agent.py](backend/app/agents/incident_agent.py) |
| Provider selection | [provider_factory.py](backend/app/agents/provider_factory.py) |
| State schema | [incident.py](backend/app/schemas/incident.py) |
| Parsing and evidence storage | [services](backend/app/services) |
| Tests and automation | [backend/tests](backend/tests), [frontend/tests](frontend/tests), [CI](.github/workflows/ci.yml) |

---

## Technology Stack

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:312E81,100:0F766E&amp;height=66&amp;text=05%20%2F%20Technology%20Stack&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="05 / Technology Stack" width="100%" />

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

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:0F766E,100:047857&amp;height=66&amp;text=06%20%2F%20Getting%20Started&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="06 / Getting Started" width="100%" />

### Prerequisites
- **Node.js**: 20+ & npm
- **Python**: 3.12+
- **Git**

### 1. Environment Configuration
```bash
git clone https://github.com/manikumarkundena/traceanvaya.git
cd traceanvaya
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
In a separate terminal, from the repository root:
```bash
cd frontend
npm ci
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/workspace](http://localhost:3000/workspace) for the investigation workspace.

---

## Environment Variables

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:134E4A,100:0369A1&amp;height=66&amp;text=07%20%2F%20Configuration&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="07 / Configuration" width="100%" />

| Scope | Variable | Secret | Required | Format / Example |
| :--- | :--- | :---: | :---: | :--- |
| **Backend** | `ENVIRONMENT` | No | Yes | `development` or `production` |
| **Backend** | `SESSION_SECRET` | Yes | Prod | >= 32-char HMAC key (`generateValue: true` in `render.yaml`) |
| **Backend** | `DATABASE_URL` | Yes (prod) | Yes | `sqlite+aiosqlite:///./traceanvaya.db` or `postgresql://...` |
| **Backend** | `CORS_ORIGINS` | No | Yes | `http://localhost:3000` or `https://your-app.vercel.app` |
| **Backend** | `AI_PROVIDER` | No | Yes | `gemini` (or `openai`) |
| **Backend** | `AI_MODEL` | No | Yes | `gemini-3.5-flash-lite` |
| **Backend** | `GEMINI_API_KEY` | Yes | Optional | Google AI Studio key (omit for Demo Mode) |
| **Backend** | `RATE_LIMIT_PER_MINUTE` | No | No | `30` (per-IP `/agent` requests/min) |
| **Backend** | `SESSION_AI_LIMIT_PER_HOUR` | No | No | `40` (per-session hourly AI runs) |
| **Backend** | `MAX_CONCURRENT_AI_PER_SESSION` | No | No | `2` (concurrent AI runs per session) |
| **Backend** | `GLOBAL_AI_LIMIT_PER_HOUR` | No | No | `500` (global hourly AI safeguard) |
| **Backend** | `SESSION_TTL_SECONDS` | No | No | `86400` (24h in-memory session TTL) |
| **Backend** | `TRUST_PROXY_HEADERS` | No | No | `true` (trust `X-Forwarded-For` behind Render/Vercel) |
| **Backend** | `MAX_AGENT_BODY_BYTES` | No | No | `131072` (128 KB `/agent` body limit) |
| **Backend** | `MAX_RAW_EVIDENCE_BYTES` | No | No | `2097152` (2 MB `/api/evidence/raw` body limit) |
| **Backend** | `MAX_UPLOAD_BYTES` | No | No | `10485760` (10 MB `/api/evidence/upload` file limit) |
| **Frontend** | `NEXT_PUBLIC_API_URL` | No | Yes | `http://127.0.0.1:8000` or `https://traceanvaya.onrender.com` |
| **Frontend** | `BACKEND_AGENT_URL` | No | Yes | `http://127.0.0.1:8000/agent` or `https://traceanvaya.onrender.com/agent` |

Never expose `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `DATABASE_URL` in `NEXT_PUBLIC_*` variables.

---

## Live AI, Optional Providers & Deterministic Demo Mode

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:4338CA,100:7C3AED&amp;height=66&amp;text=08%20%2F%20AI%20Providers&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="08 / AI Providers" width="100%" />

TraceAnvaya supports three server-configured model providers and a deterministic demo mode (credentials and base URLs are never exposed to the browser):

1. **Google Gemini (Default Hosted Provider — Live-Verified)**:
   Set `AI_PROVIDER=gemini`, `AI_MODEL=gemini-3.5-flash-lite`, and `GEMINI_API_KEY` in `.env`. Live tool calling, AG-UI streaming, and bidirectional state sync have been verified end-to-end against Gemini.
2. **OpenAI (Optional — Not Live-Verified)**:
   Set `AI_PROVIDER=openai`, `OPENAI_API_KEY`, and a tool-capable `OPENAI_MODEL` (e.g. `gpt-4o-mini`). Implemented via Pydantic AI and covered by unit tests, but **not live-verified** against OpenAI's API.
3. **Local Ollama (Optional, Local-Only — Not Live-Verified)**:
   Install Ollama locally, pull a tool-capable model (`ollama pull llama3.1:8b`), start `ollama serve`, and set `AI_PROVIDER=ollama`, `OLLAMA_ENABLED=true`, `OLLAMA_BASE_URL=http://localhost:11434`, and `OLLAMA_MODEL=llama3.1:8b`. Implemented via Pydantic AI and covered by unit tests, but **not live-verified** against a live Ollama instance.
   - *Docker*: When the backend runs inside Docker and Ollama runs on the host, set `OLLAMA_BASE_URL=http://host.docker.internal:11434`.
   - *Remote Hosting*: A remotely hosted backend (Render) cannot access Ollama on a user's `localhost`.
4. **Deterministic Demo Mode**:
   When no LLM credentials are configured, the workspace displays **Demo Mode** and runs deterministic scenario analysis without external API calls. Failed live requests never fall back silently to fake responses.

---

## Investigating Your Own Logs

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:0369A1,100:0F766E&amp;height=66&amp;text=09%20%2F%20Custom%20Investigations&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="09 / Custom Investigations" width="100%" />

Click **New Investigation** in the workspace (or open `/workspace?new=1`) to create a genuinely empty custom investigation with zero preloaded demo logs:

- **Supported Formats**: `.log`, `.txt`, `.json`, `.jsonl` (up to `10 MB` upload / `2 MB` paste).
- **Multi-Service Labeling**: Tag each source (`Frontend`, `Backend`, `Database`, `API gateway`, `Authentication service`, `Infrastructure`, or a custom service name).
- **Correlation**: `LogParser` extracts ISO timestamps, severity, `trace_id`/`request_id`, and correlates anomalies across services without inventing missing timestamps.
- **Privacy & Redaction**: Before submitting, inspect the sanitized preview (`[REDACTED_JWT]`, `[REDACTED_API_KEY]`, `[REDACTED_PASSWORD]`, `[REDACTED_DB_PASS]`). Automatic redaction does not guarantee removal of every secret format.
- **Scope**: TraceAnvaya is an interactive incident investigation workspace—it is not an automatic website scanner, browser extension, or continuous monitoring agent.

---

## Engineering highlights

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:0F766E,100:4338CA&amp;height=66&amp;text=10%20%2F%20Engineering%20Decisions&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="10 / Engineering Decisions" width="100%" />

| Decision | Rationale |
| --- | --- |
| Typed Pydantic AI tools | Explicit tool inputs and structured investigation state |
| SSE with AG-UI events | Incremental text, tool activity and state synchronization |
| Hybrid REST + agent state | Explicit user edits and evidence operations alongside agent updates |
| Bounded Markdown parsing and batched rendering | Avoid unbounded parsing and excessive updates during streaming |
| Signed anonymous sessions | Isolate visitor investigations without requiring account creation |
| Provider abstraction | Separate model configuration from investigation logic |

## Testing & Verification

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:065F46,100:0E7490&amp;height=66&amp;text=11%20%2F%20Quality%20and%20Testing&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="11 / Quality and Testing" width="100%" />

### Backend Tests (Pytest)
```bash
cd backend
.\.venv\Scripts\pytest -v
```
Covers log parsing, secret redaction, anonymous session isolation, body/upload size limits, rate/quota guards, Pydantic AI tools (`TestModel`), human-gated remediation workflow, database persistence, and AG-UI event validation (`26 passed`).

### Frontend Checks & Playwright E2E
```bash
cd frontend
npx tsc --noEmit
npm run lint
npm run build
npx playwright test tests/workspace.spec.ts tests/stage31-motion.spec.ts tests/security-and-polish.spec.ts --workers=1
```
To include the live Gemini + CopilotKit E2E test (requires `GEMINI_API_KEY` and running backend/frontend servers):
```bash
npx playwright test tests/live-ai.spec.ts
```

---

## Production Deployment

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:1E3A8A,100:4338CA&amp;height=66&amp;text=12%20%2F%20Deployment&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="12 / Deployment" width="100%" />

TraceAnvaya is pre-configured for **Vercel** (frontend), **Render** (backend via [render.yaml](render.yaml)), and **Neon** (managed PostgreSQL). See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step instructions.

---

## Safety Boundaries & Known Limitations

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:78350F,100:92400E&amp;height=66&amp;text=13%20%2F%20Safety%20and%20Boundaries&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="13 / Safety and Boundaries" width="100%" />

- **Simulated Remediation Only**: Approving or rejecting a remediation plan records an operator decision in the audit trail (`APPROVED` / `REJECTED`) and never executes shell commands or modifies live infrastructure.
- **Hosting Cold Starts (Render Free Tier)**: The hosted backend on Render spins down after periods of inactivity; the first request after idle time may take 30–50+ seconds while the container wakes up.
- **Free-Tier AI Rate Limits**: Live Gemini inference depends on the configured API tier and may return transient `429` (`Quota / Rate Limit Exceeded`) or `503` responses under burst traffic.
- **Anonymous Session Isolation & Persistence Boundary**: Each visitor initializes an isolated session (`POST /api/sessions/init`) backed by an HMAC-SHA256 signed token (`traceanvaya_sid` `HttpOnly` cookie + `X-TraceAnvaya-Session` header). Production startup (`ENVIRONMENT=production`) requires `SESSION_SECRET` (>= 32 chars). PostgreSQL (Neon + Alembic `2b17c4fcd53d_initial_schema.py`) stores the relational schema, while active workspace sessions, `EvidenceStore`, AG-UI `StateDeps` snapshots, and rate/quota counters are stored in-memory (`24h` TTL) and reset on backend restarts or `SESSION_SECRET` rotation (the frontend recovers automatically by initializing a fresh session).
- **Single-Process Rate & Quota Guards**: `/api/agent` enforces per-IP RPM (`30`), per-session hourly (`40`) and concurrency (`2`) limits, a global hourly safeguard (`500`), and a `128 KB` streaming body limit; `/api/evidence/raw` enforces `2 MB` and `/api/evidence/upload` enforces `10 MB`. Multi-worker deployments should place shared rate limiting in Redis or an API gateway.

---

## Documentation

<img src="https://capsule-render.vercel.app/api?type=rect&amp;color=0:312E81,100:0F766E&amp;height=66&amp;text=14%20%2F%20Developer%20Resources&amp;fontSize=23&amp;fontColor=FFFFFF&amp;fontAlignY=52" alt="14 / Developer Resources" width="100%" />

- [Deployment Guide](docs/DEPLOYMENT.md) — Vercel, Render, Neon PostgreSQL, and Docker Compose setup.
- [Developer Handover Guide](docs/DEVELOPER_GUIDE.md) — Folder structure, AG-UI data flow, and troubleshooting.
- [Architecture Blueprint](docs/ARCHITECTURE.md)
- [AG-UI Protocol Specification](docs/AGENT_PROTOCOL.md)
- [Design Decisions](docs/DESIGN_DECISIONS.md)

---

<div align="center">

**TraceAnvaya** · Evidence first. Human decisions always.

[Live application](https://traceanvaya.vercel.app) · [Workspace](https://traceanvaya.vercel.app/workspace) · [Source code](https://github.com/manikumarkundena/traceanvaya)

<img src="https://capsule-render.vercel.app/api?type=waving&amp;color=0:4338CA,55:0F766E,100:071B24&amp;height=95&amp;section=footer" alt="" width="100%" />

</div>
