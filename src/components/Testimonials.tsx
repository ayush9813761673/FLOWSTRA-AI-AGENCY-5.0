import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fadeUp, stagger } from "../constants";
import { Quote, Play, X, Video, ExternalLink, Mail, MessageCircle, Instagram, CheckCircle2, Sparkles, ShoppingBag, ShieldCheck } from "lucide-react";
import { HyperText } from "./ui/hyper-text";
import { useLanguage } from "@/context/LanguageContext";

interface TestimonialItem {
  id: string;
  quote: string;
  metrics: string;
  avatar: string;
  image: string;
  name: string;
  role: string;
  video: boolean;
  videoUrl?: string;
  hasProofModal?: boolean;
  storyBadge?: string;
}

const SkeletonTestimonialCard = () => {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-6 md:p-8 backdrop-blur-md overflow-hidden animate-pulse min-h-[480px]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-zinc-800/5 to-transparent rounded-t-2xl pointer-events-none" />
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-zinc-900/60 mb-6 shrink-0 flex items-end p-3">
        <div className="h-6 w-28 bg-zinc-800/80 rounded-full" />
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <div className="h-5 w-5 bg-zinc-800/60 rounded shrink-0 mb-1" />
        <div className="space-y-2">
          <div className="h-3.5 w-full bg-zinc-800/40 rounded" />
          <div className="h-3.5 w-11/12 bg-zinc-800/40 rounded" />
          <div className="h-3.5 w-4/5 bg-zinc-800/40 rounded" />
        </div>
      </div>
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
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<TestimonialItem | null>(null);
  const [activeProofModal, setActiveProofModal] = useState<TestimonialItem | null>(null);
  const [proofTab, setProofTab] = useState<"email" | "chat" | "instagram" | "summary">("email");

  const testimonials: TestimonialItem[] = [
    {
      id: "thomas-shelly",
      quote:
        "Flowstra's AI automation completely revolutionized our real estate lead management in Sydney. Enquiries get qualified and engaged via instant WhatsApp & CRM triggers, giving us a massive competitive edge.",
      metrics: "4x Conversion Rate",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800&h=500",
      name: "Thomas Shelly",
      role: "Real Estate Agent, Sydney (Australia)",
      video: true,
      videoUrl: "https://www.instagram.com/p/DaIxvAyPqgn/",
      storyBadge: "Real Estate Automation",
    },
    {
      id: "mscrubs",
      quote:
        "I was genuinely impressed—even before I shared all my ideas, you had already designed it using the colors from my logo. That level of attention to detail was brilliant. The final result reflects exactly what I had in mind, understanding my vision without needing endless explanations.",
      metrics: "Custom Brand Website & E-Com System",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
      image:
        "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=800&h=500",
      name: "Leena Amsel",
      role: "Founder, Mscrubs ™ (@mscrubswear)",
      video: false,
      hasProofModal: true,
      storyBadge: "Healthcare Apparel & E-Commerce",
    },
  ];

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
            {t.testimonials.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            <HyperText text={t.testimonials.title} className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white inline-block" />
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-slate-400 max-w-2xl mt-1.5 font-medium">
            {t.testimonials.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, sIdx) => (
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
              testimonials.map((item) => {
                return (
                  <motion.div
                    key={item.id}
                    layout
                    variants={fadeUp}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 shadow-sm light-card"
                  >
                    {/* Accent lighting top gradient */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-500/5 to-transparent rounded-t-2xl pointer-events-none" />

                    {/* Top: Photo Illustration of Niche & Badge */}
                    <div 
                      onClick={() => {
                        if (item.video) setActiveVideo(item);
                        if (item.hasProofModal) setActiveProofModal(item);
                      }}
                      className={`relative h-48 w-full overflow-hidden rounded-xl border border-[var(--card-border)] bg-zinc-900 mb-6 shrink-0 ${item.video || item.hasProofModal ? 'cursor-pointer' : ''}`}
                    >
                      <img
                        src={item.image}
                        alt={item.role}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                      
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {item.metrics}
                      </span>

                      {item.video && (
                        <>
                          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-lg">
                            <Video className="w-3.5 h-3.5 text-blue-400" />
                            {t.testimonials.videoCaseStudy}
                          </span>

                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-blue-500/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-transform duration-300 group-hover:scale-110">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>
                        </>
                      )}

                      {item.hasProofModal && (
                        <>
                          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold backdrop-blur-md shadow-lg">
                            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                            {t.testimonials.verifiedBadge}
                          </span>

                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                            <div className="px-4 py-2 rounded-full bg-zinc-900/90 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-transform duration-300 group-hover:scale-105 backdrop-blur-md">
                              <Mail className="w-3.5 h-3.5 text-rose-400" />
                              <span>{t.testimonials.viewReviewDms}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Middle: Content with Quote icon */}
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 text-blue-400 shrink-0">
                          <Quote className="w-5 h-5 opacity-50 fill-current" />
                        </div>
                        {item.storyBadge && (
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface-hover)] px-2 py-0.5 rounded border border-[var(--card-border)]">
                            {item.storyBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm md:text-[15px] text-[var(--text-secondary)] leading-relaxed italic">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Bottom: Divider & Profile */}
                    <div className="mt-6 pt-4 border-t border-[var(--card-border)] flex items-center justify-between gap-4 shrink-0">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--card-border)] bg-[var(--surface)] shrink-0">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-1.5">
                            {item.name}
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0 inline" />
                          </span>
                          <span className="text-xs text-[var(--text-muted)] truncate font-medium">
                            {item.role}
                          </span>
                        </div>
                      </div>

                      {item.hasProofModal && (
                        <button
                          onClick={() => setActiveProofModal(item)}
                          className="shrink-0 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1 rounded-lg bg-[var(--surface-hover)] hover:opacity-90 border border-[var(--card-border)] transition-colors cursor-pointer"
                        >
                          {t.common.details}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Video Modal Player (Thomas Shelly) */}
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
                <div className="flex items-center gap-2">
                  {activeVideo.videoUrl?.includes("instagram.com") && (
                    <a
                      href={activeVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-300 text-xs font-medium transition-colors"
                    >
                      <span>Watch on Instagram</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-video w-full bg-black flex items-center justify-center min-h-[380px] max-h-[75vh] overflow-hidden">
                {activeVideo.videoUrl ? (
                  activeVideo.videoUrl.includes("instagram.com") ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 relative p-1 overflow-hidden">
                      <iframe
                        src={`${activeVideo.videoUrl.replace(/\/+$/, "")}/embed/`}
                        className="w-full h-full min-h-[420px] max-w-[480px] border-0 rounded-lg"
                        allow="encrypted-media"
                        title={`Instagram testimonial from ${activeVideo.name}`}
                      />
                    </div>
                  ) : (
                    <video
                      src={activeVideo.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )
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

      {/* Proof & Case Showcase Modal (Mscrubs / Leena Amsel) */}
      <AnimatePresence>
        {activeProofModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProofModal(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh] my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Mscrubs ™ × Flowstra Case File
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t.common.verified}</span>
                    </h3>
                    <p className="text-xs text-zinc-400">Client: Leena Amsel (@mscrubswear)</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveProofModal(null)}
                  className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-zinc-800/80 bg-zinc-900/30 px-4 gap-2 overflow-x-auto py-2">
                <button
                  onClick={() => setProofTab("email")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    proofTab === "email"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Client Email</span>
                </button>
                <button
                  onClick={() => setProofTab("chat")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    proofTab === "chat"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Instagram DMs</span>
                </button>
                <button
                  onClick={() => setProofTab("instagram")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    proofTab === "instagram"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Brand Profile</span>
                </button>
                <button
                  onClick={() => setProofTab("summary")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    proofTab === "summary"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>How We Helped Her</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 md:p-6 overflow-y-auto space-y-4">
                {proofTab === "email" && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                          L
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Leena Amsel &lt;leenaamsel@gmail.com&gt;</div>
                          <div className="text-xs text-zinc-400">To: ayush@flowstra.org</div>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">Aug 7 · 1:07 AM</span>
                    </div>

                    <div className="text-sm text-zinc-200 leading-relaxed space-y-3 font-normal">
                      <p>
                        "Hi I want to sincerely Thank you.. I was genuinely impressed, even before I shared all my ideas, you had already designed it using the colors from my logo. That level of attention to detail was brilliant.
                      </p>
                      <p>
                        I also really appreciate how well everything is organized. The final result reflects exactly what I had in mind, and you managed to understand my vision without needing endless explanations.
                      </p>
                      <p>
                        Thank you for your professionalism, creativity, and thoughtful work. It was a pleasure working with you."
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Email Delivery
                      </span>
                      <span className="text-zinc-500">Flowstra Direct Client Review</span>
                    </div>
                  </div>
                )}

                {proofTab === "chat" && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 md:p-6 max-w-lg mx-auto space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
                          M
                        </div>
                        <span className="text-xs font-bold text-white">mscrubswear (Instagram DM)</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">Direct Messages</span>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed">
                      {/* Outgoing */}
                      <div className="flex justify-end">
                        <div className="bg-purple-600/90 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 max-w-[80%]">
                          That's so nice of you, may I ask what's your budget?
                        </div>
                      </div>

                      {/* Incoming */}
                      <div className="flex justify-start">
                        <div className="bg-zinc-800 text-zinc-200 rounded-2xl rounded-tl-sm px-3.5 py-2 max-w-[80%]">
                          I dunno. How do you usually work?
                        </div>
                      </div>

                      {/* Outgoing */}
                      <div className="flex justify-end">
                        <div className="bg-purple-600/90 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 max-w-[80%]">
                          The rate depends on the complexity though
                        </div>
                      </div>

                      {/* Outgoing */}
                      <div className="flex justify-end">
                        <div className="bg-purple-600/90 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 max-w-[85%] space-y-1.5">
                          <p>Around 200-300 for a full website with different pages, but obviously it was nice to know your story to be honest, so I'll try to make space for discount</p>
                          <p className="font-semibold text-rose-200">150-200 plus domain as well, for you. ❤️</p>
                        </div>
                      </div>

                      {/* Incoming */}
                      <div className="flex justify-start">
                        <div className="bg-zinc-800 text-zinc-200 rounded-2xl rounded-tl-sm px-3.5 py-2 max-w-[80%]">
                          Oh thank you that's so nice of you 🥺 ❤️
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {proofTab === "instagram" && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 max-w-md mx-auto space-y-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 mx-auto">
                      <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center border-2 border-zinc-900 text-rose-400 font-bold text-lg">
                        M
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                        mscrubswear
                        <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center">✓</span>
                      </h4>
                      <p className="text-xs text-rose-400 font-medium">Mscrubs ™ | Elegant & Comfortable</p>
                      <p className="text-xs text-zinc-400 mt-1">Clothing (Brand) · Designed for women in healthcare 🩺 ♀</p>
                    </div>

                    <div className="flex justify-center gap-6 py-2 border-y border-zinc-800/80 text-xs">
                      <div>
                        <div className="font-bold text-white">36</div>
                        <div className="text-zinc-500">posts</div>
                      </div>
                      <div>
                        <div className="font-bold text-white">1,340</div>
                        <div className="text-zinc-500">followers</div>
                      </div>
                      <div>
                        <div className="font-bold text-white">58</div>
                        <div className="text-zinc-500">wilayas covered</div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 italic">
                      "Beyond monochrome. Livraison 58 wilayas 🚚 📍 Algérie"
                    </p>

                    <a
                      href="https://www.instagram.com/mscrubswear/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Visit @mscrubswear Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {proofTab === "summary" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <h4 className="text-sm font-bold text-blue-300 mb-1">What We Built For Mscrubs ™</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Leena reached out to Flowstra to create an elegant digital storefront for her healthcare scrubs brand. Here is how we delivered:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
                        <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Zero-Explanation Design
                        </div>
                        <p className="text-zinc-400">
                          Extracted her signature logo colors and brand identity directly, producing the final UI before requiring extensive briefing meetings.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
                        <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Full Multi-Page Storefront
                        </div>
                        <p className="text-zinc-400">
                          Structured product catalogs, collection highlights, and clean modern aesthetic tailored for healthcare professionals.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
                        <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Order & Delivery Funnel
                        </div>
                        <p className="text-zinc-400">
                          Automated WhatsApp and DM inquiry routing facilitating smooth order handling across all 58 Algerian wilayas.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
                        <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Founder-First Pricing
                        </div>
                        <p className="text-zinc-400">
                          Delivered an accessible package with full domain setup, eliminating typical agency overheads for early-stage founders.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-medium text-white">Flowstra × Mscrubs™</span>
                <button
                  onClick={() => setActiveProofModal(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

