"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";
import { Loader2 } from "lucide-react";

export function LanguageTransitionOverlay() {
  const { isChangingLanguage, targetLanguage, t } = useLanguage();

  const targetOption =
    LANGUAGES.find((opt) => opt.code === targetLanguage) || null;

  return (
    <AnimatePresence>
      {isChangingLanguage && (
        <>
          {/* Top Laser Progress Line */}
          <motion.div
            key="lang-top-loader"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "0% 50%" }}
            className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 shadow-[0_0_12px_rgba(59,130,246,0.8),0_0_20px_rgba(16,185,129,0.5)] pointer-events-none"
          />

          {/* Subtle Anti-Flicker Skeleton & Glass Shield */}
          <motion.div
            key="lang-backdrop-shield"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[140] pointer-events-none bg-slate-950/15 backdrop-blur-[1.5px]"
          />

          {/* Centered Floating Pill with Spinner */}
          <motion.div
            key="lang-pill-status"
            initial={{ opacity: 0, y: -12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
          >
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-slate-900/90 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-xl text-white">
              <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
              <div className="flex items-center gap-1.5 text-xs font-medium">
                {targetOption && (
                  <span className="text-sm leading-none">{targetOption.flag}</span>
                )}
                <span className="font-semibold text-slate-200">
                  {targetOption ? targetOption.label : ""}
                </span>
                <span className="text-slate-400 font-mono text-[11px] ml-1">
                  • {t.common.loadingLanguage || "Updating..."}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
