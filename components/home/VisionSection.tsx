"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { GridSection, gl } from "./ContentGrid";

export const Vision = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  /* Detect when sticky bar is stuck: top sentinel scrolled past AND bottom sentinel still below */
  const sentinelTopRef = useRef<HTMLDivElement>(null);
  const sentinelBottomRef = useRef<HTMLDivElement>(null);
  const topPastRef = useRef(false);
  const bottomPastRef = useRef(false);

  useEffect(() => {
    const topEl = sentinelTopRef.current;
    const bottomEl = sentinelBottomRef.current;
    if (!topEl || !bottomEl) return;

    const fire = () => {
      const stuck = topPastRef.current && !bottomPastRef.current;
      window.dispatchEvent(new CustomEvent("vision-sticky", { detail: { stuck } }));
    };

    const topObs = new IntersectionObserver(
      ([entry]) => { topPastRef.current = !entry.isIntersecting; fire(); },
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" }
    );
    const bottomObs = new IntersectionObserver(
      ([entry]) => { bottomPastRef.current = !entry.isIntersecting; fire(); },
      { threshold: 0 }
    );

    topObs.observe(topEl);
    bottomObs.observe(bottomEl);
    return () => { topObs.disconnect(); bottomObs.disconnect(); };
  }, []);

  return (
    <div>
      <div ref={sentinelTopRef} className="h-0" />

    <GridSection style={{ borderTop: "none" }}>
      {/* Heading */}
      <div
        ref={ref}
        className="px-8 md:px-10 py-10 md:py-14"
        style={{ borderRight: gl, borderBottom: gl }}
      >
        <h2
          className="text-[#1D1D1F] leading-[1.15] tracking-[-0.02em]"
          style={{ fontSize: 48, fontWeight: 300, ...anim(0) }}
        >
          A new breed of AI,{" "}
          <span className="font-bold">COLUMBUS-01</span>
        </h2>
      </div>

      {/* Image grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px]"
        style={{
          gridAutoFlow: "dense",
          ...anim(100),
        }}
      >
        {/* Row 1 */}
        <Tile src="/image1.png" />
        <TextTile title="General Intelligence" subtitle="for the physical world" />
        <Tile src="/image2.png" />
        <Tile src="/image3.png" />
        <Tile src="/image4.png" />

        {/* Row 2 */}
        <Tile src="/image5.png" />
        <Tile src="/image6.png" />
        <Tile src="/image7.png" />
        <Tile src="/image8.png" />
        <Tile src="/image9.png" />
        <Tile src="/image10.png" />

        {/* Row 3 */}
        <Tile src="/image111.png" />
        <Tile src="/image112.png" />
        <TextTile title="Foundational Models" subtitle="for Earth" />
        <Tile src="/image113.png" />
        <Tile src="/image114.png" />

        {/* Row 4 */}
        <Tile src="/image12.png" />
        <Tile src="/image.png" />
        <Tile src="/image14.png" />
        <Tile src="/image15.png" />
        <Tile src="/image16.png" />
        <Tile src="/image17.png" />
      </div>

      {/* Description + placeholder logos */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto]" style={anim(200)}>
        <div
          className="flex flex-col justify-center px-8 md:px-10 py-8"
        >
          <p className="text-[15px] leading-[1.6] text-[#6E6E73] max-w-[600px]">
            ColumbusPro-1 processes satellite imagery, terrain data, human activity, and temporal patterns
            to generate actionable intelligence across real estate, research, and consumer domains.
          </p>
        </div>
        <div
          className="flex items-center justify-start gap-6 py-8"
          style={{ borderRight: gl }}
        >
          <div className="w-[44px] h-[44px] overflow-hidden rounded-sm">
            <SatelliteDiagram />
          </div>
          <div className="w-[44px] h-[44px] overflow-hidden rounded-sm">
            <TerrainDiagram />
          </div>
          <div className="w-[44px] h-[44px] overflow-hidden rounded-sm">
            <ActivityDiagram />
          </div>
        </div>
      </div>

      {/* Tagline + CTA */}
      <div
        className="flex flex-col items-center py-10 px-8 gap-8"
        style={{ borderRight: gl, borderBottom: gl, ...anim(280) }}
      >
        <p className="text-[15px] font-medium text-[#1D1D1F] tracking-tight">
          Think of us like the OpenAI for maps.
        </p>
        <Link
          href="/technology"
          className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-[#0A1344]/20 text-[#0A1344] text-[15px] font-medium hover:bg-[#0A1344] hover:text-white transition-colors"
        >
          Our research &amp; technology
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>
      </div>
    </GridSection>
    {/* Bottom sentinel — when this scrolls past, sticky is over */}
    <div ref={sentinelBottomRef} className="h-0" />
    </div>
  );
};

const Tile = ({ src }: { src: string }) => (
  <div
    className="relative w-full h-full overflow-hidden rounded-none"
    style={{ borderRight: gl, borderBottom: gl }}
  >
    <Image src={src} alt="" fill className="object-cover rounded-none" />
  </div>
);

const TextTile = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div
    className="col-span-1 sm:col-span-2 flex flex-col justify-center items-center text-center px-6"
    style={{ borderRight: gl, borderBottom: gl }}
  >
    <h3 className="text-xl md:text-2xl font-semibold text-[#1D1D1F] leading-tight tracking-tight">
      {title}
    </h3>
    <p className="text-base text-[#6E6E73] mt-1 tracking-tight">
      {subtitle}
    </p>
  </div>
);

/* ── Mini animated diagrams ── */

function useCanvasLoop(draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    draw(ctx, rect.width, rect.height, performance.now() * 0.001);
    rafRef.current = requestAnimationFrame(render);
  }, [draw]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [render]);

  return canvasRef;
}

/** Satellite — orbital scan lines sweeping across a grid */
const SatelliteDiagram = () => {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.fillStyle = "#F8F8FA";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(10, 19, 68, 0.06)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 12) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 12) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Scan line sweeping diagonally
    const scanY = ((t * 18) % (h + 30)) - 15;
    const grad = ctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
    grad.addColorStop(0, "rgba(10, 19, 68, 0)");
    grad.addColorStop(0.5, "rgba(10, 19, 68, 0.12)");
    grad.addColorStop(1, "rgba(10, 19, 68, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 8, w, 16);

    // Orbit arc
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w * 0.4, h * 0.3, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(10, 19, 68, 0.08)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Satellite dot on orbit
    const angle = t * 1.2;
    const sx = w / 2 + Math.cos(angle) * w * 0.4;
    const sy = h / 2 + Math.sin(angle) * h * 0.3;
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(10, 19, 68, 0.5)";
    ctx.fill();

    // Pulse ring around satellite
    const pulse = (Math.sin(t * 4) + 1) * 3 + 3;
    ctx.beginPath();
    ctx.arc(sx, sy, pulse, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(10, 19, 68, 0.15)";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Label
    ctx.font = "7px monospace";
    ctx.fillStyle = "rgba(10, 19, 68, 0.2)";
    ctx.fillText("SAT", 4, 10);
  }, []);

  const canvasRef = useCanvasLoop(draw);
  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

/** Terrain — topographic contour lines with gentle drift */
const TerrainDiagram = () => {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.fillStyle = "#F8F8FA";
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.45;
    const cy = h * 0.5;

    // Contour rings
    for (let ring = 1; ring <= 8; ring++) {
      const baseR = ring * 7;
      ctx.beginPath();
      const steps = 60;
      for (let s = 0; s <= steps; s++) {
        const a = (s / steps) * Math.PI * 2;
        const wobble = Math.sin(a * 3 + t * 1.5 + ring * 0.7) * 3 +
                       Math.sin(a * 5 - t) * 1.5;
        const r = baseR + wobble;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r * 0.7;
        if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      const alpha = 0.12 - ring * 0.012;
      ctx.strokeStyle = `rgba(10, 19, 68, ${Math.max(0.03, alpha)})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    // Elevation marker
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(10, 19, 68, 0.3)";
    ctx.fill();

    // Label
    ctx.font = "7px monospace";
    ctx.fillStyle = "rgba(10, 19, 68, 0.2)";
    ctx.fillText("TOPO", 4, 10);
  }, []);

  const canvasRef = useCanvasLoop(draw);
  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

/** Activity — pulsing data points representing human activity signals */
const ActivityDiagram = () => {
  const pointsRef = useRef<{ x: number; y: number; phase: number; speed: number }[]>([]);

  if (pointsRef.current.length === 0) {
    for (let i = 0; i < 18; i++) {
      const seed = i * 5.73;
      pointsRef.current.push({
        x: (Math.sin(seed) + 1) / 2,
        y: (Math.cos(seed * 1.4) + 1) / 2,
        phase: seed,
        speed: 1.5 + Math.random() * 2,
      });
    }
  }

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.fillStyle = "#F8F8FA";
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
    ctx.strokeStyle = "rgba(10, 19, 68, 0.04)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 16) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 16) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Data points
    for (const p of pointsRef.current) {
      const px = p.x * w;
      const py = p.y * h;
      const pulse = Math.sin(t * p.speed + p.phase) * 0.5 + 0.5;

      // Glow
      ctx.beginPath();
      ctx.arc(px, py, 3 + pulse * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 19, 68, ${0.03 + pulse * 0.04})`;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(px, py, 1 + pulse * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 19, 68, ${0.15 + pulse * 0.25})`;
      ctx.fill();
    }

    // Connection lines between nearby points
    ctx.strokeStyle = "rgba(10, 19, 68, 0.05)";
    ctx.lineWidth = 0.4;
    const pts = pointsRef.current;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = (pts[i].x - pts[j].x) * w;
        const dy = (pts[i].y - pts[j].y) * h;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x * w, pts[i].y * h);
          ctx.lineTo(pts[j].x * w, pts[j].y * h);
          ctx.stroke();
        }
      }
    }

    // Label
    ctx.font = "7px monospace";
    ctx.fillStyle = "rgba(10, 19, 68, 0.2)";
    ctx.fillText("ACT", 4, 10);
  }, []);

  const canvasRef = useCanvasLoop(draw);
  return <canvas ref={canvasRef} className="w-full h-full block" />;
};
