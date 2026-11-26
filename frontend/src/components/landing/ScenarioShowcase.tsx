import React from "react";
import Link from "next/link";
import { Play, Database, Server, Key, Clock } from "lucide-react";

export function ScenarioShowcase() {
  const scenarios = [
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
  ];

  return (
    <section id="scenarios" className="py-20 border-t border-border bg-surface/30 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
            Scenario Library
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground font-sans">
            Pre-loaded Synthetic Incident Scenarios
          </h2>
          <p className="text-muted mt-3 text-sm font-sans">
            Launch directly into realistic incidents grounded in deterministic application logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-border bg-surface flex flex-col justify-between hover:border-accent/40 transition-all space-y-5"
              >
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
                    <h4 className="text-base font-bold text-foreground font-sans">{sc.title}</h4>
                  </div>

                  <p className="text-xs text-muted leading-relaxed font-sans mb-4">{sc.desc}</p>

                  {/* Miniature Evidence Markers */}
                  <div className="p-2.5 rounded bg-background border border-border font-mono text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between text-muted text-[10px]">
                      <span>Service: {sc.service}</span>
                      <span>{sc.eventsCount} events</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted">Evidence:</span>
                      {sc.sampleEvidence.map((ev) => (
                        <span key={ev} className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/workspace?scenario=${sc.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-surface-elevated hover:bg-border text-accent transition-colors border border-border font-mono"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Launch Scenario Investigation</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
