"use client";

import { useState, useEffect } from "react";
import { GrainGradient } from "@paper-design/shaders-react";
import { useTheme } from "@/context/ThemeContext";

export function GradientBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia("(max-width: 1024px)").matches ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-opacity duration-500 ${
        isDark ? "bg-black/20 mix-blend-screen opacity-50" : "bg-transparent opacity-65"
      }`}
    >
      {isMobile ? (
        <div 
          className="w-full h-full"
          style={{
            background: isDark
              ? "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)"
              : "radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.22) 0%, transparent 55%), radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(circle at 50% 70%, rgba(99, 102, 241, 0.16) 0%, transparent 60%), radial-gradient(circle at 20% 90%, rgba(59, 130, 246, 0.18) 0%, transparent 50%)"
          }}
        />
      ) : (
        <GrainGradient
          style={{ height: "100%", width: "100%" }}
          colorBack={isDark ? "hsl(0, 0%, 0%)" : "hsl(218, 60%, 97%)"}
          softness={isDark ? 0.76 : 0.7}
          intensity={isDark ? 0.45 : 0.48}
          noise={0}
          shape="corners"
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
          colors={
            isDark
              ? ["hsl(210, 100%, 56%)", "hsl(195, 100%, 50%)", "hsl(225, 73%, 57%)"]
              : ["hsl(215, 95%, 62%)", "hsl(192, 95%, 52%)", "hsl(245, 85%, 68%)"]
          }
        />
      )}
    </div>
  );
}
