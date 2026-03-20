"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

/* ── Wave Mesh Canvas ── */
/* Ripple dropped by mouse movement */
interface Ripple {
  x: number;
  y: number;
  t: number;        // time of creation (seconds)
  strength: number;  // amplitude
}

const WaveMesh = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const prevMouseRef = useRef({ x: -9999, y: -9999 });
  const ripplesRef = useRef<Ripple[]>([]);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = cvs.clientWidth;
    const H = cvs.clientHeight;

    if (cvs.width !== W * dpr || cvs.height !== H * dpr) {
      cvs.width = W * dpr;
      cvs.height = H * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, W, H);

    const t = performance.now() * 0.001;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Spawn ripples as the mouse moves
    const pmx = prevMouseRef.current.x;
    const pmy = prevMouseRef.current.y;
    const mouseDist = Math.sqrt((mx - pmx) ** 2 + (my - pmy) ** 2);
    if (mx > -999 && mouseDist > 20) {
      ripplesRef.current.push({ x: mx, y: my, t, strength: Math.min(mouseDist * 0.15, 18) });
      prevMouseRef.current = { x: mx, y: my };
    }

    // Expire old ripples (live ~3 seconds)
    ripplesRef.current = ripplesRef.current.filter((r) => t - r.t < 3);

    const spacing = 48;
    const cols = Math.ceil(W / spacing) + 2;
    const rows = Math.ceil(H / spacing) + 2;
    const offsetX = (W - (cols - 1) * spacing) / 2;
    const offsetY = (H - (rows - 1) * spacing) / 2;

    // Build displaced grid
    const points: { x: number; y: number }[][] = [];
    for (let r = 0; r < rows; r++) {
      points[r] = [];
      for (let c = 0; c < cols; c++) {
        const bx = offsetX + c * spacing;
        const by = offsetY + r * spacing;

        // Layered wave displacement (ocean-like)
        const wave1 = Math.sin(bx * 0.008 + t * 0.6) * Math.cos(by * 0.006 + t * 0.4) * 6;
        const wave2 = Math.sin(bx * 0.012 - t * 0.35 + 1.2) * Math.cos(by * 0.01 + t * 0.25) * 4;
        const wave3 = Math.sin((bx + by) * 0.005 + t * 0.5) * 3;

        let dx = wave1 * 0.5 + wave2 * 0.3;
        let dy = wave1 + wave2 + wave3;

        // Mouse proximity — gentle push
        const distX = bx - mx;
        const distY = by - my;
        const dist = Math.sqrt(distX * distX + distY * distY);
        const influence = Math.max(0, 1 - dist / 200);
        if (influence > 0) {
          const angle = Math.atan2(distY, distX);
          const push = influence * influence * 18;
          dx += Math.cos(angle) * push;
          dy += Math.sin(angle) * push;
        }

        // Ripple contributions — expanding rings that displace points
        for (const rip of ripplesRef.current) {
          const rdx = bx - rip.x;
          const rdy = by - rip.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const age = t - rip.t;
          const speed = 280;
          const waveRadius = age * speed;
          const ringDist = Math.abs(rdist - waveRadius);
          const ringWidth = 120;

          if (ringDist < ringWidth) {
            const fade = Math.max(0, 1 - age / 3);
            const ringFade = 1 - ringDist / ringWidth;
            const amp = rip.strength * fade * ringFade * ringFade;
            const ripplePhase = Math.sin((rdist - waveRadius) * 0.04);
            const angle = Math.atan2(rdy, rdx);
            dx += Math.cos(angle) * ripplePhase * amp;
            dy += Math.sin(angle) * ripplePhase * amp;
          }
        }

        points[r][c] = { x: bx + dx, y: by + dy };
      }
    }

    // Draw lines
    ctx.strokeStyle = "rgba(55,40,140,0.18)";
    ctx.lineWidth = 0.8;

    // Horizontal
    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const p = points[r][c];
        if (c === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Vertical
    for (let c = 0; c < cols; c++) {
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const p = points[r][c];
        if (r === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Dots at intersections
    ctx.fillStyle = "rgba(55,40,140,0.22)";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = points[r][c];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    const onMove = (e: MouseEvent) => {
      const rect = cvs.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    cvs.addEventListener("mousemove", onMove);
    cvs.addEventListener("mouseleave", onLeave);
    return () => {
      cvs.removeEventListener("mousemove", onMove);
      cvs.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
};

/* ── Hero Section ── */
export const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    filter: mounted ? "blur(0px)" : "blur(8px)",
    transform: mounted ? "translateY(0px)" : "translateY(18px)",
    transition: `opacity 1000ms ease ${delay}ms, filter 1000ms ease ${delay}ms, transform 1000ms ease ${delay}ms`,
  });

  return (
    <section
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "#FFFFFF",
        minHeight: "100vh",
        paddingTop: 140,
        paddingBottom: 100,
      }}
    >
      {/* Wave mesh background */}
      <WaveMesh />

      {/* Soft radial glow behind text */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1100,
          height: 900,
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 35%, rgba(79,70,229,0.03) 55%, transparent 75%)",
          zIndex: 1,
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-[1024px] mx-auto">

        {/* Eyebrow */}
        <p
          style={{
            color: "#6E6E73",
            fontSize: 17,
            fontWeight: 600,
            marginBottom: 16,
            ...fadeIn(0),
          }}
        >
          The frontier AI lab
        </p>

        {/* Main Heading */}
        <h1
          className="text-center"
          style={{
            color: "#1D1D1F",
            fontWeight: 600,
            letterSpacing: "-0.003em",
            lineHeight: 1.05,
            ...fadeIn(80),
          }}
        >
          <span
            className="block text-[40px] md:text-[80px]"
            style={{ fontWeight: 600, letterSpacing: "-0.003em", lineHeight: 1.05 }}
          >
            The first in&#8209;production
          </span>
          <span
            className="block text-[40px] md:text-[80px]"
            style={{ fontWeight: 600, letterSpacing: "-0.003em", lineHeight: 1.05 }}
          >
            Large Geospatial Model.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[21px] md:text-[28px] text-center"
          style={{
            color: "#6E6E73",
            fontWeight: 400,
            lineHeight: 1.38,
            marginTop: 16,
            ...fadeIn(200),
          }}
        >
          Intelligence for the physical world.
        </p>

        {/* CTA Links */}
        <div
          className="flex items-center gap-8 mt-8"
          style={fadeIn(340)}
        >
          <Link
            href="/technology"
            className="hover:underline transition-all duration-200"
            style={{
              color: "#4F46E5",
              fontSize: 20,
            }}
          >
            Learn more &#x203A;
          </Link>
          <Link
            href="/platform"
            className="hover:underline transition-all duration-200"
            style={{
              color: "#4F46E5",
              fontSize: 20,
            }}
          >
            Start now &#x203A;
          </Link>
        </div>

      </div>
    </section>
  );
};
