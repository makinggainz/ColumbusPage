"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";

type Box = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  angularVel: number;
  size: number; // single value — always square
  imgIndex: number;
  spawnTime: number;
};

const ICON_SRCS = [
  "/Icon/claude.png",
  "/Icon/claude2.png",
  "/Icon/desktop-ui.png",
  "/Icon/gemini.png",
  "/Icon/gemini2.png",
  "/Icon/gen.png",
  "/Icon/icon-openai.png",
  "/Icon/icon-openai2.png",
  "/Icon/img1.png",
  "/Icon/logo1.png",
  "/Icon/logo2.png",
  "/Icon/logo3.png",
  "/Icon/logo4.png",
  "/Icon/logo5.png",
  "/Icon/logo6.png",
  "/Icon/logo7.png",
  "/Icon/mistral.png",
  "/Icon/mobile-ui.png",
  "/Icon/more.png",
  "/Icon/perplexity.png",
  "/Icon/site.png",
  "/Icon/urban.png",
  "/Icon/xai.png",
  "/Icon/xai2.png",
];

const GRAVITY = 0.45;
const DAMPING = 0.52;
const FRICTION = 0.975;
const ANG_FRICTION = 0.93;
const RESTITUTION = 0.38;
const SPAWN_THROTTLE_MS = 55;
const ICON_SIZE = 52; // rendered size in px

export const GeoWarning = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxesRef = useRef<Box[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const idRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const rafRef = useRef<number>();
  const [progress, setProgress] = useState(0);

  // ── Preload icons ────────────────────────────────────────────────────────────
  useEffect(() => {
    imagesRef.current = ICON_SRCS.map((src) => {
      const img = new window.Image();
      img.src = src;
      return img;
    });
  }, []);

  // ── Scroll progress ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const s = sectionRef.current;
      if (!s) return;
      const rect = s.getBoundingClientRect();
      const scrollable = s.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Physics + canvas loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const boxes = boxesRef.current;

      // ── Integrate ──────────────────────────────────────────────────────────
      for (const b of boxes) {
        b.vy += GRAVITY;
        b.vx *= FRICTION;
        b.angularVel *= ANG_FRICTION;
        b.x += b.vx;
        b.y += b.vy;
        b.rotation += b.angularVel;

        // Floor
        if (b.y + b.size / 2 >= H) {
          b.y = H - b.size / 2;
          b.vy = -Math.abs(b.vy) * DAMPING;
          b.vx *= 0.82;
          b.angularVel *= 0.6;
          if (Math.abs(b.vy) < 0.8) b.vy = 0;
        }

        // Walls
        if (b.x - b.size / 2 < 0)  { b.x = b.size / 2;     b.vx =  Math.abs(b.vx) * 0.55; }
        if (b.x + b.size / 2 > W)  { b.x = W - b.size / 2; b.vx = -Math.abs(b.vx) * 0.55; }
      }

      // ── Box–box collisions (circle approximation) ──────────────────────────
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
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;

            const dvx = b.vx - a.vx;
            const dvy = b.vy - a.vy;
            const dvn = dvx * nx + dvy * ny;

            if (dvn < 0) {
              const impulse = -(1 + RESTITUTION) * dvn / 2;
              a.vx -= impulse * nx;
              a.vy -= impulse * ny;
              b.vx += impulse * nx;
              b.vy += impulse * ny;

              a.angularVel += impulse * 2.5 * (Math.random() - 0.5);
              b.angularVel -= impulse * 2.5 * (Math.random() - 0.5);
            }
          }
        }
      }

      // ── Remove fully faded boxes ───────────────────────────────────────────
      const now = Date.now();
      boxesRef.current = boxes.filter(b => now - b.spawnTime < 32000);

      // ── Draw ───────────────────────────────────────────────────────────────
      const imgs = imagesRef.current;
      for (const b of boxesRef.current) {
        const img = imgs[b.imgIndex];
        if (!img?.complete || !img.naturalWidth) continue;
        const age = now - b.spawnTime;
        const alpha = age < 30000 ? 0.85 : Math.max(0, 0.85 * (1 - (age - 30000) / 2000));
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate((b.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, -b.size / 2, -b.size / 2, b.size, b.size);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Mouse handler ────────────────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastSpawnRef.current < SPAWN_THROTTLE_MS) return;
    lastSpawnRef.current = now;

    const rect = containerRef.current!.getBoundingClientRect();

    boxesRef.current.push({
      id: idRef.current++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 3 - 1.5,
      rotation: Math.random() * 360,
      angularVel: (Math.random() - 0.5) * 14,
      size: ICON_SIZE,
      imgIndex: Math.floor(Math.random() * ICON_SRCS.length),
      spawnTime: Date.now(),
    });
  };

  // ── Scroll-driven text animations ────────────────────────────────────────────
  const ease = (p: number, start: number, end: number) =>
    Math.max(0, Math.min(1, (p - start) / (end - start)));

  const bgProgress = ease(progress, 0, 0.25);
  const bgChannel = Math.round(235 + (255 - 235) * bgProgress);
  const bgColor = `rgb(${bgChannel}, ${bgChannel}, ${bgChannel})`;

  const eyebrowP = ease(progress, 0.05, 0.22);
  const line1P   = ease(progress, 0.18, 0.38);
  const line2P   = ease(progress, 0.32, 0.52);

  const fadeUp = (p: number, dist = 36) => ({
    opacity: p,
    filter: `blur(${(1 - p) * 8}px)`,
    transform: `translateY(${(1 - p) * dist}px)`,
  });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "200vh" }}
    >
      <div
        ref={containerRef}
        className="sticky top-0 h-screen overflow-hidden flex items-center"
        style={{ backgroundColor: bgColor, transition: "background-color 0.05s linear" }}
        onMouseMove={handleMouseMove}
      >
        {/* Physics canvas — behind text */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Text content */}
        <Container style={{ position: "relative", zIndex: 2 }}>
          <div className="max-w-3xl">

            <p
              className="text-sm font-medium tracking-widest uppercase text-[#1C274C]/60 mb-8"
              style={fadeUp(eyebrowP, 20)}
            >
              GEOSPATIAL INTELLIGENCE
            </p>

            <h2
              className="font-thin leading-[1.05] tracking-tight text-[#0A1344]"
              style={{ fontSize: "clamp(48px, 6vw, 80px)", ...fadeUp(line1P) }}
            >
              Stop using language models
            </h2>

            <h2
              className="font-thin leading-[1.05] tracking-tight text-[#838383]"
              style={{ fontSize: "clamp(48px, 6vw, 80px)", ...fadeUp(line2P) }}
            >
              for geographical work.
            </h2>

          </div>
        </Container>
      </div>
    </section>
  );
};
