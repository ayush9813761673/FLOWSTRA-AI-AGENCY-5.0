import React from "react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../constants";
import { Quote } from "lucide-react";
import { GlowCard } from "./ui/spotlight-card";
import { HyperText } from "./ui/hyper-text";

const testimonials = [
  {
    quote:
      "Flowstra's AI completely changed how I handle my leads and content. My engagement and conversions skyrocketed in just weeks.",
    metrics: "30k+ followers",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600&h=400",
    name: "Alex",
    role: "Fitness & Nutrition Coach",
    video: false,
  },
  {
    quote:
      "The AI system Flowstra built has taken our business to the next level. Orders are processed instantly and our team's efficiency has doubled.",
    metrics: "Double efficiency",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    image:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=600&h=400",
    name: "Punit Sarda",
    role: "Managing Director, Leading Sanitation Group",
    video: true,
  },
  {
    quote:
      "We've automated our back end systems and operations and our business has seen immense growth in efficiency and speed.",
    metrics: "Immense growth",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600&h=400",
    name: "Kesav Parajuli",
    role: "CEO & Founder, Naulo Koseli",
    video: false,
  },
  {
    quote:
      "These guys are the real deal, they took over my backend operations and saved me countless hours of manual work every single day.",
    metrics: "Saved hours of time",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
    image:
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600&h=400",
    name: "E-Com Founder",
    role: "Owner, Ecom Brands (France)",
    video: true,
  },
  {
    quote:
      "Our engagement rates doubled and our customer support wait times dropped by 70% thanks to their custom automated message streams.",
    metrics: "70% less wait time",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400",
    name: "David Smith",
    role: "VP of Operations, TechFlow",
    video: false,
  },
  {
    quote:
      "Working with Flowstra was the best investment we made this year. The automated workflows achieved a full ROI inside 3 months.",
    metrics: "2x ROI in 3 months",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600&h=400",
    name: "Elena Rodriguez",
    role: "Head of Marketing, CloudScale",
    video: true,
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-col gap-12"
      >
        <div className="flex flex-col gap-4 max-w-3xl items-center text-center mx-auto">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/5 text-green-400 text-xs font-semibold tracking-wider uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />{" "}
            Verified Client Metrics
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            <HyperText
              text="Client Success Stories"
              className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
              containerClassName="justify-center"
            />
          </h2>
          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-[var(--text-secondary)]"
          >
            Real results from real businesses who trusted us with their workflow automation
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => {
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/40"
              >
                {/* Accent lighting top gradient */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-t-2xl pointer-events-none" />

                {/* Top: Photo Illustration of Niche & Badge */}
                <div className="relative h-44 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 mb-6 shrink-0">
                  <img
                    src={item.image}
                    alt={item.role}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium backdrop-blur-md">
                    {item.metrics}
                  </span>
                </div>

                {/* Middle: Content with Quote icon */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex gap-1 text-emerald-500 shrink-0">
                    <Quote className="w-5 h-5 opacity-40 fill-current" />
                  </div>
                  <p className="text-sm md:text-base text-zinc-300 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                {/* Bottom: Divider & Profile */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-4 shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-zinc-400 truncate font-medium">
                      {item.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
