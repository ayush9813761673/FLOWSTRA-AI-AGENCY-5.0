import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useInView } from "motion/react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { HyperText } from "./hyper-text";

type Direction = "left" | "right";

export const PhotoGallery = ({
  animationDelay = 0.5,
}: {
  animationDelay?: number;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isInView) {
      const animationTimer = setTimeout(() => {
        setIsLoaded(true);
      }, animationDelay * 1000);

      return () => {
        clearTimeout(animationTimer);
      };
    }
  }, [isInView, animationDelay]);

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1, // Reduced from 0.3 to 0.1 since we already have the fade-in delay
      },
    },
  };

  // Animation variants for each photo
  const photoVariants = {
    hidden: () => ({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      // Keep the same z-index throughout animation
    }),
    visible: (custom: { x: number; y: number; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0, // No rotation
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15, // Explicit delay based on order
      },
    }),
  };

  // Photo positions - horizontal layout with responsive coordinates
  const photos = [
    {
      id: 1,
      order: 0,
      xDesktop: -450,
      xMobile: -150,
      yDesktop: 15,
      yMobile: 5,
      zIndex: 70,
      direction: "left" as Direction,
      src: "https://cdn.simpleicons.org/n8n/FF6D5A",
      alt: "n8n",
    },
    {
      id: 3,
      order: 1,
      xDesktop: -300,
      xMobile: -100,
      yDesktop: 8,
      yMobile: 2,
      zIndex: 65,
      direction: "right" as Direction,
      src: "https://cdn.simpleicons.org/make/b052ff",
      alt: "Make",
    },
    {
      id: 7,
      order: 2,
      xDesktop: -150,
      xMobile: -50,
      yDesktop: 25,
      yMobile: 8,
      zIndex: 60,
      direction: "left" as Direction,
      src: "https://cdn.simpleicons.org/claude/D97757",
      alt: "Claude",
    },
    {
      id: 2,
      order: 3,
      xDesktop: 0,
      xMobile: 0,
      yDesktop: 32,
      yMobile: 12,
      zIndex: 50,
      direction: "right" as Direction,
      src: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
      alt: "Google AI Studio",
    },
    {
      id: 4,
      order: 4,
      xDesktop: 150,
      xMobile: 50,
      yDesktop: 22,
      yMobile: 8,
      zIndex: 40,
      direction: "left" as Direction,
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      alt: "Python",
    },
    {
      id: 5,
      order: 5,
      xDesktop: 300,
      xMobile: 100,
      yDesktop: 44,
      yMobile: 15,
      zIndex: 30,
      direction: "right" as Direction,
      src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.svg",
      alt: "Notion",
    },
    {
      id: 6,
      order: 6,
      xDesktop: 450,
      xMobile: 150,
      yDesktop: 25,
      yMobile: 10,
      zIndex: 20,
      direction: "left" as Direction,
      src: "https://www.vectorlogo.zone/logos/airtable/airtable-icon.svg",
      alt: "Airtable",
    },
  ];

  return (
    <div className="mt-20 relative">
      <div className="absolute inset-0 max-md:hidden top-[200px] -z-10 h-[300px] w-full bg-transparent bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#a8a29e_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e_1px,transparent_1px)]"></div>
      
      <div className="flex flex-col gap-3 max-w-3xl items-center text-center mx-auto mb-16">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 font-mono">
          Integration Ecosystem
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          <HyperText text="Tools We Use" className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white inline-block" />
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-slate-400 max-w-2xl mt-1.5 font-medium">
          Our modular pipelines interface with top-tier business applications, databases, and LLM providers in real-time.
        </p>
      </div>
      <div
        ref={ref}
        className="relative mb-8 h-[350px] w-full items-center justify-center lg:flex"
      >
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative h-[220px] w-[220px] max-md:h-[120px] max-md:w-[120px] max-md:mt-10">
              {/* Render photos in reverse order so that higher z-index photos are rendered later in the DOM */}
              {[...photos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }} // Apply z-index directly in style
                  variants={photoVariants}
                  custom={{
                    x: isMobile ? photo.xMobile : photo.xDesktop,
                    y: isMobile ? photo.yMobile : photo.yDesktop,
                    order: photo.order,
                  }}
                >
                  <Photo
                    width={isMobile ? 120 : 220}
                    height={isMobile ? 120 : 220}
                    src={photo.src}
                    alt={photo.alt}
                    direction={photo.direction}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

function getRandomNumberInRange(min: number, max: number): number {
  if (min >= max) {
    throw new Error("Min value should be less than max value");
  }
  return Math.random() * (max - min) + min;
}

export const Photo = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    const randomRotation =
      getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1);
    setRotation(randomRotation);
  }, []);

  function handleMouse(event: {
    currentTarget: { getBoundingClientRect: () => any };
    clientX: number;
    clientY: number;
  }) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{
        scale: 1.1,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{
        scale: 1.1,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        transform: `rotate(0deg) rotateX(0deg) rotateY(0deg)`,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing",
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-sm border border-[var(--card-border)] bg-[var(--surface)] p-8">
        <motion.img
          className={cn("rounded-3xl object-contain w-full h-full")}
          src={src}
          alt={alt}
          {...props}
          draggable={false}
        />
      </div>
    </motion.div>
  );
};
