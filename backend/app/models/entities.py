from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, Float, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base


class InvestigationSessionModel(Base):
    __tablename__ = "investigation_sessions"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    severity = Column(String(32), default="HIGH", index=True)
    status = Column(String(32), default="INVESTIGATING", index=True)
    affected_service = Column(String(128), default="unknown")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    evidence_records = relationship("EvidenceRecordModel", back_populates="session", cascade="all, delete-orphan")
    hypotheses = relationship("HypothesisModel", back_populates="session", cascade="all, delete-orphan")
    remediations = relationship("RemediationProposalModel", back_populates="session", cascade="all, delete-orphan")


class EvidenceRecordModel(Base):
    __tablename__ = "evidence_records"

    id = Column(String(64), primary_key=True, index=True)
    session_id = Column(String(64), ForeignKey("investigation_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp = Column(String(64), nullable=False, index=True)
    service = Column(String(128), nullable=False, index=True)
    severity = Column(String(32), nullable=False, index=True)
    message = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)
    raw_log = Column(Text, nullable=False)
    is_anomaly = Column(Boolean, default=False, index=True)
    correlated_ids_json = Column(JSON, default=list)

    session = relationship("InvestigationSessionModel", back_populates="evidence_records")


class HypothesisModel(Base):
    __tablename__ = "hypotheses"

    id = Column(String(64), primary_key=True, index=True)
    session_id = Column(String(64), ForeignKey("investigation_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    suspected_cause = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.85)
    status = Column(String(32), default="ACTIVE")
    supporting_evidence_ids_json = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("InvestigationSessionModel", back_populates="hypotheses")


class RemediationProposalModel(Base):
    __tablename__ = "remediation_proposals"

    id = Column(String(64), primary_key=True, index=True)
    session_id = Column(String(64), ForeignKey("investigation_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    risk_level = Column(String(32), default="MEDIUM")
    steps_json = Column(JSON, default=list)
    requires_approval = Column(Boolean, default=True)
    approval_status = Column(String(32), default="PENDING")
    approved_by = Column(String(128), nullable=True)
    approved_at = Column(DateTime, nullable=True)

    session = relationship("InvestigationSessionModel", back_populates="remediations")


class ActivityEventModel(Base):
    __tablename__ = "activity_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(64), index=True)
    event_type = Column(String(64), nullable=False, index=True)
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
