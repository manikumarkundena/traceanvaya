"use client";

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Achilles-Inspired Cinematic Emerald Light Curtains:
 * - Tall, descending emerald light curtains from the upper hero with crisp luminous edges
 *   and natural asymmetric atmospheric diffusion.
 * - Deep obsidian black background with subtle filmic grain.
 * - High-contrast left vignette protecting headline legibility.
 * - Smooth scroll-linked fade into the product showcase and body.
 */
export function CinematicBackground() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroLightOpacity = useTransform(scrollY, [0, 650, 1050], [1, 0.5, 0]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity: prefersReducedMotion ? 1 : heroLightOpacity }}
      className="absolute top-0 inset-x-0 h-[1080px] pointer-events-none overflow-hidden z-0 select-none bg-[#050807]"
    >
      {/* 1. Subtle Filmic Atmospheric Grain */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.032] pointer-events-none z-30 mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="achillesGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.78"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#achillesGrain)" />
      </svg>

      {/* 2. Subtle Technical Coordinate Grid (Fading softly around edges) */}
      <div
        className="absolute inset-0 tech-grid opacity-30"
        style={{
          maskImage:
            "radial-gradient(ellipse 85% 70% at 60% 22%, black 18%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 70% at 60% 22%, black 18%, transparent 82%)",
        }}
      />

      {/* 3. Achilles-Style Emerald Light Curtains Descending from Upper Edge */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 58%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 58%, transparent 100%)",
        }}
      >
        {/* Curtain 1: Broad Upper-Right Emerald Curtain */}
        <div
          className={`absolute -top-24 right-[4%] w-[320px] h-[920px] ${
            prefersReducedMotion ? "" : "animate-curtain-a"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.04) 22%, rgba(52, 211, 153, 0.24) 62%, rgba(167, 243, 208, 0.36) 72%, rgba(16, 185, 129, 0.08) 82%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 55%, transparent 100%)",
            filter: "blur(10px)",
          }}
        />

        {/* Curtain 2: Crisp Luminous Edge Shaft */}
        <div
          className={`absolute -top-20 right-[16%] w-[180px] h-[860px] ${
            prefersReducedMotion ? "" : "animate-curtain-b"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.06) 30%, rgba(94, 234, 212, 0.32) 68%, rgba(209, 250, 229, 0.44) 76%, rgba(16, 185, 129, 0.06) 86%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.7) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.7) 50%, transparent 100%)",
            filter: "blur(6px)",
          }}
        />

        {/* Curtain 3: Mid-Right Soft Diffused Fold */}
        <div
          className={`absolute -top-28 right-[27%] w-[260px] h-[940px] ${
            prefersReducedMotion ? "" : "animate-curtain-c"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(5, 150, 105, 0.05) 20%, rgba(16, 185, 129, 0.22) 55%, rgba(110, 231, 183, 0.28) 66%, rgba(16, 185, 129, 0.05) 78%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            filter: "blur(14px)",
          }}
        />

        {/* Curtain 4: Center-Right Subtle Vertical Beam */}
        <div
          className={`absolute -top-16 right-[40%] w-[150px] h-[760px] ${
            prefersReducedMotion ? "" : "animate-curtain-a"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.04) 25%, rgba(52, 211, 153, 0.16) 62%, rgba(167, 243, 208, 0.22) 72%, transparent 90%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
            filter: "blur(12px)",
          }}
        />

        {/* Curtain 5: Far-Right Deep Emerald Rim */}
        <div
          className={`absolute -top-24 right-[-2%] w-[200px] h-[820px] ${
            prefersReducedMotion ? "" : "animate-curtain-b"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.18) 45%, rgba(94, 234, 212, 0.28) 68%, rgba(5, 150, 105, 0.08) 85%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
            filter: "blur(14px)",
          }}
        />

        {/* Subtle Top-Edge Source Horizon Glow (ties curtains together naturally) */}
        <div
          className="absolute -top-28 right-[4%] w-[780px] h-[320px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 68% 58% at 60% 22%, rgba(52, 211, 153, 0.28) 0%, rgba(16, 185, 129, 0.12) 45%, transparent 78%)",
            filter: "blur(32px)",
          }}
        />
      </div>

      {/* 4. Left-Side Dark Contrast Vignette for Crisp Headline Readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(5, 8, 7, 0.96) 0%, rgba(5, 8, 7, 0.82) 34%, rgba(5, 8, 7, 0.25) 62%, transparent 100%)",
        }}
      />

      {/* 5. Bottom Transition Fade into #050807 */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#050807] via-[#050807]/85 to-transparent pointer-events-none" />
    </motion.div>
  );
}
