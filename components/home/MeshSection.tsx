"use client";

import { useEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  phase: number;
};

export const MeshSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const mouse = { x: -9999, y: -9999 };
    let points: Point[] = [];
    let COLS = 30;
    let ROWS = 20;

    const REPEL_RADIUS = 160;
    const REPEL_STRENGTH = 22;
    const SPRING = 0.028;
    const DAMPING = 0.86;
    const WAVE_AMP = 10;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Adjust grid density to screen size
      COLS = Math.ceil(canvas.width / 55) + 1;
      ROWS = Math.ceil(canvas.height / 55) + 1;
      buildGrid();
    };

    const buildGrid = () => {
      points = [];
      const spacingX = canvas.width / (COLS - 1);
      const spacingY = canvas.height / (ROWS - 1);
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const baseX = col * spacingX;
          const baseY = row * spacingY;
          points.push({
            x: baseX,
            y: baseY,
            baseX,
            baseY,
            vx: 0,
            vy: 0,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    let t = 0;

    const draw = () => {
      t += 0.007;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacingX = canvas.width / (COLS - 1);
      const spacingY = canvas.height / (ROWS - 1);
      const maxEdge = Math.hypot(spacingX, spacingY) * 1.85;

      // Update physics
      for (const p of points) {
        const waveX = p.baseX + Math.sin(t + p.phase) * WAVE_AMP;
        const waveY = p.baseY + Math.cos(t * 0.65 + p.phase) * WAVE_AMP * 0.7;

        p.vx += (waveX - p.x) * SPRING;
        p.vy += (waveY - p.y) * SPRING;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) ** 1.6;
          p.vx += (dx / dist) * force * REPEL_STRENGTH;
          p.vy += (dy / dist) * force * REPEL_STRENGTH;
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw grid edges (right + down + diagonals)
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const idx = row * COLS + col;
          const p = points[idx];

          const neighbors: number[] = [];
          if (col < COLS - 1) neighbors.push(idx + 1);            // right
          if (row < ROWS - 1) neighbors.push(idx + COLS);         // down
          if (col < COLS - 1 && row < ROWS - 1) neighbors.push(idx + COLS + 1); // down-right
          if (col > 0 && row < ROWS - 1) neighbors.push(idx + COLS - 1);        // down-left

          for (const nIdx of neighbors) {
            const n = points[nIdx];
            const edgeLen = Math.hypot(p.x - n.x, p.y - n.y);
            const stretch = Math.min(edgeLen / maxEdge, 1);
            // Fade out as edge stretches — stretched lines disappear
            const alpha = (1 - stretch) * 0.28;
            if (alpha < 0.01) continue;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(n.x, n.y);
            ctx.strokeStyle = `rgba(28, 39, 108, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const p of points) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const glow = Math.max(0, 1 - dist / REPEL_RADIUS);

        const radius = 1.2 + glow * 2.8;
        const alpha = 0.18 + glow * 0.55;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(28, 39, 108, ${alpha})`;
        ctx.fill();
      }

      // Soft vignette — radial gradient to blend edges
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = Math.max(cx, cy) * 1.1;
      const vignette = ctx.createRadialGradient(cx, cy, r * 0.35, cx, cy, r);
      vignette.addColorStop(0, "rgba(249,249,249,0)");
      vignette.addColorStop(1, "rgba(249,249,249,0.82)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <section
      className="bg-[#F9F9F9] border-0 border-none shadow-none ring-0 ring-offset-0"
      style={{
        opacity: mounted ? 1 : 0,
        filter: mounted ? "blur(0px)" : "blur(8px)",
        transition: "opacity 800ms ease 100ms, filter 800ms ease 100ms",
      }}
    >
      <div className="relative w-full h-[920px] overflow-hidden border-0 border-none shadow-none ring-0 ring-offset-0">

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-none"
        />

        {/* Top fade — blends into Hero above */}
        <div
          className="absolute top-0 left-0 right-0 w-full h-30 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(249,249,249,1) 0%, rgba(249,249,249,0) 100%)`,
          }}
          aria-hidden
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 w-full h-[70px] pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(249,249,249,0) 0%, rgba(251,251,251,0.45) 25%, rgba(253,253,253,0.83) 46%, rgba(254,254,254,0.9) 52%, rgba(254,254,254,0.94) 62%, rgba(254,254,254,1) 100%)`,
          }}
          aria-hidden
        />
      </div>
    </section>
  );
};
