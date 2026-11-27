import React from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { CinematicBackground } from "@/components/landing/CinematicBackground";
import { HeroSection } from "@/components/landing/HeroSection";
import { TechStrip } from "@/components/landing/TechStrip";
import { FeatureBento } from "@/components/landing/FeatureBento";
import { WorkflowWalkthrough } from "@/components/landing/WorkflowWalkthrough";
import { ArchitectureDiagram } from "@/components/landing/ArchitectureDiagram";
import { ScenarioShowcase } from "@/components/landing/ScenarioShowcase";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { BackToTop } from "@/components/navigation/BackToTop";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative selection:bg-accent/20 selection:text-accent overflow-x-clip">
      {/* Cinematic Animated Background System */}
      <CinematicBackground />

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

      <BackToTop />
    </div>
  );
}
