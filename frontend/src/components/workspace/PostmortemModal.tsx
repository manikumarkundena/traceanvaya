"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Download, FileText, X } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface PostmortemModalProps {
  isOpen: boolean;
  content: string;
  isCopied: boolean;
  onCopy: () => void;
  onClose: () => void;
}

export function PostmortemModal({
  isOpen,
  content,
  isCopied,
  onCopy,
  onClose,
}: PostmortemModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.26, ease: EASE_OUT_EXPO }}
            className="w-full max-w-3xl max-h-[85vh] bg-surface border border-white/[0.1] rounded-2xl flex flex-col shadow-[0_30px_80px_-15px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.08)] overflow-hidden"
          >
            {/* Modal header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-surface-elevated">
              <div className="flex items-center gap-2 font-mono">
                <FileText className="w-4 h-4 text-accent" />
                <span className="font-bold text-sm text-foreground">Postmortem Studio</span>
                <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                  EXPORT READY
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-surface border border-white/[0.08] hover:border-accent/40 text-foreground transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-accent" />}
                  <span>{isCopied ? "Copied" : "Copy Markdown"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "traceanvaya-postmortem.md";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-surface border border-white/[0.08] hover:border-accent/40 text-foreground transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Download className="w-3.5 h-3.5 text-accent" />
                  <span>Export .md</span>
                </button>
                <button
                  type="button"
                  aria-label="Close Postmortem Studio"
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-surface text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal body: Markdown preview */}
            <div className="p-6 overflow-y-auto font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap select-text bg-background">
              {content}
            </div>

            {/* Modal footer */}
            <div className="p-4 border-t border-white/[0.08] bg-surface-elevated flex items-center justify-between text-xs font-mono text-muted">
              <span>TraceAnvaya Incident Intelligence &bull; Standard Markdown Export</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded bg-accent text-background font-semibold hover:bg-accent/90 transition-all active:scale-95"
              >
                Close Studio
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
