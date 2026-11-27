# TraceAnvaya Deployment Guide

This guide covers deploying TraceAnvaya to production using:
- **Frontend**: Vercel (Next.js 15 App Router + CopilotKit Runtime)
- **Backend**: Render or Railway (FastAPI + Pydantic AI + Uvicorn)
- **Database**: Neon (Managed PostgreSQL)
- **Live AI**: Google Gemini API (`gemini-3.5-flash-lite`)

---

## 1. Managed PostgreSQL (Neon)

1. Create a PostgreSQL project on Neon.
2. Copy the connection string (for example: `postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/traceanvaya?sslmode=require`).
3. TraceAnvaya's `backend/app/core/config.py` automatically normalizes `postgres://` and `postgresql://` URLs to `postgresql+asyncpg://` and converts `sslmode=require` to `ssl=require` for SQLAlchemy AsyncIO + `asyncpg`.
4. Run Alembic migrations against the production database from `backend/`:
   ```bash
   DATABASE_URL="postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/traceanvaya?sslmode=require" alembic upgrade head
   ```

---

## 2. Backend Service (Render / Railway)

A Render Blueprint is provided at the repository root in `render.yaml`.

- **Root Directory**: `backend`
- **Python Version**: `3.12.8` (`PYTHON_VERSION=3.12.8`)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/api/health`

### Required Backend Environment Variables
| Variable | Description | Example |
| :--- | :--- | :--- |
| `ENVIRONMENT` | Runtime environment (`development` or `production`) | `production` |
| `SESSION_SECRET` | HMAC signing key for anonymous sessions (>= 32 chars, required in prod) | Auto-generated in `render.yaml` |
| `DATABASE_URL` | Neon PostgreSQL URL | `postgresql://user:pass@ep-xyz.neon.tech/traceanvaya?sslmode=require` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | `https://traceanvaya.vercel.app` |
| `AI_PROVIDER` | LLM provider (`gemini` or `openai`) | `gemini` |
| `AI_MODEL` | Model identifier | `gemini-3.5-flash-lite` |
| `GEMINI_API_KEY` | Google AI Studio API key (omit for Demo Mode) | `AIza...` |
| `RATE_LIMIT_PER_MINUTE` | Per-IP `/agent` request limit | `30` |
| `SESSION_AI_LIMIT_PER_HOUR` | Per-session hourly live AI turn cap | `40` |
| `MAX_CONCURRENT_AI_PER_SESSION` | Max concurrent live AI requests per session | `2` |
| `GLOBAL_AI_LIMIT_PER_HOUR` | Global hourly live AI safeguard across visitors | `500` |
| `SESSION_TTL_SECONDS` | In-memory session expiration TTL (seconds) | `86400` |
| `TRUST_PROXY_HEADERS` | Honor `X-Forwarded-For` behind Render/Vercel proxies | `true` |
| `MAX_AGENT_BODY_BYTES` | Max `/agent` JSON payload size (bytes) | `131072` |
| `MAX_RAW_EVIDENCE_BYTES` | Max `/api/evidence/raw` payload size (bytes) | `2097152` |
| `MAX_UPLOAD_BYTES` | Max `/api/evidence/upload` file size (bytes) | `10485760` |

> **Persistence Boundary**: PostgreSQL (Neon + Alembic `2b17c4fcd53d_initial_schema.py`) stores the relational schema (`investigations`, `evidence_items`, `hypotheses`, `remediations`, `postmortem_reports`), while active investigation workspaces, AG-UI `StateDeps` snapshots, and rate/quota counters are held in memory per backend worker (`EvidenceStore`, `AIRateAndQuotaGuard`) with 24-hour TTL pruning.

> **Public Demo Safety**: If deploying a public portfolio demo without user authentication, omit `GEMINI_API_KEY` to run in **Demo Mode**, or keep `RATE_LIMIT_PER_MINUTE`, `SESSION_AI_LIMIT_PER_HOUR`, `GLOBAL_AI_LIMIT_PER_HOUR`, and a Gemini API billing cap enabled.

---

## 3. Frontend Service (Vercel)

- **Root Directory**: `frontend`
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Required Frontend Environment Variables
| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Public URL of the deployed FastAPI backend | `https://traceanvaya-api.onrender.com` |
| `BACKEND_AGENT_URL` | Server-side AG-UI endpoint for CopilotKit runtime | `https://traceanvaya-api.onrender.com/agent` |

Never place API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`) in `NEXT_PUBLIC_*` variables.

---

## 4. Docker Compose (Self-Hosted / Local Reproducibility)

From the repository root:
```bash
cp .env.example .env
# Optionally set GEMINI_API_KEY in .env
docker compose up --build -d
```

Services started:
- `postgres` (`postgres:16-alpine`) on port `5432`
- `backend` (`./backend/Dockerfile`) on port `8000`
- `frontend` (`./frontend/Dockerfile`) on port `3000`
