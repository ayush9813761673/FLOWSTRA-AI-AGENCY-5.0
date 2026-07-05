"use client";

import { motion, useMotionValue } from "motion/react";
import { FC, useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
}

const DefaultCursorSVG: FC<{
  isHovered: boolean;
  isText: boolean;
}> = ({ isHovered, isText }) => {
  if (isText) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={30}
        viewBox="0 0 20 30"
        fill="none"
      >
        {/* Glow behind the I-beam */}
        <line
          x1={10}
          y1={5}
          x2={10}
          y2={25}
          stroke="var(--accent-blue, #3b82f6)"
          strokeWidth={4}
          strokeLinecap="round"
          className="opacity-40 blur-[2px]"
        />
        {/* Main text vertical cursor line */}
        <line
          x1={10}
          y1={5}
          x2={10}
          y2={25}
          stroke="var(--accent-blue, #3b82f6)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Top horizontal crossbar */}
        <line
          x1={6}
          y1={5}
          x2={14}
          y2={5}
          stroke="var(--accent-blue, #3b82f6)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Bottom horizontal crossbar */}
        <line
          x1={6}
          y1={25}
          x2={14}
          y2={25}
          stroke="var(--accent-blue, #3b82f6)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{
        scale: isHovered ? 0.65 : 0.5,
        transition: "scale 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill={isHovered ? "var(--accent-blue, #3b82f6)" : "black"}
          style={{ transition: "fill 0.2s ease" }}
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.0221 40.0147 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export function SmoothCursor({}: SmoothCursorProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // High-performance Framer Motion motion values for buttery custom animation loop
  const currentX = useMotionValue(0);
  const currentY = useMotionValue(0);
  const currentScaleX = useMotionValue(0);
  const currentScaleY = useMotionValue(0);
  const currentRotation = useMotionValue(0);
  const currentOpacity = useMotionValue(0);

  // Touch device check & auto-disable custom cursor on touch screens
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    const handleFirstTouch = () => {
      setIsTouchDevice(true);
    };
    window.addEventListener("touchstart", handleFirstTouch, { once: true });

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("touchstart", handleFirstTouch);
    };
  }, []);

  // Inject CSS rules to hide OS cursor globally for pristine seamless layout
  useEffect(() => {
    if (isTouchDevice) {
      document.body.style.cursor = "auto";
      return;
    }

    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      if (styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [isTouchDevice]);

  // RequestAnimationFrame high-performance loop for organic buttery motion physics
  useEffect(() => {
    if (isTouchDevice) return;

    let rafId: number;

    const tick = () => {
      const targetX = mouseX.current;
      const targetY = mouseY.current;

      const dx = targetX - currentX.get();
      const dy = targetY - currentY.get();

      const distance = Math.sqrt(dx * dx + dy * dy);

      // Adaptive interpolation: slide like butter on open tracks, snap instantly on elements/clicks
      let factor = 0.11; // Deliciously smooth default lerp
      if (isPressed) {
        factor = 0.45; // Super crisp instant click feedback
      } else if (isHoveringInteractive) {
        factor = 0.26; // High responsiveness to guarantee button clicking precision
      } else if (isHoveringText) {
        factor = 0.32; // Snappy transition over input fields
      }

      // Update positions
      const nextX = currentX.get() + dx * factor;
      const nextY = currentY.get() + dy * factor;
      currentX.set(nextX);
      currentY.set(nextY);

      // Calculate real frame speed for organic stretch-and-squash physics
      const frameSpeed = distance * factor;
      const stretchFactor = isHoveringText ? 0 : Math.min(frameSpeed * 0.015, 0.42);

      // Rotate cursor to align beautifully with direction of movement
      if (frameSpeed > 0.4 && !isHoveringText) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        let diff = targetAngle - currentRotation.get();

        // Normalize rotation angle difference to [-180, 180] to avoid wild spins
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;

        const rotationFactor = isHoveringInteractive ? 0.25 : 0.14;
        currentRotation.set(currentRotation.get() + diff * rotationFactor);
      } else if (isHoveringText) {
        currentRotation.set(currentRotation.get() + (0 - currentRotation.get()) * 0.2);
      } else {
        // Smoothly decay rotation back to neutral 0 when stationary
        currentRotation.set(currentRotation.get() + (0 - currentRotation.get()) * 0.08);
      }

      // Compute dynamic visual scales for the buttery squishy effect
      let baseScale = 1.0;
      if (isPressed) {
        baseScale = 0.65;
      } else if (isHoveringText) {
        baseScale = 1.25;
      } else if (isHoveringInteractive) {
        baseScale = 1.45;
      }

      const targetScaleX = baseScale * (1 + stretchFactor);
      const targetScaleY = baseScale * (1 - stretchFactor * 0.5);

      currentScaleX.set(currentScaleX.get() + (targetScaleX - currentScaleX.get()) * 0.18);
      currentScaleY.set(currentScaleY.get() + (targetScaleY - currentScaleY.get()) * 0.18);

      // Smooth opacity fading
      const targetOpacity = isVisible && hasMoved ? 1 : 0;
      currentOpacity.set(currentOpacity.get() + (targetOpacity - currentOpacity.get()) * 0.16);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [
    isTouchDevice,
    isPressed,
    isHoveringInteractive,
    isHoveringText,
    isVisible,
    hasMoved,
    currentX,
    currentY,
    currentScaleX,
    currentScaleY,
    currentRotation,
    currentOpacity,
  ]);

  useEffect(() => {
    if (isTouchDevice) return;

    const smoothMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        currentX.set(e.clientX);
        currentY.set(e.clientY);
        setHasMoved(true);
      }
      if (!isVisible) {
        setIsVisible(true);
      }

      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveSelector =
        'a, button, select, [role="button"], .cursor-pointer, input[type="submit"], input[type="button"]';
      const textSelector =
        'input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input[type="search"], textarea, [contenteditable="true"]';

      const isInteractive = !!target.closest(interactiveSelector);
      const isText = !!target.closest(textSelector);

      setIsHoveringInteractive(isInteractive);
      setIsHoveringText(isText);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsPressed(true);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    window.addEventListener("mousemove", smoothMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", smoothMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, [isTouchDevice, hasMoved, isVisible, currentX, currentY]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: currentX,
        top: currentY,
        translateX: "-50%",
        translateY: "-50%",
        rotate: currentRotation,
        scaleX: currentScaleX,
        scaleY: currentScaleY,
        opacity: currentOpacity,
        zIndex: 999999,
        pointerEvents: "none",
        willChange: "transform",
      }}
      className="relative flex items-center justify-center"
    >
      {/* Matching blue glow halo that pulses and scales behind the cursor */}
      <div
        className="absolute w-12 h-12 bg-blue-500/30 rounded-full blur-xl pointer-events-none transition-all duration-300"
        style={{
          transform: isHoveringInteractive ? "scale(2.4)" : isHoveringText ? "scale(1.4)" : "scale(1.1)",
          opacity: isPressed ? 0.4 : 1,
        }}
      />
      <DefaultCursorSVG
        isHovered={isHoveringInteractive}
        isText={isHoveringText}
      />
    </motion.div>
  );
}
