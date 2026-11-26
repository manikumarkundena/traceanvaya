"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  Cpu,
  Layers,
  Search,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  cardRevealVariants,
  EASE_OUT_EXPO,
  maskedLineVariants,
  staggerContainerVariants,
  VIEWPORT_ONCE,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const CANVAS_STATES = [
  { status: "INVESTIGATING", color: "text-info", dot: "bg-info" },
  { status: "HYPOTHESIS_FORMED", color: "text-accent", dot: "bg-accent" },
  { status: "MITIGATED", color: "text-success", dot: "bg-success" },
] as const;

const REPLAY_STEPS = [
  { step: 3, pct: "22%" },
  { step: 7, pct: "52%" },
  { step: 11, pct: "79%" },
] as const;

export function FeatureBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const [tick, setTick] = useState(0);

  // Subtle coordinated cycle only when section is visible and motion is enabled
  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(interval);
  }, [isInView, prefersReducedMotion]);

  const activeCanvas = CANVAS_STATES[tick];
  const activeReplay = REPLAY_STEPS[tick];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="motion-safe-reveal text-xs font-mono text-accent uppercase tracking-widest mb-3"
        >
          System Capabilities
        </motion.div>
        <h2 className="section-heading font-bold text-foreground overflow-hidden">
          <motion.span
            variants={maskedLineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="motion-safe-reveal block"
          >
            Built for technical precision, not generic chat.
          </motion.span>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.45, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="motion-safe-reveal text-muted mt-4 text-sm sm:text-base font-sans leading-relaxed"
        >
          TraceAnvaya coordinates structured agents, deterministic log parsers, and synchronized
          state canvases so engineering teams can diagnose production outages with evidence grounding.
        </motion.p>
      </div>

      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Card 1: AI Investigator */}
        <motion.div variants={cardRevealVariants} className="motion-safe-reveal md:col-span-2">
          <GlassCard spotlight sweep className="p-6 sm:p-8 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-4 shadow-[inset_0_1px_0_0_rgba(94,234,212,0.2)]">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-display tracking-tight">
                  AI Investigator
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
                  Pydantic AI agent equipped with structured tools to query logs, isolate anomalies,
                  and update shared investigation state in real-time. Every diagnostic finding references
                  concrete evidence identifiers.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-background/90 border border-white/[0.07] font-mono text-xs space-y-2.5">
                <div className="flex items-center justify-between text-muted text-[11px]">
                  <span className="text-accent flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    tool: search_logs(query=&quot;lease timeout&quot;)
                  </span>
                  <span className="text-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    2 matches
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] bg-surface/80 p-2.5 rounded border border-white/[0.06]">
                  <div
                    className={cn(
                      "px-1.5 py-0.5 rounded transition-colors duration-300",
                      tick === 0 ? "bg-accent/10 text-foreground" : "text-foreground/85"
                    )}
                  >
                    <span className="text-accent font-semibold">[ev-105]</span> HikariPool-1: Connection lease timeout after 30000ms
                  </div>
                  <div
                    className={cn(
                      "px-1.5 py-0.5 rounded transition-colors duration-300",
                      tick >= 1 ? "bg-accent/10 text-foreground" : "text-foreground/85"
                    )}
                  >
                    <span className="text-accent font-semibold">[ev-106]</span> SQLTransientConnectionException: HikariPool-1 unavailable
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 2: Investigation Canvas */}
        <motion.div variants={cardRevealVariants} className="motion-safe-reveal">
          <GlassCard spotlight className="p-6 sm:p-8 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-display tracking-tight">
                  Investigation Canvas
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
                  Bidirectional state between UI and AI. Manual edits in the browser are recognized
                  by the agent on subsequent turns via typed <code>StateDeps</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-background/90 border border-white/[0.07] text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-[10px] text-muted">
                  <span>STATE CONTRACT</span>
                  <span className="text-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    SYNCHRONIZED
                  </span>
                </div>
                <div className="text-foreground text-[11px] flex flex-wrap items-center gap-1.5">
                  <span>Severity:</span>
                  <span className="text-critical font-bold">CRITICAL</span>
                  <span className="text-muted">&bull;</span>
                  <span className={cn("inline-flex items-center gap-1 font-semibold transition-colors duration-300", activeCanvas.color)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", activeCanvas.dot)} />
                    {activeCanvas.status}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 3: Evidence Explorer */}
        <motion.div variants={cardRevealVariants} className="motion-safe-reveal">
          <GlassCard spotlight className="p-6 sm:p-8 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-lg bg-info/10 border border-info/25 flex items-center justify-center text-info mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-display tracking-tight">
                  Evidence Explorer
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
                  High-throughput log parser supporting TXT, LOG, and JSON lines with automatic secret
                  redaction and anomaly isolation.
                </p>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] bg-background/90 p-3 rounded-lg border border-white/[0.07]">
                <div
                  className={cn(
                    "p-1.5 rounded transition-colors duration-300 border",
                    tick % 2 === 0
                      ? "bg-accent/10 border-accent/25"
                      : "bg-transparent border-transparent"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-accent font-bold">ev-104</span>
                    <span className="text-warning text-[9px] px-1.5 py-0.5 rounded bg-warning/10 border border-warning/20">
                      WARN
                    </span>
                  </div>
                  <p className="text-muted truncate mt-0.5">
                    Slow query: SELECT * FROM ledger_entries...
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 4: Incident Replay */}
        <motion.div variants={cardRevealVariants} className="motion-safe-reveal">
          <GlassCard spotlight className="p-6 sm:p-8 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-4">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-display tracking-tight">
                  Incident Replay
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
                  Chronological timeline player. Step through events before, during, and after
                  cascading failures to observe how anomalies propagated.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-background/90 border border-white/[0.07] font-mono text-xs space-y-2">
                <div className="flex justify-between text-[10px] text-muted">
                  <span>TIMELINE SCRUBBER</span>
                  <span className="text-accent">STEP {activeReplay.step} OF 14</span>
                </div>
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-accent h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: activeReplay.pct }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 5: Human Approval Gate */}
        <motion.div variants={cardRevealVariants} className="motion-safe-reveal">
          <GlassCard spotlight className="p-6 sm:p-8 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/25 flex items-center justify-center text-success mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-display tracking-tight">
                  Human Approval Gate
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
                  Remediations require explicit operator authorization. Propose fixes, review risk
                  levels, and record decisions without raw shell execution.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-success bg-background/90 p-3 rounded-lg border border-white/[0.07]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  <span>Operator Approval</span>
                </span>
                <span className="text-[10px] bg-warning/15 text-warning px-2 py-0.5 rounded border border-warning/30 font-bold shadow-[0_0_12px_-3px_rgba(251,191,36,0.35)]">
                  PENDING
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
