"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, Calculator, Calendar } from "lucide-react";

export interface CinematicHeroProps extends React.ComponentProps<"div"> {
  brandName?: string;
  className?: string;
}

export function CinematicHero({
  brandName = "Flowstra",
  className,
  ...props
}: CinematicHeroProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-fade", {
        autoAlpha: 0,
        y: 24,
      });
      gsap.set(".hero-headline", {
        autoAlpha: 0,
        y: 32,
        scale: 0.96,
      });

      const introTl = gsap.timeline({ delay: 0.1 });
      introTl
        .to(".hero-headline", {
          duration: 1.1,
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: "expo.out",
        })
        .to(
          ".hero-fade",
          {
            duration: 0.8,
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.6"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("calculator");
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      id="hero"
      ref={containerRef}
      className={cn(
        "relative w-full min-h-[85vh] md:min-h-[88vh] pt-40 pb-28 md:pt-48 md:pb-36 lg:pt-56 lg:pb-44 overflow-hidden flex flex-col items-center justify-center bg-transparent text-foreground font-sans antialiased",
        className
      )}
      {...props}
    >
      {/* Soft ambient background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/[0.04] dark:bg-blue-500/[0.06] rounded-full blur-[180px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-6 w-full mx-auto">
        {/* Understated context badge */}
        <div className="hero-fade inline-flex items-center px-4 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--surface)]/70 backdrop-blur-md mb-8 shadow-xs">
          <span className="text-xs font-medium text-[var(--text-secondary)] tracking-wide">
            Enterprise Workflow Automation
          </span>
        </div>

        {/* Primary Headline */}
        <h1 className="hero-headline text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-bold tracking-tight leading-[1.08] max-w-4xl mx-auto text-[var(--text-primary)]">
          Stop paying people for work AI can handle
        </h1>

        {/* Sub-headline copy */}
        <p className="hero-fade text-base sm:text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mt-8 mb-12 font-normal">
          We engineer custom AI systems that take over lead qualification, CRM updates, and client outreach in 7 days — without altering your existing software stack.
        </p>

        {/* Dual High-Conversion CTA Buttons */}
        <div className="hero-fade flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a
            href="#calculator"
            onClick={scrollToCalculator}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98] shadow-sm hover:shadow"
          >
            <Calculator className="w-4 h-4 text-blue-100" />
            <span>Calculate Savings (60s)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="https://cal.com/flowstra/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--surface)] border border-[var(--card-border)] hover:border-[var(--card-border-hover)] text-[var(--text-primary)] font-semibold text-sm hover:bg-[var(--surface-hover)] transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Book a 30-Min Strategy Call</span>
          </a>
        </div>
      </div>
    </div>
  );
}

