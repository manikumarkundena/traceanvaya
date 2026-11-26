"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { ArrowUpRight, Menu, X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  mode?: "landing" | "workspace";
}

const NAV_LINKS = [
  { id: "features", label: "Capabilities", href: "#features" },
  { id: "workflow", label: "Lifecycle", href: "#workflow" },
  { id: "architecture", label: "Architecture", href: "#architecture" },
  { id: "scenarios", label: "Scenarios", href: "#scenarios" },
] as const;

export const Navbar: React.FC<NavbarProps> = ({ mode = "landing" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section on landing page via IntersectionObserver
  useEffect(() => {
    if (mode !== "landing") return;
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0.05 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mode]);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 pt-3 pb-2 pointer-events-none">
      <div
        className={cn(
          "max-w-7xl mx-auto flex h-16 sm:h-[68px] items-center justify-between px-5 sm:px-7 rounded-2xl pointer-events-auto transition-all duration-200 relative overflow-hidden",
          "backdrop-blur-md border",
          scrolled
            ? "bg-[#090F0D]/90 border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.45)]"
            : "bg-[#090F0D]/75 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
        )}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
        >
          <Logo size={28} textClassName="text-[20px] sm:text-[21px]" />
        </Link>

        {/* Desktop Navigation Links (14px sans-serif) */}
        {mode === "landing" ? (
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8 text-sm font-sans font-medium text-slate-300"
          >
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "py-1.5 transition-colors duration-200 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm",
                    isActive ? "text-white font-semibold" : "hover:text-white"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 inset-x-0 h-0.5 bg-accent/85 rounded-full transition-all duration-200" />
                  )}
                </a>
              );
            })}
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface-elevated border border-border text-accent font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Workspace Active
            </span>
          </div>
        )}

        {/* Right CTA (40-42px height) & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/workspace"
            className="inline-flex items-center justify-center gap-2 h-10 sm:h-[42px] px-4 sm:px-5 rounded-xl text-sm font-semibold bg-accent text-[#050807] hover:bg-accent/90 active:scale-[0.98] transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="hidden sm:inline">Launch </span>
            <span>Workspace</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          {mode === "landing" && (
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg md:hidden text-muted hover:text-foreground hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="md:hidden max-w-6xl mx-auto mt-2 p-4 rounded-xl border border-white/[0.1] bg-[#0C1310]/95 backdrop-blur-xl shadow-xl pointer-events-auto font-mono text-xs space-y-2.5"
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
    </header>
  );
};
