import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Gift, ArrowRight, CheckCircle2, Mail, Sparkles, BookOpen } from "lucide-react";

export function AutomationAuditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Prevent showing if already shown in this session
    const hasBeenShown = sessionStorage.getItem("automation_audit_shown");
    if (hasBeenShown === "true") return;

    let inactivityTimer: NodeJS.Timeout;

    const triggerModal = () => {
      const shown = sessionStorage.getItem("automation_audit_shown");
      if (shown !== "true") {
        setIsOpen(true);
        sessionStorage.setItem("automation_audit_shown", "true");
        cleanup();
      }
    };

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        triggerModal();
      }, 30000); // 30 seconds
    };

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrollPercent = (window.scrollY / scrollHeight) * 100;
        if (scrollPercent >= 50) {
          triggerModal();
        }
      }
    };

    // User interaction events to monitor inactivity
    const activityEvents = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];

    // Start monitoring
    resetInactivityTimer();
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });
    window.addEventListener("scroll", handleScroll);

    const cleanup = () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      window.removeEventListener("scroll", handleScroll);
    };

    return cleanup;
  }, []);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Helper trigger to reset the state for easy testing
  const resetForTesting = () => {
    sessionStorage.removeItem("automation_audit_shown");
    setIsOpen(true);
    setIsSubmitted(false);
    setEmail("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop with elegant blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#0c111d]/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-[540px] overflow-hidden rounded-[24px] border border-white/10 bg-[#0f172a] text-white shadow-2xl shadow-blue-500/10 p-8 md:p-10"
          >
            {/* Ambient background glow effect */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {!isSubmitted ? (
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
                  <Gift className="h-3.5 w-3.5" />
                  <span>Free Guide & Audit Checklist</span>
                </div>

                {/* Heading */}
                <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f5f9] to-[#cbd5e1] bg-clip-text text-transparent">
                  Get a Free Automation Audit
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-400">
                  Our comprehensive automation guide and checklist will help you identify up to 15+ hours of weekly manual work you can offload to AI and automation pipelines.
                </p>

                {/* Bullet benefits */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">The 5-Step AI Transition Blueprint</p>
                      <p className="text-xs text-slate-400">How to integrate AI systems into your current workflows without disruption.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Interactive Self-Audit Matrix</p>
                      <p className="text-xs text-slate-400">Score your operations and discover exactly which apps to connect first.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Bonus: Top 20 Automation Ideas for 2026</p>
                      <p className="text-xs text-slate-400">Ready-to-use recipes for CRM sync, leads generation, and customer service.</p>
                    </div>
                  </div>
                </div>

                {/* Capture Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your professional email"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Preparing Audit Blueprint...
                      </span>
                    ) : (
                      <>
                        <span>Get Free Guide & Audit checklist</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-center text-[11px] text-slate-500">
                  🔒 We value your privacy. No spam. Unsubscribe at any time.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-6"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <BookOpen className="h-8 w-8" />
                </div>

                <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
                  Blueprint Sent Successfully!
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-sm">
                  We have sent the **Free Automation Audit & Blueprint** to <span className="font-semibold text-blue-400">{email}</span>. Please check your inbox (including your promotions tab) in a minute.
                </p>

                <div className="mt-8 w-full border-t border-white/5 pt-6 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    <span>Bonus coupon code: FLOWSTRA20</span>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-[0.98]"
                  >
                    Go back to site
                  </button>
                </div>
              </motion.div>
            )}

            {/* Small manual trigger label in development to make it easy to verify/retest */}
            <div className="absolute bottom-2 right-4 text-[9px] text-slate-600 select-none">
              <button
                type="button"
                onClick={resetForTesting}
                className="hover:text-blue-400 hover:underline transition-colors focus:outline-none"
              >
                Reset trigger state
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
