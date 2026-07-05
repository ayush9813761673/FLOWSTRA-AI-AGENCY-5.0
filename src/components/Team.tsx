import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { fadeUp, stagger } from "../constants";
import { Instagram, Linkedin, Award, ArrowUpRight } from "lucide-react";
import {
  CardHoverReveal,
  CardHoverRevealMain,
  CardHoverRevealContent,
} from "./ui/reveal-on-hover";
import { GradientCard } from "./ui/gradient-card-showcase";
import { HyperText } from "./ui/hyper-text";

interface TeamMember {
  image: string;
  name: string;
  role: string;
  bio: string;
  achievements: string[];
  instagram?: string;
  linkedin?: string;
}

const cardGradients = [
  { from: "#ffbc00", to: "#ff0058" },
  { from: "#03a9f4", to: "#ff0058" },
  { from: "#4dff03", to: "#00d0ff" },
];

const team: TeamMember[] = [
  {
    image: "/AYUSH YADAV.png",
    name: "Ayush Yadav",
    role: "Founder & CEO",
    bio: "5+ years architecting AI solutions and automation strategies for enterprise growth.",
    achievements: [
      "Architected 50+ enterprise AI pipelines, saving 10k+ hours",
      "Pioneered proprietary lead-scraping & routing systems",
      "Premier AI automation consultant & strategy architect"
    ],
    instagram: "https://www.instagram.com/ayush.yadav.ai/",
    linkedin: "https://www.linkedin.com/in/ayush-yadav-pro/",
  },
  {
    image: "/Piyush Yadav.png",
    name: "Piyush Yadav",
    role: "COO",
    bio: "5+ years streamlining business operations, scaling execution frameworks, and driving sustainable client growth.",
    achievements: [
      "Scaled client operations by 300% via unified automation",
      "Optimized delivery pipelines, cutting lead times by 65%",
      "Oversees global QA & service delivery standards"
    ],
    instagram: "https://www.instagram.com/piyush.yadav.ai/",
  },
  {
    image: "/Lavish Sharma.jpeg",
    name: "Lavish Sharma",
    role: "Client Success Manager",
    bio: "5+ years orchestrating scalable operations and high-converting outreach systems.",
    achievements: [
      "Delivered cold email flows with avg. 45% open rates",
      "Engineered automated inbox warmups & custom rotations",
      "Generated $2.5M+ in client pipeline through appointment systems"
    ],
    instagram: "https://www.instagram.com/lavish_sh30/",
  },
];

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 120, 
    rotateX: 25, 
    scale: 0.85, 
    filter: "blur(12px)" 
  },
  show: (idx: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 55,
      damping: 15,
      mass: 1,
      delay: idx * 0.18,
    },
  }),
};

interface TeamMemberCardProps {
  member: TeamMember;
  idx: number;
  grad: { from: string; to: string };
  key?: React.Key;
}

function TeamMemberCard({ member, idx, grad }: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinate values for 3D tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement to eliminate cursor jitter
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 22 });

  // Map coordinate bounds to rotation degrees (-10 to 10 for safe, natural 3D depth)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  // Map coordinate bounds to spotlight reflection position (from edge to edge)
  const spotlightX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);

  // Create responsive glass spotlight background template
  const spotlightBg = useMotionTemplate`radial-gradient(350px circle at ${spotlightX} ${spotlightY}, rgba(255,255,255,0.08) 0%, transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates to [-0.5, 0.5]
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleCardClick = () => {
    if (member.instagram) {
      window.open(member.instagram, "_blank");
    }
  };

  return (
    <motion.div
      custom={idx}
      variants={cardVariants}
      className="h-[32rem] min-w-[320px] max-w-[320px] md:min-w-[400px] md:max-w-[400px] perspective-[1000px] cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full transition-shadow duration-300"
      >
        <GradientCard
          gradientFrom={grad.from}
          gradientTo={grad.to}
          className="h-full w-full"
          contentClassName="bg-black/35 backdrop-blur-xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Glass glare dynamic overlay */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-10 rounded-2xl" 
            style={{ background: spotlightBg }} 
          />

          <CardHoverReveal className="h-full w-full rounded-2xl bg-transparent relative overflow-hidden group/card">
            <CardHoverRevealMain className="relative h-full w-full">
              <img
                src={member.image}
                alt={member.name}
                className={`inline-block size-full max-h-full max-w-full object-cover align-middle object-top transition-all duration-700 ease-out ${
                  isHovered ? "scale-105 opacity-100" : "scale-100 opacity-80"
                }`}
                referrerPolicy="no-referrer"
              />
              
              {/* Glass light glare sweeping on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.15] to-transparent -translate-x-full group-hover/gradient:translate-x-full transition-transform duration-[1200ms] ease-out pointer-events-none z-10" />
              
              {/* Top highlight mimicking glass bezel reflection */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
              
              {/* Glass refraction edge / border overlay */}
              <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none z-10" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
              
              {/* Bottom Details - slides out or fades out on hover to favor the reveal block */}
              <div className={`absolute bottom-6 left-6 right-6 transition-all duration-500 ease-in-out pointer-events-auto z-20 ${
                isHovered ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}>
                <h3 className="text-3xl font-bold text-white drop-shadow-md">
                  {member.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-medium text-[var(--accent-blue)] drop-shadow-md">
                    {member.role}
                  </p>
                  <span className="text-xs font-medium text-white/80 bg-white/10 border border-white/25 backdrop-blur-md py-1 px-2.5 rounded-full flex items-center gap-1 shadow-sm transition-all duration-300 hover:bg-white/20 active:scale-95">
                    <span>View More</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent-blue)] animate-pulse" />
                  </span>
                </div>
              </div>
            </CardHoverRevealMain>

            <CardHoverRevealContent className="space-y-4 rounded-2xl bg-black/75 backdrop-blur-3xl text-zinc-50 border border-white/15 w-[calc(100%-3rem)] p-8 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
              {/* Frosted shine inside the content card */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none rounded-2xl z-0" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-0" />
              
              <div className="relative z-10 space-y-4">
                {/* Header text with premium staggered animations */}
                <motion.div
                  animate={{
                    y: isHovered ? 0 : 15,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                >
                  <h3 className="text-3xl font-bold text-white">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-lg font-medium text-[var(--accent-blue)]">
                      {member.role}
                    </p>
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-[var(--accent-blue)] transition-colors pointer-events-auto cursor-pointer relative z-50 inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-[var(--accent-blue)] transition-colors pointer-events-auto cursor-pointer relative z-50 inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* Staggered Bio Text description */}
                <motion.p
                  animate={{
                    y: isHovered ? 0 : 20,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="text-sm text-white/90 leading-relaxed pt-1"
                >
                  {member.bio}
                </motion.p>

                {/* Staggered Achievements List */}
                <motion.div
                  animate={{
                    y: isHovered ? 0 : 25,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="space-y-2 border-t border-white/10 pt-3"
                >
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--accent-blue)] block">
                    Key Achievements
                  </span>
                  <ul className="space-y-1.5">
                    {member.achievements.map((achievement, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2 text-xs text-white/85">
                        <Award className="w-3.5 h-3.5 text-[var(--accent-blue)] shrink-0 mt-0.5" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </CardHoverRevealContent>
          </CardHoverReveal>
        </GradientCard>
      </motion.div>
    </motion.div>
  );
}

const SkeletonTeamCard = () => {
  return (
    <div className="h-[32rem] min-w-[320px] max-w-[320px] md:min-w-[400px] md:max-w-[400px] rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-8 flex flex-col justify-end overflow-hidden animate-pulse relative">
      {/* Outer border & glass glare */}
      <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Shimmering backdrop overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950/90 z-0" />
      
      <div className="relative z-10 space-y-4">
        {/* Mock Name */}
        <div className="h-8 w-2/3 bg-zinc-800/60 rounded-lg" />
        
        {/* Mock Role / Social row */}
        <div className="flex items-center gap-3">
          <div className="h-5 w-1/2 bg-zinc-800/40 rounded-md" />
          <div className="h-5 w-5 bg-zinc-800/40 rounded-full" />
          <div className="h-5 w-5 bg-zinc-800/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export function Team() {
  return (
    <section id="team" className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col gap-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-4 max-w-3xl items-center text-center mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            <HyperText
              text="Meet Our Team!"
              className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
              containerClassName="justify-center"
            />
          </h2>
          <motion.p
            variants={headingVariants}
            className="text-lg text-[var(--text-secondary)]"
          >
            The brilliant minds behind Nepal's most innovative AI lead
            generation solutions
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -50px 0px" }}
          className="flex flex-wrap justify-center gap-12 w-full px-4 md:px-0"
        >
          {team.map((member, idx) => {
            const grad = cardGradients[idx % cardGradients.length];
            return (
              <TeamMemberCard
                key={idx}
                member={member}
                idx={idx}
                grad={grad}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
