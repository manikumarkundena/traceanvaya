"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { ArrowUpRight, Menu, X, Activity } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface NavbarProps {
  mode?: "landing" | "workspace";
}

const NAV_LINKS = [
  { href: "#features", id: "features", label: "Product" },
  { href: "#workflow", id: "workflow", label: "How it works" },
  { href: "#architecture", id: "architecture", label: "Architecture" },
  { href: "#scenarios", id: "scenarios", label: "Scenarios" },
];

export const Navbar: React.FC<NavbarProps> = ({ mode = "landing" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mode !== "landing") return;
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0.05 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [mode]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: EASE_OUT_EXPO }}
      className="motion-safe-reveal sticky top-0 z-50 w-full px-4 sm:px-6 pt-3 pb-2 pointer-events-none"
    >
      <div
        className={cn(
          "max-w-6xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 rounded-xl pointer-events-auto transition-all duration-300",
          "backdrop-blur-xl border",
          scrolled
            ? "bg-[#0C1410]/90 border-white/[0.12] shadow-[0_18px_45px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.1)]"
            : "bg-[#0E1612]/75 border-white/[0.08] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.07)]"
        )}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center hover:opacity-90 transition-opacity rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Logo size={24} />
        </Link>

        {/* Desktop Navigation Links */}
        {mode === "landing" ? (
          <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-xs font-mono">
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "relative py-1 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                    isActive ? "text-accent" : "text-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
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
            className="group relative overflow-hidden flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-accent text-background hover:bg-accent/95 active:scale-[0.98] transition-all shadow-[0_4px_18px_-4px_rgba(94,234,212,0.45),inset_0_1px_0_0_rgba(255,255,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="hidden sm:inline">Launch </span>
            <span>Workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          {mode === "landing" && (
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-md md:hidden text-muted hover:text-foreground hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Accessible Mobile Menu Dropdown */}
      <AnimatePresence>
        {mode === "landing" && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
            className="md:hidden max-w-6xl mx-auto mt-2 p-4 rounded-xl border border-white/[0.1] bg-[#0D1612]/95 backdrop-blur-xl shadow-2xl pointer-events-auto font-mono text-xs space-y-3"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-muted hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/[0.08]">
              <Link
                href="/workspace"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-semibold bg-accent text-background text-xs"
              >
                <Activity className="w-4 h-4" />
                <span>Open Investigation Workspace</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
