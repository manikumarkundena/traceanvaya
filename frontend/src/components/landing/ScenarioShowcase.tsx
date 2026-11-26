"use client";

import React from "react";
import Link from "next/link";
import { Play, Database, Server, Key, ArrowRight, Library } from "lucide-react";
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
    <section id="scenarios" className="scroll-mt-24 py-24 sm:py-32 border-t border-white/[0.08] bg-[#070B09] px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Guaranteed 100% visible Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-muted uppercase tracking-widest mb-4">
            <Library className="w-3.5 h-3.5 text-accent" />
            <span>Scenario Library</span>
          </div>
          <h2 className="section-heading font-bold text-foreground">
            Explore demo incidents
          </h2>
          <p className="text-muted mt-4 text-sm sm:text-base font-sans leading-relaxed">
            Launch directly into realistic incidents grounded in deterministic application telemetry logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            return (
              <div key={sc.id} className="h-full">
                <GlassCard className="p-6 h-full flex flex-col justify-between space-y-5 hover:-translate-y-0.5 hover:border-white/[0.16] transition-all duration-200">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                          sc.severity === "CRITICAL"
                            ? "bg-critical/15 text-critical border border-critical/30"
                            : "bg-warning/15 text-warning border border-warning/30"
                        }`}
                      >
                        {sc.severity}
                      </span>
                      <span className="text-[11px] font-mono text-muted">{sc.category}</span>
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 mt-0.5 shrink-0">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <h4 className="text-base font-bold text-foreground font-display tracking-tight leading-snug">
                        {sc.title}
                      </h4>
                    </div>

                    <p className="text-xs text-muted leading-relaxed font-sans mb-4">
                      {sc.desc}
                    </p>

                    {/* Miniature Evidence Markers */}
                    <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between text-muted text-[11px]">
                        <span>Service: <strong className="text-zinc-300 font-normal">{sc.service}</strong></span>
                        <span className="text-zinc-400">{sc.eventsCount} events</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/[0.04]">
                        <span className="text-[10px] text-muted">Evidence:</span>
                        {sc.sampleEvidence.map((ev) => (
                          <span
                            key={ev}
                            className="bg-white/[0.05] text-zinc-300 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/[0.08]"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/workspace?scenario=${sc.id}`}
                    className="group flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-foreground transition-all duration-200 border border-white/[0.08] hover:border-white/[0.16] font-sans"
                  >
                    <Play className="w-3.5 h-3.5 text-accent" />
                    <span>Launch Scenario Investigation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200" />
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
