import os
import sys
from dotenv import load_dotenv

# Load local environment if present
load_dotenv()

def run_smoke_test():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        print("\n" + "=" * 60)
        print("REAL AI PROVIDER VERIFICATION: BLOCKED (NO API KEY)")
        print("=" * 60)
        print("\nTo enable real Google Gemini LLM reasoning:")
        print("1. Obtain a Gemini API key at: https://aistudio.google.com/app/apikey")
        print("2. Set the key in 'backend/.env' or set environment variable:")
        print("     GEMINI_API_KEY=AIzaSy...")
        print("     AI_PROVIDER=gemini")
        print("     AI_MODEL=gemini-1.5-flash")
        print("3. Restart the FastAPI backend daemon:")
        print("     python -m uvicorn app.main:app --port 8000")
        print("4. Re-run this smoke test:")
        print("     python test_gemini_smoke.py\n")
        print("In the absence of a key, TraceAnvaya runs in deterministic TestModel mode.")
        print("=" * 60 + "\n")
        sys.exit(2)

    print("\n[INFO] GEMINI_API_KEY detected. Initializing Pydantic AI agent with Gemini...")
    try:
        from app.agents.incident_agent import investigation_agent
        from app.schemas.incident import InvestigationState
        from pydantic_ai.ui import StateDeps
        import asyncio

        state = InvestigationState(
            session_id="smoke-test-session",
            incident_title="Database Connection Exhaustion Test",
            severity="CRITICAL",
            status="INVESTIGATING",
            affected_service="billing-api"
        )

        async def query_agent():
            deps = StateDeps(state=state)
            result = await investigation_agent.run(
                "Correlate the log errors for billing-api and state the primary hypothesis.",
                deps=deps
            )
            return result

        result = asyncio.run(query_agent())
        print("[SUCCESS] Real Gemini model response received:")
        print(f"Data: {result.data[:300]}...")
        print(f"Usage: {result.usage()}")
        sys.exit(0)
    except Exception as e:
        print(f"[ERROR] Gemini API execution failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_smoke_test()
