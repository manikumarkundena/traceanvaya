import React from "react";
import { Cpu, Layers, Search, RotateCcw, Shield, CheckCircle2, Play } from "lucide-react";

export function FeatureBento() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
          System Capabilities
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Built for engineering precision, not generic chat.
        </h2>
        <p className="text-muted mt-4 text-sm sm:text-base">
          TraceAnvaya coordinates structured agents, deterministic log parsers, and synchronized
          state canvases so you can diagnose production outages with forensic certainty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: AI Investigator */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">AI Investigator</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Pydantic AI agent equipped with structured tools to query logs, isolate anomalies,
              and update shared investigation state in real-time. Every insight references
              deterministic evidence IDs.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background border border-border font-mono text-xs text-muted space-y-1.5">
            <div className="text-accent flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Tool Execution: search_logs(query="lease timeout")</span>
            </div>
            <div className="text-foreground">
              Matches: [ev-105] HikariPool lease timeout, [ev-106] SQLTransientConnectionException
            </div>
          </div>
        </div>

        {/* Card 2: Shared State Canvas */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center text-accent-secondary mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Investigation Canvas</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Bidirectional synchronized state between UI and AI. Edits made in the browser
              are instantly recognized by the agent on subsequent turns.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-background border border-border text-xs font-mono">
            <span className="text-muted block text-[10px]">SYNC STATUS</span>
            <span className="text-success font-semibold">StateDeps[InvestigationState]</span>
          </div>
        </div>

        {/* Card 3: Evidence Explorer */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center text-info mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Evidence Explorer</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              High-throughput log parser supporting TXT, LOG, and JSON lines with automatic secret
              redaction and anomaly isolation.
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-muted pt-2 border-t border-border">
            <span>Deterministic IDs</span>
            <span className="text-foreground font-bold">ev-001 ... ev-999</span>
          </div>
        </div>

        {/* Card 4: Incident Replay */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Incident Replay</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Chronological timeline player. Step through events before, during, and after
              cascading failures to observe how anomalies propagated.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-accent">
            <Play className="w-3.5 h-3.5" />
            <span>Step-by-step scrubber</span>
          </div>
        </div>

        {/* Card 5: Human Approval & Postmortem */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Human Approval Gate</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Remediations require explicit operator approval. Propose fixes, review risk
              levels, and record decisions without raw shell execution.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-success">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Unsafe Shell Execution</span>
          </div>
        </div>
      </div>
    </section>
  );
}
