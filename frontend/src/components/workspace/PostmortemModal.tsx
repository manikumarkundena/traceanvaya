import React from "react";
import { Check, Copy, FileText, X } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[85vh] bg-surface border border-border rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface-elevated">
          <div className="flex items-center gap-2 font-mono">
            <FileText className="w-4 h-4 text-accent" />
            <span className="font-bold text-sm text-foreground">Postmortem Studio</span>
            <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
              EXPORT READY
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-surface border border-border hover:bg-border text-foreground transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-accent" />}
              <span>{isCopied ? "Copied" : "Copy Markdown"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-border text-muted hover:text-foreground transition-colors"
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
        <div className="p-4 border-t border-border bg-surface-elevated flex items-center justify-between text-xs font-mono text-muted">
          <span>TraceAnvaya Incident Intelligence &bull; Standard Markdown Export</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-accent text-background font-semibold hover:bg-accent/90 transition-colors"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
}
