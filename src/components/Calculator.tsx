import React, { useState } from "react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../constants";
import { GlowCard } from "./ui/spotlight-card";
import { WebGLShader } from "./ui/web-gl-shader";
import { HyperText } from "./ui/hyper-text";
import { useLanguage } from "@/context/LanguageContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export function Calculator() {
  const { t } = useLanguage();

  const [leads, setLeads] = useState<number>(200);
  const [dealValue, setDealValue] = useState<number>(5000);
  const [closeRate, setCloseRate] = useState<number>(8); // percentage
  const [chartMode, setChartMode] = useState<"cumulative" | "monthly">("cumulative");
  const [animationKey, setAnimationKey] = useState<number>(0);

  const handleInputComplete = () => {
    setAnimationKey((prev) => prev + 1);
  };

  // Internal calculations based on Flowstra's value proposition
  // Assuming Flowstra improves close rate by ~2.5x (from user's text)
  const improvedCloseRate = closeRate * 2.5;

  const currentRevenue = Math.round(leads * (closeRate / 100) * dealValue);
  const projectedRevenue = Math.round(
    leads * (improvedCloseRate / 100) * dealValue,
  );
  const leakingRevenue = projectedRevenue - currentRevenue;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      name: `Mo ${month}`,
      Current: currentRevenue,
      Projected: projectedRevenue,
      Additional: projectedRevenue - currentRevenue,
    };
  });

  const cumulativeData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      name: `Mo ${month}`,
      Current: currentRevenue * month,
      Projected: projectedRevenue * month,
      Additional: (projectedRevenue - currentRevenue) * month,
    };
  });

  const activeData = chartMode === "cumulative" ? cumulativeData : monthlyData;
  const gain6Month = (projectedRevenue - currentRevenue) * 6;
  const gain12Month = (projectedRevenue - currentRevenue) * 12;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const modeLabel = chartMode === "cumulative" ? "Cumulative" : "Monthly";
      return (
        <div className="bg-[var(--surface)] border border-[var(--card-border)] p-4 rounded-xl shadow-xl backdrop-blur-md text-[var(--text-primary)]">
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">{payload[0].payload.name}</p>
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between gap-6">
              <span className="text-[var(--text-muted)]">Current {modeLabel}:</span>
              <span className="font-bold text-[var(--text-secondary)]">
                {formatCurrency(payload[0].payload.Current)}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-[var(--accent-blue)]">Projected {modeLabel}:</span>
              <span className="font-bold text-blue-500">
                {formatCurrency(payload[0].payload.Projected)}
              </span>
            </div>
            <div className="flex justify-between gap-6 border-t border-[var(--card-border)] mt-1 pt-1">
              <span className="text-emerald-500 font-medium">Net Value Saved:</span>
              <span className="font-bold text-emerald-500">
                {formatCurrency(payload[0].payload.Additional)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="calculator" className="relative py-24 px-6 overflow-hidden border-y border-[var(--card-border)] bg-[var(--surface)]/30 mt-16 pb-32">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col gap-16"
        >
        <div className="flex flex-col gap-3 max-w-3xl items-center text-center mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-500 font-mono">
            {t.calculator.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
            <HyperText text={t.calculator.title} className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] inline-block" />
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-[var(--text-secondary)] max-w-2xl mt-1.5 font-medium">
            {t.calculator.description}
          </p>
        </div>

        <motion.div variants={fadeUp}>
          <GlowCard
            customSize
            className="w-full flex flex-col rounded-2xl overflow-hidden border border-[var(--card-border)] relative z-0 bg-[var(--surface)]/90 backdrop-blur-md shadow-2xl"
          >
            <WebGLShader />
            <div className="flex flex-col lg:flex-row w-full relative z-10 bg-transparent">
              {/* Input Section */}
              <div className="w-full lg:w-1/2 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] bg-[var(--surface)]/40 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-8">
                  {t.calculator.yourNumbers}
                </h3>

                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-[var(--text-secondary)]">
                        {t.calculator.leadsPerMonth}
                      </label>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {leads}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={leads}
                      onChange={(e) => setLeads(Number(e.target.value))}
                      onMouseUp={handleInputComplete}
                      onTouchEnd={handleInputComplete}
                      className="w-full h-2 bg-[var(--card-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-blue)] relative z-50 pointer-events-auto"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-[var(--text-secondary)]">
                        {t.calculator.avgDealValue}
                      </label>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        ${dealValue.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="25000"
                      step="100"
                      value={dealValue}
                      onChange={(e) => setDealValue(Number(e.target.value))}
                      onMouseUp={handleInputComplete}
                      onTouchEnd={handleInputComplete}
                      className="w-full h-2 bg-[var(--card-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-blue)] relative z-50 pointer-events-auto"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-[var(--text-secondary)]">
                        {t.calculator.currentCloseRate}
                      </label>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {closeRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={closeRate}
                      onChange={(e) => setCloseRate(Number(e.target.value))}
                      onMouseUp={handleInputComplete}
                      onTouchEnd={handleInputComplete}
                      className="w-full h-2 bg-[var(--card-border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-blue)] relative z-50 pointer-events-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-[var(--surface)]/40 backdrop-blur-sm relative overflow-hidden z-0">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent-blue)] rounded-full blur-[100px] opacity-10 pointer-events-none z-0"></div>

                <div className="flex flex-col gap-8 relative z-10 pointer-events-none">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      {t.calculator.currentRevenue}
                    </p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">
                      {formatCurrency(currentRevenue)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 border-l-2 border-[var(--text-muted)] pl-4">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      {t.calculator.revenueLeaking}
                    </p>
                    <p className="text-3xl font-semibold text-rose-500">
                      {formatCurrency(leakingRevenue)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t border-[var(--card-border)]">
                    <p className="text-sm font-medium text-[var(--accent-blue)] uppercase tracking-wider">
                      {t.calculator.projectedWithFlowstra}
                    </p>
                    <div className="flex items-end gap-3 flex-wrap">
                      <p className="text-4xl lg:text-5xl font-bold text-[var(--text-primary)]">
                        {formatCurrency(projectedRevenue)}
                      </p>
                      <span className="inline-block px-3 py-1 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] text-sm font-bold rounded-full mb-1">
                        2.5x ROI
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Charts & Milestones Section */}
            <div className="w-full border-t border-[var(--card-border)] p-8 lg:p-12 flex flex-col items-center justify-center relative z-10 bg-[var(--surface)]/20">
              <div className="w-full max-w-4xl flex flex-col gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{t.calculator.milestonesTitle}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{t.calculator.milestonesDesc}</p>
                </div>

                {/* Milestone Summary Cards */}
                <motion.div
                  key={`milestones-${animationKey}`}
                  initial={{ opacity: 0.3, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
                >
                  <div className="p-6 rounded-xl border border-[var(--card-border)] bg-[var(--surface)]/60 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 p-3 text-xs font-mono text-blue-500 bg-blue-500/10 rounded-bl-lg">6-Month Mark</div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">{t.calculator.recovered6Mo}</p>
                    <p className="text-3xl font-bold text-emerald-500 mt-2 filter drop-shadow-[0_0_8px_rgba(74,222,128,0.25)]">
                      +{formatCurrency(gain6Month)}
                    </p>
                    <div className="text-xs text-[var(--text-secondary)] mt-3 flex justify-between border-t border-[var(--card-border)] pt-3">
                      <span>Current: {formatCurrency(currentRevenue * 6)}</span>
                      <span className="text-blue-500 font-semibold">Flowstra: {formatCurrency(projectedRevenue * 6)}</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl border border-[var(--card-border)] bg-[var(--surface)]/60 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 p-3 text-xs font-mono text-blue-500 bg-blue-500/10 rounded-bl-lg">12-Month Mark</div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">{t.calculator.recovered12Mo}</p>
                    <p className="text-3xl font-bold text-blue-500 mt-2 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.35)]">
                      +{formatCurrency(gain12Month)}
                    </p>
                    <div className="text-xs text-[var(--text-secondary)] mt-3 flex justify-between border-t border-[var(--card-border)] pt-3">
                      <span>Current: {formatCurrency(currentRevenue * 12)}</span>
                      <span className="text-blue-500 font-semibold">Flowstra: {formatCurrency(projectedRevenue * 12)}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Chart Card */}
                <motion.div
                  key={`chart-${animationKey}`}
                  initial={{ opacity: 0.2, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
                  className="w-full bg-[var(--surface)]/60 p-6 rounded-xl border border-[var(--card-border)] relative z-20 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-30">
                    <div>
                      <h4 className="text-lg font-semibold text-[var(--text-primary)]">{t.calculator.chartTitle}</h4>
                      <p className="text-xs text-[var(--text-secondary)]">{t.calculator.chartDesc}</p>
                    </div>
                    <div className="flex bg-[var(--card-border)] p-0.5 rounded-lg border border-[var(--card-border)] relative z-50 pointer-events-auto">
                      <button
                        type="button"
                        onClick={() => setChartMode("cumulative")}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 pointer-events-auto cursor-pointer ${
                          chartMode === "cumulative"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {t.calculator.cumulative}
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartMode("monthly")}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 pointer-events-auto cursor-pointer ${
                          chartMode === "monthly"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {t.calculator.monthly}
                      </button>
                    </div>
                  </div>

                  <div className="h-72 w-full text-xs relative z-10" style={{ minHeight: "288px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                          </linearGradient>
                          <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 170, 200, 0.15)" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="var(--text-muted)" 
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis 
                          stroke="var(--text-muted)" 
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                          tickFormatter={(v) => `${(v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)}`}
                        />
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 1 }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Area 
                          name="Current Trajectory" 
                          type="monotone" 
                          dataKey="Current" 
                          stroke="#94a3b8" 
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          fillOpacity={1} 
                          fill="url(#colorCurrent)" 
                        />
                        <Area 
                          name="With Flowstra AI" 
                          type="monotone" 
                          dataKey="Projected" 
                          stroke="#3b82f6" 
                          strokeWidth={2.5}
                          fillOpacity={1} 
                          fill="url(#colorProjected)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="w-full border-t border-[var(--card-border)] p-8 lg:p-12 flex flex-col items-center justify-center text-center relative z-10">
              <a
                href="https://cal.com/flowstra/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-50 inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 hover:-translate-y-1 pointer-events-auto cursor-pointer"
              >
                {t.calculator.ctaButton}
              </a>
              <p className="text-sm font-semibold text-[var(--text-secondary)] mt-6">
                {t.calculator.ctaSubtitle}
              </p>
            </div>
          </GlowCard>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
}
