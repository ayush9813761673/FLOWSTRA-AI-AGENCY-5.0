import React from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ logos }: LogoCloudProps) {
  return (
    <div className="relative mx-auto w-full max-w-5xl py-6 border-y border-white/5 bg-transparent">
      <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t border-white/5" />

      <InfiniteSlider gap={64} reverse duration={15} durationOnHover={60}>
        {logos.map((logo, idx) => (
          <img
            alt={logo.alt}
            className="h-10 select-none md:h-12 hover:scale-110 transition-transform cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            height="auto"
            key={`logo-${logo.alt}-${idx}`}
            loading="lazy"
            src={logo.src}
            width="auto"
          />
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 left-0 h-full w-[80px] md:w-[160px]"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 right-0 h-full w-[80px] md:w-[160px]"
        direction="right"
      />

      <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b border-white/5" />
    </div>
  );
}
