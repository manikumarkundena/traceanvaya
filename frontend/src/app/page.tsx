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
    <div className="flex flex-col min-h-screen bg-background text-foreground relative selection:bg-accent/20 selection:text-accent overflow-x-hidden">
      {/* Cinematic Background System: Grid + Emerald Light Ribbons + Vignette */}
      <div className="fixed inset-0 tech-grid pointer-events-none opacity-40 z-0" />
      <div className="fixed inset-0 light-ribbons pointer-events-none opacity-70 z-0" />
      <div className="fixed inset-0 vignette-overlay pointer-events-none opacity-60 z-0" />

      {/* Floating Compact Navigation */}
      <Navbar mode="landing" />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col">
        <HeroSection />
        <TechStrip />
        <FeatureBento />
        <WorkflowWalkthrough />
        <ArchitectureDiagram />
        <ScenarioShowcase />
        <LandingFooter />
      </main>
    </div>
  );
}
