import React from "react";
import Link from "next/link";
import { ArrowRight, Cpu, Play } from "lucide-react";

export function HeroSection() {
  return (
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
  );
}
