import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";

export function ScenarioShowcase() {
  const scenarios = [
    {
      id: "scenario-1",
      title: "Database Connection Pool Exhaustion",
      service: "order-billing-service",
      severity: "CRITICAL",
      desc: "Long-running batch reconciliation query locks connections in HikariCP pool, causing 500s on checkout API.",
    },
    {
      id: "scenario-2",
      title: "Payment Gateway Timeout & Cascade",
      service: "checkout-gateway",
      severity: "HIGH",
      desc: "Upstream payment provider latency spikes trigger thread pool exhaustion and circuit breaker tripping.",
    },
    {
      id: "scenario-3",
      title: "Auth Token Refresh Storm",
      service: "auth-service",
      severity: "HIGH",
      desc: "Zero-backoff mobile client retry loops overwhelm Redis rate limiters, triggering 429 rejections.",
    },
  ];

  return (
    <section id="scenarios" className="py-20 border-t border-border bg-surface/30 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
            Scenario Library
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Pre-loaded Synthetic Incident Scenarios
          </h2>
          <p className="text-muted mt-3 text-sm">
            Launch directly into realistic incidents without preparing custom logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((sc, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-border bg-surface flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-critical font-bold">{sc.severity}</span>
                  <span className="text-[11px] font-mono text-muted">{sc.service}</span>
                </div>
                <h4 className="text-base font-bold text-foreground mb-2">{sc.title}</h4>
                <p className="text-xs text-muted leading-relaxed mb-6">{sc.desc}</p>
              </div>
              <Link
                href={`/workspace?scenario=${sc.id}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-surface-elevated hover:bg-border text-accent transition-colors border border-border"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch Scenario</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
