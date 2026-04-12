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

    // ── Seabed (sandy floor across bottom) ──
    const seabedY = H * 0.92;
    // Undulating sand floor
    ctx.strokeStyle = `rgba(${rgb},0.06)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 4) {
      const sy = seabedY + Math.sin(x * 0.008 + t * 0.2) * 6 + Math.sin(x * 0.02) * 3;
      if (x === 0) ctx.moveTo(x, sy); else ctx.lineTo(x, sy);
    }
    ctx.stroke();
    // Sand ripple lines
    ctx.strokeStyle = `rgba(${rgb},0.035)`;
    ctx.lineWidth = 0.6;
    for (let row = 0; row < 4; row++) {
      const ry = seabedY + 8 + row * 8;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const sy = ry + Math.sin(x * 0.012 + row * 1.5 + t * 0.15) * 3;
        if (x === 0) ctx.moveTo(x, sy); else ctx.lineTo(x, sy);
      }
      ctx.stroke();
    }
    // Scattered rocks
    ctx.strokeStyle = `rgba(${rgb},0.07)`;
    ctx.lineWidth = 0.8;
    const rocks = [[W*0.1, 4], [W*0.25, 6], [W*0.4, 3], [W*0.6, 5], [W*0.78, 7], [W*0.9, 4]];
    for (const [rx, rs] of rocks) {
      const ry = seabedY + Math.sin(rx * 0.008) * 6 + 2;
      ctx.beginPath();
      ctx.ellipse(rx, ry, rs * 2, rs, Math.sin(rx) * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Small shells
    ctx.strokeStyle = `rgba(${rgb},0.05)`;
    ctx.lineWidth = 0.5;
    const shells = [W*0.15, W*0.35, W*0.52, W*0.72, W*0.88];
    for (const sx of shells) {
      const sy = seabedY + Math.sin(sx * 0.008) * 6 + 4;
      ctx.beginPath(); ctx.arc(sx, sy, 3, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx - 2, sy); ctx.lineTo(sx, sy - 2); ctx.lineTo(sx + 2, sy); ctx.stroke();
    }

    // Seaweed patches across the seabed
    const seaweedPositions = [W*0.05, W*0.12, W*0.22, W*0.33, W*0.45, W*0.58, W*0.65, W*0.75, W*0.85, W*0.93];
    for (let i = 0; i < seaweedPositions.length; i++) {
      const sx = seaweedPositions[i];
      const baseY = seabedY + Math.sin(sx * 0.008) * 6;
      const strands = 2 + (i % 3);
      for (let s = 0; s < strands; s++) {
        const sway = Math.sin(t * 0.6 + i * 1.3 + s * 0.8) * 6;
        const sway2 = Math.sin(t * 0.9 + i * 0.7 + s * 1.2) * 3;
        const height = 20 + (i % 4) * 8 + s * 5;
        ctx.strokeStyle = `rgba(40,80,40,${(0.06 + (i % 3) * 0.02).toFixed(3)})`;
        ctx.lineWidth = 0.8 + s * 0.2;
        ctx.beginPath();
        ctx.moveTo(sx + s * 4, baseY);
        ctx.quadraticCurveTo(sx + s * 4 + sway, baseY - height * 0.5, sx + s * 4 + sway + sway2, baseY - height);
        ctx.stroke();
      }
    }

    // ── Shipwreck (detailed, on the seabed) ──
    const wreckY = seabedY - 2;
    const wreckX = W * 0.55;
    const wka = 0.12;
    ctx.save();
    ctx.translate(wreckX, wreckY);
    ctx.rotate(-0.12);

    // Hull outline — larger, more detailed
    ctx.strokeStyle = `rgba(${rgb},${wka})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-90, 0); ctx.lineTo(-100, 18); ctx.lineTo(100, 18); ctx.lineTo(90, 0);
    ctx.lineTo(70, -8); ctx.lineTo(-60, -8); ctx.closePath();
    ctx.stroke();
    // Keel line
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.7})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(-90, 18); ctx.lineTo(-95, 25); ctx.lineTo(95, 25); ctx.lineTo(100, 18); ctx.stroke();

    // Hull ribs (more of them, curved)
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.5})`;
    for (let i = 0; i < 10; i++) {
      const rx = -70 + i * 16;
      ctx.beginPath();
      ctx.moveTo(rx, -6);
      ctx.quadraticCurveTo(rx - 1, 6, rx - 2, 16);
      ctx.stroke();
    }
    // Hull planking lines
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.3})`;
    ctx.lineWidth = 0.4;
    for (let py = 2; py < 16; py += 4) {
      ctx.beginPath();
      ctx.moveTo(-85, py); ctx.lineTo(85, py);
      ctx.stroke();
    }

    // Deck planks
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.4})`;
    ctx.lineWidth = 0.5;
    for (let px = -55; px < 65; px += 12) {
      ctx.beginPath(); ctx.moveTo(px, -7); ctx.lineTo(px, -4); ctx.stroke();
    }

    // Broken main mast
    ctx.strokeStyle = `rgba(${rgb},${wka})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-10, -8); ctx.lineTo(-18, -65); ctx.stroke();
    // Broken yard
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-18, -65); ctx.lineTo(-35, -55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-18, -65); ctx.lineTo(-8, -58); ctx.stroke();
    // Crow's nest remains
    ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(-22, -60); ctx.lineTo(-14, -60); ctx.stroke();

    // Second broken mast (foremast, snapped shorter)
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(30, -8); ctx.lineTo(25, -35); ctx.stroke();
    // Broken spar
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(25, -35); ctx.lineTo(15, -28); ctx.stroke();

    // Torn sail fragment on main mast
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.35})`;
    ctx.fillStyle = `rgba(${rgb},${wka * 0.05})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-18, -65); ctx.lineTo(-5, -50); ctx.lineTo(-22, -38); ctx.lineTo(-18, -65);
    ctx.fill(); ctx.stroke();
    // Second sail remnant hanging
    ctx.beginPath();
    ctx.moveTo(-14, -50); ctx.quadraticCurveTo(-8, -42, -15, -35);
    ctx.stroke();

    // Bowsprit (broken, angled)
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.8})`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(70, -6); ctx.lineTo(110, -15); ctx.stroke();

    // Stern castle remains
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.7})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-60, -8); ctx.lineTo(-65, -20); ctx.lineTo(-50, -20); ctx.lineTo(-45, -8);
    ctx.stroke();
    // Stern window
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(-57, -14, 3, 0, Math.PI * 2); ctx.stroke();

    // Rigging remnants (hanging ropes)
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.25})`;
    ctx.lineWidth = 0.4;
    ctx.beginPath(); ctx.moveTo(-18, -60); ctx.quadraticCurveTo(-30, -40, -35, -15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-15, -50); ctx.quadraticCurveTo(-5, -30, 10, -10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(25, -35); ctx.quadraticCurveTo(35, -20, 40, -5); ctx.stroke();

    // Anchor (more detailed)
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.8})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-110, 8); ctx.lineTo(-110, 28); // shank
    ctx.stroke();
    ctx.beginPath(); // flukes
    ctx.moveTo(-118, 24); ctx.quadraticCurveTo(-110, 32, -102, 24);
    ctx.stroke();
    ctx.beginPath(); // stock (crossbar)
    ctx.moveTo(-116, 10); ctx.lineTo(-104, 10);
    ctx.stroke();
    ctx.beginPath(); // ring
    ctx.arc(-110, 6, 3, 0, Math.PI * 2);
    ctx.stroke();
    // Chain from anchor to hull
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.3})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-110, 6); ctx.quadraticCurveTo(-100, 0, -85, 2);
    ctx.stroke();

    // Scattered debris around wreck
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.5})`;
    ctx.lineWidth = 0.7;
    // Barrel
    ctx.beginPath(); ctx.ellipse(115, 12, 8, 5, 0.3, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(110, 10); ctx.lineTo(110, 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(120, 10); ctx.lineTo(120, 14); ctx.stroke();
    // Chest
    ctx.beginPath(); ctx.rect(120, 16, 14, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(120, 20); ctx.lineTo(134, 20); ctx.stroke();
    // Loose planks
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(-115, 15); ctx.lineTo(-125, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-120, 22); ctx.lineTo(-132, 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(95, 22); ctx.lineTo(108, 25); ctx.stroke();
    // Cannon
    ctx.strokeStyle = `rgba(${rgb},${wka * 0.6})`;
    ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.ellipse(-40, 20, 12, 3, 0.1, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-52, 20); ctx.lineTo(-55, 19); ctx.stroke();
    // Cannonballs
    ctx.fillStyle = `rgba(${rgb},${wka * 0.4})`;
    ctx.beginPath(); ctx.arc(-60, 22, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-64, 24, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-57, 25, 2, 0, Math.PI * 2); ctx.fill();

    ctx.restore();

    // Seaweed growing on/near wreck
    for (let i = 0; i < 8; i++) {
      const sx = wreckX - 80 + i * 25 + Math.sin(i * 2.3) * 15;
      const sway = Math.sin(t * 0.7 + i * 1.5) * 5;
      const sway2 = Math.sin(t * 1.1 + i * 0.9) * 3;
      const height = 25 + (i % 3) * 12;
      ctx.strokeStyle = `rgba(40,80,40,${(0.07 + (i % 3) * 0.02).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, wreckY + 15);
      ctx.bezierCurveTo(sx + sway, wreckY + 15 - height * 0.3, sx + sway + sway2, wreckY + 15 - height * 0.7, sx + sway * 1.5 + sway2, wreckY + 15 - height);
      ctx.stroke();
    }

    // Bubbles rising from wreck
    ctx.strokeStyle = `rgba(${rgb},0.06)`;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 6; i++) {
      const bx = wreckX - 30 + i * 15 + Math.sin(i * 3) * 10;
      const bubbleY = wreckY - 10 - ((t * 15 + i * 40) % 80);
      const br = 1.5 + Math.sin(i * 2) * 0.8;
      ctx.beginPath(); ctx.arc(bx, bubbleY, br, 0, Math.PI * 2); ctx.stroke();
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
