"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from "motion/react";

export interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  innerParallax?: boolean;
}

export function MagneticButton({
  children,
  className = "",
  magneticStrength = 0.35,
  innerParallax = true,
  onClick,
  disabled,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Position motion values for container
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Physics springs with high responsiveness and low mass for a lively magnetic feel
  const springConfig = { damping: 18, stiffness: 220, mass: 0.4 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  // Subtle 3D tilt rotation derived from magnetic pull
  const rotateX = useTransform(y, [-16, 16], [5, -5]);
  const rotateY = useTransform(x, [-16, 16], [-5, 5]);

  // Optional subtle parallax displacement for inner text / icons
  const textX = useTransform(x, (val) => val * 0.45);
  const textY = useTransform(y, (val) => val * 0.45);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;

    // Constrain max magnetic pull to keep it refined and natural
    const maxPull = 16;
    const clampedX = Math.max(-maxPull, Math.min(maxPull, deltaX));
    const clampedY = Math.max(-maxPull, Math.min(maxPull, deltaY));

    rawX.set(clampedX);
    rawY.set(clampedY);
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      {...props}
    >
      {/* Dynamic specular glow follower when hovered */}
      {isHovered && (
        <motion.span
          layoutId="magnetic-glow"
          className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/25 to-blue-400/20 blur-md pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.15 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {innerParallax ? (
        <motion.span
          style={{ x: textX, y: textY, transform: "translateZ(8px)" }}
          className="inline-flex items-center justify-center w-full h-full pointer-events-none"
        >
          {children}
        </motion.span>
      ) : (
        children
      )}
    </motion.button>
  );
}
