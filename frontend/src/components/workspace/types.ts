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
  source_label?: string;
  trace_id?: string | null;
}

export interface InvestigationState {
  session_id: string;
  project_name?: string;
  incident_title: string;
  incident_description?: string;
  severity: string;
  status: string;
  affected_service: string;
  source_labels?: string[];
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

export interface ProviderInfo {
  id: string;
  label: string;
  configured: boolean;
  model: string;
  kind: "hosted" | "local";
  description: string;
}

export interface ProviderCatalog {
  active_provider: string;
  active_model: string;
  mode: "live" | "local_ollama" | "demo";
  ai_configured: boolean;
  providers: ProviderInfo[];
}
