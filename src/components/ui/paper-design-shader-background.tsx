"use client";

import { useState, useEffect } from "react";
import { GrainGradient } from "@paper-design/shaders-react";

export function GradientBackground() {
  const [isMobile, setIsMobile] = useState(false);

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
    <div className="fixed inset-0 -z-10 bg-black/20 overflow-hidden mix-blend-screen opacity-50 pointer-events-none">
      {isMobile ? (
        <div 
          className="w-full h-full opacity-60"
          style={{
            background: "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)"
          }}
        />
      ) : (
        <GrainGradient
          style={{ height: "100%", width: "100%" }}
          colorBack="hsl(0, 0%, 0%)"
          softness={0.76}
          intensity={0.45}
          noise={0}
          shape="corners"
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
          colors={[
            "hsl(210, 100%, 56%)",
            "hsl(195, 100%, 50%)",
            "hsl(225, 73%, 57%)",
          ]}
        />
      )}
    </div>
  );
}
