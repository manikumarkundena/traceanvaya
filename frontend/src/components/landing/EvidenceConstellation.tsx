"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Original 6-Node Emerald Evidence Constellation (Recovered from Stage 3 baseline):
 * - Pure single emerald/mint color family (#5EEAD4, #34D399, #10B981).
 * - Thin triangular geometric connections.
 * - Zero text labels, zero severity colors, zero complex mesh clutter.
 */
export function EvidenceConstellation() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="absolute top-4 right-2 sm:right-6 lg:right-10 w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] pointer-events-none select-none opacity-85 z-0"
      animate={
        prefersReducedMotion
          ? undefined
          : {
              y: [-4, 4, -4],
            }
      }
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="140 30 270 310" className="w-full h-full overflow-visible" fill="none">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="traceLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        {/* Thin Emerald Triangular Connections */}
        <path
          d="M 330 70 L 250 100 L 310 180 L 260 270 L 370 300"
          stroke="url(#traceLine)"
          strokeWidth="1.25"
          strokeDasharray="3 3"
        />
        <path
          d="M 250 100 L 190 190 L 260 270"
          stroke="url(#traceLine)"
          strokeWidth="1.25"
        />
        <path
          d="M 330 70 L 310 180 L 370 300"
          stroke="url(#traceLine)"
          strokeWidth="1.25"
        />

        {/* Subtle Travelling Light Signal along Primary Trace */}
        {!prefersReducedMotion && (
          <motion.path
            d="M 330 70 L 250 100 L 310 180 L 260 270 L 370 300"
            stroke="#5EEAD4"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="18 180"
            initial={{ strokeDashoffset: 198, opacity: 0.15 }}
            animate={{
              strokeDashoffset: [198, 0],
              opacity: [0.2, 0.85, 0.2],
            }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* Ambient Node Halos */}
        <circle cx="330" cy="70" r="16" fill="url(#nodeGlow)" />
        <circle cx="250" cy="100" r="13" fill="url(#nodeGlow)" />
        <circle cx="310" cy="180" r="15" fill="url(#nodeGlow)" />
        <circle cx="190" cy="190" r="13" fill="url(#nodeGlow)" />
        <circle cx="260" cy="270" r="13" fill="url(#nodeGlow)" />
        <circle cx="370" cy="300" r="18" fill="url(#nodeGlow)" />

        {/* 6 Clean Emerald/Mint Nodes */}
        <circle cx="330" cy="70" r="4" fill="#5EEAD4" />
        <circle cx="250" cy="100" r="3.2" fill="#34D399" />
        <circle cx="310" cy="180" r="3.8" fill="#5EEAD4" />
        <circle cx="190" cy="190" r="3" fill="#34D399" />
        <circle cx="260" cy="270" r="3.2" fill="#34D399" />
        <circle cx="370" cy="300" r="4.5" fill="#5EEAD4" />
      </svg>
    </motion.div>
  );
}
