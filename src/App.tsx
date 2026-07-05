import React from "react";
import { Navbar } from "@/components/ui/mini-navbar";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { TrustedBy } from "./components/TrustedBy";
import { CaseStudies } from "./components/CaseStudies";
import { Features } from "./components/Features";
import { ToolsWeUse } from "./components/ToolsWeUse";
import { Testimonials } from "./components/Testimonials";
import { Calculator } from "./components/Calculator";
import { Pricing } from "./components/Pricing";
import { Team } from "./components/Team";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { ExitIntentModal } from "./components/ExitIntentModal";
import { AutomationAuditModal } from "./components/AutomationAuditModal";
import { SectionDivider } from "@/components/ui/section-divider";
import { AmbientMusicPlayer } from "@/components/ui/ambient-music-player";
import { DynamicSEO } from "./components/DynamicSEO";

import { GradientBackground } from "@/components/ui/paper-design-shader-background";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export default function App() {
  return (
    <div className="min-h-screen selection:bg-[var(--accent-blue)] selection:text-white overflow-x-hidden">
      <DynamicSEO />
      <ScrollProgress />
      <SmoothCursor />
      <GradientBackground />
      <Navbar />
      <main>
        <div className="relative w-full">
          <CinematicHero
            brandName="Flowstra"
            tagline1="Automate your flow,"
            tagline2="Get more Clients."
            className="pt-20 pb-16"
          />
          <TrustedBy />
        </div>
        <SectionDivider glowColor="rgba(59, 130, 246, 0.12)" />
        <CaseStudies />
        <SectionDivider glowColor="rgba(16, 185, 129, 0.08)" />
        <Testimonials />
        <SectionDivider glowColor="rgba(99, 102, 241, 0.08)" />
        <ToolsWeUse />
        <SectionDivider glowColor="rgba(59, 130, 246, 0.1)" />
        <Features />
        <SectionDivider glowColor="rgba(168, 85, 247, 0.08)" />
        <Team />
        <SectionDivider glowColor="rgba(59, 130, 246, 0.1)" />
        <Calculator />
        <SectionDivider glowColor="rgba(16, 185, 129, 0.08)" />
        <Pricing />
        <SectionDivider glowColor="rgba(99, 102, 241, 0.12)" />
        <FinalCTA />
      </main>
      <Footer />
      <ExitIntentModal />
      <AutomationAuditModal />
      <AmbientMusicPlayer />
    </div>
  );
}
