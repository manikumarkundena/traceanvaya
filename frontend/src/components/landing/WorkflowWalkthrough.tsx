"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  FileInput,
  Search,
  GitMerge,
  ShieldCheck,
  FileText,
  Compass,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const LIFECYCLE_STEPS = [
  {
    step: "01",
    name: "Ingest",
    icon: FileInput,
    desc: "Ingest raw telemetry (.log, .txt, .json). JWTs, database credentials and API tokens are automatically redacted.",
  },
  {
    step: "02",
    name: "Investigate",
    icon: Search,
    desc: "Pydantic AI agent executes structured tools (search_logs, get_log_entry) to correlate anomalies.",
  },
  {
    step: "03",
    name: "Correlate",
    icon: GitMerge,
    desc: "Cross-service telemetry anomalies are linked with confidence scores and evidence identifiers.",
  },
  {
    step: "04",
    name: "Resolve",
    icon: ShieldCheck,
    desc: "Human operator reviews and authorizes risk-assessed remediation runbooks with zero raw shell execution.",
  },
  {
    step: "05",
    name: "Reflect",
    icon: FileText,
    desc: "One-click export of executive incident postmortems in standard GitHub Flavored Markdown.",
  },
] as const;

export function WorkflowWalkthrough() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="workflow"
      className="py-24 sm:py-32 border-t border-white/[0.08] bg-surface/30 px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Guaranteed 100% visible Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-white/[0.08] text-xs font-mono text-accent uppercase tracking-widest mb-4 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-accent" />
            <span>The Investigation Lifecycle</span>
          </div>
          <h2 className="section-heading font-bold text-foreground">
            From raw telemetry to verified postmortem.
          </h2>
          <p className="text-muted mt-4 text-sm sm:text-base font-sans leading-relaxed">
            A cohesive forensic investigation journey connecting telemetry ingestion, agent reasoning, and human-in-the-loop resolution.
          </p>
        </div>

        <div className="relative">
          {/* Desktop horizontal technical connector line + continuous travelling signal */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-12 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent z-0 overflow-hidden"
          >
            {!prefersReducedMotion && (
              <motion.div
                className="h-full w-40 bg-gradient-to-r from-transparent via-accent to-transparent"
                animate={{ x: ["-20%", "720%"] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10">
            {LIFECYCLE_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="h-full">
                  <GlassCard spotlight className="p-6 h-full">
                    <div className="flex flex-col justify-between h-full space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-[inset_0_1px_0_0_rgba(94,234,212,0.25)]">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-mono text-accent font-bold px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                            STAGE {item.step}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-2 font-display tracking-tight">
                          {item.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
