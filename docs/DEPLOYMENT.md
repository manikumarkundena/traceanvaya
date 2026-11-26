# TraceAnvaya Deployment Guide

This guide covers deploying TraceAnvaya to production using:
- **Frontend**: Vercel (Next.js 15 App Router + CopilotKit Runtime)
- **Backend**: Render or Railway (FastAPI + Pydantic AI + Uvicorn)
- **Database**: Neon (Managed PostgreSQL)
- **Live AI**: Google Gemini API (`gemini-2.0-flash`)

---

## 1. Managed PostgreSQL (Neon)

1. Create a PostgreSQL project on Neon.
2. Copy the connection string (for example: `postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/traceanvaya?sslmode=require`).
3. TraceAnvaya's `backend/app/core/config.py` automatically normalizes `postgres://` and `postgresql://` URLs to `postgresql+asyncpg://` for SQLAlchemy AsyncIO.
4. Run Alembic migrations against the production database from `backend/`:
   ```bash
   DATABASE_URL="postgresql+asyncpg://user:pass@ep-xyz.us-east-2.aws.neon.tech/traceanvaya" alembic upgrade head
   ```

---

## 2. Backend Service (Render / Railway)

- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/api/health`

### Required Backend Environment Variables
| Variable | Description | Example |
| :--- | :--- | :--- |
| `ENVIRONMENT` | Runtime environment | `production` |
| `DATABASE_URL` | Neon PostgreSQL URL | `postgresql+asyncpg://...` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | `https://traceanvaya.vercel.app` |
| `AI_PROVIDER` | LLM provider (`gemini` or `openai`) | `gemini` |
| `AI_MODEL` | Model identifier | `gemini-2.0-flash` |
| `GEMINI_API_KEY` | Google AI Studio API key (omit for Demo Mode) | `AIza...` |
| `RATE_LIMIT_PER_MINUTE` | Per-IP `/agent` request limit | `30` |

> **Public Demo Safety**: If deploying a public portfolio demo without user authentication, omit `GEMINI_API_KEY` to run in **Demo Mode**, or set a strict `RATE_LIMIT_PER_MINUTE` and billing cap on your Gemini API key.

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
