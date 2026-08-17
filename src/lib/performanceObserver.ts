/**
 * Lightweight Web Performance Observer Utility
 * Monitors and logs Core Web Vitals and Key Performance Metrics:
 * - Largest Contentful Paint (LCP)
 * - Estimated Time to Interactive (TTI) / First Input Delay (FID) / INP
 * - First Contentful Paint (FCP)
 * - Navigation & Resource timings
 */

export interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  tti?: number;
  fid?: number;
  cls?: number;
}

export function initPerformanceObserver(): void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  const metrics: PerformanceMetrics = {};
  let lastLongTaskEnd = 0;
  let fcpTime = 0;

  const logMetric = (name: string, value: number, unit = "ms", rating?: "good" | "needs-improvement" | "poor") => {
    const color =
      rating === "good"
        ? "#10b981"
        : rating === "needs-improvement"
        ? "#f59e0b"
        : rating === "poor"
        ? "#ef4444"
        : "#3b82f6";

    console.log(
      `%c[⚡ PerfObserver]%c ${name}: %c${value.toFixed(2)}${unit}%c ${rating ? `(${rating.toUpperCase()})` : ""}`,
      "color: #8b5cf6; font-weight: bold;",
      "color: inherit; font-weight: 500;",
      `color: ${color}; font-weight: bold;`,
      "color: #a1a1aa; font-size: 11px;"
    );
  };

  // 1. Observe First Contentful Paint (FCP)
  try {
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          fcpTime = entry.startTime;
          metrics.fcp = fcpTime;
          const rating = fcpTime <= 1800 ? "good" : fcpTime <= 3000 ? "needs-improvement" : "poor";
          logMetric("First Contentful Paint (FCP)", fcpTime, "ms", rating);
          paintObserver.disconnect();
        }
      }
    });
    paintObserver.observe({ type: "paint", buffered: true });
  } catch {
    // Ignore unsupported observer types
  }

  // 2. Observe Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        metrics.lcp = lastEntry.startTime;
        const rating = lastEntry.startTime <= 2500 ? "good" : lastEntry.startTime <= 4000 ? "needs-improvement" : "poor";
        logMetric("Largest Contentful Paint (LCP)", lastEntry.startTime, "ms", rating);
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

    // Disconnect LCP observer on first user interaction or tab hidden to finalize metric
    ["keydown", "click", "visibilitychange"].forEach((type) => {
      window.addEventListener(
        type,
        () => {
          try {
            lcpObserver.takeRecords();
            lcpObserver.disconnect();
          } catch {
            // Ignore
          }
        },
        { once: true, passive: true }
      );
    });
  } catch {
    // Ignore unsupported observer types
  }

  // 3. Monitor Long Tasks to calculate Estimated Time to Interactive (TTI)
  // TTI heuristic: FCP reached + DOMContentLoaded + 5-second quiet window with no tasks > 50ms
  try {
    const longTaskObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        lastLongTaskEnd = Math.max(lastLongTaskEnd, entry.startTime + entry.duration);
      }
    });
    longTaskObserver.observe({ type: "longtask", buffered: true });

    const checkTTI = () => {
      // Calculate estimated TTI based on DOM interactive, FCP and last long task
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const domInteractive = navEntry ? navEntry.domInteractive : performance.now();
      const baseTime = Math.max(fcpTime || 0, domInteractive);
      const estimatedTTI = Math.max(baseTime, lastLongTaskEnd);

      metrics.tti = estimatedTTI;
      const rating = estimatedTTI <= 3800 ? "good" : estimatedTTI <= 7300 ? "needs-improvement" : "poor";
      logMetric("Time to Interactive (TTI - Estimated)", estimatedTTI, "ms", rating);

      try {
        longTaskObserver.disconnect();
      } catch {
        // Ignore
      }
    };

    // Check after 5 seconds of idle / after window load
    if (document.readyState === "complete") {
      setTimeout(checkTTI, 3000);
    } else {
      window.addEventListener("load", () => {
        setTimeout(checkTTI, 3000);
      });
    }
  } catch {
    // Fallback TTI estimate from navigation timings
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        if (navEntry) {
          const ttiEstimate = navEntry.domInteractive || navEntry.domContentLoadedEventEnd;
          metrics.tti = ttiEstimate;
          const rating = ttiEstimate <= 3800 ? "good" : ttiEstimate <= 7300 ? "needs-improvement" : "poor";
          logMetric("Time to Interactive (TTI - Estimated)", ttiEstimate, "ms", rating);
        }
      }, 1500);
    });
  }

  // 4. Observe Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value || 0;
          metrics.cls = clsValue;
        }
      }
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
  } catch {
    // Ignore unsupported observer types
  }
}
