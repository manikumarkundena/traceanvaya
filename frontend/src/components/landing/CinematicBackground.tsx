"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Stage 3.4 Hero Atmospheric Lighting Engine (Achilles Inspired):
 * - Tall, tapered emerald light ribbons with defined luminous cores and soft atmospheric diffusion.
 * - Upper-right volumetric concentration with vertical and gently diagonal light shafts.
 * - Smooth scroll-linked fading into the architectural grid body.
 * - Subtle filmic atmospheric grain.
 * - High-contrast left vignette preserving 100% headline legibility.
 */
export function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll-linked gradual fading of cinematic hero atmosphere
  const { scrollY } = useScroll();
  const heroLightOpacity = useTransform(scrollY, [0, 600, 1000], [1, 0.55, 0]);

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      style={{ opacity: heroLightOpacity }}
      className="absolute top-0 inset-x-0 h-[1150px] pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* 1. Fine SVG Filmic Grain Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none z-30 mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="heroGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#heroGrain)" />
      </svg>

      {/* 2. Fine technical coordinate grid (Restrained architectural baseline) */}
      <div
        className="absolute inset-0 tech-grid opacity-25"
        style={{
          maskImage:
            "radial-gradient(ellipse 95% 80% at 50% 20%, black 20%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 80% at 50% 20%, black 20%, transparent 85%)",
        }}
      />

      {/* 3. Primary Upper-Right Rich Emerald Light Concentration */}
      <div
        className="absolute -top-36 right-[-8%] w-[900px] h-[820px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 62% 38%, rgba(16, 185, 129, 0.32) 0%, rgba(94, 234, 212, 0.16) 30%, rgba(5, 150, 105, 0.08) 55%, transparent 75%)",
          filter: "blur(48px)",
        }}
      />

      {/* 4. Secondary Upper-Center Soft Luminous Accent */}
      <div
        className="absolute -top-48 left-[38%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(94, 234, 212, 0.12) 0%, rgba(16, 185, 129, 0.04) 45%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* 5. Achilles-Inspired Cinematic Light Curtain (Tapered Ribbons & Shafts) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
        }}
      >
        {/* SVG Tapered Light Curtains with Defined Luminous Edges */}
        <svg
          viewBox="0 0 1440 1150"
          className="absolute inset-0 w-full h-full preserve-3d"
          fill="none"
        >
          <defs>
            {/* Ribbon A: Primary dominant shaft */}
            <linearGradient id="ribbonA" x1="0.8" y1="0" x2="0.2" y2="1">
              <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.42" />
              <stop offset="35%" stopColor="#10B981" stopOpacity="0.28" />
              <stop offset="70%" stopColor="#059669" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </linearGradient>

            {/* Ribbon B: Defined edge beam */}
            <linearGradient id="ribbonB" x1="0.85" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#10B981" stopOpacity="0.22" />
              <stop offset="80%" stopColor="#065F46" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
            </linearGradient>

            {/* Ribbon C: Narrow specular ray */}
            <linearGradient id="ribbonCore" x1="0.9" y1="0" x2="0.35" y2="1">
              <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.5" />
              <stop offset="30%" stopColor="#5EEAD4" stopOpacity="0.32" />
              <stop offset="70%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </linearGradient>

            {/* Vertical Shaft D */}
            <linearGradient id="shaftVertical" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.28" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Ribbon 1: Wide Volumetric Tapered Ribbon from upper right */}
          <polygon
            points="1280,-40 1440,-40 920,1100 760,1100"
            fill="url(#ribbonA)"
            className={prefersReducedMotion ? undefined : "animate-ribbon-a"}
            style={{ filter: "blur(28px)" }}
          />

          {/* Ribbon 2: Medium Luminous Shaft with defined edge */}
          <polygon
            points="1140,-40 1260,-40 760,1050 660,1050"
            fill="url(#ribbonB)"
            className={prefersReducedMotion ? undefined : "animate-ribbon-b"}
            style={{ filter: "blur(18px)" }}
          />

          {/* Ribbon 3: Luminous Core Ray with crisp specular intensity */}
          <polygon
            points="1200,-30 1230,-30 810,950 785,950"
            fill="url(#ribbonCore)"
            className={prefersReducedMotion ? undefined : "animate-ribbon-a"}
            style={{ filter: "blur(8px)" }}
          />

          {/* Shaft 4: Taller, near-vertical shaft in center-right */}
          <polygon
            points="980,-50 1060,-50 820,1150 760,1150"
            fill="url(#shaftVertical)"
            className={prefersReducedMotion ? undefined : "animate-ribbon-b"}
            style={{ filter: "blur(22px)" }}
          />
        </svg>

        {/* Ambient atmospheric sweep across the transition boundary */}
        <div
          className="absolute -top-[10%] right-[15%] w-[480px] h-[1200px] pointer-events-none opacity-40 blur-3xl animate-light-sweep"
          style={{
            background:
              "linear-gradient(135deg, transparent 20%, rgba(94, 234, 212, 0.22) 50%, transparent 80%)",
          }}
        />
      </div>

      {/* 6. High-Contrast Vignette for Left-Aligned Headline Legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(6, 9, 8, 0.94) 0%, rgba(6, 9, 8, 0.75) 38%, rgba(6, 9, 8, 0.2) 68%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(6, 9, 8, 0.85) 0%, transparent 80%)",
        }}
      />

      {/* 7. Bottom Transition Mask fading into solid page background */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </motion.div>
  );
}
