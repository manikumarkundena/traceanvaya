import React from "react";
import Link from "next/link";
import { Check, Cpu, FileText, FolderPlus, RotateCcw } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { InvestigationState, ProviderCatalog } from "./types";

interface WorkspaceHeaderProps {
  canvasState: InvestigationState;
  stateSyncSuccess: boolean;
  currentScenario: string;
  providerCatalog?: ProviderCatalog | null;
  onScenarioChange: (scenario: string) => void;
  onNewCustomInvestigation: () => void;
  onOpenProviderSettings: () => void;
  onResetInvestigation: () => void;
  onOpenPostmortem: () => void;
}

function formatStatusLabel(status: string): string {
  switch (status) {
    case "INVESTIGATING":
      return "Investigating";
    case "HYPOTHESIS_FORMED":
      return "Hypothesis Formed";
    case "MITIGATED":
      return "Simulated Mitigation";
    case "RESOLVED":
      return "Resolved (Simulated)";
    default:
      return status;
  }
}

export function WorkspaceHeader({
  canvasState,
  stateSyncSuccess,
  currentScenario,
  providerCatalog,
  onScenarioChange,
  onNewCustomInvestigation,
  onOpenProviderSettings,
  onResetInvestigation,
  onOpenPostmortem,
}: WorkspaceHeaderProps) {
  const providerBadgeText =
    providerCatalog?.mode === "live"
      ? `Live: ${providerCatalog.active_provider}`
      : providerCatalog?.mode === "local_ollama"
      ? "Local Ollama"
      : "Demo Mode";
  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#0B110E] flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Link
          href="/"
          className="hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md flex-shrink-0"
          title="Back to TraceAnvaya home"
        >
          <Logo size={24} />
        </Link>
        <div className="h-4 w-px bg-white/[0.1] hidden sm:block flex-shrink-0" />

        {/* Incident title, severity & status */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-xs sm:text-sm truncate max-w-[140px] sm:max-w-xs text-foreground font-sans">
            {canvasState.incident_title}
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase tracking-wider flex-shrink-0 ${
              canvasState.severity === "CRITICAL"
                ? "bg-critical/15 text-critical border border-critical/30"
                : canvasState.severity === "HIGH"
                ? "bg-warning/15 text-warning border border-warning/30"
                : "bg-info/15 text-info border border-info/30"
            }`}
          >
            {canvasState.severity}
          </span>
          <span className="hidden md:inline-flex text-[11px] font-sans font-medium px-2 py-0.5 rounded bg-white/[0.04] text-accent border border-white/[0.08] flex-shrink-0">
            {formatStatusLabel(canvasState.status)}
          </span>
        </div>
      </div>

      {/* Right workspace actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        {stateSyncSuccess && (
          <span className="hidden sm:inline-flex text-xs font-sans font-medium text-success items-center gap-1 bg-success/10 px-2 py-1 rounded border border-success/25">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}

        {/* Provider indicator */}
        <button
          type="button"
          onClick={onOpenProviderSettings}
          title="AI provider settings"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-[#111915] border border-white/[0.1] hover:border-accent/40 text-zinc-200 transition-colors"
        >
          <Cpu className="w-3 h-3 text-accent" />
          <span>{providerBadgeText}</span>
        </button>

        {/* New custom investigation */}
        <button
          type="button"
          onClick={onNewCustomInvestigation}
          title="Investigate your own incident"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-accent/15 border border-accent/35 hover:bg-accent/25 text-accent transition-all duration-150 active:scale-[0.98] font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Investigation</span>
        </button>

        {/* Scenario selector */}
        <select
          value={currentScenario}
          onChange={(e) => onScenarioChange(e.target.value)}
          aria-label="Select incident scenario"
          className="bg-[#111915] border border-white/[0.1] text-xs rounded-lg px-2.5 py-1.5 text-foreground font-sans focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/40 cursor-pointer transition-colors max-w-[165px] sm:max-w-none"
        >
          <option value="scenario-1">Scenario 1: DB Pool Exhaustion</option>
          <option value="scenario-2">Scenario 2: Gateway Timeout</option>
          <option value="scenario-3">Scenario 3: Auth Rate Storm</option>
          <option value="custom">Custom / Empty Workspace</option>
        </select>

        <button
          type="button"
          onClick={onResetInvestigation}
          title="Reset investigation"
          aria-label="Reset investigation"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#111915] border border-white/[0.1] hover:border-white/[0.2] text-muted hover:text-foreground transition-all duration-150 active:scale-[0.98] font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>

        <button
          type="button"
          onClick={onOpenPostmortem}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#121C17] border border-white/[0.1] hover:border-accent/40 hover:bg-[#16231D] text-foreground transition-all duration-150 active:scale-[0.98] font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FileText className="w-3.5 h-3.5 text-accent" />
          <span className="hidden sm:inline">Postmortem Studio</span>
        </button>
      </div>
    </header>
  );
}
