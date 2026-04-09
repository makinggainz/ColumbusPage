"use client";

import { useEffect, useRef, useCallback } from "react";

type V3 = [number, number, number];

/* ── Wave height (same as Hero) ── */
function getWaveHeight(wx: number, wz: number, t: number, drift: number, driftZ: number) {
  const swx = wx + drift, swz = wz + driftZ;
  return (
    Math.sin(swx * 0.003 + t * 0.42) * Math.cos(swz * 0.004 + t * 0.25) * 30 +
    Math.sin(swx * 0.005 - t * 0.28 + 1.5) * Math.cos(swz * 0.006 + t * 0.18) * 18 +
    Math.sin((swx + swz) * 0.002 + t * 0.32) * 14 +
    Math.sin(swx * 0.01 + t * 0.7) * Math.cos(swz * 0.009 + t * 0.39) * 6
  );
}

/* ── Curved island shoreline — returns how far inland a point is (>0 = on land) ── */
function getInland(wx: number, wz: number, islandCx: number, islandCz: number, islandR: number) {
  // Elliptical island centered at (islandCx, islandCz)
  const dx = (wx - islandCx) / (islandR * 1.3); // wider than tall
  const dz = (wz - islandCz) / islandR;
  const dist = Math.sqrt(dx * dx + dz * dz);
  // Add coastline variation for organic shape
  const coastNoise = Math.sin(Math.atan2(dz, dx) * 5) * 0.08 + Math.sin(Math.atan2(dz, dx) * 3 + 1) * 0.05;
  return (1 - dist + coastNoise) * islandR;
}

/* ── Shore height — progressive elevation inland ── */
function getShoreHeight(wx: number, wz: number, t: number, drift: number, driftZ: number, islandCx: number, islandCz: number, islandR: number) {
  const inland = getInland(wx, wz, islandCx, islandCz, islandR);

  // Directional bias: back-right side of island is taller
  // (positive wx and negative wz relative to center = back-right)
  const dirBias = 1 + Math.max(0, (wx - islandCx) / (islandR * 1.5)) * 0.6
                    + Math.max(0, (islandCz - wz) / (islandR * 2)) * 0.3;

  if (inland > islandR * 0.5) {
    // Peak — tall central mountains
    const peakFactor = Math.min(1, (inland - islandR * 0.5) / (islandR * 0.3));
    const baseH = (35 + peakFactor * 70) * dirBias;
    return baseH + Math.sin(wx * 0.004 + wz * 0.005) * 8 + Math.sin(wz * 0.008) * 5;
  } else if (inland > islandR * 0.08) {
    // Forested hills — steady climb, always higher than beach
    const hillProgress = (inland - islandR * 0.08) / (islandR * 0.42);
    const baseH = 6 + hillProgress * hillProgress * 50 * dirBias;
    const noise = Math.sin(wx * 0.006 + wz * 0.005) * 6 * hillProgress
                + Math.sin(wz * 0.012 + wx * 0.003) * 4 * hillProgress;
    return baseH + noise;
  } else if (inland > 0) {
    // Beach — flat sandy strip, clearly distinct (stays low, ~0-4 units)
    const beachProgress = inland / (islandR * 0.08);
    return beachProgress * 4 + Math.sin(wz * 0.015 + wx * 0.008) * beachProgress * 0.8;
  } else {
    // Ocean — waves smoothly dampen toward shore
    const waveH = getWaveHeight(wx, wz, t, drift, driftZ);
    const distFromShore = -inland;
    if (distFromShore < 120) {
      const dampen = distFromShore / 120;
      return waveH * dampen * dampen;
    }
    return waveH;
  }
}

/* ── 3D rotation helpers (same as Hero) ── */
function rotY(p: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c]; }
function rotX(p: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; }
function rotZ(p: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; }
function xformVert(local: V3, roll: number, pitch: number, heading: number, scale: number, ox: number, oy: number, oz: number): V3 {
  let p = rotX(local, roll); p = rotZ(p, pitch); p = rotY(p, heading);
  return [p[0] * scale + ox, p[1] * scale + oy, p[2] * scale + oz];
}

/* ── Simplified boat model (from Hero) ── */
const STATIONS: [number, number, number][] = [[-30,5,4.5],[-20,7,5.5],[-10,9.5,7],[0,11,7.5],[10,10,6.5],[20,8,5],[30,5,3],[38,2,1],[44,0,0]];
function buildHullVerts() {
  const deckP: V3[] = [], deckS: V3[] = [], keelP: V3[] = [], keelS: V3[] = [];
  for (const [x, hw, kd] of STATIONS) { deckP.push([x,0,hw]); deckS.push([x,0,-hw]); keelP.push([x,-kd,hw*0.6]); keelS.push([x,-kd,-hw*0.6]); }
  return { deckP, deckS, keelP, keelS };
}
const HULL = buildHullVerts();
const SC_HEIGHT = 10;
const MAIN_MAST_X = -2, MAIN_MAST_H = 48, FORE_MAST_X = 22, FORE_MAST_H = 38;
const MODEL_SCALE = 2.0;

interface BoatPhysics { wx: number; wz: number; vx: number; vz: number; wy: number; pitch: number; roll: number; heading: number; }

function drawBoat3D(ctx: CanvasRenderingContext2D, project: (wx: number, wy: number, wz: number) => { sx: number; sy: number } | null, phys: BoatPhysics, t: number, a: number) {
  const { roll, pitch, heading, wx, wy, wz } = phys;
  const sc = MODEL_SCALE;
  const xf = (local: V3): { sx: number; sy: number } | null => { const w = xformVert(local, roll, pitch, heading, sc, wx, wy, wz); return project(w[0], w[1], w[2]); };
  const drawEdge = (from: V3, to: V3, color: string, lw: number) => { const a2 = xf(from), b = xf(to); if (!a2 || !b) return; ctx.beginPath(); ctx.moveTo(a2.sx, a2.sy); ctx.lineTo(b.sx, b.sy); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke(); };
  const drawFace = (pts: V3[], fillColor: string, strokeColor?: string, lw = 0.8) => { const projected = pts.map(xf); const valid = projected.filter(Boolean) as { sx: number; sy: number }[]; if (valid.length < 3) return; ctx.beginPath(); ctx.moveTo(valid[0].sx, valid[0].sy); for (let i = 1; i < valid.length; i++) ctx.lineTo(valid[i].sx, valid[i].sy); ctx.closePath(); ctx.fillStyle = fillColor; ctx.fill(); if (strokeColor) { ctx.strokeStyle = strokeColor; ctx.lineWidth = lw; ctx.stroke(); } };
  const drawPolyline = (pts: V3[], color: string, lw: number) => { const projected = pts.map(xf); ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = lw; let started = false; for (const p of projected) { if (!p) continue; if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy); } ctx.stroke(); };

  const hs = `rgba(20,60,160,${(0.5*a).toFixed(3)})`, hf = `rgba(20,60,160,${(0.06*a).toFixed(3)})`, hfd = `rgba(20,60,160,${(0.1*a).toFixed(3)})`;
  const rs = `rgba(20,60,160,${(0.25*a).toFixed(3)})`, ms = `rgba(20,60,160,${(0.45*a).toFixed(3)})`;
  const sf = `rgba(20,60,160,${(0.05*a).toFixed(3)})`, ss = `rgba(20,60,160,${(0.25*a).toFixed(3)})`;
  const rg = `rgba(20,60,160,${(0.15*a).toFixed(3)})`, ff = `rgba(20,60,160,${(0.3*a).toFixed(3)})`;
  const scs = `rgba(20,60,160,${(0.4*a).toFixed(3)})`, scf = `rgba(20,60,160,${(0.08*a).toFixed(3)})`;

  // Hull
  for (let i = 0; i < STATIONS.length - 1; i++) {
    drawFace([HULL.deckP[i],HULL.deckP[i+1],HULL.keelP[i+1],HULL.keelP[i]], hf, hs, 0.8);
    drawFace([HULL.deckS[i],HULL.deckS[i+1],HULL.keelS[i+1],HULL.keelS[i]], hfd, hs, 0.8);
    drawFace([HULL.keelP[i],HULL.keelP[i+1],HULL.keelS[i+1],HULL.keelS[i]], hfd);
  }
  drawPolyline(HULL.deckP, hs, 1); drawPolyline(HULL.deckS, hs, 1);
  drawPolyline(HULL.keelP, rs, 0.6); drawPolyline(HULL.keelS, rs, 0.6);
  for (let i = 0; i < STATIONS.length; i += 2) { drawEdge(HULL.deckP[i],HULL.keelP[i],rs,0.5); drawEdge(HULL.keelP[i],HULL.keelS[i],rs,0.5); drawEdge(HULL.keelS[i],HULL.deckS[i],rs,0.5); }
  drawFace([HULL.deckP[0],HULL.deckS[0],HULL.keelS[0],HULL.keelP[0]], hfd, hs, 1);
  // Stern castle
  drawFace([[-30,0,5],[-30,SC_HEIGHT,4],[-30,SC_HEIGHT,-4],[-30,0,-5]], scf, scs, 0.8);
  drawFace([[-30,SC_HEIGHT,4],[-18,SC_HEIGHT,5],[-10,0,9.5],[-30,0,5]], scf);
  drawFace([[-30,SC_HEIGHT,-4],[-18,SC_HEIGHT,-5],[-10,0,-9.5],[-30,0,-5]], scf);
  drawFace([[-30,SC_HEIGHT,4],[-30,SC_HEIGHT,-4],[-18,SC_HEIGHT,-5],[-18,SC_HEIGHT,5]], scf, scs, 0.6);
  // Masts
  drawEdge([MAIN_MAST_X,0,0],[MAIN_MAST_X,MAIN_MAST_H,0], ms, 1.8);
  drawEdge([MAIN_MAST_X-14,MAIN_MAST_H-10,0],[MAIN_MAST_X+14,MAIN_MAST_H-10,0], ms, 1.2);
  // Main sail
  const bl = 5*Math.sin(t*0.8)*0.5+5;
  const sailPts: V3[] = [];
  for (let i=0;i<=8;i++) { const f=i/8,y=MAIN_MAST_H-12+(12-(MAIN_MAST_H-12))*f,b=Math.sin(f*Math.PI)*bl; sailPts.push([MAIN_MAST_X-12+f*2,y,b]); }
  for (let i=8;i>=0;i--) { const f=i/8,y=MAIN_MAST_H-12+(12-(MAIN_MAST_H-12))*f,b=Math.sin(f*Math.PI)*bl; sailPts.push([MAIN_MAST_X+12-f*2,y,b]); }
  drawFace(sailPts, sf, ss, 0.7);
  // Fore mast + sail
  drawEdge([FORE_MAST_X,0,0],[FORE_MAST_X,FORE_MAST_H,0], ms, 1.4);
  const fsp: V3[] = [];
  for (let i=0;i<=6;i++) { const f=i/6,y=FORE_MAST_H-4+(10-(FORE_MAST_H-4))*f,b=Math.sin(f*Math.PI)*bl*0.6; fsp.push([FORE_MAST_X,y,b]); }
  for (let i=6;i>=0;i--) { const f=i/6,y=FORE_MAST_H-4+(10-(FORE_MAST_H-4))*f,xl=FORE_MAST_X+(FORE_MAST_X+16-FORE_MAST_X)*f,b=Math.sin(f*Math.PI)*bl*0.4; fsp.push([xl,y,b]); }
  drawFace(fsp, sf, ss, 0.6);
  // Bowsprit
  drawEdge([40,1,0],[56,5,0], ms, 1);
  // Rigging
  drawEdge([MAIN_MAST_X,MAIN_MAST_H-4,0],[-26,SC_HEIGHT,0], rg, 0.4);
  drawEdge([MAIN_MAST_X,MAIN_MAST_H-4,0],[40,1,0], rg, 0.4);
  drawEdge([FORE_MAST_X,FORE_MAST_H,0],[56,5,0], rg, 0.3);
  // Flag
  const fw = Math.sin(t*3)*2, fw2 = Math.sin(t*4.5+1);
  drawFace([[MAIN_MAST_X,MAIN_MAST_H,0],[MAIN_MAST_X+5,MAIN_MAST_H+1.5,fw],[MAIN_MAST_X+10,MAIN_MAST_H+0.5,fw+fw2],[MAIN_MAST_X+10,MAIN_MAST_H-3,fw+fw2*0.8],[MAIN_MAST_X+5,MAIN_MAST_H-2,fw*0.5],[MAIN_MAST_X,MAIN_MAST_H-4,0]], ff, ms, 0.6);
}

/* ── Rowboat ── */
function drawRowboat(ctx: CanvasRenderingContext2D, project: (wx: number, wy: number, wz: number) => { sx: number; sy: number } | null, bwx: number, bwy: number, bwz: number, t: number, a: number) {
  const p = (wx: number, wy: number, wz: number) => project(wx, wy, wz);
  const s = `rgba(20,60,160,${(0.35*a).toFixed(3)})`;
  const f = `rgba(20,60,160,${(0.04*a).toFixed(3)})`;
  // Hull
  const pts = [p(bwx-12,bwy,bwz-4), p(bwx+12,bwy,bwz-4), p(bwx+10,bwy-3,bwz-3), p(bwx-10,bwy-3,bwz-3)].filter(Boolean) as {sx:number;sy:number}[];
  if (pts.length >= 3) { ctx.beginPath(); ctx.moveTo(pts[0].sx,pts[0].sy); pts.slice(1).forEach(pp=>ctx.lineTo(pp.sx,pp.sy)); ctx.closePath(); ctx.fillStyle=f; ctx.fill(); ctx.strokeStyle=s; ctx.lineWidth=1; ctx.stroke(); }
  // Oars
  const oarAng = Math.sin(t * 3) * 0.4;
  const o1a = p(bwx + Math.cos(oarAng)*15, bwy+2, bwz-6);
  const o1b = p(bwx, bwy, bwz-4);
  if (o1a && o1b) { ctx.beginPath(); ctx.moveTo(o1a.sx,o1a.sy); ctx.lineTo(o1b.sx,o1b.sy); ctx.strokeStyle=s; ctx.lineWidth=0.8; ctx.stroke(); }
}

/* ── Stick figure (walking on land) ── */
function drawWalkingFigure(ctx: CanvasRenderingContext2D, project: (wx: number, wy: number, wz: number) => { sx: number; sy: number } | null, fwx: number, fwy: number, fwz: number, t: number, a: number, phase: number) {
  const s = `rgba(20,60,160,${(0.4*a).toFixed(3)})`;
  const legSwing = Math.sin(phase) * 0.4;
  const armSwing = Math.sin(phase + Math.PI) * 0.35;
  const bob = Math.abs(Math.sin(phase * 2)) * 2;
  const head = project(fwx, fwy + 12 + bob, fwz);
  const shoulder = project(fwx, fwy + 9 + bob, fwz);
  const hip = project(fwx, fwy + 5 + bob, fwz);
  const footL = project(fwx + Math.sin(legSwing) * 4, fwy, fwz + 1);
  const footR = project(fwx - Math.sin(legSwing) * 4, fwy, fwz - 1);
  const handL = project(fwx + Math.sin(armSwing) * 4, fwy + 7 + bob, fwz + 2);
  const handR = project(fwx - Math.sin(armSwing) * 4, fwy + 7 + bob, fwz - 2);
  ctx.strokeStyle = s; ctx.lineWidth = 1;
  if (head && shoulder) { const r = Math.max(1.5, Math.abs(head.sy - shoulder.sy) * 0.4); ctx.beginPath(); ctx.arc(head.sx, head.sy, r, 0, Math.PI*2); ctx.fillStyle = `rgba(20,60,160,${(0.25*a).toFixed(3)})`; ctx.fill(); }
  if (shoulder && hip) { ctx.beginPath(); ctx.moveTo(shoulder.sx,shoulder.sy); ctx.lineTo(hip.sx,hip.sy); ctx.stroke(); }
  if (hip && footL) { ctx.beginPath(); ctx.moveTo(hip.sx,hip.sy); ctx.lineTo(footL.sx,footL.sy); ctx.stroke(); }
  if (hip && footR) { ctx.beginPath(); ctx.moveTo(hip.sx,hip.sy); ctx.lineTo(footR.sx,footR.sy); ctx.stroke(); }
  if (shoulder && handL) { ctx.beginPath(); ctx.moveTo(shoulder.sx,shoulder.sy); ctx.lineTo(handL.sx,handL.sy); ctx.stroke(); }
  if (shoulder && handR) { ctx.beginPath(); ctx.moveTo(shoulder.sx,shoulder.sy); ctx.lineTo(handR.sx,handR.sy); ctx.stroke(); }
}

/* ── Palm tree ── */
function drawPalmTree(ctx: CanvasRenderingContext2D, project: (wx: number, wy: number, wz: number) => { sx: number; sy: number } | null, tx: number, ty: number, tz: number, height: number, lean: number, t: number) {
  const s = `rgba(20,60,160,0.2)`;
  const base = project(tx, ty, tz);
  const top = project(tx + lean * 0.3, ty + height, tz);
  if (base && top) { ctx.beginPath(); ctx.moveTo(base.sx, base.sy); ctx.quadraticCurveTo(base.sx + (top.sx-base.sx)*0.5 + lean*0.5, base.sy + (top.sy-base.sy)*0.4, top.sx, top.sy); ctx.strokeStyle = s; ctx.lineWidth = 2; ctx.stroke(); }
  // Fronds
  if (top) {
    ctx.strokeStyle = `rgba(20,60,160,0.15)`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + Math.sin(t * 0.5 + i) * 0.1;
      const fx = top.sx + Math.cos(ang) * 30;
      const fy = top.sy + Math.sin(ang) * 15 + 8;
      ctx.beginPath(); ctx.moveTo(top.sx, top.sy); ctx.quadraticCurveTo(top.sx + (fx-top.sx)*0.5, top.sy - 10, fx, fy); ctx.stroke();
    }
  }
}

/* ── Main scene component ── */
export default function ContactOceanScene({ camHeight, horizonPct, fieldOfView }: { camHeight?: number; horizonPct?: number; fieldOfView?: number } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const startRef = useRef(0);
  const logoRef = useRef<HTMLImageElement | null>(null);

  // Load logo image once
  useEffect(() => {
    const img = new Image();
    img.src = "/logobueno.png";
    img.onload = () => { logoRef.current = img; };
  }, []);
  const boatRef = useRef<BoatPhysics>({ wx: -900, wz: 700, vx: 0, vz: 0, wy: 0, pitch: 0, roll: 0, heading: 0 });
  const phaseRef = useRef<"sailing"|"anchored"|"rowboats"|"walking"|"planting"|"done">("sailing");
  const phaseStartRef = useRef(0);

  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = cvs.clientWidth, H = cvs.clientHeight;
    if (cvs.width !== W*dpr || cvs.height !== H*dpr) { cvs.width = W*dpr; cvs.height = H*dpr; ctx.scale(dpr,dpr); }
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = "#F9F9F9";
    ctx.fillRect(0,0,W,H);

    const t = performance.now() * 0.001;
    if (startRef.current === 0) startRef.current = t;
    const drift = t * 40, driftZ = t * 12;

    // Camera
    const fov = fieldOfView ?? 600, horizonY = H * (horizonPct ?? 0.24) + 100, camH = camHeight ?? 500;
    // Island: center and radius
    const ISLAND_CX = 700, ISLAND_CZ = 700, ISLAND_R = 500;

    const project = (wx: number, wy: number, wz: number): { sx: number; sy: number } | null => {
      if (wz <= 1) return null;
      return { sx: (wx * fov) / wz + W / 2, sy: ((-wy + camH) * fov) / wz + horizonY };
    };

    const getH = (wx: number, wz: number) => getShoreHeight(wx, wz, t, drift, driftZ, ISLAND_CX, ISLAND_CZ, ISLAND_R);
    const getIL = (wx: number, wz: number) => getInland(wx, wz, ISLAND_CX, ISLAND_CZ, ISLAND_R);

    // ── Draw ocean + land mesh ──
    const COLS = 280, ROWS = 90, CELL = 24;
    const grid: ({sx:number;sy:number}|null)[][] = [];
    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        const wx = (c - COLS/2) * CELL;
        const wz = (r + 2) * CELL;
        const wy = getH(wx, wz);
        grid[r][c] = project(wx, wy, wz);
      }
    }

    const rgb = "20,60,160";
    const landRgb = "90,65,30"; // warmer, more visible brown
    const beachRgb = "140,120,70"; // sandy yellow-brown for beach
    // Shore edge X for the facing side of the island (closest point to camera-left)
    const SHORE_EDGE = ISLAND_CX - ISLAND_R * 1.3; // actual ellipse edge at center z

    // Horizontal lines — style based on curved inland distance
    for (let r = 0; r < ROWS; r++) {
      const depthT = r / ROWS;
      ctx.beginPath(); let started = false;
      for (let c = 0; c < COLS; c++) {
        const p = grid[r][c]; if (!p) continue;
        const wx = (c - COLS/2) * CELL, wz = (r+2) * CELL;
        const il = getIL(wx, wz);
        const isBeach = il > 0 && il < ISLAND_R * 0.08;
        const isForest = il >= ISLAND_R * 0.08 && il < ISLAND_R * 0.5;
        const isPeak = il >= ISLAND_R * 0.5;
        const isLand = il > 0;

        let alpha: number, color: string;
        if (isPeak) { alpha = 0.18 + depthT * 0.15; color = `rgba(50,80,50,${alpha.toFixed(3)})`; }
        else if (isForest) { alpha = 0.14 + depthT * 0.12; color = `rgba(50,75,35,${alpha.toFixed(3)})`; }
        else if (isBeach) { alpha = 0.15 + depthT * 0.1; color = `rgba(${beachRgb},${alpha.toFixed(3)})`; }
        else { alpha = 0.06 + depthT * 0.18; color = `rgba(${rgb},${alpha.toFixed(3)})`; }
        ctx.strokeStyle = color;
        ctx.lineWidth = isLand ? 0.6 + depthT * 0.8 : 0.6 + depthT * 1.0;
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();
    }

    // Vertical lines
    for (let c = 0; c < COLS; c += 2) {
      ctx.beginPath(); let started = false;
      for (let r = 0; r < ROWS; r++) {
        const p = grid[r][c]; if (!p) continue;
        const wx = (c - COLS/2) * CELL, wz = (r+2) * CELL;
        const il = getIL(wx, wz);
        const isLand = il > 0;
        const depthT = r / ROWS;
        const alpha = isLand ? 0.06 + depthT * 0.1 : 0.03 + depthT * 0.1;
        ctx.strokeStyle = isLand ? `rgba(${landRgb},${alpha.toFixed(3)})` : `rgba(${rgb},${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.4 + depthT * 0.5;
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();
    }


    // ── Trees — many, scattered across island ──
    const treePositions = [
      // Beach palms
      { x: ISLAND_CX - 280, z: ISLAND_CZ - 100, h: 45, lean: -10 },
      { x: ISLAND_CX - 250, z: ISLAND_CZ + 80, h: 50, lean: 8 },
      { x: ISLAND_CX - 300, z: ISLAND_CZ + 200, h: 42, lean: -12 },
      { x: ISLAND_CX - 260, z: ISLAND_CZ - 200, h: 48, lean: 6 },
      { x: ISLAND_CX - 220, z: ISLAND_CZ, h: 52, lean: -8 },
      // Mid-island forest
      { x: ISLAND_CX - 100, z: ISLAND_CZ - 150, h: 60, lean: -5 },
      { x: ISLAND_CX - 50, z: ISLAND_CZ + 50, h: 65, lean: 4 },
      { x: ISLAND_CX, z: ISLAND_CZ - 80, h: 58, lean: -8 },
      { x: ISLAND_CX - 80, z: ISLAND_CZ + 180, h: 55, lean: 7 },
      { x: ISLAND_CX + 50, z: ISLAND_CZ + 100, h: 62, lean: -3 },
      { x: ISLAND_CX - 30, z: ISLAND_CZ - 250, h: 50, lean: 10 },
      { x: ISLAND_CX + 100, z: ISLAND_CZ - 50, h: 55, lean: -6 },
      // Deep interior
      { x: ISLAND_CX + 150, z: ISLAND_CZ, h: 68, lean: -4 },
      { x: ISLAND_CX + 100, z: ISLAND_CZ + 150, h: 60, lean: 5 },
      { x: ISLAND_CX + 200, z: ISLAND_CZ - 100, h: 55, lean: -8 },
      { x: ISLAND_CX, z: ISLAND_CZ + 250, h: 50, lean: 10 },
      { x: ISLAND_CX + 50, z: ISLAND_CZ - 200, h: 58, lean: -5 },
      { x: ISLAND_CX + 250, z: ISLAND_CZ + 50, h: 50, lean: 6 },
    ];
    for (const tp of treePositions) {
      if (getIL(tp.x, tp.z) > 30) { // only draw trees clearly on land
        drawPalmTree(ctx, project, tp.x, getH(tp.x, tp.z), tp.z, tp.h, tp.lean, t);
      }
    }

    // ── Ship physics ──
    const boat = boatRef.current;
    const phase = phaseRef.current;
    // Ship anchors just offshore (SHORE_EDGE - 80)
    const anchorX = SHORE_EDGE - 80;

    if (phase === "sailing") {
      boat.vx += 30 * 0.016;
      if (boat.wx > anchorX - 200) boat.vx *= 0.99;
      boat.vx *= 0.995;
      boat.wx += boat.vx * 0.016;
      if (boat.wx > anchorX) { phaseRef.current = "anchored"; phaseStartRef.current = t; boat.vx = 0; }
    }

    // Buoyancy
    const sd = 40;
    const h0 = getH(boat.wx, boat.wz), hF = getH(boat.wx+sd,boat.wz), hB = getH(boat.wx-sd,boat.wz);
    const hL = getH(boat.wx,boat.wz-sd), hR2 = getH(boat.wx,boat.wz+sd);
    boat.wy += ((h0+hF+hB+hL+hR2)/5+5-boat.wy)*0.08;
    boat.pitch += (Math.atan2(hF-hB,sd*2)*0.8-boat.pitch)*0.08;
    boat.roll += (Math.atan2(hL-hR2,sd*2)*0.6-boat.roll)*0.08;
    const targetH2 = boat.vx > 1 ? Math.atan2(boat.vz,boat.vx) : 0;
    let hDiff = targetH2 - boat.heading;
    while (hDiff > Math.PI) hDiff -= 2*Math.PI;
    while (hDiff < -Math.PI) hDiff += 2*Math.PI;
    boat.heading += hDiff * 0.016 * 0.5;

    drawBoat3D(ctx, project, boat, t, 1);

    // ── Narrative phases ──
    const pt = phaseStartRef.current;
    // Beach landing point on island
    const beachX = SHORE_EDGE + 40, beachZ = ISLAND_CZ;
    // Flag position — further inland
    const flagX = ISLAND_CX - 150, flagZ = ISLAND_CZ;

    if (phase === "anchored" && t - pt > 2) { phaseRef.current = "rowboats"; phaseStartRef.current = t; }

    // Rowboats
    if (phase === "rowboats" || phase === "walking" || phase === "planting" || phase === "done") {
      const rbElapsed = phase === "rowboats" ? t - pt : 4;
      const rbProgress = Math.min(1, rbElapsed / 4);
      for (let i = 0; i < 2; i++) {
        const prog = Math.min(1, Math.max(0, rbProgress - i * 0.2));
        const rbx = boat.wx + (beachX - boat.wx) * prog;
        const rbz = boat.wz + (beachZ + (i === 0 ? -30 : 30) - boat.wz) * prog;
        const rby = getH(rbx, rbz);
        drawRowboat(ctx, project, rbx, rby, rbz, t, Math.min(1, prog * 3));
      }
      if (phase === "rowboats" && rbProgress >= 1) { phaseRef.current = "walking"; phaseStartRef.current = t; }
    }

    // Walking figures
    if (phase === "walking" || phase === "planting" || phase === "done") {
      const wElapsed = phase === "walking" ? t - pt : 3;
      const wProgress = Math.min(1, wElapsed / 3);
      for (let i = 0; i < 4; i++) {
        const fp = Math.min(1, Math.max(0, wProgress - i * 0.12));
        if (fp <= 0) continue;
        const fwx = beachX + (flagX - beachX) * fp;
        const fwz = beachZ + (i - 1.5) * 30;
        const fwy = getH(fwx, fwz);
        drawWalkingFigure(ctx, project, fwx, fwy, fwz, t, Math.min(1, fp*2), t * 4 + i * 2);
      }
      if (phase === "walking" && wProgress >= 1) { phaseRef.current = "planting"; phaseStartRef.current = t; }
    }

    // Flag planting — LARGE flag with Columbus logo
    if (phase === "planting" || phase === "done") {
      const flagElapsed = phase === "planting" ? t - pt : 2;
      const flagProgress = Math.min(1, flagElapsed / 1.5);
      const flagBaseY = getH(flagX, flagZ);
      const poleH = 80; // tall flag pole
      const poleTop = project(flagX, flagBaseY + poleH * flagProgress, flagZ);
      const poleBot = project(flagX, flagBaseY, flagZ);
      if (poleTop && poleBot) {
        // Pole
        ctx.strokeStyle = `rgba(${rgb},0.4)`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(poleBot.sx, poleBot.sy); ctx.lineTo(poleTop.sx, poleTop.sy); ctx.stroke();

        if (flagProgress > 0.3) {
          const clothA = Math.min(1, (flagProgress - 0.3) / 0.5);
          const wave = Math.sin(t * 3) * 3;
          const wave2 = Math.sin(t * 4.5 + 1) * 1.5;
          const flagW = 50, flagH2 = 30; // large flag
          // Flag cloth corners
          const ftl = poleTop; // top-left = pole top
          const ftr = project(flagX + flagW, flagBaseY + poleH * flagProgress - 3 + wave, flagZ);
          const fbr = project(flagX + flagW - 3, flagBaseY + poleH * flagProgress - flagH2 + wave + wave2, flagZ);
          const fbl = project(flagX, flagBaseY + poleH * flagProgress - flagH2, flagZ);
          if (ftr && fbr && fbl) {
            // Dark blue background
            ctx.fillStyle = `rgba(10,19,68,${(0.85 * clothA).toFixed(2)})`;
            ctx.strokeStyle = `rgba(10,19,68,${(0.6 * clothA).toFixed(2)})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(ftl.sx, ftl.sy);
            ctx.quadraticCurveTo(ftl.sx + (ftr.sx - ftl.sx) * 0.5, ftl.sy + wave * 0.3, ftr.sx, ftr.sy);
            ctx.lineTo(fbr.sx, fbr.sy);
            ctx.quadraticCurveTo(fbl.sx + (fbr.sx - fbl.sx) * 0.5, fbl.sy + wave2 * 0.3, fbl.sx, fbl.sy);
            ctx.closePath(); ctx.fill(); ctx.stroke();

            // Columbus logo on flag
            const logoCx = (ftl.sx + ftr.sx + fbr.sx + fbl.sx) / 4;
            const logoCy = (ftl.sy + ftr.sy + fbr.sy + fbl.sy) / 4 + wave * 0.2;
            const logoSize = Math.abs(ftr.sx - ftl.sx) * 0.45;
            if (logoSize > 5 && logoRef.current) {
              ctx.save();
              ctx.globalAlpha = clothA * 0.9;
              // Invert logo to white using filters
              ctx.filter = "brightness(0) invert(1)";
              ctx.drawImage(logoRef.current, logoCx - logoSize / 2, logoCy - logoSize / 2, logoSize, logoSize);
              ctx.filter = "none";
              ctx.restore();
            }
          }
        }
      }
      if (phase === "planting" && flagProgress >= 1) phaseRef.current = "done";
    }

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} aria-hidden />;
}
