"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Simulated geospatial terrain canvas ── */
const TerrainSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const t = performance.now() * 0.0005;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    ctx.fillStyle = "#0A1028";
    ctx.fillRect(0, 0, w, h);

    // Topographic contour lines — slow drift influenced by mouse
    const centerX = w * (0.5 + (mx - 0.5) * 0.15);
    const centerY = h * (0.5 + (my - 0.5) * 0.15);

    for (let ring = 1; ring <= 18; ring++) {
      const baseR = ring * 35;
      ctx.beginPath();
      const steps = 120;
      for (let s = 0; s <= steps; s++) {
        const angle = (s / steps) * Math.PI * 2;
        const wobble = Math.sin(angle * 3 + t * 2 + ring * 0.5) * 8 +
                       Math.sin(angle * 5 - t * 1.5) * 4;
        const r = baseR + wobble;
        const px = centerX + Math.cos(angle) * r;
        const py = centerY + Math.sin(angle) * r;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      const alpha = Math.max(0.03, 0.12 - ring * 0.005);
      ctx.strokeStyle = `rgba(120, 140, 255, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Grid overlay — subtle coordinate system
    const gridSpacing = 60;
    ctx.strokeStyle = "rgba(100, 120, 220, 0.04)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Data points — scattered "readings" across the terrain
    const dataPoints = 40;
    for (let i = 0; i < dataPoints; i++) {
      const seed = i * 7.37;
      const dpx = ((Math.sin(seed) + 1) / 2) * w;
      const dpy = ((Math.cos(seed * 1.3) + 1) / 2) * h;
      const distToMouse = Math.hypot(dpx / w - mx, dpy / h - my);
      const brightness = Math.max(0.1, 0.5 - distToMouse);
      const pulse = Math.sin(t * 3 + i * 0.5) * 0.5 + 0.5;

      // Glow
      ctx.beginPath();
      ctx.arc(dpx, dpy, 4 + pulse * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(120, 160, 255, ${brightness * 0.08})`;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(dpx, dpy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 180, 255, ${brightness * 0.6})`;
      ctx.fill();
    }

    // Mouse focal point — scanning beam effect
    const scanX = mx * w;
    const scanY = my * h;
    const scanR = 80 + Math.sin(t * 4) * 10;

    const gradient = ctx.createRadialGradient(scanX, scanY, 0, scanX, scanY, scanR);
    gradient.addColorStop(0, "rgba(130, 160, 255, 0.08)");
    gradient.addColorStop(1, "rgba(130, 160, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Scan ring
    ctx.beginPath();
    ctx.arc(scanX, scanY, scanR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(130, 160, 255, 0.1)";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Crosshair at mouse
    ctx.strokeStyle = "rgba(130, 160, 255, 0.15)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(scanX - 12, scanY);
    ctx.lineTo(scanX + 12, scanY);
    ctx.moveTo(scanX, scanY - 12);
    ctx.lineTo(scanX, scanY + 12);
    ctx.stroke();

    // Coordinate readout near cursor
    const lat = (my * 180 - 90).toFixed(4);
    const lon = (mx * 360 - 180).toFixed(4);
    ctx.font = "10px monospace";
    ctx.fillStyle = "rgba(150, 180, 255, 0.3)";
    ctx.fillText(`${lat}°N  ${lon}°E`, scanX + 16, scanY - 8);

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full cursor-crosshair"
      style={{ display: "block" }}
    />
  );
};

export const InteractiveDemo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#080C1A] py-[80px] md:py-[100px]" data-navbar-theme="dark">
      <div ref={ref} className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="text-[13px] tracking-[0.15em] uppercase font-medium text-white/25 mb-4"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            See the System
          </p>
          <h2
            className="text-[32px] md:text-[44px] font-semibold tracking-[-0.02em] leading-[1.1] text-white"
            style={{
              opacity: visible ? 1 : 0,
              filter: visible ? "blur(0px)" : "blur(6px)",
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease 0.15s, filter 0.8s ease 0.15s, transform 0.8s ease 0.15s",
            }}
          >
            The world, in motion.
          </h2>
          <p
            className="text-[16px] text-white/40 mt-4 max-w-md mx-auto"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.8s ease 0.3s",
            }}
          >
            Move your cursor to scan the terrain. Every point is a data signal the model interprets.
          </p>
        </div>

        {/* Simulation canvas */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            height: "clamp(360px, 50vh, 560px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
            transition: "opacity 1s ease 0.4s, transform 1s ease 0.4s",
          }}
        >
          <TerrainSimulation />

          {/* Corner coordinate labels */}
          <div className="absolute top-4 left-5 text-[10px] font-mono text-white/20 pointer-events-none">
            TERRAIN SCAN — LIVE
          </div>
          <div className="absolute top-4 right-5 text-[10px] font-mono text-white/20 pointer-events-none">
            GeoContext-1
          </div>
          <div className="absolute bottom-4 left-5 text-[10px] font-mono text-white/15 pointer-events-none">
            Resolution: 0.5m/px
          </div>
          <div className="absolute bottom-4 right-5 text-[10px] font-mono text-white/15 pointer-events-none">
            Confidence: 97.3%
          </div>
        </div>
      </div>
    </section>
  );
};
