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
              className="group flex items-center gap-2.5 px-8 py-3.5 rounded-lg text-sm font-semibold bg-accent text-[#060908] hover:brightness-105 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Terminal className="w-4 h-4" />
              <span>Open TraceAnvaya Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
            </Link>
          </div>
        </GlassCard>
      </section>

      {/* CLEAN EDITORIAL FOOTER */}
      <footer className="border-t border-white/[0.08] py-12 px-4 sm:px-6 text-xs text-muted bg-[#050907]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 font-sans">
          <div className="space-y-3 md:col-span-2">
            <Logo size={26} />
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-sm">
              AI-assisted incident investigation, timeline replay, and postmortem reporting grounded in application telemetry.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Product
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-muted">
              <li><a href="#features" className="hover:text-foreground transition-colors">Capabilities</a></li>
              <li><a href="#workflow" className="hover:text-foreground transition-colors">Investigation Lifecycle</a></li>
              <li><a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a></li>
              <li><a href="#scenarios" className="hover:text-foreground transition-colors">Demo Scenarios</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Workspace
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-muted">
              <li><Link href="/workspace" className="hover:text-foreground transition-colors">Open Workspace</Link></li>
              <li><Link href="/workspace?scenario=scenario-1" className="hover:text-foreground transition-colors">DB Pool Exhaustion Demo</Link></li>
              <li><Link href="/workspace?scenario=scenario-2" className="hover:text-foreground transition-colors">Gateway Timeout Demo</Link></li>
              <li><Link href="/workspace?scenario=scenario-3" className="hover:text-foreground transition-colors">Auth Rate Storm Demo</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-zinc-500">
          <span>TraceAnvaya &bull; Simulated Incident Investigation Platform</span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Safe synthetic environment &bull; MIT License</span>
          </span>
        </div>
      </footer>
    </>
  );
}
