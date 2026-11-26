"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  Cpu,
  Search,
  RotateCcw,
  ShieldCheck,
  FileText,
  ArrowRight,
  CheckCircle2,
  Play,
  Pause,
  StepBack,
  StepForward,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PreviewTab = "investigation" | "evidence" | "replay" | "remediation" | "postmortem";

interface DemoEvidence {
  id: string;
  timestamp: string;
  service: string;
  severity: "INFO" | "WARN" | "ERROR" | "FATAL" | "CRITICAL";
  message: string;
  detail: string;
}

const DEMO_EVIDENCE: DemoEvidence[] = [
  {
    id: "ev-101",
    timestamp: "14:15:02Z",
    service: "ingress-lb",
    severity: "INFO",
    message: "GET /api/v1/orders/health 200 OK - 2ms",
    detail: '{"id":"ev-101","service":"ingress-lb","severity":"INFO","latency_ms":2}',
  },
  {
    id: "ev-104",
    timestamp: "14:15:32Z",
    service: "order-billing",
    severity: "WARN",
    message: "Slow query: SELECT * FROM ledger_entries WHERE reconciled=false FOR UPDATE (14200ms)",
    detail: '{"id":"ev-104","service":"order-billing","pid":41920,"lock_mode":"exclusive","duration_ms":14200}',
  },
  {
    id: "ev-105",
    timestamp: "14:15:45Z",
    service: "order-billing",
    severity: "ERROR",
    message: "HikariPool-1: Connection lease timeout! Thread-142 waited 30002ms",
    detail: '{"id":"ev-105","pool":"HikariPool-1","active":20,"max":20,"timeout_ms":30002}',
  },
  {
    id: "ev-106",
    timestamp: "14:15:46Z",
    service: "order-billing",
    severity: "FATAL",
    message: "SQLTransientConnectionException: HikariPool-1 - Connection is not available",
    detail: '{"id":"ev-106","exception":"SQLTransientConnectionException","pool":"HikariPool-1"}',
  },
  {
    id: "ev-110",
    timestamp: "14:16:15Z",
    service: "ingress-lb",
    severity: "CRITICAL",
    message: "HTTP 500 spike: 42% of /api/v1/checkout requests failing",
    detail: '{"id":"ev-110","endpoint":"/api/v1/checkout","error_rate":0.42,"status":500}',
  },
];

const NAV_ITEMS: Array<{ id: PreviewTab; label: string; shortLabel: string; icon?: React.ElementType }> = [
  { id: "investigation", label: "Investigation", shortLabel: "Investigate" },
  { id: "evidence", label: "Evidence Explorer", shortLabel: "Evidence", icon: Search },
  { id: "replay", label: "Incident Replay", shortLabel: "Replay", icon: RotateCcw },
  { id: "remediation", label: "Remediation", shortLabel: "Remediate", icon: ShieldCheck },
  { id: "postmortem", label: "Postmortem Studio", shortLabel: "Postmortem", icon: FileText },
];

export function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();

  // Isolated interactive preview state (no network/API/DB side effects)
  const [activeTab, setActiveTab] = useState<PreviewTab>("investigation");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>("ev-104");
  const [replayIndex, setReplayIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [remediationDecision, setRemediationDecision] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

  // Scroll-linked perspective settling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [4, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);

  // Replay timer (isolated to preview, pauses off-screen)
  useEffect(() => {
    if (!isPlaying || !isInView || activeTab !== "replay") return;
    const timer = setInterval(() => {
      setReplayIndex((prev) => {
        if (prev >= DEMO_EVIDENCE.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [isPlaying, isInView, activeTab]);

  const selectedEvidence =
    DEMO_EVIDENCE.find((e) => e.id === selectedEvidenceId) || DEMO_EVIDENCE[1];
  const replayEvent = DEMO_EVIDENCE[replayIndex] || DEMO_EVIDENCE[0];

  const handleInspectEvidence = (evId: string) => {
    setSelectedEvidenceId(evId);
    setActiveTab("evidence");
  };

  const handleResetDemo = () => {
    setActiveTab("investigation");
    setSelectedEvidenceId("ev-104");
    setReplayIndex(1);
    setIsPlaying(false);
    setRemediationDecision("PENDING");
  };

  const statusText =
    remediationDecision === "APPROVED"
      ? "Simulated Mitigation"
      : remediationDecision === "REJECTED"
      ? "Investigating"
      : "Hypothesis Formed";

  return (
    <div ref={containerRef} className="w-full mt-10 sm:mt-12 [perspective:1200px]">
      <motion.div
        style={prefersReducedMotion ? undefined : { rotateX, scale }}
        className="relative"
      >
        {/* Crisp Window Frame */}
        <div className="relative rounded-xl border border-white/[0.12] bg-gradient-to-b from-[#111915]/95 to-[#080E0B]/98 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_24px_64px_-12px_rgba(0,0,0,0.7)] overflow-hidden font-mono text-xs">
          {/* Specular Top Edge */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-20"
          />

          {/* Window Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#121D18] via-[#0E1713] to-[#121D18] border-b border-white/[0.08] relative">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F87171] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] inline-block" />
              <span className="ml-2 text-xs text-foreground/85 font-sans font-medium">
                TraceAnvaya / Investigation workspace
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDemo}
                className="text-[11px] font-sans text-muted hover:text-foreground px-2 py-0.5 rounded border border-white/[0.08] hover:border-white/[0.18] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                title="Reset interactive preview"
              >
                Reset
              </button>
              <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 font-bold uppercase tracking-wider">
                SYNTHETIC DEMO
              </span>
            </div>
          </div>

          {/* Mobile Compact Horizontal Tabs (< md) */}
          <div
            role="tablist"
            aria-label="Interactive demo views"
            className="flex md:hidden items-center gap-1 overflow-x-auto px-3 py-2 bg-[#0B110E] border-b border-white/[0.06] font-sans"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive
                      ? "bg-[#15201B] text-accent font-semibold border border-accent/30"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {item.shortLabel}
                </button>
              );
            })}
          </div>

          {/* 3-Panel Product Composition (Fixed min-height prevents layout shift) */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[390px] bg-background/95 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {/* Left Panel: Interactive Navigation (Desktop) */}
            <nav
              aria-label="Preview workspace sections"
              className="hidden md:flex md:col-span-3 bg-surface/50 p-4 flex-col justify-between font-sans"
            >
              <div className="space-y-1.5" role="tablist" aria-orientation="vertical">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        isActive
                          ? "bg-surface-elevated border border-accent/30 text-accent font-semibold"
                          : "text-muted hover:text-foreground hover:bg-white/[0.03] border border-transparent"
                      )}
                    >
                      {Icon ? (
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      ) : (
                        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", isActive ? "bg-accent" : "bg-muted")} />
                      )}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/[0.06] font-mono text-[11px] text-muted space-y-1">
                <div>Session: demo-884</div>
                <div>Service: order-billing</div>
              </div>
            </nav>

            {/* Center Panel: Dynamic Interactive View */}
            <div className="md:col-span-6 p-4 sm:p-5 flex flex-col justify-between space-y-4 font-sans bg-[#080D0B] min-h-[350px] md:min-h-[390px]">
              {/* VIEW 1: INVESTIGATION */}
              {activeTab === "investigation" && (
                <div className="space-y-3 transition-opacity duration-200">
                  <div className="text-xs font-sans text-muted flex items-center justify-between">
                    <span className="font-semibold text-foreground">AI Investigator</span>
                    <span className="text-[11px] text-accent font-mono">Interactive preview</span>
                  </div>

                  <div className="flex justify-end">
                    <div className="p-3 rounded-lg bg-surface-elevated border border-white/[0.08] text-xs text-foreground max-w-sm">
                      Investigate the HTTP 500 error spike.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#0C1411] border border-accent/25 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-accent font-semibold text-[11px] font-mono">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        Evidence correlation
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border text-success bg-success/10 border-success/20">
                        <CheckCircle2 className="w-3 h-3" />
                        UPDATED
                      </span>
                    </div>

                    <div className="text-accent text-[11px] font-mono bg-background/90 px-2 py-1 rounded border border-white/[0.06]">
                      search_logs(query=&quot;connection timeout&quot;, service=&quot;order-billing&quot;)
                    </div>

                    <p className="text-slate-200 text-xs leading-relaxed">
                      Batch reconciliation query (
                      <button
                        type="button"
                        onClick={() => handleInspectEvidence("ev-104")}
                        className="text-accent font-mono font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
                      >
                        [ev-104]
                      </button>
                      ) held exclusive locks for 14.2s, starving HikariPool-1 (
                      <button
                        type="button"
                        onClick={() => handleInspectEvidence("ev-105")}
                        className="text-accent font-mono font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
                      >
                        [ev-105]
                      </button>
                      ) and triggering HTTP 500 errors (
                      <button
                        type="button"
                        onClick={() => handleInspectEvidence("ev-110")}
                        className="text-accent font-mono font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
                      >
                        [ev-110]
                      </button>
                      ).
                    </p>
                  </div>
                </div>
              )}

              {/* VIEW 2: EVIDENCE EXPLORER */}
              {activeTab === "evidence" && (
                <div className="space-y-2.5 transition-opacity duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Evidence Explorer</span>
                    <span className="text-[11px] font-mono text-muted">{DEMO_EVIDENCE.length} events</span>
                  </div>

                  <div className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.08] bg-[#0B120F] overflow-hidden">
                    {DEMO_EVIDENCE.map((ev) => {
                      const isSelected = ev.id === selectedEvidence.id;
                      return (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => setSelectedEvidenceId(ev.id)}
                          className={cn(
                            "w-full px-3 py-2 text-left transition-colors flex items-center justify-between gap-2 font-mono text-[11px] focus-visible:outline-none focus-visible:bg-accent/15",
                            isSelected ? "bg-accent/10 border-l-2 border-accent" : "hover:bg-white/[0.03]"
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-accent font-bold flex-shrink-0">{ev.id}</span>
                            <span
                              className={cn(
                                "text-[9px] px-1.5 py-0.2 rounded font-bold flex-shrink-0",
                                ev.severity === "CRITICAL" || ev.severity === "FATAL" || ev.severity === "ERROR"
                                  ? "bg-critical/20 text-critical"
                                  : ev.severity === "WARN"
                                  ? "bg-warning/20 text-warning"
                                  : "bg-info/20 text-info"
                              )}
                            >
                              {ev.severity}
                            </span>
                            <span className="text-slate-300 truncate">{ev.message}</span>
                          </div>
                          <span className="text-[10px] text-muted flex-shrink-0">{ev.timestamp}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.08] font-mono text-[11px] text-slate-300 break-all">
                    <span className="text-accent font-semibold mr-2">{selectedEvidence.id}:</span>
                    {selectedEvidence.detail}
                  </div>
                </div>
              )}

              {/* VIEW 3: INCIDENT REPLAY */}
              {activeTab === "replay" && (
                <div className="space-y-3 transition-opacity duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Incident Replay</span>
                    <span className="text-[11px] font-mono text-muted">
                      Step {replayIndex + 1} of {DEMO_EVIDENCE.length}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-white/[0.08] bg-[#0B120F] space-y-2.5">
                    <input
                      type="range"
                      min={0}
                      max={DEMO_EVIDENCE.length - 1}
                      value={replayIndex}
                      onChange={(e) => {
                        setIsPlaying(false);
                        setReplayIndex(Number(e.target.value));
                      }}
                      aria-label="Demo replay timeline scrubber"
                      className="w-full accent-accent cursor-pointer"
                    />
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPlaying(false);
                          setReplayIndex((i) => Math.max(0, i - 1));
                        }}
                        aria-label="Previous event"
                        className="p-1.5 rounded bg-surface border border-white/[0.08] hover:border-white/[0.2] text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <StepBack className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPlaying((p) => !p)}
                        aria-label={isPlaying ? "Pause replay" : "Play replay"}
                        className="px-3 py-1.5 rounded bg-accent text-[#050807] font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlaying ? "Pause" : "Play"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPlaying(false);
                          setReplayIndex((i) => Math.min(DEMO_EVIDENCE.length - 1, i + 1));
                        }}
                        aria-label="Next event"
                        className="p-1.5 rounded bg-surface border border-white/[0.08] hover:border-white/[0.2] text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <StepForward className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-accent/30 bg-[#0C1411] font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-bold">{replayEvent.id}</span>
                      <span className="text-muted text-[11px]">{replayEvent.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-muted">
                      Service: <span className="text-foreground">{replayEvent.service}</span> &bull; Severity:{" "}
                      <span className="text-warning">{replayEvent.severity}</span>
                    </div>
                    <p className="text-slate-200 font-sans text-xs leading-relaxed pt-1">
                      {replayEvent.message}
                    </p>
                  </div>
                </div>
              )}

              {/* VIEW 4: REMEDIATION */}
              {activeTab === "remediation" && (
                <div className="space-y-3 transition-opacity duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Remediation review</span>
                    <span
                      className={cn(
                        "text-[11px] px-2 py-0.5 rounded font-medium",
                        remediationDecision === "APPROVED"
                          ? "bg-success/15 text-success border border-success/35"
                          : remediationDecision === "REJECTED"
                          ? "bg-critical/15 text-critical border border-critical/35"
                          : "bg-warning/15 text-warning border border-warning/35"
                      )}
                    >
                      {remediationDecision === "APPROVED"
                        ? "Approved (Simulated)"
                        : remediationDecision === "REJECTED"
                        ? "Rejected"
                        : "Pending review"}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg border border-white/[0.08] bg-[#0C1411] space-y-3">
                    <p className="font-mono text-xs text-slate-200 leading-relaxed">
                      [HIGH] Terminate locking batch process pid=41920 and increase HikariPool-1 maximumPoolSize from 20 to 40.
                    </p>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Simulated review only: approving records an operator decision without executing infrastructure commands.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRemediationDecision("APPROVED")}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-success/15 hover:bg-success/25 text-success border border-success/35 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Plan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRemediationDecision("REJECTED")}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-critical/15 hover:bg-critical/25 text-critical border border-critical/35 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-critical"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject Plan</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 5: POSTMORTEM STUDIO */}
              {activeTab === "postmortem" && (
                <div className="space-y-2.5 transition-opacity duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Postmortem Studio</span>
                    <span className="text-[11px] font-mono text-accent">Markdown Preview</span>
                  </div>

                  <div className="p-3.5 rounded-lg border border-white/[0.08] bg-[#0B120F] space-y-2 text-xs text-slate-300 leading-relaxed">
                    <div className="font-semibold text-white">
                      Incident Report: Database Connection Pool Exhaustion
                    </div>
                    <div>
                      <strong className="text-slate-200">Impact:</strong> 42% HTTP 500 error spike on{" "}
                      <code className="font-mono text-accent">/api/v1/checkout</code> (14:15–14:17 UTC).
                    </div>
                    <div>
                      <strong className="text-slate-200">Likely Root Cause:</strong> Unindexed batch query (
                      <span className="font-mono text-accent">ev-104</span>) held exclusive locks on{" "}
                      <code className="font-mono text-accent">ledger_entries</code>, exhausting HikariPool-1.
                    </div>
                    <div>
                      <strong className="text-slate-200">Follow-up Actions:</strong> Add index on{" "}
                      <code className="font-mono text-accent">ledger_entries(reconciled)</code> and set statement timeout.
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Bar */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans text-muted">
                <span className="text-[11px] text-slate-400">
                  Interactive synthetic demo (isolated preview)
                </span>
                <Link
                  href="/workspace"
                  className="group text-accent hover:underline inline-flex items-center gap-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  <span>Inspect full workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Right Panel: Live Preview State Summary */}
            <div className="md:col-span-3 p-4 bg-surface/40 space-y-4 font-sans text-xs">
              <div className="text-xs font-semibold text-foreground">
                Investigation overview
              </div>

              <div className="space-y-1">
                <div className="text-[11px] text-muted">Severity</div>
                <div className="text-critical font-bold text-sm flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-critical" />
                  CRITICAL
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] text-muted">Status</div>
                <div className="text-success font-semibold text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  {statusText}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <div className="text-[11px] text-muted">Supporting evidence</div>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                  {["ev-104", "ev-105", "ev-106"].map((evId) => (
                    <button
                      key={evId}
                      type="button"
                      onClick={() => handleInspectEvidence(evId)}
                      className={cn(
                        "px-1.5 py-0.5 rounded border font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        selectedEvidenceId === evId && activeTab === "evidence"
                          ? "bg-accent/25 text-accent border-accent/50"
                          : "bg-white/[0.04] text-muted border-white/[0.08] hover:text-accent hover:border-accent/30"
                      )}
                    >
                      {evId}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/[0.06] text-[11px]">
                <div className="text-muted">Working hypothesis</div>
                <p className="text-slate-300 leading-relaxed">
                  Unindexed batch reconciliation query holding locks on ledger table.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
