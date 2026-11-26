"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { EASE_OUT_EXPO, fadeUpVariants } from "@/lib/motion";
import { EvidenceConstellation } from "./EvidenceConstellation";
import { ProductShowcase } from "./ProductShowcase";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Expanded Technical Evidence Constellation (Right composition) */}
      <EvidenceConstellation />

      {/* Main Editorial Hero Content */}
      <div className="relative z-10 max-w-4xl text-left">
        {/* Category Pill Tag with illuminated pulse */}
        <motion.div
          initial={{ opacity: 0.1, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="motion-safe-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1410]/90 backdrop-blur-md border border-white/[0.12] text-[11px] font-mono text-accent mb-8 shadow-[0_0_28px_-6px_rgba(94,234,212,0.32),inset_0_1px_0_0_rgba(255,255,255,0.12)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="tracking-widest font-semibold">AGENTIC INCIDENT INTELLIGENCE</span>
        </motion.div>

        {/* Flagship Editorial Headline with Platinum-White + Emerald Treatment */}
        <h1 className="hero-headline font-bold text-foreground mb-8">
          <span className="block text-[#F8FAFC] tracking-tight">
            Every failure
          </span>
          <span className="block text-[#E2E8F0] tracking-tight">
            leaves a trace.
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#5EEAD4] via-[#34D399] to-[#6EE7B7] animate-gradient-shift">
            Find the connection.
          </span>
        </h1>

        {/* High-Contrast Supporting Copy */}
        <motion.p
          custom={0.2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="motion-safe-reveal text-base sm:text-lg md:text-xl text-[#CBD5E1] max-w-2xl mb-10 leading-relaxed font-sans font-normal"
        >
          Investigate failures. Correlate evidence. Replay incidents.{" "}
          <br className="hidden sm:inline" />
          Understand what went wrong with an AI-powered workspace.
        </motion.p>

        {/* Intentional Primary & Glossy Secondary CTAs */}
        <motion.div
          custom={0.3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="motion-safe-reveal flex flex-wrap items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/workspace"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-sm font-semibold bg-accent text-background hover:bg-accent/95 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-[0_12px_32px_-6px_rgba(94,234,212,0.5),inset_0_1px_0_0_rgba(255,255,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            />
            <span className="relative">Start investigating</span>
            <ArrowRight className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/workspace?scenario=scenario-1"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-sm font-semibold bg-[#0D1612]/90 backdrop-blur-md border border-white/[0.14] text-foreground hover:bg-[#15231D] hover:border-accent/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-[0_10px_25px_-8px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Explore demo</span>
          </Link>
        </motion.div>
      </div>

      {/* Immersive Flagship Product Showcase */}
      <ProductShowcase />
    </section>
  );
}
