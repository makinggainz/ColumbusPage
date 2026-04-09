"use client";

import { useEffect, useRef, useCallback } from "react";

/* ── Wave height (underwater perspective) ── */
function waveHeight(wx: number, wz: number, t: number) {
  const drift = t * 25, driftZ = t * 8;
  const swx = wx + drift, swz = wz + driftZ;
  let h = Math.sin(swx * 0.003 + t * 0.4) * Math.cos(swz * 0.004 + t * 0.25) * 28;
  h += Math.sin(swx * 0.005 - t * 0.25 + 1.5) * Math.cos(swz * 0.006 + t * 0.15) * 16;
  h += Math.sin((swx + swz) * 0.002 + t * 0.3) * 12;
  h += Math.sin(swx * 0.01 + t * 0.6) * Math.cos(swz * 0.009 + t * 0.35) * 5;
  return h;
}

/* ── Creature types ── */
interface Fish { x: number; y: number; speed: number; size: number; phase: number; schoolY: number; }
interface Whale { x: number; y: number; speed: number; phase: number; }
interface Sub { x: number; y: number; speed: number; }

export default function UnderwaterScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  // Creatures — initialized once
  const fishRef = useRef<Fish[]>([]);
  const whaleRef = useRef<Whale>({ x: -300, y: 0, speed: 15, phase: 0 });
  const subRef = useRef<Sub>({ x: -400, y: 0, speed: 25 });
  const initedRef = useRef(false);

  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = cvs.clientWidth, H = cvs.clientHeight;

    if (cvs.width !== W * dpr || cvs.height !== H * dpr) {
      cvs.width = W * dpr; cvs.height = H * dpr;
      ctx.scale(dpr, dpr);
    }

    // Initialize creatures based on canvas size
    if (!initedRef.current) {
      fishRef.current = Array.from({ length: 10 }, (_, i) => ({
        x: Math.random() * W * 1.5 - W * 0.25,
        y: H * 0.3 + Math.random() * H * 0.5,
        speed: 20 + Math.random() * 30,
        size: 8 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        schoolY: H * 0.35 + (i % 3) * H * 0.15,
      }));
      whaleRef.current = { x: -350, y: H * 0.55, speed: 12, phase: 0 };
      subRef.current = { x: -500, y: H * 0.42, speed: 22 };
      initedRef.current = true;
    }

    ctx.clearRect(0, 0, W, H);
    // Underwater tinted background
    ctx.fillStyle = "#EDF2FA";
    ctx.fillRect(0, 0, W, H);

    const t = performance.now() * 0.001;
    const dt = 0.016;
    const rgb = "20,60,160";

    // ── Surface mesh at top (original IslandScene style) ──
    const surfFov = 550, surfHorizon = H * 0.25, surfCamH = 380;
    const surfProject = (wx: number, wy: number, wz: number): [number, number] | null => {
      if (wz <= 5) return null;
      return [(wx * surfFov) / wz + W / 2, ((wy - surfCamH) * surfFov) / wz + surfHorizon];
    };
    const SCOLS = 280, SROWS = 50, SCELL = 20;
    for (let r = 1; r < SROWS; r++) {
      const wz = r * SCELL + 50;
      const depthT = r / SROWS;
      ctx.strokeStyle = `rgba(${rgb},${(0.06 + depthT * 0.18).toFixed(3)})`;
      ctx.lineWidth = 0.6 + depthT * 1.0;
      ctx.beginPath();
      for (let c = 0; c <= SCOLS; c++) {
        const wx = (c - SCOLS / 2) * SCELL;
        const wy = waveHeight(wx, wz, t);
        const pt = surfProject(wx, wy, wz);
        if (!pt) continue;
        if (c === 0) ctx.moveTo(pt[0], pt[1]); else ctx.lineTo(pt[0], pt[1]);
      }
      ctx.stroke();
      if (r % 3 === 0) {
        ctx.strokeStyle = `rgba(${rgb},${(0.02 + depthT * 0.08).toFixed(3)})`;
        ctx.lineWidth = 0.5 + depthT * 0.5;
        for (let c = 0; c <= SCOLS; c += 2) {
          const wx = (c - SCOLS / 2) * SCELL;
          const p1 = surfProject(wx, waveHeight(wx, wz - SCELL, t), wz - SCELL);
          const p2 = surfProject(wx, waveHeight(wx, wz, t), wz);
          if (p1 && p2) { ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); }
        }
      }
    }

    // ── Light rays (subtle diagonal bands) ──
    ctx.save();
    for (let i = 0; i < 5; i++) {
      const rayX = (W * 0.15 * i + t * 15 + i * 100) % (W * 1.3) - W * 0.15;
      const rayW = 40 + i * 20;
      ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.sin(t * 0.3 + i) * 0.01})`;
      ctx.beginPath();
      ctx.moveTo(rayX, 0);
      ctx.lineTo(rayX + rayW, 0);
      ctx.lineTo(rayX + rayW * 0.3, H);
      ctx.lineTo(rayX - rayW * 0.4, H);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // ── Ocean mesh (immersive, extended) ──
    const fov = 550;
    const horizonY = H * 0.12;
    const camHeight = 380;

    const project3D = (wx: number, wy: number, wz: number): [number, number] | null => {
      if (wz <= 5) return null;
      return [(wx * fov) / wz + W / 2, ((wy - camHeight) * fov) / wz + horizonY];
    };

    const COLS = 220, ROWS = 60, CELL = 20;
    for (let r = 1; r < ROWS; r++) {
      const wz = r * CELL + 50;
      const depthT = r / ROWS;
      const alpha = (0.04 + depthT * 0.14).toFixed(3);
      const lw = 0.5 + depthT * 0.8;

      ctx.strokeStyle = `rgba(${rgb},${alpha})`;
      ctx.lineWidth = lw;
      ctx.beginPath();
      for (let c = 0; c <= COLS; c++) {
        const wx = (c - COLS / 2) * CELL;
        const wy = waveHeight(wx, wz, t);
        const pt = project3D(wx, wy, wz);
        if (!pt) continue;
        if (c === 0) ctx.moveTo(pt[0], pt[1]);
        else ctx.lineTo(pt[0], pt[1]);
      }
      ctx.stroke();

      if (r % 3 === 0) {
        const vAlpha = (0.015 + depthT * 0.06).toFixed(3);
        ctx.strokeStyle = `rgba(${rgb},${vAlpha})`;
        ctx.lineWidth = 0.4 + depthT * 0.4;
        for (let c = 0; c <= COLS; c += 2) {
          const wx = (c - COLS / 2) * CELL;
          const wy1 = waveHeight(wx, wz - CELL, t);
          const wy2 = waveHeight(wx, wz, t);
          const p1 = project3D(wx, wy1, wz - CELL);
          const p2 = project3D(wx, wy2, wz);
          if (p1 && p2) {
            ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
          }
        }
      }
    }

    // ── Draw fish ──
    const fish = fishRef.current;
    for (const f of fish) {
      f.x += f.speed * dt;
      if (f.x > W + 50) { f.x = -50; f.y = f.schoolY + (Math.random() - 0.5) * 60; }
      const swimY = f.y + Math.sin(t * 1.5 + f.phase) * 8;
      const tailWag = Math.sin(t * 6 + f.phase) * 0.3;
      const s = f.size;
      const alpha = 0.25 + Math.sin(f.phase) * 0.05;

      ctx.strokeStyle = `rgba(${rgb},${alpha.toFixed(2)})`;
      ctx.lineWidth = 0.8;
      // Body
      ctx.beginPath();
      ctx.ellipse(f.x, swimY, s, s * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Tail
      ctx.beginPath();
      ctx.moveTo(f.x - s, swimY);
      ctx.lineTo(f.x - s - s * 0.6, swimY - s * 0.4 + tailWag * s);
      ctx.lineTo(f.x - s - s * 0.6, swimY + s * 0.4 + tailWag * s);
      ctx.closePath();
      ctx.stroke();
      // Eye
      ctx.fillStyle = `rgba(${rgb},${(alpha * 0.8).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(f.x + s * 0.5, swimY - s * 0.1, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // Fin
      ctx.beginPath();
      ctx.moveTo(f.x, swimY);
      ctx.lineTo(f.x - s * 0.2, swimY + s * 0.5);
      ctx.lineTo(f.x + s * 0.3, swimY + s * 0.1);
      ctx.stroke();
    }

    // ── Draw whale ──
    const whale = whaleRef.current;
    whale.x += whale.speed * dt;
    whale.phase = t;
    if (whale.x > W + 200) whale.x = -250;
    const whaleY = whale.y + Math.sin(t * 0.4) * 20;
    const wa = 0.12;
    ctx.strokeStyle = `rgba(${rgb},${wa})`;
    ctx.lineWidth = 1.2;
    // Body
    ctx.beginPath();
    ctx.ellipse(whale.x, whaleY, 80, 25, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Head detail
    ctx.beginPath();
    ctx.arc(whale.x + 65, whaleY, 18, -0.5, 0.5);
    ctx.stroke();
    // Tail flukes
    const tailAng = Math.sin(t * 1.2) * 0.2;
    ctx.beginPath();
    ctx.moveTo(whale.x - 80, whaleY);
    ctx.lineTo(whale.x - 110, whaleY - 20 + tailAng * 30);
    ctx.moveTo(whale.x - 80, whaleY);
    ctx.lineTo(whale.x - 110, whaleY + 20 + tailAng * 30);
    ctx.stroke();
    // Flippers
    ctx.beginPath();
    ctx.moveTo(whale.x + 15, whaleY + 20);
    ctx.lineTo(whale.x + 5, whaleY + 40);
    ctx.lineTo(whale.x + 30, whaleY + 22);
    ctx.stroke();
    // Eye
    ctx.fillStyle = `rgba(${rgb},${wa})`;
    ctx.beginPath();
    ctx.arc(whale.x + 55, whaleY - 8, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Belly lines
    ctx.strokeStyle = `rgba(${rgb},${wa * 0.5})`;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 6; i++) {
      const lx = whale.x - 30 + i * 15;
      ctx.beginPath();
      ctx.moveTo(lx, whaleY + 15);
      ctx.lineTo(lx + 5, whaleY + 23);
      ctx.stroke();
    }

    // ── Draw submarine ──
    const sub = subRef.current;
    sub.x += sub.speed * dt;
    if (sub.x > W + 200) sub.x = -250;
    const subY = sub.y + Math.sin(t * 0.6) * 5;
    const sa = 0.18;
    ctx.strokeStyle = `rgba(${rgb},${sa})`;
    ctx.lineWidth = 1;
    // Hull
    ctx.beginPath();
    ctx.ellipse(sub.x, subY, 60, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Conning tower
    ctx.beginPath();
    ctx.rect(sub.x - 8, subY - 24, 16, 12);
    ctx.stroke();
    // Periscope
    ctx.beginPath();
    ctx.moveTo(sub.x + 3, subY - 24);
    ctx.lineTo(sub.x + 3, subY - 34);
    ctx.lineTo(sub.x + 8, subY - 34);
    ctx.stroke();
    // Portholes
    ctx.lineWidth = 0.7;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(sub.x - 30 + i * 15, subY, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Propeller
    const propSpin = t * 8;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 3; i++) {
      const ang = propSpin + (i / 3) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(sub.x - 60, subY);
      ctx.lineTo(sub.x - 60 + Math.cos(ang) * 10, subY + Math.sin(ang) * 10);
      ctx.stroke();
    }

    // ── Shipwreck (bottom of scene, near footer) ──
    const wreckY = H * 0.88;
    const wreckX = W * 0.55;
    const wka = 0.1;
    ctx.strokeStyle = `rgba(${rgb},${wka})`;
    ctx.lineWidth = 1.2;
    // Broken hull — tilted
    ctx.save();
    ctx.translate(wreckX, wreckY);
    ctx.rotate(-0.15);
    // Hull outline
    ctx.beginPath();
    ctx.moveTo(-70, 0); ctx.lineTo(-80, 15); ctx.lineTo(80, 15); ctx.lineTo(70, 0);
    ctx.lineTo(50, -5); ctx.lineTo(-50, -5); ctx.closePath();
    ctx.stroke();
    // Broken mast
    ctx.beginPath();
    ctx.moveTo(-10, -5); ctx.lineTo(-15, -55);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-15, -55); ctx.lineTo(-25, -45); // broken spar
    ctx.stroke();
    // Ribs
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.6})`;
    for (let i = 0; i < 7; i++) {
      const rx = -50 + i * 16;
      ctx.beginPath(); ctx.moveTo(rx, -3); ctx.lineTo(rx, 12); ctx.stroke();
    }
    // Torn sail fragment
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.4})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-15, -55); ctx.lineTo(-5, -40); ctx.lineTo(-20, -30); ctx.lineTo(-15, -55);
    ctx.stroke();
    // Scattered debris
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.5})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(90, 10); ctx.lineTo(105, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(95, 18); ctx.lineTo(110, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-90, 12); ctx.lineTo(-100, 18); ctx.stroke();
    // Anchor
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.7})`;
    ctx.beginPath();
    ctx.moveTo(-95, 5); ctx.lineTo(-95, 20);
    ctx.moveTo(-100, 16); ctx.quadraticCurveTo(-95, 22, -90, 16);
    ctx.stroke();
    ctx.restore();

    // Seaweed near wreck
    ctx.strokeStyle = `rgba(40,80,40,0.08)`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const sx = wreckX - 100 + i * 50 + Math.sin(i) * 20;
      const sway = Math.sin(t * 0.8 + i * 1.5) * 5;
      ctx.beginPath();
      ctx.moveTo(sx, wreckY + 15);
      ctx.quadraticCurveTo(sx + sway, wreckY - 10, sx + sway * 1.5, wreckY - 30 - i * 5);
      ctx.stroke();
    }

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
      aria-hidden
    />
  );
}
