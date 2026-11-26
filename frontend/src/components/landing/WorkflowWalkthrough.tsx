import React from "react";

export function WorkflowWalkthrough() {
  const steps = [
    { step: "01", name: "Ingest", desc: "Upload logs or load synthetic scenarios. Secrets are auto-redacted." },
    { step: "02", name: "Investigate", desc: "Agent scans timeline and retrieves candidate evidence." },
    { step: "03", name: "Correlate", desc: "Cross-service anomalies are linked with confidence scores." },
    { step: "04", name: "Resolve", desc: "Human reviews and approves risk-assessed remediation runbooks." },
    { step: "05", name: "Reflect", desc: "Generate postmortem with timeline, root cause, and action items." },
  ];

  return (
    <section id="workflow" className="py-20 border-t border-border bg-surface/30 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
            The Investigation Lifecycle
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            From raw telemetry to verified postmortem.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-lg border border-border bg-surface flex flex-col justify-between relative"
            >
              <div>
                <span className="text-xs font-mono text-accent font-bold">{item.step}</span>
                <h4 className="text-base font-bold text-foreground mt-1 mb-2">{item.name}</h4>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
