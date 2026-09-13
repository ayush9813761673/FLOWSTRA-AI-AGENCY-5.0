"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Music, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AmbientMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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
      fadeVolume(1, 1000);
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

  // Handle custom toggle-music event
  useEffect(() => {
    const handleToggle = () => {
      if (audioRef.current) {
        if (isPlaying) {
          fadeVolume(0, 800, () => {
            audioRef.current?.pause();
          });
          setIsPlaying(false);
        } else {
          audioRef.current.volume = 0;
          audioRef.current.play().catch(() => {});
        }
      }
    };

    window.addEventListener("toggle-ambient-music", handleToggle);
    return () => {
      window.removeEventListener("toggle-ambient-music", handleToggle);
    };
  }, [isPlaying, fadeVolume]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (audioRef.current) {
      if (isPlaying) {
        fadeVolume(0, 800, () => {
          audioRef.current?.pause();
        });
        setIsPlaying(false);
      } else {
        audioRef.current.volume = 0;
        audioRef.current.play().catch((err) => {
          console.log("Audio play blocked:", err);
        });
      }
    }
  };

  return (
    <>
      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src="/bg-music.mp3"
        loop
        preload="none"
      />

      {/* Floating Corner Ambient Sound Toggle (Bottom Left, safely above dock on mobile) */}
      <div className="fixed bottom-24 sm:bottom-6 left-4 sm:left-6 z-[90] pointer-events-auto select-none">
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={togglePlay}
          className={`flex items-center gap-2 sm:gap-2.5 p-2 sm:px-3 sm:py-2 rounded-full border transition-all duration-300 backdrop-blur-xl shadow-lg cursor-pointer active:scale-95 ${
            isPlaying
              ? "bg-blue-600/20 border-blue-500/40 text-blue-400 shadow-blue-500/10 ring-1 ring-blue-500/30"
              : "bg-[var(--surface)]/80 border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--card-border-hover)]"
          }`}
          title={isPlaying ? "Pause ambient soundscape" : "Play ambient focus soundscape"}
          aria-label={isPlaying ? "Pause ambient soundscape" : "Play ambient focus soundscape"}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            isPlaying ? "bg-blue-500 text-white" : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
          }`}>
            {isPlaying ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current ml-0.5" />
            )}
          </div>

          <span className="hidden sm:inline text-[11px] font-medium tracking-wide">
            {isPlaying ? "Soundscape On" : "Soundscape"}
          </span>

          {isPlaying && (
            <div className="hidden sm:flex items-end gap-0.5 h-3 pr-1">
              <span className="w-[2px] bg-blue-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" style={{ height: "100%" }} />
              <span className="w-[2px] bg-blue-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" style={{ height: "60%" }} />
              <span className="w-[2px] bg-blue-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite]" style={{ height: "80%" }} />
            </div>
          )}
        </motion.button>
      </div>
    </>
  );
}

