# TraceAnvaya — Deployment & Operations Guide

## 1. Docker Compose Deployment (Recommended)

TraceAnvaya provides a production-grade `docker-compose.yml` orchestrating:
1. **PostgreSQL 16**: Relational database with healthchecks and persistent volume.
2. **Backend**: FastAPI + Pydantic AI running with Uvicorn under non-root user.
3. **Frontend**: Next.js 15 production server.

### Launching the Cluster
```bash
# Set your Gemini or OpenAI API key (optional, test mode works offline)
export GEMINI_API_KEY="your-gemini-key"

docker compose up --build -d
```

### Healthcheck Verification
```bash
docker compose ps
curl http://localhost:8000/api/health
```

---

## 2. Environment Variables Reference

| Variable | Description | Default | Required in Prod? |
| :--- | :--- | :--- | :--- |
| `ENVIRONMENT` | Application mode (`development` or `production`) | `development` | Yes |
| `PORT` | Backend server port | `8000` | No |
| `DATABASE_URL` | Async database connection string | `sqlite+aiosqlite:///./traceanvaya.db` | Yes (Postgres) |
| `AI_PROVIDER` | Model provider (`gemini` or `openai` or `test`) | `gemini` | Yes |
| `AI_MODEL` | Provider model identifier | `gemini-2.0-flash` | Yes |
| `GEMINI_API_KEY` | Google Gemini API Key | `""` | For live LLM |
| `OPENAI_API_KEY` | OpenAI API Key (if using OpenAI) | `""` | Optional |
| `CORS_ORIGINS` | Permitted browser origins | `http://localhost:3000` | Yes |
| `BACKEND_AGENT_URL` | URL of backend /agent endpoint for Next.js proxy | `http://127.0.0.1:8000/agent` | Yes |
