import React from "react";
import Link from "next/link";
import { Terminal, Cpu, Search, RotateCcw, ShieldCheck, FileText, ArrowRight } from "lucide-react";

export function ProductShowcase() {
  return (
    <div className="w-full mt-12 sm:mt-16">
      <div className="relative rounded-xl border border-border bg-surface shadow-2xl overflow-hidden font-mono text-xs">
        {/* Window title bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface-elevated border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-critical/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-warning/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-success/80 inline-block" />
            <span className="ml-2 text-xs text-muted font-sans font-medium">
              TraceAnvaya / Investigation workspace
            </span>
          </div>
          <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 font-bold uppercase tracking-wider">
            SYNTHETIC DEMO
          </span>
        </div>

        {/* 3-Panel Realistic Product Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] bg-background">
          
          {/* Left Panel: Workspace Navigation */}
          <div className="md:col-span-3 border-r border-border bg-surface/50 p-4 space-y-1.5 font-sans">
            <div className="px-3 py-2 rounded-lg bg-surface border border-accent/30 text-accent font-semibold text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Investigation</span>
            </div>
            <div className="px-3 py-2 rounded-lg text-muted hover:text-foreground text-xs flex items-center gap-2 transition-colors">
              <Search className="w-3.5 h-3.5" />
              <span>Evidence explorer</span>
            </div>
            <div className="px-3 py-2 rounded-lg text-muted hover:text-foreground text-xs flex items-center gap-2 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Incident replay</span>
            </div>
            <div className="px-3 py-2 rounded-lg text-muted hover:text-foreground text-xs flex items-center gap-2 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Resolution gate</span>
            </div>
            <div className="px-3 py-2 rounded-lg text-muted hover:text-foreground text-xs flex items-center gap-2 transition-colors">
              <FileText className="w-3.5 h-3.5" />
              <span>Postmortem studio</span>
            </div>

            <div className="pt-6 border-t border-border/80 mt-6 font-mono text-[11px] text-muted space-y-1">
              <div>Session: session-884</div>
              <div>Service: order-billing</div>
            </div>
          </div>

          {/* Center Panel: AI Investigator Conversation */}
          <div className="md:col-span-6 p-4 sm:p-5 flex flex-col justify-between space-y-4 border-r border-border font-sans">
            <div className="space-y-3">
              <div className="text-xs font-mono text-muted flex items-center justify-between">
                <span className="font-semibold text-foreground">AI Investigator</span>
                <span className="text-[10px] text-accent">Pydantic AI StateDeps</span>
              </div>

              {/* User Prompt */}
              <div className="flex justify-end">
                <div className="p-3 rounded-lg bg-surface-elevated border border-border text-xs text-foreground max-w-sm">
                  Investigate the HTTP 500 error spike.
                </div>
              </div>

              {/* Tool Execution Activity Card */}
              <div className="p-3.5 rounded-lg bg-surface border border-accent/25 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-accent font-semibold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Evidence correlation
                  </span>
                  <span className="text-[10px] text-success">SYNCHRONIZED</span>
                </div>
                <div className="text-accent text-[11px] bg-background px-2 py-1 rounded border border-border">
                  search_logs(&quot;connection timeout&quot;)
                </div>
                <p className="text-foreground text-xs font-sans leading-relaxed">
                  HikariCP connection pool exhausted on <code>order-billing-service</code>. Request threads timed out waiting for database connections after 30,000ms.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-muted">
              <span className="flex items-center gap-1.5 text-accent">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                State synchronized via AG-UI protocol
              </span>
              <Link href="/workspace" className="text-accent hover:underline flex items-center gap-1 text-[11px]">
                <span>Inspect full investigation</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right Panel: Investigation State */}
          <div className="md:col-span-3 p-4 bg-surface/30 space-y-4 font-mono text-xs">
            <div className="text-xs font-semibold text-foreground font-sans">
              Investigation state
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-muted">Severity</div>
              <div className="text-critical font-bold text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-critical" />
                CRITICAL
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-muted">Status</div>
              <div className="text-success font-semibold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" />
                Investigating
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border">
              <div className="text-[11px] text-muted">Correlated Evidence</div>
              <div className="flex flex-wrap gap-1 text-[11px]">
                <span className="bg-accent/15 text-accent px-1.5 py-0.5 rounded border border-accent/30 font-bold">
                  ev-104
                </span>
                <span className="bg-accent/15 text-accent px-1.5 py-0.5 rounded border border-accent/30 font-bold">
                  ev-105
                </span>
                <span className="bg-accent/15 text-accent px-1.5 py-0.5 rounded border border-accent/30 font-bold">
                  ev-106
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-border text-[11px]">
              <div className="text-muted">Working Hypothesis</div>
              <p className="text-foreground font-sans leading-relaxed text-[11px]">
                Unindexed batch reconciliation query holding locks on ledger table.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
