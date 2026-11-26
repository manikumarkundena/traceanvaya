import React from "react";
import { Send, Sparkles } from "lucide-react";
import { ChatMessage } from "../workspace/types";
import { MessageItem } from "./MessageItem";

interface ChatPanelProps {
  messages: ChatMessage[];
  inputMessage: string;
  isGenerating: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: (text?: string) => void;
  onCitationClick: (evidenceId: string) => void;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatPanel({
  messages,
  inputMessage,
  isGenerating,
  onInputChange,
  onSendMessage,
  onCitationClick,
  chatBottomRef,
}: ChatPanelProps) {
  return (
    <section className="flex-1 flex flex-col min-w-0 border-r border-border bg-background relative">
      {/* Chat header */}
      <div className="h-10 border-b border-border bg-surface/60 flex items-center justify-between px-4 text-xs font-mono text-muted flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-foreground font-semibold">AI Investigator</span>
          <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">
            Pydantic AI &bull; StateDeps
          </span>
        </div>
        <span>{messages.length} interactions</span>
      </div>

      {/* Chat messages scroll area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} onCitationClick={onCitationClick} />
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs font-mono text-accent py-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Investigator is executing tools & reasoning via AG-UI stream...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2 border-t border-border/60 bg-surface/40 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
        <span className="text-muted flex-shrink-0">Prompts:</span>
        <button
          onClick={() => onSendMessage("Analyze root cause of HTTP 500 error spike and correlate evidence.")}
          className="px-2.5 py-1 rounded bg-surface hover:bg-surface-elevated border border-border text-foreground hover:text-accent whitespace-nowrap transition-colors"
        >
          Analyze root cause of 500 spike
        </button>
        <button
          onClick={() => onSendMessage("Trace HikariCP connection lease timeout sequence.")}
          className="px-2.5 py-1 rounded bg-surface hover:bg-surface-elevated border border-border text-foreground hover:text-accent whitespace-nowrap transition-colors"
        >
          Trace HikariCP lease timeout
        </button>
        <button
          onClick={() => onSendMessage("Propose safe remediation runbook for review.")}
          className="px-2.5 py-1 rounded bg-surface hover:bg-surface-elevated border border-border text-foreground hover:text-accent whitespace-nowrap transition-colors"
        >
          Propose remediation runbook
        </button>
      </div>

      {/* Message Composer */}
      <div className="p-3 sm:p-4 border-t border-border bg-surface flex items-center gap-2">
        <textarea
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          placeholder="Ask investigator to correlate logs, form hypothesis, or propose fixes (Enter to send, Shift+Enter for newline)..."
          rows={1}
          className="flex-1 bg-background border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent resize-none min-h-[40px] max-h-32"
        />
        <button
          onClick={() => onSendMessage()}
          disabled={!inputMessage.trim() || isGenerating}
          className="p-2.5 rounded-lg bg-accent text-background hover:bg-accent/90 disabled:opacity-50 transition-all font-semibold"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
