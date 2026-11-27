import pytest
from httpx import AsyncClient, ASGITransport
from pydantic_ai import RunContext
from pydantic_ai.ui import StateDeps
from pydantic_ai.usage import RunUsage
from app.main import app
from app.core.config import settings
from app.agents.incident_agent import investigation_agent, correlate_services
from app.agents.provider_factory import (
    create_agent_model,
    get_provider_catalog,
    normalize_ollama_v1_url,
)
from app.services.log_parser import LogParser, redact_secrets


@pytest.mark.asyncio
async def test_custom_investigation_starts_empty_and_correlates_sources():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        sess = (await client.post("/api/sessions/init")).json()
        sid = sess["session_id"]
        headers = {"X-TraceAnvaya-Session": sess["token"]}

        # Create genuinely empty custom investigation
        custom_res = await client.post(
            "/api/investigations/custom",
            json={
                "project_name": "NovaPay",
                "incident_title": "Checkout 504 Gateway Cascade",
                "incident_description": "Users seeing 504 on POST /pay",
                "affected_service": "checkout-api",
                "severity": "UNKNOWN",
            },
            headers=headers,
        )
        assert custom_res.status_code == 200
        state = custom_res.json()
        assert state["incident_title"] == "Checkout 504 Gateway Cascade"
        assert state["severity"] == "UNKNOWN"
        assert state["findings"] == []
        assert state["hypotheses"] == []

        # Confirm zero synthetic scenario evidence
        ev_empty = (await client.get(f"/api/evidence?session_id={sid}", headers=headers)).json()
        assert ev_empty == []

        # Ingest 3 independent sources with shared trace_id + DB credential redaction + missing timestamp
        fe_logs = '2026-11-27T11:00:05Z ERROR [frontend-web] trace_id=tr-9981 POST /api/pay failed with 504 Gateway Timeout'
        be_logs = '2026-11-27T11:00:04Z ERROR [checkout-api] trace_id=tr-9981 Upstream DB query timed out after 5000ms'
        db_logs = '2026-11-27T11:00:02Z CRITICAL [orders-db] trace_id=tr-9981 Connection refused for postgresql://admin:topsecret99@db.local:5432/orders\nUnstructured line without timestamp'

        for label, content in [("Frontend", fe_logs), ("Backend", be_logs), ("Database", db_logs)]:
            r = await client.post(
                "/api/evidence/raw",
                json={"session_id": sid, "raw_content": content, "source_label": label},
                headers=headers,
            )
            assert r.status_code == 200

        all_ev = (await client.get(f"/api/evidence?session_id={sid}", headers=headers)).json()
        assert len(all_ev) == 4

        # Chronological ordering (11:00:02 -> 11:00:04 -> 11:00:05 -> untimestamped)
        assert all_ev[0]["timestamp"] == "2026-11-27T11:00:02Z"
        assert all_ev[1]["timestamp"] == "2026-11-27T11:00:04Z"
        assert all_ev[2]["timestamp"] == "2026-11-27T11:00:05Z"
        assert all_ev[3]["timestamp"] == ""  # Missing timestamp preserved, not invented

        # DB password redacted
        assert "[REDACTED_DB_PASS]" in all_ev[0]["raw_log"]
        assert "topsecret99" not in all_ev[0]["raw_log"]

        # Trace correlation links all 3 timestamped events
        assert len(all_ev[0]["correlated_ids"]) >= 2

        # Agent correlate_services tool finds the 3-service chain
        from app.services.evidence_store import evidence_store

        ctx = RunContext(
            deps=StateDeps(state=evidence_store.get_or_create_state(sid)),
            model=investigation_agent.model,
            usage=RunUsage(),
        )
        corr_out = correlate_services(ctx, trace_id="tr-9981")
        assert "3 events" in corr_out
        assert "Frontend" in corr_out and "Backend" in corr_out and "Database" in corr_out

        # Remove individual source
        del_res = await client.delete(f"/api/evidence/source/Frontend?session_id={sid}", headers=headers)
        assert del_res.status_code == 200
        assert del_res.json()["remaining_evidence"] == 3


@pytest.mark.asyncio
async def test_custom_ingest_validation_errors():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        sess = (await client.post("/api/sessions/init")).json()
        headers = {"X-TraceAnvaya-Session": sess["token"]}

        # Empty title rejected
        bad_custom = await client.post(
            "/api/investigations/custom",
            json={"incident_title": "   ", "severity": "UNKNOWN"},
            headers=headers,
        )
        assert bad_custom.status_code == 400

        # Empty pasted content rejected
        bad_raw = await client.post(
            "/api/evidence/raw",
            json={"session_id": sess["session_id"], "raw_content": "   \n  "},
            headers=headers,
        )
        assert bad_raw.status_code == 400

        # Empty file upload rejected
        bad_file = await client.post(
            f"/api/evidence/upload?session_id={sess['session_id']}",
            files={"file": ("empty.log", b"   ", "text/plain")},
            headers=headers,
        )
        assert bad_file.status_code == 400


def test_provider_factory_gemini_openai_ollama_and_selection(monkeypatch):
    from pydantic_ai.models.google import GoogleModel
    from pydantic_ai.models.openai import OpenAIChatModel

    assert normalize_ollama_v1_url("http://localhost:11434") == "http://localhost:11434/v1"
    assert normalize_ollama_v1_url("http://localhost:11434/v1/") == "http://localhost:11434/v1"

    monkeypatch.setattr(settings, "GEMINI_API_KEY", "test-gemini-key")
    monkeypatch.setattr(settings, "OPENAI_API_KEY", "test-openai-key")
    monkeypatch.setattr(settings, "OLLAMA_ENABLED", True)

    assert isinstance(create_agent_model("gemini"), GoogleModel)
    assert isinstance(create_agent_model("openai"), OpenAIChatModel)
    assert isinstance(create_agent_model("ollama"), OpenAIChatModel)

    catalog = get_provider_catalog("ollama")
    assert catalog["active_provider"] == "ollama"
    assert catalog["mode"] == "local_ollama"
    assert all(p["configured"] for p in catalog["providers"])


@pytest.mark.asyncio
async def test_unconfigured_provider_switch_rejected(monkeypatch):
    monkeypatch.setattr(settings, "OPENAI_API_KEY", "")
    monkeypatch.setattr(settings, "OLLAMA_ENABLED", False)
    monkeypatch.setattr(settings, "AI_PROVIDER", "gemini")

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        sess = (await client.post("/api/sessions/init")).json()
        headers = {"X-TraceAnvaya-Session": sess["token"]}

        res = await client.post(
            "/api/investigation/provider",
            json={"provider": "openai"},
            headers=headers,
        )
        assert res.status_code == 400
