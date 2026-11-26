"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GlassCard } from "@/components/ui/GlassCard";

export function LandingFooter() {
  return (
    <>
      {/* MEMORABLE FINAL CALL TO ACTION */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center relative">
        <GlassCard className="p-10 sm:p-20 relative overflow-hidden bg-[#0A100E] border-white/[0.08]" elevate={false}>
          {/* Subtle directional border accent */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.16] to-transparent pointer-events-none"
          />

          <h2 className="section-heading font-bold text-foreground mb-5 relative z-10 leading-[1.12]">
            Understand the failure.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-accent">
              Build more resilient systems.
            </span>
          </h2>

          <p className="text-muted max-w-2xl mx-auto text-sm sm:text-base mb-8 relative z-10 font-sans leading-relaxed">
            From raw application telemetry logs to evidence-grounded agent investigation and structured executive incident postmortems.
          </p>

          <div className="flex justify-center relative z-10">
            <Link
              href="/workspace"
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-lg text-sm font-semibold bg-accent text-[#060908] hover:bg-accent/90 active:scale-[0.98] transition-all duration-200 font-sans"
            >
              <Terminal className="w-4 h-4" />
              <span>Open TraceAnvaya Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </GlassCard>
      </section>

      {/* ELEVATED PROFESSIONAL FOOTER */}
      <footer className="border-t border-white/[0.08] py-14 px-4 sm:px-6 text-xs text-muted font-mono bg-[#050907]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 font-sans">
          <div className="space-y-4 md:col-span-1">
            <Logo size={26} />
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Agentic incident investigation & replay platform grounded in application telemetry.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Pydantic AI &bull; AG-UI &bull; CopilotKit</span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground font-bold">
              Product
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-muted font-sans">
              <li><a href="#features" className="hover:text-foreground transition-colors">Investigation Canvas</a></li>
              <li><a href="#features" className="hover:text-foreground transition-colors">Evidence Explorer</a></li>
              <li><a href="#workflow" className="hover:text-foreground transition-colors">Incident Replay</a></li>
              <li><a href="#scenarios" className="hover:text-foreground transition-colors">Scenario Library</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground font-bold">
              Architecture & Docs
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-muted font-sans">
              <li><a href="#architecture" className="hover:text-foreground transition-colors">AG-UI Event Protocol</a></li>
              <li><Link href="/workspace" className="hover:text-foreground transition-colors">Pydantic AI StateDeps</Link></li>
              <li><Link href="/workspace" className="hover:text-foreground transition-colors">Human Approval Gate</Link></li>
              <li><Link href="/workspace" className="hover:text-foreground transition-colors">Postmortem Studio</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground font-bold">
              Implementation Details
            </span>
            <div className="text-xs text-muted space-y-1.5 font-mono">
              <div>Version: v1.0.0 (Stage 3.3 Editorial)</div>
              <div>Stack: Next.js 15 &bull; FastAPI &bull; SQLite/PG</div>
              <div>License: MIT Open Source</div>
              <div className="text-zinc-300 font-semibold flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>Zero Unsafe Shell Execution</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-500">
          <span>TraceAnvaya &bull; Agentic Incident Intelligence Platform</span>
          <span>Engineered with Pydantic AI, AG-UI & CopilotKit</span>
        </div>
      </footer>
    </>
  );
}
