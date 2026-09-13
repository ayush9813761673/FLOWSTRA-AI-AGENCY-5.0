"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";
import { isCardElement } from "@/lib/soundEffects";

export function SmoothCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  // Raw instantaneous mouse coordinates (zero latency)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth, elegant trailing spring physics for the outer magnetic ring
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 400, mass: 0.12 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 400, mass: 0.12 });

  useEffect(() => {
    // Only activate on desktop pointer devices
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
      if (!e.matches) {
        document.documentElement.classList.remove("custom-cursor-active");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    }

    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        setIsVisible(true);
        document.documentElement.classList.add("custom-cursor-active");
      }

      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);

      const target = e.target as HTMLElement | null;
      if (target) {
        const textTarget = Boolean(
          target.closest("input, textarea, [contenteditable='true'], [role='textbox']")
        );
        const clickable = Boolean(
          target.closest("button, a, select, [role='button'], [tabindex='0'], .cursor-pointer")
        );
        const card = isCardElement(target);

        setIsTextInput(textTarget);
        setIsHoveringClickable(clickable && !textTarget);
        setIsHoveringCard(card && !clickable && !textTarget);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
      document.documentElement.classList.remove("custom-cursor-active");
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      document.documentElement.classList.add("custom-cursor-active");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      }
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isFinePointer) return null;

  // Over text inputs, hide the custom cursor completely so the native text I-beam is 100% visible and un-obscured
  const showCustomCursor = isVisible && !isTextInput;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-150 ${
        showCustomCursor ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Smooth Trailing Follower Ring */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHoveringClickable ? 44 : isHoveringCard ? 36 : 24,
          height: isHoveringClickable ? 44 : isHoveringCard ? 36 : 24,
          scale: isClicking ? 0.8 : 1,
          borderColor: isHoveringClickable
            ? "rgba(59, 130, 246, 0.6)"
            : isHoveringCard
            ? "rgba(96, 165, 250, 0.4)"
            : "rgba(59, 130, 246, 0.3)",
          backgroundColor: isHoveringClickable
            ? "rgba(59, 130, 246, 0.08)"
            : isHoveringCard
            ? "rgba(59, 130, 246, 0.04)"
            : "transparent",
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 28,
        }}
        className="rounded-full border pointer-events-none transition-colors duration-200"
      />

      {/* Instantaneous Hardware-Synced Core Dot (Zero-Latency Pointer) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.5 : isHoveringClickable ? 0.5 : 1,
          opacity: isHoveringClickable ? 0.4 : 1,
        }}
        transition={{ duration: 0.1 }}
        className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-white shadow-[0_0_8px_rgba(59,130,246,0.9)] pointer-events-none"
      />
    </div>
  );
}

export default SmoothCursor;
