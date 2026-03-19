"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";

const EMOJI_DEFS = [
  { src: "/emoji/cake.png",       top: 0.02, left: 0.01,  size: 160 },
  { src: "/emoji/palm.png",       top: 0.08, left: 0.16,  size: 160 },
  { src: "/emoji/drink.png",      top: 0.04, left: 0.44,  size: 160 },
  { src: "/emoji/heart.png",      top: 0.09, left: 0.70,  size: 160 },
  { src: "/emoji/plane.png",      top: 0.02, left: 0.89,  size: 160 },
  { src: "/emoji/basketball.png", top: 0.40, left: 0.01,  size: 120 },
  { src: "/emoji/cocktail.png",   top: 0.13, left: 0.33,  size: 102 },
  { src: "/emoji/burger.png",     top: 0.60, left: 0.74,  size: 160 },
  { src: "/emoji/yo.png",         top: 0.36, left: 0.89,  size: 160 },
  { src: "/emoji/arrow.png",      top: 0.62, left: 0.02,  size: 160 },
  { src: "/emoji/laugh.png",      top: 0.70, left: 0.24,  size: 160 },
  { src: "/emoji/champange.png",  top: 0.80, left: 0.60,  size: 160 },
  { src: "/emoji/book.png",       top: 0.56, left: 0.90,  size: 144 },
  { src: "/emoji/car.png",        top: 0.75, left: 0.19,  size: 160 },
  { src: "/emoji/ice.png",        top: 0.88, left: 0.42,  size: 136 },
  { src: "/emoji/earth.png",      top: 0.84, left: 0.86,  size: 160 },
];

const FRICTION     = 0.985;
const ANG_FRICTION = 0.96;
const RESTITUTION  = 0.72;
const FADE_IN_MS   = 600;
const MOUSE_RADIUS = 160;
const MOUSE_FORCE  = 6;
const OBS_PAD      = 12;

type Box = {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number;
  angularVel: number;
  size: number;
  img: HTMLImageElement;
  spawnTime: number;
};

type Rect = { x: number; y: number; w: number; h: number };

function resolveCircleRect(b: Box, obs: Rect) {
  const r = b.size / 2;
  const left   = obs.x - OBS_PAD;
  const top    = obs.y - OBS_PAD;
  const right  = obs.x + obs.w + OBS_PAD;
  const bottom = obs.y + obs.h + OBS_PAD;

  const cx = Math.max(left, Math.min(b.x, right));
  const cy = Math.max(top,  Math.min(b.y, bottom));
  const dx = b.x - cx;
  const dy = b.y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < r && dist > 0.001) {
    const nx = dx / dist;
    const ny = dy / dist;
    b.x += nx * (r - dist);
    b.y += ny * (r - dist);
    const vDotN = b.vx * nx + b.vy * ny;
    if (vDotN < 0) {
      b.vx -= (1 + RESTITUTION) * vDotN * nx;
      b.vy -= (1 + RESTITUTION) * vDotN * ny;
      b.angularVel += vDotN * (Math.random() - 0.5) * 2;
    }
  }
}

export const TravelPromo = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const boxesRef     = useRef<Box[]>([]);
  const imagesRef    = useRef<HTMLImageElement[]>([]);
  const spawnedRef   = useRef(false);
  const rafRef       = useRef<number | undefined>(undefined);
  const mouseRef     = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [progress, setProgress] = useState(0);

  // Preload images
  useEffect(() => {
    imagesRef.current = EMOJI_DEFS.map((def) => {
      const img = new window.Image();
      img.src = def.src;
      return img;
    });
  }, []);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const s = sectionRef.current;
      if (!s) return;
      const rect = s.getBoundingClientRect();
      const scrollable = s.offsetHeight - window.innerHeight;
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Spawn emojis once text has animated in
  useEffect(() => {
    if (spawnedRef.current) return;
    if (progress < 0.20) return;
    spawnedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;

    EMOJI_DEFS.forEach((def, i) => {
      boxesRef.current.push({
        x: def.left * W,
        y: def.top  * H,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        rotation: (Math.random() - 0.5) * 30,
        angularVel: (Math.random() - 0.5) * 4,
        size: def.size,
        img: imagesRef.current[i],
        spawnTime: Date.now(),
      });
    });
  }, [progress]);

  // Physics + canvas loop
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current = { x, y, active: true };
      } else {
        mouseRef.current.active = false;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const loop = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Text obstacle rects in canvas-local coords
      const canvasRect = canvas.getBoundingClientRect();
      const obstacles: Rect[] = [];
      for (const el of [titleRef.current, subtitleRef.current]) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        obstacles.push({
          x: r.left - canvasRect.left,
          y: r.top  - canvasRect.top,
          w: r.width,
          h: r.height,
        });
      }

      const boxes = boxesRef.current;
      const mouse = mouseRef.current;

      for (const b of boxes) {
        b.vx *= FRICTION;
        b.vy *= FRICTION;
        b.angularVel *= ANG_FRICTION;

        if (mouse.active) {
          const dx = b.x - mouse.x;
          const dy = b.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0.001) {
            const strength = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
            b.vx += (dx / dist) * strength;
            b.vy += (dy / dist) * strength;
            b.angularVel += strength * (Math.random() - 0.5) * 3;
          }
        }

        b.x += b.vx;
        b.y += b.vy;
        b.rotation += b.angularVel;

        if (b.x - b.size / 2 < 0) { b.x = b.size / 2;     b.vx =  Math.abs(b.vx) * RESTITUTION; }
        if (b.x + b.size / 2 > W) { b.x = W - b.size / 2; b.vx = -Math.abs(b.vx) * RESTITUTION; }
        if (b.y - b.size / 2 < 0) { b.y = b.size / 2;     b.vy =  Math.abs(b.vy) * RESTITUTION; }
        if (b.y + b.size / 2 > H) { b.y = H - b.size / 2; b.vy = -Math.abs(b.vy) * RESTITUTION; }

        for (const obs of obstacles) {
          resolveCircleRect(b, obs);
        }
      }

      // Emoji–emoji collisions
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const ra = a.size / Math.SQRT2;
          const rb = b.size / Math.SQRT2;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = ra + rb;
          if (dist < minDist && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (minDist - dist) * 0.5;
            a.x -= nx * overlap; a.y -= ny * overlap;
            b.x += nx * overlap; b.y += ny * overlap;
            const dvn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (dvn < 0) {
              const imp = -(1 + RESTITUTION) * dvn / 2;
              a.vx -= imp * nx; a.vy -= imp * ny;
              b.vx += imp * nx; b.vy += imp * ny;
              a.angularVel += imp * 2.5 * (Math.random() - 0.5);
              b.angularVel -= imp * 2.5 * (Math.random() - 0.5);
            }
          }
        }
      }

      // Draw
      const now = Date.now();
      for (const b of boxes) {
        if (!b.img.complete || !b.img.naturalWidth) continue;
        const age   = now - b.spawnTime;
        const alpha = Math.min(1, age / FADE_IN_MS);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate((b.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;
        ctx.drawImage(b.img, -b.size / 2, -b.size / 2, b.size, b.size);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Scroll-driven text animations
  const ease = (p: number, start: number, end: number) =>
    Math.max(0, Math.min(1, (p - start) / (end - start)));

  const fadeUp = (p: number, dist = 32) => ({
    opacity: p,
    filter: `blur(${(1 - p) * 8}px)`,
    transform: `translateY(${(1 - p) * dist}px)`,
  });

  const titleP    = ease(progress, 0.15, 0.38);
  const subtitleP = ease(progress, 0.30, 0.52);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "200vh" }}>
      <div
        ref={containerRef}
        className="sticky top-0 h-screen overflow-hidden bg-black"
      >
        {/* Physics canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Center Content */}
        <Container className="relative h-full">
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
            style={{ zIndex: 2 }}
          >
            <h2
              ref={titleRef}
              className="text-display font-semibold tracking-[-0.02em] text-white mb-1 md:mb-1.5"
              style={fadeUp(titleP)}
            >
              Love to travel or go out?
            </h2>

            <p
              ref={subtitleRef}
              className="mt-1.5 text-[40px] font-normal tracking-[-0.03em] whitespace-nowrap bg-linear-to-r from-[#00BFFF] to-[#1E3A98] bg-clip-text text-transparent"
              style={fadeUp(subtitleP)}
            >
              <span className="font-semibold">MapsGPT</span>
              <span> is already answering thousands of queries in your area</span>
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
};
