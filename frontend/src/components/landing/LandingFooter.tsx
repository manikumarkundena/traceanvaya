"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GlassCard } from "@/components/ui/GlassCard";

export function LandingFooter() {
  return (
    <>
      {/* MEMORABLE FINAL CALL TO ACTION */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center relative">
        <GlassCard spotlight sweep className="p-10 sm:p-20 relative overflow-hidden" elevate={false}>
          {/* Focused cinematic emerald light composition */}
          <div
            aria-hidden="true"
            className="absolute inset-0 ambient-glow pointer-events-none opacity-60"
          />
          <div
            aria-hidden="true"
            className="absolute -top-10 right-1/3 w-[500px] h-[500px] bg-emerald-500/20 pointer-events-none rounded-full blur-3xl animate-glow-breathe"
          />

          <h2 className="section-heading font-bold text-foreground mb-6 relative z-10 leading-[1.12]">
            Understand the failure.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-emerald-400 to-teal-300">
              Build more resilient systems.
            </span>
          </h2>

          <p className="text-muted max-w-2xl mx-auto text-sm sm:text-base md:text-lg mb-10 relative z-10 font-sans leading-relaxed">
            From raw application telemetry logs to evidence-grounded agent investigation and structured executive incident postmortems.
          </p>

          <div className="flex justify-center relative z-10">
            <Link
              href="/workspace"
              className="group relative overflow-hidden flex items-center gap-2.5 px-9 py-4 rounded-xl text-base font-bold bg-accent text-background hover:bg-accent/95 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-[0_14px_36px_-6px_rgba(94,234,212,0.55),inset_0_1px_0_0_rgba(255,255,255,0.5)] font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
              <Terminal className="relative w-5 h-5" />
              <span className="relative">Open TraceAnvaya Workspace</span>
              <ArrowRight className="relative w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </GlassCard>
      </section>

      {/* ELEVATED PROFESSIONAL FOOTER */}
      <footer className="border-t border-white/[0.1] py-14 px-4 sm:px-6 text-xs text-muted font-mono bg-[#050907]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 font-sans">
          <div className="space-y-4 md:col-span-1">
            <Logo size={28} />
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Agentic incident investigation & replay platform grounded in application telemetry.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-accent">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Pydantic AI &bull; AG-UI &bull; CopilotKit</span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground font-bold">
              Product
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-muted font-sans">
              <li><a href="#features" className="hover:text-accent transition-colors">Investigation Canvas</a></li>
              <li><a href="#features" className="hover:text-accent transition-colors">Evidence Explorer</a></li>
              <li><a href="#workflow" className="hover:text-accent transition-colors">Incident Replay</a></li>
              <li><a href="#scenarios" className="hover:text-accent transition-colors">Scenario Library</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground font-bold">
              Architecture & Docs
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-muted font-sans">
              <li><a href="#architecture" className="hover:text-accent transition-colors">AG-UI Event Protocol</a></li>
              <li><Link href="/workspace" className="hover:text-accent transition-colors">Pydantic AI StateDeps</Link></li>
              <li><Link href="/workspace" className="hover:text-accent transition-colors">Human Approval Gate</Link></li>
              <li><Link href="/workspace" className="hover:text-accent transition-colors">Postmortem Studio</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground font-bold">
              Implementation Details
            </span>
            <div className="text-xs text-muted space-y-1.5 font-mono">
              <div>Version: v1.0.0 (Stage 3.2 Flagship)</div>
              <div>Stack: Next.js 15 &bull; FastAPI &bull; SQLite/PG</div>
              <div>License: MIT Open Source</div>
              <div className="text-success font-semibold flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Unsafe Shell Execution</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <span>TraceAnvaya &bull; Agentic Incident Intelligence Platform</span>
          <span>Engineered with Pydantic AI, AG-UI & CopilotKit</span>
        </div>
      </footer>
    </>
  );
}
