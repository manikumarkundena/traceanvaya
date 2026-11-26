"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { EvidenceConstellation } from "./EvidenceConstellation";
import { ProductShowcase } from "./ProductShowcase";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Abstract Geometric Emerald Constellation (Right Viewport) */}
      <EvidenceConstellation />

      {/* Main Editorial Hero Content */}
      <div className="relative z-10 max-w-4xl text-left">
        {/* Category Pill Tag with Restrained Glass Sheen */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E1713]/85 backdrop-blur-sm border border-white/[0.1] text-xs font-mono text-accent mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>AGENTIC INCIDENT INTELLIGENCE</span>
        </div>

        {/* Confident 3-Line Editorial Headline */}
        <h1 className="hero-headline font-bold text-foreground mb-6 tracking-tight">
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

        {/* Clean Monochromatic Subtitle */}
        <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mb-8 leading-relaxed font-sans font-normal">
          Investigate failures. Correlate evidence. Replay incidents.{" "}
          <br className="hidden sm:inline" />
          Understand what went wrong with an AI-powered workspace.
        </p>

        {/* Intentional CTAs: Glossy Mint Primary & Crisp Outlined Secondary */}
        <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/workspace"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-accent text-[#060908] hover:bg-accent/95 active:scale-[0.98] transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_4px_16px_-4px_rgba(94,234,212,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Start investigating</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/workspace?scenario=scenario-1"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-white/[0.03] backdrop-blur-sm border border-white/[0.14] text-foreground hover:bg-white/[0.08] hover:border-white/[0.24] active:scale-[0.98] transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <span>Explore demo</span>
          </Link>
        </div>
      </div>

      {/* Flagship Scroll-Linked Product Showcase */}
      <ProductShowcase />
    </section>
  );
}
