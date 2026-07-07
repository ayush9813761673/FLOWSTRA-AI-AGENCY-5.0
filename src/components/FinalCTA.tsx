import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../constants";
import { GlowCard } from "./ui/spotlight-card";
import { Check, Calendar, ExternalLink } from "lucide-react";
import { HyperText } from "./ui/hyper-text";
import { initAuth, googleSignIn } from "../lib/workspaceAuth";

const benefits = [
  "Custom AI workflow outline",
  "ROI & cost-saving analysis",
  "Implementation roadmap",
];

export function FinalCTA() {
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
              Acquisition Enhancement
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              <HyperText text="Ready to See How Much More You Could Be Earning?" className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white inline-block" />
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-400 max-w-2xl mt-1.5 font-medium">
              Book a free strategy call and discover how AI can transform your lead generation.
            </p>
          </div>
          
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-16 max-w-3xl pointer-events-auto"
          >
            {benefits.map((text, i) => (
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
                <button
                  onClick={handleLiveCalendarBooking}
                  className="relative z-10 flex items-center justify-center px-8 py-4 text-sm font-bold text-black bg-white rounded-full shadow-[0_0_40px_8px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_12px_rgba(59,130,246,0.4)] hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto text-center hover:-translate-y-1 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 mr-2 text-blue-600 animate-pulse" />
                  <span>Book live in your Google Calendar</span>
                  <span className="ml-2 font-normal text-sm">→</span>
                </button>
              ) : (
                /* Unauthenticated state - option 1: Authorize and schedule directly */
                <button
                  onClick={handleSignInAndBook}
                  className="relative z-10 flex items-center justify-center px-8 py-4 text-sm font-bold text-black bg-white rounded-full shadow-[0_0_40px_8px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_12px_rgba(59,130,246,0.4)] hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto text-center hover:-translate-y-1 cursor-pointer border border-white/20"
                >
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Schedule in your Google Calendar</span>
                  <span className="ml-2 font-normal text-sm">→</span>
                </button>
              )}

              {/* Option 2: Fallback to external Cal.com link */}
              <a
                href="https://cal.com/flowstra/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all duration-300 w-full sm:w-auto text-center hover:-translate-y-1"
              >
                <span>Use external Cal.com link</span>
                <ExternalLink className="w-3.5 h-3.5 ml-2 text-slate-400" />
              </a>
            </div>

            <p className="text-sm md:text-base text-[var(--text-muted)] font-medium mt-4">
              or mail us at{" "}
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
            No credit card required · 100% free · Takes 2 minutes to book
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
