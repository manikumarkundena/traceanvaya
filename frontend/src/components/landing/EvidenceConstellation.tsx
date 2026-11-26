"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface ConstellationNode {
  id: string;
  label: string;
  service: string;
  x: number;
  y: number;
  r: number;
  color: string;
  halo: number;
  severity: "CRITICAL" | "WARN" | "ERROR" | "INFO";
}

const NODES: ConstellationNode[] = [
  { id: "ev-101", label: "ev-101", service: "ingress-lb", x: 380, y: 70, r: 5, color: "#60A5FA", halo: 22, severity: "INFO" },
  { id: "ev-104", label: "ev-104", service: "order-billing", x: 260, y: 110, r: 5.5, color: "#FBBF24", halo: 24, severity: "WARN" },
  { id: "ev-105", label: "ev-105", service: "order-billing", x: 350, y: 195, r: 6, color: "#F87171", halo: 26, severity: "ERROR" },
  { id: "ev-106", label: "ev-106", service: "hikari-pool", x: 190, y: 210, r: 5, color: "#F87171", halo: 22, severity: "ERROR" },
  { id: "ev-108", label: "ev-108", service: "ledger-db", x: 285, y: 300, r: 5.5, color: "#34D399", halo: 24, severity: "INFO" },
  { id: "ev-110", label: "ev-110", service: "checkout-api", x: 420, y: 325, r: 6.5, color: "#5EEAD4", halo: 28, severity: "CRITICAL" },
  { id: "ev-114", label: "ev-114", service: "auth-guard", x: 145, y: 125, r: 4.5, color: "#60A5FA", halo: 20, severity: "INFO" },
];

const PATHS = [
  "M 145 125 L 260 110 L 380 70",
  "M 260 110 L 190 210 L 285 300 L 420 325",
  "M 380 70 L 350 195 L 420 325",
  "M 260 110 L 350 195 L 285 300",
  "M 145 125 L 190 210",
] as const;

export function EvidenceConstellation() {
  const prefersReducedMotion = useReducedMotion();
  const [activePhase, setActivePhase] = useState(1);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 26 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 26 });

  // Sequential evidence correlation cycle
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % NODES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Restrained desktop-only parallax
  useEffect(() => {
    if (prefersReducedMotion) return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 22;
      const ny = (e.clientY / window.innerHeight - 0.5) * 18;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0.2, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      className="motion-safe-reveal absolute -top-4 right-0 lg:right-6 w-80 h-80 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] pointer-events-none select-none z-0 opacity-95"
    >
      <svg viewBox="0 0 500 450" className="w-full h-full" fill="none">
        <defs>
          <radialGradient id="stage32NodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0B1310" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="stage32TraceLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Base Connection Paths */}
        {PATHS.map((d, i) => (
          <path
            key={`base-${i}`}
            d={d}
            stroke="url(#stage32TraceLine)"
            strokeWidth="1.5"
            strokeDasharray={i % 2 === 1 ? "5 4" : undefined}
          />
        ))}

        {/* Travelling Luminous Data Signals along Paths */}
        {!prefersReducedMotion &&
          PATHS.map((d, i) => (
            <motion.path
              key={`signal-${i}`}
              d={d}
              stroke="#5EEAD4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="24 240"
              initial={{ strokeDashoffset: 264, opacity: 0.3 }}
              animate={{
                strokeDashoffset: [264, 0],
                opacity: [0.3, 0.95, 0.3],
              }}
              transition={{
                duration: 4.2 + i * 0.9,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.7,
              }}
            />
          ))}

        {/* Interconnected Evidence Nodes with Labels & Halos */}
        {NODES.map((node, idx) => {
          const isActive = activePhase === idx;
          return (
            <g key={node.id}>
              {/* Halos */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.halo}
                fill="url(#stage32NodeGlow)"
                className="opacity-70"
              />

              {/* Expanding Pulse Ring on Active Node */}
              {isActive && !prefersReducedMotion && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r + 2}
                  stroke="#5EEAD4"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ r: node.r + 2, opacity: 0.9 }}
                  animate={{ r: node.r + 22, opacity: 0 }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                />
              )}

              {/* Core Node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isActive ? node.r + 1.5 : node.r}
                fill={node.color}
                className="transition-all duration-300"
              />

              {/* Technical Node Identifier Label */}
              <g className="transition-opacity duration-300">
                <rect
                  x={node.x + 8}
                  y={node.y - 12}
                  width="48"
                  height="16"
                  rx="3"
                  fill="#0B1310"
                  fillOpacity="0.88"
                  stroke={isActive ? "#5EEAD4" : "#24362D"}
                  strokeWidth="1"
                />
                <text
                  x={node.x + 14}
                  y={node.y}
                  fill={isActive ? "#5EEAD4" : "#A3A3AC"}
                  fontSize="9"
                  fontFamily="var(--font-geist-mono), monospace"
                  fontWeight={isActive ? "700" : "500"}
                >
                  {node.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}
