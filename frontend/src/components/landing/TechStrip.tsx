import React from "react";
import { Cpu, GitBranch, Sparkles, Layers, FileCode, Database } from "lucide-react";

const TECH_ITEMS = [
  { name: "Pydantic AI", icon: Cpu },
  { name: "AG-UI Protocol", icon: GitBranch },
  { name: "CopilotKit", icon: Sparkles },
  { name: "FastAPI & AsyncIO", icon: Layers },
  { name: "Next.js 15", icon: FileCode },
  { name: "PostgreSQL", icon: Database },
] as const;

export function TechStrip() {
  return (
    <section
      aria-label="Technology stack"
      className="border-y border-white/[0.07] bg-surface/40 backdrop-blur-sm py-7 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <span className="text-[11px] font-mono text-muted uppercase tracking-widest flex-shrink-0">
          Built with
        </span>

        {/* Marquee container (static wrapped fallback for reduced motion) */}
        <div
          className="relative flex-1 w-full overflow-hidden group"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          {/* Animated seamless marquee track */}
          <div className="flex w-max items-center gap-10 sm:gap-14 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:hidden">
            {[...TECH_ITEMS, ...TECH_ITEMS].map((item, idx) => {
              const Icon = item.icon;
              return (
                <span
                  key={`${item.name}-${idx}`}
                  tabIndex={idx < TECH_ITEMS.length ? 0 : -1}
                  aria-hidden={idx >= TECH_ITEMS.length}
                  className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-foreground/85 hover:text-accent focus-visible:text-accent focus-visible:outline-none transition-colors whitespace-nowrap"
                >
                  <Icon className="w-4 h-4 text-accent/90" />
                  <span>{item.name}</span>
                </span>
              );
            })}
          </div>

          {/* Static accessible fallback for prefers-reduced-motion */}
          <div className="hidden motion-reduce:flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-mono text-foreground">
            {TECH_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <span key={item.name} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-accent" />
                  <span>{item.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
