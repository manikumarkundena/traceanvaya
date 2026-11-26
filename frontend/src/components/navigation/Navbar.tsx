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
          "max-w-6xl mx-auto flex h-13 items-center justify-between px-4 sm:px-6 rounded-xl pointer-events-auto transition-all duration-200",
          "backdrop-blur-md border",
          scrolled
            ? "bg-[#0A100D]/90 border-white/[0.1] shadow-lg shadow-black/40"
            : "bg-[#0C1310]/70 border-white/[0.06]"
        )}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-md"
        >
          <Logo size={24} />
        </Link>

        {/* Desktop Navigation Links */}
        {mode === "landing" ? (
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-7 text-xs font-sans font-medium text-muted"
          >
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "py-1 transition-colors duration-200 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm",
                    isActive ? "text-foreground font-semibold" : "hover:text-foreground"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 inset-x-0 h-0.5 bg-accent/80 rounded-full transition-all duration-200" />
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
        <div className="flex items-center gap-2.5">
          <Link
            href="/workspace"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-background hover:bg-accent/90 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="hidden sm:inline">Launch </span>
            <span>Workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
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
