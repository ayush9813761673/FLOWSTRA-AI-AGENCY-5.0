import React, { useEffect } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/ui/mini-navbar";
import { FloatingDock } from "@/components/ui/floating-dock";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { TrustedBy } from "./components/TrustedBy";
import { SocialProofCounters } from "./components/SocialProofCounters";
import { Features } from "./components/Features";
import { ToolsWeUse } from "./components/ToolsWeUse";
import { Testimonials } from "./components/Testimonials";
import { Calculator } from "./components/Calculator";
import { WorkspaceAutomation } from "./components/WorkspaceAutomation";
import { Pricing } from "./components/Pricing";
import { Team } from "./components/Team";
import { FAQ } from "./components/FAQ";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { AutomationAuditModal } from "./components/AutomationAuditModal";
import { SectionDivider } from "@/components/ui/section-divider";
import { AmbientMusicPlayer } from "@/components/ui/ambient-music-player";
import { DynamicSEO } from "./components/DynamicSEO";
import { BackToTop } from "./components/BackToTop";
import { KeyboardNavigation } from "./components/KeyboardNavigation";
import { initGlobalClickSound } from "@/lib/soundEffects";

import { GradientBackground } from "@/components/ui/paper-design-shader-background";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { LanguageTransitionOverlay } from "@/components/ui/LanguageTransitionOverlay";
import { LanguageDetectionToast } from "@/components/ui/LanguageDetectionToast";

export default function App() {
  useEffect(() => {
    const cleanupSounds = initGlobalClickSound();
    return () => {
      cleanupSounds();
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen selection:bg-[var(--accent-blue)] selection:text-white overflow-x-hidden transition-colors duration-300">
          <DynamicSEO />
          <LanguageTransitionOverlay />
          <ScrollProgress />
          <SmoothCursor />
          <GradientBackground />
          <Navbar />
          <FloatingDock />
          <main>
            <div className="relative w-full">
              <CinematicHero brandName="Flowstra" />
              <div className="mt-20 sm:mt-28 md:mt-36 mb-16 sm:mb-24">
                <TrustedBy />
              </div>
              <div className="mt-8 sm:mt-12 mb-24 sm:mb-32">
                <SocialProofCounters />
              </div>
            </div>
            <SectionDivider glowColor="rgba(59, 130, 246, 0.12)" />
            <Calculator />
            <SectionDivider glowColor="rgba(16, 185, 129, 0.1)" />
            <WorkspaceAutomation />
            <SectionDivider glowColor="rgba(99, 102, 241, 0.1)" />
            <Testimonials />
            <SectionDivider glowColor="rgba(59, 130, 246, 0.1)" />
            <Features />
            <SectionDivider glowColor="rgba(168, 85, 247, 0.08)" />
            <ToolsWeUse />
            <SectionDivider glowColor="rgba(59, 130, 246, 0.1)" />
            <Team />
            <SectionDivider glowColor="rgba(99, 102, 241, 0.12)" />
            <Pricing />
            <SectionDivider glowColor="rgba(59, 130, 246, 0.1)" />
            <FAQ />
            <SectionDivider glowColor="rgba(99, 102, 241, 0.12)" />
            <FinalCTA />
          </main>
          <Footer />
          <AutomationAuditModal />
          <LanguageDetectionToast />
          <AmbientMusicPlayer />
          <BackToTop />
          <KeyboardNavigation />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
