"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, X, Check, ChevronDown, Sparkles, SlidersHorizontal } from "lucide-react";
import { useLanguage, LANGUAGES, Language } from "@/context/LanguageContext";

// Localized toast labels for each supported language
const TOAST_LOCALES: Record<
  Language,
  {
    title: string;
    subtitle: string;
    changeBtn: string;
    dismissBtn: string;
    selectPrompt: string;
  }
> = {
  en: {
    title: "Language Auto-Selected",
    subtitle: "Matched to your browser settings",
    changeBtn: "Change",
    dismissBtn: "Keep",
    selectPrompt: "Choose your preferred language",
  },
  zh: {
    title: "已自动匹配语言",
    subtitle: "已根据您的浏览器首选语言设置",
    changeBtn: "更改语言",
    dismissBtn: "保留",
    selectPrompt: "选择您的首选语言",
  },
  hi: {
    title: "भाषा स्वतः चुनी गई",
    subtitle: "आपके ब्राउज़र की सेटिंग के अनुसार सेट की गई",
    changeBtn: "बदलें",
    dismissBtn: "रखें",
    selectPrompt: "अपनी पसंदीदा भाषा चुनें",
  },
  es: {
    title: "Idioma seleccionado",
    subtitle: "Configurado según las preferencias de tu navegador",
    changeBtn: "Cambiar",
    dismissBtn: "Mantener",
    selectPrompt: "Elige tu idioma preferido",
  },
  fr: {
    title: "Langue sélectionnée",
    subtitle: "Adaptée aux paramètres de votre navigateur",
    changeBtn: "Modifier",
    dismissBtn: "Conserver",
    selectPrompt: "Choisissez votre langue préférée",
  },
  ar: {
    title: "تم تحديد اللغة تلقائياً",
    subtitle: "مطابقة لإعدادات المتصفح الخاص بك",
    changeBtn: "تغيير",
    dismissBtn: "إبقاء",
    selectPrompt: "اختر لغتك المفضلة",
  },
  bn: {
    title: "ভাষা স্বয়ংক্রিয়ভাবে নির্বাচিত",
    subtitle: "আপনার ব্রাউজার সেটিংসের সাথে মিলেছে",
    changeBtn: "পরিবর্তন করুন",
    dismissBtn: "রাখুন",
    selectPrompt: "আপনার পছন্দের ভাষা নির্বাচন করুন",
  },
  pt: {
    title: "Idioma selecionado",
    subtitle: "Definido de acordo com seu navegador",
    changeBtn: "Alterar",
    dismissBtn: "Manter",
    selectPrompt: "Escolha seu idioma de preferência",
  },
  ru: {
    title: "Язык выбран автоматически",
    subtitle: "На основе настроек вашего браузера",
    changeBtn: "Изменить",
    dismissBtn: "Оставить",
    selectPrompt: "Выберите предпочитаемый язык",
  },
  ur: {
    title: "زبان خودکار منتخب کی گئی",
    subtitle: "آپ کی براؤزر ترتیبات کے مطابق",
    changeBtn: "تبدیل کریں",
    dismissBtn: "برقرار رکھیں",
    selectPrompt: "اپنی پسندیدہ زبان منتخب کریں",
  },
  id: {
    title: "Bahasa Terpilih Otomatis",
    subtitle: "Disesuaikan dengan pengaturan browser Anda",
    changeBtn: "Ubah",
    dismissBtn: "Tetap",
    selectPrompt: "Pilih bahasa yang Anda inginkan",
  },
  de: {
    title: "Sprache automatisch gewählt",
    subtitle: "Basierend auf Ihren Browsereinstellungen",
    changeBtn: "Ändern",
    dismissBtn: "Behalten",
    selectPrompt: "Wählen Sie Ihre bevorzugte Sprache",
  },
  ja: {
    title: "言語を自動検出しました",
    subtitle: "ブラウザの設定に合わせて設定されています",
    changeBtn: "変更する",
    dismissBtn: "このまま",
    selectPrompt: "ご希望の言語を選択してください",
  },
  ne: {
    title: "भाषा स्वतः चयन गरियो",
    subtitle: "तपाईंको ब्राउजर प्राथमिकता अनुसार सेट गरियो",
    changeBtn: "परिवर्तन",
    dismissBtn: "राख्नुहोस्",
    selectPrompt: "आफ्नो मनपर्ने भाषा छान्नुहोस्",
  },
};

const AUTO_DISMISS_MS = 8000;

export function LanguageDetectionToast() {
  const { language, setLanguage, currentOption, isDetectingLanguage, isChangingLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(AUTO_DISMISS_MS);
  const animFrameRef = useRef<number | null>(null);

  // Trigger toast entrance only after initial browser detection finishes
  useEffect(() => {
    if (!isDetectingLanguage && !hasInteracted) {
      // Check session storage to avoid spamming the user across rapid in-session re-renders
      try {
        const sessionDismissed = sessionStorage.getItem("flowstra_lang_toast_seen");
        if (sessionDismissed) {
          return;
        }
      } catch {
        // Ignore storage access errors
      }

      // Small delay after detection finishes for an organic, pleasant entrance
      const timer = window.setTimeout(() => {
        setIsVisible(true);
      }, 400);

      return () => window.clearTimeout(timer);
    }
  }, [isDetectingLanguage, hasInteracted]);

  // Handle countdown progress and auto-dismiss
  useEffect(() => {
    if (!isVisible || isPickerOpen || isPaused || hasInteracted) {
      return;
    }

    startTimeRef.current = Date.now();
    const duration = remainingTimeRef.current;

    const updateTimer = () => {
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      const remaining = Math.max(0, duration - elapsed);
      const pct = (remaining / AUTO_DISMISS_MS) * 100;
      setProgress(pct);

      if (remaining <= 0) {
        handleDismiss();
      } else {
        animFrameRef.current = requestAnimationFrame(updateTimer);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      }
    };
  }, [isVisible, isPickerOpen, isPaused, hasInteracted]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsPickerOpen(false);
    setHasInteracted(true);
    try {
      sessionStorage.setItem("flowstra_lang_toast_seen", "true");
    } catch {
      // Ignore
    }
  };

  const handleLanguageSelect = (code: Language) => {
    setLanguage(code);
    setIsPickerOpen(false);
    // Briefly show the confirmation before closing toast
    window.setTimeout(() => {
      handleDismiss();
    }, 450);
  };

  const loc = TOAST_LOCALES[language] || TOAST_LOCALES.en;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="language-detection-toast"
          role="region"
          aria-live="polite"
          aria-label="Language detection notice"
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[125] max-w-[calc(100vw-2rem)] sm:max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(59,130,246,0.15)]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/92 backdrop-blur-2xl p-4 text-zinc-100 transition-all duration-300">
            {/* Ambient background glow */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-500/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-indigo-500/10 blur-xl" />

            {/* Countdown timer bar */}
            {!isPickerOpen && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-zinc-800/80">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-sky-400 transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Main Toast Header & Content */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Visual Flag & Icon Badge */}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-xl shadow-inner">
                  <span className="leading-none select-none">{currentOption.flag}</span>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] text-white ring-2 ring-zinc-950">
                    <Sparkles className="h-2.5 w-2.5" />
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-semibold tracking-tight text-white truncate">
                      {loc.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-300 border border-blue-400/20">
                      {currentOption.label}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                    {loc.subtitle} &bull;{" "}
                    <span className="text-zinc-300 font-medium">{currentOption.nativeLabel}</span>
                  </p>
                </div>
              </div>

              {/* Close / Dismiss Button */}
              <button
                type="button"
                onClick={handleDismiss}
                id="toast-dismiss-btn"
                aria-label="Close notification"
                className="shrink-0 rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Action Bar or Inline Quick Picker */}
            {!isPickerOpen ? (
              <div className="mt-3.5 flex items-center justify-end gap-2 pt-2.5 border-t border-white/[0.08]">
                <button
                  type="button"
                  id="toast-keep-btn"
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  {loc.dismissBtn}
                </button>
                <button
                  type="button"
                  id="toast-change-btn"
                  onClick={() => setIsPickerOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm shadow-blue-600/30 cursor-pointer"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {loc.changeBtn}
                  <ChevronDown className="h-3 w-3 opacity-80" />
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t border-white/[0.08]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3 text-blue-400" />
                    {loc.selectPrompt}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(false)}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Back
                  </button>
                </div>

                {/* 14 Languages Grid / Quick Select List */}
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1.5 glass-scrollbar" dir="ltr">
                  {LANGUAGES.map((item) => {
                    const isSelected = item.code === language;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        id={`toast-lang-${item.code}`}
                        disabled={isChangingLanguage}
                        onClick={() => handleLanguageSelect(item.code)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600/25 border border-blue-500/40 text-blue-200 font-semibold"
                            : "bg-white/[0.03] border border-white/[0.05] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 text-left">
                          <span className="text-base leading-none shrink-0 select-none">{item.flag}</span>
                          <div className="flex flex-col min-w-0 text-left items-start">
                            <span className="truncate text-[11px] font-medium text-zinc-200 text-left">{item.label}</span>
                            <span className="truncate text-[9px] text-zinc-400 font-normal text-left">{item.nativeLabel}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          <span className="text-[8px] tracking-wider uppercase font-semibold text-zinc-400 px-1 py-0.2 rounded bg-white/[0.06]">
                            {item.country}
                          </span>
                          {isSelected && <Check className="h-3 w-3 text-blue-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
