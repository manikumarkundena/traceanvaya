"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowUpRight, Menu, X, Activity } from "lucide-react";

interface NavbarProps {
  mode?: "landing" | "workspace";
}

export const Navbar: React.FC<NavbarProps> = ({ mode = "landing" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 pt-3 pb-2 pointer-events-none">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 rounded-xl border border-border bg-surface/85 backdrop-blur-md shadow-lg shadow-black/40 pointer-events-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Logo size={24} />
        </Link>

        {/* Desktop Navigation Links */}
        {mode === "landing" ? (
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono text-muted">
            <a href="#features" className="hover:text-foreground transition-colors">
              Product
            </a>
            <a href="#workflow" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#architecture" className="hover:text-foreground transition-colors">
              Architecture
            </a>
            <a href="#scenarios" className="hover:text-foreground transition-colors">
              Scenarios
            </a>
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface-elevated border border-border text-accent font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              AG-UI Protocol Active
            </span>
          </div>
        )}

        {/* Right CTA & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/workspace"
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-accent text-background hover:bg-accent/90 transition-all shadow-sm"
          >
            <span className="hidden sm:inline">Launch </span>
            <span>Workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {mode === "landing" && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md md:hidden text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Accessible Mobile Menu Dropdown */}
      {mode === "landing" && mobileMenuOpen && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 p-4 rounded-xl border border-border bg-surface/95 backdrop-blur-lg shadow-2xl pointer-events-auto font-mono text-xs space-y-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-muted hover:text-foreground transition-colors"
          >
            Product
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-muted hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-muted hover:text-foreground transition-colors"
          >
            Architecture
          </a>
          <a
            href="#scenarios"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-muted hover:text-foreground transition-colors"
          >
            Scenarios
          </a>
          <div className="pt-2 border-t border-border">
            <Link
              href="/workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-semibold bg-accent text-background text-xs"
            >
              <Activity className="w-4 h-4" />
              <span>Open Investigation Workspace</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
