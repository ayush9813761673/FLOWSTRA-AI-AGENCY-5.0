"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Music, Volume2, VolumeX, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AmbientMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // starts false until played
  const [showTip, setShowTip] = useState(false);
  const [showIntroGate, setShowIntroGate] = useState(true);

  // Set global state and dispatch event when intro gate is dismissed
  useEffect(() => {
    if (!showIntroGate) {
      (window as any).__flowstraIntroGateDismissed = true;
      document.dispatchEvent(new CustomEvent("flowstra-experience-start"));
    }
  }, [showIntroGate]);

  // Lock scroll on the body and html root until user dismisses the intro gate
  useEffect(() => {
    if (showIntroGate) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showIntroGate]);

  // Smoothly transition audio volume to target level over a specified duration (in ms)
  const fadeVolume = useCallback((targetVolume: number, duration: number, callback?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    const startVolume = audio.volume;
    const volumeDifference = targetVolume - startVolume;
    const stepTime = 30; // 30ms intervals for high fluid resolution
    const totalSteps = duration / stepTime;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      const ratio = currentStep / totalSteps;
      const nextVolume = startVolume + volumeDifference * ratio;
      
      audio.volume = Math.max(0, Math.min(1, nextVolume));

      if (currentStep >= totalSteps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        audio.volume = targetVolume;
        if (callback) callback();
      }
    }, stepTime);
  }, []);

  // Synchronize audio state with UI states
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setHasInteracted(true);
      // Fade in smoothly from current volume to 1 over 1200ms
      fadeVolume(1, 1200);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [fadeVolume]);

  // Handler for entering the experience via screen tap or button click
  const handleEnter = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setShowIntroGate(false);
    setHasInteracted(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0;
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Audio failed to start on gate tap:", err.message);
        });
    }
  }, []);

  // Auto-play / Gesture unlock listener as secondary fallback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let isAttempting = false;

    // Resume playback handler when user interacts with the page
    const resumePlayback = () => {
      if (audio && audio.paused && !isAttempting) {
        isAttempting = true;
        // Set initial volume to 0 to prepare for the gentle fade-in
        audio.volume = 0;
        audio.play()
          .then(() => {
            console.log("Audio started successfully via user interaction.");
            removeEngagementListeners();
            setShowIntroGate(false); // Dismiss gate automatically on first successful background play
          })
          .catch((err) => {
            console.log("Playback attempt on interaction blocked:", err.message);
          })
          .finally(() => {
            isAttempting = false;
          });
      }
    };

    const removeEngagementListeners = () => {
      document.removeEventListener("click", resumePlayback);
      document.removeEventListener("mousemove", resumePlayback);
    };

    const addEngagementListeners = () => {
      document.addEventListener("click", resumePlayback, { passive: true });
      document.addEventListener("mousemove", resumePlayback, { passive: true });
    };

    // Set volume to 0 prior to autoplay check for a potential fade-in
    audio.volume = 0;
    // Attempt automatic playback request immediately upon component mount
    audio.play()
      .then(() => {
        console.log("Immediate automatic playback succeeded!");
        setShowIntroGate(false); // If immediate play works, we can enter directly
      })
      .catch((error) => {
        console.log("Immediate automatic playback was blocked by browser. Setting up resume listeners.", error.message);
        // If initial attempt is blocked, add listeners to document 'click' or 'mousemove' events
        addEngagementListeners();
      });

    // Show the helpful short message after a 3 second delay
    const showTimer = setTimeout(() => {
      setShowTip(true);
    }, 3000);

    // Auto-hide the non-intrusive message 6 seconds after showing (9 seconds total)
    const hideTimer = setTimeout(() => setShowTip(false), 9000);

    return () => {
      removeEngagementListeners();
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(true);
    
    if (audioRef.current) {
      if (isPlaying) {
        // Fade out to 0 over 1000ms, then pause the physical element
        fadeVolume(0, 1000, () => {
          audioRef.current?.pause();
        });
        setIsPlaying(false); // Update UI instantly for premium responsiveness
        setShowTip(true);
        setTimeout(() => setShowTip(false), 4000);
      } else {
        // Set volume to 0, start playing, and the handlePlay hook will fade it back to 1
        audioRef.current.volume = 0;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const closeTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTip(false);
  };

  return (
    <>
      {/* Premium Cinematic Glassmorphic Intro Gate (Ensures 100% reliable autoplay on tap) */}
      <AnimatePresence>
        {showIntroGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            exit={{ 
              opacity: 0, 
              scale: 1.12,
              filter: "blur(12px)",
              transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } 
            }}
            onClick={() => handleEnter()}
            className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-transparent text-white p-6 cursor-pointer select-none overflow-hidden"
            style={{
              backdropFilter: 'url("#gate-glass-filter") blur(32px)',
              WebkitBackdropFilter: 'url("#gate-glass-filter") blur(32px)'
            }}
          >
            {/* Interactive Liquid Glass SVG Filter */}
            <svg className="absolute w-0 h-0 opacity-0 pointer-events-none">
              <defs>
                <filter id="gate-glass-filter" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
                  <feTurbulence type="fractalNoise" baseFrequency="0.015 0.015" numOctaves="2" seed="42" result="noise" />
                  <feGaussianBlur in="noise" stdDeviation="4" result="blurredNoise" />
                  <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="40" xChannelSelector="R" yChannelSelector="B" result="displaced" />
                  <feComposite in="displaced" in2="displaced" operator="over" />
                </filter>
              </defs>
            </svg>

            {/* High-Tech Flowstra Vector grid background inside the gate */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70 pointer-events-none" />

            {/* Slow Moving Organic Liquid Orbs (Refracted & warped beautifully by the gate-glass-filter) */}
            <motion.div 
              animate={{ 
                x: [-150, 150, -150], 
                y: [-120, 120, -120], 
                scale: [1, 1.2, 1] 
              }} 
              exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.9 } }}
              transition={{ 
                duration: 16, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }} 
              className="absolute h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" 
            />
            <motion.div 
              animate={{ 
                x: [150, -150, 150], 
                y: [120, -120, 120], 
                scale: [1.15, 0.9, 1.15] 
              }} 
              exit={{ opacity: 0, scale: 1.4, transition: { duration: 0.9 } }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }} 
              className="absolute h-[450px] w-[450px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" 
            />
            <motion.div 
              animate={{ 
                x: [80, -80, 80], 
                y: [-80, 80, -80], 
                scale: [0.9, 1.1, 0.9] 
              }} 
              exit={{ opacity: 0, scale: 1.3, transition: { duration: 0.9 } }}
              transition={{ 
                duration: 24, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }} 
              className="absolute h-[350px] w-[350px] rounded-full bg-emerald-500/8 blur-[110px] pointer-events-none" 
            />

            {/* Subtle Liquid Vignette Edge Overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#030307]/60 pointer-events-none" />

            <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center gap-10">
              {/* Logo / Brand Header with Glass Shine Drop Shadow */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40, scale: 0.95, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="text-3xl sm:text-4xl font-light tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-white drop-shadow-[0_0_20px_rgba(59,130,246,0.35)] font-sans">
                  FLOWSTRA
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-mono font-medium opacity-90">
                  Intelligent AI Automation
                </span>
              </motion.div>

              {/* Central Glowing 3D Liquid Glass Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 50, filter: "blur(8px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ delay: 0.3, duration: 1, type: "spring", stiffness: 80, damping: 20 }}
                className="w-full rounded-3xl border border-white/10 bg-[#0d0d18]/25 p-9 relative overflow-hidden group hover:border-white/20 transition-all duration-500 shadow-[0_0_25px_rgba(255,255,255,0.01),0_15px_45px_rgba(0,0,0,0.6),inset_1px_1px_0px_0px_rgba(255,255,255,0.12),inset_-1px_-1px_0px_0px_rgba(255,255,255,0.03),inset_0_0_15px_15px_rgba(255,255,255,0.015)] backdrop-blur-xl"
              >
                {/* Gloss/Refraction shine sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-out pointer-events-none" />
                
                <h2 className="text-2xl font-light tracking-tight text-slate-100 mb-2.5 font-sans">
                  Unlock the Soundscape
                </h2>
                
                <p className="text-[13px] text-slate-400 leading-relaxed max-w-[290px] mx-auto mb-9 font-inter">
                  We have designed a customized, procedural ambient flow to accompany your automated pipelines and system audits.
                </p>

                {/* Pulse Tap Button with Premium Liquid Shadow Effect */}
                <div className="relative flex flex-col items-center gap-3.5">
                  <div className="absolute -inset-1.5 rounded-full bg-blue-500/25 blur-lg opacity-80 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                  <button className="relative w-full max-w-[210px] bg-white text-[#05050a] text-xs font-semibold py-4 px-7 rounded-full tracking-wider hover:bg-blue-600 hover:text-white hover:scale-105 transition-all duration-300 shadow-[0_4px_16px_rgba(255,255,255,0.1)] hover:shadow-blue-500/35 active:scale-95 flex items-center justify-center gap-2.5">
                    <Volume2 className="h-4.5 w-4.5" />
                    ENTER PLATFORM
                  </button>
                  
                  <span className="text-[9px] text-slate-500 tracking-[0.2em] font-mono mt-1.5 uppercase">
                    [ Tap anywhere to unmute ]
                  </span>
                </div>
              </motion.div>

              {/* Elegant Footnote */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.55, y: 0 }}
                exit={{ opacity: 0, y: 30, transition: { duration: 0.7 } }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-[10px] text-slate-500 tracking-widest uppercase font-mono"
              >
                FLOWSTRA STUDIO DESIGN • STEREO ENABLED
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto flex flex-col-reverse items-center gap-2.5 max-w-[calc(100vw-32px)]">
        {/* Hidden Audio Player */}
        <audio
          ref={audioRef}
          src="/bg-music.mp3"
          loop
          preload="auto"
        />

        {/* Floating Compact Glassmorphic Audio Controller (Dynamic Island Styled) */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={togglePlay}
          className="relative flex items-center gap-2.5 rounded-full border border-white/20 px-3 py-2 text-white select-none active:scale-[0.95] hover:scale-[1.03] cursor-pointer transition-all duration-300"
          style={{
            backdropFilter: 'url("#ambient-glass-filter") blur(16px)',
            WebkitBackdropFilter: 'url("#ambient-glass-filter") blur(16px)'
          }}
          title={isPlaying ? "Pause Ambient Music" : "Play Ambient Music"}
        >
          {/* Dynamic Liquid Glass Shadow Layer */}
          <div className="absolute inset-0 rounded-full z-0 pointer-events-none 
            shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.2),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.7),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.5),inset_0_0_6px_6px_rgba(255,255,255,0.1),inset_0_0_2px_2px_rgba(255,255,255,0.05),0_0_12px_rgba(255,255,255,0.1)] 
            bg-white/[0.04]" 
          />

          {/* Content over the glass */}
          <div className="relative z-10 flex items-center gap-2.5">
            {/* Play/Pause Minimalist Icon */}
            <div className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
              isPlaying ? "bg-white/10 text-blue-400" : "bg-blue-600 text-white shadow-md shadow-blue-600/20"
            }`}>
              {isPlaying ? (
                <Pause className="h-3 w-3 fill-current" />
              ) : (
                <Play className="h-3 w-3 fill-current ml-0.5" />
              )}
            </div>

            {/* Small Music Symbol & Animated Waveform */}
            <div className="flex items-center justify-center h-7 px-1.5 border-l border-white/10 gap-1.5">
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-2 w-3.5">
                  <span className="w-[1.2px] bg-blue-400 rounded-full animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ height: "100%", animationDelay: "0.1s" }} />
                  <span className="w-[1.2px] bg-blue-400 rounded-full animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ height: "50%", animationDelay: "0.3s" }} />
                  <span className="w-[1.2px] bg-blue-400 rounded-full animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ height: "80%", animationDelay: "0.2s" }} />
                </div>
              ) : (
                <Music className="h-3.5 w-3.5 text-slate-400" />
              )}
            </div>
          </div>

          {/* Glass SVG Displacement Filter */}
          <svg className="absolute w-0 h-0 opacity-0 pointer-events-none">
            <defs>
              <filter
                id="ambient-glass-filter"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.04 0.04"
                  numOctaves="1"
                  seed="1"
                  result="noise"
                />
                <feGaussianBlur in="noise" stdDeviation="1" result="blurredNoise" />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="blurredNoise"
                  scale="15"
                  xChannelSelector="R"
                  yChannelSelector="B"
                  result="displaced"
                />
                <feComposite in="displaced" in2="displaced" operator="over" />
              </filter>
            </defs>
          </svg>
        </motion.div>

        {/* Elegant, Non-Intrusive Tooltip Hint (Properly bounded on mobile screens, floats above the controller) */}
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="relative rounded-2xl border border-white/15 bg-slate-950/95 backdrop-blur-md p-3.5 shadow-2xl max-w-[280px] text-center overflow-hidden group"
            >
              <button 
                onClick={closeTip}
                className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-white/5"
              >
                <X className="h-3 w-3" />
              </button>
              <p className="text-[11px] leading-relaxed text-slate-300 pr-5">
                🎵 You can pause music here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

