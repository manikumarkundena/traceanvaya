"use client";

import React, { useState } from "react";
import {
  Cpu,
  Layers,
  Search,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FeatureBento() {
  const [activeTab, setActiveTab] = useState<"findings" | "state">("findings");

  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="max-w-3xl mb-14 sm:mb-18">
        <span className="text-xs font-mono text-accent uppercase tracking-wider block mb-2">
          Core Capabilities
        </span>
        <h2 className="section-heading font-bold text-foreground">
          Built for technical precision, not generic chat.
        </h2>
        <p className="text-muted mt-3 text-sm sm:text-base font-sans leading-relaxed">
          TraceAnvaya coordinates structured agents, deterministic log parsers, and synchronized
          state canvases so engineering teams diagnose production outages with verifiable evidence grounding.
        </p>
      </div>

      {/* Feature 1: Large Editorial Split Preview — AI Investigator */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0A100E] p-6 sm:p-9 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-foreground font-display tracking-tight">
              AI Investigator
            </h3>
            <p className="text-sm text-muted leading-relaxed font-sans">
              An autonomous Pydantic AI agent equipped with typed tools to query logs, isolate anomalies,
              and update shared investigation state in real-time. Every diagnostic finding references concrete evidence identifiers.
            </p>
            <div className="pt-2">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline font-mono"
              >
                <span>Launch in workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-lg border border-white/[0.08] bg-[#060908] p-4 sm:p-5 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-muted text-[11px] pb-2 border-b border-white/[0.06]">
                <span className="text-accent flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  tool: search_logs(query=&quot;connection timeout&quot;, service=&quot;order-billing&quot;)
                </span>
                <span className="text-success font-semibold">2 matches</span>
              </div>
              <div className="space-y-2 text-[11.5px]">
                <div className="p-2.5 rounded bg-[#0D1512] border border-white/[0.06] text-foreground">
                  <span className="text-accent font-bold">[ev-105]</span> HikariPool-1: Connection lease timeout after 30000ms &bull; <span className="text-warning font-semibold">WARN</span>
                </div>
                <div className="p-2.5 rounded bg-[#0D1512] border border-white/[0.06] text-foreground">
                  <span className="text-accent font-bold">[ev-106]</span> SQLTransientConnectionException: HikariPool-1 unavailable &bull; <span className="text-critical font-semibold">CRITICAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Alternating Split Layout — Shared State Canvas */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0A100E] p-6 sm:p-9 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="rounded-lg border border-white/[0.08] bg-[#060908] p-4 sm:p-5 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] text-muted pb-2 border-b border-white/[0.06]">
                <span className="flex items-center gap-1.5 text-accent font-semibold">
                  <Activity className="w-3.5 h-3.5" />
                  BIDIRECTIONAL STATE SYNC
                </span>
                <span className="text-success font-bold">SYNCHRONIZED</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded bg-[#0D1512] border border-white/[0.06] space-y-1">
                  <div className="text-[10.5px] text-muted">Incident Severity</div>
                  <div className="text-critical font-bold text-sm">CRITICAL</div>
                </div>
                <div className="p-3 rounded bg-[#0D1512] border border-white/[0.06] space-y-1">
                  <div className="text-[10.5px] text-muted">Investigation Status</div>
                  <div className="text-accent font-bold text-sm">HYPOTHESIS_FORMED</div>
                </div>
              </div>
              <div className="p-2.5 rounded bg-[#0D1512] border border-white/[0.06] text-muted text-[11px]">
                Active Hypothesis: Exclusive row-level lock on ledger_entries holding pool connections.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-foreground font-display tracking-tight">
              Investigation Canvas
            </h3>
            <p className="text-sm text-muted leading-relaxed font-sans">
              Bidirectional state between UI and AI. Manual edits made by engineers in the browser are recognized
              by the agent on subsequent turns via typed <code>StateDeps</code> without state drift.
            </p>
          </div>
        </div>
      </div>

      {/* Feature 3: Clean Three-Column Layout for Supporting Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Evidence Explorer */}
        <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0A100E] flex flex-col justify-between space-y-4">
          <div>
            <div className="w-9 h-9 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center text-info mb-4">
              <Search className="w-4 h-4" />
            </div>
            <h4 className="text-lg font-bold text-foreground font-display tracking-tight mb-2">
              Evidence Explorer
            </h4>
            <p className="text-xs text-muted leading-relaxed font-sans">
              High-throughput log parser supporting TXT, LOG, and JSON lines with automatic secret
              redaction and anomaly isolation.
            </p>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] bg-[#060908] p-3 rounded-lg border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-accent font-bold">ev-104</span>
              <span className="text-warning text-[9px] px-1 rounded bg-warning/10 border border-warning/20">WARN</span>
            </div>
            <p className="text-muted truncate">Slow query detected: SELECT * FROM ledger_entries...</p>
          </div>
        </div>

        {/* Incident Replay */}
        <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0A100E] flex flex-col justify-between space-y-4">
          <div>
            <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h4 className="text-lg font-bold text-foreground font-display tracking-tight mb-2">
              Incident Replay
            </h4>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Chronological timeline player. Step through events before, during, and after
              cascading failures to observe how anomalies propagated.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#060908] border border-white/[0.06] font-mono text-xs space-y-1.5">
            <div className="flex justify-between text-[10px] text-muted">
              <span>TIMELINE SCRUBBER</span>
              <span className="text-accent">STEP 3 OF 14</span>
            </div>
            <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[25%]" />
            </div>
          </div>
        </div>

        {/* Human Approval Gate */}
        <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0A100E] flex flex-col justify-between space-y-4">
          <div>
            <div className="w-9 h-9 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success mb-4">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-lg font-bold text-foreground font-display tracking-tight mb-2">
              Human Approval Gate
            </h4>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Remediations require explicit operator authorization. Propose fixes, review risk
              levels, and record decisions without raw shell execution.
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-success bg-[#060908] p-3 rounded-lg border border-white/[0.06]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>Operator Authorization</span>
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
