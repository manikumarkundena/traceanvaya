import React from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

export function LandingFooter() {
  return (
    <>
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center">
        <div className="p-10 sm:p-14 rounded-2xl border border-border bg-surface/70 relative overflow-hidden">
          <div className="absolute inset-0 ambient-glow pointer-events-none opacity-50" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 relative z-10">
            Start investigating incidents with evidence-grounded AI.
          </h2>
          <p className="text-muted max-w-xl mx-auto text-sm sm:text-base mb-8 relative z-10">
            Trace the failure. Connect the evidence. Turn logs into deterministic understanding.
          </p>
          <div className="flex justify-center relative z-10">
            <Link
              href="/workspace"
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold bg-accent text-background hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
            >
              <Terminal className="w-4 h-4" />
              <span>Open TraceAnvaya Workspace</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4 sm:px-6 text-xs text-muted text-center font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>TraceAnvaya &bull; Agentic Incident Intelligence Platform v1.0.0</span>
          <span>Engineered with Pydantic AI, AG-UI & CopilotKit</span>
        </div>
      </footer>
    </>
  );
}
