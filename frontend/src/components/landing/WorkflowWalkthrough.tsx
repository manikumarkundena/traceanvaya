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
      className="py-24 sm:py-32 border-t border-white/[0.08] bg-[#070B09] px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Guaranteed 100% visible Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-muted uppercase tracking-widest mb-4">
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
          {/* Desktop horizontal technical connector line */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-white/[0.08] z-0 overflow-hidden"
          >
            {!prefersReducedMotion && (
              <motion.div
                className="h-full w-32 bg-gradient-to-r from-transparent via-accent/60 to-transparent"
                animate={{ x: ["-30%", "750%"] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 relative z-10">
            {LIFECYCLE_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="h-full">
                  <GlassCard className="p-5 sm:p-6 h-full flex flex-col justify-between space-y-4 hover:border-white/[0.14] transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
                          <Icon className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-xs font-mono text-muted font-semibold tracking-wider">
                          {item.step}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-foreground mb-2 font-display tracking-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-muted leading-relaxed font-sans">
                        {item.desc}
                      </p>
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
