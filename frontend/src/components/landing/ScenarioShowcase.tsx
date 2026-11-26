"use client";

import React from "react";
import Link from "next/link";
import { Play, Database, Server, Key, ArrowRight, Library, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

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
    desc: "Long-running batch reconciliation query locks connections in HikariCP pool, causing 500 errors on checkout API.",
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
    desc: "Upstream payment provider latency spikes trigger thread pool starvation and circuit breaker cascading trips.",
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
    desc: "Zero-backoff mobile client retry loops overwhelm Redis rate limiters, triggering 429 status rejections.",
    sampleEvidence: ["ev-302", "ev-305", "ev-308"],
  },
] as const;

export function ScenarioShowcase() {
  return (
    <section id="scenarios" className="py-24 sm:py-32 border-t border-white/[0.08] bg-surface/20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Guaranteed 100% visible Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-white/[0.08] text-xs font-mono text-accent uppercase tracking-widest mb-4 shadow-sm">
            <Library className="w-3.5 h-3.5 text-accent" />
            <span>Scenario Library</span>
          </div>
          <h2 className="section-heading font-bold text-foreground">
            Pre-loaded Synthetic Incident Scenarios
          </h2>
          <p className="text-muted mt-4 text-sm sm:text-base font-sans leading-relaxed">
            Launch directly into realistic incidents grounded in deterministic application telemetry logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            return (
              <div key={sc.id} className="h-full">
                <GlassCard spotlight sweep className="p-7 h-full flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          sc.severity === "CRITICAL"
                            ? "bg-critical/20 text-critical border border-critical/40"
                            : "bg-warning/20 text-warning border border-warning/40"
                        }`}
                      >
                        {sc.severity}
                      </span>
                      <span className="text-xs font-mono text-muted">{sc.category}</span>
                    </div>

                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground font-display tracking-tight leading-snug">
                        {sc.title}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans mb-5">
                      {sc.desc}
                    </p>

                    {/* Miniature Evidence Markers */}
                    <div className="p-3.5 rounded-xl bg-background/90 border border-white/[0.08] font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between text-muted text-[11px]">
                        <span>Service: <strong className="text-foreground">{sc.service}</strong></span>
                        <span className="text-accent">{sc.eventsCount} events</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
                        <span className="text-[10.5px] text-muted">Evidence:</span>
                        {sc.sampleEvidence.map((ev) => (
                          <span
                            key={ev}
                            className="bg-accent/20 text-accent px-2 py-0.5 rounded text-[10.5px] font-bold border border-accent/40"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/workspace?scenario=${sc.id}`}
                    className="group relative flex items-center justify-center gap-2 w-full py-3 rounded-lg text-xs font-bold bg-[#111C17] hover:bg-accent hover:text-background text-accent transition-all duration-200 border border-white/[0.1] hover:border-accent font-mono shadow-md active:scale-98"
                  >
                    <Play className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                    <span>Launch Scenario Investigation</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
