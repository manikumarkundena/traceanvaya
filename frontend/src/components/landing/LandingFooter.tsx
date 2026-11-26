import React from "react";
import Link from "next/link";
import { Terminal, ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function LandingFooter() {
  return (
    <>
      {/* FINAL CALL TO ACTION */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center relative">
        <div className="p-10 sm:p-16 rounded-2xl border border-border bg-surface/80 relative overflow-hidden shadow-2xl">
          {/* Subtle connected trace pattern and emerald ambient glow */}
          <div className="absolute inset-0 ambient-glow pointer-events-none opacity-40" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 pointer-events-none rounded-full blur-3xl" />

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-5 relative z-10 font-sans leading-[1.15]">
            Understand the failure.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">
              Build more resilient systems.
            </span>
          </h2>

          <p className="text-muted max-w-2xl mx-auto text-sm sm:text-base mb-8 relative z-10 font-sans leading-relaxed">
            From raw application logs to evidence-grounded investigation and structured incident reports.
          </p>

          <div className="flex justify-center relative z-10">
            <Link
              href="/workspace"
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold bg-accent text-background hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 font-sans"
            >
              <Terminal className="w-4 h-4" />
              <span>Open TraceAnvaya Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL FOOTER */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 text-xs text-muted font-mono bg-background">
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
            <ul className="space-y-1.5 text-xs text-muted">
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
            <ul className="space-y-1.5 text-xs text-muted">
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

        <div className="max-w-7xl mx-auto pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <span>TraceAnvaya &bull; Agentic Incident Intelligence Platform</span>
          <span>Engineered with Pydantic AI, AG-UI & CopilotKit</span>
        </div>
      </footer>
    </>
  );
}
