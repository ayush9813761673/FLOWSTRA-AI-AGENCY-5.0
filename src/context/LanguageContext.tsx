import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, LanguageOption, LANGUAGES, Translations } from "./types";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { zh } from "./locales/zh";
import { hi } from "./locales/hi";
import { ar } from "./locales/ar";
import { bn } from "./locales/bn";
import { pt } from "./locales/pt";
import { ru } from "./locales/ru";
import { ur } from "./locales/ur";
import { id } from "./locales/id";
import { de } from "./locales/de";
import { ja } from "./locales/ja";
import { ne } from "./locales/ne";

export type { Language, LanguageOption, Translations };
export { LANGUAGES };

const translationsMap: Record<Language, Translations> = {
  en,
  zh,
  hi,
  es,
  fr,
  ar,
  bn,
  pt,
  ru,
  ur,
  id,
  de,
  ja,
  ne,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currentOption: LanguageOption;
  isChangingLanguage: boolean;
  isDetectingLanguage: boolean;
  targetLanguage: Language | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_CODES = LANGUAGES.map((l) => l.code);

export type DetectionSource = "stored_preference" | "browser_navigator" | "fallback_default";

export interface DetectionResult {
  language: Language;
  isPreExisting: boolean;
  source: DetectionSource;
}

/**
 * Logs language detection and lifecycle events, persisting values to localStorage
 * to ensure returning visitors experience instantaneous hydration without transition overlays.
 */
export function logAndPersistDetectedLanguage(
  detectedLang: Language,
  source: DetectionSource,
  isReturning: boolean
) {
  if (typeof window === "undefined") return;

  const timestamp = new Date().toISOString();

  try {
    localStorage.setItem("flowstra_lang", detectedLang);
    localStorage.setItem("flowstra_lang_detected_at", timestamp);
    localStorage.setItem("flowstra_lang_detection_source", source);
  } catch (err) {
    console.warn("[LanguageDetection] Could not persist language to localStorage:", err);
  }

  // Developer & telemetry console audit log
  console.log(
    `%c[LanguageDetection]%c Resolved language %c${detectedLang.toUpperCase()}%c via %c${source}%c (returning: ${isReturning}) at ${timestamp}`,
    "color: #3b82f6; font-weight: bold;",
    "color: inherit;",
    "color: #10b981; font-weight: bold;",
    "color: inherit;",
    "color: #f59e0b; font-weight: 500;",
    "color: inherit;"
  );
}

function detectBrowserLanguage(): DetectionResult {
  if (typeof window === "undefined") {
    return { language: "en", isPreExisting: false, source: "fallback_default" };
  }

  // 1. Check if user already manually selected or detected a preference in local storage
  try {
    const saved = localStorage.getItem("flowstra_lang") as Language;
    if (saved && SUPPORTED_CODES.includes(saved)) {
      return { language: saved, isPreExisting: true, source: "stored_preference" };
    }
  } catch {
    // Ignore localStorage access errors (e.g. strict security modes)
  }

  // 2. Check browser's preferred languages
  try {
    const browserLangs =
      navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language || ""];

    for (const rawLang of browserLangs) {
      if (!rawLang) continue;
      const primary = rawLang.toLowerCase().split("-")[0] as Language;
      if (SUPPORTED_CODES.includes(primary)) {
        return { language: primary, isPreExisting: false, source: "browser_navigator" };
      }
    }
  } catch {
    // Fallback if navigator language is inaccessible
  }

  return { language: "en", isPreExisting: false, source: "fallback_default" };
}

function playPopSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    // Organic tactile pop chirp (high sine falling smoothly to warm low frequency)
    osc.type = "sine";
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.07);

    // Low-volume haptic audio envelope (unobtrusive 0.06 volume)
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 160);
  } catch {
    // Safely ignore if autoplay policy blocks audio or Web Audio is unavailable
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [initialDetection] = useState<DetectionResult>(() => detectBrowserLanguage());
  const [language, setLanguageState] = useState<Language>(initialDetection.language);
  const [isChangingLanguage, setIsChangingLanguage] = useState<boolean>(false);
  const [isDetectingLanguage, setIsDetectingLanguage] = useState<boolean>(!initialDetection.isPreExisting);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);

  // Execute logging utility and persist detected language to localStorage
  useEffect(() => {
    logAndPersistDetectedLanguage(
      initialDetection.language,
      initialDetection.source,
      initialDetection.isPreExisting
    );

    if (!initialDetection.isPreExisting) {
      const timer = window.setTimeout(() => {
        setIsDetectingLanguage(false);
      }, 950);
      return () => window.clearTimeout(timer);
    } else {
      setIsDetectingLanguage(false);
    }
  }, [initialDetection]);

  const setLanguage = (lang: Language) => {
    if (lang === language && !isChangingLanguage) return;

    // Trigger subtle tactile audio pop feedback
    playPopSound();

    setIsChangingLanguage(true);
    setTargetLanguage(lang);

    // Subtle phased transition: triggers smooth skeleton/loading effect
    // then switches translations and smoothly dissolves effect to eliminate jarring content flicker
    window.setTimeout(() => {
      setLanguageState(lang);
      if (typeof window !== "undefined") {
        logAndPersistDetectedLanguage(lang, "stored_preference", true);
        document.documentElement.lang = lang;
        // Also support RTL languages (Arabic, Urdu)
        if (lang === "ar" || lang === "ur") {
          document.documentElement.dir = "rtl";
        } else {
          document.documentElement.dir = "ltr";
        }
      }

      window.setTimeout(() => {
        setIsChangingLanguage(false);
        setTargetLanguage(null);
      }, 250);
    }, 150);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
      if (language === "ar" || language === "ur") {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }
    }
  }, [language]);

  const currentOption =
    LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translationsMap[language] || translationsMap.en,
        currentOption,
        isChangingLanguage,
        isDetectingLanguage,
        targetLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
