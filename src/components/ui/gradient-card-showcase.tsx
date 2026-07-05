import React, { ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface GradientCardProps {
  gradientFrom: string;
  gradientTo: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function GradientCard({
  gradientFrom,
  gradientTo,
  children,
  className,
  contentClassName,
}: GradientCardProps) {
  return (
    <>
      <div
        className={cn(
          "group/gradient relative transition-all duration-500",
          className,
        )}
      >
        {/* Skewed gradient panels matching requested spec */}
        <span
          className="absolute top-0 left-[50px] w-1/2 h-full rounded-2xl transform skew-x-[15deg] transition-all duration-500 group-hover/gradient:skew-x-0 group-hover/gradient:left-[20px] group-hover/gradient:w-[calc(100%-90px)]"
          style={{
            background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
          }}
        />
        <span
          className="absolute top-0 left-[50px] w-1/2 h-full rounded-2xl transform skew-x-[15deg] blur-[30px] transition-all duration-500 group-hover/gradient:skew-x-0 group-hover/gradient:left-[20px] group-hover/gradient:w-[calc(100%-90px)]"
          style={{
            background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
          }}
        />

        {/* Animated blurs (glass blobs) */}
        <span className="pointer-events-none absolute inset-0 z-10 block overflow-visible">
          <span className="absolute top-0 left-0 w-0 h-0 rounded-2xl opacity-0 bg-[rgba(255,255,255,0.15)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-300 animate-blob group-hover/gradient:-top-[50px] group-hover/gradient:left-[50px] group-hover/gradient:w-[100px] group-hover/gradient:h-[100px] group-hover/gradient:opacity-100" />
          <span className="absolute bottom-0 right-0 w-0 h-0 rounded-2xl opacity-0 bg-[rgba(255,255,255,0.15)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-500 animate-blob animation-delay-1000 group-hover/gradient:-bottom-[50px] group-hover/gradient:right-[50px] group-hover/gradient:w-[100px] group-hover/gradient:h-[100px] group-hover/gradient:opacity-100" />
        </span>

        {/* Content with smooth left-offset group hover translation */}
        <div
          className={cn(
            "relative z-20 left-0 w-full h-full bg-[#111] shadow-2xl rounded-2xl transition-all duration-500 group-hover/gradient:-left-[25px] border border-white/5",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translate(-10px); }
        }
        .animate-blob { animation: blob 2s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: -1s; }
      `}</style>
    </>
  );
}

export default function SkewCards() {
  return null;
}
