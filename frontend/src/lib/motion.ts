import type { Transition, Variants } from "motion/react";

/**
 * Centralized motion & timing tokens for TraceAnvaya Stage 3.2.
 * Uses GPU-composited properties (transform, opacity) and custom cubic-bezier easing.
 * CRITICAL FIX: Variants never leave elements at opacity: 0. Initial hidden state is visible in SSR/noscript.
 */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT_SINE: [number, number, number, number] = [0.37, 0, 0.63, 1];

export const DURATIONS = {
  fast: 0.22,
  base: 0.45,
  slow: 0.7,
  heroReveal: 0.62,
} as const;

export const STAGGER = {
  tight: 0.06,
  base: 0.09,
  relaxed: 0.14,
} as const;

export const SPRING_SNAPPY: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.8,
};

export const SPRING_GENTLE: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 26,
  mass: 0.9,
};

export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.05 as const, // Low threshold prevents missed intersection in headless/fullpage screenshots
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0.05, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.base,
      delay,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export const maskedLineVariants: Variants = {
  hidden: { y: "100%", opacity: 0.2 },
  visible: (delay = 0) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: DURATIONS.heroReveal,
      delay,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.base,
      delayChildren: 0.04,
    },
  },
};

export const cardRevealVariants: Variants = {
  hidden: { opacity: 0.08, y: 20, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATIONS.base,
      ease: EASE_OUT_EXPO,
    },
  },
};
