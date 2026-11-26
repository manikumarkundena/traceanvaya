"use client";

import React, { useRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlight?: boolean;
  sweep?: boolean;
  elevate?: boolean;
  children: React.ReactNode;
}

/**
 * Precision dark glass surface with illuminated top-edge specular highlight,
 * optional cursor-responsive radial spotlight, and optional hover light sweep.
 */
export function GlassCard({
  spotlight = false,
  sweep = false,
  elevate = true,
  className,
  children,
  onMouseMove,
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (spotlight && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty("--mouse-x", `${x}px`);
      cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    }
    onMouseMove?.(e);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative rounded-xl border border-white/[0.08] bg-gradient-to-b from-[#131D18]/85 to-[#0A100D]/90",
        "shadow-[0_18px_45px_-14px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.07)]",
        "transition-all duration-300 ease-out overflow-hidden",
        elevate &&
          "hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_24px_55px_-12px_rgba(0,0,0,0.75),0_0_32px_-12px_rgba(94,234,212,0.16),inset_0_1px_0_0_rgba(94,234,212,0.22)]",
        className
      )}
      {...props}
    >
      {/* Top edge specular highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-80 group-hover:via-accent/55 transition-opacity duration-300"
      />

      {/* Cursor-responsive radial emerald spotlight */}
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(94, 234, 212, 0.11), transparent 65%)",
          }}
        />
      )}

      {/* Subtle glossy light sweep on hover */}
      {sweep && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
        />
      )}

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
