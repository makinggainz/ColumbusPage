"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";
import { ConsumerEnterpriseToggle } from "@/components/enterprise/ConsumerEnterpriseToggle";

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

// Sparkle colors — light, airy, playful
const SPARKLE_COLORS = ["#59E1EB", "#FFD166", "#FF9A8B", "#A8E6CF", "#FFFFFF", "#C3B1E1"];

// Confetti colors — vivid but small, celebratory
const CONFETTI_COLORS = ["#59E1EB", "#FFD166", "#FF9A8B", "#A8E6CF", "#FFC3E1", "#B5EAD7", "#FFDAC1"];

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

type Sparkle = {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number;
  angularVel: number;
  radius: number;
  color: string;
  life: number;      // 0→1, counts down to 0
  maxLife: number;
};

type Confetti = {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number;
  angularVel: number;
  w: number;
  h: number;
  color: string;
  alpha: number;
  life: number;      // counts down to 0
  maxLife: number;
};

// Draw a 4-pointed star at (0,0)
function drawStar(ctx: CanvasRenderingContext2D, outerR: number) {
  const innerR = outerR * 0.28;
  const pts    = 4;
  ctx.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const angle = (i * Math.PI) / pts - Math.PI / 2;
    const r     = i % 2 === 0 ? outerR : innerR;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else         ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
}

export default function Hero() {
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const phoneRef              = useRef<HTMLDivElement>(null);
  const phoneSpringWrapperRef = useRef<HTMLDivElement>(null);
  const phoneSpringRef        = useRef({ offset: 0, velocity: 0 });
  const lastScrollYRef        = useRef(0);
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const boxesRef          = useRef<Box[]>([]);
  const sparklesRef       = useRef<Sparkle[]>([]);
  const confettiRef       = useRef<Confetti[]>([]);
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

  // Title gradient sweep-in
  useEffect(() => {
    const t = setTimeout(() => setTitleVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Content fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setContentVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity:    contentVisible ? 1 : 0,
    filter:     contentVisible ? "blur(0px)" : "blur(8px)",
    transform:  contentVisible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  });

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

      // ── Confetti burst from phone center ──────────────────────────────────────
      const pieces: Confetti[] = [];
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 20 + Math.random() * 40;
        const life  = 70 + Math.random() * 50;
        pieces.push({
          x: ox + (Math.random() - 0.5) * 40,
          y: oy + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 12, // stronger upward bias
          rotation:   Math.random() * 360,
          angularVel: (Math.random() - 0.5) * 18,
          w: 16 + Math.random() * 20,
          h: 8 + Math.random() * 10,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          alpha: 0.9 + Math.random() * 0.1,
          life,
          maxLife: life,
        });
      }
      confettiRef.current = pieces;
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

      const boxes    = boxesRef.current;
      const sparkles = sparklesRef.current;
      const confetti = confettiRef.current;

      // Phone target in canvas coords (updated every frame)
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

          if (dist < b.size * 1.8) {
            // Immediately absorb — spawn sparkles then kill
            b.alive = false;

            const count = 10 + Math.floor(Math.random() * 6);
            for (let k = 0; k < count; k++) {
              const angle = (k / count) * Math.PI * 2 + Math.random() * 0.5;
              const speed = 18 + Math.random() * 28;
              const life  = 30 + Math.floor(Math.random() * 20);
              sparkles.push({
                x: b.x,
                y: b.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                rotation:   Math.random() * 360,
                angularVel: (Math.random() - 0.5) * 22,
                radius: 18 + Math.random() * 24,
                color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
                life,
                maxLife: life,
              });
            }
            continue;
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

      // ── Emoji–emoji collisions ────────────────────────────────────────────────
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

      // ── Sparkle physics + draw ────────────────────────────────────────────────
      sparklesRef.current = sparkles.filter(s => s.life > 0);
      for (const s of sparklesRef.current) {
        s.vx       *= 0.90;
        s.vy       *= 0.90;
        s.x        += s.vx;
        s.y        += s.vy;
        s.rotation += s.angularVel;
        s.life     -= 1;

        // Fade out as life drains (t goes 1→0)
        const t     = s.life / s.maxLife;
        const alpha = t < 0.3 ? t / 0.3 : 1;

        ctx.save();
        ctx.globalAlpha = Math.min(1, alpha) * 0.88;
        ctx.fillStyle   = s.color;
        ctx.translate(s.x, s.y);
        ctx.rotate((s.rotation * Math.PI) / 180);
        drawStar(ctx, s.radius);
        ctx.restore();
      }

      // ── Confetti physics + draw ───────────────────────────────────────────────
      confettiRef.current = confetti.filter(c => c.life > 0);
      for (const c of confettiRef.current) {
        c.vy       += 0.55;  // gravity
        c.vx       *= 0.985; // air resistance
        c.vy       *= 0.985;
        c.x        += c.vx;
        c.y        += c.vy;
        c.rotation += c.angularVel;
        c.life     -= 1;

        const lifeRatio = c.life / c.maxLife;
        const alpha     = lifeRatio < 0.25 ? lifeRatio / 0.25 : 1;

        ctx.save();
        ctx.globalAlpha = c.alpha * alpha;
        ctx.fillStyle   = c.color;
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }

      // ── Draw emojis ───────────────────────────────────────────────────────────
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

  // Scroll tracking + phone spring impulse
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollYRef.current;
      lastScrollYRef.current = y;
      scrollYRef.current = y;
      phoneSpringRef.current.velocity += delta * 0.28;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Phone floating spring loop
  useEffect(() => {
    const STIFFNESS = 0.055;
    const DAMPING   = 0.80;
    let raf: number;
    const loop = () => {
      const s = phoneSpringRef.current;
      s.velocity += (0 - s.offset) * STIFFNESS;
      s.velocity *= DAMPING;
      s.offset   += s.velocity;
      if (phoneSpringWrapperRef.current) {
        phoneSpringWrapperRef.current.style.transform = `translateY(${s.offset}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
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
            style={{ width: CANVAS_W, height: CANVAS_H, zIndex: 3 }}
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

            {/* Phone — floating spring frame */}
            <div className="mt-[100px]">
              <div ref={phoneSpringWrapperRef}>
                <div ref={phoneRef} style={fadeIn(0.4)}>
                  <Image src="/product/phone.png" width={404} height={778} alt="Phone" priority />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
