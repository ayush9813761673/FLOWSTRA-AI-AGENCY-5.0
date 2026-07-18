import React, { useEffect } from "react";

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  schema: Record<string, any>;
}

const seoMap: Record<string, SEOConfig> = {
  hero: {
    title: "Flowstra | Premium AI Automation Agency & Client Acquisition",
    description: "Flowstra helps B2B businesses automate operations, scale client acquisition, and supercharge conversions using proprietary AI-driven workflows.",
    keywords: "AI Automation, Business Systems, Lead Generation, CRM Integration, Workflow Automation, Sales pipelines, Flowstra",
    ogTitle: "Flowstra | AI-driven Business Growth Systems",
    ogDescription: "Transform your business with AI-powered lead generation and growth systems. Get 24/7 automated sales processes that work while you sleep.",
    ogImage: "https://flowstra.org/logo.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Flowstra",
      "image": "https://flowstra.org/logo.png",
      "url": "https://flowstra.org/",
      "telephone": "+1-800-555-FLOW",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Virtual",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
        "postalCode": "94103",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://www.instagram.com/flowstra.ai"
      ]
    }
  },
  "case-studies": {
    title: "Our Impact & Case Studies | Flowstra AI Automation",
    description: "Deep dive into Flowstra case studies showing how we streamlined operations, built lead-scraping pipelines, and scaled B2B clients.",
    keywords: "Automation Case Studies, AI Success Stories, Client Acquisition Case Study, Flowstra Results",
    ogTitle: "Flowstra Case Studies | AI-Driven Success",
    ogDescription: "Discover how Flowstra streamlined workflows, built dynamic scraping pipelines, and achieved massive ROI for our clients.",
    ogImage: "https://flowstra.org/logo.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Flowstra AI Automation Case Studies",
      "description": "Real examples of business scaling and operation automation using AI.",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Airtable CRM Sync & Lead Routing Pipeline",
          "description": "Fully automated workflow that synchronizes newly scraped leads directly into client CRM pipelines."
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Autonomous Sales Outreach System",
          "description": "Cold outreach pipeline executing hundreds of personalized hyper-targeted outreach messages daily."
        }
      ]
    }
  },
  testimonials: {
    title: "Client Testimonials & Feedback | Flowstra AI Trust",
    description: "Read real reviews and feedback from founders and operators who scaled their operations and sales using Flowstra automation systems.",
    keywords: "Flowstra Reviews, AI Automation Agency Reviews, Flowstra Testimonials, Customer Success",
    ogTitle: "What Founders Say About Flowstra AI",
    ogDescription: "Our clients save thousands of hours and secure hundreds of high-quality leads. Read their true stories.",
    ogImage: "https://flowstra.org/logo.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Flowstra AI Automation Service",
      "image": "https://flowstra.org/logo.png",
      "description": "Full-scale AI-driven operations and lead routing system built for high-growth modern companies.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "28"
      }
    }
  },
  tools: {
    title: "Our Tech Stack & Automation Integrations | Flowstra",
    description: "Discover the state-of-the-art tools and APIs we integrate—including Gmail, Google Calendar, Airtable, Make, and proprietary LLMs.",
    keywords: "Make.com, Zapier, Airtable, OpenAI, Gemini API, Google Workspace Integration",
    ogTitle: "The Intelligent Tech Stack behind Flowstra",
    ogDescription: "We build on robust, industry-leading APIs to link your favorite workspaces seamlessly under dynamic AI management.",
    ogImage: "https://flowstra.org/logo.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Flowstra Custom AI Integration Architecture",
      "description": "Technical specification of how Flowstra pipelines sync with high-performance APIs such as OpenAI, Make.com, Google Workspace, and CRM nodes.",
      "author": {
        "@type": "Organization",
        "name": "Flowstra Tech Team"
      }
    }
  },
  features: {
    title: "Core Automation Features & Solutions | Flowstra",
    description: "Explore Flowstra features: Lead enrichment, automated multi-channel follow-ups, autonomous CRM routing, and customized AI agents.",
    keywords: "Lead enrichment, Automated CRM routing, AI Agent development, Cold email automation",
    ogTitle: "Advanced Features of Flowstra Growth Engines",
    ogDescription: "From dynamic web scraping to automated lead hand-offs, discover why Flowstra is the chosen system for modern scale-ups.",
    ogImage: "https://flowstra.org/logo.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "AI Operations Automation",
      "provider": {
        "@type": "Organization",
        "name": "Flowstra"
      },
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Flowstra Automation Features Suite",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Automated Lead Qualification",
              "description": "Identifies high-value clients instantly using personalized AI scraper modules."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Smart CRM Synchronization",
              "description": "Seamlessly integrates contacts, logs activity, and flags follow-ups."
            }
          }
        ]
      }
    }
  },
  team: {
    title: "Meet the Flowstra Team | AI Architects & Automation Pioneers",
    description: "Meet the pioneers behind Flowstra. Experts in building scalable, intelligent AI automation pipelines and cold outreach engines.",
    keywords: "Flowstra founders, AI engineers, Flowstra organization, Automation architects",
    ogTitle: "The Minds Behind Flowstra's Growth Tech",
    ogDescription: "Meet our collective of elite systems architects, integrations engineers, and workflow experts crafting the future of automation.",
    ogImage: "https://flowstra.org/logo.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "mainEntity": {
        "@type": "Organization",
        "name": "Flowstra",
        "employee": [
          {
            "@type": "Person",
            "name": "Aayush Raj",
            "jobTitle": "Co-Founder & Systems Architect"
          }
        ]
      }
    }
  },
  calculator: {
    title: "ROI & Time-Savings Calculator | Flowstra AI Automation",
    description: "Calculate your potential business savings, ROI, and hours reclaimed by deploying Flowstra's automated workflows.",
    keywords: "ROI Calculator, Business automation calculator, Time savings calculator, Automation profit estimate",
    ogTitle: "Interactive Automation ROI Calculator | Flowstra",
    ogDescription: "Adjust variables for leads, meetings, and team hours to see how much money and time Flowstra can reclaim for your business.",
    ogImage: "https://flowstra.org/logo.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Flowstra Automation Savings Estimator",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5 compatible browser",
      "description": "An interactive quantitative tool to calculate the monthly financial return on investment of implementing workflow automation."
    }
  },
  "workspace-integration": {
    title: "Google Workspace & CRM Deep Automation | Flowstra",
    description: "Supercharge your business with real-time Gmail and Google Calendar integrations powered by safe secure OAuth flows.",
    keywords: "Google Workspace automation, Google Calendar API, Gmail API integration, OAuth secure syncing",
    ogTitle: "Secure Workspace Automation Orchestrator",
    ogDescription: "Flowstra connects directly to your active work hubs with robust safety, sorting inbounds, setting auto-meetings, and updating logs instantly.",
    ogImage: "https://flowstra.org/logo.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Flowstra Workspace Connector",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "featureList": "Gmail automation, Calendar routing, CRM automatic synchronization"
    }
  },
  pricing: {
    title: "Pricing & Waitlist | Scale Your Business with Flowstra",
    description: "Explore flexible, high-ROI AI automation pricing plans. Join the Flowstra waitlist today to lock in prime delivery slots.",
    keywords: "Flowstra pricing, AI agency costs, Automation subscription, Flowstra waitlist",
    ogTitle: "Flowstra Plans, Waitlist & Pricing",
    ogDescription: "Select from our bespoke, retainer, or custom enterprise packages built with fixed pricing and guaranteed ROI delivery timelines.",
    ogImage: "https://flowstra.org/logo.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Flowstra Enterprise Automation Partnership",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": "2999",
        "highPrice": "9999",
        "offerCount": "3",
        "offers": [
          {
            "@type": "Offer",
            "name": "Growth Automation Suite",
            "price": "2999.00",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "name": "Enterprise Scale Hub",
            "price": "5999.00",
            "priceCurrency": "USD"
          }
        ]
      }
    }
  },
  "final-cta": {
    title: "Book a Strategic Discovery Call | Scale with Flowstra",
    description: "Reserve an exclusive 15-minute diagnostic session with Flowstra founders to build your company's custom AI workflow roadmap.",
    keywords: "Book discovery call, Flowstra consultation, Custom AI roadmap, Automation audit",
    ogTitle: "Unlock Your custom AI Strategy with Flowstra",
    ogDescription: "Join high-growth founders mapping their automated pipelines. Book a slot while our limited client cohort slots remain open.",
    ogImage: "https://flowstra.org/logo.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Flowstra Booking & Growth Session",
      "description": "Secure scheduler for reserving high-level engineering consultations and tailored growth audits with our founders."
    }
  }
};

export function DynamicSEO() {
  useEffect(() => {
    // Helper to dynamically update/create meta and link tags
    const updateSEO = (id: string) => {
      const config = seoMap[id] || seoMap.hero;
      const targetUrl = `https://flowstra.org/${id === "hero" ? "" : `#${id}`}`;
      
      // 1. Update Title
      document.title = config.title;

      // 2. Helper for general meta tags
      const updateMetaTag = (name: string, content: string, isProperty = false) => {
        const attribute = isProperty ? "property" : "name";
        let element = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute(attribute, name);
          document.head.appendChild(element);
        }
        element.setAttribute("content", content);
      };

      // 3. Update Standard Meta Tags
      updateMetaTag("title", config.title);
      updateMetaTag("description", config.description);
      updateMetaTag("keywords", config.keywords);

      // 4. Update Open Graph Tags
      updateMetaTag("og:title", config.ogTitle, true);
      updateMetaTag("og:description", config.ogDescription, true);
      updateMetaTag("og:url", targetUrl, true);
      updateMetaTag("og:image", config.ogImage, true);
      updateMetaTag("og:type", "website", true);

      // 5. Update Twitter Tags
      updateMetaTag("twitter:title", config.ogTitle);
      updateMetaTag("twitter:description", config.ogDescription);
      updateMetaTag("twitter:url", targetUrl);
      updateMetaTag("twitter:image", config.ogImage);
      updateMetaTag("twitter:card", "summary_large_image");

      // 6. Update Canonical Tag for perfect search engine ranking & deep-link relevance
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", targetUrl);

      // 7. Update Dynamic JSON-LD Structured Schema
      let schemaScript = document.getElementById("dynamic-seo-schema");
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.setAttribute("type", "application/ld+json");
        schemaScript.setAttribute("id", "dynamic-seo-schema");
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(config.schema, null, 2);
    };

    // Set initial SEO values
    updateSEO("hero");

    // Track intersection of sections
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // High-accuracy zone near top/middle of screen
      threshold: 0,
    };

    const observedSections = [
      "case-studies",
      "testimonials",
      "tools",
      "features",
      "team",
      "calculator",
      "workspace-integration",
      "pricing",
      "final-cta"
    ];

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

