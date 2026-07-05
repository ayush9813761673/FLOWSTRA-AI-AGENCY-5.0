import React from "react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../constants";
import { GlowCard } from "./ui/spotlight-card";
import { Check } from "lucide-react";
import { HyperText } from "./ui/hyper-text";

const benefits = [
  "Custom AI workflow outline",
  "ROI & cost-saving analysis",
  "Implementation roadmap",
];

export function FinalCTA() {
  return (
    <section className="relative w-full py-32 md:py-48 mb-10 overflow-hidden flex flex-col items-center justify-center min-h-[800px] border-t border-[var(--card-border)]">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center pointer-events-none mt-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] mb-6 leading-tight drop-shadow-2xl">
            <HyperText
              text="Ready to See How Much More You Could Be Earning?"
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)]"
              containerClassName="justify-center"
            />
          </h2>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed font-medium drop-shadow-md"
          >
            Book a free strategy call and discover how AI can transform your lead generation
          </motion.p>
          
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
            <a
              href="https://cal.com/flowstra/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center justify-center px-10 py-5 text-lg font-bold text-black bg-white rounded-full shadow-[0_0_40px_8px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_12px_rgba(59,130,246,0.4)] hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto text-center hover:-translate-y-1"
            >
              Book a Call 
              <span className="ml-2 font-normal text-xl">→</span>
            </a>
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
