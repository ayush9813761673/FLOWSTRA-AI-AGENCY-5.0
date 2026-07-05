import React from "react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../constants";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-[160px] pb-[80px] px-6 overflow-hidden">
      {/* Background Radial Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-[760px] w-full text-center relative z-10"
      >
        {/* Eyebrow badge */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--card-border)] bg-[var(--surface)] w-fit mx-auto mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--dot-active)]" />
          <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.2em] font-medium">
            AI Automation Systems for High-Growth Teams
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-[44px] md:text-[72px] font-bold tracking-tighter leading-[1.1] text-[var(--text-primary)] mb-6"
        >
          AI Automation That <br />
          <span className="opacity-60">Scales Your Pipeline</span> <br />
          Without Scaling Your Team
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp}
          className="text-base md:text-[18px] text-[var(--text-secondary)] leading-[1.7] max-w-[580px] mx-auto mb-10"
        >
          Flowstra builds custom automation systems that capture leads, qualify
          intent, sync your CRM, and trigger the right follow-up — so your team
          closes more without doing more.
        </motion.p>

        {/* CTA Button Row */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="https://cal.com/flowstra/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg)] font-semibold text-sm hover:bg-white transition-colors w-full sm:w-auto text-center"
          >
            Book a Call
          </a>
          <a
            href="#solutions"
            className="px-6 py-3 rounded-full bg-[var(--surface)] border border-[var(--card-border)] text-[var(--text-primary)] font-semibold text-sm hover:border-[var(--card-border-hover)] transition-colors w-full sm:w-auto text-center"
          >
            See What We Automate
          </a>
        </motion.div>

        {/* Helper text */}
        <motion.p
          variants={fadeUp}
          className="text-xs text-[var(--text-muted)] mb-8"
        >
          Best first step for mapping workflow gaps, qualification logic, and
          what should be automated first.
        </motion.p>

        {/* Feature pills row */}
        <motion.div
          variants={stagger}
          className="flex flex-col gap-3 items-center"
        >
          <div className="flex flex-wrap justify-center gap-2">
            <motion.span
              variants={fadeUp}
              className="px-4 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--surface)] text-[10px] uppercase font-medium tracking-wider text-[var(--text-secondary)]"
            >
              Built for High-Growth Sales Teams
            </motion.span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Lead Intake",
              "AI Qualification",
              "CRM Sync",
              "Smart Routing",
            ].map((pill) => (
              <motion.span
                key={pill}
                variants={fadeUp}
                className="px-4 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--surface)] text-[10px] uppercase font-medium tracking-wider text-[var(--text-secondary)]"
              >
                {pill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
