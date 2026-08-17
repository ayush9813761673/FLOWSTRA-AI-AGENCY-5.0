"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Loader2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage, LANGUAGES, Language } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

export function LanguageSwitcher({ compact = false, className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage, currentOption, isChangingLanguage, isDetectingLanguage, targetLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    if (isChangingLanguage) return;
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className={`relative inline-block text-left ${className}`}>
      {/* Detecting language aura pulse */}
      {isDetectingLanguage && (
        <span
          className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500/20 via-sky-400/25 to-blue-600/20 blur-sm animate-pulse pointer-events-none"
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        id="language-switcher-btn"
        aria-label={isDetectingLanguage ? "Detecting language..." : "Select Language"}
        title={isDetectingLanguage ? "Detecting browser language..." : "Select Language"}
        aria-expanded={isOpen}
        aria-haspopup="true"
        disabled={isChangingLanguage}
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-1.5 sm:gap-2 rounded-full border transition-all duration-300 backdrop-blur-xl cursor-pointer active:scale-95 border-white/15 hover:border-blue-400/40 bg-slate-950/60 hover:bg-slate-900/80 text-zinc-200 hover:text-white shadow-[0_0_12px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.45)] ${
          isDetectingLanguage
            ? "border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            : ""
        } ${
          isChangingLanguage ? "opacity-80" : ""
        } ${
          compact
            ? "px-2.5 py-1.5 text-xs"
            : "px-3.5 py-2 text-xs sm:text-sm"
        }`}
      >
        {/* Globe icon on the leading edge */}
        {isChangingLanguage ? (
          <Loader2 className={`${compact ? "w-3.5 h-3.5" : "w-3.5 h-3.5 sm:w-4 sm:h-4"} text-blue-400 animate-spin shrink-0`} />
        ) : isDetectingLanguage ? (
          <div className="relative flex items-center justify-center shrink-0">
            {/* Gentle pulse beacon */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center justify-center text-blue-400"
            >
              <Globe className={`${compact ? "w-3.5 h-3.5" : "w-3.5 h-3.5 sm:w-4 sm:h-4"}`} />
            </motion.div>
            {/* Gentle radar dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </div>
        ) : (
          <Globe className={`${compact ? "w-3.5 h-3.5" : "w-3.5 h-3.5 sm:w-4 sm:h-4"} text-blue-400 group-hover:text-blue-300 transition-colors shrink-0`} />
        )}

        {/* Selected language code */}
        <span className="font-semibold tracking-wider uppercase text-[11px] sm:text-xs text-zinc-100 group-hover:text-white select-none">
          {currentOption.shortLabel}
        </span>

        {/* Discreet chevron indicator next to the language name */}
        <ChevronDown
          className={`${
            compact ? "w-3 h-3" : "w-3 h-3 sm:w-3.5 sm:h-3.5"
          } text-zinc-400 group-hover:text-zinc-200 transition-all duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-blue-400 group-hover:text-blue-300" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl border border-white/15 bg-zinc-950/85 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(59,130,246,0.12),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl z-[150] focus:outline-none glass-scrollbar"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-white/[0.08] mb-1 sticky top-0 bg-zinc-950/90 backdrop-blur-xl z-10 rounded-t-lg">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                {t.common?.switchLanguage || "Select Language"}
              </span>
              <span className="text-[9px] text-blue-300/80 bg-blue-500/10 px-1.5 py-0.5 rounded-full font-mono border border-blue-500/20">14 Languages</span>
            </div>
            <div className="space-y-0.5 pr-0.5" dir="ltr">
              {LANGUAGES.map((opt) => {
                const isSelected = opt.code === language;
                const isTarget = isChangingLanguage && opt.code === targetLanguage;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    id={`lang-opt-${opt.code}`}
                    disabled={isChangingLanguage}
                    onClick={() => handleSelect(opt.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors text-left group cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30"
                        : "text-zinc-300 hover:bg-zinc-800/70 hover:text-white border border-transparent"
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center gap-3 min-w-0 text-left">
                      <span className="text-lg leading-none shrink-0 select-none" role="img" aria-label={opt.label}>
                        {opt.flag}
                      </span>
                      <div className="flex flex-col min-w-0 text-left items-start">
                        <span className="font-semibold text-xs truncate text-zinc-100 group-hover:text-white text-left">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-normal truncate text-left mt-0.5">
                          {opt.nativeLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[9px] tracking-wider uppercase font-semibold text-zinc-400 group-hover:text-zinc-200 px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">
                        {opt.country}
                      </span>
                      {isTarget ? (
                        <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
                      ) : isSelected ? (
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
