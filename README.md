# TraceAnvaya

> **Agentic Incident Investigation & Replay Platform**  
> *"Trace the failure. Connect the evidence."*

---

## 1. Executive Summary & Product Purpose

**TraceAnvaya** is an agentic software reliability and incident intelligence platform. It enables software engineers, SREs, and engineering students to forensically investigate production outages through application telemetry, structured AI agent reasoning, bidirectional shared state synchronization, interactive chronological incident replay, and human-in-the-loop remediation gates.

Built with **Pydantic AI**, **AG-UI Protocol**, **CopilotKit**, **FastAPI**, and **Next.js 15 App Router**, TraceAnvaya rejects generic chat wrappers in favor of deterministic telemetry parsing, typed tool contracts, and verifiable state machines.

---

## 2. Key Capabilities

| Capability | Description |
| :--- | :--- |
| **AI Investigator** | Autonomous Pydantic AI agent equipped with structured tools (`search_logs`, `get_log_entry`, `add_hypothesis`, `propose_remediation`) to isolate root causes. |
| **Evidence Explorer** | Ingests `.log`, `.txt`, and `.json` logs with automatic secret redaction (JWTs, API keys, passwords) and anomaly correlation. |
| **Bidirectional Shared State** | 1:1 synchronization between frontend canvas and backend agent state using typed `StateDeps[InvestigationState]`. |
| **Chronological Replay** | Step-by-step playback scrubber allowing engineers to visualize how cascading failures propagated across microservices. |
| **Human Approval Gate** | Remediation runbooks require explicit operator authorization (`APPROVE` / `REJECT`) with zero unsafe shell execution. |
| **Postmortem Studio** | One-click generation and export of executive postmortem reports in GitHub Flavored Markdown. |
| **Pre-loaded Scenarios** | 3 realistic synthetic scenarios: Database Pool Exhaustion, Gateway Timeout Cascade, and Auth Rate Storm. |

---

## 3. Engineering Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 15 (React 19)                     │
│  - CopilotKit Runtime (/api/copilotkit)                     │
│  - Investigation Canvas & Evidence Explorer                 │
│  - Incident Replay Scrubber & Postmortem Studio             │
└──────────────────────────────▲──────────────────────────────┘
                               │
                               │ AG-UI Protocol Stream (SSE)
                               │ [RUN_STARTED, TOOL_CALL, STATE_UPDATE]
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    FastAPI & Pydantic AI                    │
│  - AGUIAdapter with StateDeps[InvestigationState]           │
│  - Deterministic Log Parser & Secret Redactor               │
│  - Async SQLite / PostgreSQL Engine (SQLAlchemy)            │
│  - Gemini / Configurable Model Provider & TestModel         │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Quickstart Guide

### Prerequisites
- Node.js 20+ & npm
- Python 3.12+ (or 3.15)
- Git

### 1. Clone & Set Up Environment
```bash
git clone <repository_url>
cd traceanvaya
cp .env.example .env
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
pytest -v
python -m uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

Open your browser to [http://localhost:3000](http://localhost:3000) to view the landing page, or [http://localhost:3000/workspace](http://localhost:3000/workspace) to open the investigation workspace.

---

## 5. Automated Verification

Run the full pytest suite verifying log ingestion, secret redaction, agent tool execution, and bidirectional shared state synchronization:
```bash
cd backend
.\.venv\Scripts\pytest -v
```

All 8 tests pass with 100% coverage across core domain logic.

---

## 6. Project Documentation
- [Architecture Blueprint](docs/ARCHITECTURE.md)
- [Requirements Traceability Matrix](docs/REQUIREMENTS.md)
- [Design Decisions & Tradeoffs](docs/DESIGN_DECISIONS.md)
- [AG-UI Protocol Specification](docs/AGENT_PROTOCOL.md)
- [Testing & Quality Assurance Guide](docs/TESTING.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
