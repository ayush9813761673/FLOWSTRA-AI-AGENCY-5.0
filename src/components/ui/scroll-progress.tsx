import React from "react";
import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // Spring config to make the movement ultra-smooth and responsive
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 origin-left z-[9999] shadow-[0_0_8px_rgba(56,189,248,0.5)] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
