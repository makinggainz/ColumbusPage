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

type Phase = "writing" | "folding" | "bottling" | "dropping" | "floating" | "done";

interface BottleState {
  wx: number; wz: number; wy: number;
  vx: number; vz: number;
  roll: number; pitch: number; heading: number;
  active: boolean;
  launched: boolean;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
  color: string;
  life: number; maxLife: number;
}

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

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
    wx: 0, wz: 180, wy: 250, vx: 0, vz: 0,
    roll: 0, pitch: 0, heading: 0, active: false, launched: false,
  });
  const phaseStartRef = useRef(0);
  const lastPhaseRef = useRef<Phase>("writing");
  const floatStartRef = useRef(0);
  const dropStartRef = useRef(0);
  const poofParticlesRef = useRef<Particle[]>([]);
  const splashParticlesRef = useRef<Particle[]>([]);
  const splashSpawnedRef = useRef(false);
  const [, forceRender] = useState(0);

  // Load background image
  useEffect(() => {
    const img = new Image();
    img.src = "/emoji/skyBackground.png";
    img.onload = () => { bgImgRef.current = img; forceRender(n => n + 1); };
  }, []);

  // Phase transitions
  useEffect(() => {
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase;
      phaseStartRef.current = performance.now() * 0.001;

      if (phase === "bottling") {
        bottleRef.current.active = true;
        // Spawn poof particles
        const poofColors = ["#c4a54a", "#e8dcc4", "#d4b96a", "#f0e6d0", "#b89a3e", "#fff8e7"];
        const particles: Particle[] = [];
        for (let i = 0; i < 28; i++) {
          const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.4;
          const speed = 40 + Math.random() * 100;
          particles.push({
            x: 0, y: 0, // will be offset to bottle screen position in draw
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 20,
            size: 2 + Math.random() * 5,
            alpha: 0.7 + Math.random() * 0.3,
            color: poofColors[Math.floor(Math.random() * poofColors.length)],
            life: 0,
            maxLife: 0.6 + Math.random() * 0.4,
          });
        }
        poofParticlesRef.current = particles;
        forceRender(n => n + 1);
      }

      if (phase === "dropping") {
        dropStartRef.current = performance.now() * 0.001;
        splashSpawnedRef.current = false;
      }

      if (phase === "floating") {
        floatStartRef.current = performance.now() * 0.001;
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
    const dt = 0.016; // ~60fps frame time
    const drift = t * 40, driftZ = t * 12;

    // ── Background image (sky) ──
    if (bgImgRef.current) {
      const img = bgImgRef.current;
      const imgAspect = img.width / img.height;
      const canvasAspect = W / H;
      let drawW: number, drawH: number, drawX: number, drawY: number;
      if (canvasAspect > imgAspect) {
        drawW = W; drawH = W / imgAspect; drawX = 0; drawY = (H - drawH) * 0.3;
      } else {
        drawH = H; drawW = H * imgAspect; drawX = (W - drawW) / 2; drawY = 0;
      }
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
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

    const project = (wx: number, wy: number, wz: number): { sx: number; sy: number } | null => {
      if (wz <= 5) return null;
      return { sx: (wx * fov) / wz + W / 2, sy: ((-wy + camHeight) * fov) / wz + horizonY };
    };

    const getHeight = (wx: number, wz: number): number => {
      return waveHeight(wx, wz, t, drift, driftZ);
    };

    // ── Ocean mesh ──
    const rgb = "20,60,160";
    const COLS = 220, ROWS = 90, CELL = 20;
    for (let r = 0; r < ROWS; r++) {
      const wz = (r + 4) * CELL;
      const depthT = r / ROWS;
      const alpha = 0.06 + (1 - depthT) * 0.08 + depthT * 0.2;
      ctx.strokeStyle = `rgba(${rgb},${Math.max(0, alpha).toFixed(3)})`;
      ctx.lineWidth = 0.7 + depthT * 0.8;
      ctx.beginPath(); let started = false;
      for (let c = 0; c < COLS; c++) {
        const wx = (c - COLS / 2) * CELL;
        const p = project(wx, getHeight(wx, wz), wz);
        if (!p) continue;
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();

      if (r % 2 === 0) {
        const vAlpha = Math.max(0, 0.03 + depthT * 0.1);
        ctx.strokeStyle = `rgba(${rgb},${vAlpha.toFixed(3)})`;
        ctx.lineWidth = 0.5 + depthT * 0.4;
        for (let c = 0; c < COLS; c += 2) {
          const wx = (c - COLS / 2) * CELL;
          const wz2 = wz, wz1 = wz - CELL;
          const p1 = project(wx, getHeight(wx, wz1), wz1);
          const p2 = project(wx, getHeight(wx, wz2), wz2);
          if (p1 && p2) { ctx.beginPath(); ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke(); }
        }
      }
    }

    // ── Foam / whitecaps ──
    ctx.save();
    for (let i = 0; i < 22; i++) {
      const foamWz = 100 + i * 60 + Math.sin(i * 2.1 + t * 0.3) * 30;
      const foamWx = (i - 11) * 160 + Math.sin(t * 0.5 + i * 1.3) * 40;
      const foamH = getHeight(foamWx, foamWz);
      const p = project(foamWx, foamH + 3, foamWz);
      if (!p) continue;
      const foamAlpha = 0.06 + Math.sin(t * 2 + i * 0.8) * 0.03;
      ctx.beginPath();
      ctx.ellipse(p.sx, p.sy, 20 + Math.sin(t + i) * 6, 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${foamAlpha.toFixed(3)})`;
      ctx.fill();
    }
    ctx.restore();

    // ── 3D Bottle ──
    const bottle = bottleRef.current;
    const currentPhase = lastPhaseRef.current;

    if (bottle.active && currentPhase !== "writing" && currentPhase !== "folding") {
      const elapsed = t - phaseStartRef.current;

      // ── Position logic per phase ──
      if (currentPhase === "bottling") {
        // Bottle hovers in mid-air where the card was (center screen, ~40% down)
        // Find a world position that projects near center
        bottle.wz = 180;
        bottle.wx = 0;
        bottle.wy = 250; // high up, above water
        bottle.vx = 0;
        bottle.vz = 0;
        bottle.heading = 0;
        bottle.pitch = 0;
        bottle.roll = Math.sin(t * 2) * 0.05; // gentle wobble
      } else if (currentPhase === "dropping") {
        const dropElapsed = t - dropStartRef.current;
        // Gravity drop from mid-air to water surface
        const waterY = getHeight(bottle.wx, bottle.wz);
        const startY = 250;
        const gravity = 600; // acceleration
        const dropY = startY - 0.5 * gravity * dropElapsed * dropElapsed;
        bottle.wy = Math.max(waterY + 5, dropY);

        // Once bottle hits water, spawn splash
        if (bottle.wy <= waterY + 8 && !splashSpawnedRef.current) {
          splashSpawnedRef.current = true;
          const splashColors = ["rgba(180,210,255,0.8)", "rgba(220,235,255,0.7)", "rgba(150,190,240,0.6)", "rgba(255,255,255,0.7)"];
          const splashParts: Particle[] = [];
          const sp = project(bottle.wx, bottle.wy, bottle.wz);
          if (sp) {
            for (let i = 0; i < 16; i++) {
              const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.3;
              const speed = 30 + Math.random() * 70;
              splashParts.push({
                x: sp.sx, y: sp.sy,
                vx: Math.cos(angle) * speed * 0.7,
                vy: -Math.abs(Math.sin(angle)) * speed - 20,
                size: 1.5 + Math.random() * 3,
                alpha: 0.6 + Math.random() * 0.4,
                color: splashColors[Math.floor(Math.random() * splashColors.length)],
                life: 0,
                maxLife: 0.5 + Math.random() * 0.4,
              });
            }
          }
          splashParticlesRef.current = splashParts;
        }

        bottle.roll = Math.sin(t * 3) * 0.08;
        bottle.pitch = Math.sin(t * 2.5) * 0.05;
      } else if (currentPhase === "floating" || currentPhase === "done") {
        const floatElapsed = t - floatStartRef.current;
        const speedRamp = easeOutCubic(Math.min(1, floatElapsed / 6));
        const baseSpeed = 20 + speedRamp * 80;
        const lateralDrift = Math.sin(t * 0.4) * 6 + floatElapsed * 1.5;

        bottle.vz = baseSpeed;
        bottle.vx = lateralDrift * 0.25;
        bottle.wz += bottle.vz * dt;
        bottle.wx += bottle.vx * dt;

        // Buoyancy
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

        if (Math.abs(bottle.vx) > 0.5 || Math.abs(bottle.vz) > 0.5) {
          const tH = Math.atan2(bottle.vz, bottle.vx);
          let hd = tH - bottle.heading;
          while (hd > Math.PI) hd -= 2 * Math.PI;
          while (hd < -Math.PI) hd += 2 * Math.PI;
          bottle.heading += hd * dt * 0.8;
        }
      }

      // ── Draw bottle ──
      let bottleAlpha = 1;
      if (currentPhase === "bottling") {
        bottleAlpha = Math.min(1, elapsed * 1.8); // fade in
      }
      if (bottle.wz > 1200) {
        bottleAlpha = Math.max(0, 1 - (bottle.wz - 1200) / 600);
      }

      const bottleLen = 140;
      const sections = 20;
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
      if (bottleAlpha > 0.3 && bottle.wz < 800) {
        const textAlong = 0.25 * bottleLen;
        const [twx, twy, twz] = bottlePoint(textAlong, 0, 15 * 0.2);
        const tp = project(twx, twy, twz);
        if (tp) {
          const scale = fov / twz;
          const fs = Math.max(8, Math.min(22, scale * 0.8));
          if (fs > 6) {
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
        }
      }

      // Wake trail (floating)
      if ((currentPhase === "floating" || currentPhase === "done") && bottleAlpha > 0.05) {
        ctx.save();
        for (let w = 1; w <= 8; w++) {
          const trailWz = bottle.wz - w * 20;
          const trailWx = bottle.wx - w * bottle.vx * 0.015;
          if (trailWz < 60) continue;
          const trailH = getHeight(trailWx, trailWz);
          const tp = project(trailWx, trailH + 2, trailWz);
          if (!tp) continue;
          const wakeAlpha = Math.max(0, 0.1 - w * 0.012) * bottleAlpha;
          ctx.beginPath();
          ctx.ellipse(tp.sx, tp.sy, 20 - w * 1.5, 3, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200,210,240,${wakeAlpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // ── Poof particles (bottling phase) ──
    if (poofParticlesRef.current.length > 0) {
      const bottleScreenPos = project(bottleRef.current.wx, bottleRef.current.wy, bottleRef.current.wz);
      const cx = bottleScreenPos ? bottleScreenPos.sx : W / 2;
      const cy = bottleScreenPos ? bottleScreenPos.sy : H * 0.4;

      ctx.save();
      const alive: Particle[] = [];
      for (const p of poofParticlesRef.current) {
        p.life += dt;
        if (p.life > p.maxLife) continue;
        const lifeT = p.life / p.maxLife;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96;
        p.vy *= 0.96;
        const currentAlpha = p.alpha * (1 - lifeT * lifeT);
        const currentSize = p.size * (1 - lifeT * 0.5);
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
        alive.push(p);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      if (alive.length === 0) poofParticlesRef.current = [];
    }

    // ── Splash particles (dropping phase) ──
    if (splashParticlesRef.current.length > 0) {
      ctx.save();
      const alive: Particle[] = [];
      for (const p of splashParticlesRef.current) {
        p.life += dt;
        if (p.life > p.maxLife) continue;
        const lifeT = p.life / p.maxLife;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 180 * dt; // gravity pulls splash back down
        const currentAlpha = (1 - lifeT) * 0.7;
        const currentSize = p.size * (1 - lifeT * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
        alive.push(p);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      if (alive.length === 0) splashParticlesRef.current = [];
    }

    // ── Splash ripple rings ──
    if (currentPhase === "dropping" && splashSpawnedRef.current) {
      const splashElapsed = t - dropStartRef.current - 0.4; // delay a bit
      if (splashElapsed > 0 && splashElapsed < 1.5) {
        const sp = project(bottleRef.current.wx, getHeight(bottleRef.current.wx, bottleRef.current.wz), bottleRef.current.wz);
        if (sp) {
          ctx.save();
          for (let ring = 0; ring < 3; ring++) {
            const ringT = splashElapsed - ring * 0.15;
            if (ringT < 0 || ringT > 1.2) continue;
            const ringAlpha = Math.max(0, 0.3 * (1 - ringT / 1.2));
            const ringRadius = 8 + ringT * 50;
            ctx.beginPath();
            ctx.ellipse(sp.sx, sp.sy, ringRadius, ringRadius * 0.3, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(180,210,255,${ringAlpha.toFixed(3)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
          ctx.restore();
        }
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
