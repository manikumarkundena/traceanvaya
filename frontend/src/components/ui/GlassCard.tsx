"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevate?: boolean;
  children: React.ReactNode;
}

/**
 * Stage 3.3 Restrained Matte Carbon Card:
 * Replaces repetitive glowing glassmorphism with clean dark carbon surfaces,
 * restrained borders, subtle hover transitions, and no gaming-style neon effects.
 */
export function GlassCard({
  elevate = true,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/[0.08] bg-[#0C1310] transition-colors duration-200",
        elevate && "hover:border-white/[0.16]",
        className
      )}
      {...props}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
