"use client";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/components/ui/use-scroll";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  const links = [
    {
      label: "Solutions",
      href: "#solutions",
    },
    {
      label: "Outcomes",
      href: "#outcomes",
    },
    {
      label: "About",
      href: "#about",
    },
  ];

  React.useEffect(() => {
    if (open) {
      // Disable scroll
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll
      document.body.style.overflow = "";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[9999] mx-auto w-full transition-all duration-300 border-b",
          {
            "bg-[#07070d]/40 border-white/5 backdrop-blur-xl md:top-4 md:max-w-4xl md:rounded-2xl md:border md:border-white/10 md:shadow-[0_12px_40px_rgba(0,0,0,0.6)]":
              scrolled && !open,
            "bg-transparent border-transparent md:top-4 md:max-w-4xl": !scrolled && !open,
            "bg-[#07070d]/90 border-b border-white/5 backdrop-blur-3xl md:max-w-4xl": open,
          },
        )}
      >
        <nav
          className={cn(
            "flex h-16 w-full items-center justify-between px-6 md:h-14 md:transition-all md:ease-out",
            {
              "md:px-4": scrolled,
            },
          )}
        >
          <div className="flex items-center gap-3 relative z-10">
            <img
              src="/logo.svg"
              alt="Flowstra Logo"
              className="w-6 h-6 object-contain rounded-full"
              referrerPolicy="no-referrer"
            />
            <span className="text-white font-extrabold text-lg tracking-tight">
              Flowstra
            </span>
          </div>
          
          {/* Desktop links */}
          <div className="hidden items-center gap-2 md:flex">
            {links.map((link, i) => (
              <a
                key={i}
                className={buttonVariants({
                  variant: "ghost",
                  className: "text-slate-400 hover:text-white px-3 font-medium text-sm transition-colors cursor-pointer",
                })}
                href={link.href}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://cal.com/flowstra/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white text-[#05050a] hover:bg-slate-200 active:scale-95 transition-all shadow-md"
            >
              Book a Call
            </a>
          </div>

          {/* Hamburger toggle */}
          <Button
            size="icon"
            variant="outline"
            onClick={() => setOpen(!open)}
            className="md:hidden border-white/10 bg-slate-950/40 hover:bg-slate-900 text-white cursor-pointer active:scale-95 z-50 rounded-xl w-10 h-10"
          >
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </Button>
        </nav>
      </header>

      {/* Premium Glassmorphic Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-[9998] bg-slate-950/65 backdrop-blur-3xl text-white flex flex-col pt-24 px-6 pb-10 overflow-hidden md:hidden shadow-[0_30px_80px_rgba(0,0,0,0.95)]"
          >
            {/* Soft Ambient glow elements to match the modal aesthetic */}
            <div className="absolute top-1/4 right-[-10%] w-72 h-72 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-[-10%] w-72 h-72 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col justify-between h-full relative z-10">
              {/* Menu items */}
              <div className="flex flex-col gap-5 mt-4">
                {links.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.3, ease: "easeOut" }}
                  >
                    <a
                      className="group flex items-center justify-between py-3.5 border-b border-white/[0.04] text-2xl font-bold tracking-tight text-slate-300 hover:text-white transition-colors"
                      href={link.href}
                      onClick={() => setOpen(false)}
                    >
                      <span className="font-sans font-extrabold">{link.label}</span>
                      <ArrowRight className="h-5 w-5 text-blue-500 opacity-60 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Drawer footer containing signature elements */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-col gap-4 mt-auto"
              >
                {/* Premium Flowstra design label */}
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-blue-500/10 bg-blue-500/5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">
                    Flowstra AI Operations Engine
                  </span>
                </div>

                <a
                  href="https://cal.com/flowstra/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-blue-500/15 active:scale-95 transition-all duration-300 cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <span>Book a Free Strategy Call</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
