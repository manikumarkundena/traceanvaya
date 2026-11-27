"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EvidenceConstellation } from "./EvidenceConstellation";
import { ProductShowcase } from "./ProductShowcase";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Simple 6-Node Emerald Evidence Constellation (Top Right) */}
      <EvidenceConstellation />

      {/* Main Editorial Hero Content */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl text-left"
      >
        {/* Category Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1411]/85 backdrop-blur-sm border border-white/[0.09] text-xs font-sans font-medium text-accent mb-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>AI-powered incident investigation</span>
        </div>

        {/* Confident 3-Line Editorial Headline */}
        <h1 className="hero-headline font-bold text-foreground mb-5">
          <span className="block text-[#F8FAFC]">
            Every failure
          </span>
          <span className="block text-[#E2E8F0]">
            leaves a trace.
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#5EEAD4] via-[#34D399] to-[#10B981] whitespace-normal lg:whitespace-nowrap">
            Find the connection.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mb-7 leading-relaxed font-sans">
          Investigate failures. Correlate evidence. Replay incidents.{" "}
          <br className="hidden sm:inline" />
          Understand what went wrong with an AI-powered workspace.
        </p>

        {/* Primary & Secondary CTAs */}
        <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/workspace"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-accent text-[#050807] hover:brightness-105 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_4px_16px_-4px_rgba(94,234,212,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Start investigating</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
          </Link>

          <Link
            href="/workspace?scenario=scenario-1"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-white/[0.03] backdrop-blur-sm border border-white/[0.14] text-foreground hover:bg-white/[0.07] hover:border-accent/35 active:scale-[0.98] transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <span>Explore demo</span>
          </Link>
        </div>
      </motion.div>

      {/* Integrated Product Showcase */}
      <ProductShowcase />
    </section>
  );
}
