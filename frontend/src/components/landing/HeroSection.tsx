"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EvidenceConstellation } from "./EvidenceConstellation";
import { ProductShowcase } from "./ProductShowcase";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 md:pt-18 md:pb-28 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Restrained Evidence Network (Top Right) */}
      <EvidenceConstellation />

      {/* Main Editorial Hero Content */}
      <div className="relative z-10 max-w-4xl text-left">
        {/* Category Pill Tag without excessive pulse/ping */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E1713] border border-white/[0.08] text-xs font-mono text-accent mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>AGENTIC INCIDENT INTELLIGENCE</span>
        </div>

        {/* Confident 3-Line Editorial Headline */}
        <h1 className="hero-headline font-bold text-foreground mb-6">
          <span className="block text-[#F8FAFC]">
            Every failure
          </span>
          <span className="block text-[#E2E8F0]">
            leaves a trace.
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#5EEAD4] to-[#10B981]">
            Find the connection.
          </span>
        </h1>

        {/* Clean Monochromatic Subtitle */}
        <p className="text-base sm:text-lg text-muted max-w-2xl mb-8 leading-relaxed font-sans">
          Investigate failures. Correlate evidence. Replay incidents.{" "}
          <br className="hidden sm:inline" />
          Understand what went wrong with an AI-powered workspace.
        </p>

        {/* Intentional CTAs: Solid Mint Primary & Clean Outlined Secondary */}
        <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/workspace"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-accent text-background hover:bg-accent/90 active:scale-[0.98] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Start investigating</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/workspace?scenario=scenario-1"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-transparent border border-white/[0.14] text-foreground hover:bg-white/[0.04] hover:border-white/[0.24] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
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
