import React from "react";
import Link from "next/link";
import { Check, FileText } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { InvestigationState } from "./types";

interface WorkspaceHeaderProps {
  canvasState: InvestigationState;
  stateSyncSuccess: boolean;
  currentScenario: string;
  onScenarioChange: (scenario: string) => void;
  onOpenPostmortem: () => void;
}

export function WorkspaceHeader({
  canvasState,
  stateSyncSuccess,
  currentScenario,
  onScenarioChange,
  onOpenPostmortem,
}: WorkspaceHeaderProps) {
  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#0C1411]/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
          <Logo size={24} />
        </Link>
        <div className="h-4 w-px bg-white/[0.1] hidden sm:block" />

        {/* Incident title & status badge */}
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm truncate max-w-[200px] sm:max-w-xs text-foreground font-sans">
            {canvasState.incident_title}
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
              canvasState.severity === "CRITICAL"
                ? "bg-critical/15 text-critical border border-critical/30"
                : canvasState.severity === "HIGH"
                ? "bg-warning/15 text-warning border border-warning/30"
                : "bg-info/15 text-info border border-info/30"
            }`}
          >
            {canvasState.severity}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-accent border border-white/[0.08]">
            {canvasState.status}
          </span>
        </div>
      </div>

      {/* Right workspace actions */}
      <div className="flex items-center gap-2.5">
        {stateSyncSuccess && (
          <span className="text-xs font-mono text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded border border-success/30 animate-pulse">
            <Check className="w-3 h-3" /> State Synced
          </span>
        )}

        {/* Scenario selector */}
        <div className="relative">
          <select
            value={currentScenario}
            onChange={(e) => onScenarioChange(e.target.value)}
            className="bg-[#0E1713] border border-white/[0.08] text-xs rounded-md px-2.5 py-1.5 text-foreground font-mono focus:outline-none focus:border-accent/80 focus:ring-1 focus:ring-accent/40 cursor-pointer transition-colors"
          >
            <option value="scenario-1">Scenario 1: DB Pool Exhaustion</option>
            <option value="scenario-2">Scenario 2: Gateway Timeout</option>
            <option value="scenario-3">Scenario 3: Auth Rate Storm</option>
          </select>
        </div>

        <button
          onClick={onOpenPostmortem}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#111A16] border border-white/[0.08] hover:border-accent/40 hover:bg-[#16231D] text-foreground transition-all duration-150 active:scale-95 shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-accent" />
          <span className="hidden sm:inline font-sans">Postmortem Studio</span>
        </button>
      </div>
    </header>
  );
}
