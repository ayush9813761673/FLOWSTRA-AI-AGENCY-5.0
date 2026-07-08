import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowUp, 
  ArrowDown, 
  Keyboard, 
  X, 
  Sparkles, 
  Calculator, 
  Music, 
  Home, 
  Milestone,
  HelpCircle,
  Calendar
} from "lucide-react";

const SECTIONS = [
  "hero",
  "case-studies",
  "testimonials",
  "tools",
  "features",
  "team",
  "calculator",
  "workspace-integration",
  "pricing",
  "final-cta"
];

const SECTION_INFO: Record<string, { title: string; badge: string }> = {
  "hero": { title: "Introduction & Identity", badge: "Hero" },
  "case-studies": { title: "Deep-Dive Case Studies", badge: "Case Studies" },
  "testimonials": { title: "What Our Clients Say", badge: "Testimonials" },
  "tools": { title: "Core Integrations & Tech", badge: "Integrations" },
  "features": { title: "Advanced Automation System", badge: "System" },
  "team": { title: "Our Elite Expert Team", badge: "Team" },
  "calculator": { title: "Interactive ROI Calculator", badge: "ROI Analysis" },
  "workspace-integration": { title: "Google Workspace Sandbox", badge: "Workspace" },
  "pricing": { title: "Scalable Pricing Plans", badge: "Pricing" },
  "final-cta": { title: "Strategy Session Booking", badge: "CTA" },
};

export function KeyboardNavigation() {
  const [hudSection, setHudSection] = useState<string | null>(null);
  const [showHud, setShowHud] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const activeSectionIndexRef = useRef<number>(0);
  const isKeyboardScrollingRef = useRef<boolean>(false);

  // Monitor scroll height to show shortcuts trigger button and update section tracking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }

      if (!isKeyboardScrollingRef.current) {
        const currentId = getCurrentSectionId();
        const index = SECTIONS.indexOf(currentId);
        if (index !== -1) {
          activeSectionIndexRef.current = index;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-hide the initial keyboard shortcut hint after 8 seconds
  useEffect(() => {
    const hintTimer = setTimeout(() => {
      setShowHint(false);
    }, 8000);
    return () => clearTimeout(hintTimer);
  }, []);

  const getCurrentSectionId = (): string => {
    const scrollPos = window.scrollY;
    const viewportHeight = window.innerHeight;
    const viewportCenter = scrollPos + viewportHeight / 2;
    
    let bestId = SECTIONS[0];
    let minDistance = Infinity;

    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollPos;
        const elementBottom = elementTop + rect.height;
        
        // If the viewport center is inside this section
        if (viewportCenter >= elementTop && viewportCenter <= elementBottom) {
          return id;
        }
        
        // Otherwise, closest to viewport center
        const elementCenter = elementTop + rect.height / 2;
        const distance = Math.abs(viewportCenter - elementCenter);
        if (distance < minDistance) {
          minDistance = distance;
          bestId = id;
        }
      }
    }
    
    return bestId;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard for input / form fields
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Close shortcuts help with Escape or K/?
      if (showShortcutsHelp && (e.key === "Escape" || key === "k" || e.key === "?")) {
        e.preventDefault();
        setShowShortcutsHelp(false);
        return;
      }

      // Hotkey Actions
      if (key === "a") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-automation-audit"));
        return;
      }
      if (key === "c") {
        e.preventDefault();
        const el = document.getElementById("calculator");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (key === "p") {
        e.preventDefault();
        const el = document.getElementById("pricing");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (key === "m") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("toggle-ambient-music"));
        return;
      }
      if (key === "h") {
        e.preventDefault();
        const el = document.getElementById("hero");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (key === "g") {
        e.preventDefault();
        const el = document.getElementById("workspace-integration");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (key === "k" || e.key === "?") {
        e.preventDefault();
        setShowShortcutsHelp(true);
        return;
      }

      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      
      // Intercept arrow key to scroll sections smoothly
      e.preventDefault();
      // Hide standard hint on first arrow press
      setShowHint(false);

      const currentIndex = activeSectionIndexRef.current;
      
      let targetIndex = currentIndex;
      let targetEl: HTMLElement | null = null;

      if (e.key === "ArrowDown") {
        // Find the next section in SECTIONS list that actually exists in the DOM
        for (let i = currentIndex + 1; i < SECTIONS.length; i++) {
          const el = document.getElementById(SECTIONS[i]);
          if (el) {
            targetEl = el;
            targetIndex = i;
            break;
          }
        }
      } else {
        // Find the previous section in SECTIONS list that actually exists in the DOM
        for (let i = currentIndex - 1; i >= 0; i--) {
          const el = document.getElementById(SECTIONS[i]);
          if (el) {
            targetEl = el;
            targetIndex = i;
            break;
          }
        }
      }

      if (targetEl) {
        const targetId = SECTIONS[targetIndex];
        setHudSection(targetId);
        setShowHud(true);
        
        activeSectionIndexRef.current = targetIndex;
        isKeyboardScrollingRef.current = true;

        const scrollTimeoutId = (window as any)._keyboardScrollTimeoutId;
        if (scrollTimeoutId) window.clearTimeout(scrollTimeoutId);
        (window as any)._keyboardScrollTimeoutId = window.setTimeout(() => {
          isKeyboardScrollingRef.current = false;
        }, 800);
        
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          setShowHud(false);
        }, 2200);

        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [showShortcutsHelp]);

  const info = hudSection ? SECTION_INFO[hudSection] : null;

  const shortcutsList = [
    { key: "A", label: "Operations Audit", desc: "Open free automation audit & guide modal", icon: Sparkles, color: "text-blue-400" },
    { key: "C", label: "ROI Calculator", desc: "Jump instantly to interactive business savings calculator", icon: Calculator, color: "text-emerald-400" },
    { key: "G", label: "Google Workspace", desc: "Jump instantly to Google Calendar & Gmail integration sandbox", icon: Calendar, color: "text-sky-400" },
    { key: "P", label: "Rates & Pricing", desc: "Jump instantly to scalable pricing plans", icon: Milestone, color: "text-indigo-400" },
    { key: "M", label: "Ambient Soundtrack", desc: "Play or pause ambient cinema sound effects", icon: Music, color: "text-rose-400" },
    { key: "H", label: "Home Identity", desc: "Jump back to top cinematic welcome banner", icon: Home, color: "text-amber-400" },
    { key: "↑ / ↓", label: "Step Navigation", desc: "Step smoothly through major website modules", icon: ArrowDown, color: "text-slate-400" },
    { key: "K / ?", label: "Toggle Dashboard", desc: "Show or hide this keyboard shortcuts index", icon: Keyboard, color: "text-pink-400" },
  ];

  return (
    <>
      {/* 1. Subtle Keyboard shortcut tip (Bottom-Left) */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-8 left-6 z-[9998] hidden md:flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_15px_rgba(59,130,246,0.05)] pointer-events-auto overflow-hidden group hover:border-blue-500/30 transition-all duration-300"
          >
            {/* Liquid highlight element inside */}
            <div className="absolute inset-0 z-0 pointer-events-none 
              shadow-[inset_1px_1px_0px_rgba(255,255,255,0.2),inset_-1px_-1px_0px_rgba(255,255,255,0.1)] 
              bg-white/[0.02] transition-all duration-300 group-hover:bg-blue-600/[0.02]" 
            />

            {/* Glowing blue ripple spot */}
            <div className="absolute -inset-1 rounded-xl bg-blue-500/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Keyboard className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <p className="text-xs text-zinc-300 font-medium">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white font-mono text-[10px]">K</kbd> for shortcuts
              </p>
              <button 
                onClick={() => setShowHint(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm ml-1 cursor-pointer font-semibold focus:outline-none transition-colors"
                title="Dismiss"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Keyboard shortcut launcher button (next to BackToTop button) */}
      <AnimatePresence>
        {hasScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
            onClick={() => setShowShortcutsHelp(true)}
            className="fixed bottom-8 right-20 md:right-24 z-[9999] p-3 rounded-full border border-white/25 text-white cursor-pointer select-none overflow-hidden transition-colors shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_15px_rgba(59,130,246,0.15)] group hover:border-blue-500/50 hover:bg-blue-600/10 active:scale-95 hidden md:block"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)'
            }}
            title="Keyboard Shortcuts Guide"
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
              <Keyboard className="h-5 w-5 text-slate-200 transition-transform duration-300 group-hover:scale-105 group-hover:text-blue-400" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 3. Premium visual snapping HUD overlay */}
      <AnimatePresence>
        {showHud && info && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-1 w-full max-w-xs md:max-w-md px-4 pointer-events-none select-none"
          >
            <div 
              className="flex items-center gap-4 px-5 py-3.5 w-full rounded-2xl border border-blue-500/30 bg-zinc-950/90 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(59,130,246,0.1)]"
              style={{
                boxShadow: "0 20px 45px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.15)"
              }}
            >
              {/* Keyboard visual feedback */}
              <div className="flex flex-col items-center justify-center gap-1 shrink-0 bg-blue-950/40 border border-blue-500/20 rounded-xl p-2.5 w-12 h-12">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded bg-blue-500/30" />
                  <ArrowUp className="w-3.5 h-3.5 text-blue-400/60" />
                  <div className="w-2 h-2 rounded bg-blue-500/30" />
                </div>
                <ArrowDown className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
              </div>

              {/* Section Details */}
              <div className="flex flex-col text-left overflow-hidden">
                <span className="inline-flex items-center text-[10px] font-extrabold text-blue-400 uppercase tracking-widest bg-blue-950/50 border border-blue-500/20 px-2 py-0.5 rounded-full w-max">
                  {info.badge}
                </span>
                <span className="text-sm md:text-base font-bold text-white tracking-tight mt-1 truncate">
                  {info.title}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Power User Keyboard Shortcuts Overlay Dashboard */}
      <AnimatePresence>
        {showShortcutsHelp && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop with gorgeous blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShortcutsHelp(false)}
              className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8 shadow-2xl overflow-hidden"
              style={{
                boxShadow: "0 25px 70px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.1)"
              }}
            >
              {/* Decorative dynamic ambient glows */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/15 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
                title="Close shortcuts menu"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Power User Keyboard Shortcuts
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Press these hotkeys anytime to zip around the interface.
                  </p>
                </div>
              </div>

              {/* Shortcuts List */}
              <div className="space-y-3 relative z-10 max-h-[380px] overflow-y-auto pr-1">
                {shortcutsList.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div 
                      key={item.key}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 ${item.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white tracking-tight leading-none mb-0.5">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-zinc-400 leading-normal">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Key badge */}
                      <kbd className="px-2.5 py-1 rounded-lg border border-white/20 bg-white/5 text-white font-mono text-xs font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] select-none shrink-0 min-w-[2.5rem] text-center">
                        {item.key}
                      </kbd>
                    </div>
                  );
                })}
              </div>

              {/* Footer advice */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Created for extreme speed & accessibility</span>
                <span>Press <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-zinc-400 font-mono text-[9px] font-bold">ESC</kbd> to exit</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
