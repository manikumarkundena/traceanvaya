"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE_OUT_EXPO, fadeUpVariants, maskedLineVariants } from "@/lib/motion";
import { EvidenceConstellation } from "./EvidenceConstellation";
import { ProductShowcase } from "./ProductShowcase";

export function HeroSection() {
  return (
    <section className="relative pt-10 pb-24 md:pt-16 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Living Evidence Constellation (Top Right, Decorative) */}
      <EvidenceConstellation />

      {/* Main Editorial Hero Content */}
      <div className="relative z-10 max-w-4xl text-left">
        {/* Category Pill Tag with subtle illuminated pulse */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: EASE_OUT_EXPO }}
          className="motion-safe-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1713]/85 backdrop-blur-md border border-white/[0.1] text-[11px] font-mono text-accent mb-7 shadow-[0_0_24px_-6px_rgba(94,234,212,0.28),inset_0_1px_0_0_rgba(255,255,255,0.08)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="tracking-wider">AGENTIC INCIDENT INTELLIGENCE</span>
        </motion.div>

        {/* Headline with masked sequential line-by-line reveal */}
        <h1 className="hero-headline font-bold text-foreground mb-7">
          <span className="block overflow-hidden pb-1">
            <motion.span
              custom={0.1}
              variants={maskedLineVariants}
              initial="hidden"
              animate="visible"
              className="motion-safe-reveal block"
            >
              Every failure
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span
              custom={0.2}
              variants={maskedLineVariants}
              initial="hidden"
              animate="visible"
              className="motion-safe-reveal block"
            >
              leaves a trace.
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1.5">
            <motion.span
              custom={0.3}
              variants={maskedLineVariants}
              initial="hidden"
              animate="visible"
              className="motion-safe-reveal block text-transparent bg-clip-text bg-gradient-to-r from-[#5EEAD4] via-[#34D399] to-[#6EE7B7] animate-gradient-shift"
            >
              Find the connection.
            </motion.span>
          </span>
        </h1>

        {/* Supporting Copy */}
        <motion.p
          custom={0.44}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="motion-safe-reveal text-base sm:text-lg text-muted max-w-2xl mb-9 leading-relaxed font-sans"
        >
          Investigate failures. Correlate evidence. Replay incidents.{" "}
          <br className="hidden sm:inline" />
          Understand what went wrong with an AI-powered workspace.
        </motion.p>

        {/* Primary & Secondary Call to Actions */}
        <motion.div
          custom={0.56}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="motion-safe-reveal flex flex-wrap items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/workspace"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-accent text-background hover:bg-accent/95 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-[0_10px_28px_-6px_rgba(94,234,212,0.45),inset_0_1px_0_0_rgba(255,255,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
            <span className="relative">Start investigating</span>
            <ArrowRight className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/workspace?scenario=scenario-1"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#101814]/80 backdrop-blur-md border border-white/[0.1] text-foreground hover:bg-[#16221C] hover:border-accent/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <span>Explore demo</span>
          </Link>
        </motion.div>
      </div>

      {/* Immersive Product Showcase Framing */}
      <ProductShowcase />
    </section>
  );
}
