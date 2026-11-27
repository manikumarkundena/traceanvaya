"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#050807] text-foreground flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full rounded-2xl border border-critical/30 bg-[#0D1411] p-8 text-center space-y-5 shadow-2xl">
        <div className="w-11 h-11 rounded-xl bg-critical/10 border border-critical/25 flex items-center justify-center mx-auto text-critical">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-mono text-critical uppercase tracking-widest">Application Error</p>
          <h1 className="text-xl font-bold font-display text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            {error?.message || "An unexpected client error occurred while rendering this view."}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-[#050807] hover:brightness-105 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white/[0.05] border border-white/[0.1] text-foreground hover:bg-white/[0.09] transition-colors"
          >
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
