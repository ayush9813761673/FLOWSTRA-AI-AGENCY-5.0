"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  Briefcase, 
  Sparkles,
  ChevronUp
} from "lucide-react";

export function FloatingDock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const triggerAuditModal = () => {
    window.dispatchEvent(new CustomEvent("open-automation-audit"));
  };

  const dockItems = [
    {
      id: "clients",
      label: "Clients",
      icon: Briefcase,
      action: { type: "scroll", value: "#case-studies" },
      tooltip: "View Our Client Success Stories"
    },
    {
      id: "team",
      label: "Team",
      icon: Users,
      action: { type: "scroll", value: "#team" },
      tooltip: "Meet the Automation Experts"
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: DollarSign,
      action: { type: "scroll", value: "#pricing" },
      tooltip: "Explore Pricing & ROI Calculator"
    },
    {
      id: "support",
      label: "Support",
      icon: MessageSquare,
      action: { type: "link", value: "https://cal.com/flowstra/30min" },
      tooltip: "Book a 30-Min Growth Session"
    },
    {
      id: "audit",
      label: "Audit",
      icon: Sparkles,
      action: { type: "callback", value: triggerAuditModal },
      tooltip: "Get Free AI Operations Audit",
      highlight: true
    }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none select-none px-4 w-full max-w-md sm:hidden">
      <div className="relative flex justify-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5
          }}
          className="pointer-events-auto relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-slate-950/60 backdrop-blur-xl shadow-[0_12px_28px_rgba(0,0,0,0.5),0_0_12px_rgba(255,255,255,0.03)]"
          style={{
            backdropFilter: 'url("#navbar-glass-filter") blur(16px)',
            WebkitBackdropFilter: 'url("#navbar-glass-filter") blur(16px)'
          }}
        >
          {/* Liquid Glass Highlight Overlay to match top navbar */}
          <div className="absolute inset-0 rounded-full z-0 pointer-events-none 
            shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.2),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.7),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.5),inset_0_0_6px_6px_rgba(255,255,255,0.1),inset_0_0_2px_2px_rgba(255,255,255,0.05),0_0_12px_rgba(255,255,255,0.1)] 
            bg-white/[0.04]" 
          />

          {/* Glass SVG Displacement Filter for bottom dock */}
          <svg className="absolute w-0 h-0" width="0" height="0">
            <defs>
              <filter id="navbar-glass-filter">
                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>

          <div className="relative z-10 flex items-center gap-1">
            {dockItems.map((item, index) => {
              const Icon = item.icon;
              const isHovered = hoveredIndex === index;

              // Render based on action type
              const renderButtonContent = () => (
                <div className="relative flex items-center justify-center">
                  {/* Glowing background on hover or highlight */}
                  <AnimatePresence>
                    {(isHovered || item.highlight) && (
                      <motion.span
                        layoutId="dock-glow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: item.highlight ? (isHovered ? 0.35 : 0.15) : 0.1, 
                          scale: 1 
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 rounded-full blur-md ${
                          item.highlight ? "bg-blue-400" : "bg-white"
                        }`}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon container - made more compact */}
                  <div className={`p-2 rounded-full transition-all duration-300 ${
                    item.highlight 
                      ? "bg-blue-500/15 border border-blue-500/30 text-blue-300 group-hover:bg-blue-500/25 group-hover:text-blue-100 group-hover:border-blue-400/50" 
                      : "text-slate-400 group-hover:text-white group-hover:bg-white/5 border border-transparent"
                  }`}>
                    <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                      item.highlight && "animate-pulse"
                    }`} />
                  </div>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -45, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 bg-slate-950/95 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap pointer-events-none z-50 flex items-center gap-1"
                      >
                        <span className="text-[10px] sm:text-xs font-medium text-slate-200">
                          {item.tooltip}
                        </span>
                        {item.highlight && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                        )}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-950/95" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );

              if (item.action.type === "scroll") {
                return (
                  <a
                    key={item.id}
                    href={item.action.value as string}
                    onClick={(e) => handleScroll(e, item.action.value as string)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="group relative cursor-pointer active:scale-95 transition-transform"
                    aria-label={item.label}
                  >
                    {renderButtonContent()}
                  </a>
                );
              } else if (item.action.type === "link") {
                return (
                  <a
                    key={item.id}
                    href={item.action.value as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="group relative cursor-pointer active:scale-95 transition-transform"
                    aria-label={item.label}
                  >
                    {renderButtonContent()}
                  </a>
                );
              } else {
                return (
                  <button
                    key={item.id}
                    onClick={item.action.value as () => void}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="group relative cursor-pointer active:scale-95 transition-transform focus:outline-none"
                    aria-label={item.label}
                  >
                    {renderButtonContent()}
                  </button>
                );
              }
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
