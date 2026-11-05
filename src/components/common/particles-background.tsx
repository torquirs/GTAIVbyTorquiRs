"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 32;
const FRAME_DURATION_MS = 1000 / 60;

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vy: number;
  phase: number;
}

/**
 * Renders ambient particles that drift continuously upward behind page content.
 */
export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    let width = 0;
    let height = 0;
    let previousTime = 0;
    let animationFrame = 0;
    const particles: Particle[] = [];

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (particles.length === 0) {
        for (let index = 0; index < PARTICLE_COUNT; index += 1) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 1 + Math.random(),
            opacity: 0.12 + Math.random() * 0.18,
            vy: -(0.2 + Math.random() * 0.3),
            phase: Math.random() * Math.PI * 2,
          });
        }
      } else {
        for (const particle of particles) {
          particle.x = Math.min(particle.x, width);
          particle.y = Math.min(particle.y, height);
        }
      }
    };

    const drawFrame = (time: number) => {
      const frameScale = previousTime
        ? Math.min((time - previousTime) / FRAME_DURATION_MS, 2)
        : 1;
      previousTime = time;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.phase += 0.018 * frameScale;
        particle.x += Math.sin(particle.phase) * 0.1 * frameScale;
        particle.y += particle.vy * frameScale;

        if (particle.y + particle.radius < 0) {
          particle.y = height + particle.radius;
          particle.x = Math.random() * width;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(210, 230, 255, ${particle.opacity})`;
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(drawFrame);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animationFrame = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 size-full"
    />
  );
}
