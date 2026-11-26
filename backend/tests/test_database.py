import uuid
import pytest
from sqlalchemy import select
from app.db.session import init_db, AsyncSessionLocal
from app.models.entities import InvestigationSessionModel, EvidenceRecordModel


@pytest.mark.asyncio
async def test_database_persistence_and_relationships():
    # Initialize DB schema
    await init_db()

    sess_id = f"persist-sess-{uuid.uuid4().hex[:8]}"
    ev_id = f"ev-db-{uuid.uuid4().hex[:8]}"

    async with AsyncSessionLocal() as session:
        # Create session
        test_session = InvestigationSessionModel(
            id=sess_id,
            title="Database Connection Timeout Incident",
            severity="CRITICAL",
            status="INVESTIGATING",
            affected_service="billing-api"
        )
        session.add(test_session)

        # Add evidence record
        test_evidence = EvidenceRecordModel(
            id=ev_id,
            session_id=sess_id,
            timestamp="2026-11-26T14:15:32Z",
            service="billing-api",
            severity="ERROR",
            message="Connection pool exhausted",
            raw_log="[billing-api] ERROR Connection pool exhausted",
            is_anomaly=True,
            correlated_ids_json=["ev-db-002"]
        )
        session.add(test_evidence)
        await session.commit()

    # Query back in a new session to verify durable persistence
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(InvestigationSessionModel).where(InvestigationSessionModel.id == sess_id)
        )
        saved_session = result.scalar_one_or_none()
        assert saved_session is not None
        assert saved_session.title == "Database Connection Timeout Incident"
        assert saved_session.severity == "CRITICAL"

        ev_result = await session.execute(
            select(EvidenceRecordModel).where(EvidenceRecordModel.session_id == sess_id)
        )
        saved_evidence = ev_result.scalars().all()
        assert len(saved_evidence) == 1
        assert saved_evidence[0].id == ev_id
        assert saved_evidence[0].is_anomaly is True
