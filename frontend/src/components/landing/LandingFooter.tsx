"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Terminal, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GlassCard } from "@/components/ui/GlassCard";
import { EASE_OUT_EXPO, VIEWPORT_ONCE } from "@/lib/motion";

export function LandingFooter() {
  return (
    <>
      {/* FINAL CALL TO ACTION */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
          className="motion-safe-reveal"
        >
          <GlassCard spotlight sweep className="p-10 sm:p-16 relative overflow-hidden" elevate={false}>
            {/* Atmospheric emerald radial glow and breathing light */}
            <div
              aria-hidden="true"
              className="absolute inset-0 ambient-glow pointer-events-none opacity-50"
            />
            <div
              aria-hidden="true"
              className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 pointer-events-none rounded-full blur-3xl animate-glow-breathe"
            />

            <h2 className="section-heading font-bold text-foreground mb-5 relative z-10 leading-[1.15]">
              Understand the failure.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-emerald-400 to-teal-300">
                Build more resilient systems.
              </span>
            </h2>

            <p className="text-muted max-w-2xl mx-auto text-sm sm:text-base mb-8 relative z-10 font-sans leading-relaxed">
              From raw application logs to evidence-grounded investigation and structured incident reports.
            </p>

            <div className="flex justify-center relative z-10">
              <Link
                href="/workspace"
                className="group relative overflow-hidden flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold bg-accent text-background hover:bg-accent/95 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-[0_12px_32px_-6px_rgba(94,234,212,0.5),inset_0_1px_0_0_rgba(255,255,255,0.4)] font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                <Terminal className="relative w-4 h-4" />
                <span className="relative">Open TraceAnvaya Workspace</span>
                <ArrowRight className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* PROFESSIONAL FOOTER */}
      <footer className="border-t border-white/[0.08] py-12 px-4 sm:px-6 text-xs text-muted font-mono bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 font-sans">
          <div className="space-y-3 md:col-span-1">
            <Logo size={24} />
            <p className="text-xs text-muted leading-relaxed">
              Agentic incident investigation & replay platform grounded in application telemetry.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Product
            </span>
            <ul className="space-y-1.5 text-xs text-muted font-mono">
              <li><a href="#features" className="hover:text-accent transition-colors">Investigation Canvas</a></li>
              <li><a href="#features" className="hover:text-accent transition-colors">Evidence Explorer</a></li>
              <li><a href="#workflow" className="hover:text-accent transition-colors">Incident Replay</a></li>
              <li><a href="#scenarios" className="hover:text-accent transition-colors">Scenario Library</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Architecture & Docs
            </span>
            <ul className="space-y-1.5 text-xs text-muted font-mono">
              <li><a href="#architecture" className="hover:text-accent transition-colors">AG-UI Event Protocol</a></li>
              <li><Link href="/workspace" className="hover:text-accent transition-colors">Pydantic AI StateDeps</Link></li>
              <li><Link href="/workspace" className="hover:text-accent transition-colors">Alembic Migrations</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Implementation
            </span>
            <div className="text-xs text-muted space-y-1 font-mono">
              <div>Version: v1.0.0</div>
              <div>Stack: Next.js 15 &bull; FastAPI</div>
              <div>License: MIT Open Source</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <span>TraceAnvaya &bull; Agentic Incident Intelligence Platform</span>
          <span>Engineered with Pydantic AI, AG-UI & CopilotKit</span>
        </div>
      </footer>
    </>
  );
}
