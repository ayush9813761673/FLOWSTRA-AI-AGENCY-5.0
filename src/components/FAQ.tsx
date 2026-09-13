"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, Sparkles, ArrowRight, ShieldCheck, Clock, Zap, CheckCircle2 } from "lucide-react";
import { fadeUp, stagger } from "@/constants";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Implementation" | "Security" | "Pricing";
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "how-it-works",
    category: "General",
    question: "How does Flowstra actually work?",
    answer:
      "We map out your repetitive manual bottlenecks (such as copy-pasting lead data, manual email follow-ups, or routing inquiries) and engineer custom, self-operating workflows that connect your CRM, email, and calendars. You don't replace your current tools — we make them communicate seamlessly without human intervention.",
  },
  {
    id: "target-businesses",
    category: "General",
    question: "What types of businesses get the highest ROI from Flowstra?",
    answer:
      "Growing service businesses, agencies, B2B consultancies, real estate firms, and high-volume sales teams that handle at least 30 leads per month or spend 10+ hours a week on manual operational admin get the fastest, highest ROI.",
  },
  {
    id: "timeline",
    category: "Implementation",
    question: "How long does a typical implementation take?",
    answer:
      "Our standard automation sprint delivers fully built, thoroughly tested, and live workflows within 7 to 14 business days. We begin with a 24-hour architecture blueprint so you see the exact logic before any code is deployed.",
  },
  {
    id: "technical-skills",
    category: "Implementation",
    question: "Do I or my team need any technical knowledge?",
    answer:
      "Zero. We deliver 100% turnkey systems complete with video walkthroughs, documentation, and handover training. If your team ever wants to adjust a workflow, our ongoing support team handles the adjustments for you.",
  },
  {
    id: "security",
    category: "Security",
    question: "How secure is my business and customer data?",
    answer:
      "We build directly within your own authorized accounts (Google Workspace, HubSpot, Salesforce, Slack) using official OAuth 2.0 protocols and enterprise-grade 256-bit encryption. We never store, sell, or train public AI models on your private customer data.",
  },
  {
    id: "integrations",
    category: "General",
    question: "What tools and software can Flowstra integrate with?",
    answer:
      "We integrate with Google Workspace (Gmail, Calendar, Sheets, Docs), Microsoft 365, HubSpot, Salesforce, Airtable, Notion, Stripe, Slack, Calendly, Cal.com, Make.com, Zapier, WhatsApp Business, and custom REST/GraphQL APIs.",
  },
  {
    id: "pricing-model",
    category: "Pricing",
    question: "How is Flowstra priced? Are there setup fees?",
    answer:
      "We operate on transparent, fixed-scope sprint pricing based on the exact workflows you need automated. You receive a clear, upfront quote before work begins — no surprise hourly billing or hidden maintenance fees.",
  },
  {
    id: "after-blueprint",
    category: "Implementation",
    question: "What happens after I request an Automation Blueprint?",
    answer:
      "Our lead systems architect reviews your current workflows, identifies your top 3 highest-ROI automation opportunities, and delivers a 1-page system architecture diagram within 24 hours outlining the exact time and dollar savings.",
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>("how-it-works");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "General", "Implementation", "Security", "Pricing"];

  const filteredFAQs = activeCategory === "All"
    ? FAQ_DATA
    : FAQ_DATA.filter((item) => item.category === activeCategory);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative py-24 px-6 max-w-5xl mx-auto overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" 
        aria-hidden="true" 
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--surface)]/90 backdrop-blur-md mb-4 shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-500 font-mono">
            Answers & Clarity
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-10"
        >
          Everything you need to know about our custom automation sprints, implementation timelines, and data security standards.
        </motion.p>

        {/* Category Pills */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-105"
                  : "bg-[var(--surface)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-blue-500/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="w-full space-y-3 text-left">
          {filteredFAQs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-blue-500/40 bg-[var(--surface)] shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20"
                    : "border-[var(--card-border)] bg-[var(--surface)]/70 hover:border-[var(--card-border-hover)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer gap-4 group select-none"
                >
                  <span className={`text-sm sm:text-base font-semibold transition-colors ${
                    isOpen ? "text-blue-500 dark:text-blue-400" : "text-[var(--text-primary)] group-hover:text-blue-500"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-blue-500/10 text-blue-500" : "bg-[var(--surface-hover)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--card-border)]/50 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Fast Action Prompt */}
        <motion.div
          variants={fadeUp}
          className="mt-12 p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--surface)]/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 w-full"
        >
          <div className="text-left">
            <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Have a custom workflow not listed here?
            </h4>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Talk directly with our lead architect on a 30-minute strategy call.
            </p>
          </div>
          <a
            href="https://cal.com/flowstra/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition-all duration-200 shadow-md shadow-blue-600/30 flex items-center gap-1.5"
          >
            <span>Book a 30-Min Call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
