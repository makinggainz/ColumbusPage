"use client";

import { useEffect, useRef, useState } from "react";

// Each icon: src, initial position as % of viewport, size in px
const ICON_DEFS = [
  { src: "/Icon/icon-openai.png",  top: 0.18, left: 0.10, size: 72 },
  { src: "/Icon/xai.png",          top: 0.12, left: 0.34, size: 66 },
  { src: "/Icon/perplexity.png",   top: 0.12, left: 0.64, size: 78 },
  { src: "/Icon/claude.png",       top: 0.20, left: 0.83, size: 72 },
  { src: "/Icon/gemini.png",       top: 0.34, left: 0.55, size: 78 },
  { src: "/Icon/xai2.png",         top: 0.60, left: 0.45, size: 66 },
  { src: "/Icon/gemini2.png",      top: 0.72, left: 0.13, size: 66 },
  { src: "/Icon/claude2.png",      top: 0.76, left: 0.29, size: 66 },
  { src: "/Icon/logo7.png",        top: 0.77, left: 0.63, size: 72 },
  { src: "/Icon/icon-openai2.png", top: 0.72, left: 0.83, size: 72 },
  { src: "/Icon/mistral.png",      top: 0.44, left: 0.08, size: 60 },
];

type Box = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  angularVel: number;
  size: number;
  img: HTMLImageElement;
  spawnTime: number;
};

const GRAVITY     = 0.45;
const DAMPING     = 0.52;
const FRICTION    = 0.975;
const ANG_FRICTION = 0.93;
const RESTITUTION = 0.38;
const FADE_IN_MS  = 600; // ms to fade in after spawn

export const GeoWarning = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const boxesRef     = useRef<Box[]>([]);
  const imagesRef    = useRef<HTMLImageElement[]>([]);
  const idRef        = useRef(0);
  const spawnedRef   = useRef(false);
  const rafRef       = useRef<number | undefined>(undefined);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [progress, setProgress] = useState(0);

  // ── Preload images ───────────────────────────────────────────────────────────
  useEffect(() => {
    imagesRef.current = ICON_DEFS.map((def) => {
      const img = new window.Image();
      img.src = def.src;
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
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Spawn icons when animation threshold is reached ──────────────────────────
  useEffect(() => {
    if (spawnedRef.current) return;
    if (progress < 0.20) return; // wait until icons have animated in
    spawnedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;

    ICON_DEFS.forEach((def, i) => {
      const img = imagesRef.current[i];
      boxesRef.current.push({
        id: idRef.current++,
        x: def.left * W,
        y: def.top  * H,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 0,
        rotation: 0,
        angularVel: (Math.random() - 0.5) * 4,
        size: def.size,
        img,
        spawnTime: Date.now(),
      });
    });
  }, [progress]);

  // ── Physics + canvas loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
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
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onMouseLeave = () => { mouseRef.current.active = false; };
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    const loop = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const boxes = boxesRef.current;

      // ── Integrate ────────────────────────────────────────────────────────────
      const MOUSE_RADIUS = 130;
      const MOUSE_FORCE  = 10;
      const mouse = mouseRef.current;

      for (const b of boxes) {
        b.vy += GRAVITY;
        b.vx *= FRICTION;
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

        if (b.y + b.size / 2 >= H) {
          b.y = H - b.size / 2;
          b.vy = -Math.abs(b.vy) * DAMPING;
          b.vx *= 0.82;
          b.angularVel *= 0.6;
          if (Math.abs(b.vy) < 0.8) b.vy = 0;
        }
        if (b.x - b.size / 2 < 0) { b.x = b.size / 2;     b.vx =  Math.abs(b.vx) * 0.55; }
        if (b.x + b.size / 2 > W) { b.x = W - b.size / 2; b.vx = -Math.abs(b.vx) * 0.55; }
      }

      // ── Box-box collisions ───────────────────────────────────────────────────
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

      // ── Draw ─────────────────────────────────────────────────────────────────
      const now = Date.now();
      for (const b of boxes) {
        if (!b.img.complete || !b.img.naturalWidth) continue;
        const age = now - b.spawnTime;
        const alpha = Math.min(0.5, 0.5 * (age / FADE_IN_MS));
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
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // ── Scroll-driven text animations ────────────────────────────────────────────
  const ease = (p: number, start: number, end: number) =>
    Math.max(0, Math.min(1, (p - start) / (end - start)));

  // Interpolate from white (#FFFFFF) to Apple light gray (#F5F5F7) on scroll
  const bgProgress = ease(progress, 0, 0.25);
  const bgR = Math.round(255 + (245 - 255) * bgProgress);
  const bgG = Math.round(255 + (245 - 255) * bgProgress);
  const bgB = Math.round(255 + (247 - 255) * bgProgress);
  const bgColor = `rgb(${bgR},${bgG},${bgB})`;

  const line1P = ease(progress, 0.15, 0.38);
  const line2P = ease(progress, 0.30, 0.52);
  const ctaP   = ease(progress, 0.42, 0.58);

  const fadeUp = (p: number, dist = 32) => ({
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
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: bgColor, transition: "background-color 0.05s linear" }}
      >
        {/* Physics canvas — icons fall here */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Centered text */}
        <div className="relative" style={{ zIndex: 2 }}>
          <div className="max-w-[980px] mx-auto px-6">
            <div className="flex flex-col items-center text-center">

              <h2
                style={{ ...fadeUp(line1P) }}
                className="text-[48px] md:text-[56px] font-semibold tracking-[-0.003em] leading-[1.07] text-[#1D1D1F] text-center"
              >
                <span>Stop using Language models</span>
                <br />
                <span>for Geographical work.</span>
              </h2>

              <p
                style={{ ...fadeUp(line2P) }}
                className="mt-6 text-[28px] md:text-[32px] leading-[1.3] tracking-tight"
              >
                <span className="font-semibold bg-linear-to-r from-[#CD0A00] to-[#1D1D1F] bg-clip-text text-transparent">
                  LLMs hallucinate and{" "}
                  <span className="font-bold">cannot</span>
                  {" "}be trusted for the real world
                </span>
              </p>

              <div style={{ ...fadeUp(ctaP) }} className="mt-8">
                <a
                  href="#"
                  className="text-[#4F46E5] text-[20px] hover:underline transition-colors"
                >
                  Learn why &#8250;
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
