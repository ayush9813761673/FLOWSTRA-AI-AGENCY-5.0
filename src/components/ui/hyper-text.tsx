"use client";

import { AnimatePresence, motion, Variants, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

interface HyperTextProps {
  text: string;
  duration?: number;
  framerProps?: Variants;
  className?: string;
  animateOnLoad?: boolean;
  containerClassName?: string;
  highlightLastWord?: boolean;
  highlightCount?: number;
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export function HyperText({
  text,
  duration = 350, // Shorter default duration for a very responsive, high-end feel
  framerProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 3 },
  },
  className,
  animateOnLoad = false, // Default to false so scroll trigger handles it perfectly
  containerClassName,
  highlightLastWord = true,
  highlightCount = 1,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text.split(""));
  const [trigger, setTrigger] = useState(false);
  const interations = useRef(0);
  const isFirstRender = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 }); // More responsive scroll trigger

  const triggerAnimation = () => {
    interations.current = 0;
    setTrigger(true);
  };

  useEffect(() => {
    if (isInView) {
      triggerAnimation();
    }
  }, [isInView]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!animateOnLoad && isFirstRender.current && !trigger) {
          clearInterval(interval);
          isFirstRender.current = false;
          return;
        }
        if (interations.current < text.length) {
          setDisplayText((t) =>
            t.map((l, i) =>
              l === " "
                ? l
                : i <= interations.current
                  ? text[i]
                  : alphabets[getRandomInt(26)],
            ),
          );
          // Advance by 0.35 (about 3 frames per letter) to make it run extremely fast
          // and bypass browser minimum interval clamping (4ms) on longer titles
          interations.current = interations.current + 0.35;
        } else {
          setTrigger(false);
          clearInterval(interval);
        }
      },
      duration / (text.length * 3), // Match fewer ticks for the total duration
    );
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [text, duration, trigger, animateOnLoad]);

  // Split text into words and record the starting global index of each word
  const words: { word: string; startIdx: number }[] = [];
  let currentStart = 0;
  text.split(" ").forEach((w) => {
    words.push({ word: w, startIdx: currentStart });
    currentStart += w.length + 1; // Account for the space character
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-wrap scale-100 cursor-default py-1 select-none gap-x-[0.28em] gap-y-1 text-left items-center",
        containerClassName
      )}
      onMouseEnter={triggerAnimation}
    >
      <AnimatePresence mode="wait">
        {words.map((wordObj, wordIdx) => {
          const isHighlightedWord = wordIdx >= words.length - highlightCount;
          const useHighlight = highlightLastWord && isHighlightedWord && words.length > 1;

          return (
            <span
              key={wordIdx}
              className="inline-flex flex-nowrap items-center transition-all duration-300"
            >
              {wordObj.word.split("").map((letter, letterIdx) => {
                const globalIdx = wordObj.startIdx + letterIdx;
                const displayLetter = displayText[globalIdx] || letter;
                return (
                  <motion.span
                    key={letterIdx}
                    className={cn(
                      "font-mono inline-block",
                      className,
                      useHighlight && "!text-blue-500 !font-extrabold [text-shadow:0_0_12px_rgba(59,130,246,0.8)]"
                    )}
                    {...framerProps}
                  >
                    {displayLetter.toUpperCase()}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
