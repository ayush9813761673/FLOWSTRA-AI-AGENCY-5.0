import React, { useEffect, useRef } from "react";

interface ConfettiEffectProps {
  active: boolean;
}

export function ConfettiEffect({ active }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = [
      "#3b82f6", // flowstra blue
      "#10b981", // flowstra emerald
      "#6366f1", // flowstra indigo
      "#a855f7", // flowstra purple
      "#f43f5e", // flowstra rose
      "#fbbf24", // flowstra amber
    ];

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      gravity: number;
      opacity: number;
      shape: "rect" | "circle" | "triangle";
    }

    const particles: Particle[] = [];
    const particleCount = 150;

    // Spawn point: center of the modal window area
    const spawnX = width / 2;
    const spawnY = height / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 18;
      const shapes: Array<"rect" | "circle" | "triangle"> = ["rect", "circle", "triangle"];
      
      particles.push({
        x: spawnX,
        y: spawnY,
        size: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angle) * velocity,
        speedY: Math.sin(angle) * velocity - 4, // explosive upward push
        rotation: Math.random() * 360,
        rotationSpeed: -8 + Math.random() * 16,
        gravity: 0.25 + Math.random() * 0.2,
        opacity: 1.0,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of particles) {
        if (p.opacity <= 0) continue;
        alive = true;

        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += p.gravity;
        p.speedX *= 0.97; // air resistance
        p.speedY *= 0.97;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.009; // smooth fade-out over ~3-4 seconds

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.6);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Triangle ribbon
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      if (alive) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      className="fixed inset-0 pointer-events-none z-[11000] w-full h-full"
    />
  );
}
