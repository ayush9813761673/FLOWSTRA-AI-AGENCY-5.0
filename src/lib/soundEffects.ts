/**
 * Web Audio API Sound Effects Engine for Flowstra
 * Provides instant zero-latency synthesized tactile audio feedback for:
 * 1. General website clicks (crisp, subtle micro-click / tactile pop)
 * 2. Card clicks (rich, resonant harmonic chime / spatial droplet tone)
 */

let audioCtx: AudioContext | null = null;
let isAudioInitialized = false;

// Safe lazy AudioContext getter that resumes on user gesture
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  } catch (err) {
    console.warn("AudioContext init error:", err);
  }

  return audioCtx;
}

/**
 * Play a crisp, subtle, modern micro-tap / tactile click for general website interactions
 */
export function playGeneralClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Dual oscillator + noise burst for a realistic tactile switch click
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    // Pitch envelope: fast drop from 1200Hz down to 240Hz in 35ms
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.035);

    // Gain envelope: fast punchy attack, quick decay
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a distinct, rich harmonic chime / resonant droplet pop when clicking on cards
 */
export function playCardClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Harmonic oscillators: Fundamenal (523.25 Hz - C5) + Harmonic Fifth (783.99 Hz - G5)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const masterGain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.exponentialRampToValueAtTime(587.33, now + 0.08); // subtle upward pitch curve
    osc1.frequency.exponentialRampToValueAtTime(520, now + 0.18);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(783.99, now);
    osc2.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(780, now + 0.18);

    // Gain envelopes with warm glassy decay
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.15, now + 0.004);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.004);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    masterGain.gain.setValueAtTime(1.0, now);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(masterGain);
    gain2.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.19);
    osc2.stop(now + 0.19);
  } catch {
    // Graceful fallback
  }
}

/**
 * Helper to check if a DOM element or its parents match a card element
 */
export function isCardElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;

  // Check closest card selectors
  const cardMatch = target.closest(
    [
      "[data-card]",
      "[data-is-card='true']",
      ".card",
      ".group\\/card",
      "[class*='spotlight-card']",
      "[class*='gradient-card']",
      "[class*='light-card']",
      "[class*='ScannerCard']",
      "[class*='SpotlightCard']",
      "article",
      "[role='article']",
      // Specific Flowstra card containers
      "#pricing [class*='rounded-']",
      "#features [class*='rounded-']",
      "#team [class*='rounded-']",
      "#testimonials [class*='rounded-']",
      "#tools [class*='rounded-']",
      "#calculator [class*='rounded-']",
      "#workspace-integration [class*='rounded-']",
      "#metrics [class*='rounded-']",
    ].join(",")
  );

  if (cardMatch) {
    // Avoid false-positive if the matched element is the entire section container
    const rect = cardMatch.getBoundingClientRect();
    const isFullWidthSection = rect.width >= window.innerWidth * 0.95 && rect.height >= window.innerHeight * 0.8;
    if (!isFullWidthSection) {
      return true;
    }
  }

  // Also check class lists for 'card' or 'border-[var(--card-border)]' with rounded styling
  let current: Element | null = target;
  let depth = 0;
  while (current && depth < 6 && current !== document.body && current !== document.documentElement) {
    const classStr = current.className || "";
    if (typeof classStr === "string") {
      const isCardStyled =
        (classStr.includes("card") ||
          classStr.includes("backdrop-blur") ||
          classStr.includes("rounded-2xl") ||
          classStr.includes("rounded-3xl") ||
          classStr.includes("rounded-xl")) &&
        (classStr.includes("border") || classStr.includes("bg-[var(--surface)]") || classStr.includes("bg-[var(--card)]"));

      if (isCardStyled) {
        const rect = current.getBoundingClientRect();
        if (rect.width > 60 && rect.height > 60 && rect.width < window.innerWidth * 0.95) {
          return true;
        }
      }
    }
    current = current.parentElement;
    depth++;
  }

  return false;
}

/**
 * Initializes the global click sound listener across the whole window.
 * Ensures clicks anywhere trigger the general click sound, while clicks on cards trigger the card chime sound.
 */
export function initGlobalClickSound(): () => void {
  if (typeof window === "undefined") return () => {};

  let lastClickTime = 0;

  const handleClick = (e: MouseEvent) => {
    const now = Date.now();
    // Throttle duplicate rapid click fires under 25ms (e.g. nested event bubbles)
    if (now - lastClickTime < 25) return;
    lastClickTime = now;

    // First ensure AudioContext is primed
    if (!isAudioInitialized) {
      getAudioContext();
      isAudioInitialized = true;
    }

    const isCard = isCardElement(e.target);

    if (isCard) {
      playCardClickSound();
    } else {
      playGeneralClickSound();
    }
  };

  // Use capture phase so we capture clicks reliably even if subcomponents stop propagation
  window.addEventListener("click", handleClick, { capture: true, passive: true });

  return () => {
    window.removeEventListener("click", handleClick, { capture: true });
  };
}
