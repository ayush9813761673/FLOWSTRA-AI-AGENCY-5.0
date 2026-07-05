"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { HyperText } from "./hyper-text";

/* -----------------------------------------------------------------------------
 * Pixel canvas
 * -------------------------------------------------------------------------- */

type Pixel = {
  x: number;
  y: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInt: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;
  draw: () => void;
  appear: () => void;
  disappear: () => void;
  shimmer: () => void;
};

function createPixel(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  color: string,
  baseSpeed: number,
  delay: number
): Pixel {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const p: Pixel = {
    x, y, color, ctx,
    speed: rand(0.1, 0.9) * baseSpeed,
    size: 0,
    sizeStep: Math.random() * 0.4,
    minSize: 0.5,
    maxSizeInt: 2,
    maxSize: rand(0.5, 2),
    delay,
    counter: 0,
    counterStep: Math.random() * 4 + (canvas.width + canvas.height) * 0.01,
    isIdle: false,
    isReverse: false,
    isShimmer: false,
    draw() {
      const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
    },
    appear() {
      p.isIdle = false;
      if (p.counter <= p.delay) {
        p.counter += p.counterStep;
        return;
      }
      if (p.size >= p.maxSize) p.isShimmer = true;
      if (p.isShimmer) p.shimmer();
      else p.size += p.sizeStep;
      p.draw();
    },
    disappear() {
      p.isShimmer = false;
      p.counter = 0;
      if (p.size <= 0) {
        p.isIdle = true;
        return;
      }
      p.size -= 0.1;
      p.draw();
    },
    shimmer() {
      if (p.size >= p.maxSize) p.isReverse = true;
      else if (p.size <= p.minSize) p.isReverse = false;
      if (p.isReverse) p.size -= p.speed;
      else p.size += p.speed;
    },
  };

  return p;
}

type PixelCanvasProps = {
  colors: string[];
  gap?: number;
  speed?: number;
};

export function PixelCanvas({ colors, gap = 5, speed = 30 }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef(performance.now());
  const reducedMotionRef = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const effectiveSpeed = reducedMotionRef.current ? 0 : Math.min(speed, 100) * 0.001;
    const pixels: Pixel[] = [];

    // Each pixel's delay is its distance from the canvas center, so the
    // animation ripples outward from the middle on hover.
    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = reducedMotionRef.current ? 0 : Math.sqrt(dx * dx + dy * dy);
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay));
      }
    }

    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((mode: "appear" | "disappear") => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 60;

    const loop = () => {
      animationRef.current = requestAnimationFrame(loop);

      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pixels = pixelsRef.current;
      for (const pixel of pixels) pixel[mode]();

      if (pixels.every((p) => p.isIdle)) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    init();

    const resizeObserver = new ResizeObserver(() => init());
    if (wrapRef.current) resizeObserver.observe(wrapRef.current);

    // Hover is tracked on the parent card, not the canvas, so that the canvas
    // itself never blocks pointer events on the logo above it.
    const card = wrapRef.current?.parentElement;
    const handleEnter = () => animate("appear");
    const handleLeave = () => animate("disappear");
    card?.addEventListener("mouseenter", handleEnter);
    card?.addEventListener("mouseleave", handleLeave);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
      card?.removeEventListener("mouseenter", handleEnter);
      card?.removeEventListener("mouseleave", handleLeave);
    };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

export type Logo = {
  name: string;
  brandLight: string;
  brandDark?: string;
  height: number;
  multicolor: boolean;
  alwaysColor?: boolean;
  pixelColors: string[];
  row: number;
  col: number;
  src: string;
};

export const LOGOS: Logo[] = [
  // Row 1
  {
    name: "Zapier",
    brandLight: "#FF4A00",
    height: 24,
    multicolor: true,
    pixelColors: ["#FF4A00", "#FF6F33", "#FF9466"],
    row: 1,
    col: 1,
    src: "https://cdn.simpleicons.org/zapier/FF4A00",
  },
  {
    name: "Stripe",
    brandLight: "#635BFF",
    height: 20,
    multicolor: true,
    pixelColors: ["#635BFF", "#7B75FF", "#A39FFF"],
    row: 1,
    col: 2,
    src: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
  },
  {
    name: "Make",
    brandLight: "#6D00CC",
    brandDark: "#9E33FF",
    height: 22,
    multicolor: true,
    alwaysColor: true,
    pixelColors: ["#6D00CC", "#8A33FF", "#A466FF"],
    row: 1,
    col: 3,
    src: "https://cdn.simpleicons.org/make/6D00CC",
  },
  {
    name: "Mailchimp",
    brandLight: "#FFE01B",
    height: 24,
    multicolor: true,
    pixelColors: ["#FFE01B", "#FFD000", "#FFEA5C"],
    row: 1,
    col: 4,
    src: "https://cdn.simpleicons.org/mailchimp/FFE01B",
  },
  {
    name: "HubSpot",
    brandLight: "#FF7A59",
    height: 24,
    multicolor: true,
    pixelColors: ["#FF7A59", "#FF9B82", "#FFBBAB"],
    row: 1,
    col: 5,
    src: "https://cdn.simpleicons.org/hubspot/FF7A59",
  },

  // Middle rows
  {
    name: "Google",
    brandLight: "#4285F4",
    height: 24,
    multicolor: true,
    alwaysColor: true,
    pixelColors: ["#4285F4", "#EA4335", "#FBBC05", "#34A853"],
    row: 2,
    col: 1,
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg",
  },
  {
    name: "ChatGPT",
    brandLight: "#10A37F",
    brandDark: "#10A37F",
    height: 24,
    multicolor: false,
    pixelColors: ["#10A37F", "#19C39B", "#4EE0BE"],
    row: 3,
    col: 1,
    src: "/chatgpt.svg",
  },
  {
    name: "Airtable",
    brandLight: "#F82B60",
    height: 20,
    multicolor: true,
    pixelColors: ["#F82B60", "#FF4C7B", "#FF6B93"],
    row: 2,
    col: 5,
    src: "https://www.vectorlogo.zone/logos/airtable/airtable-icon.svg",
  },
  {
    name: "N8N",
    brandLight: "#EA4365",
    height: 24,
    multicolor: true,
    pixelColors: ["#EA4365", "#FF6B8B", "#FF94AD"],
    row: 3,
    col: 5,
    src: "https://cdn.simpleicons.org/n8n/EA4365",
  },

  // Row 4
  {
    name: "Spotify",
    brandLight: "#1DB954",
    height: 22,
    multicolor: true,
    pixelColors: ["#1DB954", "#1ED760", "#56E889"],
    row: 4,
    col: 1,
    src: "https://cdn.simpleicons.org/spotify/1DB954",
  },
  {
    name: "Notion",
    brandLight: "#000000",
    brandDark: "#FFFFFF",
    height: 20,
    multicolor: false,
    pixelColors: ["#000000", "#333333", "#666666"],
    row: 4,
    col: 2,
    src: "https://cdn.simpleicons.org/notion/000000",
  },
  {
    name: "Supabase",
    brandLight: "#3ECF8E",
    brandDark: "#3ECF8E",
    height: 22,
    multicolor: true,
    pixelColors: ["#3ECF8E", "#4ADE80", "#22C55E"],
    row: 4,
    col: 3,
    src: "https://cdn.simpleicons.org/supabase/3ECF8E",
  },
  {
    name: "Anthropic",
    brandLight: "#D17A57",
    height: 22,
    multicolor: true,
    pixelColors: ["#D17A57", "#DF977A", "#ECAE97"],
    row: 4,
    col: 4,
    src: "https://cdn.simpleicons.org/anthropic/D17A57",
  },
  {
    name: "Vercel",
    brandLight: "#000000",
    brandDark: "#FFFFFF",
    height: 20,
    multicolor: false,
    pixelColors: ["#000000", "#333333", "#666666"],
    row: 4,
    col: 5,
    src: "https://cdn.simpleicons.org/vercel/000000",
  },
];

export function LogoCard({ logo, }: { logo: Logo; key?: string }) {
  const { src, multicolor, alwaysColor, brandLight, brandDark, height, pixelColors, row, col } = logo;

  return (
    <div
      className={cn(
        "group relative flex items-center justify-center overflow-hidden bg-card cursor-pointer select-none isolate h-full min-h-[76px]",
        "transition-shadow duration-300 hover:z-[2]",
        "[--brand:var(--brand-light)] dark:[--brand:var(--brand-dark)]",
        "hover:shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--brand)_25%,transparent),0_0_0_1px_color-mix(in_srgb,var(--brand)_40%,transparent)]",
        // Position explicitly on larger screens
        "md:[grid-row:var(--grid-row)] md:[grid-column:var(--grid-col)]"
      )}
      style={
        {
          "--brand-light": brandLight,
          "--brand-dark": brandDark ?? brandLight,
          "--grid-row": row,
          "--grid-col": col,
        } as React.CSSProperties
      }
    >
      <PixelCanvas colors={pixelColors} gap={5} speed={30} />
      <img
        src={src}
        alt={logo.name}
        referrerPolicy="no-referrer"
        className={cn(
          "relative z-[1] w-auto max-w-[65%] transition-all duration-300 group-hover:scale-[1.06]",
          alwaysColor ? "opacity-80 group-hover:opacity-100"
          : multicolor
            ? "opacity-80 group-hover:opacity-100"
            : "opacity-60 group-hover:opacity-100 dark:brightness-0 dark:invert"
        )}
        style={{ height: `${height}px`, maxHeight: `${height}px` }}
      />
    </div>
  );
}

export type PixelLogoGridProps = {
  badge?: string;
  heading?: string;
  subheading?: string;
  highlightCount?: number;
};

export const PixelLogoGrid = ({
  badge = "Our clients",
  heading = "Trusted by top brands across different sectors",
  subheading,
  highlightCount = 2,
}: PixelLogoGridProps = {}) => {
  return (
    <div className="w-full">
      <div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 max-w-[1160px] mx-auto gap-px bg-border border border-border auto-rows-[76px] md:auto-rows-[96px]"
      >
        {LOGOS.map((logo) => (
          <LogoCard key={logo.name} logo={logo} />
        ))}

        <div
          className="hidden md:flex flex-col items-center justify-center gap-4 bg-card/50 backdrop-blur-sm px-6 text-center"
          style={{ gridColumn: "2 / span 3", gridRow: "2 / span 2" }}
        >
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-card border border-border text-muted-foreground shadow-sm">
            {badge}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground max-w-[600px] leading-tight tracking-tight">
            <HyperText
              text={heading}
              className="text-2xl md:text-4xl font-bold text-foreground"
              containerClassName="justify-center"
              highlightCount={highlightCount}
            />
          </h2>
          {subheading && (
            <p className="text-sm md:text-base text-muted-foreground max-w-[500px]">
              {subheading}
            </p>
          )}
        </div>
        
        {/* Mobile heading display instead of grid center item */}
        <div className="md:hidden col-span-3 sm:col-span-4 row-span-2 flex flex-col items-center justify-center gap-3 bg-card px-4 py-6 text-center" style={{ gridRow: "2 / span 2" }}>
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-card border border-border text-muted-foreground shadow-sm">
            {badge}
          </span>
          <h2 data-toc-ignore className="text-xl font-bold text-foreground leading-tight tracking-tight">
            <HyperText
              text={heading}
              className="text-xl font-bold text-foreground"
              containerClassName="justify-center"
              highlightCount={highlightCount}
            />
          </h2>
          {subheading && (
            <p className="text-xs text-muted-foreground mt-1">
              {subheading}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
