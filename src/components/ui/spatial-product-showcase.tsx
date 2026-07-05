"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  TrendingUp,
  Target,
  Banknote,
  Clock,
  Briefcase,
  Layers,
  HeartHandshake,
  Bot,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

export type ProductId = "performance" | "scale";

export interface FeatureMetric {
  label: string;
  detail: string;
  displayValue: string;
  progress: number; // 0-100
  icon: LucideIcon;
}

export interface ProductData {
  id: ProductId;
  label: string;
  title: string;
  description: string;
  image: string;
  colors: {
    gradient: string;
    glow: string;
    ring: string;
  };
  stats: {
    connectionStatus: string;
  };
  features: FeatureMetric[];
}

const PRODUCT_DATA: Record<ProductId, ProductData> = {
  performance: {
    id: "performance",
    label: "Performance",
    title: "Revenue & Growth",
    description:
      "Our AI-powered systems deliver measurable impact across all revenue-driven metrics that matter.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=800",
    colors: {
      gradient: "from-blue-600 to-indigo-900",
      glow: "bg-blue-500",
      ring: "border-l-blue-500/50",
    },
    stats: { connectionStatus: "Optimizing Funnels" },
    features: [
      {
        label: "More Qualified Leads",
        detail: "Average increase across all clients",
        displayValue: "3X",
        progress: 95,
        icon: Target,
      },
      {
        label: "Sales Growth",
        detail: "For online businesses",
        displayValue: "+72%",
        progress: 72,
        icon: TrendingUp,
      },
      {
        label: "In Closed Deals",
        detail: "Rs. 86 Lakhs generated",
        displayValue: "86L",
        progress: 86,
        icon: Banknote,
      },
      {
        label: "Avg. ROI Time",
        detail: "Fastest return on investment",
        displayValue: "45 Days",
        progress: 80,
        icon: Clock,
      },
    ],
  },
  scale: {
    id: "scale",
    label: "Scale",
    title: "Operations & Reach",
    description:
      "Scaling operations seamlessly while building long-term partnerships and automating tasks 24/7.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=800",
    colors: {
      gradient: "from-emerald-600 to-teal-900",
      glow: "bg-emerald-500",
      ring: "border-r-emerald-500/50",
    },
    stats: { connectionStatus: "System Active" },
    features: [
      {
        label: "Businesses Impacted",
        detail: "With our AI solutions",
        displayValue: "31+",
        progress: 75,
        icon: Briefcase,
      },
      {
        label: "Businesses Scaled",
        detail: "Scaling operations seamlessly",
        displayValue: "150+",
        progress: 90,
        icon: Layers,
      },
      {
        label: "Client Retention",
        detail: "Long-term partnerships build growth",
        displayValue: "98%",
        progress: 98,
        icon: HeartHandshake,
      },
      {
        label: "AI Working",
        detail: "Automated systems never sleep",
        displayValue: "24/7",
        progress: 100,
        icon: Bot,
      },
    ],
  },
};

const ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  item: {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: { opacity: 0, y: -10, filter: "blur(5px)" },
  },
  image: (isLeft: boolean): Variants => ({
    initial: {
      opacity: 0,
      scale: 1.5,
      filter: "blur(15px)",
      rotate: isLeft ? -30 : 30,
      x: isLeft ? -80 : 80,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      rotate: 0,
      x: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      filter: "blur(20px)",
      transition: { duration: 0.25 },
    },
  }),
};

const BackgroundGradient = ({ isLeft }: { isLeft: boolean }) => (
  <div className="absolute inset-0 pointer-events-none">
    <motion.div
      animate={{
        background: isLeft
          ? "radial-gradient(circle at 0% 50%, rgba(59, 130, 246, 0.15), transparent 50%)"
          : "radial-gradient(circle at 100% 50%, rgba(16, 185, 129, 0.15), transparent 50%)",
      }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    />
  </div>
);

const ProductVisual = ({
  data,
  isLeft,
}: {
  data: ProductData;
  isLeft: boolean;
}) => (
  <motion.div layout="position" className="relative group shrink-0">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className={`absolute inset-[-20%] rounded-full border border-dashed border-white/10 ${data.colors.ring}`}
    />
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute inset-0 rounded-full bg-gradient-to-br ${data.colors.gradient} blur-2xl opacity-40`}
    />

    <div className="relative h-80 w-80 md:h-[450px] md:w-[450px] rounded-full border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={data.id}
            src={data.image}
            alt={`${data.title}`}
            variants={ANIMATIONS.image(isLeft)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full object-cover rounded-full"
            draggable={false}
          />
        </AnimatePresence>
      </motion.div>
    </div>

    <motion.div
      layout="position"
      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 bg-zinc-950/80 px-4 py-2 rounded-full border border-white/5 backdrop-blur">
        <span
          className={`h-1.5 w-1.5 rounded-full ${data.colors.glow} animate-pulse`}
        />
        {data.stats.connectionStatus}
      </div>
    </motion.div>
  </motion.div>
);

const ProductDetails = ({
  data,
  isLeft,
}: {
  data: ProductData;
  isLeft: boolean;
  key?: React.Key;
}) => {
  const alignClass = isLeft ? "items-start text-left" : "items-end text-right";
  const flexDirClass = isLeft ? "flex-row" : "flex-row-reverse";
  const barColorClass = isLeft
    ? "left-0 bg-blue-500"
    : "right-0 bg-emerald-500";

  return (
    <motion.div
      variants={ANIMATIONS.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${alignClass} py-8 md:py-0 relative z-10`}
    >
      <motion.h2
        variants={ANIMATIONS.item}
        className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2"
      >
        {data.label} Insights
      </motion.h2>
      <motion.h1
        variants={ANIMATIONS.item}
        className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500"
      >
        {data.title}
      </motion.h1>
      <motion.p
        variants={ANIMATIONS.item}
        className={`text-zinc-400 mb-8 max-w-sm leading-relaxed ${isLeft ? "mr-auto" : "ml-auto"}`}
      >
        {data.description}
      </motion.p>

      <motion.div
        variants={ANIMATIONS.item}
        className="w-full space-y-6 bg-zinc-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm"
      >
        {data.features.map((feature, idx) => (
          <div key={feature.label} className="group cursor-default">
            <div
              className={`flex items-center justify-between mb-3 text-sm ${flexDirClass}`}
            >
              <div className={`flex items-center gap-2 text-zinc-300`}>
                <feature.icon
                  size={16}
                  className={isLeft ? "text-blue-400" : "text-emerald-400"}
                />
                <div
                  className={`flex flex-col ${isLeft ? "items-start" : "items-end"}`}
                >
                  <span className="font-semibold">{feature.label}</span>
                  <span className="text-[10px] text-zinc-500">
                    {feature.detail}
                  </span>
                </div>
              </div>
              <span
                className={`font-mono text-lg font-bold ${isLeft ? "text-blue-500" : "text-emerald-500"}`}
              >
                {feature.displayValue}
              </span>
            </div>
            <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feature.progress}%` }}
                transition={{ duration: 1, delay: 0.4 + idx * 0.15 }}
                className={`absolute top-0 bottom-0 ${barColorClass} opacity-80`}
              />
            </div>
          </div>
        ))}

        <div
          className={`pt-4 flex ${isLeft ? "justify-start" : "justify-end"}`}
        >
          <button
            type="button"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors group"
          >
            <TrendingUp size={14} /> View Full Report
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Switcher = ({
  activeId,
  onToggle,
}: {
  activeId: ProductId;
  onToggle: (id: ProductId) => void;
}) => {
  const options = Object.values(PRODUCT_DATA).map((p) => ({
    id: p.id,
    label: p.label,
  }));

  return (
    <div className="absolute top-0 right-0 md:top-auto md:bottom-0 md:inset-x-0 flex justify-end md:justify-center z-50 pointer-events-none p-6 md:p-0">
      <motion.div
        layout
        className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/5"
      >
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            whileTap={{ scale: 0.96 }}
            className="relative px-6 h-10 md:h-12 md:w-28 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none"
          >
            {activeId === opt.id && (
              <motion.div
                layoutId="island-surface"
                className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-white/5 shadow-inner"
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-300 ${activeId === opt.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              {opt.label}
            </span>
            {activeId === opt.id && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-1 h-1 w-6 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export function SpatialProductShowcase() {
  const [activeSide, setActiveSide] = useState<ProductId>("performance");

  const currentData = PRODUCT_DATA[activeSide];
  const isLeft = activeSide === "performance";

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-transparent text-zinc-100 overflow-hidden selection:bg-zinc-800 flex flex-col items-center justify-center py-16 md:py-24">
      <BackgroundGradient isLeft={isLeft} />

      <main className="relative z-10 w-full px-6 flex flex-col justify-center max-w-6xl mx-auto">
        <motion.div
          layout
          transition={{ type: "spring", bounce: 0, duration: 0.9 }}
          className={`flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24 w-full ${
            isLeft ? "md:flex-row" : "md:flex-row-reverse"
          }`}
        >
          <ProductVisual data={currentData} isLeft={isLeft} />
          <motion.div layout="position" className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              <ProductDetails
                key={activeSide}
                data={currentData}
                isLeft={isLeft}
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      <Switcher activeId={activeSide} onToggle={setActiveSide} />
    </div>
  );
}
