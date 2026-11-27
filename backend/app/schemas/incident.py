from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class EvidenceItem(BaseModel):
    id: str
    timestamp: str
    service: str
    severity: str  # DEBUG, INFO, WARN, ERROR, CRITICAL, FATAL
    message: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    raw_log: str
    is_anomaly: bool = False
    correlated_ids: List[str] = Field(default_factory=list)
    source_label: str = ""
    trace_id: Optional[str] = None


class HypothesisItem(BaseModel):
    id: str
    suspected_cause: str
    supporting_evidence_ids: List[str] = Field(default_factory=list)
    contradictory_evidence_ids: List[str] = Field(default_factory=list)
    confidence_score: float = 0.8
    status: str = "ACTIVE"  # ACTIVE, VALIDATED, REFUTED


class RemediationItem(BaseModel):
    id: str
    title: str
    description: str
    risk_level: str = "MEDIUM"  # LOW, MEDIUM, HIGH
    steps: List[str] = Field(default_factory=list)
    requires_approval: bool = True
    approval_status: str = "PENDING"  # PENDING, APPROVED, REJECTED
    rationale: str = ""
    approved_by: Optional[str] = None
    approved_at: Optional[str] = None


class InvestigationState(BaseModel):
    session_id: str = "default-session"
    project_name: str = ""
    incident_title: str = "Investigating Incident"
    incident_description: str = ""
    severity: str = "HIGH"  # UNKNOWN, LOW, MEDIUM, HIGH, CRITICAL
    status: str = "INVESTIGATING"  # INVESTIGATING, HYPOTHESIS_FORMED, MITIGATED, RESOLVED
    affected_service: str = "unknown"
    source_labels: List[str] = Field(default_factory=list)
    selected_evidence_ids: List[str] = Field(default_factory=list)
    findings: List[str] = Field(default_factory=list)
    hypotheses: List[str] = Field(default_factory=list)
    proposed_remediations: List[str] = Field(default_factory=list)
    active_remediation_approval: str = "NONE"  # NONE, PENDING, APPROVED, REJECTED
    notes: str = ""


class PostmortemReport(BaseModel):
    session_id: str
    incident_title: str
    summary: str
    observed_impact: str
    timeline_summary: List[str]
    root_cause: str
    evidence_references: List[str]
    findings: List[str]
    remediation_recommendations: List[str]
    preventive_actions: List[str]
    unresolved_questions: List[str]
    markdown_content: str
    generated_at: str


class IngestLogRequest(BaseModel):
    session_id: str = "default-session"
    raw_content: str
    filename: Optional[str] = "upload.log"
    source_label: Optional[str] = None


class CustomInvestigationRequest(BaseModel):
    project_name: str = ""
    incident_title: str
    incident_description: str = ""
    affected_service: str = "unknown"
    severity: str = "UNKNOWN"  # UNKNOWN, LOW, MEDIUM, HIGH, CRITICAL


class ProviderSelectionRequest(BaseModel):
    provider: str


class IngestResponse(BaseModel):
    session_id: str
    total_parsed: int
    anomalies_detected: int
    services: List[str]
    severity_breakdown: Dict[str, int]
    source_label: Optional[str] = None
