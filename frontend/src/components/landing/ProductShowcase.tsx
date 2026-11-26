"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  Cpu,
  Search,
  RotateCcw,
  ShieldCheck,
  FileText,
  ArrowRight,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DEMO_STEPS = [
  {
    tool: 'search_logs(query="connection timeout", service="order-billing")',
    badge: "EXECUTING",
    statusLabel: "Investigating",
    activeEvidenceIndex: 0,
    summary:
      "HikariCP connection pool exhausted on order-billing-service. Worker threads timed out waiting for available connections after 30,002ms.",
  },
  {
    tool: 'correlate_evidence(["ev-104", "ev-105", "ev-106"])',
    badge: "CORRELATED",
    statusLabel: "Hypothesis Formed",
    activeEvidenceIndex: 1,
    summary:
      "Exclusive locked row query on ledger_entries (ev-104) held open connections for 14.2s, starving HikariPool-1 and escalating to SQLTransientConnectionException (ev-106).",
  },
  {
    tool: 'update_investigation(status="HYPOTHESIS_FORMED")',
    badge: "SYNCHRONIZED",
    statusLabel: "Hypothesis Formed",
    activeEvidenceIndex: 2,
    summary:
      "Working hypothesis established. Proposed mitigation submitted to Human Approval Gate: kill batch PID 41920 and raise connection max pool size.",
  },
];

const EVIDENCE_IDS = ["ev-104", "ev-105", "ev-106"];

export function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(2);

  // Scroll-linked perspective-to-flat transformation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [4, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);

  // Illustrative synthetic simulation cycle
  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isInView, prefersReducedMotion]);

  const activeStep = DEMO_STEPS[stepIndex];

  return (
    <div ref={containerRef} className="w-full mt-16 sm:mt-24 [perspective:1400px]">
      <motion.div
        initial={{ opacity: 0.2, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE_OUT_EXPO }}
        style={prefersReducedMotion ? undefined : { rotateX, scale }}
        className="motion-safe-reveal relative"
      >
        {/* Ambient emerald back-lighting halo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 rounded-3xl opacity-65 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 12%, rgba(94, 234, 212, 0.22), rgba(16, 185, 129, 0.08) 55%, transparent 80%)",
          }}
        />

        {/* Flagship Precision-Engineered Dark Glass Window Frame */}
        <div className="relative rounded-2xl border border-white/[0.12] bg-[#09100D]/95 backdrop-blur-2xl shadow-[0_36px_90px_-20px_rgba(0,0,0,0.9),0_0_60px_-15px_rgba(94,234,212,0.18),inset_0_1px_0_0_rgba(255,255,255,0.14)] overflow-hidden font-mono text-xs">
          {/* Top specular reflection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent z-20"
          />

          {/* Window Title Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#0F1814]/95 border-b border-white/[0.09]">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-critical/85 inline-block" />
              <span className="w-3 h-3 rounded-full bg-warning/85 inline-block" />
              <span className="w-3 h-3 rounded-full bg-success/85 inline-block" />
              <span className="ml-2 text-xs sm:text-sm text-foreground/90 font-sans font-semibold tracking-tight">
                TraceAnvaya / Investigation workspace
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[10.5px] text-muted font-mono tracking-wider">
                Interactive Preview
              </span>
              <span className="text-[10px] text-accent bg-accent/15 px-2.5 py-0.5 rounded border border-accent/35 font-bold uppercase tracking-wider shadow-sm">
                SYNTHETIC DEMO
              </span>
            </div>
          </div>

          {/* 3-Panel Authentic Product Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px] bg-background/90 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
            {/* Panel 1: Navigation Hierarchy (cols 1-3) */}
            <div className="md:col-span-3 bg-surface/60 p-4 sm:p-5 space-y-2 font-sans">
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted mb-3">
                Workspace Views
              </div>
              <div className="px-3.5 py-2.5 rounded-lg bg-surface-elevated border border-accent/40 text-accent font-semibold text-xs flex items-center gap-2.5 shadow-[inset_0_1px_0_0_rgba(94,234,212,0.15)]">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Investigation Canvas</span>
              </div>
              <div className="px-3.5 py-2.5 rounded-lg text-muted/80 text-xs flex items-center gap-2.5 hover:text-foreground transition-colors">
                <Search className="w-4 h-4 text-accent/80" />
                <span>Evidence Explorer</span>
              </div>
              <div className="px-3.5 py-2.5 rounded-lg text-muted/80 text-xs flex items-center gap-2.5 hover:text-foreground transition-colors">
                <RotateCcw className="w-4 h-4 text-accent/80" />
                <span>Incident Replay</span>
              </div>
              <div className="px-3.5 py-2.5 rounded-lg text-muted/80 text-xs flex items-center gap-2.5 hover:text-foreground transition-colors">
                <ShieldCheck className="w-4 h-4 text-accent/80" />
                <span>Resolution Gate</span>
              </div>
              <div className="px-3.5 py-2.5 rounded-lg text-muted/80 text-xs flex items-center gap-2.5 hover:text-foreground transition-colors">
                <FileText className="w-4 h-4 text-accent/80" />
                <span>Postmortem Studio</span>
              </div>

              <div className="pt-6 border-t border-white/[0.08] mt-6 font-mono text-xs text-muted space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Session:</span>
                  <span className="text-foreground">session-884</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Target:</span>
                  <span className="text-accent">order-billing</span>
                </div>
              </div>
            </div>

            {/* Panel 2: Live AI Reasoning Stream (cols 4-8) */}
            <div className="md:col-span-6 p-5 sm:p-6 flex flex-col justify-between space-y-4 font-sans bg-[#090F0D]">
              <div className="space-y-4">
                <div className="text-xs font-mono text-muted flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    AI Investigator Stream
                  </span>
                  <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    Pydantic AI StateDeps
                  </span>
                </div>

                {/* Simulated User Prompt */}
                <div className="flex justify-end">
                  <div className="p-3.5 rounded-xl bg-surface-elevated border border-white/[0.1] text-xs text-foreground max-w-md shadow-md">
                    Investigate the HTTP 500 error spike on order-billing service.
                  </div>
                </div>

                {/* Animated Illustrative Tool Execution Activity Card */}
                <div className="p-4 rounded-xl bg-[#0B1511] border border-accent/35 space-y-3 font-mono text-xs shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(94,234,212,0.12)]">
                  <div className="flex items-center justify-between text-accent font-semibold text-xs">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      <span>Telemetry Diagnostic Trace</span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border transition-colors duration-300 font-bold",
                        activeStep.badge === "EXECUTING"
                          ? "text-warning bg-warning/15 border-warning/35"
                          : "text-success bg-success/15 border-success/35"
                      )}
                    >
                      {activeStep.badge === "SYNCHRONIZED" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {activeStep.badge}
                    </span>
                  </div>

                  <div className="text-accent text-[11px] bg-background/95 px-3 py-2 rounded-lg border border-white/[0.08] flex items-center justify-between">
                    <span className="truncate">{activeStep.tool}</span>
                    {!prefersReducedMotion && activeStep.badge === "EXECUTING" && (
                      <span className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                          style={{ animationDelay: "140ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                          style={{ animationDelay: "280ms" }}
                        />
                      </span>
                    )}
                  </div>

                  <p className="text-foreground text-xs sm:text-sm font-sans leading-relaxed">
                    {activeStep.summary}
                  </p>
                </div>
              </div>

              <div className="pt-3.5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted">
                <span className="flex items-center gap-2 text-accent">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  AG-UI event protocol stream active
                </span>
                <Link
                  href="/workspace"
                  className="group text-accent hover:underline inline-flex items-center gap-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  <span>Launch full investigation workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Panel 3: Shared Canvas State (cols 9-12) */}
            <div className="md:col-span-3 p-5 bg-surface/40 space-y-4 font-mono text-xs">
              <div className="text-xs font-bold text-foreground font-sans tracking-tight">
                Investigation State Canvas
              </div>

              <div className="space-y-1">
                <div className="text-[11px] text-muted">Severity</div>
                <div className="text-critical font-bold text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-critical animate-pulse" />
                  CRITICAL
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] text-muted">Status</div>
                <div className="text-success font-semibold text-xs flex items-center gap-2 transition-all duration-300">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  {activeStep.statusLabel}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                <div className="text-[11px] text-muted">Correlated Evidence</div>
                <div className="flex flex-wrap gap-1.5">
                  {EVIDENCE_IDS.map((evId, idx) => {
                    const isHighlighted = idx <= activeStep.activeEvidenceIndex;
                    return (
                      <span
                        key={evId}
                        className={cn(
                          "px-2 py-0.5 rounded border text-xs font-bold transition-all duration-300",
                          isHighlighted
                            ? "bg-accent/25 text-accent border-accent/55 shadow-[0_0_14px_-3px_rgba(94,234,212,0.5)]"
                            : "bg-surface text-muted border-white/[0.08]"
                        )}
                      >
                        {evId}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1 pt-3 border-t border-white/[0.08] text-[11px]">
                <div className="text-muted">Working Hypothesis</div>
                <p className="text-foreground font-sans leading-relaxed text-xs">
                  Exclusive locked query on ledger_entries holding connections &gt;14s.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
