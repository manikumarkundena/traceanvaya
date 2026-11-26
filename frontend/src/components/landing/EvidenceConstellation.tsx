"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface NodePoint {
  id: string;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  delay: number;
  pulse?: boolean;
}

const NODES: NodePoint[] = [
  { id: "n1", cx: 330, cy: 68, r: 4.5, fill: "#5EEAD4", delay: 0.35, pulse: true },
  { id: "n2", cx: 248, cy: 102, r: 3.5, fill: "#34D399", delay: 0.48 },
  { id: "n3", cx: 312, cy: 178, r: 4, fill: "#5EEAD4", delay: 0.6, pulse: true },
  { id: "n4", cx: 192, cy: 192, r: 3.2, fill: "#60A5FA", delay: 0.72 },
  { id: "n5", cx: 262, cy: 268, r: 3.8, fill: "#34D399", delay: 0.84 },
  { id: "n6", cx: 368, cy: 302, r: 5, fill: "#5EEAD4", delay: 0.96, pulse: true },
  { id: "n7", cx: 145, cy: 122, r: 2.8, fill: "#5EEAD4", delay: 0.66 },
];

const PATHS = [
  { id: "p1", d: "M 330 68 L 248 102 L 312 178 L 262 268 L 368 302", dashed: true, dur: "4.6s" },
  { id: "p2", d: "M 248 102 L 192 192 L 262 268", dashed: false, dur: "5.4s" },
  { id: "p3", d: "M 330 68 L 312 178 L 368 302", dashed: false, dur: "6.2s" },
  { id: "p4", d: "M 145 122 L 248 102", dashed: true, dur: "3.8s" },
];

/**
 * Decorative living evidence constellation in the hero top-right.
 * Uses deterministic coordinates to avoid hydration mismatches.
 * Clearly decorative (aria-hidden) and separate from live telemetry.
 */
export function EvidenceConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 90, damping: 24 });
  const springY = useSpring(rawY, { stiffness: 90, damping: 24 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 14;
      const ny = (e.clientY / window.innerHeight - 0.5) * 10;
      rawX.set(nx);
      rawY.set(ny);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [prefersReducedMotion, rawX, rawY]);

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 0.88, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      className="motion-safe-reveal absolute top-0 right-2 lg:right-8 w-72 h-72 sm:w-96 sm:h-96 pointer-events-none select-none z-0"
    >
      <svg viewBox="0 0 420 380" className="w-full h-full overflow-visible" fill="none">
        <defs>
          <radialGradient id="constellationNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="constellationTraceLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.16" />
          </linearGradient>
        </defs>

        {/* Base connection paths */}
        {PATHS.map((p, idx) => (
          <g key={p.id}>
            <motion.path
              d={p.d}
              stroke="url(#constellationTraceLine)"
              strokeWidth="1.4"
              strokeDasharray={p.dashed ? "3 4" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.35 + idx * 0.12,
                ease: EASE_OUT_EXPO,
              }}
            />

            {/* Travelling light signal packet along path */}
            {!prefersReducedMotion && (
              <circle r="2.2" fill="#5EEAD4" opacity="0.9">
                <animateMotion dur={p.dur} repeatCount="indefinite" path={p.d} />
              </circle>
            )}
          </g>
        ))}

        {/* Ambient halos & sequential nodes */}
        {NODES.map((node, idx) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: 1,
                    scale: 1,
                    y: [0, idx % 2 === 0 ? -3.5 : 3.5, 0],
                  }
            }
            transition={{
              opacity: { duration: 0.45, delay: node.delay, ease: EASE_OUT_EXPO },
              scale: { duration: 0.45, delay: node.delay, ease: EASE_OUT_EXPO },
              y: prefersReducedMotion
                ? undefined
                : {
                    duration: 5 + (idx % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.4,
                  },
            }}
          >
            <circle cx={node.cx} cy={node.cy} r={node.r * 4.2} fill="url(#constellationNodeGlow)" />

            {node.pulse && !prefersReducedMotion && (
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                stroke="#5EEAD4"
                strokeWidth="1"
                initial={{ r: node.r, opacity: 0.7 }}
                animate={{ r: node.r + 14, opacity: 0 }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: node.delay + 0.5,
                  ease: "easeOut",
                }}
              />
            )}

            <circle cx={node.cx} cy={node.cy} r={node.r} fill={node.fill} />
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}
