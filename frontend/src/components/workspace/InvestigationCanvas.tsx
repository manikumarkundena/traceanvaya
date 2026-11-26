import React from "react";
import { Check, CheckCircle2, Layers, Shield, X } from "lucide-react";
import { InvestigationState } from "./types";

interface InvestigationCanvasProps {
  canvasState: InvestigationState;
  onUpdateCanvasState: (updates: Partial<InvestigationState>) => void;
  onRemediationDecision: (decision: "APPROVED" | "REJECTED") => void;
  onCitationClick: (evidenceId: string) => void;
}

export function InvestigationCanvas({
  canvasState,
  onUpdateCanvasState,
  onRemediationDecision,
  onCitationClick,
}: InvestigationCanvasProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
      {/* Interactive State Header (TEST B - Manual Edit) */}
      <div className="p-4 rounded-xl border border-border bg-background space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-muted">
          <span className="flex items-center gap-1.5 text-accent font-semibold">
            <Layers className="w-3.5 h-3.5" />
            SHARED STATE CONTROLS
          </span>
          <span className="text-[10px] bg-border px-1.5 py-0.5 rounded text-muted">TEST B READY</span>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-muted">Incident Title (User Editable)</label>
          <input
            type="text"
            value={canvasState.incident_title}
            onChange={(e) => onUpdateCanvasState({ incident_title: e.target.value })}
            className="w-full bg-surface border border-border rounded px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:border-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-[11px] font-mono text-muted">Severity</label>
            <select
              value={canvasState.severity}
              onChange={(e) => onUpdateCanvasState({ severity: e.target.value })}
              className="w-full bg-surface border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-accent"
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-mono text-muted">Affected Service</label>
            <input
              type="text"
              value={canvasState.affected_service}
              onChange={(e) => onUpdateCanvasState({ affected_service: e.target.value })}
              className="w-full bg-surface border border-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Verified Findings */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-muted flex items-center justify-between">
          <span>Verified Findings</span>
          <span className="text-accent">{canvasState.findings.length}</span>
        </h4>
        <div className="space-y-2">
          {canvasState.findings.map((f, i) => (
            <div key={i} className="p-3 rounded-lg bg-surface-elevated border border-border text-xs leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hypotheses Cards */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-muted flex items-center justify-between">
          <span>Root-Cause Hypotheses</span>
          <span className="text-accent">{canvasState.hypotheses.length}</span>
        </h4>
        <div className="space-y-2.5">
          {canvasState.hypotheses.map((h, i) => (
            <div key={i} className="p-3.5 rounded-lg bg-surface-elevated border border-border text-xs space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-accent font-semibold">Hypothesis #{i + 1}</span>
                <span className="text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                  CONFIDENCE 94%
                </span>
              </div>
              <p className="text-foreground leading-relaxed">{h}</p>
              <div className="pt-1 flex items-center gap-1.5 font-mono text-[10px] text-muted">
                <span>Supporting:</span>
                {canvasState.selected_evidence_ids.map((id) => (
                  <button
                    key={id}
                    onClick={() => onCitationClick(id)}
                    className="bg-accent/15 text-accent px-1.5 py-0.5 rounded border border-accent/30 font-bold hover:bg-accent/30 transition-colors"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proposed Remediations & Human Approval Gate */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-muted flex items-center justify-between">
          <span>Human-in-the-Loop Remediation</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
              canvasState.active_remediation_approval === "APPROVED"
                ? "bg-success/20 text-success border border-success/40"
                : canvasState.active_remediation_approval === "REJECTED"
                ? "bg-critical/20 text-critical border border-critical/40"
                : "bg-warning/20 text-warning border border-warning/40"
            }`}
          >
            {canvasState.active_remediation_approval}
          </span>
        </h4>

        {canvasState.proposed_remediations.map((rem, i) => (
          <div key={i} className="p-4 rounded-xl border border-border bg-surface-elevated space-y-3">
            <p className="text-xs text-foreground font-mono leading-relaxed">{rem}</p>

            <div className="p-2.5 rounded bg-background border border-border text-[11px] text-muted space-y-1">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-accent" />
                Human Operator Safety Policy
              </div>
              <p>
                Approving this runbook verifies the proposed parameters in the audit trail.
                No arbitrary shell commands are dispatched without supervised approval.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onRemediationDecision("APPROVED")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-success/20 hover:bg-success/30 text-success border border-success/40 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Mitigation</span>
              </button>
              <button
                onClick={() => onRemediationDecision("REJECTED")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-critical/20 hover:bg-critical/30 text-critical border border-critical/40 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject Plan</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
