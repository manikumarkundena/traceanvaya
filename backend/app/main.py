from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure scenarios directory is loaded/verified
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
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main router
app.include_router(router, prefix="/api")

# Also mount root /agent endpoint for direct AG-UI protocol client calls
@app.post("/agent")
async def root_agent_endpoint(request):
    from app.api.routes import run_agent
    return await run_agent(request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
