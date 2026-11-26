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
import { Cpu, Search, RotateCcw, ShieldCheck, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DEMO_STEPS = [
  {
    tool: 'search_logs("connection timeout")',
    badge: "EXECUTING",
    statusLabel: "Investigating",
    activeEvidenceIndex: 0,
    summary:
      "Scanning order-billing-service telemetry for connection pool exhaustion patterns...",
  },
  {
    tool: 'correlate_evidence(["ev-104", "ev-105", "ev-106"])',
    badge: "CORRELATED",
    statusLabel: "Hypothesis Formed",
    activeEvidenceIndex: 1,
    summary:
      "HikariCP connection pool exhausted on order-billing-service. Request threads timed out waiting for database connections after 30,000ms.",
  },
  {
    tool: 'update_investigation(status="HYPOTHESIS_FORMED")',
    badge: "SYNCHRONIZED",
    statusLabel: "Hypothesis Formed",
    activeEvidenceIndex: 2,
    summary:
      "HikariCP connection pool exhausted on order-billing-service. Request threads timed out waiting for database connections after 30,000ms.",
  },
];

const EVIDENCE_IDS = ["ev-104", "ev-105", "ev-106"];

export function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.25 });
  const prefersReducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(2);

  // Scroll-linked subtle perspective-to-flat depth
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  // Illustrative synthetic simulation cycle (pauses when offscreen or reduced-motion)
  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 3400);
    return () => clearInterval(interval);
  }, [isInView, prefersReducedMotion]);

  const activeStep = DEMO_STEPS[stepIndex];

  return (
    <div ref={containerRef} className="w-full mt-14 sm:mt-20 [perspective:1400px]">
      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.65, ease: EASE_OUT_EXPO }}
        style={prefersReducedMotion ? undefined : { rotateX, scale }}
        className="motion-safe-reveal relative"
      >
        {/* Ambient emerald glow behind frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 rounded-3xl opacity-55 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 15%, rgba(94, 234, 212, 0.16), rgba(16, 185, 129, 0.06) 50%, transparent 80%)",
          }}
        />

        <div className="relative rounded-2xl border border-white/[0.1] bg-[#0B110E]/90 backdrop-blur-xl shadow-[0_32px_80px_-20px_rgba(0,0,0,0.85),0_0_50px_-15px_rgba(94,234,212,0.14),inset_0_1px_0_0_rgba(255,255,255,0.1)] overflow-hidden font-mono text-xs">
          {/* Illuminated top edge specular highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent z-20"
          />

          {/* Window title bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111A16]/90 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-critical/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-success/80 inline-block" />
              <span className="ml-2 text-xs text-muted font-sans font-medium">
                TraceAnvaya / Investigation workspace
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[10px] text-muted uppercase tracking-wider">
                Illustrative Preview
              </span>
              <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/25 font-bold uppercase tracking-wider">
                SYNTHETIC DEMO
              </span>
            </div>
          </div>

          {/* 3-Panel Realistic Product Composition */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] bg-background/80">
            {/* Left Panel: Workspace Navigation */}
            <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-white/[0.07] bg-surface/50 p-4 space-y-1.5 font-sans">
              <div className="px-3 py-2 rounded-lg bg-surface-elevated border border-accent/30 text-accent font-semibold text-xs flex items-center gap-2 shadow-[inset_0_1px_0_0_rgba(94,234,212,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Investigation</span>
              </div>
              <div className="px-3 py-2 rounded-lg text-muted text-xs flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                <span>Evidence explorer</span>
              </div>
              <div className="px-3 py-2 rounded-lg text-muted text-xs flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Incident replay</span>
              </div>
              <div className="px-3 py-2 rounded-lg text-muted text-xs flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Resolution gate</span>
              </div>
              <div className="px-3 py-2 rounded-lg text-muted text-xs flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Postmortem studio</span>
              </div>

              <div className="pt-6 border-t border-white/[0.06] mt-6 font-mono text-[11px] text-muted space-y-1">
                <div>Session: session-884</div>
                <div>Service: order-billing</div>
              </div>
            </div>

            {/* Center Panel: AI Investigator Conversation */}
            <div className="md:col-span-6 p-4 sm:p-5 flex flex-col justify-between space-y-4 border-b md:border-b-0 md:border-r border-white/[0.07] font-sans">
              <div className="space-y-3">
                <div className="text-xs font-mono text-muted flex items-center justify-between">
                  <span className="font-semibold text-foreground">AI Investigator</span>
                  <span className="text-[10px] text-accent">Pydantic AI StateDeps</span>
                </div>

                {/* User Prompt */}
                <div className="flex justify-end">
                  <div className="p-3 rounded-lg bg-surface-elevated border border-white/[0.08] text-xs text-foreground max-w-sm shadow-sm">
                    Investigate the HTTP 500 error spike.
                  </div>
                </div>

                {/* Animated Illustrative Tool Execution Activity Card */}
                <div className="p-3.5 rounded-lg bg-[#0E1713] border border-accent/25 space-y-2.5 font-mono text-xs shadow-[inset_0_1px_0_0_rgba(94,234,212,0.08)]">
                  <div className="flex items-center justify-between text-accent font-semibold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      Evidence correlation
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border transition-colors duration-300",
                        activeStep.badge === "EXECUTING"
                          ? "text-warning bg-warning/10 border-warning/25"
                          : "text-success bg-success/10 border-success/25"
                      )}
                    >
                      {activeStep.badge === "SYNCHRONIZED" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {activeStep.badge}
                    </span>
                  </div>

                  <div className="text-accent text-[11px] bg-background/90 px-2.5 py-1.5 rounded border border-white/[0.07] flex items-center justify-between">
                    <span className="truncate">{activeStep.tool}</span>
                    {!prefersReducedMotion && activeStep.badge === "EXECUTING" && (
                      <span className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <span className="w-1 h-1 rounded-full bg-accent animate-bounce" />
                        <span
                          className="w-1 h-1 rounded-full bg-accent animate-bounce"
                          style={{ animationDelay: "120ms" }}
                        />
                        <span
                          className="w-1 h-1 rounded-full bg-accent animate-bounce"
                          style={{ animationDelay: "240ms" }}
                        />
                      </span>
                    )}
                  </div>

                  <p className="text-foreground text-xs font-sans leading-relaxed">
                    {activeStep.summary}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted">
                <span className="flex items-center gap-1.5 text-accent">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  State synchronized via AG-UI protocol
                </span>
                <Link
                  href="/workspace"
                  className="group text-accent hover:underline inline-flex items-center gap-1 text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded"
                >
                  <span>Inspect full investigation</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Right Panel: Investigation State */}
            <div className="md:col-span-3 p-4 bg-surface/35 space-y-4 font-mono text-xs">
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
                <div className="text-success font-semibold text-xs flex items-center gap-1.5 transition-all duration-300">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  {activeStep.statusLabel}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/[0.07]">
                <div className="text-[11px] text-muted">Correlated Evidence</div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {EVIDENCE_IDS.map((evId, idx) => {
                    const isHighlighted = idx <= activeStep.activeEvidenceIndex;
                    return (
                      <span
                        key={evId}
                        className={cn(
                          "px-1.5 py-0.5 rounded border font-bold transition-all duration-300",
                          isHighlighted
                            ? "bg-accent/20 text-accent border-accent/45 shadow-[0_0_12px_-3px_rgba(94,234,212,0.45)]"
                            : "bg-surface text-muted border-white/[0.08]"
                        )}
                      >
                        {evId}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/[0.07] text-[11px]">
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
