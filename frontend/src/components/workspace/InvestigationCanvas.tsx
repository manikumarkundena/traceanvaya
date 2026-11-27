"use client";

import React from "react";
import { Check, CheckCircle2, Edit3, FileSearch, Shield, Sparkles, X } from "lucide-react";
import { InvestigationState } from "./types";

interface InvestigationCanvasProps {
  canvasState: InvestigationState;
  backendOnline: boolean;
  backendSynced?: boolean;
  onUpdateCanvasState: (updates: Partial<InvestigationState>) => void;
  onRemediationDecision: (decision: "APPROVED" | "REJECTED") => void;
  onCitationClick: (evidenceId: string) => void;
  onLoadExampleInvestigation?: () => void;
}

function formatApprovalBadge(approval: string) {
  switch (approval) {
    case "APPROVED":
      return {
        label: "Approved (Simulated)",
        cls: "bg-success/15 text-success border border-success/35",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        cls: "bg-critical/15 text-critical border border-critical/35",
      };
    case "PENDING":
      return {
        label: "Pending review",
        cls: "bg-warning/15 text-warning border border-warning/35",
      };
    default:
      return {
        label: "Proposed",
        cls: "bg-white/[0.05] text-slate-300 border border-white/[0.1]",
      };
  }
}

export function InvestigationCanvas({
  canvasState,
  backendOnline,
  backendSynced = false,
  onUpdateCanvasState,
  onRemediationDecision,
  onCitationClick,
  onLoadExampleInvestigation,
}: InvestigationCanvasProps) {
  const approvalBadge = formatApprovalBadge(canvasState.active_remediation_approval);
  const isFreshState =
    canvasState.findings.length === 0 &&
    canvasState.hypotheses.length === 0 &&
    canvasState.proposed_remediations.length === 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 bg-[#080D0B]">
      {/* 1. Incident Overview (Editable Metadata) */}
      <section className="p-4 rounded-xl border border-white/[0.08] bg-[#0D1411] space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-sans">
            Incident overview
          </h3>
          <span className="text-[11px] font-sans text-slate-400">
            {backendSynced ? "Synced with backend" : backendOnline ? "Not synced" : "Local session"}
          </span>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="incident-title-input"
            className="text-xs text-muted font-sans flex items-center justify-between"
          >
            <span>Incident title</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <Edit3 className="w-3 h-3" /> Editable
            </span>
          </label>
          <input
            id="incident-title-input"
            type="text"
            value={canvasState.incident_title}
            onChange={(e) => onUpdateCanvasState({ incident_title: e.target.value })}
            className="w-full bg-[#070B09] border border-white/[0.1] rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/40 font-sans transition-colors"
          />
        </div>

        {/* 2. Severity and Affected Service */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="incident-severity-select" className="text-xs text-muted font-sans block">
              Severity
            </label>
            <select
              id="incident-severity-select"
              value={canvasState.severity}
              onChange={(e) => onUpdateCanvasState({ severity: e.target.value })}
              className="w-full bg-[#070B09] border border-white/[0.1] rounded-lg px-2.5 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/40 transition-colors cursor-pointer"
            >
              <option value="UNKNOWN">UNKNOWN</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="affected-service-input" className="text-xs text-muted font-sans block">
              Affected service
            </label>
            <input
              id="affected-service-input"
              type="text"
              value={canvasState.affected_service}
              onChange={(e) => onUpdateCanvasState({ affected_service: e.target.value })}
              className="w-full bg-[#070B09] border border-white/[0.1] rounded-lg px-2.5 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/40 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Optional Example Investigation Loader when fresh */}
      {isFreshState && onLoadExampleInvestigation && (
        <div className="p-3.5 rounded-xl border border-dashed border-white/[0.12] bg-[#0B120F] flex items-center justify-between gap-3">
          <div className="text-xs text-muted font-sans leading-relaxed">
            {backendSynced
              ? "Telemetry is synced with the backend. Ask the investigator to analyze the logs, or load an example completed walkthrough."
              : "Upload or paste logs, or sync an example scenario with the backend before running live analysis."}
          </div>
          <button
            type="button"
            onClick={onLoadExampleInvestigation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 whitespace-nowrap transition-colors font-sans flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Load example</span>
          </button>
        </div>
      )}

      {/* 3. Findings */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-sans">
            Findings
          </h4>
          <span className="text-xs font-mono text-accent font-semibold">
            {canvasState.findings.length}
          </span>
        </div>

        {canvasState.findings.length === 0 ? (
          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0B120F] text-xs text-muted font-sans flex items-center gap-2.5">
            <FileSearch className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>No findings recorded yet. Run an analysis prompt to populate findings.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {canvasState.findings.map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[#0D1411] border border-white/[0.07] text-xs leading-relaxed flex items-start gap-2.5 text-slate-200 font-sans"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Root-Cause Hypotheses */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-sans">
            Root-cause hypotheses
          </h4>
          <span className="text-xs font-mono text-accent font-semibold">
            {canvasState.hypotheses.length}
          </span>
        </div>

        {canvasState.hypotheses.length === 0 ? (
          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0B120F] text-xs text-muted font-sans">
            No root-cause hypothesis formed yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {canvasState.hypotheses.map((h, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#0D1411] border border-white/[0.08] text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-accent font-semibold font-sans">Hypothesis #{i + 1}</span>
                  <span className="text-[11px] font-sans text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    Active
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed font-sans">{h}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Supporting Evidence */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-sans">
            Supporting evidence
          </h4>
          <span className="text-xs font-mono text-accent font-semibold">
            {canvasState.selected_evidence_ids.length}
          </span>
        </div>

        {canvasState.selected_evidence_ids.length === 0 ? (
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0B120F] text-xs text-muted font-sans">
            No evidence references linked yet.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {canvasState.selected_evidence_ids.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onCitationClick(id)}
                className="px-2.5 py-1 rounded-md bg-accent/15 hover:bg-accent/25 text-accent font-mono text-xs font-semibold border border-accent/30 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                title={`Inspect ${id} in Evidence Explorer`}
              >
                {id}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 6. Remediation Review */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-sans">
            Remediation review
          </h4>
          {canvasState.proposed_remediations.length > 0 && (
            <span className={`text-[11px] px-2 py-0.5 rounded font-sans font-medium ${approvalBadge.cls}`}>
              {approvalBadge.label}
            </span>
          )}
        </div>

        {canvasState.proposed_remediations.length === 0 ? (
          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0B120F] text-xs text-muted font-sans">
            No remediation plan proposed yet. Ask the investigator to propose a remediation plan when ready.
          </div>
        ) : (
          canvasState.proposed_remediations.map((rem, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-white/[0.08] bg-[#0D1411] space-y-3"
            >
              <p className="text-xs text-slate-200 font-mono leading-relaxed">{rem}</p>

              <div className="p-3 rounded-lg bg-[#070B09] border border-white/[0.07] text-xs text-muted space-y-1 font-sans">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  <span>Review before approval</span>
                </div>
                <p className="leading-relaxed">
                  Simulated environment: approving records your decision in the audit log. No production infrastructure commands are executed.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 font-sans">
                <button
                  type="button"
                  onClick={() => onRemediationDecision("APPROVED")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-success/15 hover:bg-success/25 text-success border border-success/35 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Plan</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemediationDecision("REJECTED")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-critical/15 hover:bg-critical/25 text-critical border border-critical/35 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-critical"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject Plan</span>
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
