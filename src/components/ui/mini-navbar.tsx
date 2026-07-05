"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const AnimatedNavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
  key?: React.Key;
}) => {
  const defaultTextColor = "text-gray-300";
  const hoverTextColor = "text-white";
  const textSizeClass = "text-sm";

  return (
    <a
      href={href}
      className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}
    >
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full");
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass("rounded-xl");
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass("rounded-full");
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="flex items-center gap-2.5 relative z-10 group"
    >
      <img src="/logo.png" alt="Flowstra Logo" className="w-6 h-6 object-contain transition-opacity duration-300 group-hover:opacity-80 md:group-hover:opacity-100" />
      <span className="text-white/85 font-semibold text-[13px] sm:text-sm tracking-[0.2em] uppercase mt-[1px] transition-all duration-300 ease-out md:group-hover:text-white md:group-hover:tracking-[0.26em] md:group-hover:[text-shadow:0_0_20px_rgba(255,255,255,1),0_0_40px_rgba(255,255,255,0.6)]">
        Flowstra
      </span>
    </a>
  );

  const navLinksData = [
    { label: "Clients", href: "#case-studies" },
    { label: "Team", href: "#team" },
    { label: "Pricing", href: "#pricing" },
  ];

  const desktopCtaButton = (
    <div className="relative group hidden sm:block">
      <a
        href="https://cal.com/flowstra/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex items-center justify-center px-4 py-2 text-sm font-semibold text-black bg-white rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.5)] hover:shadow-[0_0_25px_8px_rgba(255,255,255,0.6)] hover:bg-gray-100 transition-all duration-300"
      >
        Book a Call
      </a>
    </div>
  );

  const mobileCtaButton = (
    <div className="relative group sm:hidden">
      <a
        href="https://cal.com/flowstra/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold text-black bg-white rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.5)] hover:shadow-[0_0_25px_8px_rgba(255,255,255,0.6)] hover:bg-gray-100 transition-all duration-300 whitespace-nowrap"
      >
        Book a Call
      </a>
    </div>
  );

  return (
    <header
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100]
                       flex flex-col items-center
                       px-4 sm:px-6 py-3
                       ${headerShapeClass}
                       border border-white/20
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-300 ease-in-out`}
      style={{
        backdropFilter: 'url("#navbar-glass-filter") blur(16px)',
        WebkitBackdropFilter: 'url("#navbar-glass-filter") blur(16px)'
      }}
    >
      {/* Liquid Glass Highlight & Shadow Layers */}
      <div className={`absolute inset-0 ${headerShapeClass} z-0 pointer-events-none 
        shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.2),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.7),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.5),inset_0_0_6px_6px_rgba(255,255,255,0.1),inset_0_0_2px_2px_rgba(255,255,255,0.05),0_0_12px_rgba(255,255,255,0.1)] 
        bg-white/[0.04] transition-[border-radius] duration-300`} 
      />

      {/* Glass SVG Displacement Filter */}
      <svg className="absolute w-0 h-0 opacity-0 pointer-events-none">
        <defs>
          <filter
            id="navbar-glass-filter"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.04"
              numOctaves="1"
              seed="2"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="1" result="blurredNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurredNoise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displaced"
            />
            <feComposite in="displaced" in2="displaced" operator="over" />
          </filter>
        </defs>
      </svg>

      <div className="relative z-10 flex items-center justify-between w-full gap-x-3 sm:gap-x-12">
        <div className="flex items-center shrink-0">{logoElement}</div>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-8 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {mobileCtaButton}
          {desktopCtaButton}
          <button
            className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none bg-white/5 border border-white/10 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div
        className={`sm:hidden relative z-10 flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? "max-h-[500px] opacity-100 pt-6 pb-2" : "max-h-0 opacity-0 pt-0 pb-0 pointer-events-none"}`}
      >
        <nav className="flex flex-col items-center space-y-5 text-base w-full">
          {navLinksData.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition-colors w-full text-center tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
