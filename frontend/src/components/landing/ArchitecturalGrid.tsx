"use client";

import React from "react";

/**
 * Stage 3.4 Architectural Grid (Vercel Precision Inspired):
 * - Fine neutral architectural guide lines aligned to the main 7xl container.
 * - Understated corner crosshairs (+) at architectural coordinate intersections.
 * - Smooth vertical fading mask creating continuous structural rhythm down the page.
 * - 100% responsive and non-intrusive.
 */
export function ArchitecturalGrid() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      <div className="max-w-7xl mx-auto h-full w-full relative px-4 sm:px-6">
        {/* Outer Container Boundary Guides */}
        <div className="absolute inset-y-0 left-4 sm:left-6 w-px bg-white/[0.035]" />
        <div className="absolute inset-y-0 right-4 sm:right-6 w-px bg-white/[0.035]" />

        {/* Central Architectural Column Dividers */}
        <div className="hidden lg:block absolute inset-y-0 left-1/4 w-px bg-white/[0.02]" />
        <div className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-white/[0.025]" />
        <div className="hidden lg:block absolute inset-y-0 left-3/4 w-px bg-white/[0.02]" />

        {/* Subtle Horizontal Structural Coordinate Crosshairs */}
        {/* Marker 1: Top Header Boundary */}
        <div className="absolute top-24 left-2 sm:left-4 text-white/20 font-mono text-[10px] select-none leading-none">
          +
        </div>
        <div className="absolute top-24 right-2 sm:right-4 text-white/20 font-mono text-[10px] select-none leading-none">
          +
        </div>

        {/* Marker 2: Post-Hero Transition */}
        <div className="absolute top-[960px] left-2 sm:left-4 text-white/25 font-mono text-[10px] select-none leading-none">
          +
        </div>
        <div className="absolute top-[960px] right-2 sm:right-4 text-white/25 font-mono text-[10px] select-none leading-none">
          +
        </div>

        {/* Marker 3: Features Boundary */}
        <div className="absolute top-[1850px] left-2 sm:left-4 text-white/20 font-mono text-[10px] select-none leading-none">
          +
        </div>
        <div className="absolute top-[1850px] right-2 sm:right-4 text-white/20 font-mono text-[10px] select-none leading-none">
          +
        </div>

        {/* Marker 4: Architecture Boundary */}
        <div className="absolute top-[2800px] left-2 sm:left-4 text-white/20 font-mono text-[10px] select-none leading-none">
          +
        </div>
        <div className="absolute top-[2800px] right-2 sm:right-4 text-white/20 font-mono text-[10px] select-none leading-none">
          +
        </div>
      </div>
    </div>
  );
}
