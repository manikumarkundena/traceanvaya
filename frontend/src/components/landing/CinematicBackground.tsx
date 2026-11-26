import React from "react";

/**
 * Stage 3.2 Cinematic Lighting Composition:
 * Restores large, expressive, volumetric diagonal emerald light shafts flowing from the upper-right.
 * Features bright luminous cores, wide translucent outer glows, technical coordinate grid,
 * and seamless continuous directional animation without overpowering headline contrast.
 */
export function CinematicBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* 1. Fine technical coordinate grid */}
      <div
        className="absolute inset-0 tech-grid opacity-35"
        style={{
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 30%, black 30%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 30%, black 30%, transparent 92%)",
        }}
      />

      {/* 2. Primary Atmospheric Luminous Source (Upper-right focal origin) */}
      <div
        className="absolute -top-36 right-[-5%] w-[900px] h-[800px] rounded-full animate-glow-breathe"
        style={{
          background:
            "radial-gradient(circle at 55% 45%, rgba(16, 185, 129, 0.32) 0%, rgba(94, 234, 212, 0.16) 30%, rgba(5, 8, 7, 0) 74%)",
        }}
      />

      {/* 3. Deep Volumetric Ambient Glow behind Hero copy */}
      <div
        className="absolute top-10 left-[15%] w-[700px] h-[550px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(94, 234, 212, 0.14) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 80%)",
        }}
      />

      {/* 4. Layer of Fine Diagonal Texture Ribbons */}
      <div className="absolute inset-0 shafts-layer opacity-45" />

      {/* 5. Expressive Volumetric Diagonal Emerald Light Shafts (flowing from upper-right) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Shaft A: Massive soft volumetric emerald beam */}
        <div
          className="absolute -top-[30%] right-[10%] w-[420px] h-[175vh] blur-3xl animate-shaft-a"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.35) 30%, rgba(94, 234, 212, 0.22) 55%, transparent 100%)",
          }}
        />

        {/* Shaft B: Crisp luminous mint core beam */}
        <div
          className="absolute -top-[25%] right-[28%] w-[240px] h-[165vh] blur-2xl animate-shaft-b"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(94, 234, 212, 0.32) 35%, rgba(52, 211, 153, 0.20) 65%, transparent 100%)",
          }}
        />

        {/* Shaft C: High-clarity specular shaft with bright core */}
        <div
          className="hidden sm:block absolute -top-[35%] right-[42%] w-[150px] h-[170vh] blur-xl animate-shaft-c"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.18) 25%, rgba(94, 234, 212, 0.38) 45%, rgba(16, 185, 129, 0.12) 75%, transparent 100%)",
          }}
        />

        {/* Shaft D: Broad background shaft providing ambient contrast depth */}
        <div
          className="hidden lg:block absolute -top-[20%] left-[8%] w-[380px] h-[160vh] blur-3xl animate-shaft-a"
          style={{
            animationDelay: "-8s",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.18) 40%, rgba(94, 234, 212, 0.10) 65%, transparent 100%)",
          }}
        />

        {/* Dynamic Light Sweep along the angle of the ribbons */}
        <div
          className="absolute top-0 left-[-20%] w-[300px] h-[180vh] blur-3xl animate-light-sweep"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(94, 234, 212, 0.24) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* 6. Subtle SVG Noise Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.032] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="traceanvaya-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#traceanvaya-noise)" />
      </svg>

      {/* 7. Edge Vignette preserving readable content contrast */}
      <div className="absolute inset-0 vignette-overlay opacity-85" />
    </div>
  );
}
