"use client";

import React, { useState, useEffect, useRef } from "react";
import { EvidenceItem, InvestigationState, ChatMessage } from "@/components/workspace/types";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { InvestigationCanvas } from "@/components/workspace/InvestigationCanvas";
import { EvidenceExplorer } from "@/components/workspace/EvidenceExplorer";
import { IncidentReplay } from "@/components/workspace/IncidentReplay";
import { PostmortemModal } from "@/components/workspace/PostmortemModal";
import {
  SCENARIO_PRESETS,
  createInitialCanvasState,
} from "@/components/workspace/scenarioData";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "");

function WorkspaceContent() {
  const [currentScenario, setCurrentScenario] = useState<string>("scenario-1");
  const sessionId = `session-${currentScenario}`;
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [aiMode, setAiMode] = useState<"live" | "demo">("demo");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sc = params.get("scenario");
      if (sc) setCurrentScenario(sc);
    }
  }, []);

  // Check backend health & AI provider availability
  useEffect(() => {
    if (!BACKEND_URL) return;
    const checkHealth = async () => {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 1500);
        const res = await fetch(`${BACKEND_URL}/api/health`, {
          signal: controller.signal,
        });
        clearTimeout(tid);
        if (res.ok) {
          const data = await res.json();
          setBackendOnline(true);
          setAiMode(data.ai_configured ? "live" : "demo");
        }
      } catch {
        setBackendOnline(false);
        setAiMode("demo");
      }
    };
    checkHealth();
  }, []);

  // Investigation State (starts clean with metadata; populates progressively)
  const [canvasState, setCanvasState] = useState<InvestigationState>(() =>
    createInitialCanvasState(sessionId, "scenario-1")
  );
  const [stateSyncSuccess, setStateSyncSuccess] = useState<boolean>(false);

  // Evidence list & filters
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  // Replay state
  const [replayIndex, setReplayIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Right panel tab & mobile panel switcher
  const [activeRightTab, setActiveRightTab] = useState<"canvas" | "evidence" | "replay">("canvas");
  const [mobilePanel, setMobilePanel] = useState<"chat" | "canvas" | "evidence" | "replay">("chat");

  // Postmortem Modal
  const [showPostmortem, setShowPostmortem] = useState<boolean>(false);
  const [postmortemContent, setPostmortemContent] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load telemetry when scenario changes
  useEffect(() => {
    loadScenarioTelemetry(currentScenario);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario]);

  // Auto-advance replay timeline
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
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
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, evidenceList.length]);

  const loadScenarioTelemetry = async (scenarioKey: string) => {
    const initial = createInitialCanvasState(sessionId, scenarioKey);
    setCanvasState(initial);
    setReplayIndex(0);
    setIsPlaying(false);
    setSearchQuery("");
    setSeverityFilter("ALL");

    if (scenarioKey === "custom") {
      setEvidenceList([]);
      setSelectedEvidence(null);
      setMessages([
        {
          id: `msg-init-${Date.now()}`,
          role: "assistant",
          content:
            "Workspace ready. Upload a log file (`.log`, `.txt`, `.json`) using the paperclip icon below, or select one of the synthetic incident scenarios from the header.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      return;
    }

    const preset = SCENARIO_PRESETS[scenarioKey] || SCENARIO_PRESETS["scenario-1"];
    let loadedEvidence: EvidenceItem[] = preset.evidence;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      // Load scenario into backend store if available
      const loadRes = await fetch(
        `${BACKEND_URL}/api/scenarios/${scenarioKey}/load?session_id=${sessionId}`,
        { method: "POST", signal: controller.signal }
      ).catch(() => null);

      if (loadRes && loadRes.ok) {
        setBackendOnline(true);
        const evRes = await fetch(
          `${BACKEND_URL}/api/evidence?session_id=${sessionId}&limit=100`,
          { signal: controller.signal }
        ).catch(() => null);
        if (evRes && evRes.ok) {
          const evData = await evRes.json();
          if (Array.isArray(evData) && evData.length > 0) {
            loadedEvidence = evData;
          }
        }
      }
      clearTimeout(timeoutId);
    } catch {
      // Use preset synthetic telemetry offline
    }

    setEvidenceList(loadedEvidence);
    setSelectedEvidence(loadedEvidence[0] || null);
    setMessages([
      {
        id: `msg-init-${Date.now()}`,
        role: "assistant",
        content:
          `Loaded telemetry for **${preset.title}** on \`${preset.service}\` (${loadedEvidence.length} log events).\n\n` +
          `Ask me to analyze the error spike, trace the root cause, inspect supporting evidence, or propose a remediation plan.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Manual user edit of InvestigationState synchronized to backend
  const handleUpdateCanvasState = async (updates: Partial<InvestigationState>) => {
    const nextState = { ...canvasState, ...updates };
    setCanvasState(nextState);

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/investigation/state?session_id=${sessionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextState),
        }
      );
      if (res.ok) {
        setStateSyncSuccess(true);
        setTimeout(() => setStateSyncSuccess(false), 2200);
      }
    } catch {
      // Local state still updated cleanly
    }
  };

  // Load explicit example completed investigation for quick review
  const handleLoadExampleInvestigation = () => {
    const preset = SCENARIO_PRESETS[currentScenario] || SCENARIO_PRESETS["scenario-1"];
    handleUpdateCanvasState({
      status: "HYPOTHESIS_FORMED",
      findings: preset.exampleCompleted.findings,
      hypotheses: preset.exampleCompleted.hypotheses,
      selected_evidence_ids: preset.exampleCompleted.selected_evidence_ids,
      proposed_remediations: preset.exampleCompleted.proposed_remediations,
      active_remediation_approval: "PENDING",
      notes: preset.exampleCompleted.notes,
    });
  };

  // Remediation Approval / Rejection (Simulated environment)
  const handleRemediationDecision = async (decision: "APPROVED" | "REJECTED") => {
    try {
      await fetch(
        `${BACKEND_URL}/api/investigation/remediation/rem-1/decision?decision=${decision}&session_id=${sessionId}&operator=Operator`,
        { method: "POST" }
      );
    } catch {
      // Record locally when offline
    }

    const newStatus = decision === "APPROVED" ? "MITIGATED" : "INVESTIGATING";
    setCanvasState((prev) => ({
      ...prev,
      active_remediation_approval: decision,
      status: newStatus,
      findings: [
        ...prev.findings,
        `Operator recorded remediation decision: ${decision} (${new Date().toLocaleTimeString()}).`,
      ],
    }));

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: "system",
        content: `**Remediation Decision Recorded**: Plan marked as **${decision}** (simulated environment). Incident status updated to \`${newStatus}\`. No production infrastructure commands were executed.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Upload custom log file (.log, .txt, .json)
  const handleUploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      let uploadedItems: EvidenceItem[] | null = null;
      if (backendOnline) {
        const res = await fetch(
          `${BACKEND_URL}/api/evidence/upload?session_id=${sessionId}`,
          { method: "POST", body: formData }
        );
        if (res.ok) {
          const evRes = await fetch(
            `${BACKEND_URL}/api/evidence?session_id=${sessionId}&limit=100`
          );
          if (evRes.ok) {
            uploadedItems = await evRes.json();
          }
        }
      }

      // Client-side parse fallback if offline
      if (!uploadedItems) {
        const text = await file.text();
        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        uploadedItems = lines.slice(0, 100).map((line, idx) => ({
          id: `ev-${900 + idx}`,
          timestamp: new Date().toISOString(),
          service: "uploaded-log",
          severity: /error|fatal|critical|500/i.test(line)
            ? "ERROR"
            : /warn/i.test(line)
            ? "WARN"
            : "INFO",
          message: line.slice(0, 220),
          metadata: { filename: file.name },
          raw_log: line,
          is_anomaly: /error|fatal|critical|warn|500/i.test(line),
          correlated_ids: [],
        }));
      }

      setEvidenceList(uploadedItems);
      setSelectedEvidence(uploadedItems[0] || null);
      setCanvasState((prev) => ({
        ...prev,
        incident_title: `Imported Logs: ${file.name}`,
        affected_service: uploadedItems?.[0]?.service || "uploaded-service",
      }));

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: `Imported **${uploadedItems?.length || 0} log entries** from \`${file.name}\`. You can now inspect them in the Evidence tab or ask me to analyze the anomalies.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: "system",
          content: `Could not parse \`${file.name}\`. Please ensure it is a valid \`.log\`, \`.txt\`, or \`.json\` file.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  // Cancel ongoing generation
  const handleCancelGeneration = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsGenerating(false);
  };

  // Send message: Live AG-UI SSE stream when backend & key are configured,
  // or deterministic scenario-grounded demo mode otherwise.
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();
    if (!text || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Attempt real AG-UI SSE stream if live AI is configured
    if (backendOnline && aiMode === "live") {
      try {
        const res = await fetch(`${BACKEND_URL}/api/agent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          signal: controller.signal,
          body: JSON.stringify({
            threadId: sessionId,
            runId: `run-${Date.now()}`,
            state: canvasState,
            messages: [
              ...messages.map((m) => ({
                id: m.id,
                role: m.role === "system" ? "user" : m.role,
                content: m.content,
              })),
              { id: userMsg.id, role: "user", content: text },
            ],
            tools: [],
            context: [],
          }),
        });

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let assistantText = "";
          const invokedTools: Array<{ name: string; result: string }> = [];
          const assistantMsgId = `msg-${Date.now() + 1}`;

          setMessages((prev) => [
            ...prev,
            {
              id: assistantMsgId,
              role: "assistant",
              content: "",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          let buffer = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const jsonStr = line.slice(5).trim();
              if (!jsonStr || jsonStr === "[DONE]") continue;
              try {
                const evt = JSON.parse(jsonStr);
                if (evt.type === "TEXT_MESSAGE_CONTENT" && evt.delta) {
                  assistantText += evt.delta;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: assistantText, tools: invokedTools } : m
                    )
                  );
                } else if (evt.type === "TOOL_CALL_START" && evt.toolCallName) {
                  invokedTools.push({ name: evt.toolCallName, result: "executed" });
                } else if (evt.type === "STATE_SNAPSHOT" && evt.snapshot) {
                  setCanvasState((prev) => ({ ...prev, ...evt.snapshot }));
                } else if (evt.type === "STATE_DELTA" && Array.isArray(evt.delta)) {
                  setCanvasState((prev) => {
                    const next: Record<string, any> = { ...prev };
                    for (const op of evt.delta) {
                      const key = typeof op.path === "string" ? op.path.replace(/^\//, "").split("/")[0] : "";
                      if (!key || !(key in next)) continue;
                      if (op.op === "replace" || op.op === "add") {
                        if (Array.isArray(next[key]) && op.path.includes("/-")) {
                          next[key] = [...next[key], op.value];
                        } else {
                          next[key] = op.value;
                        }
                      } else if (op.op === "remove" && Array.isArray(next[key])) {
                        next[key] = [];
                      }
                    }
                    return next as InvestigationState;
                  });
                }
              } catch {
                // Ignore partial SSE JSON
              }
            }
          }

          setIsGenerating(false);
          return;
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setIsGenerating(false);
          return;
        }
        // Fall through to deterministic demo mode on network error
      }
    }

    // Deterministic Demo Mode (scenario-grounded progressive analysis)
    setTimeout(() => {
      if (controller.signal.aborted) return;

      const preset = SCENARIO_PRESETS[currentScenario] || SCENARIO_PRESETS["scenario-1"];
      const lower = text.toLowerCase();
      let responseContent = "";
      const demoTools: Array<{ name: string; result: string }> = [];

      if (lower.includes("remediation") || lower.includes("fix") || lower.includes("plan")) {
        responseContent =
          `### Proposed Remediation Plan (Pending Review)\n\n` +
          `Based on the findings for **${canvasState.incident_title}**, I have added a proposed mitigation plan to the **Remediation review** section:\n\n` +
          `- **Action**: ${preset.exampleCompleted.proposed_remediations[0]}\n` +
          `- **Safety Boundary**: Simulated environment — approving records your decision without executing shell commands.\n\n` +
          `Use **Approve Plan** or **Reject Plan** in the Overview panel to record your decision.`;

        demoTools.push({ name: "propose_remediation", result: "queued for review" });

        handleUpdateCanvasState({
          active_remediation_approval: "PENDING",
          proposed_remediations: Array.from(
            new Set([
              ...canvasState.proposed_remediations,
              ...preset.exampleCompleted.proposed_remediations,
            ])
          ),
        });
      } else if (
        lower.includes("root cause") ||
        lower.includes("spike") ||
        lower.includes("timeout") ||
        lower.includes("pool") ||
        lower.includes("analyze")
      ) {
        responseContent =
          `### Root Cause Analysis: ${canvasState.incident_title}\n\n` +
          `Correlated telemetry on \`${canvasState.affected_service}\` reveals:\n\n` +
          preset.exampleCompleted.findings.map((f, i) => `${i + 1}. ${f}`).join("\n") +
          `\n\n**Working Hypothesis**: ${preset.exampleCompleted.hypotheses[0]}\n\n` +
          `I have updated the **Overview** panel with these findings and supporting evidence references.`;

        demoTools.push(
          { name: "search_logs", result: `matched ${preset.exampleCompleted.selected_evidence_ids.length} anomalies` },
          { name: "update_investigation", result: "updated overview" }
        );

        handleUpdateCanvasState({
          status: "HYPOTHESIS_FORMED",
          findings: Array.from(new Set([...canvasState.findings, ...preset.exampleCompleted.findings])),
          hypotheses: Array.from(new Set([...canvasState.hypotheses, ...preset.exampleCompleted.hypotheses])),
          selected_evidence_ids: Array.from(
            new Set([
              ...canvasState.selected_evidence_ids,
              ...preset.exampleCompleted.selected_evidence_ids,
            ])
          ),
        });
      } else if (lower.includes("evidence") || lower.includes("unfolded") || lower.includes("timeline")) {
        const keyIds = preset.exampleCompleted.selected_evidence_ids.map((id) => `[${id}]`).join(", ");
        responseContent =
          `### Supporting Evidence & Progression\n\n` +
          `Key anomaly events in chronological order: ${keyIds}.\n\n` +
          preset.evidence
            .filter((e) => e.is_anomaly)
            .map((e) => `- [${e.id}] \`${e.service}\` (${e.severity}): ${e.message}`)
            .join("\n") +
          `\n\nClick any evidence badge above to inspect the raw log payload in the **Evidence** tab.`;

        demoTools.push({ name: "summarize_log_patterns", result: `${preset.evidence.length} events` });

        handleUpdateCanvasState({
          selected_evidence_ids: Array.from(
            new Set([
              ...canvasState.selected_evidence_ids,
              ...preset.exampleCompleted.selected_evidence_ids,
            ])
          ),
        });
      } else {
        const keyIds = preset.exampleCompleted.selected_evidence_ids.map((id) => `[${id}]`).join(", ");
        responseContent =
          `I reviewed the ${evidenceList.length} telemetry events for **${canvasState.incident_title}** on \`${canvasState.affected_service}\`.\n\n` +
          `Primary anomalies appear at ${keyIds}. Would you like me to analyze the root cause or propose a remediation plan?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: responseContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tools: demoTools.length > 0 ? demoTools : undefined,
        },
      ]);
      setIsGenerating(false);
    }, 550);
  };

  // Click on evidence citation [ev-104]
  const handleCitationClick = (evId: string) => {
    setActiveRightTab("evidence");
    setMobilePanel("evidence");
    setSearchQuery(evId);
    const found = evidenceList.find((e) => e.id.toLowerCase() === evId.toLowerCase());
    if (found) setSelectedEvidence(found);
  };

  // Open Postmortem modal
  const handleOpenPostmortem = async () => {
    try {
      if (backendOnline) {
        const res = await fetch(
          `${BACKEND_URL}/api/investigation/postmortem?session_id=${sessionId}`
        );
        if (res.ok) {
          const data = await res.json();
          setPostmortemContent(data.markdown_content);
          setShowPostmortem(true);
          return;
        }
      }
    } catch {
      // Fallback to local state synthesis
    }

    const timelineLines =
      evidenceList.length > 0
        ? evidenceList
            .filter((e) => e.is_anomaly)
            .map((e) => `- \`${e.timestamp}\` **[${e.id}]** (${e.service}): ${e.message}`)
            .join("\n")
        : "- No anomaly timeline events recorded.";

    setPostmortemContent(
      `# Incident Postmortem: ${canvasState.incident_title}\n\n` +
        `**Severity**: ${canvasState.severity} | **Status**: ${canvasState.status} | **Service**: \`${canvasState.affected_service}\`\n\n` +
        `## 1. Incident Summary\n` +
        `Investigation for \`${canvasState.affected_service}\` (${canvasState.severity} severity).\n\n` +
        `## 2. Chronological Timeline\n` +
        `${timelineLines}\n\n` +
        `## 3. Findings\n` +
        (canvasState.findings.length > 0
          ? canvasState.findings.map((f) => `- ${f}`).join("\n")
          : "- No findings recorded yet.") +
        `\n\n## 4. Root-Cause Hypothesis\n` +
        (canvasState.hypotheses.length > 0
          ? canvasState.hypotheses.map((h) => `- ${h}`).join("\n")
          : "- No root-cause hypothesis established yet.") +
        `\n\n## 5. Remediation Decisions\n` +
        (canvasState.proposed_remediations.length > 0
          ? canvasState.proposed_remediations.map((r) => `- ${r}`).join("\n")
          : "- No remediation plan proposed.") +
        `\n- Approval Status: **${canvasState.active_remediation_approval}** (Simulated environment)\n\n` +
        `## 6. Follow-up Actions\n` +
        `- ${canvasState.notes || "Schedule engineering review and add regression monitoring."}\n\n` +
        `---\n*Generated by TraceAnvaya Incident Intelligence*`
    );
    setShowPostmortem(true);
  };

  const handleCopyPostmortem = () => {
    navigator.clipboard.writeText(postmortemContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Reset current scenario investigation cleanly
  const handleResetInvestigation = async () => {
    handleCancelGeneration();
    await loadScenarioTelemetry(currentScenario);
    if (BACKEND_URL) {
      const freshState = createInitialCanvasState(sessionId, currentScenario);
      try {
        await fetch(
          `${BACKEND_URL}/api/investigation/state?session_id=${sessionId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(freshState),
          }
        );
      } catch {
        // Ignore offline reset
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#060908] text-foreground overflow-hidden font-sans">
      {/* Workspace Header */}
      <WorkspaceHeader
        canvasState={canvasState}
        stateSyncSuccess={stateSyncSuccess}
        currentScenario={currentScenario}
        onScenarioChange={setCurrentScenario}
        onResetInvestigation={handleResetInvestigation}
        onOpenPostmortem={handleOpenPostmortem}
      />

      {/* Mobile View Switcher (< lg) */}
      <div className="lg:hidden flex items-center border-b border-white/[0.08] bg-[#0B110E] px-3 py-1.5 gap-1 flex-shrink-0">
        {(
          [
            { id: "chat", label: "Investigator" },
            { id: "canvas", label: "Overview" },
            { id: "evidence", label: `Evidence (${evidenceList.length})` },
            { id: "replay", label: "Timeline" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setMobilePanel(tab.id);
              if (tab.id !== "chat") setActiveRightTab(tab.id);
            }}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
              mobilePanel === tab.id
                ? "bg-[#141F1A] text-accent border border-white/[0.1]"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2-Panel Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat Panel */}
        <div
          className={`${
            mobilePanel === "chat" ? "flex" : "hidden"
          } lg:flex flex-1 min-w-0 flex-col`}
        >
          <ChatPanel
            messages={messages}
            inputMessage={inputMessage}
            isGenerating={isGenerating}
            aiMode={aiMode}
            hasEvidence={evidenceList.length > 0}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
            onCancelGeneration={handleCancelGeneration}
            onUploadFile={handleUploadFile}
            onCitationClick={handleCitationClick}
            chatBottomRef={chatBottomRef}
          />
        </div>

        {/* Right: Tabbed Inspection Suite (~40% width on desktop) */}
        <section
          className={`${
            mobilePanel !== "chat" ? "flex" : "hidden"
          } lg:flex w-full lg:w-[42%] xl:w-[40%] max-w-[620px] min-w-0 lg:min-w-[380px] flex-col bg-[#080D0B] border-l border-white/[0.08] overflow-hidden`}
        >
          {/* Desktop Tab Switcher */}
          <div className="hidden lg:flex h-11 border-b border-white/[0.08] bg-[#0B110E] items-center justify-between px-3 flex-shrink-0">
            <div className="flex items-center gap-1 font-sans">
              <button
                type="button"
                onClick={() => setActiveRightTab("canvas")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  activeRightTab === "canvas"
                    ? "bg-[#141F1A] text-accent border border-white/[0.1]"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveRightTab("evidence")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  activeRightTab === "evidence"
                    ? "bg-[#141F1A] text-accent border border-white/[0.1]"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Evidence ({evidenceList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveRightTab("replay")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  activeRightTab === "replay"
                    ? "bg-[#141F1A] text-accent border border-white/[0.1]"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Timeline
              </button>
            </div>
          </div>

          {/* Active Tab Panel */}
          {activeRightTab === "canvas" && (
            <InvestigationCanvas
              canvasState={canvasState}
              backendOnline={backendOnline}
              onUpdateCanvasState={handleUpdateCanvasState}
              onRemediationDecision={handleRemediationDecision}
              onCitationClick={handleCitationClick}
              onLoadExampleInvestigation={handleLoadExampleInvestigation}
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
  return <WorkspaceContent />;
}
