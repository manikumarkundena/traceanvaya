"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Upload, Search, GitMerge, ShieldCheck, FileText } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  cardRevealVariants,
  EASE_OUT_EXPO,
  maskedLineVariants,
  staggerContainerVariants,
  VIEWPORT_ONCE,
} from "@/lib/motion";

const LIFECYCLE_STEPS = [
  {
    step: "01",
    name: "Ingest",
    icon: Upload,
    desc: "Upload logs or load synthetic scenarios. Secrets are auto-redacted.",
  },
  {
    step: "02",
    name: "Investigate",
    icon: Search,
    desc: "Agent scans timeline and retrieves candidate evidence.",
  },
  {
    step: "03",
    name: "Correlate",
    icon: GitMerge,
    desc: "Cross-service anomalies are linked with confidence scores.",
  },
  {
    step: "04",
    name: "Resolve",
    icon: ShieldCheck,
    desc: "Human reviews and approves risk-assessed remediation runbooks.",
  },
  {
    step: "05",
    name: "Reflect",
    icon: FileText,
    desc: "Generate postmortem with timeline, root cause, and action items.",
  },
] as const;

export function WorkflowWalkthrough() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="workflow"
      className="py-24 border-t border-white/[0.07] bg-surface/25 px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="motion-safe-reveal text-xs font-mono text-accent uppercase tracking-widest mb-3"
          >
            The Investigation Lifecycle
          </motion.div>
          <h2 className="section-heading font-bold text-foreground overflow-hidden">
            <motion.span
              variants={maskedLineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="motion-safe-reveal block"
            >
              From raw telemetry to verified postmortem.
            </motion.span>
          </h2>
        </div>

        <div className="relative">
          {/* Desktop horizontal connector line + travelling illumination signal */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-9 left-[10%] right-[10%] h-px bg-white/[0.08] overflow-hidden z-0"
          >
            {!prefersReducedMotion && (
              <motion.div
                className="h-full w-32 bg-gradient-to-r from-transparent via-accent to-transparent"
                animate={{ x: ["-15%", "650%"] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>

          {/* Mobile vertical connector line */}
          <div
            aria-hidden="true"
            className="md:hidden absolute top-6 bottom-6 left-7 w-px bg-gradient-to-b from-accent/40 via-white/10 to-emerald-500/30 z-0"
          />

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10"
          >
            {LIFECYCLE_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  variants={cardRevealVariants}
                  className="motion-safe-reveal pl-12 md:pl-0 relative"
                >
                  {/* Mobile node marker */}
                  <span
                    aria-hidden="true"
                    className="md:hidden absolute left-[23px] top-6 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-background"
                  />

                  <GlassCard className="p-5 h-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono text-accent/90 font-bold">
                        {item.step}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-foreground mb-2 font-display">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted leading-relaxed font-sans">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
