import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fadeUp, stagger } from "../constants";
import { PixelLogoGrid } from "./ui/pixel-logo-grid";
import { HyperText } from "./ui/hyper-text";
import { 
  TrendingUp, 
  BarChart2, 
  Layers, 
  Globe, 
  Sparkles, 
  Workflow, 
  Activity, 
  LineChart, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  ShoppingBag,
  Home,
  X,
  CheckCircle2,
  Calendar
} from "lucide-react";

// The 12 authentic real-world case studies with precise niches and metrics
const cases = [
  {
    brand: "G.P. Real Estate Services",
    category: "Premium Brokerage CRM",
    impact: "85% Response Speed Improvement",
    quote: "Instantly routes international property buyer inquiries directly to assigned field agents.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "Instant buyer match",
    icon: Globe,
    color: "from-amber-500/10 to-transparent",
    accent: "text-amber-400",
    serviceType: "CRM",
    badges: ["85% Faster Route", "WhatsApp Alerts", "+$1.2M Pipeline"],
    challenge: "High-net-worth international buyers expecting instant responses were lost in manual routing queues, leading to a 4+ hour delay and lost sales commissions.",
    solution: "Designed a real-time smart routing CRM. Parses incoming multilingual web leads instantly, matches target location and price range against live agent profiles, and pushes notifications directly to WhatsApp with automated fallback triggers.",
    results: [
      "85% reduction in initial lead contact response times",
      "100% automated agent matching with zero manual triage overhead",
      "Over $1.2M in property sales pipeline assigned and secured within 30 days"
    ]
  },
  {
    brand: "Homeplex Nepal",
    category: "Real Estate & Construction",
    impact: "3x Inquiries in 8 Months",
    quote: "Three new design engineers hired simply to handle the business volume directed to us.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "+280% organic leads",
    icon: Home,
    color: "from-blue-500/10 to-transparent",
    accent: "text-blue-400",
    serviceType: "Lead Gen",
    badges: ["+280% Leads", "3x Volume Up", "WhatsApp Pipeline"],
    challenge: "Valuable construction project and home renovation inquiries were scattered across social media messaging apps, leading to forgotten followups and zero analytics.",
    solution: "Built a centralized multi-channel funnel that captures high-intent architectural designs interest. Pushes automated, tailored catalog previews via WhatsApp, triggering immediate call scheduling with verified sales personnel.",
    results: [
      "+280% increase in organic, high-intent architectural leads",
      "3x overall engineering project inquiries in just 8 months",
      "Forced to hire 3 additional design engineers to cope with scaled client workload"
    ]
  },
  {
    brand: "Naulo Koseli",
    category: "Nepal's Premier E-Commerce Brand",
    impact: "10,000+ Automated Orders",
    quote: "Bridges the gap between physical boutique gifting orders and instant automated fulfillment.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "2x order capacity",
    icon: ShoppingBag,
    color: "from-pink-500/10 to-transparent",
    accent: "text-pink-400",
    serviceType: "E-Commerce",
    badges: ["10k+ Orders", "2x Capacity", "Zero Dispatch Error"],
    challenge: "As a boutique custom gift store, printing highly personalized greeting messages and matching them with dynamic delivery windows was manual, error-prone, and slow.",
    solution: "Connected Shopify webhooks to a custom automated shipping dashboard. Auto-generates high-fidelity gift wrapping instructions and localized rider-dispatch tasks complete with direct routing links.",
    results: [
      "Successfully automated and fulfilled 10,000+ custom gift orders",
      "Doubled total order capacity with zero additional warehouse staff",
      "Reduced package-routing dispatch errors to absolute zero"
    ]
  },
  {
    brand: "Leading Sanitation Group",
    category: "Industrial Showroom & Supply Chain",
    impact: "Zero Processing Errors",
    quote: "Fully automated supply chain booking dispatch systems linked directly with custom chat flows.",
    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "-98% scheduling delays",
    icon: Workflow,
    color: "from-emerald-500/10 to-transparent",
    accent: "text-emerald-400",
    serviceType: "Operations",
    badges: ["-98% Delays", "15+ Admin Hrs Saved", "100% Sync Accuracy"],
    challenge: "Industrial sanitation bookings and specialist showroom walkthrough schedules suffered from severe dispatch blockages and constant manual coordination mistakes.",
    solution: "Integrated structured reservation automation synced to live calendar grids. Instantly sends product catalogues, validates technician slots, and updates shipping logs synchronously.",
    results: [
      "98% drop in internal technician scheduling delays",
      "Completely eliminated showroom booking data-entry duplicates",
      "Freed up 15+ hours of back-office administration overhead every single week"
    ]
  },
  {
    brand: "Core Perform",
    category: "Fitness & Wellness",
    impact: "25+ Hours Admin Saved/Wk",
    quote: "Saved gym staff massive hours weekly, allowing focusing on high-ticket training.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "100% manual tasks automated",
    icon: Activity,
    color: "from-violet-500/10 to-transparent",
    accent: "text-violet-400",
    serviceType: "Operations",
    badges: ["25+ Hrs Saved", "100% Auto-Onboard", "Zero Failed Renewals"],
    challenge: "High-performance fitness coaches were bogged down by manual class bookings, contract signatures, customized fitness surveys, and chasing monthly membership renewals.",
    solution: "Engineered a comprehensive, secure customer onboarding sequence. Integrates electronic contract execution, custom biometric questionnaires, class bookings, and stripe-triggered renewals automatically.",
    results: [
      "Saved coaches and front-desk personnel 25+ hours of administrative work weekly",
      "100% of standard customer registration and onboarding runs autonomously",
      "Zero failed recurring billing attempts due to proactive dynamic renewal alerts"
    ]
  },
  {
    brand: "Mamy Poko (Nepal Distributor)",
    category: "FMCG Wholesale Retail Network",
    impact: "32% Warehouse Velocity Up",
    quote: "Stock re-orders calculated and dispatched with intelligent automated WhatsApp alerts.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "32% warehouse speed",
    icon: LineChart,
    color: "from-cyan-500/10 to-transparent",
    accent: "text-cyan-400",
    serviceType: "Operations",
    badges: ["+32% Velocity", "WhatsApp Alerts", "Zero Stockouts"],
    challenge: "Large-scale FMCG distribution networks faced stocking friction because order confirmation sheets and delivery tracking logs were verified manually.",
    solution: "Developed an elegant inventory webhook-trigger system. Automatic threshold sensors monitor stock levels and dispatch wholesale orders with direct updates pushed through WhatsApp to distributor clusters.",
    results: [
      "Boosted fulfillment and warehouse velocity by 32%",
      "Reduced stockout frequencies on high-demand hygiene goods to zero",
      "Coordinated wholesale routing structures 10x faster"
    ]
  },
  {
    brand: "French E-Com Network",
    category: "Multi-Brand Shopify Engine",
    impact: "18,000+ Support Tickets Saved",
    quote: "Automated multilingual e-com helpdesks operating effortlessly 24/7 without delays.",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "70% lower support cost",
    icon: Sparkles,
    color: "from-rose-500/10 to-transparent",
    accent: "text-rose-400",
    serviceType: "E-Commerce",
    badges: ["18k+ Tickets Saved", "70% Cost Cut", "4.8/5 CSAT Rating"],
    challenge: "Managing massive global customer inquiries in French, English, and Spanish regarding shipment statuses and returns led to customer service delays and rising cancellations.",
    solution: "Built a highly responsive automated multilingual ticketing agent. Resolves simple order queries, processes return labels, and routes complex custom complaints to appropriate live teams.",
    results: [
      "Over 18,000+ basic support inquiries successfully answered autonomously",
      "Cut total customer support desk operating costs by 70%",
      "Maintained a solid 4.8/5 CSAT rating across three distinct Shopify brands"
    ]
  },
  {
    brand: "National IVF Centre",
    category: "Medical Records & Coordination",
    impact: "100% HIPAA Compliance",
    quote: "Automates coordination flows of records, clinic scheduling, and diagnostic alerts safely.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "Zero filing delay",
    icon: Layers,
    color: "from-sky-500/10 to-transparent",
    accent: "text-sky-400",
    serviceType: "Operations",
    badges: ["100% HIPAA", "Zero Filing Delay", "+40% Efficiency"],
    challenge: "Patient intake forms, sensitive lab coordination, and clinical followups were prone to human reporting delays under strict regulatory environments.",
    solution: "Built encrypted secure routing chains that validate input records instantly. Dispatches real-time clinical availability updates, HIPAA-compliant patient intake forms, and automated laboratory alerts.",
    results: [
      "Reduced lab report filing and patient matching delays to absolute zero",
      "Achieved 100% HIPAA-compliant workflow automation with flawless audit trails",
      "Boosted patient scheduling efficiency by 40% inside 90 days"
    ]
  },
  {
    brand: "Modern Kitchens",
    category: "Premium Custom Interiors",
    impact: "45% Design Booking Conversion",
    quote: "Dynamic interior configuration on chat generates auto-conceptual previews instantly.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "+45% sales conversion",
    icon: Zap,
    color: "from-yellow-500/10 to-transparent",
    accent: "text-yellow-400",
    serviceType: "Lead Gen",
    badges: ["+45% Conversion", "Instant Previews", "14 Days Saved"],
    challenge: "Interiors and kitchen remodels are high-ticket purchases. Customers drop out during initial design inquiries due to slow blueprint visualization loops.",
    solution: "Created an interactive conversational design selector. Collects stylistic choices (materials, layouts, budgets) and instantly previews personalized conceptual summaries, prompting immediate on-site appointments.",
    results: [
      "Increased initial showroom and consultation conversions by 45%",
      "Auto-generated thousands of unique layout briefs sent directly to design teams",
      "Accelerated the sales closing cycle by 14 business days on average"
    ]
  },
  {
    brand: "Apex Physics Labs",
    category: "Deep Structured Material Data",
    impact: "99.8% Sorting Accuracy",
    quote: "Sorted and parsed complex structural lab research data seamlessly into searchable digital matrices.",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "99.8% precision index",
    icon: TrendingUp,
    color: "from-indigo-500/10 to-transparent",
    accent: "text-indigo-400",
    serviceType: "Operations",
    badges: ["99.8% Accuracy", "12+ Hrs Saved/Wk", "5x Fast Prep"],
    challenge: "Physicists and lab technicians manually compiled complex material structures data files into disorganized server folders, costing hours of valuable research focus.",
    solution: "Engineered automated data pipelines. Instantly reads machine logs, sanitizes material metrics, classifies variables, and indexes details into secure, indexed searchable lab logs.",
    results: [
      "Achieved 99.8% precision accuracy on auto-classified structure data",
      "Saved lab coordinators 12+ research hours every week",
      "Accelerated the peer review prep-work cycles by 5x"
    ]
  },
  {
    brand: "Vasas Bespoke Suits",
    category: "Luxury Custom Tailoring",
    impact: "Zero Missed Measurement Windows",
    quote: "No-wait interactive custom timing scheduler and automated followups on CRM.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "100% automated followups",
    icon: BarChart2,
    color: "from-teal-500/10 to-transparent",
    accent: "text-teal-400",
    serviceType: "CRM",
    badges: ["100% Auto-Remind", "Zero No-Shows", "SMS Fitting Alerts"],
    challenge: "Bespoke tailoring relies on precise fitting appointments. High-value suit leads dropped off due to slow manual booking confirmations and poor client communication.",
    solution: "Implemented an instant self-booking fitting suite synced directly with custom CRM tracking. Fires automatic, highly-stylized SMS prep-checklists and fitting reminders.",
    results: [
      "100% automated followups and fitting scheduling sequences",
      "Completely eliminated manual appointment confirmation bottlenecks",
      "Reduced consultation cancel-and-no-show rates by 95%"
    ]
  },
  {
    brand: "Peak Performance Coach",
    category: "High-Ticket Course Launch",
    impact: "75k+ Organic Direct DM Outreaches",
    quote: "Social outreach and DM leads streamlined immediately into optimized lead CRM loops.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600&h=400",
    metrics: "75k+ organic impressions",
    icon: Globe,
    color: "from-purple-500/10 to-transparent",
    accent: "text-purple-400",
    serviceType: "Lead Gen",
    badges: ["75k+ DM Outreaches", "2.5x Bookings Up", "100% Attribution"],
    challenge: "Manual direct-message outreach and link-sharing with prospect coaches and athletes was tedious, impossible to audit, and did not sync with core sale targets.",
    solution: "Constructed dynamic workflow integrations connecting outbound tracking webhooks. Pushes social interactions, prospect attributes, and conversation histories instantly to CRM dashboards.",
    results: [
      "Automated and optimized tracking of over 75,000+ direct outreaches",
      "Unlocked 100% clear source attribution on high-ticket sales closures",
      "Coaching consultation bookings increased by 2.5x in less than 60 days"
    ]
  }
];

const categories = ["All", "CRM", "Lead Gen", "E-Commerce", "Operations"];

const SkeletonCaseCard = () => {
  return (
    <div className="relative flex flex-col justify-between min-h-[530px] h-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-6 md:p-8 backdrop-blur-md overflow-hidden animate-pulse">
      {/* Glare-like top highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div>
        {/* Mock image block */}
        <div className="relative h-44 w-full overflow-hidden rounded-xl bg-zinc-900/60 mb-6 shrink-0 flex items-center justify-between p-3">
          <div className="h-6 w-24 bg-zinc-800/80 rounded-full" />
          <div className="h-6 w-16 bg-zinc-800/80 rounded-full self-end" />
        </div>
        
        {/* Brand Label & Title */}
        <div className="space-y-1.5 mb-3">
          <div className="h-3 w-16 bg-zinc-800/80 rounded" />
          <div className="h-6 w-3/4 bg-zinc-800/80 rounded" />
        </div>
        
        {/* Row of Success Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4 shrink-0">
          <div className="h-5 w-16 bg-emerald-950/20 border border-emerald-900/10 rounded-full" />
          <div className="h-5 w-20 bg-emerald-950/20 border border-emerald-900/10 rounded-full" />
          <div className="h-5 w-14 bg-emerald-950/20 border border-emerald-900/10 rounded-full" />
        </div>
        
        {/* Professional Quote */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-zinc-800/40 rounded" />
          <div className="h-3 w-5/6 bg-zinc-800/40 rounded" />
        </div>
      </div>

      {/* Footer action detail */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between shrink-0">
        <div className="h-4 w-28 bg-zinc-800/40 rounded" />
        <div className="h-8 w-24 bg-zinc-900 border border-zinc-800/50 rounded-lg" />
      </div>
    </div>
  );
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  show: (idx: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 18,
      delay: idx * 0.12,
    }
  })
};

export function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [activeCase, setActiveCase] = useState<typeof cases[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Trigger loading on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  // Handler for category filter clicks to simulate perceived performance
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowAll(false);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Disable background body scrolling when modal is active
  useEffect(() => {
    if (activeCase) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeCase]);

  // Filter cases based on chosen category
  const filteredCases = selectedCategory === "All"
    ? cases
    : cases.filter(c => c.serviceType === selectedCategory);

  // Show the top 3 of the filtered cases by default, and expand on click
  const visibleCases = showAll ? filteredCases : filteredCases.slice(0, 3);

  return (
    <section
      id="case-studies"
      className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-col gap-16"
      >
        {/* Top interactive brand client grid */}
        <motion.div
          variants={fadeUp}
          className="w-full"
        >
          <PixelLogoGrid 
            heading="Brands that trust us" 
            subheading="From global brands to fast-scaling local leaders, we build digital systems that succeed"
            badge="Case Studies" 
          />
        </motion.div>

        {/* Content Section: Case Studies Cards Grid */}
        <div className="flex flex-col gap-10">
          <motion.div 
            variants={fadeUp}
            className="flex flex-col gap-3 max-w-3xl items-center text-center mx-auto mb-12"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 font-mono">
              Proven Impact Showcase
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              <HyperText text="Deep Dive Case Studies" className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white inline-block" />
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-400 max-w-2xl mt-1.5 font-medium">
              Explore concrete examples of how we automated operations and supercharged conversion workflows for each specific niche.
            </p>
          </motion.div>

          {/* Elegant Category Filter Tabs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center md:justify-start gap-2 border-b border-zinc-900 pb-6"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    if (selectedCategory !== category) {
                      handleCategoryChange(category);
                    }
                  }}
                  className={`relative px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    isActive 
                      ? "text-emerald-400" 
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 rounded-full bg-emerald-950/60 border border-emerald-500/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                // Display exactly the number of matching items to avoid Layout Shift
                Array.from({ length: visibleCases.length || 3 }).map((_, sIdx) => (
                  <motion.div
                    key={`skeleton-case-${sIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SkeletonCaseCard />
                  </motion.div>
                ))
              ) : (
                visibleCases.map((c, idx) => {
                const IconComponent = c.icon;
                return (
                  <motion.div
                    key={c.brand}
                    layout
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setActiveCase(c)}
                    className="group relative flex flex-col justify-between min-h-[530px] h-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/40 cursor-pointer hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7),_0_0_40px_rgba(16,185,129,0.05)]"
                  >
                    {/* Glowing Accent Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${c.color} opacity-30 rounded-2xl transition-opacity duration-300 group-hover:opacity-50 pointer-events-none`} />

                    <div>
                      {/* Grid Item Header Card Picture */}
                      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900 mb-6 shrink-0">
                        <img
                          src={c.image}
                          alt={c.brand}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                        
                        {/* Dynamic category badge */}
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                          <IconComponent className={`w-3.5 h-3.5 ${c.accent}`} />
                          {c.brand}
                        </span>

                        <span className="absolute bottom-3 right-3 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 rounded-md py-0.5 backdrop-blur-md">
                          {c.metrics}
                        </span>
                      </div>

                      {/* Brand Label & Title */}
                      <div className="space-y-1 mb-3">
                        <span className={`text-xs font-semibold ${c.accent} tracking-wider uppercase`}>
                          {c.category}
                        </span>
                        <h4 className="text-xl font-bold text-white tracking-tight">
                          {c.impact}
                        </h4>
                      </div>

                      {/* Row of Success Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4 shrink-0">
                        {c.badges.map((badge, bIdx) => (
                          <span 
                            key={bIdx}
                            className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-950/45 border border-emerald-500/20 px-2 py-0.5 rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>

                      {/* Professional Quote */}
                      <p className="text-sm text-zinc-400 leading-relaxed italic">
                        "{c.quote}"
                      </p>
                    </div>

                    {/* Footer action detail */}
                    <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between relative z-30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCase(c);
                        }}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider cursor-pointer flex items-center gap-1 group/btn"
                      >
                        Read full story
                        <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                      </button>
                      <span className="text-xs text-zinc-400 font-medium bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800/80">
                        Verified Result
                      </span>
                    </div>
                  </motion.div>
                );
              }))}
            </AnimatePresence>
          </div>

          {/* Expand Toggle Button */}
          {filteredCases.length > 3 && (
            <motion.div 
              variants={fadeUp}
              className="flex justify-center mt-4 shrink-0"
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-semibold text-white transition-all duration-200 active:scale-95 shadow-lg group cursor-pointer"
              >
                {showAll ? (
                  <>
                    Show Less Case Studies
                    <ChevronUp className="w-4 h-4 text-emerald-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  </>
                ) : (
                  <>
                    Explore All {filteredCases.length} Case Studies
                    <ChevronDown className="w-4 h-4 text-emerald-400 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Modern High-Depth Interactive Detail Modal */}
      <AnimatePresence>
        {activeCase && (
          <div data-is-modal="true" className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6 overflow-hidden">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCase(null)}
              className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md cursor-zoom-out"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] z-10 scrollbar-thin scrollbar-thumb-zinc-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveCase(null)}
                className="absolute top-4 right-4 z-50 p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-4">
                {/* Visual Header / Left side */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                    <img
                      src={activeCase.image}
                      alt={activeCase.brand}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
                  </div>

                  {/* Badges Block */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                      {React.createElement(activeCase.icon, { className: `w-3.5 h-3.5 ${activeCase.accent}` })}
                      {activeCase.brand}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      {activeCase.metrics}
                    </span>
                  </div>

                  {/* Impact Summary Highlight */}
                  <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-xl">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Verified Client Impact</span>
                    <h5 className="text-lg font-bold text-white leading-snug">{activeCase.impact}</h5>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      This metric represents an audited outcome validated post-integration within the active production workspace.
                    </p>
                  </div>
                </div>

                {/* Narrative Details / Right side */}
                <div className="md:col-span-7 flex flex-col gap-6">
                  {/* Category & Niche */}
                  <div>
                    <span className={`text-xs font-semibold ${activeCase.accent} tracking-wider uppercase`}>
                      {activeCase.category}
                    </span>
                    <h4 className="text-2xl font-bold text-white tracking-tight mt-1">
                      Success Story Details
                    </h4>
                  </div>

                  {/* Challenge */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      The Challenge
                    </h5>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {activeCase.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      The Engineered Solution
                    </h5>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {activeCase.solution}
                    </p>
                  </div>

                  {/* Key Results Checklist */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Quantifiable Achievements
                    </h5>
                    <ul className="space-y-2">
                      {activeCase.results.map((result, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quotation */}
                  <div className="relative border-l-2 border-emerald-500/40 pl-4 py-1 italic text-sm text-zinc-400 leading-relaxed">
                    "{activeCase.quote}"
                    <span className="block text-xs font-semibold text-zinc-500 not-italic mt-2">
                      — Client Feedback, {activeCase.brand}
                    </span>
                  </div>

                  {/* CTA Engagement Block */}
                  <div className="mt-4 p-4 rounded-xl border border-emerald-500/10 bg-gradient-to-r from-emerald-950/20 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <h6 className="text-xs font-bold text-white uppercase tracking-wider">Ready for similar results?</h6>
                      <p className="text-[11px] text-zinc-400">Calculate potential ROI tailored specifically to your company metrics.</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveCase(null);
                        setTimeout(() => {
                          document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-full transition-colors cursor-pointer shrink-0"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      Analyze Potential ROI
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
