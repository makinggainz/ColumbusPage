"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
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

const FRICTION     = 0.985;
const ANG_FRICTION = 0.96;
const RESTITUTION  = 0.72;
const MOUSE_RADIUS = 200;
const MOUSE_FORCE  = 8;

const SPARKLE_COLORS = ["#59E1EB", "#FFD166", "#FF9A8B", "#A8E6CF", "#FFFFFF", "#C3B1E1"];
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
  life: number;
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
  life: number;
  maxLife: number;
};

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
  const canvasRef             = useRef<HTMLCanvasElement>(null);
  const boxesRef              = useRef<Box[]>([]);
  const sparklesRef           = useRef<Sparkle[]>([]);
  const confettiRef           = useRef<Confetti[]>([]);
  const imagesRef             = useRef<HTMLImageElement[]>([]);
  const mouseRef              = useRef({ x: -9999, y: -9999, active: false });
  const scrollYRef            = useRef(0);
  const firedRef              = useRef(false);
  const rafRef                = useRef<number>(0);

  // Transition refs
  const outerContainerRef       = useRef<HTMLDivElement>(null);
  const sectionRef              = useRef<HTMLElement>(null);
  const bgRef                   = useRef<HTMLDivElement>(null);
  const toggleRef               = useRef<HTMLDivElement>(null);
  const badgeTitleRef           = useRef<HTMLDivElement>(null);
  const transitionPhoneRef      = useRef<HTMLDivElement>(null);
  const windContainerRef        = useRef<HTMLDivElement>(null);
  const phoneStartCapturedRef   = useRef(false);
  const phoneStartXRef          = useRef(0);
  const phoneStartYRef          = useRef(0);
  const phoneDisplayWRef        = useRef(0);
  const phoneDisplayHRef        = useRef(0);
  const windFiredRef            = useRef(false);

  // Pre-load images
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

  // Fire confetti + icons from phone center (triggered on phone click)
  const fireConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    const phone  = phoneRef.current;
    if (!canvas || !phone) return;

    const cr    = canvas.getBoundingClientRect();
    const pr    = phone.getBoundingClientRect();
    const scale = Math.min(1, window.innerWidth / CANVAS_W);

    const ox = (pr.left - cr.left) / scale + pr.width  / scale / 2;
    const oy = (pr.top  - cr.top)  / scale + pr.height / scale / 2;

    boxesRef.current = ICONS.map(({ size }, i) => {
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

    const pieces: Confetti[] = [];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 40;
      const life  = 70 + Math.random() * 50;
      pieces.push({
        x: ox + (Math.random() - 0.5) * 40,
        y: oy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 12,
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

      const cr    = canvas.getBoundingClientRect();
      const scale = Math.min(1, window.innerWidth / CANVAS_W);
      const floorY = (window.innerHeight - cr.top) / scale;

      const suckT = Math.max(0, Math.min((scrollYRef.current - 80) / 320, 1));
      const mouse = mouseRef.current;

      for (const b of boxes) {
        if (!b.alive) continue;

        b.vx         *= FRICTION;
        b.vy         *= FRICTION;
        b.angularVel *= ANG_FRICTION;

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

        if (suckT > 0) {
          const dx   = targetX - b.x;
          const dy   = targetY - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < b.size * 1.8) {
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

        const r = b.size / 2;
        if (b.x - r < 0)        { b.x = r;            b.vx =  Math.abs(b.vx) * RESTITUTION; }
        if (b.x + r > CANVAS_W) { b.x = CANVAS_W - r; b.vx = -Math.abs(b.vx) * RESTITUTION; }
        if (b.y - r < 0)        { b.y = r;             b.vy =  Math.abs(b.vy) * RESTITUTION; }
        if (b.y + r > floorY)   { b.y = floorY - r;   b.vy = -Math.abs(b.vy) * RESTITUTION; }
      }

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

      sparklesRef.current = sparkles.filter(s => s.life > 0);
      for (const s of sparklesRef.current) {
        s.vx       *= 0.90;
        s.vy       *= 0.90;
        s.x        += s.vx;
        s.y        += s.vy;
        s.rotation += s.angularVel;
        s.life     -= 1;

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

      confettiRef.current = confetti.filter(c => c.life > 0);
      for (const c of confettiRef.current) {
        c.vy       += 0.55;
        c.vx       *= 0.985;
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

  // Mouse tracking
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


  // Merged scroll handler: physics impulse + transition animation
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const fireWind = (cx: number, cy: number) => {
      const container = windContainerRef.current;
      if (!container) return;
      const emojis = ["💨", "💨", "💨", "💨", "✨", "💫", "🌀", "💨"];
      const count = 12;
      for (let i = 0; i < count; i++) {
        const el = document.createElement("span");
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const dist  = 120 + Math.random() * 180;
        const dur   = 500 + Math.random() * 350;
        const size  = 22 + Math.floor(Math.random() * 22);

        el.style.cssText = `
          position: fixed;
          left: ${cx}px;
          top: ${cy}px;
          font-size: ${size}px;
          line-height: 1;
          pointer-events: none;
          transform: translate(-50%, -50%);
          opacity: 1;
          z-index: 9999;
          transition: none;
        `;
        container.appendChild(el);

        requestAnimationFrame(() => {
          el.style.transition = `left ${dur}ms ease-out, top ${dur}ms ease-out, opacity ${dur * 0.5}ms ease-in ${dur * 0.5}ms`;
          el.style.left    = `${cx + Math.cos(angle) * dist}px`;
          el.style.top     = `${cy + Math.sin(angle) * dist}px`;
          el.style.opacity = "0";
          setTimeout(() => el.remove(), dur + 100);
        });
      }
    };

    const onScroll = () => {
      const y     = window.scrollY;
      const delta = y - lastScrollYRef.current;
      lastScrollYRef.current  = y;
      scrollYRef.current      = y;
      phoneSpringRef.current.velocity += delta * 0.28;

      // Transition progress
      const el = outerContainerRef.current;
      if (!el) return;
      const rect    = el.getBoundingClientRect();
      const extraPx = window.innerHeight * 2;
      const raw     = Math.max(0, Math.min(1, -rect.top / extraPx));

      const origPhone = phoneRef.current;

      // Background expansion — clip-path + scale (both GPU-composited)
      const bg = bgRef.current;
      const nearZero = raw < 0.005;
      if (bg) {
        if (nearZero) {
          bg.style.clipPath  = "inset(80px 4% 80px 4% round 55px)";
          bg.style.transform = "scale(1)";
        } else {
          const expandT = Math.min(1, raw / 0.3);
          const easeOut = 1 - Math.pow(1 - expandT, 3);
          // Clip-path: contained → flush with element edges
          const top    = 80 * (1 - easeOut);
          const side   = 4  * (1 - easeOut);
          const bottom = 80 * (1 - easeOut);
          const radius = 55 * (1 - easeOut);
          // Scale: 1 → 1.12 to zoom past the PNG's white borders
          const scale  = 1 + 0.12 * easeOut;
          bg.style.clipPath  = `inset(${top}px ${side}% ${bottom}px ${side}% round ${radius}px)`;
          bg.style.transform = `scale(${scale})`;
        }
      }

      // Reset when user scrolls back to top
      if (nearZero) {
        phoneStartCapturedRef.current = false;
        windFiredRef.current          = false;
        if (phoneSpringWrapperRef.current) phoneSpringWrapperRef.current.style.opacity = "1";
        const tp = transitionPhoneRef.current;
        if (tp) tp.style.display = "none";
        if (toggleRef.current)    toggleRef.current.style.opacity    = "1";
        if (badgeTitleRef.current) badgeTitleRef.current.style.opacity = "1";
        return;
      }

      // Capture phone starting position (once, first frame of transition)
      if (!phoneStartCapturedRef.current && origPhone) {
        const pr = origPhone.getBoundingClientRect();
        phoneStartXRef.current    = pr.left;
        phoneStartYRef.current    = pr.top;
        phoneDisplayWRef.current  = pr.width;
        phoneDisplayHRef.current  = pr.height;
        phoneStartCapturedRef.current = true;
      }

      // Fade out toggle + title
      const contentFade = Math.max(0, 1 - raw * 3.5);
      if (toggleRef.current)     toggleRef.current.style.opacity     = String(contentFade);
      if (badgeTitleRef.current) badgeTitleRef.current.style.opacity  = String(contentFade);

      // Hide original phone spring wrapper
      if (phoneSpringWrapperRef.current) phoneSpringWrapperRef.current.style.opacity = "0";

      // Move + fade transition phone
      const tp = transitionPhoneRef.current;
      if (tp && phoneStartCapturedRef.current) {
        tp.style.display = "block";
        tp.style.width   = `${phoneDisplayWRef.current}px`;
        tp.style.height  = `${phoneDisplayHRef.current}px`;

        const startX  = phoneStartXRef.current;
        const startY  = phoneStartYRef.current;
        const endX    = window.innerWidth  / 2 - phoneDisplayWRef.current / 2;
        const endY    = window.innerHeight / 2 - phoneDisplayHRef.current / 2;

        // Phone moves to center over first 70% of progress
        const moveP = Math.min(1, raw / 0.7);
        const eased = 1 - Math.pow(1 - moveP, 3); // ease-out cubic

        const currentX = startX + (endX - startX) * eased;
        const currentY = startY + (endY - startY) * eased;

        // Phone pops (scale up) and fades out between 65%–80%
        const popT         = Math.max(0, (raw - 0.65) / 0.15);
        const phoneOpacity = raw >= 0.65 ? Math.max(0, 1 - popT) : 1;
        const phoneScale   = 1 + popT * 0.18;

        tp.style.left      = `${currentX}px`;
        tp.style.top       = `${currentY}px`;
        tp.style.opacity   = String(phoneOpacity);
        tp.style.transform = `scale(${phoneScale})`;
        tp.style.transformOrigin = "center center";
      }

      // Wind explosion fires once at 65%
      if (raw >= 0.65 && !windFiredRef.current) {
        windFiredRef.current = true;
        fireWind(
          window.innerWidth  / 2,
          window.innerHeight / 2,
        );
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={outerContainerRef}
      style={{ height: "calc(100vh + 200vh)", marginTop: -32 }}
    >
      <section
        ref={sectionRef}
        className="sticky top-0 overflow-hidden flex justify-center"
        style={{
          height: "100vh",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        {/* Background div — expands on scroll to push white borders outside overflow */}
        <div
          ref={bgRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/BeachLanding.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: "inset(80px 4% 80px 4% round 55px)",
            transform: "scale(1)",
            willChange: "clip-path, transform",
            zIndex: 0,
          }}
        />

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

            {/* Physics canvas — pointer-events-none so UI stays clickable */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{ width: CANVAS_W, height: CANVAS_H, zIndex: 3 }}
            />

            {/* All hero content in one flex column */}
            <div
              className="absolute top-[100px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[200px]"
              style={{ zIndex: 2 }}
            >
              {/* Toggle — fades out on transition */}
              <div ref={toggleRef} style={fadeIn(0)}>
                <ConsumerEnterpriseToggle variant="light" active="consumer" />
              </div>

              {/* Badge + Title — fades out on transition */}
              <div ref={badgeTitleRef} className="flex flex-col items-center gap-[21px]">
                <div className={glassStyles.btn} style={{ width: 266, height: 43, padding: 0, ...fadeIn(0.1) }}>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>Only Available on Earth</span>
                </div>
                <div className="text-center">
                  <h1
                    className="flex items-center justify-center"
                    style={{
                      fontFamily: '"SF Compact", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: 48,
                      fontWeight: 600,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(180,156,83,0.75) 40%, rgba(140,120,60,0.6) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                      ...fadeIn(0.2),
                    }}
                  >
                    MapsGPT
                  </h1>
                  <h2
                    className="text-[64px] font-bold leading-[140%] flex items-center justify-center"
                    style={{
                      backgroundImage: "linear-gradient(to bottom, #00B1D4 40%, #F9C795 95%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: contentVisible ? "drop-shadow(0 0 100px rgba(255,255,255,1)) blur(0px)" : "blur(8px)",
                      transition: `opacity 0.6s ease-out 0.3s, filter 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s`,
                      opacity:   contentVisible ? 1 : 0,
                      transform: contentVisible ? "translateY(0)" : "translateY(16px)",
                    }}
                  >
                    Travel Like a Boss
                  </h2>
                </div>
              </div>



              {/* Phone — spring wrapper opacity controlled by transition */}
              <div className="mt-[100px]">
                <div ref={phoneSpringWrapperRef}>
                  <div ref={phoneRef} style={fadeIn(0.4)}>
                    <div
                      className="phone-clickable"
                      style={{ position: "relative", display: "inline-block", cursor: "pointer" }}
                      onClick={fireConfetti}
                    >
                      {/* Glass border — extends 12px beyond phone on all sides */}
                      <div style={{
                        position: "absolute",
                        inset: -12,
                        borderRadius: 67,
                        background: "rgba(150, 225, 255, 0.20)",
                        boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
                        zIndex: -1,
                      }} />
                      <Image src="/MapsGPTMobile.png" width={404} height={778} alt="Phone" priority style={{ borderRadius: 55, display: "block" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Fixed transition phone — shown during scroll animation */}
      <div
        ref={transitionPhoneRef}
        style={{
          position: "fixed",
          display: "none",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        {/* Glass border */}
        <div style={{
          position: "absolute",
          inset: -12,
          borderRadius: 67,
          background: "rgba(150, 225, 255, 0.20)",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
        }} />
        <Image
          src="/MapsGPTMobile.png"
          fill
          alt=""
          style={{ objectFit: "contain", borderRadius: 55 }}
        />
      </div>

      {/* Wind emoji particle container */}
      <div
        ref={windContainerRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
          overflow: "hidden",
        }}
      />
    </div>
  );
}
