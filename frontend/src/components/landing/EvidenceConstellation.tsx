"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Geometric nodes arranged in triangular mesh topology.
 * Exclusively single emerald/mint color family, abstract and elegant.
 * Zero text labels, zero severity colors, zero artificial pills.
 */
interface NodeCoord {
  id: string;
  x: number;
  y: number;
  r: number;
}

const NODES: NodeCoord[] = [
  { id: "n1", x: 260, y: 45, r: 3.5 },
  { id: "n2", x: 380, y: 70, r: 4 },
  { id: "n3", x: 440, y: 150, r: 3 },
  { id: "n4", x: 330, y: 140, r: 4.5 },
  { id: "n5", x: 210, y: 130, r: 3.5 },
  { id: "n6", x: 150, y: 220, r: 3 },
  { id: "n7", x: 250, y: 230, r: 4.5 },
  { id: "n8", x: 360, y: 220, r: 4 },
  { id: "n9", x: 420, y: 290, r: 3.5 },
  { id: "n10", x: 310, y: 320, r: 4 },
  { id: "n11", x: 200, y: 310, r: 3.5 },
  { id: "n12", x: 260, y: 380, r: 3 },
];

// Triangular mesh faces for subtle translucent facet shading
const TRIANGLES = [
  "M 260 45 L 380 70 L 330 140 Z",
  "M 260 45 L 330 140 L 210 130 Z",
  "M 380 70 L 440 150 L 330 140 Z",
  "M 440 150 L 360 220 L 330 140 Z",
  "M 330 140 L 360 220 L 250 230 Z",
  "M 210 130 L 330 140 L 250 230 Z",
  "M 210 130 L 250 230 L 150 220 Z",
  "M 150 220 L 250 230 L 200 310 Z",
  "M 250 230 L 360 220 L 310 320 Z",
  "M 250 230 L 310 320 L 200 310 Z",
  "M 360 220 L 420 290 L 310 320 Z",
  "M 200 310 L 310 320 L 260 380 Z",
] as const;

// Interconnected geometric edges
const EDGES = [
  "M 260 45 L 380 70",
  "M 380 70 L 440 150",
  "M 440 150 L 360 220",
  "M 360 220 L 420 290",
  "M 420 290 L 310 320",
  "M 310 320 L 260 380",
  "M 260 380 L 200 310",
  "M 200 310 L 150 220",
  "M 150 220 L 210 130",
  "M 210 130 L 260 45",
  "M 260 45 L 330 140",
  "M 380 70 L 330 140",
  "M 210 130 L 330 140",
  "M 210 130 L 250 230",
  "M 330 140 L 360 220",
  "M 330 140 L 250 230",
  "M 150 220 L 250 230",
  "M 250 230 L 360 220",
  "M 250 230 L 310 320",
  "M 250 230 L 200 310",
  "M 360 220 L 310 320",
  "M 200 310 L 310 320",
] as const;

// Continuous luminous data signal corridors
const SIGNAL_PATHS = [
  "M 260 45 L 330 140 L 250 230 L 310 320 L 260 380",
  "M 380 70 L 440 150 L 360 220 L 310 320 L 200 310",
  "M 210 130 L 150 220 L 250 230 L 360 220 L 420 290",
] as const;

export function EvidenceConstellation() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="absolute -top-6 right-0 sm:right-4 lg:right-6 w-80 h-80 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[460px] pointer-events-none select-none z-0"
      animate={
        prefersReducedMotion
          ? undefined
          : {
              y: [-6, 6, -6],
              rotate: [-0.5, 0.5, -0.5],
            }
      }
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="100 20 380 390"
        className="w-full h-full overflow-visible"
        fill="none"
      >
        <defs>
          {/* Subtle gradient for interconnected mesh lines */}
          <linearGradient id="emeraldMeshLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.08" />
          </linearGradient>

          {/* Facet fill gradient */}
          <linearGradient id="facetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.01" />
          </linearGradient>

          {/* Node radial glow */}
          <radialGradient id="mintNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Triangular geometric mesh facets */}
        {TRIANGLES.map((d, i) => (
          <path
            key={`triangle-${i}`}
            d={d}
            fill="url(#facetGradient)"
            stroke="none"
          />
        ))}

        {/* 2. Thin interconnected emerald lines */}
        {EDGES.map((d, i) => (
          <path
            key={`edge-${i}`}
            d={d}
            stroke="url(#emeraldMeshLine)"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
        ))}

        {/* 3. Subtle travelling light signals along primary pathways */}
        {!prefersReducedMotion &&
          SIGNAL_PATHS.map((d, i) => (
            <motion.path
              key={`signal-${i}`}
              d={d}
              stroke="#5EEAD4"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeDasharray="16 160"
              initial={{ strokeDashoffset: 176, opacity: 0.15 }}
              animate={{
                strokeDashoffset: [176, 0],
                opacity: [0.2, 0.85, 0.2],
              }}
              transition={{
                duration: 4.8 + i * 1.4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

        {/* 4. Small glowing mint nodes */}
        {NODES.map((node, idx) => (
          <g key={node.id}>
            {/* Soft atmospheric halo */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r * 2.8}
              fill="url(#mintNodeGlow)"
            />

            {/* Pulsing outer boundary */}
            {!prefersReducedMotion && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.r * 1.8}
                stroke="#5EEAD4"
                strokeWidth="0.75"
                fill="none"
                animate={{
                  r: [node.r * 1.4, node.r * 2.2, node.r * 1.4],
                  opacity: [0.15, 0.45, 0.15],
                }}
                transition={{
                  duration: 3 + (idx % 4) * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (idx * 0.25) % 2,
                }}
              />
            )}

            {/* Crisp luminous core node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="#5EEAD4"
              className="drop-shadow-[0_0_6px_rgba(94,234,212,0.8)]"
            />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}
