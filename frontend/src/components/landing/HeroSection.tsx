import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductShowcase } from "./ProductShowcase";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Decorative Connected Evidence Nodes Network (Top Right) */}
      <div className="absolute top-2 right-4 lg:right-12 w-72 h-72 sm:w-96 sm:h-96 pointer-events-none select-none opacity-80 z-0">
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="traceLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Connection Lines */}
          <path d="M 330 70 L 250 100 L 310 180 L 260 270 L 370 300" stroke="url(#traceLine)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 250 100 L 190 190 L 260 270" stroke="url(#traceLine)" strokeWidth="1.5" />
          <path d="M 330 70 L 310 180 L 370 300" stroke="url(#traceLine)" strokeWidth="1.5" />

          {/* Subtle Ambient Node Halos */}
          <circle cx="330" cy="70" r="18" fill="url(#nodeGlow)" />
          <circle cx="250" cy="100" r="14" fill="url(#nodeGlow)" />
          <circle cx="310" cy="180" r="16" fill="url(#nodeGlow)" />
          <circle cx="190" cy="190" r="14" fill="url(#nodeGlow)" />
          <circle cx="260" cy="270" r="14" fill="url(#nodeGlow)" />
          <circle cx="370" cy="300" r="20" fill="url(#nodeGlow)" />

          {/* Connected Nodes */}
          <circle cx="330" cy="70" r="4.5" fill="#5EEAD4" className="animate-pulse" />
          <circle cx="250" cy="100" r="3.5" fill="#34D399" />
          <circle cx="310" cy="180" r="4" fill="#5EEAD4" />
          <circle cx="190" cy="190" r="3" fill="#60A5FA" />
          <circle cx="260" cy="270" r="3.5" fill="#34D399" />
          <circle cx="370" cy="300" r="5" fill="#5EEAD4" className="animate-pulse" />
        </svg>
      </div>

      {/* Main Editorial Hero Content */}
      <div className="relative z-10 max-w-4xl text-left">
        {/* Category Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-accent mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>AGENTIC INCIDENT INTELLIGENCE</span>
        </div>

        {/* Headline with deliberate line breaks and clamp sizing */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-foreground mb-6 font-sans">
          Every failure<br />
          leaves a trace.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">
            Find the connection.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-muted max-w-2xl mb-8 leading-relaxed font-sans">
          Investigate failures. Correlate evidence. Replay incidents.{" "}
          <br className="hidden sm:inline" />
          Understand what went wrong with an AI-powered workspace.
        </p>

        {/* Primary & Secondary Call to Actions */}
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <Link
            href="/workspace"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-accent text-background hover:bg-accent/90 transition-all shadow-md shadow-accent/10"
          >
            <span>Start investigating</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/workspace?scenario=scenario-1"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-surface border border-border text-foreground hover:bg-surface-elevated transition-all"
          >
            <span>Explore demo</span>
          </Link>
        </div>
      </div>

      {/* Immersive Product Showcase Framing */}
      <ProductShowcase />
    </section>
  );
}
