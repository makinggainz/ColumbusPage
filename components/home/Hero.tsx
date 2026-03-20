"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* Ripple in world-space (on the XZ ground plane) */
interface Ripple {
  wx: number;
  wz: number;
  t: number;
  strength: number;
}

/* ── 3D Perspective Wave Mesh ── */
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
    const smx = mouseRef.current.x;
    const smy = mouseRef.current.y;

    // ── 3D Projection Setup ──
    const fov = 700;
    const horizonY = H * 0.38;       // horizon line on screen
    const cameraHeight = 180;        // camera above ground plane
    const cellSize = 28;             // world-space grid spacing
    const gridCols = 100;
    const gridRows = 70;
    // Project world (wx, wy, wz) → screen (sx, sy)
    // wy = height (positive = up = lower on screen in our projection)
    const project = (wx: number, wy: number, wz: number): { sx: number; sy: number } | null => {
      if (wz <= 1) return null; // behind camera
      const sx = (wx * fov) / wz + W / 2;
      const sy = ((-wy + cameraHeight) * fov) / wz + horizonY;
      return { sx, sy };
    };

    // Unproject screen mouse → world XZ plane (wy=0)
    const unproject = (screenX: number, screenY: number): { wx: number; wz: number } | null => {
      const wz = (cameraHeight * fov) / (screenY - horizonY);
      if (wz <= 1 || wz > 5000) return null;
      const wx = ((screenX - W / 2) * wz) / fov;
      return { wx, wz };
    };

    // Spawn ripples from mouse in world-space
    const pmx = prevMouseRef.current.x;
    const pmy = prevMouseRef.current.y;
    const screenDist = Math.sqrt((smx - pmx) ** 2 + (smy - pmy) ** 2);
    if (smx > -999 && smy > horizonY && screenDist > 15) {
      const wp = unproject(smx, smy);
      if (wp) {
        ripplesRef.current.push({ wx: wp.wx, wz: wp.wz, t, strength: Math.min(screenDist * 0.3, 25) });
      }
      prevMouseRef.current = { x: smx, y: smy };
    }

    // Expire old ripples
    ripplesRef.current = ripplesRef.current.filter((r) => t - r.t < 4);

    // Mouse world position for proximity push
    let mouseWorld: { wx: number; wz: number } | null = null;
    if (smx > -999 && smy > horizonY) {
      mouseWorld = unproject(smx, smy);
    }

    // Ocean drift
    const drift = t * 40;
    const driftZ = t * 12;

    // ── Build 3D grid with wave height ──
    const grid: ({ sx: number; sy: number; wy: number } | null)[][] = [];

    for (let r = 0; r < gridRows; r++) {
      grid[r] = [];
      for (let c = 0; c < gridCols; c++) {
        const wx = (c - gridCols / 2) * cellSize;
        const wz = (r + 2) * cellSize; // depth starts near camera

        // Sample waves with drift
        const swx = wx + drift;
        const swz = wz + driftZ;

        // Layered ocean waves
        const wave1 = Math.sin(swx * 0.006 + t * 1.2) * Math.cos(swz * 0.008 + t * 0.7) * 14;
        const wave2 = Math.sin(swx * 0.01 - t * 0.8 + 1.5) * Math.cos(swz * 0.012 + t * 0.45) * 8;
        const wave3 = Math.sin((swx + swz) * 0.004 + t * 0.9) * 6;
        const wave4 = Math.sin(swx * 0.02 + t * 2.0) * Math.cos(swz * 0.018 + t * 1.1) * 3;

        let wy = wave1 + wave2 + wave3 + wave4;

        // Mouse proximity push (in world space)
        if (mouseWorld) {
          const dx = wx - mouseWorld.wx;
          const dz = wz - mouseWorld.wz;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const influence = Math.max(0, 1 - dist / 250);
          if (influence > 0) {
            wy += influence * influence * 35; // push up near mouse
          }
        }

        // Ripple contributions in world space
        for (const rip of ripplesRef.current) {
          const rdx = wx - rip.wx;
          const rdz = wz - rip.wz;
          const rdist = Math.sqrt(rdx * rdx + rdz * rdz);
          const age = t - rip.t;
          const speed = 200;
          const waveRadius = age * speed;
          const ringDist = Math.abs(rdist - waveRadius);
          const ringWidth = 140;
          if (ringDist < ringWidth) {
            const fade = Math.max(0, 1 - age / 4);
            const ringFade = 1 - ringDist / ringWidth;
            const amp = rip.strength * fade * ringFade * ringFade;
            wy += Math.sin((rdist - waveRadius) * 0.05) * amp;
          }
        }

        const p = project(wx, wy, wz);
        grid[r][c] = p ? { sx: p.sx, sy: p.sy, wy } : null;
      }
    }

    // ── Draw grid lines (back to front for correct overlap) ──

    // Depth lines (along Z — running into the distance)
    for (let c = 0; c < gridCols; c++) {
      ctx.beginPath();
      let started = false;
      for (let r = gridRows - 1; r >= 0; r--) {
        const p = grid[r][c];
        if (!p) continue;
        // Fade with distance
        const depthT = r / gridRows;
        const alpha = 0.04 + depthT * 0.14;
        ctx.strokeStyle = `rgba(55,40,140,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.4 + depthT * 0.5;
        if (!started) {
          ctx.moveTo(p.sx, p.sy);
          started = true;
        } else {
          ctx.lineTo(p.sx, p.sy);
        }
      }
      ctx.stroke();
    }

    // Cross lines (along X — left to right at each depth)
    for (let r = 0; r < gridRows; r++) {
      const depthT = r / gridRows;
      const alpha = 0.04 + depthT * 0.16;
      ctx.strokeStyle = `rgba(55,40,140,${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.4 + depthT * 0.6;

      ctx.beginPath();
      let started = false;
      for (let c = 0; c < gridCols; c++) {
        const p = grid[r][c];
        if (!p) continue;
        if (!started) {
          ctx.moveTo(p.sx, p.sy);
          started = true;
        } else {
          ctx.lineTo(p.sx, p.sy);
        }
      }
      ctx.stroke();
    }

    // Dots at close intersections only (front rows)
    for (let r = Math.floor(gridRows * 0.5); r < gridRows; r++) {
      const depthT = r / gridRows;
      const alpha = 0.06 + depthT * 0.2;
      ctx.fillStyle = `rgba(55,40,140,${alpha.toFixed(3)})`;
      for (let c = 0; c < gridCols; c++) {
        const p = grid[r][c];
        if (!p) continue;
        const radius = 0.6 + depthT * 1.0;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
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
      className="absolute left-0 right-0 w-full h-full"
      style={{ zIndex: 0, top: 350 }}
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
        paddingTop: 120,
        paddingBottom: 60,
      }}
    >
      {/* 3D perspective wave mesh */}
      <WaveMesh />

      {/* White fade at horizon line so mesh blends cleanly */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "30%",
          height: "15%",
          background: "linear-gradient(to bottom, #FFFFFF, transparent)",
          zIndex: 1,
        }}
        aria-hidden
      />

      {/* Content — sits above the mesh */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-[1024px] mx-auto" style={{ marginTop: -100 }}>

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

      </div>
    </section>
  );
};
