"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type V3 = [number, number, number];

/* ── Gerstner-inspired wave height (matches hero color scheme) ── */
function waveHeight(wx: number, wz: number, t: number, drift: number, driftZ: number) {
  const swx = wx + drift, swz = wz + driftZ;
  // Primary swell
  let h = Math.sin(swx * 0.003 + t * 0.6) * Math.cos(swz * 0.004 + t * 0.35) * 40;
  // Secondary swell
  h += Math.sin(swx * 0.005 - t * 0.4 + 1.5) * Math.cos(swz * 0.006 + t * 0.25) * 25;
  // Long-period ground swell
  h += Math.sin((swx + swz) * 0.002 + t * 0.45) * 18;
  // Chop
  h += Math.sin(swx * 0.01 + t * 1.0) * Math.cos(swz * 0.009 + t * 0.55) * 8;
  return h;
}

/* ── Shore wave: steepens and breaks near shore ── */
function shoreWave(wx: number, wz: number, t: number, shoreZ: number): number {
  const distToShore = shoreZ - wz;
  if (distToShore < -80) return 0; // past the shore, on sand
  if (distToShore > 400) return 0; // too far out

  // Shoaling: waves steepen as depth decreases
  const depthFactor = Math.max(0.1, distToShore / 300);
  const steepness = 1 / Math.max(0.3, depthFactor);

  // Multiple wave trains approaching shore
  const w1 = Math.sin(wz * 0.025 - t * 1.6 + wx * 0.003) * 15 * steepness;
  const w2 = Math.sin(wz * 0.018 - t * 1.1 + wx * 0.005 + 2.0) * 10 * steepness;
  const w3 = Math.sin(wz * 0.04 - t * 2.2 + wx * 0.008) * 5 * steepness;

  // Asymmetric wave shape (steep front, gentle back) — trochoidal approximation
  let wave = w1 + w2 + w3;
  if (wave > 0) wave = Math.pow(wave / (15 * steepness), 0.7) * 15 * steepness;

  // Breaking: cap height and add turbulence near shore
  if (distToShore < 80 && distToShore > 0) {
    const breakT = 1 - distToShore / 80;
    // Foam turbulence
    wave += Math.sin(wx * 0.08 + t * 6) * breakT * 4;
    wave += Math.sin(wz * 0.1 - t * 8 + wx * 0.05) * breakT * 3;
    // Collapse wave height
    wave *= 1 - breakT * 0.6;
  }

  // Swash zone: thin layer of water rushing up sand
  if (distToShore < 0 && distToShore > -80) {
    const swashT = -distToShore / 80;
    const swashWave = Math.max(0, Math.sin(t * 1.2 - swashT * 3)) * (1 - swashT) * 8;
    wave = swashWave;
  }

  return wave;
}

/* ── Bottle 3D model ── */
function bottleProfile(p: number): number {
  if (p < 0) return 0;
  if (p < 0.06) return 24 * Math.sqrt(p / 0.06);
  if (p < 0.55) return 24;
  if (p < 0.65) return 24 - (p - 0.55) / 0.1 * 13;
  if (p < 0.88) return 11;
  if (p < 0.93) return 13;
  if (p <= 1.0) return 12;
  return 0;
}

export const BottleScene = ({ onBottleClick, visible }: { onBottleClick?: () => void; visible?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [hoveringBottle, setHoveringBottle] = useState(false);
  const bottleBoundsRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  // Bottle physics state
  const bottleRef = useRef({
    wx: 0, wz: 200, wy: 0,
    vx: 0, vz: 0,
    roll: 0, pitch: 0, heading: -0.4,
    rollVel: 0, pitchVel: 0,
    grounded: false,
  });
  const startTimeRef = useRef(0);

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
    ctx.fillStyle = "#F9F9F9";
    ctx.fillRect(0, 0, W, H);

    const t = performance.now() * 0.001;
    if (visible && startTimeRef.current === 0) startTimeRef.current = t;
    const elapsed = startTimeRef.current > 0 ? t - startTimeRef.current : 0;

    const drift = t * 40;
    const driftZ = t * 12;

    // ── 3D Camera ──
    const fov = 550;
    const horizonY = H * 0.30 - 100;
    const camHeight = 380;

    const project = (wx: number, wy: number, wz: number): [number, number] | null => {
      if (wz <= 5) return null;
      return [
        (wx * fov) / wz + W / 2,
        ((-wy + camHeight) * fov) / wz + horizonY,
      ];
    };

    // ── Shore geometry ──
    const shoreWZ = 500;
    const cellSize = 20;
    const gridCols = 180;
    const gridRows = 70;

    const getHeight = (wx: number, wz: number): number => {
      if (wz > shoreWZ + 80) {
        // Sand
        return Math.sin(wx * 0.006) * 2 + Math.sin(wz * 0.004 + wx * 0.003) * 1.5 - 18;
      } else if (wz > shoreWZ - 100) {
        // Shore transition
        const blend = Math.max(0, Math.min(1, (wz - (shoreWZ - 100)) / 180));
        const sandH = Math.sin(wx * 0.006) * 2 - 18;
        const waterH = waveHeight(wx, wz, t, drift, driftZ);
        const shoreH = shoreWave(wx, wz, t, shoreWZ);
        return sandH * blend + (waterH + shoreH) * (1 - blend);
      } else {
        return waveHeight(wx, wz, t, drift, driftZ);
      }
    };

    // ── Build & draw mesh grid ──
    const grid: ([number, number] | null)[][] = [];

    for (let r = 0; r < gridRows; r++) {
      grid[r] = [];
      for (let c = 0; c < gridCols; c++) {
        const wx = (c - gridCols / 2) * cellSize;
        const wz = (r + 4) * cellSize;
        const wy = getHeight(wx, wz);
        grid[r][c] = project(wx, wy, wz);
      }
    }

    // Horizontal lines
    for (let r = 0; r < gridRows; r++) {
      const wz = (r + 4) * cellSize;
      const depthT = r / gridRows;
      let alpha: number;
      if (wz < shoreWZ - 100) {
        alpha = 0.08 + depthT * 0.22;
      } else if (wz < shoreWZ + 80) {
        const shoreT = (wz - (shoreWZ - 100)) / 180;
        alpha = 0.1 + (1 - Math.abs(shoreT - 0.45) * 2.2) * 0.3;
        alpha *= 0.6 + Math.sin(wz * 0.06 - t * 1.8) * 0.4;
      } else {
        alpha = Math.max(0, 0.06 * (1 - (wz - shoreWZ - 80) / 400));
      }
      ctx.strokeStyle = `rgba(20,60,160,${Math.max(0, alpha).toFixed(3)})`;
      ctx.lineWidth = wz > shoreWZ - 100 && wz < shoreWZ + 80 ? 1.3 : 0.7 + depthT * 1.0;
      ctx.beginPath();
      let started = false;
      for (let c = 0; c < gridCols; c++) {
        const p = grid[r][c];
        if (!p) continue;
        if (!started) { ctx.moveTo(p[0], p[1]); started = true; }
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();
    }

    // Vertical lines
    for (let c = 0; c < gridCols; c += 2) {
      ctx.beginPath();
      let started = false;
      for (let r = 0; r < gridRows; r++) {
        const p = grid[r][c];
        if (!p) continue;
        const depthT = r / gridRows;
        const wz = (r + 4) * cellSize;
        const alpha = wz < shoreWZ ? 0.04 + depthT * 0.12 : Math.max(0, 0.03 * (1 - (wz - shoreWZ) / 400));
        ctx.strokeStyle = `rgba(20,60,160,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.5 + depthT * 0.5;
        if (!started) { ctx.moveTo(p[0], p[1]); started = true; }
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();
    }

    // ── Bottle physics ──
    const bottle = bottleRef.current;
    const dt = 0.016;

    if (visible && elapsed > 0 && !bottle.grounded) {
      // Ease-out: bottle starts fast and decelerates as it nears shore
      const journeyProgress = Math.max(0, Math.min(1, (bottle.wz - 150) / (shoreWZ - 150)));
      const easeOut = 1 - journeyProgress * journeyProgress; // quadratic ease-out
      const mobileBoost = W < 640 ? 1.5 : 1; // 50% faster on mobile

      // Wave-driven drift toward shore — strong at start, gentle near shore
      const waveForceZ = (15 + 40 * easeOut) * mobileBoost; // 55 far out → 15 near shore
      const waveForceLateral = Math.sin(t * 0.7) * 8 * (0.3 + 0.7 * easeOut);

      // Current pushes bottle to shore
      bottle.vx += waveForceLateral * dt;
      bottle.vz += waveForceZ * dt;

      // Gentle centering force — keeps bottle within navbar width (~±600 world units)
      // Ramps up as bottle nears shore so it reliably lands in view
      const shoreApproach = journeyProgress;
      const centerForce = -bottle.wx * 0.006 * shoreApproach;
      bottle.vx += centerForce * dt;

      // Damping — increases as bottle approaches shore for smoother arrival
      const damping = 0.995 - journeyProgress * 0.015; // 0.995 far → 0.980 near
      bottle.vx *= damping;
      bottle.vz *= damping;

      bottle.wx += bottle.vx * dt;
      bottle.wz += bottle.vz * dt;

      // Sample wave at bottle position for buoyancy
      const sampleDist = 40;
      const h0 = getHeight(bottle.wx, bottle.wz);
      const hFwd = getHeight(bottle.wx + sampleDist * Math.cos(bottle.heading), bottle.wz + sampleDist * Math.sin(bottle.heading));
      const hBack = getHeight(bottle.wx - sampleDist * Math.cos(bottle.heading), bottle.wz - sampleDist * Math.sin(bottle.heading));
      const hLeft = getHeight(bottle.wx - sampleDist * Math.sin(bottle.heading), bottle.wz + sampleDist * Math.cos(bottle.heading));
      const hRight = getHeight(bottle.wx + sampleDist * Math.sin(bottle.heading), bottle.wz - sampleDist * Math.cos(bottle.heading));

      // Buoyancy — bottle follows wave surface
      const targetWy = (h0 + hFwd + hBack + hLeft + hRight) / 5 + 5;
      bottle.wy += (targetWy - bottle.wy) * 0.08;

      // Wave-induced rotation
      const targetPitch = Math.atan2(hFwd - hBack, sampleDist * 2) * 0.8;
      const targetRoll = Math.atan2(hLeft - hRight, sampleDist * 2) * 0.6;

      bottle.pitchVel += (targetPitch - bottle.pitch) * 3 * dt;
      bottle.rollVel += (targetRoll - bottle.roll) * 3 * dt;
      bottle.pitchVel *= 0.95;
      bottle.rollVel *= 0.95;
      bottle.pitch += bottle.pitchVel;
      bottle.roll += bottle.rollVel;

      // Heading follows current with gentle rotation
      const targetHeading = Math.atan2(bottle.vz, bottle.vx);
      let hDiff = targetHeading - bottle.heading;
      while (hDiff > Math.PI) hDiff -= 2 * Math.PI;
      while (hDiff < -Math.PI) hDiff += 2 * Math.PI;
      bottle.heading += hDiff * dt * 0.5;

      // Ground when reaching shore
      if (bottle.wz > shoreWZ + 30) {
        bottle.grounded = true;
        bottle.vx = 0;
        bottle.vz = 0;
      }
    } else if (bottle.grounded) {
      // Resting on sand — very gentle rock from nearby waves
      const shoreH = getHeight(bottle.wx, bottle.wz);
      bottle.wy += (shoreH + 3 - bottle.wy) * 0.02;
      bottle.pitch += (-0.2 - bottle.pitch) * 0.01;
      bottle.roll += (Math.sin(t * 0.8) * 0.03 - bottle.roll) * 0.02;
    } else {
      // Not visible yet — keep in starting position
      bottle.wx = 0;
      bottle.wz = 200;
      bottle.wy = getHeight(0, 200) + 5;
    }

    // ── Draw bottle ──
    const bottleLen = 140;
    const sections = 20;

    const bottlePoint = (along: number, angle: number, radius: number): V3 => {
      let lx = along - bottleLen / 2;
      let ly = Math.cos(angle) * radius;
      let lz = Math.sin(angle) * radius;

      const cr = Math.cos(bottle.roll), sr = Math.sin(bottle.roll);
      const y1 = ly * cr - lz * sr, z1 = ly * sr + lz * cr;
      ly = y1; lz = z1;

      const cp = Math.cos(bottle.pitch), sp = Math.sin(bottle.pitch);
      const x2 = lx * cp - ly * sp, y2 = lx * sp + ly * cp;
      lx = x2; ly = y2;

      const ch = Math.cos(bottle.heading), sh = Math.sin(bottle.heading);
      const x3 = lx * ch - lz * sh, z3 = lx * sh + lz * ch;

      return [x3 + bottle.wx, ly + bottle.wy, z3 + bottle.wz];
    };

    let minSX = Infinity, minSY = Infinity, maxSX = -Infinity, maxSY = -Infinity;

    const trackBounds = (p: [number, number]) => {
      if (p[0] < minSX) minSX = p[0];
      if (p[1] < minSY) minSY = p[1];
      if (p[0] > maxSX) maxSX = p[0];
      if (p[1] > maxSY) maxSY = p[1];
    };

    const glassColor = hoveringBottle ? "rgba(120,110,220,0.55)" : "rgba(90,80,180,0.35)";
    const glassColorFaint = hoveringBottle ? "rgba(120,110,220,0.35)" : "rgba(80,70,160,0.2)";
    const corkColor = "rgba(160,130,80,0.4)";
    const scrollColor = "rgba(180,160,120,0.45)";

    // Bottle rings
    const ringTs = [0, 0.06, 0.12, 0.2, 0.3, 0.4, 0.5, 0.55, 0.58, 0.62, 0.65, 0.72, 0.8, 0.88, 0.91, 0.93, 0.97, 1.0];
    for (const rt of ringTs) {
      const along = rt * bottleLen;
      const r = bottleProfile(rt);
      if (r < 1) continue;
      const isCork = rt > 0.9;
      ctx.beginPath();
      let started = false;
      for (let s = 0; s <= sections; s++) {
        const angle = (s / sections) * Math.PI * 2;
        const [wx, wy, wz] = bottlePoint(along, angle, r);
        const p = project(wx, wy, wz);
        if (!p) continue;
        if (!started) { ctx.moveTo(p[0], p[1]); started = true; }
        else ctx.lineTo(p[0], p[1]);
        trackBounds(p);
      }
      ctx.closePath();
      ctx.strokeStyle = isCork ? corkColor : glassColor;
      ctx.lineWidth = isCork ? 1.5 : 1.2;
      ctx.stroke();
    }

    // Longitudinal lines
    for (let s = 0; s < sections; s += 2) {
      const angle = (s / sections) * Math.PI * 2;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 30; i++) {
        const rt = i / 30;
        const along = rt * bottleLen;
        const r = bottleProfile(rt);
        if (r < 1) continue;
        const [wx, wy, wz] = bottlePoint(along, angle, r);
        const p = project(wx, wy, wz);
        if (!p) continue;
        if (!started) { ctx.moveTo(p[0], p[1]); started = true; }
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.strokeStyle = glassColorFaint;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    // Glass highlight
    ctx.beginPath();
    let hlStarted = false;
    for (let i = 0; i <= 20; i++) {
      const rt = 0.06 + (i / 20) * 0.85;
      const along = rt * bottleLen;
      const r = bottleProfile(rt);
      const [wx, wy, wz] = bottlePoint(along, -Math.PI * 0.3, r * 1.03);
      const p = project(wx, wy, wz);
      if (!p) continue;
      if (!hlStarted) { ctx.moveTo(p[0], p[1]); hlStarted = true; }
      else ctx.lineTo(p[0], p[1]);
    }
    ctx.strokeStyle = hoveringBottle ? "rgba(180,175,255,0.3)" : "rgba(140,135,200,0.15)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // ── Message scroll ──
    const scrollStartT = 0.1, scrollEndT = 0.5, scrollR = 15;
    for (const offset of [-0.25, 0, 0.25]) {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 16; i++) {
        const rt = scrollStartT + (i / 16) * (scrollEndT - scrollStartT);
        const along = rt * bottleLen;
        const [wx, wy, wz] = bottlePoint(along, offset, scrollR);
        const p = project(wx, wy, wz);
        if (!p) continue;
        if (!started) { ctx.moveTo(p[0], p[1]); started = true; }
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.strokeStyle = scrollColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Scroll ends
    for (const endT of [scrollStartT, scrollEndT]) {
      const along = endT * bottleLen;
      ctx.beginPath();
      let started = false;
      for (let s = 0; s <= 12; s++) {
        const angle = -0.4 + (s / 12) * 0.8;
        const [wx, wy, wz] = bottlePoint(along, angle, scrollR);
        const p = project(wx, wy, wz);
        if (!p) continue;
        if (!started) { ctx.moveTo(p[0], p[1]); started = true; }
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.strokeStyle = scrollColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // "Dear User" text
    const textAlong = 0.25 * bottleLen;
    const [twx, twy, twz] = bottlePoint(textAlong, 0, scrollR * 0.2);
    const tp = project(twx, twy, twz);
    if (tp) {
      const scale = fov / twz;
      const fs = Math.max(11, Math.min(26, scale * 0.9));
      ctx.save();
      ctx.translate(tp[0], tp[1]);
      ctx.rotate(bottle.heading * 0.3 + bottle.pitch * 0.2);
      ctx.font = `italic 600 ${fs}px Georgia, "Times New Roman", serif`;
      ctx.fillStyle = "rgba(90,70,40,0.6)";
      ctx.textAlign = "center";
      ctx.fillText("Dear User,", 0, 0);
      ctx.font = `italic ${fs * 0.6}px Georgia, "Times New Roman", serif`;
      ctx.fillStyle = "rgba(90,70,40,0.4)";
      ctx.fillText("a message awaits you...", 0, fs * 1.3);
      ctx.restore();
    }

    // Bottle shadow
    ctx.beginPath();
    let shStarted = false;
    for (let i = 0; i <= 12; i++) {
      const rt = i / 12;
      const along = rt * bottleLen;
      const r = bottleProfile(rt);
      const [wx, , wz] = bottlePoint(along, Math.PI * 0.5, r * 1.5);
      const sandY = getHeight(wx, wz) - 3;
      const p = project(wx, sandY, wz + 10);
      if (!p) continue;
      if (!shStarted) { ctx.moveTo(p[0], p[1]); shStarted = true; }
      else ctx.lineTo(p[0], p[1]);
    }
    ctx.strokeStyle = "rgba(20,60,160,0.06)";
    ctx.lineWidth = 14;
    ctx.stroke();

    // Store bounds
    if (minSX < Infinity) {
      const pad = 120;
      bottleBoundsRef.current = { x: minSX - pad, y: minSY - pad, w: maxSX - minSX + pad * 2, h: maxSY - minSY + pad * 2 };
    }

    // Hover hint
    if (hoveringBottle) {
      const hintP = project(bottle.wx, bottle.wy + 55, bottle.wz);
      if (hintP) {
        ctx.save();
        ctx.font = "14px system-ui, sans-serif";
        ctx.fillStyle = "rgba(20,60,160,0.5)";
        ctx.textAlign = "center";
        ctx.fillText("click to open", hintP[0], hintP[1] - 10);
        ctx.restore();
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [hoveringBottle, visible]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const clickedRef = useRef(false);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    const isInBottle = (x: number, y: number): boolean => {
      const b = bottleBoundsRef.current;
      if (!b) return false;
      return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    };

    const onMove = (e: MouseEvent) => {
      if (clickedRef.current) { cvs.style.cursor = "default"; setHoveringBottle(false); return; }
      const rect = cvs.getBoundingClientRect();
      const over = isInBottle(e.clientX - rect.left, e.clientY - rect.top);
      setHoveringBottle(over);
      cvs.style.cursor = over ? "pointer" : "default";
    };

    const onClick = () => {
      if (clickedRef.current) return;
      clickedRef.current = true;
      setHoveringBottle(false);
      cvs.style.cursor = "default";
      onBottleClick?.();
    };

    cvs.addEventListener("mousemove", onMove);
    cvs.addEventListener("click", onClick);
    return () => { cvs.removeEventListener("mousemove", onMove); cvs.removeEventListener("click", onClick); };
  }, [onBottleClick]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
};
