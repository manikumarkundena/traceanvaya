import React from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TechStrip } from "@/components/landing/TechStrip";
import { FeatureBento } from "@/components/landing/FeatureBento";
import { WorkflowWalkthrough } from "@/components/landing/WorkflowWalkthrough";
import { ArchitectureDiagram } from "@/components/landing/ArchitectureDiagram";
import { ScenarioShowcase } from "@/components/landing/ScenarioShowcase";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative selection:bg-accent/20 selection:text-accent">
      <Navbar mode="landing" />

      {/* Ambient background glow & tech grid */}
      <div className="absolute inset-0 tech-grid pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[550px] ambient-glow pointer-events-none" />

      {/* Structured modular sections */}
      <HeroSection />
      <TechStrip />
      <FeatureBento />
      <WorkflowWalkthrough />
      <ArchitectureDiagram />
      <ScenarioShowcase />
      <LandingFooter />
    </div>
  );
}
