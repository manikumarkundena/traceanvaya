from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings
from app.core.security import validate_production_security


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Fail fast in production if SESSION_SECRET is missing or weak
    validate_production_security()
    yield
    # Shutdown


app = FastAPI(
    title="TraceAnvaya Incident Intelligence API",
    description="Agentic Incident Investigation & Replay Platform Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization", "X-TraceAnvaya-Session"],
)

# Include main router
app.include_router(router, prefix="/api")

# Also mount root /agent endpoint for direct AG-UI protocol client calls
@app.post("/agent")
async def root_agent_endpoint(request: Request):
    from app.api.routes import run_agent
    return await run_agent(request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
