"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  Cpu,
  Database,
  Network,
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
    }, 2400);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section id="architecture" className="scroll-mt-24 py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto w-full relative">
      {/* Guaranteed 100% visible Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-muted uppercase tracking-widest mb-4">
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

      <GlassCard className="p-6 sm:p-10 relative overflow-hidden" elevate={false}>
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-3 items-center font-mono relative z-10">
          {/* Layer 1: Next.js Frontend (cols 1-3) */}
          <div className="lg:col-span-3 p-5 rounded-xl border border-white/[0.08] bg-[#0A100E] space-y-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="font-semibold tracking-wider text-[11px]">LAYER 01</span>
              <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
                CLIENT RUNTIME
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground font-display tracking-tight">
              Next.js 15 & CopilotKit
            </h4>
            <div className="space-y-2 text-xs text-muted font-sans">
              <div className="flex items-center gap-2 text-foreground text-xs">
                <Terminal className="w-3.5 h-3.5 text-accent" />
                <span className="font-semibold text-xs">Investigation Workspace</span>
              </div>
              <p className="text-[11.5px] text-muted leading-relaxed">
                App Router endpoint <code>/api/copilotkit</code> scopes <code>CopilotRuntime</code> and manages SSE protocol events.
              </p>
              <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-zinc-400">
                React 19 &bull; Zustand Shared State
              </div>
            </div>
          </div>

          {/* Protocol Flow 1: HTTP / SSE (cols 4) */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-2 text-zinc-400 relative py-2 lg:py-0">
            <div className="hidden lg:flex flex-col items-center gap-1.5 text-xs">
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="w-4 h-4 text-accent" />
              </motion.div>
              <span className="text-[9px] uppercase tracking-wider text-muted font-mono font-semibold">HTTP/SSE</span>
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowUp className="w-4 h-4 text-accent" />
              </motion.div>
            </div>
            <div className="lg:hidden flex items-center gap-2 text-xs py-2 font-mono">
              <span className="text-accent font-semibold">&bull; HTTP / SSE Stream &bull;</span>
            </div>
          </div>

          {/* Layer 2: AG-UI Adapter Bridge (cols 5-7) */}
          <div className="lg:col-span-3 p-5 rounded-xl border border-white/[0.12] bg-[#0C1410] space-y-4 relative">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="font-semibold tracking-wider text-[11px]">PROTOCOL BRIDGE</span>
              <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 font-bold">
                AG-UI SSE
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground font-display tracking-tight flex items-center justify-between">
              <span>AG-UI Event Stream</span>
              <span className="w-2 h-2 rounded-full bg-accent" />
            </h4>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] text-xs space-y-2">
              <div className="text-muted flex items-center justify-between text-[11px]">
                <span>Standard Event Spec:</span>
                <span className="text-zinc-300 font-mono">v1.0.0</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-foreground">
                {PROTOCOL_EVENTS.map((evt, idx) => (
                  <div
                    key={evt}
                    className={cn(
                      "px-2 py-1 rounded transition-colors duration-200 font-mono text-[10px]",
                      idx === activeEventIndex
                        ? "bg-accent/15 text-accent font-semibold border border-accent/30"
                        : "text-zinc-500 bg-white/[0.02]"
                    )}
                  >
                    &bull; {evt}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Protocol Flow 2: Typed StateDeps (cols 8) */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-2 text-zinc-400 relative py-2 lg:py-0">
            <div className="hidden lg:flex flex-col items-center gap-1.5 text-xs">
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <ArrowDown className="w-4 h-4 text-accent" />
              </motion.div>
              <span className="text-[9px] uppercase tracking-wider text-muted font-mono font-semibold">TYPED</span>
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <ArrowUp className="w-4 h-4 text-accent" />
              </motion.div>
            </div>
            <div className="lg:hidden flex items-center gap-2 text-xs py-2 font-mono">
              <span className="text-accent font-semibold">&bull; StateDeps Sync &bull;</span>
            </div>
          </div>

          {/* Layer 3: Python Backend (cols 9-11) */}
          <div className="lg:col-span-3 p-5 rounded-xl border border-white/[0.08] bg-[#0A100E] space-y-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="font-semibold tracking-wider text-[11px]">LAYER 02</span>
              <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
                AGENT BACKEND
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground font-display tracking-tight">
              FastAPI & Pydantic AI
            </h4>
            <div className="space-y-2 text-xs font-sans">
              <div className="text-xs text-foreground flex items-center gap-2 font-mono">
                <Cpu className="w-3.5 h-3.5 text-accent" />
                <span className="font-semibold text-xs">StateDeps[InvestigationState]</span>
              </div>
              <p className="text-[11.5px] text-muted leading-relaxed">
                Deterministic log parser with secret redaction and typed agent tools (<code>search_logs</code>, <code>propose_remediation</code>).
              </p>
              <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                <Database className="w-3 h-3 text-accent" />
                <span>Async SQLite & PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Footnote */}
        <div className="mt-8 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-muted gap-3">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Official AG-UI protocol events verified against specification 1.0.0
          </span>
          <span className="text-zinc-400">Zero unsafe shell dispatch &bull; Human-gated remediation</span>
        </div>
      </GlassCard>
    </section>
  );
}
