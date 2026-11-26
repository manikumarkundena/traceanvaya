import React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Terminal, Shield, Sparkles, ExternalLink, Activity } from "lucide-react";

interface NavbarProps {
  mode?: "landing" | "workspace";
}

export const Navbar: React.FC<NavbarProps> = ({ mode = "landing" }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Logo size={26} />
        </Link>

        {mode === "landing" ? (
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted">
            <a href="#features" className="hover:text-foreground transition-colors">
              Capabilities
            </a>
            <a href="#workflow" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#architecture" className="hover:text-foreground transition-colors">
              Architecture
            </a>
            <a href="#scenarios" className="hover:text-foreground transition-colors">
              Scenarios
            </a>
            <Link href="/workspace" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-accent" />
              Workspace
            </Link>
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-accent font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              AG-UI Protocol Active
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/workspace"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium bg-accent text-background hover:bg-accent/90 transition-all shadow-sm"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Workspace</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
