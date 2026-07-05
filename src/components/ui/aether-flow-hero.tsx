"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ArrowRight, Zap } from "lucide-react";
import { fadeUp, stagger } from "../../constants";

const AetherFlowHero = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 200,
    };

    class Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor(
        x: number,
        y: number,
        vx: number,
        vy: number,
        size: number,
        color: string,
      ) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Update target position (the intended path)
        this.targetX += this.vx;
        this.targetY += this.vy;

        // Handle target bouncing at edges
        if (this.targetX > canvas.width || this.targetX < 0) {
          this.vx = -this.vx;
        }
        if (this.targetY > canvas.height || this.targetY < 0) {
          this.vy = -this.vy;
        }

        // Mouse collision detection and displacement
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            // Use a smoother sine-based force curve for gradual decrease
            const smoothForce = Math.sin(force * (Math.PI / 2));

            const dirX = dx / distance;
            const dirY = dy / distance;

            // Push particles away from mouse
            this.x -= dirX * smoothForce * 8;
            this.y -= dirY * smoothForce * 8;
          }
        }

        // Smoothly return to the target path (easing)
        const easing = 0.05;
        this.x += (this.targetX - this.x) * easing;
        this.y += (this.targetY - this.y) * easing;

        this.draw();
      }
    }

    function init() {
      particles = [];
      let numberOfParticles = (canvas.height * canvas.width) / 9000;
      const blueShades = [
        "rgba(59, 130, 246, 1)", // Blue 500
        "rgba(37, 99, 235, 1)", // Blue 600
        "rgba(96, 165, 250, 1)", // Blue 400
        "rgba(29, 78, 216, 1)", // Blue 700
      ];

      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 3.5 + 1.5; // Slightly larger sizes
        let x =
          Math.random() * (window.innerWidth - size * 2 - size * 2) + size * 2;
        let y =
          Math.random() * (window.innerHeight - size * 2 - size * 2) + size * 2;
        let vx = Math.random() * 0.4 - 0.2;
        let vy = Math.random() * 0.4 - 0.2;
        let color = blueShades[Math.floor(Math.random() * blueShades.length)];
        particles.push(new Particle(x, y, vx, vy, size, color));
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let distance =
            (particles[a].x - particles[b].x) *
              (particles[a].x - particles[b].x) +
            (particles[a].y - particles[b].y) *
              (particles[a].y - particles[b].y);

          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - distance / 20000;

            let dx_mouse_a = mouse.x ? particles[a].x - mouse.x : 10000;
            let dy_mouse_a = mouse.y ? particles[a].y - mouse.y : 10000;
            let distance_mouse_a = Math.sqrt(
              dx_mouse_a * dx_mouse_a + dy_mouse_a * dy_mouse_a,
            );

            if (mouse.x && distance_mouse_a < mouse.radius) {
              ctx.strokeStyle = `rgba(147, 197, 253, ${opacityValue * 0.8})`; // Lighter blue near mouse
            } else {
              ctx.strokeStyle = `rgba(37, 99, 235, ${opacityValue * 0.6})`; // Stronger blue for connections
            }

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      // Set the background color inside the canvas draw loop
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#020817]">
      {/* Background glowing blue gradients */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* The canvas is now the primary background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      ></canvas>

      {/* Overlay HTML Content */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative z-10 text-center p-6 max-w-[900px] w-full pt-32"
      >
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--card-border)] bg-[var(--surface)] w-fit mx-auto mb-8 backdrop-blur-sm shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--dot-active)]" />
          <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.2em] font-medium">
            AI WORKFLOW SYSTEMS FOR HIGH-INQUIRY TEAMS
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] text-[var(--text-primary)] mb-8 flex flex-col items-center cursor-default origin-center"
          whileHover={{
            scale: 1.01,
            filter: "drop-shadow(0 0 30px rgba(59,130,246,0.15))",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          <div className="flex flex-wrap justify-center gap-x-[0.25em]">
            {["AI", "Automation", "That"].map((word, i) => (
              <span key={i}>{word}</span>
            ))}
          </div>

          <span className="relative inline-block text-white py-2">
            Turns Inquiries Into
          </span>

          <div className="flex flex-wrap justify-center gap-x-[0.25em]">
            <span
              className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-100 to-blue-500 bg-[length:200%_auto]"
              style={{
                animation: "shimmer 4s linear infinite",
              }}
            >
              Sales-Ready Opportunities
            </span>
          </div>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-base md:text-[18px] text-[var(--text-secondary)] leading-[1.6] max-w-[700px] mx-auto mb-12 font-medium opacity-90"
        >
          We design automation systems that capture leads, qualify intent, sync
          CRM data, and trigger the right follow-up flows so your team spends
          less time chasing and more time closing.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8"
        >
          <a
            href="https://cal.com/flowstra/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors shadow-lg"
          >
            Book a Call
          </a>
          <a
            href="#solutions"
            className="px-8 py-3.5 rounded-full bg-[var(--surface)] border border-[var(--card-border)] text-white font-semibold text-sm hover:bg-[rgba(255,255,255,0.05)] transition-colors backdrop-blur-md"
          >
            See What We Automate
          </a>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-[10px] md:text-[11px] text-[var(--text-muted)] mb-12 max-w-[500px] mx-auto leading-relaxed tracking-wide font-medium uppercase opacity-70"
        >
          Best first step for mapping workflow gaps, qualification logic, and
          what should be automated first.
        </motion.p>

        {/* Feature pills section */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-4 items-center"
        >
          <div className="px-6 py-2 rounded-full border border-[var(--card-border)] bg-[rgba(255,255,255,0.02)] text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--text-muted)] backdrop-blur-sm">
            BUILT FOR HIGH-INQUIRY SALES TEAMS
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              "LEAD INTAKE",
              "AI QUALIFICATION",
              "CRM SYNC",
              "SMART ROUTING",
            ].map((pill) => (
              <span
                key={pill}
                className="px-5 py-2 rounded-full border border-[var(--card-border)] bg-[var(--surface)] text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] backdrop-blur-sm hover:border-blue-500/50 transition-colors"
              >
                {pill}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AetherFlowHero;
