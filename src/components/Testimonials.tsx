import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fadeUp, stagger } from "../constants";
import { Quote, Play, X, Video } from "lucide-react";
import { GlowCard } from "./ui/spotlight-card";
import { HyperText } from "./ui/hyper-text";

interface TestimonialItem {
  quote: string;
  metrics: string;
  avatar: string;
  image: string;
  name: string;
  role: string;
  video: boolean;
  videoUrl?: string;
}

const testimonials: TestimonialItem[] = [
  {
    quote:
      "Flowstra's AI automation completely revolutionized our real estate lead management in Sydney. Enquiries get qualified and engaged via instant WhatsApp & CRM triggers, giving us a massive competitive edge.",
    metrics: "4x Conversion Rate",
    avatar: "/Thomas_Shelly_avatar.jpg",
    image: "/Sydney_Real_Estate.jpg",
    name: "Thomas Shelly",
    role: "Real Estate Agent, Sydney (Australia)",
    video: true,
    videoUrl: "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622196/new107_qhrklf.mp4",
  },
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
    videoUrl: "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779621768/new105_meaomd.mp4",
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
    videoUrl: "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622220/new108_k1a47m.mp4",
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
    videoUrl: "https://res.cloudinary.com/dy4bqxt8p/video/upload/v1779622271/02_u2efg7.mp4",
  },
];

const SkeletonTestimonialCard = () => {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-6 md:p-8 backdrop-blur-md overflow-hidden animate-pulse min-h-[480px]">
      {/* Glare line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Accent lighting top gradient */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-zinc-800/5 to-transparent rounded-t-2xl pointer-events-none" />

      {/* Top: Photo Illustration of Niche & Badge */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl bg-zinc-900/60 mb-6 shrink-0 flex items-end p-3">
        <div className="h-6 w-28 bg-zinc-800/80 rounded-full" />
      </div>

      {/* Middle: Content with Quote icon */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="h-5 w-5 bg-zinc-800/60 rounded shrink-0 mb-1" />
        <div className="space-y-2">
          <div className="h-3.5 w-full bg-zinc-800/40 rounded" />
          <div className="h-3.5 w-11/12 bg-zinc-800/40 rounded" />
          <div className="h-3.5 w-4/5 bg-zinc-800/40 rounded" />
        </div>
      </div>

      {/* Bottom: Divider & Profile */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-4 shrink-0">
        <div className="w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-800/50 shrink-0" />
        <div className="flex flex-col min-w-0 w-full gap-2">
          <div className="h-3.5 w-24 bg-zinc-800/80 rounded" />
          <div className="h-2.5 w-36 bg-zinc-800/50 rounded" />
        </div>
      </div>
    </div>
  );
};

export function Testimonials() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<TestimonialItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

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
        <div className="flex flex-col gap-3 max-w-3xl items-center text-center mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 font-mono">
            Verified Client Metrics
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            <HyperText text="Client Success Stories" className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white inline-block" />
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-slate-400 max-w-2xl mt-1.5 font-medium">
            Real results from real businesses who trusted us with their workflow automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: testimonials.length || 3 }).map((_, sIdx) => (
                <motion.div
                  key={`skeleton-testimonial-${sIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SkeletonTestimonialCard />
                </motion.div>
              ))
            ) : (
              testimonials.map((item, idx) => {
                return (
                  <motion.div
                    key={idx}
                    layout
                    variants={fadeUp}
                    className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/40 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),_0_0_30px_rgba(16,185,129,0.02)]"
                  >
                    {/* Accent lighting top gradient */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-t-2xl pointer-events-none" />

                    {/* Top: Photo Illustration of Niche & Badge */}
                    <div 
                      onClick={() => item.video && setActiveVideo(item)}
                      className={`relative h-44 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 mb-6 shrink-0 ${item.video ? 'cursor-pointer' : ''}`}
                    >
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

                      {item.video && (
                        <>
                          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-lg">
                            <Video className="w-3.5 h-3.5 text-blue-400" />
                            Video Case Study
                          </span>

                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-black flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-transform duration-300 group-hover:scale-110">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>
                        </>
                      )}
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
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 shrink-0">
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
              })
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                    <img src={activeVideo.avatar} alt={activeVideo.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeVideo.name}</h3>
                    <p className="text-xs text-zinc-400">{activeVideo.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                {activeVideo.videoUrl ? (
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="p-8 text-center text-zinc-400">
                    <Video className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                    <p>Video testimonial for {activeVideo.name}</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-zinc-950 border-t border-zinc-800/80">
                <p className="text-sm text-zinc-300 italic">"{activeVideo.quote}"</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
