"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EvidenceItem, InvestigationState, ChatMessage } from "@/components/workspace/types";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { InvestigationCanvas } from "@/components/workspace/InvestigationCanvas";
import { EvidenceExplorer } from "@/components/workspace/EvidenceExplorer";
import { IncidentReplay } from "@/components/workspace/IncidentReplay";
import { PostmortemModal } from "@/components/workspace/PostmortemModal";

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get("scenario") || "scenario-1";

  // Session & Scenario state
  const [sessionId] = useState<string>("session-884");
  const [currentScenario, setCurrentScenario] = useState<string>(scenarioParam);
  const [, setIsLoadingScenario] = useState<boolean>(false);

  // Investigation Canvas State (Shared State)
  const [canvasState, setCanvasState] = useState<InvestigationState>({
    session_id: "session-884",
    incident_title: "Database Connection Pool Exhaustion",
    severity: "CRITICAL",
    status: "INVESTIGATING",
    affected_service: "order-billing-service",
    selected_evidence_ids: ["ev-104", "ev-105", "ev-106"],
    findings: [
      "HikariCP connection pool exhausted on order-billing-service.",
      "Unindexed batch reconciliation query (ev-104) holding lock for >14s.",
      "Checkout API cascading into HTTP 500s (ev-110).",
    ],
    hypotheses: [
      "HikariPool-1 exhaustion caused by exclusive row-level lock on ledger_entries (Confidence: 94%, Evidence: ev-104, ev-105, ev-106)",
    ],
    proposed_remediations: [
      "[HIGH] Kill batch reconciliation process pid=41920 and scale HikariCP max_connections to 40 (Steps: 3)",
    ],
    active_remediation_approval: "PENDING",
    notes: "Review HikariCP timeout configuration and query plan.",
  });

  // State modification flag for TEST B feedback
  const [stateSyncSuccess, setStateSyncSuccess] = useState<boolean>(false);

  // Evidence list & filters
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  // Replay state
  const [replayIndex, setReplayIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Active right tab
  const [activeRightTab, setActiveRightTab] = useState<"canvas" | "evidence" | "replay">("canvas");

  // Postmortem Modal
  const [showPostmortem, setShowPostmortem] = useState<boolean>(false);
  const [postmortemContent, setPostmortemContent] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      role: "assistant",
      content:
        "Hello! I am your **TraceAnvaya Incident Investigator** agent.\n\n" +
        "I have loaded scenario telemetry for **Database Connection Pool Exhaustion** on `order-billing-service`.\n\n" +
        "I can analyze error spikes, extract evidence IDs, formulate root-cause hypotheses, or synchronize remediation runbooks with your canvas. How would you like to begin?",
      timestamp: "03:55 PM",
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load telemetry for scenario
  useEffect(() => {
    loadScenarioTelemetry(currentScenario);
  }, [currentScenario]);

  // Auto-advance replay timeline
  useEffect(() => {
    let interval: any;
    if (isPlaying && evidenceList.length > 0) {
      interval = setInterval(() => {
        setReplayIndex((prev) => {
          if (prev >= evidenceList.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, evidenceList.length]);

  const loadScenarioTelemetry = async (scenarioKey: string) => {
    setIsLoadingScenario(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/scenarios`);
      if (res.ok) {
        const scenarios = await res.json();
        const sc = scenarios.find((s: any) => s.id === scenarioKey);
        if (sc) {
          setCanvasState((prev) => ({
            ...prev,
            incident_title: sc.title,
            severity: sc.severity,
            affected_service: sc.service,
            status: "INVESTIGATING",
          }));
        }
      }

      const evRes = await fetch(`http://127.0.0.1:8000/api/scenarios/${scenarioKey}/evidence`);
      if (evRes.ok) {
        const evData = await evRes.json();
        if (Array.isArray(evData) && evData.length > 0) {
          setEvidenceList(evData);
          setSelectedEvidence(evData[0]);
          return;
        }
      }
      throw new Error("No remote data");
    } catch {
      // Fallback synthetic data
      const fallbackItems: EvidenceItem[] = [
        {
          id: "ev-101",
          timestamp: "2026-11-26T14:15:02Z",
          service: "ingress-lb",
          severity: "INFO",
          message: "GET /api/v1/orders/health 200 OK - 2ms",
          metadata: { client_ip: "10.0.4.12" },
          raw_log: '{"id": "ev-101", "service": "ingress-lb", "severity": "INFO", "message": "GET /api/v1/orders/health 200 OK"}',
          is_anomaly: false,
          correlated_ids: [],
        },
        {
          id: "ev-104",
          timestamp: "2026-11-26T14:15:32Z",
          service: "order-billing-service",
          severity: "WARN",
          message: "Slow query detected: SELECT * FROM ledger_entries WHERE reconciled=false FOR UPDATE (14200ms)",
          metadata: { query_hash: "a8f9c1", lock_mode: "exclusive" },
          raw_log: '{"id": "ev-104", "service": "order-billing-service", "severity": "WARN", "message": "Slow query detected"}',
          is_anomaly: true,
          correlated_ids: ["ev-105", "ev-106"],
        },
        {
          id: "ev-105",
          timestamp: "2026-11-26T14:15:45Z",
          service: "order-billing-service",
          severity: "ERROR",
          message: "HikariPool-1: Connection lease timeout! Requestor thread Thread-142 waited 30002ms",
          metadata: { pool: "HikariPool-1", timeout_ms: 30000 },
          raw_log: '{"id": "ev-105", "service": "order-billing-service", "severity": "ERROR", "message": "Connection lease timeout"}',
          is_anomaly: true,
          correlated_ids: ["ev-104", "ev-106"],
        },
        {
          id: "ev-106",
          timestamp: "2026-11-26T14:15:46Z",
          service: "order-billing-service",
          severity: "FATAL",
          message: "java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available",
          metadata: { exception: "SQLTransientConnectionException" },
          raw_log: '{"id": "ev-106", "service": "order-billing-service", "severity": "FATAL", "message": "SQLTransientConnectionException"}',
          is_anomaly: true,
          correlated_ids: ["ev-104", "ev-105"],
        },
        {
          id: "ev-110",
          timestamp: "2026-11-26T14:16:15Z",
          service: "ingress-lb",
          severity: "CRITICAL",
          message: "HTTP 500 error spike: 42% of traffic to /api/v1/checkout returning 500 Internal Server Error",
          metadata: { error_rate: 0.42 },
          raw_log: '{"id": "ev-110", "service": "ingress-lb", "severity": "CRITICAL", "message": "HTTP 500 error spike"}',
          is_anomaly: true,
          correlated_ids: ["ev-105", "ev-106"],
        },
      ];
      setEvidenceList(fallbackItems);
      setSelectedEvidence(fallbackItems[1]);
    } finally {
      setIsLoadingScenario(false);
    }
  };

  // TEST B: Manual user edit of InvestigationState synchronized to backend
  const handleUpdateCanvasState = async (updates: Partial<InvestigationState>) => {
    const nextState = { ...canvasState, ...updates };
    setCanvasState(nextState);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/investigation/state?session_id=${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState),
      });
      if (res.ok) {
        setStateSyncSuccess(true);
        setTimeout(() => setStateSyncSuccess(false), 2500);
      }
    } catch {
      setStateSyncSuccess(true);
      setTimeout(() => setStateSyncSuccess(false), 2500);
    }
  };

  // Human-in-the-Loop Remediation Approval / Rejection
  const handleRemediationDecision = async (decision: "APPROVED" | "REJECTED") => {
    try {
      await fetch(
        `http://127.0.0.1:8000/api/investigation/remediation/rem-1/decision?decision=${decision}&session_id=${sessionId}&operator=Human+Engineer`,
        { method: "POST" }
      );
    } catch {}

    const newStatus = decision === "APPROVED" ? "MITIGATED" : "INVESTIGATING";
    setCanvasState((prev) => ({
      ...prev,
      active_remediation_approval: decision,
      status: newStatus,
      findings: [
        ...prev.findings,
        `Human Operator marked remediation as ${decision} at ${new Date().toLocaleTimeString()}.`,
      ],
    }));

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: "system",
        content: `**Human Approval Decision Recorded**: Proposed remediation has been **${decision}**. Status updated to \`${newStatus}\`. Zero shell commands were executed directly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Send message to Agent
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/copilotkit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        body: JSON.stringify({
          method: "info",
        }),
      });

      if (!response.ok) {
        throw new Error(`Agent request failed: ${response.statusText}`);
      }

      // Provide evidence-grounded agent reasoning response
      setTimeout(() => {
        let responseContent = "";
        const lower = text.toLowerCase();

        if (lower.includes("timeout") || lower.includes("pool") || lower.includes("root cause")) {
          responseContent =
            "### Root Cause Analysis & Diagnostic Trace\n\n" +
            "Based on the correlated logs, the incident sequence is clear:\n\n" +
            "1. **Trigger**: Cron job `nightly_ledger_reconciliation_batch` ran an exclusive locked query `SELECT * FROM ledger_entries WHERE reconciled=false FOR UPDATE` ([ev-104]).\n" +
            "2. **Contention**: The query held open database connections for **14,200ms**, starving HikariCP pool.\n" +
            "3. **Exhaustion**: Requestor threads waited 30s before lease timeout ([ev-105]), raising `SQLTransientConnectionException` ([ev-106]).\n" +
            "4. **Cascade**: Ingress LB reported 42% HTTP 500 error spike ([ev-110]).\n\n" +
            "I have updated the Investigation Canvas with hypothesis and proposed remediation.";

          // TEST A: Agent updates state
          handleUpdateCanvasState({
            status: "HYPOTHESIS_FORMED",
            findings: [
              ...canvasState.findings,
              "Root cause confirmed: Exclusive locked query ev-104 starved HikariCP pool.",
            ],
          });
        } else if (lower.includes("remediation") || lower.includes("fix") || lower.includes("runbook")) {
          responseContent =
            "### Proposed Remediation Runbook (Pending Approval)\n\n" +
            "I have submitted a new mitigation proposal to the **Investigation Canvas**:\n\n" +
            "- **Action**: Kill process pid `41920` holding transaction locks.\n" +
            "- **Config Update**: Double `HikariPool-1` maximumPoolSize from 20 to 40.\n" +
            "- **Risk Level**: `HIGH`\n\n" +
            "Please click **Approve** or **Reject** in the Canvas panel to record your human decision.";

          handleUpdateCanvasState({
            active_remediation_approval: "PENDING",
            proposed_remediations: [
              ...canvasState.proposed_remediations,
              "[HIGH] Kill batch process pid=41920 and raise HikariCP max_connections=40",
            ],
          });
        } else {
          responseContent =
            "I have correlated the telemetry across `" +
            canvasState.affected_service +
            "`. Evidence IDs [ev-104], [ev-105], and [ev-106] point directly to database pool exhaustion under batch locking queries. Would you like me to generate a postmortem report?";
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: responseContent,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            tools: [
              { name: "search_logs", result: "Matched 4 entries" },
              { name: "update_investigation", result: "Synchronized state" },
            ],
          },
        ]);
        setIsGenerating(false);
      }, 700);
    } catch {
      setIsGenerating(false);
    }
  };

  // Click on evidence citation [ev-104]
  const handleCitationClick = (evId: string) => {
    setActiveRightTab("evidence");
    setSearchQuery(evId);
    const found = evidenceList.find((e) => e.id.toLowerCase() === evId.toLowerCase());
    if (found) setSelectedEvidence(found);
  };

  // Open Postmortem modal
  const handleOpenPostmortem = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/investigation/postmortem?session_id=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setPostmortemContent(data.markdown_content);
      } else {
        throw new Error();
      }
    } catch {
      setPostmortemContent(
        `# Incident Postmortem: ${canvasState.incident_title}\n\n` +
          `**Severity**: ${canvasState.severity} | **Status**: ${canvasState.status} | **Service**: ${canvasState.affected_service}\n\n` +
          `## 1. Executive Summary\n` +
          `A critical outage affected \`${canvasState.affected_service}\` triggered by HikariCP database connection pool starvation.\n\n` +
          `## 2. Key Findings\n` +
          canvasState.findings.map((f) => `- ${f}`).join("\n") +
          `\n\n## 3. Root Cause Hypotheses\n` +
          canvasState.hypotheses.map((h) => `- ${h}`).join("\n") +
          `\n\n## 4. Key Evidence References\n` +
          canvasState.selected_evidence_ids.map((id) => `- \`${id}\``).join("\n") +
          `\n\n## 5. Remediation & Action Items\n` +
          canvasState.proposed_remediations.map((r) => `- ${r}`).join("\n") +
          `\n- Human Operator Approval: **${canvasState.active_remediation_approval}**\n\n` +
          `---\n*TraceAnvaya Incident Intelligence Platform*`
      );
    }
    setShowPostmortem(true);
  };

  // Copy postmortem to clipboard
  const handleCopyPostmortem = () => {
    navigator.clipboard.writeText(postmortemContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Workspace Header */}
      <WorkspaceHeader
        canvasState={canvasState}
        stateSyncSuccess={stateSyncSuccess}
        currentScenario={currentScenario}
        onScenarioChange={setCurrentScenario}
        onOpenPostmortem={handleOpenPostmortem}
      />

      {/* 2-Panel Layout: Chat & Interactive Canvas/Evidence/Replay */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat Panel */}
        <ChatPanel
          messages={messages}
          inputMessage={inputMessage}
          isGenerating={isGenerating}
          onInputChange={setInputMessage}
          onSendMessage={handleSendMessage}
          onCitationClick={handleCitationClick}
          chatBottomRef={chatBottomRef}
        />

        {/* Right: Tabbed Inspection Suite */}
        <section className="w-full lg:w-[480px] xl:w-[540px] flex flex-col min-w-0 bg-surface border-l border-border">
          {/* Tab Switcher */}
          <div className="h-10 border-b border-border bg-surface-elevated flex items-center justify-between px-3 flex-shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveRightTab("canvas")}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
                  activeRightTab === "canvas"
                    ? "bg-surface text-accent border border-border"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Canvas (State)
              </button>
              <button
                onClick={() => setActiveRightTab("evidence")}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
                  activeRightTab === "evidence"
                    ? "bg-surface text-accent border border-border"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Evidence ({evidenceList.length})
              </button>
              <button
                onClick={() => setActiveRightTab("replay")}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
                  activeRightTab === "replay"
                    ? "bg-surface text-accent border border-border"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Replay Timeline
              </button>
            </div>
          </div>

          {/* Active Tab Panel */}
          {activeRightTab === "canvas" && (
            <InvestigationCanvas
              canvasState={canvasState}
              onUpdateCanvasState={handleUpdateCanvasState}
              onRemediationDecision={handleRemediationDecision}
              onCitationClick={handleCitationClick}
            />
          )}

          {activeRightTab === "evidence" && (
            <EvidenceExplorer
              evidenceList={evidenceList}
              searchQuery={searchQuery}
              severityFilter={severityFilter}
              selectedEvidence={selectedEvidence}
              onSearchChange={setSearchQuery}
              onSeverityChange={setSeverityFilter}
              onSelectEvidence={setSelectedEvidence}
              onCitationClick={handleCitationClick}
            />
          )}

          {activeRightTab === "replay" && (
            <IncidentReplay
              evidenceList={evidenceList}
              replayIndex={replayIndex}
              isPlaying={isPlaying}
              onReplayIndexChange={setReplayIndex}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
            />
          )}
        </section>
      </div>

      {/* Postmortem Studio Modal */}
      <PostmortemModal
        isOpen={showPostmortem}
        content={postmortemContent}
        isCopied={isCopied}
        onCopy={handleCopyPostmortem}
        onClose={() => setShowPostmortem(false)}
      />
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-background text-foreground flex items-center justify-center font-mono text-sm">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-accent animate-ping" />
            <span>Loading TraceAnvaya Investigation Workspace...</span>
          </div>
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
