import React from "react";
import { motion } from "motion/react";

interface SectionDividerProps {
  glowColor?: string;
  className?: string;
}

export function SectionDivider({ glowColor = "rgba(59, 130, 246, 0.15)", className = "" }: SectionDividerProps) {
  return (
    <div className={`relative w-full max-w-7xl mx-auto px-4 md:px-8 py-2 ${className}`}>
      {/* Container for the absolute positioning of glow/lines */}
      <div className="relative flex items-center justify-center h-[1px] w-full">
        {/* Subtle, semi-transparent gradient line */}
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent" />
        
        {/* Accent layer - slightly thinner, colored gradient in the center */}
        <div className="absolute h-[1px] w-1/2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

        {/* Outer soft background glow orb in the center */}
        <div 
          className="absolute -top-6 h-12 w-48 rounded-full blur-[16px] pointer-events-none opacity-40 mix-blend-screen"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`
          }}
        />

        {/* Central tiny, bright anchor dot */}
        <div className="absolute h-1.5 w-1.5 rounded-full bg-blue-500/40 blur-[1px] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      </div>
    </div>
  );
}
