import React from "react";

/**
 * Stage 3.3 Hero Atmospheric Lighting Engine:
 * Strictly restricted to the hero section. Fades seamlessly into solid clean carbon background
 * below the hero. Uses slow continuous directional movement, restrained luminous shafts,
 * soft atmospheric depth, and a fine technical grid.
 */
export function CinematicBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-0 inset-x-0 h-[1050px] pointer-events-none overflow-hidden z-0 select-none"
      style={{
        maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
      }}
    >
      {/* 1. Fine technical coordinate grid */}
      <div
        className="absolute inset-0 tech-grid opacity-30"
        style={{
          maskImage: "radial-gradient(ellipse 90% 75% at 50% 25%, black 25%, transparent 88%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 75% at 50% 25%, black 25%, transparent 88%)",
        }}
      />

      {/* 2. Primary Atmospheric Origin (Upper-right focal glow) */}
      <div
        className="absolute -top-32 right-[-5%] w-[820px] h-[720px] rounded-full animate-glow-breathe"
        style={{
          background:
            "radial-gradient(circle at 55% 45%, rgba(16, 185, 129, 0.26) 0%, rgba(94, 234, 212, 0.12) 35%, transparent 72%)",
        }}
      />

      {/* 3. Subtle Shafts Texture Layer */}
      <div className="absolute inset-0 shafts-layer opacity-40" />

      {/* 4. Directional Emerald Light Shafts (Upper-right diagonal flow) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Shaft A: Soft volumetric emerald beam */}
        <div
          className="absolute -top-[25%] right-[12%] w-[380px] h-[140vh] blur-3xl animate-shaft-a"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.28) 32%, rgba(94, 234, 212, 0.16) 60%, transparent 100%)",
          }}
        />

        {/* Shaft B: Medium luminous mint beam */}
        <div
          className="absolute -top-[20%] right-[32%] w-[200px] h-[130vh] blur-2xl animate-shaft-b"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(94, 234, 212, 0.24) 35%, rgba(52, 211, 153, 0.12) 65%, transparent 100%)",
          }}
        />

        {/* Dynamic Light Sweep */}
        <div
          className="absolute top-0 left-[-15%] w-[260px] h-[140vh] blur-3xl animate-light-sweep"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(94, 234, 212, 0.18) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* 5. Edge Vignette ensuring headline contrast */}
      <div className="absolute inset-0 vignette-overlay opacity-90" />
    </div>
  );
}
