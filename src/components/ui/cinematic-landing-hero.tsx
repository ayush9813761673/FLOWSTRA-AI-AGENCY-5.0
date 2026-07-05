"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { SparklesText } from "./sparkles-text";

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  @keyframes slow-pan {
    0% { background-position: 0 0; }
    100% { background-position: -60px -60px; }
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      animation: slow-pan 15s linear infinite;
  }

  .text-3d-matte {
      color: var(--color-foreground);
      text-shadow: 
          0 10px 30px color-mix(in srgb, var(--color-foreground) 20%, transparent), 
          0 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, var(--color-foreground) 0%, color-mix(in srgb, var(--color-foreground) 40%, transparent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 10px 20px color-mix(in srgb, var(--color-foreground) 15%, transparent)) 
          drop-shadow(0px 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent));
  }
`;

export interface CinematicHeroProps extends React.ComponentProps<"div"> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  className?: string;
}

export function CinematicHero({
  brandName = "Flowstra",
  tagline1 = "Automate your flow,",
  tagline2 = "Get more clients.",
  className,
  ...props
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const lastSpaceIndex = tagline2.lastIndexOf(" ");
  const otherWords = lastSpaceIndex !== -1 ? tagline2.substring(0, lastSpaceIndex + 1) : "";
  const lastWord = lastSpaceIndex !== -1 ? tagline2.substring(lastSpaceIndex + 1) : tagline2;

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const playHeroAnimation = () => {
      if (ctx) return; // Prevent duplicate animations if somehow called twice
      ctx = gsap.context(() => {
        gsap.set(".text-track", {
          autoAlpha: 0,
          y: 60,
          scale: 0.85,
          filter: "blur(20px)",
          rotationX: -20,
        });
        gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });

        const introTl = gsap.timeline({ delay: 0.2 });
        introTl
          .to(".text-track", {
            duration: 1.8,
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            rotationX: 0,
            ease: "expo.out",
          })
          .to(
            ".text-days",
            { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" },
            "-=1.0",
          );
      }, containerRef);
    };

    // Initialize elements to hidden/invisible state instantly on mount
    gsap.set(".text-track", {
      autoAlpha: 0,
      y: 60,
      scale: 0.85,
      filter: "blur(20px)",
      rotationX: -20,
    });
    gsap.set(".text-days", { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" });

    if ((window as any).__flowstraIntroGateDismissed) {
      playHeroAnimation();
    } else {
      const handleStart = () => {
        playHeroAnimation();
      };
      document.addEventListener("flowstra-experience-start", handleStart);
      return () => {
        document.removeEventListener("flowstra-experience-start", handleStart);
        if (ctx) ctx.revert();
      };
    }

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-screen min-h-[100vh] pb-32 overflow-hidden flex flex-col items-center justify-center bg-transparent text-foreground font-sans antialiased",
        className,
      )}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div
        className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50"
        aria-hidden="true"
      />

      {/* BACKGROUND LAYER: Hero Texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 mt-20 will-change-transform transform-style-3d">
        <h1 className="text-track gsap-reveal text-3d-matte text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          {tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-silver-matte text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter flex items-center justify-center flex-wrap gap-x-2 md:gap-x-4">
          <span>{otherWords}</span>
          <SparklesText
            text={lastWord}
            className="text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter text-silver-matte inline-block"
            starColors={["#FFD700", "#FF2E93", "#3b82f6", "#06b6d4", "#a855f7", "#10b981"]}
            sparklesCount={10}
          />
        </h1>
      </div>
    </div>
  );
}
