"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Cpu } from "lucide-react";
import { ChatMessage } from "../workspace/types";
import { MarkdownContent } from "./MarkdownContent";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: ChatMessage;
  onCitationClick: (evidenceId: string) => void;
}

export function MessageItem({ message, onCitationClick }: MessageItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
      className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
    >
      <div className="flex items-center gap-2 mb-1.5 text-xs text-muted">
        {message.role === "assistant" && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
        )}
        <span className="font-medium text-slate-200 font-sans">
          {isUser
            ? "You"
            : isSystem
            ? message.content.includes("Remediation")
              ? "Approval Gate"
              : "System Notice"
            : "Investigator"}
        </span>
        <span className="font-mono text-[11px] text-slate-500">{message.timestamp}</span>
      </div>

      <div
        className={cn(
          "p-4 sm:p-5 rounded-xl text-[15px] leading-[1.7] max-w-3xl border transition-colors duration-200 break-words",
          isUser
            ? "bg-accent/[0.12] border-accent/30 text-foreground"
            : isSystem
            ? "bg-warning/[0.08] border-warning/30 text-foreground"
            : "bg-[#0D1411] border-white/[0.08] text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
        )}
      >
        {/* Tool execution pills only when actual tool events occurred */}
        {message.tools && message.tools.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5 border-b border-white/[0.07] pb-2.5">
            {message.tools.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-black/40 text-accent px-2 py-0.5 rounded border border-white/[0.08]"
              >
                <Cpu className="w-3 h-3 text-accent" />
                <span className="font-semibold">{t.name}</span>
                <span className="text-slate-400">({t.result})</span>
              </span>
            ))}
          </div>
        )}

        {/* Safe Markdown content with clickable [ev-XXX] citations */}
        <MarkdownContent content={message.content} onCitationClick={onCitationClick} />
      </div>
    </motion.div>
  );
}
