"use client";

import { useEffect, useRef, useCallback } from "react";

type V3 = [number, number, number];
function rotY(p: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return [p[0]*c - p[2]*s, p[1], p[0]*s + p[2]*c]; }
function rotX(p: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1]*c - p[2]*s, p[1]*s + p[2]*c]; }
function rotZ(p: V3, a: number): V3 { const c = Math.cos(a), s = Math.sin(a); return [p[0]*c - p[1]*s, p[0]*s + p[1]*c, p[2]]; }
function xformVert(local: V3, roll: number, pitch: number, heading: number, scale: number, ox: number, oy: number, oz: number): V3 {
  let p = rotX(local, roll); p = rotZ(p, pitch); p = rotY(p, heading);
  return [p[0]*scale + ox, p[1]*scale + oy, p[2]*scale + oz];
}

const STATIONS: [number,number,number][] = [[-30,5,4.5],[-20,7,5.5],[-10,9.5,7],[0,11,7.5],[10,10,6.5],[20,8,5],[30,5,3],[38,2,1],[44,0,0]];
function buildHullVerts() {
  const deckP: V3[] = [], deckS: V3[] = [], keelP: V3[] = [], keelS: V3[] = [];
  for (const [x, hw, kd] of STATIONS) { deckP.push([x,0,hw]); deckS.push([x,0,-hw]); keelP.push([x,-kd,hw*0.6]); keelS.push([x,-kd,-hw*0.6]); }
  return { deckP, deckS, keelP, keelS };
}
const HULL = buildHullVerts();
const SC_HEIGHT = 10;
const MAIN_MAST_X = -2, MAIN_MAST_H = 48, FORE_MAST_X = 22, FORE_MAST_H = 38;
const MODEL_SCALE = 3.5;

interface BoatPhysics { wx: number; wz: number; vx: number; vz: number; wy: number; pitch: number; roll: number; heading: number; }

function drawBoat3D(ctx: CanvasRenderingContext2D, project: (wx: number, wy: number, wz: number) => { sx: number; sy: number } | null, phys: BoatPhysics, t: number, a: number) {
  const { roll, pitch, heading, wx, wy, wz } = phys;
  const sc = MODEL_SCALE;
  const xf = (local: V3): { sx: number; sy: number } | null => { const w = xformVert(local, roll, pitch, heading, sc, wx, wy, wz); return project(w[0], w[1], w[2]); };
  const drawEdge = (from: V3, to: V3, color: string, lw: number) => { const a2 = xf(from), b = xf(to); if (!a2 || !b) return; ctx.beginPath(); ctx.moveTo(a2.sx, a2.sy); ctx.lineTo(b.sx, b.sy); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke(); };
  const drawFace = (pts: V3[], fillColor: string, strokeColor?: string, lw = 0.8) => { const projected = pts.map(xf); const valid = projected.filter(Boolean) as { sx: number; sy: number }[]; if (valid.length < 3) return; ctx.beginPath(); ctx.moveTo(valid[0].sx, valid[0].sy); for (let i = 1; i < valid.length; i++) ctx.lineTo(valid[i].sx, valid[i].sy); ctx.closePath(); ctx.fillStyle = fillColor; ctx.fill(); if (strokeColor) { ctx.strokeStyle = strokeColor; ctx.lineWidth = lw; ctx.stroke(); } };
  const drawPolyline = (pts: V3[], color: string, lw: number) => { const projected = pts.map(xf); ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = lw; let started = false; for (const p of projected) { if (!p) continue; if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy); } ctx.stroke(); };
  const hs = `rgba(37,99,235,${(0.5*a).toFixed(3)})`, hf = `rgba(37,99,235,${(0.06*a).toFixed(3)})`, hfd = `rgba(37,99,235,${(0.1*a).toFixed(3)})`;
  const rs = `rgba(37,99,235,${(0.25*a).toFixed(3)})`, ms = `rgba(37,99,235,${(0.45*a).toFixed(3)})`;
  const sf = `rgba(37,99,235,${(0.05*a).toFixed(3)})`, ss = `rgba(37,99,235,${(0.25*a).toFixed(3)})`;
  const rg = `rgba(37,99,235,${(0.15*a).toFixed(3)})`, ff = `rgba(37,99,235,${(0.3*a).toFixed(3)})`;
  const scs = `rgba(37,99,235,${(0.4*a).toFixed(3)})`, scf = `rgba(37,99,235,${(0.08*a).toFixed(3)})`;
  for (let i = 0; i < STATIONS.length - 1; i++) { drawFace([HULL.deckP[i],HULL.deckP[i+1],HULL.keelP[i+1],HULL.keelP[i]], hf, hs, 0.8); drawFace([HULL.deckS[i],HULL.deckS[i+1],HULL.keelS[i+1],HULL.keelS[i]], hfd, hs, 0.8); drawFace([HULL.keelP[i],HULL.keelP[i+1],HULL.keelS[i+1],HULL.keelS[i]], hfd); }
  drawPolyline(HULL.deckP, hs, 1); drawPolyline(HULL.deckS, hs, 1);
  drawPolyline(HULL.keelP, rs, 0.6); drawPolyline(HULL.keelS, rs, 0.6);
  for (let i = 0; i < STATIONS.length; i += 2) { drawEdge(HULL.deckP[i],HULL.keelP[i],rs,0.5); drawEdge(HULL.keelP[i],HULL.keelS[i],rs,0.5); drawEdge(HULL.keelS[i],HULL.deckS[i],rs,0.5); }
  drawFace([HULL.deckP[0],HULL.deckS[0],HULL.keelS[0],HULL.keelP[0]], hfd, hs, 1);
  drawFace([[-30,0,5],[-30,SC_HEIGHT,4],[-30,SC_HEIGHT,-4],[-30,0,-5]], scf, scs, 0.8);
  drawFace([[-30,SC_HEIGHT,4],[-18,SC_HEIGHT,5],[-10,0,9.5],[-30,0,5]], scf);
  drawFace([[-30,SC_HEIGHT,-4],[-18,SC_HEIGHT,-5],[-10,0,-9.5],[-30,0,-5]], scf);
  drawFace([[-30,SC_HEIGHT,4],[-30,SC_HEIGHT,-4],[-18,SC_HEIGHT,-5],[-18,SC_HEIGHT,5]], scf, scs, 0.6);
  drawEdge([MAIN_MAST_X,0,0],[MAIN_MAST_X,MAIN_MAST_H,0], ms, 1.8);
  drawEdge([MAIN_MAST_X-14,MAIN_MAST_H-10,0],[MAIN_MAST_X+14,MAIN_MAST_H-10,0], ms, 1.2);
  const bl = 5*Math.sin(t*0.8)*0.5+5;
  const sailPts: V3[] = []; for (let i=0;i<=8;i++) { const f=i/8,y=MAIN_MAST_H-12+(12-(MAIN_MAST_H-12))*f,b=Math.sin(f*Math.PI)*bl; sailPts.push([MAIN_MAST_X-12+f*2,y,b]); } for (let i=8;i>=0;i--) { const f=i/8,y=MAIN_MAST_H-12+(12-(MAIN_MAST_H-12))*f,b=Math.sin(f*Math.PI)*bl; sailPts.push([MAIN_MAST_X+12-f*2,y,b]); }
  drawFace(sailPts, sf, ss, 0.7);
  drawEdge([FORE_MAST_X,0,0],[FORE_MAST_X,FORE_MAST_H,0], ms, 1.4);
  const fsp: V3[] = []; for (let i=0;i<=6;i++) { const f=i/6,y=FORE_MAST_H-4+(10-(FORE_MAST_H-4))*f,b=Math.sin(f*Math.PI)*bl*0.6; fsp.push([FORE_MAST_X,y,b]); } for (let i=6;i>=0;i--) { const f=i/6,y=FORE_MAST_H-4+(10-(FORE_MAST_H-4))*f,xl=FORE_MAST_X+(FORE_MAST_X+16-FORE_MAST_X)*f,b=Math.sin(f*Math.PI)*bl*0.4; fsp.push([xl,y,b]); }
  drawFace(fsp, sf, ss, 0.6);
  drawEdge([40,1,0],[56,5,0], ms, 1);
  drawEdge([MAIN_MAST_X,MAIN_MAST_H-4,0],[-26,SC_HEIGHT,0], rg, 0.4);
  drawEdge([MAIN_MAST_X,MAIN_MAST_H-4,0],[40,1,0], rg, 0.4);
  drawEdge([FORE_MAST_X,FORE_MAST_H,0],[56,5,0], rg, 0.3);
  const fw = Math.sin(t*3)*2, fw2 = Math.sin(t*4.5+1);
  drawFace([[MAIN_MAST_X,MAIN_MAST_H,0],[MAIN_MAST_X+5,MAIN_MAST_H+1.5,fw],[MAIN_MAST_X+10,MAIN_MAST_H+0.5,fw+fw2],[MAIN_MAST_X+10,MAIN_MAST_H-3,fw+fw2*0.8],[MAIN_MAST_X+5,MAIN_MAST_H-2,fw*0.5],[MAIN_MAST_X,MAIN_MAST_H-4,0]], ff, ms, 0.6);
}

/* ── Rowboat ── */
function drawRowboat(ctx: CanvasRenderingContext2D, project: (wx: number, wy: number, wz: number) => { sx: number; sy: number } | null, bwx: number, bwy: number, bwz: number, a: number) {
  const p = (wx: number, wy: number, wz: number) => project(wx, wy, wz);
  const s = `rgba(37,99,235,${(0.35*a).toFixed(3)})`;
  const f = `rgba(37,99,235,${(0.04*a).toFixed(3)})`;
  const pts = [p(bwx-12,bwy,bwz-4), p(bwx+12,bwy,bwz-4), p(bwx+10,bwy-3,bwz-3), p(bwx-10,bwy-3,bwz-3)].filter(Boolean) as {sx:number;sy:number}[];
  if (pts.length >= 3) { ctx.beginPath(); ctx.moveTo(pts[0].sx,pts[0].sy); pts.slice(1).forEach(pp=>ctx.lineTo(pp.sx,pp.sy)); ctx.closePath(); ctx.fillStyle=f; ctx.fill(); ctx.strokeStyle=s; ctx.lineWidth=1; ctx.stroke(); }
}

/* ── Island height field — large landmass covering right ~70% of grid ── */
// Shore runs roughly vertically around column 25% from left.
// Land rises to the right with contour lines.
const ISLAND_SHORE_COL = 0.22; // fraction of gridCols where shore is (left side = ocean)
const PEAK_H = 90;
const NUM_CONTOURS = 20;

function getIslandH(wx: number, wz: number, shoreWx: number): number {
  if (wx < shoreWx) return 0; // ocean
  const inland = wx - shoreWx;
  // Organic shore wobble based on z
  const shoreNoise = Math.sin(wz * 0.008) * 60 + Math.sin(wz * 0.015 + 1.2) * 35 + Math.sin(wz * 0.003 - 0.5) * 80;
  const effectiveInland = inland - shoreNoise;
  if (effectiveInland <= 0) return 0;

  // easeInOutCubic elevation profile
  const maxInland = 1800;
  const t = Math.min(1, effectiveInland / maxInland);
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Terrain roughness
  const noise = Math.sin(wx * 0.005 + wz * 0.004) * 3 +
    Math.sin(wz * 0.01 + wx * 0.003) * 2 +
    Math.sin(wx * 0.015 - wz * 0.008) * 1.5;

  return ease * PEAK_H + noise * t;
}

export default function MissionWaveMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const logoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/logobueno.png";
    img.onload = () => { logoRef.current = img; };
  }, []);

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

    const fov = 700;
    const horizonY = H * 0.38;
    const cameraHeight = 180;
    const cellSize = 28;
    const gridCols = 100;
    const gridRows = 70;

    const project = (wx: number, wy: number, wz: number): { sx: number; sy: number } | null => {
      if (wz <= 1) return null;
      return { sx: (wx * fov) / wz + W / 2, sy: ((-wy + cameraHeight) * fov) / wz + horizonY };
    };

    const drift = t * 40, driftZ = t * 12;
    const shoreWx = (ISLAND_SHORE_COL * gridCols - gridCols / 2) * cellSize;

    // ── Build grid — pure waves on ocean, static elevation on land ──
    const grid: ({ sx: number; sy: number; wy: number; isLand: boolean } | null)[][] = [];
    for (let r = 0; r < gridRows; r++) {
      grid[r] = [];
      for (let c = 0; c < gridCols; c++) {
        const wx = (c - gridCols / 2) * cellSize;
        const wz = (r + 2) * cellSize;

        const landH = getIslandH(wx, wz, shoreWx);
        let wy: number;
        let isLand = false;

        if (landH > 0) {
          wy = landH;
          isLand = true;
        } else {
          const swx = wx + drift, swz = wz + driftZ;
          wy = Math.sin(swx * 0.006 + t * 1.2) * Math.cos(swz * 0.008 + t * 0.7) * 14 +
            Math.sin(swx * 0.01 - t * 0.8 + 1.5) * Math.cos(swz * 0.012 + t * 0.45) * 8 +
            Math.sin((swx + swz) * 0.004 + t * 0.9) * 6 +
            Math.sin(swx * 0.02 + t * 2.0) * Math.cos(swz * 0.018 + t * 1.1) * 3;

          // Dampen near shore
          const distToShore = shoreWx - wx + Math.sin(wz * 0.008) * 60 + Math.sin(wz * 0.015 + 1.2) * 35 + Math.sin(wz * 0.003 - 0.5) * 80;
          if (distToShore > 0 && distToShore < 150) {
            wy *= distToShore / 150;
          }
        }

        const p = project(wx, wy, wz);
        grid[r][c] = p ? { sx: p.sx, sy: p.sy, wy, isLand } : null;
      }
    }

    const rgb = "37,99,235"; // blue — matches homepage mesh

    // ── Full mesh — ocean AND land drawn together ──
    // Depth lines (along Z)
    for (let c = 0; c < gridCols; c++) {
      ctx.beginPath(); let started = false;
      for (let r = gridRows - 1; r >= 0; r--) {
        const p = grid[r][c];
        if (!p) continue;
        const depthT = r / gridRows;
        const landFade = p.isLand ? 0.6 : 1; // land lines slightly fainter
        ctx.strokeStyle = `rgba(${rgb},${((0.04 + depthT * 0.14) * landFade).toFixed(3)})`;
        ctx.lineWidth = (0.4 + depthT * 0.5) * landFade;
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();
    }
    // Cross lines (along X)
    for (let r = 0; r < gridRows; r++) {
      const depthT = r / gridRows;
      ctx.beginPath(); let started = false;
      for (let c = 0; c < gridCols; c++) {
        const p = grid[r][c];
        if (!p) continue;
        const landFade = p.isLand ? 0.6 : 1;
        ctx.strokeStyle = `rgba(${rgb},${((0.04 + depthT * 0.16) * landFade).toFixed(3)})`;
        ctx.lineWidth = (0.4 + depthT * 0.6) * landFade;
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();
    }

    // ── Contour lines — scan each column (Z-direction) for elevation crossings ──
    // This produces smooth continuous lines that follow the terrain naturally
    const contourStep = PEAK_H / NUM_CONTOURS;
    for (let level = 1; level <= NUM_CONTOURS; level++) {
      const targetH = level * contourStep;
      const isIndex = level % 4 === 0;
      const lineAlpha = isIndex ? 0.25 : 0.12;
      const lineWidth = isIndex ? 1.3 : 0.7;

      // Collect crossing points across the whole grid, one line per row
      ctx.strokeStyle = `rgba(${rgb},${lineAlpha.toFixed(3)})`;
      ctx.lineWidth = lineWidth;

      // Scan by row — find the column where height crosses targetH
      ctx.beginPath();
      let started = false;
      for (let r = 0; r < gridRows; r++) {
        const wz = (r + 2) * cellSize;
        // Find the crossing point along this row
        let crossX: number | null = null;
        for (let c = 1; c < gridCols; c++) {
          const wx = (c - gridCols / 2) * cellSize;
          const wxPrev = ((c - 1) - gridCols / 2) * cellSize;
          const h = getIslandH(wx, wz, shoreWx);
          const hPrev = getIslandH(wxPrev, wz, shoreWx);
          if ((h >= targetH && hPrev < targetH) || (h < targetH && hPrev >= targetH)) {
            const frac = Math.abs(targetH - hPrev) / Math.abs(h - hPrev);
            crossX = wxPrev + frac * cellSize;
            break; // take first crossing (the contour line from the left)
          }
        }
        if (crossX !== null) {
          const p = project(crossX, targetH, wz);
          if (p) {
            if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
          }
        } else {
          started = false; // gap in contour
        }
      }
      ctx.stroke();
    }

    // ── Boat (anchored at shore) — proper 3D model ──
    const boatWx = shoreWx - 20;
    const boatWz = gridRows * cellSize * 0.45;
    const bswx = boatWx + drift, bswz = boatWz + driftZ;
    const boatWy = Math.sin(bswx * 0.006 + t * 1.2) * Math.cos(bswz * 0.008 + t * 0.7) * 8 +
      Math.sin(bswx * 0.01 - t * 0.8) * 4;
    const boatPitch = Math.sin(t * 0.9) * 0.03;
    const boatRoll = Math.sin(t * 0.7 + 0.5) * 0.04;

    drawBoat3D(ctx, project, {
      wx: boatWx, wz: boatWz, wy: boatWy, vx: 0, vz: 0,
      pitch: boatPitch, roll: boatRoll, heading: 0,
    }, t, 1);

    // ── Rowboats beached at shore ──
    const beachWx = shoreWx + 200;
    drawRowboat(ctx, project, beachWx, getIslandH(beachWx, boatWz - 80, shoreWx) + 1, boatWz - 80, 1);
    drawRowboat(ctx, project, beachWx + 10, getIslandH(beachWx + 10, boatWz + 80, shoreWx) + 1, boatWz + 80, 1);

    // ── People on land (4 figures near the flag) ──
    const flagWx = shoreWx + 350;
    const flagWz = boatWz;
    const flagWy = getIslandH(flagWx, flagWz, shoreWx);

    for (let i = 0; i < 4; i++) {
      const fwx = flagWx - 40 - i * 25;
      const fwz = flagWz + (i - 1.5) * 25;
      const fwy = getIslandH(fwx, fwz, shoreWx);
      const s = `rgba(${rgb},0.3)`;

      const head = project(fwx, fwy + 12, fwz);
      const shoulder = project(fwx, fwy + 9, fwz);
      const hip = project(fwx, fwy + 5, fwz);
      const footL = project(fwx + 3, fwy, fwz + 1);
      const footR = project(fwx - 3, fwy, fwz - 1);

      ctx.strokeStyle = s; ctx.lineWidth = 1;
      if (head && shoulder) {
        const r = Math.max(1.5, Math.abs(head.sy - shoulder.sy) * 0.4);
        ctx.beginPath(); ctx.arc(head.sx, head.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},0.2)`; ctx.fill();
      }
      if (shoulder && hip) { ctx.beginPath(); ctx.moveTo(shoulder.sx, shoulder.sy); ctx.lineTo(hip.sx, hip.sy); ctx.stroke(); }
      if (hip && footL) { ctx.beginPath(); ctx.moveTo(hip.sx, hip.sy); ctx.lineTo(footL.sx, footL.sy); ctx.stroke(); }
      if (hip && footR) { ctx.beginPath(); ctx.moveTo(hip.sx, hip.sy); ctx.lineTo(footR.sx, footR.sy); ctx.stroke(); }
    }

    // ── Flag (already planted) ──
    const poleH = 50;
    const poleBot = project(flagWx, flagWy, flagWz);
    const poleTop = project(flagWx, flagWy + poleH, flagWz);
    if (poleBot && poleTop) {
      ctx.strokeStyle = `rgba(${rgb},0.35)`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(poleBot.sx, poleBot.sy); ctx.lineTo(poleTop.sx, poleTop.sy); ctx.stroke();

      // Flag cloth
      const wave = Math.sin(t * 3) * 2;
      const flagW = 35, flagH2 = 22;
      const ftl = poleTop;
      const ftr = project(flagWx + flagW, flagWy + poleH - 2 + wave, flagWz);
      const fbr = project(flagWx + flagW - 2, flagWy + poleH - flagH2 + wave, flagWz);
      const fbl = project(flagWx, flagWy + poleH - flagH2, flagWz);
      if (ftr && fbr && fbl) {
        ctx.fillStyle = "rgba(10,19,68,0.85)";
        ctx.strokeStyle = "rgba(10,19,68,0.6)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ftl.sx, ftl.sy);
        ctx.quadraticCurveTo(ftl.sx + (ftr.sx - ftl.sx) * 0.5, ftl.sy + wave * 0.3, ftr.sx, ftr.sy);
        ctx.lineTo(fbr.sx, fbr.sy);
        ctx.quadraticCurveTo(fbl.sx + (fbr.sx - fbl.sx) * 0.5, fbl.sy + wave * 0.3, fbl.sx, fbl.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Logo on flag
        const logoCx = (ftl.sx + ftr.sx + fbr.sx + fbl.sx) / 4;
        const logoCy = (ftl.sy + ftr.sy + fbr.sy + fbl.sy) / 4 + wave * 0.2;
        const logoSize = Math.abs(ftr.sx - ftl.sx) * 0.45;
        if (logoSize > 4 && logoRef.current) {
          ctx.save();
          ctx.globalAlpha = 0.9;
          ctx.filter = "brightness(0) invert(1)";
          ctx.drawImage(logoRef.current, logoCx - logoSize / 2, logoCy - logoSize / 2, logoSize, logoSize);
          ctx.filter = "none";
          ctx.restore();
        }
      }
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
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.65 }}
      aria-hidden
    />
  );
}
