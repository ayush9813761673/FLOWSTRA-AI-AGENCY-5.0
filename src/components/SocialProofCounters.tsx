"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function SocialProofCounters() {
  const { t } = useLanguage();

  const metrics = [
    {
      value: "1,400+",
      label: t.counters.automationsDeployed,
      sublabel: "Across 40+ production stacks",
    },
    {
      value: "24,000+",
      suffix: t.counters.hrs,
      label: t.counters.hoursSaved,
      sublabel: "Manual operations eliminated",
    },
    {
      value: "99.8%",
      label: "Execution Precision",
      sublabel: "Verified pipeline reliability",
    },
    {
      value: "7 Days",
      label: "Deployment Sprint",
      sublabel: "Zero disruption to existing tools",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-6">
      <div className="py-12 border-y border-[var(--card-border)] grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-center">
        {metrics.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center">
            <div className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-[var(--text-primary)] font-mono leading-none">
              {item.value}
              {item.suffix && (
                <span className="text-xs sm:text-sm font-sans font-medium text-[var(--text-muted)] ml-1">
                  {item.suffix}
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mt-3">
              {item.label}
            </div>
            <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-1 font-normal">
              {item.sublabel}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
