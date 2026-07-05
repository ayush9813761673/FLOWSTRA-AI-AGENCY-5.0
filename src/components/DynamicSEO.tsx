import React, { useEffect } from "react";

interface SEOConfig {
  title: string;
  description: string;
}

const seoMap: Record<string, SEOConfig> = {
  hero: {
    title: "Flowstra | Premium AI Automation Agency & Client Acquisition",
    description: "Flowstra helps B2B businesses automate operations, scale client acquisition, and supercharge conversions using proprietary AI-driven workflows.",
  },
  "case-studies": {
    title: "Our Impact & Case Studies | Flowstra AI Automation",
    description: "Deep dive into Flowstra case studies showing how we streamlined operations, built lead-scraping pipelines, and scaled B2B clients.",
  },
  team: {
    title: "Meet the Flowstra Team | AI Architects & Automation Pioneers",
    description: "Meet the pioneers behind Flowstra. Experts in building scalable, intelligent AI automation pipelines and cold outreach engines.",
  },
  pricing: {
    title: "Pricing & Waitlist | Scale Your Business with Flowstra",
    description: "Explore flexible, high-ROI AI automation pricing plans. Join the Flowstra waitlist today to lock in prime delivery slots.",
  },
};

export function DynamicSEO() {
  useEffect(() => {
    // Helper to dynamically update/create meta description tag
    const updateSEO = (id: string) => {
      const config = seoMap[id] || seoMap.hero;
      
      // Update title
      document.title = config.title;

      // Update description meta tag
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", config.description);
    };

    // Set initial SEO values
    updateSEO("hero");

    // Track intersection of sections
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // High-accuracy zone near top/middle of screen
      threshold: 0,
    };

    const observedSections = ["case-studies", "team", "pricing"];

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the first intersecting entry
      const activeEntry = entries.find((entry) => entry.isIntersecting);
      
      if (activeEntry && activeEntry.target.id) {
        updateSEO(activeEntry.target.id);
      } else {
        // If none of the observed sections are intersecting in our active zone, default to hero
        // Check if we are near the top of the viewport
        if (window.scrollY < 300) {
          updateSEO("hero");
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each section
    observedSections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Fallback scroll listener for top of page detection
    const handleScroll = () => {
      if (window.scrollY < 150) {
        updateSEO("hero");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null; // Component renders no physical UI, only updates document head
}
