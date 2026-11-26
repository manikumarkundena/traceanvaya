"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import {
  Cpu,
  Layers,
  Search,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const CANVAS_STATES = [
  { status: "INVESTIGATING", color: "text-info", sync: "SYNCING", dot: "bg-info" },
  { status: "HYPOTHESIS_FORMED", color: "text-accent", sync: "SYNCHRONIZED", dot: "bg-accent" },
  { status: "MITIGATION_READY", color: "text-success", sync: "SYNCHRONIZED", dot: "bg-success" },
] as const;

const REPLAY_STEPS = [
  { step: 3, pct: "22%", label: "ev-104 WARN", time: "14:15:32" },
  { step: 7, pct: "52%", label: "ev-105 ERROR", time: "14:15:45" },
  { step: 11, pct: "79%", label: "ev-110 CRIT", time: "14:16:15" },
] as const;

export function FeatureBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, [isInView, prefersReducedMotion]);

  const canvasCycle = CANVAS_STATES[tick % CANVAS_STATES.length];
  const replayCycle = REPLAY_STEPS[tick % REPLAY_STEPS.length];
  const activeEvidenceRow = tick % 2;
  const activeApprovalPulse = tick % 2 === 1;

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto w-full relative"
    >
      {/* Editorial Section Heading - Guaranteed 100% visible across SSR, full-page capture & reduced motion */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-white/[0.08] text-xs font-mono text-accent uppercase tracking-widest mb-4 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-accent" />
          <span>System Capabilities</span>
        </div>
        <h2 className="section-heading font-bold text-foreground">
          Built for technical precision, not generic chat.
        </h2>
        <p className="text-muted mt-4 text-sm sm:text-base md:text-lg font-sans leading-relaxed">
          TraceAnvaya coordinates structured agents, deterministic log parsers, and synchronized
          state canvases so engineering teams can diagnose production outages with evidence grounding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
        {/* Card 1: Dominant AI Investigator (Col span 2) */}
        <div className="md:col-span-2">
          <GlassCard spotlight sweep className="p-7 sm:p-9 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-5 shadow-[inset_0_1px_0_0_rgba(94,234,212,0.3)]">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 font-display tracking-tight">
                  AI Investigator
                </h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed mb-6 font-sans">
                  Autonomous Pydantic AI agent equipped with structured tools to query logs, isolate anomalies,
                  and update shared investigation state in real-time. Every diagnostic finding references
                  concrete evidence identifiers grounded in application telemetry.
                </p>
              </div>

              {/* Rich Technical Visualization */}
              <div className="p-4 sm:p-5 rounded-xl bg-background/90 border border-white/[0.09] font-mono text-xs space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-muted text-xs pb-2 border-b border-white/[0.07]">
                  <span className="text-accent flex items-center gap-2 font-semibold">
                    <Terminal className="w-4 h-4" />
                    <span>tool: search_logs(query=&quot;connection timeout&quot;)</span>
                  </span>
                  <span className="text-success flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    2 matches isolated
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div
                    className={cn(
                      "px-3 py-2.5 rounded-lg border transition-all duration-300",
                      activeEvidenceRow === 0
                        ? "bg-accent/15 border-accent/40 text-foreground shadow-sm"
                        : "bg-surface/85 border-white/[0.06] text-muted"
                    )}
                  >
                    <span className="text-accent font-bold">[ev-105]</span> HikariPool-1: Connection lease timeout after 30000ms &bull; <span className="text-warning">WARN</span>
                  </div>
                  <div
                    className={cn(
                      "px-3 py-2.5 rounded-lg border transition-all duration-300",
                      activeEvidenceRow === 1
                        ? "bg-accent/15 border-accent/40 text-foreground shadow-sm"
                        : "bg-surface/85 border-white/[0.06] text-muted"
                    )}
                  >
                    <span className="text-accent font-bold">[ev-106]</span> SQLTransientConnectionException: HikariPool-1 unavailable &bull; <span className="text-critical">CRITICAL</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Card 2: Investigation Canvas */}
        <div>
          <GlassCard spotlight className="p-7 sm:p-8 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 font-display tracking-tight">
                  Investigation Canvas
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
                  Bidirectional state synchronization between UI and AI. Manual edits in the browser are recognized
                  by the agent on subsequent turns via typed <code>StateDeps</code>.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-background/90 border border-white/[0.09] text-xs font-mono space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-accent" />
                    STATE CONTRACT
                  </span>
                  <span className="text-success font-bold">{canvasCycle.sync}</span>
                </div>
                <div className="text-foreground text-xs flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.07]">
                  <span>Severity:</span>
                  <span className="text-critical font-bold">CRITICAL</span>
                  <span>&bull;</span>
                  <span className={cn("font-semibold transition-colors duration-300 flex items-center gap-1.5", canvasCycle.color)}>
                    <span className={cn("w-2 h-2 rounded-full", canvasCycle.dot)} />
                    {canvasCycle.status}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Card 3: Evidence Explorer */}
        <div>
          <GlassCard spotlight className="p-7 sm:p-8 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-info/15 border border-info/30 flex items-center justify-center text-info mb-5">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 font-display tracking-tight">
                  Evidence Explorer
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
                  High-throughput log parser supporting TXT, LOG, and JSON lines with automatic secret
                  redaction and anomaly isolation.
                </p>
              </div>
              <div className="space-y-2 font-mono text-xs bg-background/90 p-3.5 rounded-xl border border-white/[0.09]">
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors duration-300",
                    activeEvidenceRow === 0 ? "bg-accent/15" : "bg-transparent"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-accent font-bold">ev-104</span>
                    <span className="text-warning text-[10px] px-2 py-0.2 rounded bg-warning/15 border border-warning/30 font-bold">
                      WARN
                    </span>
                  </div>
                  <p className="text-muted truncate text-[11px]">Slow query detected: SELECT * FROM ledger_entries...</p>
                </div>
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors duration-300",
                    activeEvidenceRow === 1 ? "bg-accent/15" : "bg-transparent"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-accent font-bold">ev-105</span>
                    <span className="text-critical text-[10px] px-2 py-0.2 rounded bg-critical/15 border border-critical/30 font-bold">
                      ERROR
                    </span>
                  </div>
                  <p className="text-muted truncate text-[11px]">HikariPool-1: Connection lease timeout...</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Card 4: Incident Replay */}
        <div>
          <GlassCard spotlight className="p-7 sm:p-8 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-5">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 font-display tracking-tight">
                  Incident Replay
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
                  Chronological timeline player. Step through events before, during, and after
                  cascading failures to observe how anomalies propagated.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-background/90 border border-white/[0.09] font-mono text-xs space-y-2.5">
                <div className="flex justify-between text-xs text-muted">
                  <span className="text-foreground font-semibold">{replayCycle.label}</span>
                  <span className="text-accent font-bold">STEP {replayCycle.step} OF 14</span>
                </div>
                <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className="bg-gradient-to-r from-accent via-emerald-400 to-teal-300 h-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: replayCycle.pct }}
                  />
                </div>
                <div className="text-[10px] text-muted text-right">Timestamp: {replayCycle.time} UTC</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Card 5: Human Approval Gate */}
        <div>
          <GlassCard spotlight className="p-7 sm:p-8 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-success/15 border border-success/30 flex items-center justify-center text-success mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 font-display tracking-tight">
                  Human Approval Gate
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
                  Remediations require explicit operator authorization. Propose fixes, review risk
                  levels, and record decisions without raw shell execution.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-success bg-background/90 p-4 rounded-xl border border-white/[0.09]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="font-semibold text-foreground">Operator Approval</span>
                </span>
                <span
                  className={cn(
                    "text-[10.5px] px-2.5 py-1 rounded-md border font-bold transition-all duration-500",
                    activeApprovalPulse
                      ? "bg-warning/25 text-warning border-warning/50 shadow-[0_0_14px_-2px_rgba(251,191,36,0.5)]"
                      : "bg-warning/15 text-warning border-warning/30"
                  )}
                >
                  PENDING
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
