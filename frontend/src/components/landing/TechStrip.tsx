import React from "react";
import { Cpu, GitBranch, Sparkles, Layers, FileCode, Database } from "lucide-react";

export function TechStrip() {
  return (
    <section className="border-y border-border bg-surface/50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-xs font-mono text-muted uppercase tracking-wider">
          Built with
        </span>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-mono text-foreground">
          <span className="flex items-center gap-2 hover:text-accent transition-colors">
            <Cpu className="w-4 h-4 text-accent" /> Pydantic AI
          </span>
          <span className="flex items-center gap-2 hover:text-accent transition-colors">
            <GitBranch className="w-4 h-4 text-accent" /> AG-UI Protocol
          </span>
          <span className="flex items-center gap-2 hover:text-accent transition-colors">
            <Sparkles className="w-4 h-4 text-accent" /> CopilotKit
          </span>
          <span className="flex items-center gap-2 hover:text-accent transition-colors">
            <Layers className="w-4 h-4 text-accent" /> FastAPI & AsyncIO
          </span>
          <span className="flex items-center gap-2 hover:text-accent transition-colors">
            <FileCode className="w-4 h-4 text-accent" /> Next.js 15
          </span>
          <span className="flex items-center gap-2 hover:text-accent transition-colors">
            <Database className="w-4 h-4 text-accent" /> PostgreSQL
          </span>
        </div>
      </div>
    </section>
  );
}
