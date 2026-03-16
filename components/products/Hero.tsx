"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";
import { ConsumerEnterpriseToggle } from "@/components/enterprise/ConsumerEnterpriseToggle";

const PHONE_HEIGHT = 778;
const CANVAS_W     = 1728;
const CANVAS_H     = 1756;

const ICONS = [
  { src: "/product/basketball.png", size: 143 },
  { src: "/product/martini.png",    size: 121 },
  { src: "/product/emoji.png",      size: 127 },
  { src: "/product/palne.png",      size: 154 },
  { src: "/product/passport.png",   size: 110 },
  { src: "/product/champ.png",      size: 127 },
  { src: "/product/earth.png",      size: 143 },
];

// Matching section-j (TravelPromo) physics constants exactly
const FRICTION     = 0.985;
const ANG_FRICTION = 0.96;
const RESTITUTION  = 0.72;
const MOUSE_RADIUS = 200;
const MOUSE_FORCE  = 8;   // per-frame impulse, same style as TravelPromo

type Box = {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number;
  angularVel: number;
  size: number;
  img: HTMLImageElement;
  alive: boolean;
  alpha: number;
};

export default function Hero() {
  const [isLocked, setIsLocked]         = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const phoneContainerRef = useRef<HTMLDivElement>(null);
  const phoneRef          = useRef<HTMLDivElement>(null);
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const boxesRef          = useRef<Box[]>([]);
  const imagesRef         = useRef<HTMLImageElement[]>([]);
  const mouseRef          = useRef({ x: -9999, y: -9999, active: false });
  const scrollYRef        = useRef(0);
  const firedRef          = useRef(false);
  const rafRef            = useRef<number>(0);

  // Pre-load images immediately
  useEffect(() => {
    imagesRef.current = ICONS.map(({ src }) => {
      const img = new window.Image();
      img.src = src;
      return img;
    });
  }, []);

  // Content fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setContentVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Title gradient sweep-in
  useEffect(() => {
    const t = setTimeout(() => setTitleVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity:    contentVisible ? 1 : 0,
    filter:     contentVisible ? "blur(0px)" : "blur(8px)",
    transform:  contentVisible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  });

  // Phone scroll-lock (unchanged)
  useEffect(() => {
    const onScroll = () => {
      const el = phoneContainerRef.current;
      if (!el) return;
      const rect        = el.getBoundingClientRect();
      const viewCenter  = window.innerHeight / 2;
      const phoneCenter = rect.top + PHONE_HEIGHT / 2;
      const threshold   = 60;
      if (phoneCenter <= viewCenter + threshold && phoneCenter >= viewCenter - threshold) {
        setIsLocked(true);
      } else if (phoneCenter > viewCenter + threshold || rect.bottom < 0) {
        setIsLocked(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cannon fire — 1 second delay
  useEffect(() => {
    const t = setTimeout(() => {
      if (firedRef.current) return;
      firedRef.current = true;

      const canvas = canvasRef.current;
      const phone  = phoneRef.current;
      if (!canvas || !phone) return;

      const cr    = canvas.getBoundingClientRect();
      const pr    = phone.getBoundingClientRect();
      const scale = Math.min(1, window.innerWidth / CANVAS_W);

      // Phone center in canvas coords
      const ox = (pr.left - cr.left) / scale + pr.width  / scale / 2;
      const oy = (pr.top  - cr.top)  / scale + pr.height / scale / 2;

      boxesRef.current = ICONS.map(({ size }, i) => {
        // Fan upward: -160° to -20°
        const minAngle = (-160 * Math.PI) / 180;
        const maxAngle = (-20  * Math.PI) / 180;
        const angle    = minAngle + (maxAngle - minAngle) * (i / (ICONS.length - 1))
                         + (Math.random() - 0.5) * 0.2;
        // per-frame speed in canvas-pixel units (same scale as TravelPromo)
        const speed = 32 + Math.random() * 22;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation:   (Math.random() - 0.5) * 30,
          angularVel: (Math.random() - 0.5) * 4,
          size,
          img:   imagesRef.current[i],
          alive: true,
          alpha: 1,
        };
      });
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  // Physics + canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      const boxes = boxesRef.current;
      if (!boxes.length) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Phone target in canvas coords (updated every frame — works locked or not)
      let targetX = CANVAS_W / 2;
      let targetY = CANVAS_H / 2;
      const phone = phoneRef.current;
      if (phone) {
        const cr    = canvas.getBoundingClientRect();
        const pr    = phone.getBoundingClientRect();
        const scale = Math.min(1, window.innerWidth / CANVAS_W);
        targetX = (pr.left - cr.left) / scale + pr.width  / scale / 2;
        targetY = (pr.top  - cr.top)  / scale + pr.height / scale / 2;
      }

      // Viewport-bottom floor in canvas coords
      const cr    = canvas.getBoundingClientRect();
      const scale = Math.min(1, window.innerWidth / CANVAS_W);
      const floorY = (window.innerHeight - cr.top) / scale;

      // Scroll suck strength
      const suckT = Math.max(0, Math.min((scrollYRef.current - 80) / 320, 1));

      const mouse = mouseRef.current;

      // ── Physics step ──────────────────────────────────────────────────────────
      for (const b of boxes) {
        if (!b.alive) continue;

        // Friction (matches TravelPromo exactly)
        b.vx         *= FRICTION;
        b.vy         *= FRICTION;
        b.angularVel *= ANG_FRICTION;

        // Mouse repulsion
        if (mouse.active) {
          const dx   = b.x - mouse.x;
          const dy   = b.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0.001) {
            const strength = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
            b.vx         += (dx / dist) * strength;
            b.vy         += (dy / dist) * strength;
            b.angularVel += strength * (Math.random() - 0.5) * 3;
          }
        }

        // Scroll suck toward phone
        if (suckT > 0) {
          const dx   = targetX - b.x;
          const dy   = targetY - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < b.size * 0.4) {
            // Close enough — fade out
            b.alpha -= 0.06;
            if (b.alpha <= 0) { b.alive = false; continue; }
          } else {
            const sf = suckT * 14;
            b.vx += (dx / dist) * sf;
            b.vy += (dy / dist) * sf;
          }
        }

        b.x        += b.vx;
        b.y        += b.vy;
        b.rotation += b.angularVel;

        // Wall bounces (bottom = viewport edge)
        const r = b.size / 2;
        if (b.x - r < 0)        { b.x = r;            b.vx =  Math.abs(b.vx) * RESTITUTION; }
        if (b.x + r > CANVAS_W) { b.x = CANVAS_W - r; b.vx = -Math.abs(b.vx) * RESTITUTION; }
        if (b.y - r < 0)        { b.y = r;             b.vy =  Math.abs(b.vy) * RESTITUTION; }
        if (b.y + r > floorY)   { b.y = floorY - r;   b.vy = -Math.abs(b.vy) * RESTITUTION; }
      }

      // ── Emoji–emoji collisions (identical to TravelPromo) ────────────────────
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          if (!a.alive || !b.alive) continue;
          const ra = a.size / Math.SQRT2;
          const rb = b.size / Math.SQRT2;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = ra + rb;
          if (dist < minDist && dist > 0.001) {
            const nx      = dx / dist;
            const ny      = dy / dist;
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
      for (const b of boxes) {
        if (!b.alive) continue;
        if (!b.img.complete || !b.img.naturalWidth) continue;
        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.translate(b.x, b.y);
        ctx.rotate((b.rotation * Math.PI) / 180);
        ctx.drawImage(b.img, -b.size / 2, -b.size / 2, b.size, b.size);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Mouse tracking — convert screen coords to canvas coords
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect  = canvas.getBoundingClientRect();
      const scale = Math.min(1, window.innerWidth / CANVAS_W);
      const x     = (e.clientX - rect.left) / scale;
      const y     = (e.clientY - rect.top)  / scale;
      mouseRef.current = { x, y, active: x >= 0 && x <= CANVAS_W && y >= 0 };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => { scrollYRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="relative overflow-hidden flex justify-center"
      style={{
        background: "linear-gradient(180deg, #D2ECF7 73.22%, #F9F9F9 100%)",
        height: "calc(1756px * min(1, 100vw / 1728))",
      }}
    >
      {/* Scaled canvas wrapper */}
      <div
        className="origin-top"
        style={{
          width: 1728,
          height: 1756,
          transform: "scale(min(1, 100vw / 1728))",
          transformOrigin: "top center",
          flexShrink: 0,
        }}
      >
        <div className="relative w-[1728px] h-[1756px]">

          {/* Physics canvas — pointer-events-none so UI underneath stays clickable */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: CANVAS_W, height: CANVAS_H, zIndex: 1 }}
          />

          {/* Toggle + Badge + Title + Phone */}
          <div
            className="absolute top-[100px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[200px]"
            style={{ zIndex: 2 }}
          >
            <div style={fadeIn(0)}>
              <ConsumerEnterpriseToggle variant="light" active="consumer" />
            </div>

            <div className="flex flex-col items-center gap-[21px]">
              <div className={glassStyles.btn} style={{ width: 266, height: 43, padding: 0, ...fadeIn(0.1) }}>
                <span style={{ fontSize: 16, fontWeight: 500 }}>Only Available on Earth</span>
              </div>
              <div className="text-center">
                <h1
                  className="text-[48px] font-semibold leading-[140%] flex items-center justify-center"
                  style={{
                    fontFamily: '"SF Compact", -apple-system, BlinkMacSystemFont, sans-serif',
                    background: "linear-gradient(90deg, #074146 0%, #000000 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    ...fadeIn(0.2),
                  }}
                >
                  MapsGPT
                </h1>
                <h2
                  className="text-[64px] font-semibold leading-[140%] flex items-center justify-center"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #59E1EB 14.99%, #313434 100%)",
                    backgroundSize: "200% 100%",
                    backgroundPosition: titleVisible ? "0% 0" : "100% 0",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    transition: `background-position 1.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease-out 0.3s, filter 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s`,
                    opacity:   contentVisible ? 1 : 0,
                    filter:    contentVisible ? "blur(0px)" : "blur(8px)",
                    transform: contentVisible ? "translateY(0)" : "translateY(16px)",
                  }}
                >
                  Travel Like a Boss
                </h2>
              </div>
            </div>

            {/* Phone — always mounted, positioned via inline style */}
            <div ref={phoneContainerRef} className="mt-[100px]">
              {isLocked && (
                <div style={{ width: 404, height: PHONE_HEIGHT }} aria-hidden />
              )}
              <div
                ref={phoneRef}
                style={
                  isLocked
                    ? { position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 10, ...fadeIn(0.4) }
                    : fadeIn(0.4)
                }
              >
                <Image src="/product/phone.png" width={404} height={778} alt="Phone" priority />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
