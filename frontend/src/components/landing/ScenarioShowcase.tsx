"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Play, Database, Server, Key, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { EASE_OUT_EXPO, VIEWPORT_ONCE, cardRevealVariants, staggerContainerVariants } from "@/lib/motion";

const SCENARIOS = [
  {
    id: "scenario-1",
    title: "Database Connection Pool Exhaustion",
    service: "order-billing-service",
    category: "Database Contention",
    severity: "CRITICAL",
    eventsCount: 14,
    anomaliesCount: 3,
    icon: Database,
    desc: "Long-running batch reconciliation query locks connections in HikariCP pool, causing 500s on checkout API.",
    sampleEvidence: ["ev-104", "ev-105", "ev-106"],
  },
  {
    id: "scenario-2",
    title: "Payment Gateway Timeout & Cascade",
    service: "checkout-gateway",
    category: "Upstream Dependency",
    severity: "HIGH",
    eventsCount: 14,
    anomaliesCount: 2,
    icon: Server,
    desc: "Upstream payment provider latency spikes trigger thread pool exhaustion and circuit breaker tripping.",
    sampleEvidence: ["ev-203", "ev-204", "ev-207"],
  },
  {
    id: "scenario-3",
    title: "Auth Token Refresh Storm",
    service: "auth-service",
    category: "Traffic Thundering Herd",
    severity: "HIGH",
    eventsCount: 14,
    anomaliesCount: 3,
    icon: Key,
    desc: "Zero-backoff mobile client retry loops overwhelm Redis rate limiters, triggering 429 rejections.",
    sampleEvidence: ["ev-302", "ev-305", "ev-308"],
  },
] as const;

export function ScenarioShowcase() {
  return (
    <section id="scenarios" className="py-24 border-t border-white/[0.07] bg-surface/20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="motion-safe-reveal text-center max-w-2xl mx-auto mb-16"
        >
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2.5">
            Scenario Library
          </div>
          <h2 className="section-heading font-bold text-foreground">
            Pre-loaded Synthetic Incident Scenarios
          </h2>
          <p className="text-muted mt-3 text-sm font-sans leading-relaxed">
            Launch directly into realistic incidents grounded in deterministic application logs.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            return (
              <motion.div key={sc.id} variants={cardRevealVariants} className="motion-safe-reveal">
                <GlassCard spotlight sweep className="p-6 h-full flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          sc.severity === "CRITICAL"
                            ? "bg-critical/20 text-critical border border-critical/30"
                            : "bg-warning/20 text-warning border border-warning/30"
                        }`}
                      >
                        {sc.severity}
                      </span>
                      <span className="text-[11px] font-mono text-muted">{sc.category}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-accent" />
                      <h4 className="text-base font-bold text-foreground font-display tracking-tight">{sc.title}</h4>
                    </div>

                    <p className="text-xs text-muted leading-relaxed font-sans mb-4">{sc.desc}</p>

                    {/* Miniature Evidence Markers */}
                    <div className="p-2.5 rounded bg-background/80 border border-white/[0.08] font-mono text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-muted text-[10px]">
                        <span>Service: {sc.service}</span>
                        <span>{sc.eventsCount} events</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted">Evidence:</span>
                        {sc.sampleEvidence.map((ev) => (
                          <span key={ev} className="bg-accent/15 text-accent px-1.5 py-0.5 rounded text-[10px] font-bold border border-accent/30">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/workspace?scenario=${sc.id}`}
                    className="group relative flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-[#111A16] hover:bg-accent hover:text-background text-accent transition-all duration-200 border border-white/[0.08] hover:border-accent font-mono shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                    <span>Launch Scenario Investigation</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
