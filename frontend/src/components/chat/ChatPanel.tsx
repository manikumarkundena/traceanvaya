"use client";

import React, { useEffect, useRef } from "react";
import { Paperclip, Send, Sparkles, Square } from "lucide-react";
import { ChatMessage } from "../workspace/types";
import { MessageItem } from "./MessageItem";

interface ChatPanelProps {
  messages: ChatMessage[];
  inputMessage: string;
  isGenerating: boolean;
  aiMode: "live" | "demo";
  hasEvidence: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: (text?: string) => void;
  onCancelGeneration?: () => void;
  onUploadFile?: (file: File) => void;
  onCitationClick: (evidenceId: string) => void;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
}

const SUGGESTED_PROMPTS = [
  { label: "Analyze the error spike", prompt: "Analyze the error spike and identify affected services." },
  { label: "Identify the likely root cause", prompt: "Identify the likely root cause of this incident." },
  { label: "Show supporting evidence", prompt: "Show supporting evidence and key anomaly IDs." },
  { label: "Explain how the incident unfolded", prompt: "Explain how the incident unfolded chronologically." },
  { label: "Propose a remediation plan", prompt: "Propose a remediation plan for operator review." },
] as const;

export function ChatPanel({
  messages,
  inputMessage,
  isGenerating,
  aiMode,
  hasEvidence,
  onInputChange,
  onSendMessage,
  onCancelGeneration,
  onUploadFile,
  onCitationClick,
  chatBottomRef,
}: ChatPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea to fit multiline input cleanly
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [inputMessage]);

  const msgCountLabel =
    messages.length === 1 ? "1 message" : `${messages.length} messages`;

  return (
    <section className="flex-1 flex flex-col min-w-0 border-r border-white/[0.08] bg-[#070B09] relative">
      {/* Clean Product Chat Header */}
      <div className="h-11 border-b border-white/[0.08] bg-[#0B110E] flex items-center justify-between px-4 sm:px-5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs sm:text-sm text-foreground font-semibold font-sans">
            Incident Investigator
          </span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full border font-sans font-medium ${
              aiMode === "live"
                ? "bg-success/10 text-success border-success/25"
                : "bg-white/[0.04] text-slate-300 border-white/[0.1]"
            }`}
            title={
              aiMode === "live"
                ? "Connected to live LLM provider"
                : "Running in deterministic demo mode (no external LLM key configured)"
            }
          >
            {aiMode === "live" ? "Live AI" : "Demo Mode"}
          </span>
        </div>
        <span className="text-xs text-muted font-sans">{msgCountLabel}</span>
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* First-Use Onboarding Guide (visible at start of investigation, hides naturally once user engages) */}
        {messages.length <= 1 && (
          <div className="p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#0D1411] space-y-2.5 max-w-2xl">
            <h3 className="text-sm font-semibold text-foreground font-sans">
              {hasEvidence ? "How to investigate this incident" : "Welcome to TraceAnvaya"}
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
              {hasEvidence
                ? "Start by asking the investigator a question or choosing a suggested prompt below:"
                : "Investigate simulated production incidents grounded in application telemetry:"}
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-slate-300 font-sans">
              {!hasEvidence && (
                <li>
                  Select a demo incident from the header or upload a log file (
                  <code className="font-mono text-accent">.log</code>,{" "}
                  <code className="font-mono text-accent">.txt</code>,{" "}
                  <code className="font-mono text-accent">.json</code>).
                </li>
              )}
              <li>Ask the investigator to analyze the error spike or identify the root cause.</li>
              <li>Click any <code className="font-mono text-accent">[ev-XXX]</code> badge to inspect raw log evidence.</li>
              <li>Step through the chronological Timeline and review proposed remediations.</li>
              <li>Export a Markdown postmortem report from Postmortem Studio.</li>
            </ol>
          </div>
        )}

        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} onCitationClick={onCitationClick} />
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2.5 text-xs text-accent py-2 px-3.5 rounded-lg bg-accent/[0.08] border border-accent/20 w-max font-sans">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>
              {aiMode === "live"
                ? "Investigator is analyzing telemetry..."
                : "Analyzing scenario telemetry (Demo Mode)..."}
            </span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Contextual Suggested Prompts */}
      <div className="px-4 py-2.5 border-t border-white/[0.06] bg-[#090F0C] flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-muted flex-shrink-0 font-sans">Suggested:</span>
        {SUGGESTED_PROMPTS.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={isGenerating}
            onClick={() => onSendMessage(item.prompt)}
            className="px-2.5 py-1 rounded-md bg-[#111915] hover:bg-[#16221C] border border-white/[0.08] hover:border-accent/35 text-xs text-slate-200 hover:text-accent whitespace-nowrap transition-all duration-150 active:scale-[0.98] disabled:opacity-50 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Dark-Mode Multiline Message Composer */}
      <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#0A100D]">
        <div className="flex items-end gap-2 rounded-xl bg-[#060908] border border-white/[0.1] focus-within:border-accent/60 focus-within:ring-1 focus-within:ring-accent/30 px-3 py-2 transition-colors">
          {/* Functional Log Upload Control */}
          {onUploadFile && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".log,.txt,.json,.jsonl"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadFile(file);
                    e.target.value = "";
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
                title="Upload log file (.log, .txt, .json)"
                aria-label="Upload log file"
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-white/[0.06] transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex-shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </>
          )}

          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder="Ask the investigator to analyze logs, trace errors, or propose remediation..."
            aria-label="Message input"
            rows={1}
            className="flex-1 bg-transparent py-1.5 text-xs sm:text-sm text-foreground placeholder:text-slate-500 focus:outline-none resize-none min-h-[36px] max-h-[140px] font-sans leading-relaxed"
          />

          {isGenerating && onCancelGeneration ? (
            <button
              type="button"
              onClick={onCancelGeneration}
              aria-label="Stop generation"
              title="Stop generation"
              className="p-2 rounded-lg bg-white/[0.08] text-foreground hover:bg-white/[0.14] transition-all active:scale-95 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSendMessage()}
              disabled={!inputMessage.trim() || isGenerating}
              aria-label="Send message"
              title="Send message (Enter)"
              className="p-2 rounded-lg bg-accent text-[#050807] hover:bg-accent/90 disabled:opacity-35 disabled:cursor-not-allowed transition-all active:scale-95 font-semibold flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="mt-1.5 px-1 flex items-center justify-between text-[11px] text-slate-500 font-sans">
          <span>Enter to send &bull; Shift+Enter for new line</span>
          <span>Synthetic investigation environment</span>
        </div>
      </div>
    </section>
  );
}
