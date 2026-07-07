import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show when scrolled past 600px (typically past the cinematic hero height)
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="back-to-top-btn"
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          onClick={scrollToTop}
          className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[9999] p-3 rounded-full border border-white/25 text-white cursor-pointer select-none overflow-hidden transition-colors shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_15px_rgba(59,130,246,0.15)] group hover:border-blue-500/50 hover:bg-blue-600/10 active:scale-95"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
          title="Back to Top"
        >
          {/* Liquid highlight element inside button */}
          <div className="absolute inset-0 rounded-full z-0 pointer-events-none 
            shadow-[inset_2px_2px_0.5px_-3.5px_rgba(255,255,255,0.3),inset_-2px_-2px_0.5px_-3.5px_rgba(255,255,255,0.7),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.5)] 
            bg-white/[0.04] transition-all duration-300 group-hover:bg-blue-600/5" 
          />

          {/* Outer blue glow ripple on hover */}
          <div className="absolute -inset-1 rounded-full bg-blue-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Content inside */}
          <div className="relative z-10 flex items-center justify-center">
            <ArrowUp className="h-5 w-5 text-slate-200 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-blue-400" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
