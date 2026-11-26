import React from "react";
import { ArrowDown, ArrowUp, Cpu, Database, GitBranch, Layers, ShieldCheck, Terminal } from "lucide-react";

export function ArchitectureDiagram() {
  return (
    <section id="architecture" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
          Clean Architecture & Protocol
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-sans">
          AG-UI Event Protocol & Pydantic AI StateDeps
        </h2>
        <p className="text-muted mt-4 text-sm sm:text-base font-sans leading-relaxed">
          No generic LLM wrapper. TraceAnvaya connects Next.js CopilotKit to a typed Pydantic AI
          agent through official AG-UI streaming protocol events.
        </p>
      </div>

      <div className="p-6 sm:p-10 rounded-2xl border border-border bg-surface shadow-xl relative overflow-hidden">
        {/* Subtle background ambient beam */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 lg:gap-2 items-center font-mono">
          
          {/* Box 1: Frontend Client (cols 1-3) */}
          <div className="lg:col-span-3 p-5 rounded-xl border border-border bg-surface-elevated space-y-3">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>LAYER 01</span>
              <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                BROWSER CLIENT
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground font-sans">Next.js 15 & CopilotKit</h4>
            <div className="space-y-1.5 text-xs text-muted font-sans">
              <div className="flex items-center gap-1.5 text-foreground text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-accent" />
                <span>Investigation Canvas & Explorer</span>
              </div>
              <div className="text-[11px] text-muted">
                Scoped <code>CopilotRuntime</code> via App Router endpoint <code>/api/copilotkit</code>
              </div>
            </div>
          </div>

          {/* Protocol Flow 1 (cols 4) */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-1 text-accent">
            <div className="hidden lg:flex flex-col items-center gap-1 text-[10px]">
              <ArrowDown className="w-4 h-4 animate-bounce" />
              <span className="text-[9px] uppercase tracking-wider text-muted">HTTP</span>
              <ArrowUp className="w-4 h-4" />
            </div>
            <div className="lg:hidden flex items-center gap-2 text-xs py-2">
              <span>↕ HTTP / SSE</span>
            </div>
          </div>

          {/* Box 2: AG-UI Adapter Bridge (cols 5-7) */}
          <div className="lg:col-span-3 p-5 rounded-xl border border-accent/40 bg-background space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>PROTOCOL BRIDGE</span>
              <span className="text-[10px] text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                AG-UI SSE
              </span>
            </div>
            <h4 className="text-base font-bold text-accent font-sans">AG-UI Event Stream</h4>
            <div className="p-2.5 rounded bg-surface border border-border text-[10px] space-y-1">
              <div className="text-muted">Standard Lifecycle & State Events:</div>
              <div className="text-foreground">
                &bull; <code>RUN_STARTED</code> / <code>RUN_FINISHED</code><br />
                &bull; <code>TEXT_MESSAGE_CONTENT</code><br />
                &bull; <code>TOOL_CALL_START</code> & <code>TOOL_CALL_RESULT</code><br />
                &bull; <code>STATE_SNAPSHOT</code> & <code>STATE_DELTA</code>
              </div>
            </div>
          </div>

          {/* Protocol Flow 2 (cols 8) */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-1 text-accent">
            <div className="hidden lg:flex flex-col items-center gap-1 text-[10px]">
              <ArrowDown className="w-4 h-4 animate-bounce" />
              <span className="text-[9px] uppercase tracking-wider text-muted">TYPED</span>
              <ArrowUp className="w-4 h-4" />
            </div>
            <div className="lg:hidden flex items-center gap-2 text-xs py-2">
              <span>↕ StateDeps</span>
            </div>
          </div>

          {/* Box 3: Agentic Backend (cols 9-11) */}
          <div className="lg:col-span-3 p-5 rounded-xl border border-border bg-surface-elevated space-y-3">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>LAYER 02</span>
              <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                PYTHON BACKEND
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground font-sans">FastAPI & Pydantic AI</h4>
            <div className="space-y-1.5 text-xs font-sans">
              <div className="text-[11px] text-foreground flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-accent" />
                <span>StateDeps[InvestigationState]</span>
              </div>
              <div className="text-[11px] text-muted flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-accent" />
                <span>Async SQLite & PostgreSQL</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footnote distinguishing schema */}
        <div className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-muted gap-2">
          <span>Official protocol events verified against ag-ui-protocol 1.0.0</span>
          <span>Zero unsafe shell dispatch &bull; Human-gated remediation</span>
        </div>
      </div>
    </section>
  );
}
