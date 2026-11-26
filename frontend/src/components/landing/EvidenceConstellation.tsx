"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

interface ConstellationNode {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  color: string;
}

const NODES: ConstellationNode[] = [
  { id: "ev-101", label: "ev-101", x: 340, y: 65, r: 4, color: "#60A5FA" },
  { id: "ev-104", label: "ev-104", x: 235, y: 105, r: 4.5, color: "#FBBF24" },
  { id: "ev-105", label: "ev-105", x: 315, y: 185, r: 5, color: "#F87171" },
  { id: "ev-106", label: "ev-106", x: 175, y: 195, r: 4.5, color: "#F87171" },
  { id: "ev-108", label: "ev-108", x: 255, y: 280, r: 4.5, color: "#34D399" },
  { id: "ev-110", label: "ev-110", x: 375, y: 300, r: 5.5, color: "#5EEAD4" },
];

const PATHS = [
  "M 340 65 L 235 105 L 315 185 L 255 280 L 375 300",
  "M 235 105 L 175 195 L 255 280",
  "M 340 65 L 315 185 L 375 300",
] as const;

export function EvidenceConstellation() {
  const prefersReducedMotion = useReducedMotion();
  const [activePhase, setActivePhase] = useState(1);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % NODES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="absolute top-2 right-2 lg:right-10 w-72 h-72 sm:w-88 sm:h-88 lg:w-[420px] lg:h-[420px] pointer-events-none select-none z-0 opacity-80"
    >
      <svg viewBox="0 0 450 380" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="restrainedTraceLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Base Connection Paths */}
        {PATHS.map((d, i) => (
          <path
            key={`base-${i}`}
            d={d}
            stroke="url(#restrainedTraceLine)"
            strokeWidth="1.25"
            strokeDasharray={i === 0 ? "4 4" : undefined}
          />
        ))}

        {/* Travelling Signals along Paths */}
        {!prefersReducedMotion &&
          PATHS.map((d, i) => (
            <motion.path
              key={`signal-${i}`}
              d={d}
              stroke="#5EEAD4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="18 200"
              initial={{ strokeDashoffset: 218, opacity: 0.2 }}
              animate={{
                strokeDashoffset: [218, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 4.5 + i * 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

        {/* Interconnected Evidence Nodes */}
        {NODES.map((node, idx) => {
          const isActive = activePhase === idx;
          return (
            <g key={node.id}>
              {/* Subtle Core Halo */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r * 2.8}
                fill={node.color}
                fillOpacity="0.12"
              />

              {/* Core Node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={node.color}
              />

              {/* Monospace Identifier Label */}
              <text
                x={node.x + 8}
                y={node.y + 3}
                fill={isActive ? "#5EEAD4" : "#94A3B8"}
                fontSize="10"
                fontFamily="var(--font-geist-mono), monospace"
                fontWeight={isActive ? "700" : "500"}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
