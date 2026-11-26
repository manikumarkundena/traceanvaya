export interface EvidenceItem {
  id: string;
  timestamp: string;
  service: string;
  severity: string;
  message: string;
  metadata: Record<string, any>;
  raw_log: string;
  is_anomaly: boolean;
  correlated_ids: string[];
}

export interface InvestigationState {
  session_id: string;
  incident_title: string;
  severity: string;
  status: string;
  affected_service: string;
  selected_evidence_ids: string[];
  findings: string[];
  hypotheses: string[];
  proposed_remediations: string[];
  active_remediation_approval: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  tools?: Array<{ name: string; args?: any; result?: string }>;
}
