import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, CheckCircle2, ArrowRight, Clock, ShieldCheck, Mail } from "lucide-react";

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if the modal has been shown during this session
    const hasBeenShown = sessionStorage.getItem("exit_intent_shown");
    if (hasBeenShown === "true") return;

    // 1. Mouse exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if mouse moves out of the top of the window
      if (e.clientY <= 20) {
        triggerModal();
      }
    };

    // 2. Backup timer trigger (appears after 45 seconds of page view anyway)
    const backupTimer = setTimeout(() => {
      triggerModal();
    }, 45000);

    const triggerModal = () => {
      const shown = sessionStorage.getItem("exit_intent_shown");
      if (shown !== "true") {
        setIsOpen(true);
        sessionStorage.setItem("exit_intent_shown", "true");
        // Clear backup timer since we are showing it
        clearTimeout(backupTimer);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(backupTimer);
    };
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

  // Disable background scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulate an API request with an elegant delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Quick reset for testing so users/reviewers can test it easily if needed
  const resetForTesting = () => {
    sessionStorage.removeItem("exit_intent_shown");
    setIsOpen(true);
    setIsSubmitted(false);
    setEmail("");
  };

  return (
    <>
      {/* Tiny developer helper badge at bottom-left corner of screen (low opacity, hover to see clearly) */}
      <div className="fixed bottom-4 left-4 z-40 opacity-20 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
        <button
          onClick={resetForTesting}
          className="px-3 py-1.5 text-[10px] font-mono tracking-wider bg-zinc-900/90 text-zinc-400 border border-zinc-800 rounded-md hover:text-white hover:border-zinc-700 transition-all flex items-center gap-1.5 shadow-xl"
          title="Reset session so the Exit-Intent Modal can trigger again"
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Reset Exit Modal</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div data-is-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950 p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.05)] text-zinc-50 z-10"
            >
              {/* Top glowing neon element */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-32 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 rounded-full border border-zinc-800/50 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/60 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {!isSubmitted ? (
                <div className="space-y-6">
                  {/* Highlight Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/45 border border-emerald-500/20 text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Exclusive Free Offer</span>
                  </div>

                  {/* Header */}
                  <div className="space-y-2.5">
                    <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                      Wait! Don't leave your operations on manual.
                    </h3>
                    <p className="text-base text-zinc-400 leading-relaxed">
                      Before you go, secure a <strong className="text-emerald-400 font-semibold">Free 15-Minute Automation Audit</strong> for your business. We'll identify manual bottlenecks and hand you a custom deployment blueprint <span className="text-zinc-500 line-through">($499 value)</span>.
                    </p>
                  </div>

                  {/* Features / Benefits list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">Custom Roadmap</p>
                        <p className="text-xs text-zinc-400">Tailored to your industry CRM / tools.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">Immediate ROI Estimates</p>
                        <p className="text-xs text-zinc-400">Calculate actual hours and cash saved.</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Form */}
                  <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="Enter your professional email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm md:text-base shadow-inner"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl font-bold text-sm md:text-base text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_12px_24px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-zinc-950" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Preparing Your Roadmap...</span>
                        </>
                      ) : (
                        <>
                          <span>Claim My Free Roadmap & Audit</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Trust indicator */}
                  <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 pt-2 border-t border-zinc-900">
                    <ShieldCheck className="w-4 h-4 text-zinc-500" />
                    <span>No spam. Instant setup instructions sent to inbox.</span>
                  </div>
                </div>
              ) : (
                /* Success State */
                <div className="text-center space-y-6 py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 mb-2">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-extrabold tracking-tight text-white">
                      Your audit is locked in!
                    </h3>
                    <p className="text-base text-zinc-400 max-w-md mx-auto leading-relaxed">
                      We've sent a confirmation email to <span className="text-emerald-400 font-semibold">{email}</span>. One of our lead automation engineers will reach out within 24 hours to schedule your session.
                    </p>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-blue)]">
                      Bonus Included
                    </p>
                    <p className="text-sm font-semibold text-white">
                      Top 10 CRM Webhooks Checklist (PDF)
                    </p>
                    <p className="text-xs text-zinc-400">
                      Sent automatically to your email to help you start mapping your triggers today.
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="px-6 py-3 rounded-xl font-bold text-xs md:text-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    Back to Flowstra
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
