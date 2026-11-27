import json
import os
import time
from typing import Dict, List, Optional
from app.core.config import settings
from app.schemas.incident import EvidenceItem, InvestigationState, PostmortemReport
from app.services.log_parser import LogParser


class EvidenceStore:
    def __init__(self):
        # In-memory storage indexed by session_id
        self._evidence: Dict[str, List[EvidenceItem]] = {}
        self._states: Dict[str, InvestigationState] = {}
        self._postmortems: Dict[str, PostmortemReport] = {}
        self._providers: Dict[str, str] = {}
        self._last_accessed: Dict[str, float] = {}

    def _touch(self, session_id: str) -> None:
        now = time.time()
        self._last_accessed[session_id] = now
        self._prune_expired(now)

    def _prune_expired(self, now: float) -> None:
        cutoff = now - settings.SESSION_TTL_SECONDS
        expired = [sid for sid, ts in self._last_accessed.items() if ts < cutoff]
        for sid in expired:
            self._evidence.pop(sid, None)
            self._states.pop(sid, None)
            self._postmortems.pop(sid, None)
            self._providers.pop(sid, None)
            self._last_accessed.pop(sid, None)

    def reset_session(self, session_id: str) -> None:
        self._evidence.pop(session_id, None)
        self._states.pop(session_id, None)
        self._postmortems.pop(session_id, None)
        self._touch(session_id)

    def get_session_provider(self, session_id: str) -> Optional[str]:
        self._touch(session_id)
        return self._providers.get(session_id)

    def set_session_provider(self, session_id: str, provider_id: str) -> None:
        self._touch(session_id)
        self._providers[session_id] = provider_id

    def create_custom_investigation(
        self,
        session_id: str,
        project_name: str,
        incident_title: str,
        incident_description: str,
        affected_service: str,
        severity: str,
    ) -> InvestigationState:
        self._touch(session_id)
        # Genuinely empty investigation with zero synthetic scenario logs
        self._evidence[session_id] = []
        self._postmortems.pop(session_id, None)
        state = InvestigationState(
            session_id=session_id,
            project_name=project_name.strip(),
            incident_title=incident_title.strip() or "Custom Incident Investigation",
            incident_description=incident_description.strip(),
            severity=(severity or "UNKNOWN").upper(),
            status="INVESTIGATING",
            affected_service=affected_service.strip() or "unknown",
            source_labels=[],
            selected_evidence_ids=[],
            findings=[],
            hypotheses=[],
            proposed_remediations=[],
            active_remediation_approval="NONE",
            notes="",
        )
        self._states[session_id] = state
        return state

    def next_evidence_start_index(self, session_id: str) -> int:
        existing = self._evidence.get(session_id, [])
        return len(existing) + 1

    def remove_source_evidence(self, session_id: str, source_label: str) -> List[EvidenceItem]:
        self._touch(session_id)
        existing = self._evidence.get(session_id, [])
        remaining = [
            e for e in existing if (e.source_label or e.service).lower() != source_label.lower()
        ]
        self._evidence[session_id] = LogParser.correlate_evidence(remaining)
        state = self.get_or_create_state(session_id)
        state.source_labels = sorted({e.source_label or e.service for e in self._evidence[session_id]})
        self.update_state(session_id, state)
        return self._evidence[session_id]

    def get_or_create_state(self, session_id: str) -> InvestigationState:
        self._touch(session_id)
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
        self._touch(session_id)
        new_state.session_id = session_id
        self._states[session_id] = new_state
        return new_state

    def store_evidence(self, session_id: str, items: List[EvidenceItem]) -> List[EvidenceItem]:
        self._touch(session_id)
        if session_id not in self._evidence:
            self._evidence[session_id] = []
        existing_ids = {e.id for e in self._evidence[session_id]}
        for item in items:
            if item.id in existing_ids:
                self._evidence[session_id] = [e if e.id != item.id else item for e in self._evidence[session_id]]
            else:
                self._evidence[session_id].append(item)
                existing_ids.add(item.id)
        self._evidence[session_id] = LogParser.correlate_evidence(self._evidence[session_id])
        return self._evidence[session_id]

    def get_evidence(
        self,
        session_id: str,
        query: Optional[str] = None,
        severity: Optional[str] = None,
        service: Optional[str] = None,
        source_label: Optional[str] = None,
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

        if source_label:
            src_lower = source_label.lower()
            filtered = [
                e for e in filtered if (e.source_label or e.service).lower() == src_lower
            ]

        if query:
            q_lower = query.lower()
            filtered = [
                e for e in filtered
                if q_lower in e.message.lower()
                or q_lower in e.raw_log.lower()
                or q_lower == e.id.lower()
                or (e.trace_id and q_lower in e.trace_id.lower())
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
        # Replace previous scenario evidence for this session cleanly
        self._evidence[session_id] = []
        self.store_evidence(session_id, items)

        # Set initial scenario state
        scenario_metadata = {
            "scenario-1": ("Database Connection Pool Exhaustion", "CRITICAL", "order-billing-service"),
            "scenario-2": ("Payment Gateway Timeout & Cascade Failure", "HIGH", "checkout-gateway"),
            "scenario-3": ("Auth Token Refresh Storm & Rate Limit Rejection", "HIGH", "auth-service"),
        }
        title, sev, svc = scenario_metadata.get(scenario_id, ("Synthetic Incident", "HIGH", "unknown"))
        state = InvestigationState(
            session_id=session_id,
            incident_title=title,
            severity=sev,
            status="INVESTIGATING",
            affected_service=svc,
            selected_evidence_ids=[items[0].id] if items else [],
            findings=[f"Loaded synthetic scenario: {title}"],
            hypotheses=[],
            proposed_remediations=[],
            active_remediation_approval="NONE",
            notes="",
        )
        self.update_state(session_id, state)

        return items


evidence_store = EvidenceStore()
