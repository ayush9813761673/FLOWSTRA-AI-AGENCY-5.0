"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MagneticCard({ children, className = "" }: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize motion values for cursor/finger displacement and tap scaling
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // Create ultra-smooth springs for fluid motion
  const springX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.8 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 22 });

  // Map spring values to subtle 3D tilt rotation for tactile depth
  const rotateX = useTransform(springY, [-22, 22], [7, -7]);
  const rotateY = useTransform(springX, [-22, 22], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate mouse offset relative to card center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Subtle magnetic bounds (max displacement of 22px)
    const maxDisplacement = 22;
    const pullX = (distanceX / (rect.width / 2)) * maxDisplacement;
    const pullY = (distanceY / (rect.height / 2)) * maxDisplacement;

    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    // Reset back to center with spring ease
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = touch.clientX - centerX;
    const distanceY = touch.clientY - centerY;

    // Slightly gentler displacement on mobile (max 12px)
    const maxDisplacement = 12;
    const pullX = (distanceX / (rect.width / 2)) * maxDisplacement;
    const pullY = (distanceY / (rect.height / 2)) * maxDisplacement;

    x.set(pullX);
    y.set(pullY);
    scale.set(0.97); // Slight tactile compression on press
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Follow the finger if it's still within the card's boundary
    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      const distanceX = touch.clientX - centerX;
      const distanceY = touch.clientY - centerY;
      const maxDisplacement = 12;
      const pullX = (distanceX / (rect.width / 2)) * maxDisplacement;
      const pullY = (distanceY / (rect.height / 2)) * maxDisplacement;

      x.set(pullX);
      y.set(pullY);
    } else {
      // Soft release if touch moves outside the bounds
      x.set(0);
      y.set(0);
      scale.set(1);
    }
  };

  const handleTouchEnd = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="inline-block w-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          x: springX,
          y: springY,
          scale: springScale,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`${className} transition-shadow duration-300`}
      >
        <div style={{ transform: "translateZ(10px)" }} className="w-full h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

