"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HyperText } from "./hyper-text";
import {
  Globe,
  BrainCircuit,
  Bot,
  Database,
  CheckCircle2,
  LoaderCircle,
  Circle,
  Cpu,
  Lock,
  Zap,
  Brain,
  Mic,
} from "lucide-react";

import GigabitBackground from "./gigabit";
import { MagneticCard } from "./magnetic-card";
import { fadeUp, stagger } from "../../constants";

const items = [
  {
    icon: Zap,
    label: "Omni-Channel Capture",
    title: "Lead Capture",
    description:
      "Capture leads 24/7 with custom conversational AI agents across multiple channels.",

    video:
      "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622196/new107_qhrklf.mp4",

    card: {
      heading: "Automated Lead Capture",
      badge: "Live",
      goal: "Deploy AI agents across website, WhatsApp, and social to capture high-quality leads.",

      tasks: [
        {
          title: "Initialize omni-channel bots",
          meta: "Completed in 1.2s",
          status: "completed",
        },
        {
          title: "Capture user intent",
          meta: "Completed in 3.4s",
          status: "completed",
        },
        {
          title: "Qualify lead automatically",
          meta: "In progress... 8s",
          status: "progress",
        },
        {
          title: "Route to sales team",
          meta: "Pending",
          status: "pending",
        },
      ],
    },
  },

  {
    icon: Mic,
    label: "Smart Outreach",
    title: "Automated Outreach",
    description:
      "Engage prospects instantly with hyper-personalized communication.",

    video:
      "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779621768/new105_meaomd.mp4",

    card: {
      heading: "Smart Outreach",
      badge: "Active",
      goal: "Automatically reach out to qualified leads with tailored messaging.",

      tasks: [
        {
          title: "Analyze lead profile",
          meta: "Completed in 2.1s",
          status: "completed",
        },
        {
          title: "Generate personalized email",
          meta: "Completed in 4.5s",
          status: "completed",
        },
        {
          title: "Send automated follow-up",
          meta: "In progress... 12s",
          status: "progress",
        },
        {
          title: "Schedule discovery call",
          meta: "Pending",
          status: "pending",
        },
      ],
    },
  },

  {
    icon: Database,
    label: "CRM Sync",
    title: "CRM Sync",
    description:
      "Seamlessly push structured lead data to HubSpot, Salesforce, or your custom CRM.",

    video:
      "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622220/new108_k1a47m.mp4",

    card: {
      heading: "Real-time CRM Sync",
      badge: "Optimized",
      goal: "Keep your sales pipeline updated with zero manual data entry.",

      tasks: [
        {
          title: "Extract key contact data",
          meta: "Completed in 0.8s",
          status: "completed",
        },
        {
          title: "Format for CRM schema",
          meta: "Completed in 1.4s",
          status: "completed",
        },
        {
          title: "Sync lead profile",
          meta: "In progress... 5s",
          status: "progress",
        },
        {
          title: "Trigger sales notification",
          meta: "Pending",
          status: "pending",
        },
      ],
    },
  },

  {
    icon: Brain,
    label: "Lead Scoring",
    title: "Lead Scoring",
    description:
      "Predictive AI models to score and prioritize leads based on engagement and fit.",

    video:
      "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622271/02_u2efg7.mp4",

    card: {
      heading: "Predictive Scoring",
      badge: "AI-Powered",
      goal: "Identify and prioritize high-value prospects for immediate closing.",

      tasks: [
        {
          title: "Analyze engagement history",
          meta: "Completed in 3.2s",
          status: "completed",
        },
        {
          title: "Calculate conversion probability",
          meta: "Completed in 5.6s",
          status: "completed",
        },
        {
          title: "Assign priority score",
          meta: "In progress... 9s",
          status: "progress",
        },
        {
          title: "Generate insight report",
          meta: "Pending",
          status: "pending",
        },
      ],
    },
  },
];

export function ClippedVideoTab() {
  const [activeTab, setActiveTab] = useState(0);

  const activeItem = items[activeTab];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className="py-20 overflow-hidden w-full max-w-7xl mx-auto rounded-3xl mt-12 bg-transparent text-left"
    >
      {/* TOP */}
      <div className="w-full mb-16">
        <div className="flex flex-col gap-3 max-w-3xl items-center text-center mx-auto">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 font-mono">
            Core Solutions & Modules
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            <HyperText text="Powerful Features for Lead Generation" className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white inline-block" />
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-slate-400 max-w-2xl mt-1.5 font-medium">
            Explore the advanced AI and automation capabilities that supercharge your lead generation pipelines—designed and engineered by Flowstra.
          </p>
        </div>
      </div>

      {/* IMAGE AREA */}
      <motion.div variants={fadeUp} className="w-full relative flex flex-col md:block">
        
        {/* VIDEO CONTAINER */}
        <div
          className="relative overflow-hidden h-[550px] md:h-[690px] order-1 md:order-none"
          style={{
            clipPath:
              "polygon(0 0, 92% 0, 100% 12%, 100% 100%, 30% 100%, 22% 88%, 0 88%)",
            borderRadius: "34px",
          }}
        >
          {/* BACKGROUND */}
          <GigabitBackground />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/40 md:bg-black/20 z-0" />

          {/* CENTER CARD */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.card.heading}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.35 }}
                className="w-[320px] max-md:w-[90%] pointer-events-auto"
              >
                <MagneticCard className="w-full rounded-[26px] border border-white/30 bg-white/80 backdrop-blur-xl shadow-2xl p-5 cursor-default">
                  {/* HEADER */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-[18px] font-semibold text-[#131313]">
                      {activeItem.card.heading}
                    </h3>
                    <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                      {activeItem.card.badge}
                    </span>
                  </div>

                  {/* GOAL */}
                  <div className="mt-4 border border-[#e7e7e7] rounded-xl p-3 bg-white/50">
                    <p className="text-[11px] text-[#777]">Goal</p>
                    <p className="text-[13px] leading-[20px] mt-1 text-[#131313]">
                      {activeItem.card.goal}
                    </p>
                  </div>

                  {/* TASKS */}
                  <div className="mt-4 flex flex-col gap-3">
                    {activeItem.card.tasks.map((task, index) => (
                      <div key={index} className="flex items-start gap-2">
                        {/* ICON */}
                        <div className="mt-[2px]">
                          {task.status === "completed" && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          )}
                          {task.status === "progress" && (
                            <LoaderCircle className="w-4 h-4 text-blue-600 animate-spin" />
                          )}
                          {task.status === "pending" && (
                            <Circle className="w-4 h-4 text-[#bdbdbd]" />
                          )}
                        </div>

                        {/* CONTENT */}
                        <div>
                          <p
                            className={`
                              text-[13px]
                              ${
                                task.status === "completed"
                                  ? "line-through text-[#666]"
                                  : task.status === "progress"
                                    ? "text-blue-600 font-medium"
                                    : "text-[#999]"
                              }
                            `}
                          >
                            {task.title}
                          </p>
                          <p className="text-[11px] text-[#999]">{task.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between mt-5 text-[11px] text-[#888]">
                    <span>{activeItem.card.tasks.filter((t) => t.status === "completed").length}/{activeItem.card.tasks.length} tasks complete</span>
                    <span>Est. 45s remaining</span>
                  </div>
                </MagneticCard>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* FLOATING TABS (Now stacked below on mobile, floating on desktop) */}
        <div className="relative md:absolute pt-6 md:pt-0 left-0 md:left-2 bottom-0 md:bottom-16 z-20 order-2 md:order-none">
          <div className="bg-[var(--surface)]/90 backdrop-blur-md rounded-[28px] shadow-xl border border-[var(--card-border)] p-3 w-full md:w-[240px]">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1 gap-2">
              {items.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`
                      group flex items-center justify-center md:justify-start gap-2 md:gap-3 px-2 md:px-4 py-3 rounded-xl text-center md:text-left transition-all duration-300 border
                      ${
                        activeTab === index
                          ? "bg-[var(--accent-blue-dim)] border-[var(--accent-blue)]"
                          : "border-transparent"
                      }
                    `}
                  >
                    <Icon
                      className={`
                        w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 shrink-0
                        ${
                          activeTab === index
                            ? "text-[var(--accent-blue)]"
                            : "text-[var(--text-primary)] group-hover:text-[var(--accent-blue)]"
                        }
                      `}
                    />
                    <span
                      className={`
                        text-[11px] sm:text-[12px] md:text-[15px] font-medium transition-colors duration-300 leading-tight
                        ${
                          activeTab === index
                            ? "text-[var(--accent-blue)]"
                            : "text-[var(--text-primary)] group-hover:text-[var(--accent-blue)]"
                        }
                      `}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
