import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../constants";
import { GlowCard } from "./ui/spotlight-card";
import { Check, Calendar, ExternalLink } from "lucide-react";
import { HyperText } from "./ui/hyper-text";
import { initAuth, googleSignIn } from "../lib/workspaceAuth";
import { useLanguage } from "@/context/LanguageContext";
import { MagneticButton } from "./ui/magnetic-button";

export function FinalCTA() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLiveCalendarBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("workspace-integration");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("highlight-calendar-scheduler"));
      }, 800);
    }
  };

  const handleSignInAndBook = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        // Scroll to the scheduling card!
        const el = document.getElementById("workspace-integration");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("highlight-calendar-scheduler"));
          }, 800);
        }
      }
    } catch (err) {
      console.error("Auth sign in for final call booking failed:", err);
    }
  };

  return (
    <section id="final-cta" className="relative w-full py-32 md:py-48 mb-10 overflow-hidden flex flex-col items-center justify-center min-h-[800px] border-t border-[var(--card-border)]">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center pointer-events-none mt-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <div className="flex flex-col gap-3 max-w-3xl items-center text-center mx-auto mb-10">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 font-mono">
              {t.finalCta.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
              <HyperText text={t.finalCta.title} className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] inline-block" />
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[var(--text-secondary)] max-w-2xl mt-1.5 font-medium">
              {t.finalCta.description}
            </p>
          </div>
          
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-16 max-w-3xl pointer-events-auto"
          >
            {[t.finalCta.benefit1, t.finalCta.benefit2, t.finalCta.benefit3].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-left"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--card-border)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/50">
                  <Check className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                </div>
                <span className="text-sm md:text-base font-medium text-[var(--text-primary)] drop-shadow-md">
                  {text}
                </span>
              </div>
            ))}
          </motion.div>
          
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center gap-6 mb-4 w-full pointer-events-auto"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              {user ? (
                /* Authenticated User state - Schedule live in Google Calendar */
                <MagneticButton
                  onClick={handleLiveCalendarBooking}
                  className="relative z-10 flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-900 bg-white rounded-full shadow-[0_0_40px_8px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_14px_rgba(59,130,246,0.45)] hover:bg-slate-50 transition-shadow duration-300 w-full sm:w-auto text-center cursor-pointer border border-white/40"
                >
                  <Calendar className="w-4 h-4 mr-2 text-blue-600 animate-pulse" />
                  <span>{t.finalCta.bookCal}</span>
                  <span className="ml-2 font-normal text-sm">→</span>
                </MagneticButton>
              ) : (
                /* Unauthenticated state - option 1: Authorize and schedule directly */
                <MagneticButton
                  onClick={handleSignInAndBook}
                  className="relative z-10 flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-900 bg-white rounded-full shadow-[0_0_40px_8px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_14px_rgba(59,130,246,0.45)] hover:bg-slate-50 transition-shadow duration-300 w-full sm:w-auto text-center cursor-pointer border border-white/40"
                >
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{t.finalCta.scheduleDirect}</span>
                  <span className="ml-2 font-normal text-sm">→</span>
                </MagneticButton>
              )}

              {/* Option 2: Fallback to external Cal.com link */}
              <a
                href="https://cal.com/flowstra/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all duration-300 w-full sm:w-auto text-center hover:-translate-y-0.5"
              >
                <span>Cal.com</span>
                <ExternalLink className="w-3.5 h-3.5 ml-2 text-slate-400" />
              </a>
            </div>

            <p className="text-sm md:text-base text-[var(--text-muted)] font-medium mt-4">
              {t.finalCta.orMail}{" "}
              <a
                href="mailto:contact@flowstra.org"
                className="text-[var(--text-primary)] hover:underline"
              >
                contact@flowstra.org
              </a>
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-xs md:text-sm text-[var(--text-muted)] font-medium mt-8"
          >
            {t.finalCta.noCardNeeded}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
