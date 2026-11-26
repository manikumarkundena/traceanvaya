"use client";

import React from "react";
import { motion } from "motion/react";
import { Cpu } from "lucide-react";
import { ChatMessage } from "../workspace/types";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: ChatMessage;
  onCitationClick: (evidenceId: string) => void;
}

export function MessageItem({ message, onCitationClick }: MessageItemProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
      className={cn("flex flex-col transition-all duration-200", isUser ? "items-end" : "items-start")}
    >
      <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-muted">
        {message.role === "assistant" && (
          <span className="w-2 h-2 rounded-full bg-accent inline-block animate-pulse" />
        )}
        <span className="font-semibold text-foreground">
          {isUser ? "Operator" : isSystem ? "System Gate" : "Investigator"}
        </span>
        <span>{message.timestamp}</span>
      </div>

      <div
        className={cn(
          "p-4 rounded-xl text-xs sm:text-sm leading-relaxed max-w-2xl border transition-all duration-200",
          isUser
            ? "bg-accent/15 border-accent/35 text-foreground shadow-[0_4px_16px_-4px_rgba(94,234,212,0.15)]"
            : isSystem
            ? "bg-warning/10 border-warning/35 text-foreground shadow-[0_4px_16px_-4px_rgba(251,191,36,0.15)]"
            : "bg-[#0E1512]/90 border-white/[0.08] text-foreground shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
        )}
      >
        {/* Tool execution badge if present */}
        {message.tools && message.tools.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5 border-b border-white/[0.08] pb-2.5">
            {message.tools.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-surface-elevated text-accent px-2 py-0.5 rounded border border-white/[0.08] shadow-sm"
              >
                <Cpu className="w-3 h-3 text-accent" />
                <span className="font-semibold">tool: {t.name}</span>
                <span className="text-muted">({t.result})</span>
              </span>
            ))}
          </div>
        )}

        {/* Message content with clickable evidence citation badges */}
        <div className="space-y-2 whitespace-pre-wrap font-sans">
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
                        type="button"
                        onClick={() => onCitationClick(evId)}
                        className="inline-flex items-center mx-0.5 px-1.5 py-0.5 rounded bg-accent/20 hover:bg-accent/35 text-accent font-mono text-[11px] font-bold border border-accent/40 cursor-pointer transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
    </motion.div>
  );
}
