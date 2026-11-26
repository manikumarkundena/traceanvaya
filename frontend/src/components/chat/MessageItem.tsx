import React from "react";
import { Cpu } from "lucide-react";
import { ChatMessage } from "../workspace/types";

interface MessageItemProps {
  message: ChatMessage;
  onCitationClick: (evidenceId: string) => void;
}

export function MessageItem({ message, onCitationClick }: MessageItemProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-muted">
        {message.role === "assistant" && (
          <span className="w-2 h-2 rounded-full bg-accent inline-block" />
        )}
        <span className="font-semibold text-foreground">
          {isUser ? "Operator" : isSystem ? "System Gate" : "Investigator"}
        </span>
        <span>{message.timestamp}</span>
      </div>

      <div
        className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed max-w-2xl border ${
          isUser
            ? "bg-accent/15 border-accent/30 text-foreground"
            : isSystem
            ? "bg-warning/10 border-warning/30 text-foreground"
            : "bg-surface border-border text-foreground shadow-sm"
        }`}
      >
        {/* Tool execution badge if present */}
        {message.tools && message.tools.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5 border-b border-border/80 pb-2.5">
            {message.tools.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] font-mono bg-surface-elevated text-accent px-2 py-0.5 rounded border border-border"
              >
                <Cpu className="w-3 h-3" />
                <span>tool: {t.name}</span>
                <span className="text-muted">({t.result})</span>
              </span>
            ))}
          </div>
        )}

        {/* Message content with clickable evidence citation badges */}
        <div className="space-y-2 whitespace-pre-wrap">
          {message.content.split("\n\n").map((paragraph, pIdx) => {
            const parts = paragraph.split(/(\[ev-\d+\])/g);
            return (
              <p key={pIdx}>
                {parts.map((part, i) => {
                  if (/^\[ev-\d+\]$/.test(part)) {
                    const evId = part.slice(1, -1);
                    return (
                      <button
                        key={i}
                        onClick={() => onCitationClick(evId)}
                        className="inline-flex items-center mx-0.5 px-1.5 py-0.2 rounded bg-accent/20 hover:bg-accent/35 text-accent font-mono text-[11px] font-bold border border-accent/40 cursor-pointer transition-colors"
                        title={`Inspect ${evId} in Evidence Explorer`}
                      >
                        {part}
                      </button>
                    );
                  }
                  return part;
                })}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
