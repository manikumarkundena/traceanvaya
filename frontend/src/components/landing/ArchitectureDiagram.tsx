import React from "react";

export function ArchitectureDiagram() {
  return (
    <section id="architecture" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
          Clean Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          True AG-UI Protocol & Pydantic AI StateDeps
        </h2>
        <p className="text-muted mt-4 text-sm sm:text-base">
          No generic LLM wrapper. TraceAnvaya implements the official AG-UI event protocol
          between Next.js CopilotKit and FastAPI Pydantic AI.
        </p>
      </div>

      <div className="p-6 sm:p-10 rounded-2xl border border-border bg-surface">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center text-center font-mono">
          {/* Layer 1: Client */}
          <div className="p-6 rounded-xl border border-border bg-surface-elevated">
            <span className="text-xs text-muted block mb-1">FRONTEND LAYER</span>
            <h4 className="text-base font-bold text-foreground">Next.js 15 & CopilotKit</h4>
            <p className="text-xs text-muted mt-2 font-sans">
              React hooks: <code>useCoAgent</code>, <code>useCopilotChat</code>, Generative UI tool renderers.
            </p>
          </div>

          {/* Protocol bridge */}
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-xs text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              &larr; AG-UI Event Protocol (SSE) &rarr;
            </span>
            <span className="text-[11px] text-muted font-sans">
              RUN_STARTED &bull; TOOL_CALL_START &bull; STATE_SNAPSHOT
            </span>
          </div>

          {/* Layer 2: Backend */}
          <div className="p-6 rounded-xl border border-border bg-surface-elevated">
            <span className="text-xs text-muted block mb-1">AGENTIC BACKEND</span>
            <h4 className="text-base font-bold text-foreground">FastAPI & Pydantic AI</h4>
            <p className="text-xs text-muted mt-2 font-sans">
              <code>AGUIAdapter</code> with typed <code>StateDeps[InvestigationState]</code> & Gemini / TestModel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
