import React from "react";

/**
 * Atmospheric animated background system for the landing page.
 * Uses GPU-composited CSS transforms, radial gradients, fine technical grid,
 * subtle SVG fractal noise, and an edge vignette. Zero WebGL/Three.js.
 */
export function CinematicBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* 1. Fine technical grid with radial fade mask */}
      <div
        className="absolute inset-0 tech-grid opacity-40"
        style={{
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 25%, black 25%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 25%, black 25%, transparent 90%)",
        }}
      />

      {/* 2. Primary radial atmospheric emerald glow (top-right / hero focal) */}
      <div
        className="absolute -top-40 right-[-10%] w-[780px] h-[680px] rounded-full animate-glow-breathe"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.20) 0%, rgba(94, 234, 212, 0.08) 38%, rgba(5, 8, 7, 0) 72%)",
        }}
      />

      {/* 3. Secondary soft mint volumetric pool (top-left balance) */}
      <div
        className="hidden md:block absolute -top-24 -left-32 w-[560px] h-[520px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(94, 234, 212, 0.09) 0%, rgba(16, 185, 129, 0.03) 45%, transparent 72%)",
        }}
      />

      {/* 4. Flowing diagonal emerald light ribbons (distinct widths, blurs & phases) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Ribbon A: Wide soft volumetric shaft */}
        <div
          className="absolute -top-1/3 left-[18%] w-[360px] h-[150vh] blur-3xl animate-ribbon-a"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.22) 35%, rgba(94, 234, 212, 0.14) 60%, transparent 100%)",
          }}
        />

        {/* Ribbon B: Medium crisp mint beam (desktop/tablet) */}
        <div
          className="hidden sm:block absolute -top-1/4 left-[52%] w-[200px] h-[145vh] blur-2xl animate-ribbon-b"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(94, 234, 212, 0.18) 40%, rgba(16, 185, 129, 0.10) 70%, transparent 100%)",
          }}
        />

        {/* Ribbon C: Fine high-clarity specular shaft (desktop only) */}
        <div
          className="hidden lg:block absolute -top-1/3 right-[16%] w-[110px] h-[140vh] blur-xl animate-ribbon-a"
          style={{
            animationDelay: "-7s",
            animationDuration: "21s",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(94, 234, 212, 0.24) 45%, rgba(52, 211, 153, 0.08) 75%, transparent 100%)",
          }}
        />

        {/* Subtle directional light sweep */}
        <div
          className="hidden md:block absolute top-0 left-0 w-[260px] h-[160vh] blur-3xl animate-light-sweep"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(94, 234, 212, 0.14) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* 5. Very subtle SVG noise texture for tactile dark-glass depth */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.028] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="traceanvaya-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#traceanvaya-noise)" />
      </svg>

      {/* 6. Edge vignette preserving crisp headline contrast */}
      <div className="absolute inset-0 vignette-overlay opacity-80" />
    </div>
  );
}
