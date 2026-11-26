import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  FileCode,
  GitBranch,
  Layers,
  Play,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  Terminal,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative selection:bg-accent/20 selection:text-accent">
      <Navbar mode="landing" />

      {/* Ambient background glow & tech grid */}
      <div className="absolute inset-0 tech-grid pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[550px] ambient-glow pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-accent mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              AGENTIC INCIDENT INTELLIGENCE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground mb-6">
              Every failure leaves a trace.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#A7F3D0] to-accent-secondary">
                Find the connection.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-2xl mb-8 leading-relaxed">
              Investigate software failures with evidence-grounded AI. Replay incidents,
              connect scattered signals and turn raw application logs into actionable understanding.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="/workspace"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-accent text-background hover:bg-accent/90 transition-all shadow-md shadow-accent/10"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/workspace?scenario=scenario-1"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-surface border border-border text-foreground hover:bg-surface-elevated transition-all"
              >
                <Play className="w-3.5 h-3.5 text-accent" />
                <span>Explore Live Demo</span>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-border/60 w-full max-w-lg">
              <div>
                <div className="text-xs font-mono text-muted uppercase">Protocol</div>
                <div className="text-sm font-bold text-foreground mt-0.5">AG-UI Bidirectional</div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted uppercase">Agent Core</div>
                <div className="text-sm font-bold text-foreground mt-0.5">Pydantic AI Typed</div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted uppercase">State Sync</div>
                <div className="text-sm font-bold text-accent mt-0.5">Deterministic 1:1</div>
              </div>
            </div>
          </div>

          {/* Right Hero Technical Preview */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-xl border border-border bg-surface shadow-2xl overflow-hidden font-mono text-xs">
              {/* Window title bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-critical/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-warning/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-success/80 inline-block" />
                  <span className="ml-2 text-[11px] text-muted">traceanvaya-investigator ~ session-884</span>
                </div>
                <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                  LIVE STREAM
                </span>
              </div>

              {/* Terminal content */}
              <div className="p-4 space-y-3.5 text-[11px] leading-relaxed">
                <div className="text-muted flex items-center justify-between">
                  <span>[00:01.42] INGESTED 14 LOG EVENTS</span>
                  <span className="text-warning">2 ANOMALIES</span>
                </div>

                <div className="p-2.5 rounded bg-background border border-border/80 text-foreground">
                  <div className="text-critical flex items-center gap-1.5 font-bold">
                    <span>[ev-106]</span> java.sql.SQLTransientConnectionException
                  </div>
                  <div className="text-muted text-[10px] mt-0.5">
                    HikariPool-1: Connection lease timeout after 30000ms
                  </div>
                </div>

                {/* Agent Tool Activity Card */}
                <div className="p-2.5 rounded bg-surface-elevated border border-accent/30 space-y-1.5">
                  <div className="flex items-center justify-between text-accent font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      TOOL: add_hypothesis
                    </span>
                    <span className="text-[10px] text-success">SYNCHRONIZED</span>
                  </div>
                  <p className="text-foreground text-[10px]">
                    HikariCP pool exhaustion caused by unindexed batch query [ev-104].
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-muted">
                    <span className="bg-border px-1.5 py-0.5 rounded text-foreground font-medium">Confidence: 94%</span>
                    <span>Supporting: ev-104, ev-105, ev-106</span>
                  </div>
                </div>

                {/* Shared State Canvas snippet */}
                <div className="p-2.5 rounded bg-background border border-border space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-muted">
                    <span>SHARED CANVAS STATE</span>
                    <span className="text-accent">TEST A VERIFIED</span>
                  </div>
                  <div className="text-foreground font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-critical" />
                    Severity: CRITICAL &bull; Status: HYPOTHESIS_FORMED
                  </div>
                  <div className="text-[10px] text-muted">
                    Affected Service: <span className="text-foreground">order-billing-service</span>
                  </div>
                </div>

                {/* Live stream indicator */}
                <div className="flex items-center gap-2 pt-1 text-accent text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span>Agent reasoning streaming via AG-UI protocol...</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INTEGRATED TECHNOLOGIES STRIP */}
      <section className="border-y border-border bg-surface/50 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs font-mono text-muted uppercase tracking-wider">
            Verified Stack Integrations
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-mono text-foreground">
            <span className="flex items-center gap-2 hover:text-accent transition-colors">
              <Cpu className="w-4 h-4 text-accent" /> Pydantic AI
            </span>
            <span className="flex items-center gap-2 hover:text-accent transition-colors">
              <GitBranch className="w-4 h-4 text-accent" /> AG-UI Protocol
            </span>
            <span className="flex items-center gap-2 hover:text-accent transition-colors">
              <Sparkles className="w-4 h-4 text-accent" /> CopilotKit
            </span>
            <span className="flex items-center gap-2 hover:text-accent transition-colors">
              <Layers className="w-4 h-4 text-accent" /> FastAPI & AsyncIO
            </span>
            <span className="flex items-center gap-2 hover:text-accent transition-colors">
              <FileCode className="w-4 h-4 text-accent" /> Next.js 15
            </span>
            <span className="flex items-center gap-2 hover:text-accent transition-colors">
              <Database className="w-4 h-4 text-accent" /> PostgreSQL
            </span>
          </div>
        </div>
      </section>

      {/* PRODUCT CAPABILITIES BENTO GRID */}
      <section id="features" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
            System Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Built for engineering precision, not generic chat.
          </h2>
          <p className="text-muted mt-4 text-sm sm:text-base">
            TraceAnvaya coordinates structured agents, deterministic log parsers, and synchronized
            state canvases so you can diagnose production outages with forensic certainty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Investigator */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">AI Investigator</h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Pydantic AI agent equipped with structured tools to query logs, isolate anomalies,
                and update shared investigation state in real-time. Every insight references
                deterministic evidence IDs.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-background border border-border font-mono text-xs text-muted space-y-1.5">
              <div className="text-accent flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Tool Execution: search_logs(query="lease timeout")</span>
              </div>
              <div className="text-foreground">
                Matches: [ev-105] HikariPool lease timeout, [ev-106] SQLTransientConnectionException
              </div>
            </div>
          </div>

          {/* Card 2: Shared State Canvas */}
          <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center text-accent-secondary mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Investigation Canvas</h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Bidirectional synchronized state between UI and AI. Edits made in the browser
                are instantly recognized by the agent on subsequent turns.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background border border-border text-xs font-mono">
              <span className="text-muted block text-[10px]">SYNC STATUS</span>
              <span className="text-success font-semibold">StateDeps[InvestigationState]</span>
            </div>
          </div>

          {/* Card 3: Evidence Explorer */}
          <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center text-info mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Evidence Explorer</h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                High-throughput log parser supporting TXT, LOG, and JSON lines with automatic secret
                redaction and anomaly isolation.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-muted pt-2 border-t border-border">
              <span>Deterministic IDs</span>
              <span className="text-foreground font-bold">ev-001 ... ev-999</span>
            </div>
          </div>

          {/* Card 4: Incident Replay */}
          <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Incident Replay</h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Chronological timeline player. Step through events before, during, and after
                cascading failures to observe how anomalies propagated.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-accent">
              <Play className="w-3.5 h-3.5" />
              <span>Step-by-step scrubber</span>
            </div>
          </div>

          {/* Card 5: Human Approval & Postmortem */}
          <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Human Approval Gate</h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Remediations require explicit operator approval. Propose fixes, review risk
                levels, and record decisions without raw shell execution.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-success">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Unsafe Shell Execution</span>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTIGATION WORKFLOW SECTION */}
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
            {[
              { step: "01", name: "Ingest", desc: "Upload logs or load synthetic scenarios. Secrets are auto-redacted." },
              { step: "02", name: "Investigate", desc: "Agent scans timeline and retrieves candidate evidence." },
              { step: "03", name: "Correlate", desc: "Cross-service anomalies are linked with confidence scores." },
              { step: "04", name: "Resolve", desc: "Human reviews and approves risk-assessed remediation runbooks." },
              { step: "05", name: "Reflect", desc: "Generate postmortem with timeline, root cause, and action items." },
            ].map((item, idx) => (
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

      {/* ENGINEERING ARCHITECTURE */}
      <section id="architecture" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
            Clean Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            True AG-UI Protocol & Pydantic AI StateDeps
          </h2>
          <p className="text-muted mt-4 text-sm sm:text-base">
            No generic LLM wrapper. TraceAnvaya implements the official AG-UI event protocol
            between Next.js CopilotKit and FastAPI Pydantic AI.
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-2xl border border-border bg-surface">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center text-center font-mono">
            
            {/* Layer 1: Client */}
            <div className="p-6 rounded-xl border border-border bg-surface-elevated">
              <span className="text-xs text-muted block mb-1">FRONTEND LAYER</span>
              <h4 className="text-base font-bold text-foreground">Next.js 15 & CopilotKit</h4>
              <p className="text-xs text-muted mt-2 font-sans">
                React hooks: <code>useCoAgent</code>, <code>useCopilotChat</code>, Generative UI tool renderers.
              </p>
            </div>

            {/* Protocol bridge */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-xs text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                &larr; AG-UI Event Protocol (SSE) &rarr;
              </span>
              <span className="text-[11px] text-muted font-sans">
                RUN_STARTED &bull; TOOL_CALL_START &bull; STATE_UPDATE
              </span>
            </div>

            {/* Layer 2: Backend */}
            <div className="p-6 rounded-xl border border-border bg-surface-elevated">
              <span className="text-xs text-muted block mb-1">AGENTIC BACKEND</span>
              <h4 className="text-base font-bold text-foreground">FastAPI & Pydantic AI</h4>
              <p className="text-xs text-muted mt-2 font-sans">
                <code>AGUIAdapter</code> with typed <code>StateDeps[InvestigationState]</code> & Gemini / TestModel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SYNTHETIC SCENARIO LIBRARY */}
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
            {[
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
            ].map((sc, idx) => (
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

      {/* FINAL CTA & FOOTER */}
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

      {/* FOOTER */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 text-xs text-muted text-center font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>TraceAnvaya &bull; Agentic Incident Intelligence Platform v1.0.0</span>
          <span>Engineered with Pydantic AI, AG-UI & CopilotKit</span>
        </div>
      </footer>
    </div>
  );
}
