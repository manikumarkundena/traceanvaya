"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Network,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
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
    <section id="architecture" className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto w-full relative">
      {/* Guaranteed 100% visible Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-white/[0.08] text-xs font-mono text-accent uppercase tracking-widest mb-4 shadow-sm">
          <Network className="w-3.5 h-3.5 text-accent" />
          <span>Clean Architecture & Protocol</span>
        </div>
        <h2 className="section-heading font-bold text-foreground">
          AG-UI Event Protocol & Pydantic AI StateDeps
        </h2>
        <p className="text-muted mt-4 text-sm sm:text-base md:text-lg font-sans leading-relaxed">
          No generic LLM wrapper. TraceAnvaya connects Next.js CopilotKit to a typed Pydantic AI
          agent through official AG-UI streaming protocol events with verified bidirectional state synchronization.
        </p>
      </div>

      <GlassCard className="p-7 sm:p-12 shadow-2xl relative overflow-hidden" elevate={false}>
        {/* Ambient atmospheric glow */}
        <div
          aria-hidden="true"
          className="absolute -top-24 right-0 w-96 h-96 bg-gradient-to-b from-accent/15 to-transparent pointer-events-none rounded-full blur-3xl"
        />

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-3 items-center font-mono relative z-10">
          {/* Layer 1: Next.js Frontend (cols 1-3) */}
          <div className="lg:col-span-3 p-6 rounded-2xl border border-white/[0.1] bg-[#0E1713]/95 space-y-4 shadow-lg">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="font-semibold tracking-wider">LAYER 01</span>
              <span className="text-[10px] text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/25 font-bold">
                BROWSER CLIENT
              </span>
            </div>
            <h4 className="text-lg font-bold text-foreground font-display tracking-tight">
              Next.js 15 & CopilotKit
            </h4>
            <div className="space-y-2 text-xs text-muted font-sans">
              <div className="flex items-center gap-2 text-foreground text-xs">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="font-semibold">Investigation Canvas & Explorer</span>
              </div>
              <p className="text-[11.5px] text-muted leading-relaxed">
                App Router endpoint <code>/api/copilotkit</code> scopes <code>CopilotRuntime</code> and handles SSE communication.
              </p>
              <div className="pt-2 border-t border-white/[0.08] text-[11px] font-mono text-accent">
                React 19 &bull; Zustand Shared State
              </div>
            </div>
          </div>

          {/* Protocol Flow 1: HTTP / SSE (cols 4) */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-2 text-accent relative py-2 lg:py-0">
            <div className="hidden lg:flex flex-col items-center gap-1.5 text-xs">
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="w-5 h-5 text-accent" />
              </motion.div>
              <span className="text-[9.5px] uppercase tracking-wider text-muted font-mono font-bold">HTTP/SSE</span>
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowUp className="w-5 h-5 text-accent" />
              </motion.div>
            </div>
            <div className="lg:hidden flex items-center gap-2 text-xs py-2 font-mono">
              <span className="text-accent font-semibold">↕ HTTP / SSE Stream</span>
            </div>
          </div>

          {/* Layer 2: AG-UI Adapter Bridge (cols 5-7) */}
          <div className="lg:col-span-3 p-6 rounded-2xl border border-accent/50 bg-background/95 space-y-4 shadow-xl relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
            />
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="font-semibold tracking-wider">PROTOCOL BRIDGE</span>
              <span className="text-[10px] text-success bg-success/15 px-2.5 py-0.5 rounded-full border border-success/30 font-bold">
                AG-UI SSE
              </span>
            </div>
            <h4 className="text-lg font-bold text-accent font-display tracking-tight flex items-center justify-between">
              <span>AG-UI Event Stream</span>
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            </h4>
            <div className="p-3.5 rounded-xl bg-surface/90 border border-white/[0.08] text-xs space-y-2">
              <div className="text-muted flex items-center justify-between text-[11px]">
                <span>Standard Event Specification:</span>
                <span className="text-accent font-bold">v1.0.0</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-foreground">
                {PROTOCOL_EVENTS.map((evt, idx) => (
                  <div
                    key={evt}
                    className={cn(
                      "px-2 py-1 rounded-md transition-all duration-300 font-mono text-[10px]",
                      idx === activeEventIndex
                        ? "bg-accent/25 text-accent font-bold border border-accent/50 shadow-[0_0_10px_-2px_rgba(94,234,212,0.6)]"
                        : "text-muted/80 bg-background/60"
                    )}
                  >
                    &bull; {evt}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Protocol Flow 2: Typed StateDeps (cols 8) */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-2 text-accent relative py-2 lg:py-0">
            <div className="hidden lg:flex flex-col items-center gap-1.5 text-xs">
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <ArrowDown className="w-5 h-5 text-accent" />
              </motion.div>
              <span className="text-[9.5px] uppercase tracking-wider text-muted font-mono font-bold">TYPED</span>
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <ArrowUp className="w-5 h-5 text-accent" />
              </motion.div>
            </div>
            <div className="lg:hidden flex items-center gap-2 text-xs py-2 font-mono">
              <span className="text-accent font-semibold">↕ StateDeps Synchronization</span>
            </div>
          </div>

          {/* Layer 3: Python Backend (cols 9-11) */}
          <div className="lg:col-span-3 p-6 rounded-2xl border border-white/[0.1] bg-[#0E1713]/95 space-y-4 shadow-lg">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="font-semibold tracking-wider">LAYER 02</span>
              <span className="text-[10px] text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/25 font-bold">
                PYTHON BACKEND
              </span>
            </div>
            <h4 className="text-lg font-bold text-foreground font-display tracking-tight">
              FastAPI & Pydantic AI
            </h4>
            <div className="space-y-2 text-xs font-sans">
              <div className="text-xs text-foreground flex items-center gap-2 font-mono">
                <Cpu className="w-4 h-4 text-accent" />
                <span className="font-semibold">StateDeps[InvestigationState]</span>
              </div>
              <p className="text-[11.5px] text-muted leading-relaxed">
                Deterministic log parser with secret redaction and typed agent tools (`search_logs`, `propose_remediation`).
              </p>
              <div className="pt-2 border-t border-white/[0.08] text-[11px] font-mono text-muted flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-accent" />
                <span>Async SQLite & PostgreSQL (Alembic)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Footnote */}
        <div className="mt-10 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-muted gap-3">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            Official AG-UI protocol events verified against specification 1.0.0
          </span>
          <span className="text-accent font-semibold">Zero unsafe shell dispatch &bull; Human-gated remediation</span>
        </div>
      </GlassCard>
    </section>
  );
}
