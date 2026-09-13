"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  const navLinksData = [
    { label: t.nav.calculator || "ROI Calculator", href: "#calculator" },
    { label: t.nav.solutions || "Solutions", href: "#features" },
    { label: t.nav.results || "Case Studies", href: "#testimonials" },
    { label: t.nav.workspace || "Live Sandbox", href: "#workspace" },
    { label: t.nav.faq || "FAQ", href: "#faq" },
    { label: t.nav.pricing || "Pricing", href: "#pricing" },
  ];

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const sectionIds = ["hero", "calculator", "workspace", "testimonials", "features", "tools", "team", "pricing", "faq", "final-cta"];
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (href === "#" || href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetId = href.replace("#", "");
    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const glassIslandClasses = cn(
    "relative flex items-center rounded-full transition-all duration-300 select-none",
    "backdrop-blur-2xl backdrop-saturate-150",
    // Light mode frosted glass
    "bg-white/60 border border-white/80 shadow-[0_8px_30px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)]",
    "hover:bg-white/75 hover:border-white hover:shadow-[0_12px_36px_rgba(37,99,235,0.1),inset_0_1px_1px_rgba(255,255,255,1)]",
    // Dark mode frosted glass
    "dark:bg-slate-950/50 dark:border-white/[0.12] dark:shadow-[0_12px_36px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_-1px_1px_rgba(255,255,255,0.02)]",
    "dark:hover:bg-slate-950/65 dark:hover:border-white/[0.22] dark:hover:shadow-[0_16px_44px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25)]"
  );

  return (
    <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-[120] w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] max-w-7xl select-none flex items-center justify-between gap-3 sm:gap-4">
      {/* SEPARATE ISLAND 1: Flowstra Brand */}
      <a
        href="#hero"
        id="flowstra-brand-island"
        onClick={(e) => scrollToSection(e, "#hero")}
        className={cn(
          glassIslandClasses,
          "h-12 sm:h-14 px-4 sm:px-5 gap-2.5 sm:gap-3 group cursor-pointer shrink-0"
        )}
      >
        {/* Specular gloss top highlight */}
        <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-b from-white/35 via-transparent to-transparent dark:from-white/10" />

        <div className="relative flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Flowstra Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain transition-all duration-300 group-hover:scale-105 group-hover:rotate-6"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        <span className="text-slate-900 dark:text-white font-bold text-sm sm:text-[15px] tracking-[0.22em] uppercase transition-all duration-300 group-hover:tracking-[0.26em]">
          Flowstra
        </span>
      </a>

      {/* SEPARATE ISLAND 2: Navigation Links */}
      <nav
        id="flowstra-nav-links-island"
        className={cn(
          glassIslandClasses,
          "hidden lg:flex h-12 sm:h-14 px-2 sm:px-3 gap-1 xl:gap-1.5"
        )}
      >
        {/* Specular gloss top highlight */}
        <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-b from-white/30 via-transparent to-transparent dark:from-white/10" />

        {navLinksData.map((link) => {
          const isActive = activeSection === link.href.replace("#", "");
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={cn(
                "relative px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap",
                isActive
                  ? "text-slate-950 dark:text-white font-semibold bg-black/[0.06] dark:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] border border-black/5 dark:border-white/10"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/5"
              )}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      {/* SEPARATE ISLAND 3: Actions & Controls */}
      <div
        id="flowstra-actions-island"
        className={cn(
          glassIslandClasses,
          "h-12 sm:h-14 px-2.5 sm:px-3.5 gap-2 sm:gap-2.5 shrink-0"
        )}
      >
        {/* Specular gloss top highlight */}
        <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-b from-white/30 via-transparent to-transparent dark:from-white/10" />

        <ThemeToggle compact={true} />
        <LanguageSwitcher compact={true} />

        {/* Book Call CTA */}
        <a
          href="https://cal.com/flowstra/30min"
          target="_blank"
          rel="noopener noreferrer"
          id="nav-book-call-btn"
          className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full shadow-[0_2px_12px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.5)] transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <span>{t.nav.bookCall || "Book a Call"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>

        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          id="nav-mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 text-slate-800 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Animated Glass Dropdown Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-3 p-4 rounded-3xl backdrop-blur-2xl backdrop-saturate-150 bg-white/80 dark:bg-slate-950/85 border border-white/80 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col gap-2 overflow-hidden z-50"
          >
            <div className="flex flex-col gap-1">
              {navLinksData.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 font-semibold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-60" />
                  </a>
                );
              })}
            </div>

            <div className="pt-2 border-t border-black/5 dark:border-white/10 mt-1">
              <a
                href="https://cal.com/flowstra/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/25 active:scale-98 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>{t.nav.bookCall || "Book a 30-Min Strategy Call"}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;