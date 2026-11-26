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
} from "lucide-react";
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
  const isInView = useInView(containerRef, { amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(2);

  // Smooth scroll-linked depth settling cleanly into flat presentation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);

  // Restrained cycle pausing when off-screen
  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isInView, prefersReducedMotion]);

  const activeStep = DEMO_STEPS[stepIndex];

  return (
    <div ref={containerRef} className="w-full mt-14 sm:mt-20 [perspective:1200px]">
      <motion.div
        style={prefersReducedMotion ? undefined : { rotateX, scale, y }}
        className="relative"
      >
        {/* Crisp Window Frame with Selective Glossy Top Highlight */}
        <div className="relative rounded-xl border border-white/[0.12] bg-gradient-to-b from-[#111915]/95 to-[#080E0B]/98 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_24px_64px_-12px_rgba(0,0,0,0.7)] overflow-hidden font-mono text-xs">
          {/* Fine Specular Top Edge Reflection */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-20"
          />

          {/* Window Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#121D18] via-[#0E1713] to-[#121D18] border-b border-white/[0.08] relative">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-critical/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-success/80 inline-block" />
              <span className="ml-2 text-xs text-foreground/80 font-sans font-medium">
                TraceAnvaya / Investigation workspace
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 font-bold uppercase tracking-wider">
                SYNTHETIC DEMO
              </span>
            </div>
          </div>

          {/* 3-Panel Product Composition */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[390px] bg-background/95 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {/* Left Panel: Navigation (cols 1-3) */}
            <div className="md:col-span-3 bg-surface/50 p-4 space-y-1.5 font-sans">
              <div className="px-3 py-2 rounded-lg bg-surface-elevated border border-accent/30 text-accent font-semibold text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Investigation</span>
              </div>
              <div className="px-3 py-2 rounded-lg text-muted hover:text-foreground text-xs flex items-center gap-2 transition-colors">
                <Search className="w-3.5 h-3.5" />
                <span>Evidence explorer</span>
              </div>
              <div className="px-3 py-2 rounded-lg text-muted hover:text-foreground text-xs flex items-center gap-2 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Incident replay</span>
              </div>
              <div className="px-3 py-2 rounded-lg text-muted hover:text-foreground text-xs flex items-center gap-2 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Resolution gate</span>
              </div>
              <div className="px-3 py-2 rounded-lg text-muted hover:text-foreground text-xs flex items-center gap-2 transition-colors">
                <FileText className="w-3.5 h-3.5" />
                <span>Postmortem studio</span>
              </div>

              <div className="pt-6 border-t border-white/[0.06] mt-6 font-mono text-[11px] text-muted space-y-1">
                <div>Session: session-884</div>
                <div>Service: order-billing</div>
              </div>
            </div>

            {/* Center Panel: AI Reasoning (cols 4-8) */}
            <div className="md:col-span-6 p-4 sm:p-5 flex flex-col justify-between space-y-4 font-sans bg-[#080D0B]">
              <div className="space-y-3">
                <div className="text-xs font-mono text-muted flex items-center justify-between">
                  <span className="font-semibold text-foreground">AI Investigator</span>
                  <span className="text-[10px] text-accent">Pydantic AI StateDeps</span>
                </div>

                {/* User Prompt */}
                <div className="flex justify-end">
                  <div className="p-3 rounded-lg bg-surface-elevated border border-white/[0.08] text-xs text-foreground max-w-sm">
                    Investigate the HTTP 500 error spike.
                  </div>
                </div>

                {/* Tool Execution Activity Card */}
                <div className="p-3.5 rounded-lg bg-[#0C1411] border border-accent/25 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-accent font-semibold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      Evidence correlation
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border transition-colors duration-200",
                        activeStep.badge === "EXECUTING"
                          ? "text-warning bg-warning/10 border-warning/20"
                          : "text-success bg-success/10 border-success/20"
                      )}
                    >
                      {activeStep.badge === "SYNCHRONIZED" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {activeStep.badge}
                    </span>
                  </div>

                  <div className="text-accent text-[11px] bg-background/90 px-2 py-1 rounded border border-white/[0.06]">
                    {activeStep.tool}
                  </div>

                  <p className="text-foreground text-xs font-sans leading-relaxed">
                    {activeStep.summary}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-muted">
                <span className="flex items-center gap-1.5 text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  State synchronized via AG-UI protocol
                </span>
                <Link
                  href="/workspace"
                  className="text-accent hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Inspect full workspace</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Right Panel: Investigation State (cols 9-12) */}
            <div className="md:col-span-3 p-4 bg-surface/40 space-y-4 font-mono text-xs">
              <div className="text-xs font-semibold text-foreground font-sans">
                Investigation state
              </div>

              <div className="space-y-1">
                <div className="text-[11px] text-muted">Severity</div>
                <div className="text-critical font-bold text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-critical" />
                  CRITICAL
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] text-muted">Status</div>
                <div className="text-success font-semibold text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  {activeStep.statusLabel}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <div className="text-[11px] text-muted">Correlated Evidence</div>
                <div className="flex flex-wrap gap-1 text-[11px]">
                  {EVIDENCE_IDS.map((evId, idx) => {
                    const isHighlighted = idx <= activeStep.activeEvidenceIndex;
                    return (
                      <span
                        key={evId}
                        className={cn(
                          "px-1.5 py-0.5 rounded border font-bold transition-all duration-200",
                          isHighlighted
                            ? "bg-accent/15 text-accent border-accent/30"
                            : "bg-surface text-muted border-white/[0.06]"
                        )}
                      >
                        {evId}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/[0.06] text-[11px]">
                <div className="text-muted">Working Hypothesis</div>
                <p className="text-foreground font-sans leading-relaxed text-[11px]">
                  Unindexed batch reconciliation query holding locks on ledger table.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
