"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Clock, Zap, BarChart3 } from "lucide-react";

interface StatItemProps {
  label: string;
  initialValue: number;
  incrementMin: number;
  incrementMax: number;
  intervalMs: number;
  icon: React.ComponentType<any>;
  prefix?: string;
  suffix?: string;
  glowColor: string;
  isDecimal?: boolean;
}

function StatCard({
  label,
  initialValue,
  incrementMin,
  incrementMax,
  intervalMs,
  icon: Icon,
  prefix = "",
  suffix = "",
  glowColor,
  isDecimal = false,
}: StatItemProps) {
  const [val, setVal] = useState(initialValue);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const increment = isDecimal
        ? parseFloat((Math.random() * (incrementMax - incrementMin) + incrementMin).toFixed(1))
        : Math.floor(Math.random() * (incrementMax - incrementMin + 1)) + incrementMin;
      
      setVal((prev) => {
        const nextVal = prev + increment;
        return isDecimal ? parseFloat(nextVal.toFixed(1)) : nextVal;
      });
      
      setPulsing(true);
      const pulseTimeout = setTimeout(() => setPulsing(false), 800);
      return () => clearTimeout(pulseTimeout);
    }, intervalMs + Math.random() * 500); // add subtle jitter

    return () => clearInterval(timer);
  }, [incrementMin, incrementMax, intervalMs, isDecimal]);

  const formattedNum = isDecimal
    ? val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : Math.floor(val).toLocaleString();

  return (
    <div 
      className="relative flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-slate-950/60 group"
      style={{
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 12px ${glowColor}`,
      }}
    >
      {/* Decorative ambient background glow */}
      <div 
        className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl opacity-15 transition-opacity duration-500 group-hover:opacity-30"
        style={{ backgroundColor: glowColor.replace("0.15", "0.6") }}
      />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
          {label}
        </span>
        <div 
          className="p-2 rounded-xl border border-white/5 bg-white/[0.03] text-slate-400 group-hover:text-white transition-all duration-300"
          style={{
            borderColor: pulsing ? glowColor : "rgba(255, 255, 255, 0.05)",
            boxShadow: pulsing ? `0 0 15px ${glowColor}` : "none",
          }}
        >
          <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>

      <div className="relative z-10 flex items-baseline gap-1 mt-1">
        <span className="text-zinc-500 font-medium text-lg mr-0.5 select-none">{prefix}</span>
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono select-all">
          {formattedNum}
        </span>
        <span className="text-zinc-400 font-medium text-xs ml-1 select-none">{suffix}</span>

        {/* Live Indicator Dot */}
        <span className="absolute -top-1 -right-4 flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulsing ? "bg-green-400" : "bg-blue-400"}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${pulsing ? "bg-green-500" : "bg-blue-500"}`} />
        </span>
      </div>

      {/* Tiny live activity text */}
      <div className="mt-3 text-[9px] font-mono text-slate-500 flex items-center gap-1 relative z-10">
        <span className={`inline-block w-1 h-1 rounded-full ${pulsing ? "bg-green-400 animate-pulse" : "bg-slate-600"}`} />
        <span>{pulsing ? "Syncing metrics..." : "Live automation metrics"}</span>
      </div>
    </div>
  );
}

export function SocialProofCounters() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 pb-20 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Automations Deployed"
          initialValue={1482}
          incrementMin={1}
          incrementMax={2}
          intervalMs={4500}
          icon={Zap}
          suffix="+"
          glowColor="rgba(59, 130, 246, 0.15)"
        />
        <StatCard
          label="Hours of Work Saved"
          initialValue={24192.4}
          incrementMin={0.1}
          incrementMax={0.3}
          intervalMs={1500}
          icon={Clock}
          suffix=" hrs"
          isDecimal={true}
          glowColor="rgba(16, 185, 129, 0.15)"
        />
        <StatCard
          label="Active API Actions"
          initialValue={8241920}
          incrementMin={15}
          incrementMax={45}
          intervalMs={900}
          icon={Cpu}
          glowColor="rgba(168, 85, 247, 0.15)"
        />
        <StatCard
          label="Estimated Client ROI"
          initialValue={14821400}
          incrementMin={25}
          incrementMax={75}
          intervalMs={3000}
          icon={BarChart3}
          prefix="$"
          glowColor="rgba(245, 158, 11, 0.15)"
        />
      </div>
    </section>
  );
}
