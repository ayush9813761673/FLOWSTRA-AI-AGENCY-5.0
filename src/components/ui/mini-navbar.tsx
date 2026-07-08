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

  const renderLogo = (imgClassName: string, containerClassName: string) => {
    return (
      <img
        src="/logo.png?v=2"
        alt="Flowstra Logo"
        className={`${imgClassName} object-contain rounded-full`}
      />
    );
  };

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
      {renderLogo(
        "w-6 h-6 transition-opacity duration-300 group-hover:opacity-80 md:group-hover:opacity-100",
        "w-6 h-6"
      )}
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
    <>
      {/* Un-attached Logo and Brand with Liquid Glass - Pinned separately at the left side of the viewport (Desktop/Tablet only) */}
      <div 
        className="fixed top-6 left-6 md:left-12 z-[110] hidden sm:flex items-center h-12 sm:h-14 px-4 sm:px-5 border border-white/20 rounded-full transition-all duration-300 ease-in-out select-none bg-slate-950/40 backdrop-blur-xl"
      >
        {/* Liquid Glass Highlight & Shadow Layers */}
        <div className="absolute inset-0 rounded-full z-0 pointer-events-none 
          shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.2),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.7),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.5),inset_0_0_6px_6px_rgba(255,255,255,0.1),inset_0_0_2px_2px_rgba(255,255,255,0.05),0_0_12px_rgba(255,255,255,0.1)] 
          bg-white/[0.04]" 
        />

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="relative z-10 flex items-center gap-3 group cursor-pointer"
        >
          {renderLogo(
            "w-[26px] h-[26px] sm:w-[32px] sm:h-[32px] transition-all duration-300 group-hover:scale-110 group-hover:rotate-[12deg]",
            "w-[26px] h-[26px] sm:w-[32px] sm:h-[32px]"
          )}
          <span className="text-white/85 font-semibold text-sm sm:text-[15px] tracking-[0.22em] uppercase mt-[1px] transition-all duration-300 ease-out group-hover:text-white group-hover:tracking-[0.27em] group-hover:[text-shadow:0_0_20px_rgba(255,255,255,1),0_0_40px_rgba(255,255,255,0.6)]">
            Flowstra
          </span>
        </a>
      </div>

      {/* Unified Mobile Flowstra Navigation Bar with Liquid Glass (Mobile Preview Only) */}
      <div 
        className="fixed top-6 left-6 right-6 z-[110] sm:hidden flex items-center justify-between h-14 px-4 border border-white/20 rounded-full transition-all duration-300 ease-in-out select-none bg-slate-950/40 backdrop-blur-xl"
      >
        {/* Liquid Glass Highlight & Shadow Layers */}
        <div className="absolute inset-0 rounded-full z-0 pointer-events-none 
          shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.2),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.7),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.5),inset_0_0_6px_6px_rgba(255,255,255,0.1),inset_0_0_2px_2px_rgba(255,255,255,0.05),0_0_12px_rgba(255,255,255,0.1)] 
          bg-white/[0.04]" 
        />

        {/* Mobile Logo on Left */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="relative z-10 flex items-center gap-2.5 group cursor-pointer"
        >
          {renderLogo(
            "w-7 h-7 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[12deg]",
            "w-7 h-7"
          )}
          <span className="text-white/85 font-semibold text-xs tracking-[0.2em] uppercase mt-[1px] transition-all duration-300 ease-out group-hover:text-white">
            Flowstra
          </span>
        </a>

        {/* Mobile CTA Button on Right */}
        <div className="relative z-10 flex items-center">
          {mobileCtaButton}
        </div>
      </div>

      <header
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]
                   hidden sm:flex flex-col items-center
                   px-6 py-2.5
                   rounded-full
                   border border-white/20
                   w-auto
                   transition-[border-radius,width] duration-300 ease-in-out
                   bg-slate-950/40 backdrop-blur-xl"
      >
        {/* Liquid Glass Highlight & Shadow Layers (Desktop only) */}
        <div className="absolute inset-0 rounded-full z-0 pointer-events-none 
          shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.2),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.7),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.5),inset_0_0_6px_6px_rgba(255,255,255,0.1),inset_0_0_2px_2px_rgba(255,255,255,0.05),0_0_12px_rgba(255,255,255,0.1)] 
          bg-white/[0.04]" 
        />

        <div className="relative z-10 flex items-center justify-between w-full gap-x-12">
          <nav className="flex items-center space-x-8 text-sm">
            {navLinksData.map((link) => (
              <AnimatedNavLink key={link.href} href={link.href}>
                {link.label}
              </AnimatedNavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {desktopCtaButton}
          </div>
        </div>
      </header>
    </>
  );
}
