import json
import os
from typing import Dict, List, Optional
from app.schemas.incident import EvidenceItem, InvestigationState, PostmortemReport
from app.services.log_parser import LogParser


class EvidenceStore:
    def __init__(self):
        # In-memory storage indexed by session_id
        self._evidence: Dict[str, List[EvidenceItem]] = {}
        self._states: Dict[str, InvestigationState] = {}
        self._postmortems: Dict[str, PostmortemReport] = {}

    def get_or_create_state(self, session_id: str) -> InvestigationState:
        if session_id not in self._states:
            self._states[session_id] = InvestigationState(
                session_id=session_id,
                incident_title=f"Incident Investigation [{session_id}]",
                severity="HIGH",
                status="INVESTIGATING",
                affected_service="unknown",
                selected_evidence_ids=[],
                findings=[],
                hypotheses=[],
                proposed_remediations=[],
                active_remediation_approval="NONE",
                notes=""
            )
        return self._states[session_id]

    def update_state(self, session_id: str, new_state: InvestigationState) -> InvestigationState:
        new_state.session_id = session_id
        self._states[session_id] = new_state
        return new_state

    def store_evidence(self, session_id: str, items: List[EvidenceItem]) -> List[EvidenceItem]:
        if session_id not in self._evidence:
            self._evidence[session_id] = []
        # Replace or append
        existing_ids = {e.id for e in self._evidence[session_id]}
        for item in items:
            if item.id in existing_ids:
                # Update item
                self._evidence[session_id] = [e if e.id != item.id else item for e in self._evidence[session_id]]
            else:
                self._evidence[session_id].append(item)
                existing_ids.add(item.id)
        return self._evidence[session_id]

    def get_evidence(
        self,
        session_id: str,
        query: Optional[str] = None,
        severity: Optional[str] = None,
        service: Optional[str] = None,
        limit: int = 50
    ) -> List[EvidenceItem]:
        items = self._evidence.get(session_id, [])
        filtered = items

        if severity:
            sev_upper = severity.upper()
            filtered = [e for e in filtered if e.severity == sev_upper]

        if service:
            svc_lower = service.lower()
            filtered = [e for e in filtered if svc_lower in e.service.lower()]

        if query:
            q_lower = query.lower()
            filtered = [
                e for e in filtered
                if q_lower in e.message.lower() or q_lower in e.raw_log.lower() or q_lower == e.id.lower()
            ]

        return filtered[:limit]

    def get_evidence_by_id(self, session_id: str, evidence_id: str) -> Optional[EvidenceItem]:
        items = self._evidence.get(session_id, [])
        for item in items:
            if item.id.lower() == evidence_id.lower():
                return item
        return None

    def load_scenario(self, session_id: str, scenario_id: str, scenarios_dir: str) -> List[EvidenceItem]:
        scenario_file_map = {
            "scenario-1": "scenario_1_db_pool_exhaustion.log",
            "scenario-2": "scenario_2_dependency_timeout.log",
            "scenario-3": "scenario_3_auth_rate_limit.log",
        }
        file_name = scenario_file_map.get(scenario_id, "scenario_1_db_pool_exhaustion.log")
        file_path = os.path.join(scenarios_dir, file_name)

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Scenario log file not found: {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        items = LogParser.parse_log_content(content, session_id=session_id)
        self.store_evidence(session_id, items)

        # Set initial scenario state
        scenario_metadata = {
            "scenario-1": ("Database Connection Pool Exhaustion", "CRITICAL", "order-billing-service"),
            "scenario-2": ("Payment Gateway Timeout & Cascade Failure", "HIGH", "checkout-gateway"),
            "scenario-3": ("Auth Token Refresh Storm & Rate Limit Rejection", "HIGH", "auth-service"),
        }
        title, sev, svc = scenario_metadata.get(scenario_id, ("Synthetic Incident", "HIGH", "unknown"))
        state = self.get_or_create_state(session_id)
        state.incident_title = title
        state.severity = sev
        state.affected_service = svc
        state.status = "INVESTIGATING"
        state.selected_evidence_ids = [items[0].id] if items else []
        state.findings = [f"Loaded synthetic scenario: {title}"]
        self.update_state(session_id, state)

        return items


evidence_store = EvidenceStore()
