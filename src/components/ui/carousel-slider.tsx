import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export function CarouselSlider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // Use a generous threshold (50px) to handle rounding issues on different screen sizes
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 50);
    }
  };

  useEffect(() => {
    // Check initially
    checkScroll();

    // Add small delay for initial render dimensions
    setTimeout(checkScroll, 100);

    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [children]);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={cn(
          "flex overflow-x-auto gap-6 py-4 snap-x snap-mandatory no-scrollbar scroll-smooth",
          className,
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-350)}
          className="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-[rgba(255,255,255,0.2)] bg-[#111] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollBy(350)}
          className="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-[rgba(255,255,255,0.2)] bg-[#111] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
