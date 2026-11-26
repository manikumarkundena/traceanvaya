"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUp, Cpu, Database, GitBranch, Layers, ShieldCheck, Terminal } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { EASE_OUT_EXPO, VIEWPORT_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PROTOCOL_EVENTS = [
  "RUN_STARTED",
  "TOOL_CALL_START",
  "TOOL_CALL_RESULT",
  "STATE_SNAPSHOT",
  "STATE_DELTA",
  "RUN_FINISHED",
] as const;

export function ArchitectureDiagram() {
  const prefersReducedMotion = useReducedMotion();
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % PROTOCOL_EVENTS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section id="architecture" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        className="motion-safe-reveal text-center max-w-3xl mx-auto mb-16"
      >
        <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2.5">
          Clean Architecture & Protocol
        </div>
        <h2 className="section-heading font-bold text-foreground">
          AG-UI Event Protocol & Pydantic AI StateDeps
        </h2>
        <p className="text-muted mt-4 text-sm sm:text-base font-sans leading-relaxed">
          No generic LLM wrapper. TraceAnvaya connects Next.js CopilotKit to a typed Pydantic AI
          agent through official AG-UI streaming protocol events.
        </p>
      </motion.div>

      <GlassCard className="p-6 sm:p-10 shadow-2xl relative overflow-hidden" elevate={false}>
        {/* Subtle background ambient beam */}
        <div
          aria-hidden="true"
          className="absolute -top-24 right-0 w-96 h-96 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none rounded-full blur-3xl"
        />

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 lg:gap-2 items-center font-mono relative z-10">
          {/* Box 1: Frontend Client (cols 1-3) */}
          <div className="lg:col-span-3 p-5 rounded-xl border border-white/[0.08] bg-[#0E1713]/90 space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>LAYER 01</span>
              <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                BROWSER CLIENT
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground font-display tracking-tight">
              Next.js 15 & CopilotKit
            </h4>
            <div className="space-y-1.5 text-xs text-muted font-sans">
              <div className="flex items-center gap-1.5 text-foreground text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-accent" />
                <span>Investigation Canvas & Explorer</span>
              </div>
              <div className="text-[11px] text-muted">
                Scoped <code>CopilotRuntime</code> via App Router endpoint <code>/api/copilotkit</code>
              </div>
            </div>
          </div>

          {/* Protocol Flow 1 (cols 4) */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-1 text-accent relative py-2 lg:py-0">
            <div className="hidden lg:flex flex-col items-center gap-1 text-[10px]">
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="w-4 h-4 text-accent" />
              </motion.div>
              <span className="text-[9px] uppercase tracking-wider text-muted font-mono">HTTP/SSE</span>
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowUp className="w-4 h-4 text-accent" />
              </motion.div>
            </div>
            <div className="lg:hidden flex items-center gap-2 text-xs py-2">
              <span className="text-accent">↕ HTTP / SSE Stream</span>
            </div>
          </div>

          {/* Box 2: AG-UI Adapter Bridge (cols 5-7) */}
          <div className="lg:col-span-3 p-5 rounded-xl border border-accent/40 bg-background/90 space-y-3 shadow-lg relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"
            />
            <div className="flex items-center justify-between text-xs text-muted">
              <span>PROTOCOL BRIDGE</span>
              <span className="text-[10px] text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                AG-UI SSE
              </span>
            </div>
            <h4 className="text-base font-bold text-accent font-display tracking-tight flex items-center justify-between">
              <span>AG-UI Event Stream</span>
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            </h4>
            <div className="p-3 rounded-lg bg-surface/90 border border-white/[0.07] text-[10px] space-y-1.5">
              <div className="text-muted flex items-center justify-between">
                <span>Active Protocol Event:</span>
                <span className="text-accent font-bold">ag-ui 1.0.0</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-foreground">
                {PROTOCOL_EVENTS.map((evt, idx) => (
                  <div
                    key={evt}
                    className={cn(
                      "px-1.5 py-0.5 rounded transition-all duration-300 font-mono text-[9.5px]",
                      idx === activeEventIndex
                        ? "bg-accent/20 text-accent font-bold border border-accent/40 shadow-[0_0_8px_-2px_rgba(94,234,212,0.5)]"
                        : "text-muted"
                    )}
                  >
                    &bull; {evt}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Protocol Flow 2 (cols 8) */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-1 text-accent relative py-2 lg:py-0">
            <div className="hidden lg:flex flex-col items-center gap-1 text-[10px]">
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <ArrowDown className="w-4 h-4 text-accent" />
              </motion.div>
              <span className="text-[9px] uppercase tracking-wider text-muted font-mono">TYPED</span>
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <ArrowUp className="w-4 h-4 text-accent" />
              </motion.div>
            </div>
            <div className="lg:hidden flex items-center gap-2 text-xs py-2">
              <span className="text-accent">↕ StateDeps Synchronization</span>
            </div>
          </div>

          {/* Box 3: Agentic Backend (cols 9-11) */}
          <div className="lg:col-span-3 p-5 rounded-xl border border-white/[0.08] bg-[#0E1713]/90 space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>LAYER 02</span>
              <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                PYTHON BACKEND
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground font-display tracking-tight">
              FastAPI & Pydantic AI
            </h4>
            <div className="space-y-1.5 text-xs font-sans">
              <div className="text-[11px] text-foreground flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-accent" />
                <span>StateDeps[InvestigationState]</span>
              </div>
              <div className="text-[11px] text-muted flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-accent" />
                <span>Async SQLite & PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote distinguishing schema */}
        <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-muted gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Official protocol events verified against ag-ui-protocol 1.0.0
          </span>
          <span>Zero unsafe shell dispatch &bull; Human-gated remediation</span>
        </div>
      </GlassCard>
    </section>
  );
}
