"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export function ThemeToggle({ compact = false, className = "" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
      title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
      className={`group relative flex items-center justify-center rounded-full border transition-all duration-300 backdrop-blur-xl cursor-pointer active:scale-95 overflow-hidden ${
        isDark
          ? "border-white/15 hover:border-blue-400/40 bg-slate-950/60 hover:bg-slate-900/80 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.45)]"
          : "border-slate-200 bg-white/90 hover:bg-slate-50 text-amber-500 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_0_12px_rgba(245,158,11,0.18)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.08),0_0_18px_rgba(245,158,11,0.28)]"
      } ${compact ? "w-8 h-8 p-1.5" : "w-9 h-9 sm:w-10 sm:h-10 p-2"} ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="night-moon"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex items-center justify-center text-blue-400 group-hover:text-blue-300"
          >
            <Moon className={`${compact ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5"} filter drop-shadow-[0_0_6px_rgba(96,165,250,0.6)]`} />
          </motion.div>
        ) : (
          <motion.div
            key="day-sun"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex items-center justify-center text-amber-500 group-hover:text-amber-600"
          >
            <Sun className={`${compact ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5"} filter drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]`} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
