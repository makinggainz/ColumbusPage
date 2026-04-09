"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/* ── Wave height (Gerstner-style) ── */
function waveHeight(wx: number, wz: number, t: number, drift: number, driftZ: number) {
  const swx = wx + drift, swz = wz + driftZ;
  return (
    Math.sin(swx * 0.003 + t * 0.6) * Math.cos(swz * 0.004 + t * 0.35) * 40 +
    Math.sin(swx * 0.005 - t * 0.4 + 1.5) * Math.cos(swz * 0.006 + t * 0.25) * 25 +
    Math.sin((swx + swz) * 0.002 + t * 0.45) * 18 +
    Math.sin(swx * 0.01 + t * 1.0) * Math.cos(swz * 0.009 + t * 0.55) * 8
  );
}

/* ── Shore wave ── */
function shoreWave(wz: number, t: number, shoreZ: number): number {
  const dist = shoreZ - wz;
  if (dist < -60 || dist > 300) return 0;
  const depthFactor = Math.max(0.1, dist / 200);
  const steepness = 1 / Math.max(0.3, depthFactor);
  let wave = Math.sin(wz * 0.025 - t * 1.6) * 12 * steepness;
  if (dist < 60 && dist > 0) { const bk = 1 - dist / 60; wave += Math.sin(t * 6) * bk * 4; wave *= 1 - bk * 0.5; }
  if (dist < 0 && dist > -60) { const sw = -dist / 60; wave = Math.max(0, Math.sin(t * 1.2 - sw * 3)) * (1 - sw) * 6; }
  return wave;
}

/* ── Bottle 3D profile ── */
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

type V3 = [number, number, number];
function rotX(p: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1]*c - p[2]*s, p[1]*s + p[2]*c]; }
function rotZ(p: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return [p[0]*c - p[1]*s, p[0]*s + p[1]*c, p[2]]; }
function rotY(p: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return [p[0]*c - p[2]*s, p[1], p[0]*s + p[2]*c]; }

type Phase = "writing" | "fading" | "rolling" | "bottling" | "floating" | "done";

interface BottleState {
  wx: number; wz: number; wy: number;
  vx: number; vz: number;
  roll: number; pitch: number; heading: number;
  active: boolean;
  launched: boolean;
}

/* ── Smooth easing helpers ── */
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeInOutQuad(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

export default function BeachOceanScene({
  phase,
  messageText,
  senderName,
}: {
  phase: Phase;
  messageText?: string;
  senderName?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const bottleRef = useRef<BottleState>({
    wx: 0, wz: 420, wy: 0, vx: 0, vz: 0,
    roll: 0, pitch: 0, heading: -0.3, active: false, launched: false,
  });
  const phaseStartRef = useRef(0);
  const lastPhaseRef = useRef<Phase>("writing");
  const [, forceRender] = useState(0);

  // Load background image
  useEffect(() => {
    const img = new Image();
    img.src = "/emoji/skyBackground.png";
    img.onload = () => { bgImgRef.current = img; forceRender(n => n + 1); };
  }, []);

  // Activate bottle when entering rolling phase
  useEffect(() => {
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase;
      phaseStartRef.current = performance.now() * 0.001;
      if (phase === "rolling" && !bottleRef.current.active) {
        bottleRef.current.active = true;
        forceRender(n => n + 1);
      }
      if (phase === "floating" && !bottleRef.current.launched) {
        bottleRef.current.launched = true;
      }
    }
  }, [phase]);

  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = cvs.clientWidth, H = cvs.clientHeight;
    if (cvs.width !== W * dpr || cvs.height !== H * dpr) { cvs.width = W * dpr; cvs.height = H * dpr; ctx.scale(dpr, dpr); }
    ctx.clearRect(0, 0, W, H);

    const t = performance.now() * 0.001;
    const drift = t * 40, driftZ = t * 12;

    // ── Background image (sky) ──
    if (bgImgRef.current) {
      const img = bgImgRef.current;
      const imgAspect = img.width / img.height;
      const canvasAspect = W / H;
      let drawW: number, drawH: number, drawX: number, drawY: number;
      if (canvasAspect > imgAspect) {
        drawW = W;
        drawH = W / imgAspect;
        drawX = 0;
        drawY = (H - drawH) * 0.3; // bias toward top
      } else {
        drawH = H;
        drawW = H * imgAspect;
        drawX = (W - drawW) / 2;
        drawY = 0;
      }
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      // Soft warm overlay
      ctx.fillStyle = "rgba(240,244,250,0.15)";
      ctx.fillRect(0, 0, W, H);
    } else {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.5);
      skyGrad.addColorStop(0, "#E0E8F4");
      skyGrad.addColorStop(1, "#F0F4FA");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);
    }

    // ── Camera ──
    const fov = 550;
    const horizonY = H * 0.38;
    const camHeight = 380;
    const shoreZ = 500;

    const project = (wx: number, wy: number, wz: number): { sx: number; sy: number } | null => {
      if (wz <= 5) return null;
      return { sx: (wx * fov) / wz + W / 2, sy: ((-wy + camHeight) * fov) / wz + horizonY };
    };

    const getHeight = (wx: number, wz: number): number => {
      if (wz > shoreZ + 60) return Math.sin(wx * 0.006) * 2 - 18;
      if (wz > shoreZ - 80) {
        const blend = Math.max(0, Math.min(1, (wz - (shoreZ - 80)) / 140));
        return (Math.sin(wx * 0.006) * 2 - 18) * blend + (waveHeight(wx, wz, t, drift, driftZ) + shoreWave(wz, t, shoreZ)) * (1 - blend);
      }
      return waveHeight(wx, wz, t, drift, driftZ) + shoreWave(wz, t, shoreZ);
    };

    // ── Ocean mesh ──
    const rgb = "20,60,160";
    const COLS = 220, ROWS = 70, CELL = 20;
    for (let r = 0; r < ROWS; r++) {
      const wz = (r + 4) * CELL;
      if (wz > shoreZ + 30) continue;
      const depthT = r / ROWS;
      let alpha: number;
      if (wz > shoreZ - 80) {
        const shoreT = (wz - (shoreZ - 80)) / 110;
        alpha = 0.1 + (1 - Math.abs(shoreT - 0.4) * 2) * 0.25;
        alpha *= 0.5 + Math.sin(wz * 0.06 - t * 1.8) * 0.3;
      } else {
        alpha = 0.08 + depthT * 0.22;
      }
      ctx.strokeStyle = `rgba(${rgb},${Math.max(0, alpha).toFixed(3)})`;
      ctx.lineWidth = wz > shoreZ - 80 ? 1.3 : 0.7 + depthT * 1.0;
      ctx.beginPath(); let started = false;
      for (let c = 0; c < COLS; c++) {
        const wx = (c - COLS / 2) * CELL;
        const p = project(wx, getHeight(wx, wz), wz);
        if (!p) continue;
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();

      if (r % 2 === 0) {
        const vAlpha = Math.max(0, 0.03 + depthT * 0.12);
        ctx.strokeStyle = `rgba(${rgb},${vAlpha.toFixed(3)})`;
        ctx.lineWidth = 0.5 + depthT * 0.5;
        for (let c = 0; c < COLS; c += 2) {
          const wx = (c - COLS / 2) * CELL;
          const wz2 = wz, wz1 = wz - CELL;
          if (wz1 > shoreZ + 30) continue;
          const p1 = project(wx, getHeight(wx, wz1), wz1);
          const p2 = project(wx, getHeight(wx, wz2), wz2);
          if (p1 && p2) { ctx.beginPath(); ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke(); }
        }
      }
    }

    // ── Foam / whitecaps near shore ──
    if (true) {
      ctx.save();
      for (let i = 0; i < 18; i++) {
        const foamWz = shoreZ - 40 + Math.sin(i * 1.7 + t * 0.3) * 30;
        const foamWx = (i - 9) * 180 + Math.sin(t * 0.5 + i) * 30;
        const foamH = getHeight(foamWx, foamWz);
        const p = project(foamWx, foamH + 3, foamWz);
        if (!p) continue;
        const foamAlpha = 0.08 + Math.sin(t * 2 + i * 0.8) * 0.04;
        ctx.beginPath();
        ctx.ellipse(p.sx, p.sy, 25 + Math.sin(t + i) * 8, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${foamAlpha.toFixed(3)})`;
        ctx.fill();
      }
      ctx.restore();
    }

    // ── 3D Bottle ──
    const bottle = bottleRef.current;
    if (bottle.active) {
      const elapsed = t - phaseStartRef.current;
      const currentPhase = lastPhaseRef.current;

      // Position bottle based on phase
      if (currentPhase === "rolling" || currentPhase === "bottling") {
        // Bottle appears at the shore, bobbing gently
        bottle.wz = shoreZ - 50;
        bottle.wx = 0;
        bottle.wy = getHeight(0, shoreZ - 50) + 8;
        bottle.vx = 0;
        bottle.vz = 0;
      } else if (currentPhase === "floating" || currentPhase === "done") {
        if (!bottle.launched) {
          // Just started floating
          bottle.launched = true;
        }
        const floatElapsed = t - phaseStartRef.current;

        // Gradually accelerate outward — slow start, then picks up current
        const speedRamp = easeOutCubic(Math.min(1, floatElapsed / 8));
        const baseSpeed = 18 + speedRamp * 55;

        // Drift slightly to the right with ocean current
        const lateralDrift = Math.sin(t * 0.35) * 8 + floatElapsed * 2.5;

        bottle.vz = -baseSpeed;
        bottle.vx = lateralDrift * 0.3;

        bottle.wz += bottle.vz * 0.016;
        bottle.wx += bottle.vx * 0.016;
        bottle.wz = Math.max(40, bottle.wz);
      }

      // Buoyancy — sample wave heights around bottle
      const sd = 40;
      const h0 = getHeight(bottle.wx, bottle.wz);
      const hF = getHeight(bottle.wx + sd * Math.cos(bottle.heading), bottle.wz + sd * Math.sin(bottle.heading));
      const hB = getHeight(bottle.wx - sd * Math.cos(bottle.heading), bottle.wz - sd * Math.sin(bottle.heading));
      const hL = getHeight(bottle.wx - sd * Math.sin(bottle.heading), bottle.wz + sd * Math.cos(bottle.heading));
      const hR = getHeight(bottle.wx + sd * Math.sin(bottle.heading), bottle.wz - sd * Math.cos(bottle.heading));
      const targetWy = (h0 + hF + hB + hL + hR) / 5 + 5;
      bottle.wy += (targetWy - bottle.wy) * 0.1;
      bottle.pitch += (Math.atan2(hF - hB, sd * 2) * 0.8 - bottle.pitch) * 0.08;
      bottle.roll += (Math.atan2(hL - hR, sd * 2) * 0.6 - bottle.roll) * 0.08;

      // Heading follows movement direction
      if (Math.abs(bottle.vx) > 0.5 || Math.abs(bottle.vz) > 0.5) {
        const tH = Math.atan2(bottle.vz, bottle.vx);
        let hd = tH - bottle.heading;
        while (hd > Math.PI) hd -= 2 * Math.PI;
        while (hd < -Math.PI) hd += 2 * Math.PI;
        bottle.heading += hd * 0.016 * 0.8;
      }

      // ── Draw bottle ──
      const bottleLen = 140;
      const sections = 20;

      // Fade in during rolling, stay visible until far away
      let bottleAlpha = 1;
      if (currentPhase === "rolling") {
        bottleAlpha = Math.min(1, elapsed * 2);
      }
      if (currentPhase === "done") {
        // Fade out gently in the distance
        const dist = Math.max(0, bottle.wz);
        bottleAlpha = Math.max(0, dist / 200);
      }

      // Scale factor: bottle appears larger when close, smaller far away — natural perspective
      const bottleScale = 1.8;

      const bottlePoint = (along: number, angle: number, radius: number): V3 => {
        let lx = along - bottleLen / 2;
        let ly = Math.cos(angle) * radius;
        let lz = Math.sin(angle) * radius;
        let p = rotX([lx, ly, lz], bottle.roll);
        p = rotZ(p, bottle.pitch);
        p = rotY(p, bottle.heading);
        return [p[0] * bottleScale + bottle.wx, p[1] * bottleScale + bottle.wy, p[2] * bottleScale + bottle.wz];
      };

      const glassColor = `rgba(90,80,180,${(0.4 * bottleAlpha).toFixed(2)})`;
      const glassFaint = `rgba(80,70,160,${(0.2 * bottleAlpha).toFixed(2)})`;
      const corkColor = `rgba(160,130,80,${(0.45 * bottleAlpha).toFixed(2)})`;
      const scrollColor = `rgba(180,160,120,${(0.5 * bottleAlpha).toFixed(2)})`;
      const highlightColor = `rgba(140,135,200,${(0.25 * bottleAlpha).toFixed(2)})`;

      // Bottle rings
      const ringTs = [0, 0.06, 0.12, 0.2, 0.3, 0.4, 0.5, 0.55, 0.58, 0.62, 0.65, 0.72, 0.8, 0.88, 0.91, 0.93, 0.97, 1.0];
      for (const rt of ringTs) {
        const along = rt * bottleLen;
        const r = bottleProfile(rt);
        if (r < 1) continue;
        const isCork = rt > 0.9;
        ctx.beginPath(); let started = false;
        for (let s = 0; s <= sections; s++) {
          const angle = (s / sections) * Math.PI * 2;
          const [wx, wy, wz] = bottlePoint(along, angle, r);
          const p = project(wx, wy, wz);
          if (!p) continue;
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
        }
        ctx.closePath();
        ctx.strokeStyle = isCork ? corkColor : glassColor;
        ctx.lineWidth = isCork ? 1.5 : 1.2;
        ctx.stroke();
      }

      // Longitudinal lines
      for (let s = 0; s < sections; s += 2) {
        const angle = (s / sections) * Math.PI * 2;
        ctx.beginPath(); let started = false;
        for (let i = 0; i <= 30; i++) {
          const rt = i / 30;
          const along = rt * bottleLen;
          const r = bottleProfile(rt);
          if (r < 1) continue;
          const [wx, wy, wz] = bottlePoint(along, angle, r);
          const p = project(wx, wy, wz);
          if (!p) continue;
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = glassFaint; ctx.lineWidth = 0.7; ctx.stroke();
      }

      // Glass highlight
      ctx.beginPath(); let hlStarted = false;
      for (let i = 0; i <= 20; i++) {
        const rt = 0.06 + (i / 20) * 0.85;
        const along = rt * bottleLen;
        const r = bottleProfile(rt);
        const [wx, wy, wz] = bottlePoint(along, -Math.PI * 0.3, r * 1.03);
        const p = project(wx, wy, wz);
        if (!p) continue;
        if (!hlStarted) { ctx.moveTo(p.sx, p.sy); hlStarted = true; } else ctx.lineTo(p.sx, p.sy);
      }
      ctx.strokeStyle = highlightColor; ctx.lineWidth = 2; ctx.stroke();

      // Scroll inside
      for (const offset of [-0.25, 0, 0.25]) {
        ctx.beginPath(); let started = false;
        for (let i = 0; i <= 16; i++) {
          const rt = 0.1 + (i / 16) * 0.4;
          const along = rt * bottleLen;
          const [wx, wy, wz] = bottlePoint(along, offset, 15);
          const p = project(wx, wy, wz);
          if (!p) continue;
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = scrollColor; ctx.lineWidth = 1; ctx.stroke();
      }

      // Text on scroll
      const textAlong = 0.25 * bottleLen;
      const [twx, twy, twz] = bottlePoint(textAlong, 0, 15 * 0.2);
      const tp = project(twx, twy, twz);
      if (tp && bottleAlpha > 0.3) {
        const scale = fov / twz;
        const fs = Math.max(8, Math.min(22, scale * 0.8));
        ctx.save();
        ctx.translate(tp.sx, tp.sy);
        ctx.rotate(bottle.heading * 0.3 + bottle.pitch * 0.2);
        ctx.font = `italic 600 ${fs}px Georgia, "Times New Roman", serif`;
        ctx.fillStyle = `rgba(90,70,40,${(0.6 * bottleAlpha).toFixed(2)})`;
        ctx.textAlign = "center";
        const displayText = (messageText && messageText.length > 20) ? messageText.slice(0, 20) + "..." : (messageText || "Your message");
        ctx.fillText(displayText, 0, 0);
        ctx.font = `italic ${fs * 0.6}px Georgia, "Times New Roman", serif`;
        ctx.fillStyle = `rgba(90,70,40,${(0.4 * bottleAlpha).toFixed(2)})`;
        ctx.fillText(`— ${senderName || "A fellow explorer"}`, 0, fs * 1.3);
        ctx.restore();
      }

      // Wake / trail behind bottle when floating
      if (currentPhase === "floating" || currentPhase === "done") {
        ctx.save();
        for (let w = 1; w <= 6; w++) {
          const trailWz = bottle.wz + w * 25;
          const trailWx = bottle.wx - w * bottle.vx * 0.02;
          const trailH = getHeight(trailWx, trailWz);
          const tp = project(trailWx, trailH + 2, trailWz);
          if (!tp) continue;
          const wakeAlpha = Math.max(0, 0.08 - w * 0.012) * bottleAlpha;
          ctx.beginPath();
          ctx.ellipse(tp.sx, tp.sy, 18 - w * 2, 3, bottle.heading * 0.3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200,210,240,${wakeAlpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // ── Note scroll animation (during rolling phase, before bottle) ──
    // This draws a note that appears to float down from the form area into the bottle
    if (phase === "rolling" || phase === "bottling") {
      const noteElapsed = t - phaseStartRef.current;
      const notePhaseT = Math.min(1, noteElapsed / 0.8);

      // Note position: starts center-high, drops down toward bottle
      const noteStartY = H * 0.25;
      const noteEndY = H * 0.55;
      const noteY = noteStartY + (noteEndY - noteStartY) * easeInOutQuad(notePhaseT);
      const noteX = W / 2;

      // Note shrinks and rolls as it descends
      const noteScale = 1 - notePhaseT * 0.7;
      const noteWidth = 200 * noteScale;
      const noteHeight = 120 * noteScale;
      const noteAlpha = phase === "bottling" ? Math.max(0, 1 - noteElapsed * 3) : 1;

      if (noteAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = noteAlpha;
        ctx.translate(noteX, noteY);
        ctx.rotate(notePhaseT * 0.3);

        // Parchment note
        ctx.fillStyle = "#faf5eb";
        ctx.shadowColor = "rgba(0,0,0,0.1)";
        ctx.shadowBlur = 15;
        ctx.fillRect(-noteWidth / 2, -noteHeight / 2, noteWidth, noteHeight);
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = "rgba(160,140,100,0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(-noteWidth / 2, -noteHeight / 2, noteWidth, noteHeight);

        // Text on note
        if (noteScale > 0.5) {
          const textFs = Math.max(8, 13 * noteScale);
          ctx.font = `italic ${textFs}px Georgia, serif`;
          ctx.fillStyle = "rgba(138,122,90,0.7)";
          ctx.textAlign = "center";
          const displayMsg = messageText ? (messageText.length > 30 ? messageText.slice(0, 30) + "..." : messageText) : "Your message...";
          ctx.fillText(displayMsg, 0, -5 * noteScale);
          ctx.font = `italic ${textFs * 0.8}px Georgia, serif`;
          ctx.fillStyle = "rgba(138,122,90,0.5)";
          ctx.fillText(`— ${senderName || "A fellow explorer"}`, 0, 15 * noteScale);
        }

        ctx.restore();
      }
    }

    animRef.current = requestAnimationFrame(draw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
