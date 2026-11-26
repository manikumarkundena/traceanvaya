import React from "react";
import { Cpu, Layers, Search, RotateCcw, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Terminal } from "lucide-react";

export function FeatureBento() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
          System Capabilities
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-sans">
          Built for technical precision, not generic chat.
        </h2>
        <p className="text-muted mt-4 text-sm sm:text-base font-sans leading-relaxed">
          TraceAnvaya coordinates structured agents, deterministic log parsers, and synchronized
          state canvases so engineering teams can diagnose production outages with evidence grounding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: AI Investigator */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 font-sans">AI Investigator</h3>
            <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
              Pydantic AI agent equipped with structured tools to query logs, isolate anomalies,
              and update shared investigation state in real-time. Every diagnostic finding references
              concrete evidence identifiers.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background border border-border font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-muted text-[11px]">
              <span className="text-accent flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                tool: search_logs(query=&quot;lease timeout&quot;)
              </span>
              <span className="text-success">2 matches</span>
            </div>
            <div className="text-foreground text-[11px] bg-surface p-2 rounded border border-border">
              [ev-105] HikariPool-1: Connection lease timeout after 30000ms<br />
              [ev-106] SQLTransientConnectionException: HikariPool-1 unavailable
            </div>
          </div>
        </div>

        {/* Card 2: Shared State Canvas */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 font-sans">Investigation Canvas</h3>
            <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
              Bidirectional state between UI and AI. Manual edits in the browser are recognized
              by the agent on subsequent turns via typed <code>StateDeps</code>.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-background border border-border text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-muted">
              <span>STATE CONTRACT</span>
              <span className="text-success">SYNCHRONIZED</span>
            </div>
            <div className="text-foreground text-[11px]">
              Severity: <span className="text-critical font-bold">CRITICAL</span> &bull; Status: <span className="text-accent">HYPOTHESIS_FORMED</span>
            </div>
          </div>
        </div>

        {/* Card 3: Evidence Explorer */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center text-info mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 font-sans">Evidence Explorer</h3>
            <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
              High-throughput log parser supporting TXT, LOG, and JSON lines with automatic secret
              redaction and anomaly isolation.
            </p>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-background p-3 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <span className="text-accent font-bold">ev-104</span>
              <span className="text-warning text-[9px] px-1 rounded bg-warning/10 border border-warning/20">WARN</span>
            </div>
            <p className="text-muted truncate">Slow query detected: SELECT * FROM ledger_entries...</p>
          </div>
        </div>

        {/* Card 4: Incident Replay */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 font-sans">Incident Replay</h3>
            <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
              Chronological timeline player. Step through events before, during, and after
              cascading failures to observe how anomalies propagated.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-background border border-border font-mono text-xs space-y-1">
            <div className="flex justify-between text-[10px] text-muted">
              <span>TIMELINE SCRUBBER</span>
              <span className="text-accent">STEP 3 OF 14</span>
            </div>
            <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[25%]" />
            </div>
          </div>
        </div>

        {/* Card 5: Human Approval & Postmortem */}
        <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 font-sans">Human Approval Gate</h3>
            <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
              Remediations require explicit operator authorization. Propose fixes, review risk
              levels, and record decisions without raw shell execution.
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-success bg-background p-3 rounded-lg border border-border">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>Operator Approval Required</span>
            </span>
            <span className="text-[10px] bg-warning/15 text-warning px-1.5 py-0.5 rounded border border-warning/30 font-bold">
              PENDING
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
