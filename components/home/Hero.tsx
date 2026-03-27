"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Container } from "@/components/layout/Container";

/* ── Madrid locations (world-space positions on the mesh grid) ── */
const MADRID_LOCATIONS = [
  // ─ Near field (wz 150–350) — visible wx ≈ ±400 ─
  { name: "Plaza de Castilla", wx: 96, wz: 168 },
  { name: "Cuatro Torres", wx: -168, wz: 150 },
  { name: "Torres KIO", wx: 288, wz: 180 },
  { name: "Chamartín Station", wx: -48, wz: 192 },
  { name: "Santiago Bernabéu", wx: 168, wz: 216 },
  { name: "Tetuán", wx: -240, wz: 200 },
  { name: "Nuevos Ministerios", wx: 48, wz: 240 },
  { name: "Chamberí", wx: -144, wz: 264 },
  { name: "Hortaleza", wx: 360, wz: 192 },
  { name: "Paseo de la Castellana", wx: 0, wz: 288 },
  { name: "Glorieta de Bilbao", wx: -216, wz: 312 },
  { name: "Calle Fuencarral", wx: -96, wz: 300 },
  { name: "Malasaña", wx: -312, wz: 336 },
  { name: "Chueca", wx: 120, wz: 324 },
  { name: "Plaza de Colón", wx: 288, wz: 312 },
  { name: "Dehesa de la Villa", wx: -384, wz: 240 },
  // ─ Mid-near field (wz 350–550) — visible wx ≈ ±700 ─
  { name: "Gran Vía", wx: -168, wz: 384 },
  { name: "Plaza de España", wx: -408, wz: 396 },
  { name: "Fundación Telefónica", wx: -72, wz: 360 },
  { name: "Círculo de Bellas Artes", wx: 144, wz: 408 },
  { name: "Puerta del Sol", wx: 0, wz: 432 },
  { name: "Plaza Mayor", wx: -192, wz: 480 },
  { name: "Puerta de Alcalá", wx: 384, wz: 420 },
  { name: "Plaza de Cibeles", wx: 264, wz: 408 },
  { name: "Plaza de Oriente", wx: -360, wz: 432 },
  { name: "Teatro Real", wx: -312, wz: 456 },
  { name: "Palacio Real", wx: -480, wz: 432 },
  { name: "Catedral de la Almudena", wx: -432, wz: 468 },
  { name: "Calle de Alcalá", wx: 96, wz: 444 },
  { name: "Congreso de los Diputados", wx: 192, wz: 480 },
  { name: "Museo Thyssen", wx: 336, wz: 480 },
  { name: "Salamanca", wx: 528, wz: 384 },
  { name: "Calle Serrano", wx: 504, wz: 360 },
  { name: "Argüelles", wx: -504, wz: 348 },
  { name: "Parque del Oeste", wx: -600, wz: 360 },
  { name: "Templo de Debod", wx: -552, wz: 396 },
  { name: "Jardines de Sabatini", wx: -456, wz: 408 },
  { name: "Calle Princesa", wx: -480, wz: 372 },
  { name: "Moncloa", wx: -624, wz: 312 },
  { name: "Faro de Moncloa", wx: -672, wz: 336 },
  { name: "Ciudad Lineal", wx: 624, wz: 408 },
  { name: "San Blas", wx: 696, wz: 360 },
  { name: "Parque de Berlín", wx: 576, wz: 336 },
  { name: "Mercado de San Miguel", wx: -144, wz: 468 },
  { name: "Plaza de la Villa", wx: -120, wz: 456 },
  { name: "Museo del Prado", wx: 360, wz: 504 },
  { name: "Jardín Botánico", wx: 432, wz: 540 },
  { name: "El Corte Inglés Castellana", wx: 216, wz: 312 },
  { name: "Mercado de la Paz", wx: 480, wz: 408 },
  { name: "Retiro Park", wx: 504, wz: 528 },
  // ─ Mid field (wz 550–850) — visible wx ≈ ±1000 ─
  { name: "Lavapiés", wx: -72, wz: 576 },
  { name: "La Latina", wx: -264, wz: 552 },
  { name: "Atocha Station", wx: 192, wz: 600 },
  { name: "Museo Reina Sofía", wx: 240, wz: 576 },
  { name: "CaixaForum", wx: 312, wz: 564 },
  { name: "Paseo del Prado", wx: 336, wz: 540 },
  { name: "El Rastro", wx: -168, wz: 564 },
  { name: "Mercado de Antón Martín", wx: 48, wz: 540 },
  { name: "Príncipe Pío", wx: -552, wz: 480 },
  { name: "Casa de Campo", wx: -816, wz: 624 },
  { name: "Madrid Río", wx: -576, wz: 696 },
  { name: "Matadero Madrid", wx: -384, wz: 768 },
  { name: "Méndez Álvaro", wx: 336, wz: 696 },
  { name: "Moratalaz", wx: 720, wz: 648 },
  { name: "WiZink Center", wx: 576, wz: 528 },
  { name: "Las Ventas", wx: 648, wz: 456 },
  { name: "Moncloa Bus Station", wx: -648, wz: 348 },
  { name: "Aluche", wx: -792, wz: 744 },
  { name: "Wanda Metropolitano", wx: 840, wz: 576 },
  { name: "Pozuelo", wx: -888, wz: 528 },
  { name: "Usera", wx: -216, wz: 840 },
  { name: "Carabanchel", wx: -624, wz: 816 },
  { name: "Vallecas", wx: 576, wz: 840 },
  { name: "Coslada", wx: 864, wz: 456 },
  { name: "Barajas", wx: 912, wz: 288 },
  { name: "IFEMA", wx: 840, wz: 240 },
  { name: "Aeropuerto T4", wx: 984, wz: 264 },
  // ─ Far field (wz 850–1350) — visible wx ≈ ±1600 ─
  { name: "Villaverde", wx: -360, wz: 984 },
  { name: "Getafe", wx: -552, wz: 1080 },
  { name: "Leganés", wx: -888, wz: 1008 },
  { name: "Alcorcón", wx: -960, wz: 912 },
  { name: "Parque Warner", wx: 672, wz: 1176 },
  { name: "Fuenlabrada", wx: -744, wz: 1152 },
  { name: "Móstoles", wx: -1104, wz: 1056 },
  { name: "Alcobendas", wx: 360, wz: 168 },
  { name: "San Sebastián de los Reyes", wx: -312, wz: 156 },
  { name: "Torrejón de Ardoz", wx: 1128, wz: 384 },
  { name: "Rivas-Vaciamadrid", wx: 840, wz: 888 },
  { name: "Arganda del Rey", wx: 1056, wz: 960 },
  { name: "San Fernando de Henares", wx: 1008, wz: 528 },
  { name: "Majadahonda", wx: -1056, wz: 480 },
  { name: "Las Rozas", wx: -1200, wz: 432 },
  { name: "Boadilla del Monte", wx: -1128, wz: 720 },
  // ─ Very far field (wz 1350–1900) — visible wx ≈ ±2200 ─
  { name: "Parla", wx: -624, wz: 1368 },
  { name: "Pinto", wx: -408, wz: 1464 },
  { name: "Valdemoro", wx: -216, wz: 1560 },
  { name: "Aranjuez", wx: 96, wz: 1848 },
  { name: "Navalcarnero", wx: -1440, wz: 1200 },
  { name: "Villanueva de la Cañada", wx: -1536, wz: 648 },
  { name: "Tres Cantos", wx: -504, wz: 168 },
  { name: "Colmenar Viejo", wx: -648, wz: 150 },
  { name: "Alcalá de Henares", wx: 1440, wz: 600 },
  { name: "Guadalajara", wx: 1800, wz: 720 },
  { name: "Toledo (dir.)", wx: -384, wz: 1920 },
  { name: "Segovia (dir.)", wx: -1680, wz: 384 },
];

/* ── Types ── */
interface Ripple { wx: number; wz: number; t: number; strength: number }
type V3 = [number, number, number];

interface BoatPhysics {
  wx: number; wz: number;
  vx: number; vz: number;
  wy: number;
  pitch: number; roll: number; heading: number;
  lastT: number;
}

/* ── Wave height (base ocean, no ripples/mouse) ── */
function getWaveHeight(wx: number, wz: number, t: number, drift: number, driftZ: number) {
  const swx = wx + drift, swz = wz + driftZ;
  return (
    Math.sin(swx * 0.003 + t * 0.6) * Math.cos(swz * 0.004 + t * 0.35) * 40 +
    Math.sin(swx * 0.005 - t * 0.4 + 1.5) * Math.cos(swz * 0.006 + t * 0.25) * 25 +
    Math.sin((swx + swz) * 0.002 + t * 0.45) * 18 +
    Math.sin(swx * 0.01 + t * 1.0) * Math.cos(swz * 0.009 + t * 0.55) * 8
  );
}

/* ── 3D rotation helpers ── */
function rotY(p: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c];
}
function rotX(p: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
}
function rotZ(p: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
}

function xformVert(
  local: V3, roll: number, pitch: number, heading: number,
  scale: number, ox: number, oy: number, oz: number
): V3 {
  let p = rotX(local, roll);
  p = rotZ(p, pitch);
  p = rotY(p, heading);
  return [p[0] * scale + ox, p[1] * scale + oy, p[2] * scale + oz];
}

/* ── Boat 3D model ── */
// Hull stations: [x, halfWidth, keelDepth]
const STATIONS: [number, number, number][] = [
  [-30, 5, 4.5],
  [-20, 7, 5.5],
  [-10, 9.5, 7],
  [0, 11, 7.5],
  [10, 10, 6.5],
  [20, 8, 5],
  [30, 5, 3],
  [38, 2, 1],
  [44, 0, 0],
];

function buildHullVerts(): { deckP: V3[]; deckS: V3[]; keelP: V3[]; keelS: V3[] } {
  const deckP: V3[] = [], deckS: V3[] = [], keelP: V3[] = [], keelS: V3[] = [];
  for (const [x, hw, kd] of STATIONS) {
    deckP.push([x, 0, hw]);
    deckS.push([x, 0, -hw]);
    keelP.push([x, -kd, hw * 0.6]);
    keelS.push([x, -kd, -hw * 0.6]);
  }
  return { deckP, deckS, keelP, keelS };
}
const HULL = buildHullVerts();

// Stern castle vertices
const SC_HEIGHT = 10;
const SC: { edges: [V3, V3][] } = {
  edges: [
    // Verticals
    [[-30, 0, 5], [-30, SC_HEIGHT, 4]],
    [[-30, 0, -5], [-30, SC_HEIGHT, -4]],
    // Top stern
    [[-30, SC_HEIGHT, 4], [-30, SC_HEIGHT, -4]],
    // Top sides
    [[-30, SC_HEIGHT, 4], [-18, SC_HEIGHT, 5]],
    [[-30, SC_HEIGHT, -4], [-18, SC_HEIGHT, -5]],
    // Top front
    [[-18, SC_HEIGHT, 5], [-18, SC_HEIGHT, -5]],
    // Down to deck
    [[-18, SC_HEIGHT, 5], [-10, 0, 9.5]],
    [[-18, SC_HEIGHT, -5], [-10, 0, -9.5]],
    // Railing cross
    [[-24, SC_HEIGHT, 4.5], [-24, SC_HEIGHT, -4.5]],
  ],
};

// Masts, sails, rigging
const MAIN_MAST_X = -2;
const MAIN_MAST_H = 48;
const FORE_MAST_X = 22;
const FORE_MAST_H = 38;

const MODEL_SCALE = 2.0;

/* ── Draw the 3D boat ── */
function drawBoat3D(
  ctx: CanvasRenderingContext2D,
  project: (wx: number, wy: number, wz: number) => { sx: number; sy: number } | null,
  phys: BoatPhysics,
  t: number,
  depthAlpha: number,
) {
  const { roll, pitch, heading, wx, wy, wz } = phys;
  const sc = MODEL_SCALE;
  const a = Math.min(1, depthAlpha);

  // Transform helper
  const xf = (local: V3): { sx: number; sy: number } | null => {
    const w = xformVert(local, roll, pitch, heading, sc, wx, wy, wz);
    return project(w[0], w[1], w[2]);
  };

  // Project a polyline and draw it
  const drawPolyline = (pts: V3[], color: string, lw: number) => {
    const projected = pts.map(xf);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    let started = false;
    for (const p of projected) {
      if (!p) continue;
      if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
      else ctx.lineTo(p.sx, p.sy);
    }
    ctx.stroke();
  };

  // Draw a filled polygon
  const drawFace = (pts: V3[], fillColor: string, strokeColor?: string, lw = 0.8) => {
    const projected = pts.map(xf);
    const valid = projected.filter(Boolean) as { sx: number; sy: number }[];
    if (valid.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(valid[0].sx, valid[0].sy);
    for (let i = 1; i < valid.length; i++) ctx.lineTo(valid[i].sx, valid[i].sy);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
  };

  // Draw edge
  const drawEdge = (from: V3, to: V3, color: string, lw: number) => {
    const a2 = xf(from), b = xf(to);
    if (!a2 || !b) return;
    ctx.beginPath();
    ctx.moveTo(a2.sx, a2.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.stroke();
  };

  const hullStroke = `rgba(20,60,160,${(0.5 * a).toFixed(3)})`;
  const hullFill = `rgba(20,60,160,${(0.06 * a).toFixed(3)})`;
  const hullFillDark = `rgba(20,60,160,${(0.1 * a).toFixed(3)})`;
  const ribStroke = `rgba(20,60,160,${(0.25 * a).toFixed(3)})`;
  const mastStroke = `rgba(20,60,160,${(0.45 * a).toFixed(3)})`;
  const sailFill = `rgba(20,60,160,${(0.05 * a).toFixed(3)})`;
  const sailStroke = `rgba(20,60,160,${(0.25 * a).toFixed(3)})`;
  const riggingStroke = `rgba(20,60,160,${(0.15 * a).toFixed(3)})`;
  const flagFill = `rgba(20,60,160,${(0.3 * a).toFixed(3)})`;
  const scStroke = `rgba(20,60,160,${(0.4 * a).toFixed(3)})`;
  const scFill = `rgba(20,60,160,${(0.08 * a).toFixed(3)})`;

  // ── Hull faces (port side panels) ──
  for (let i = 0; i < STATIONS.length - 1; i++) {
    // Port face: deckP[i], deckP[i+1], keelP[i+1], keelP[i]
    drawFace(
      [HULL.deckP[i], HULL.deckP[i + 1], HULL.keelP[i + 1], HULL.keelP[i]],
      hullFill, hullStroke, 0.8
    );
    // Starboard face
    drawFace(
      [HULL.deckS[i], HULL.deckS[i + 1], HULL.keelS[i + 1], HULL.keelS[i]],
      hullFillDark, hullStroke, 0.8
    );
    // Keel (bottom) face
    drawFace(
      [HULL.keelP[i], HULL.keelP[i + 1], HULL.keelS[i + 1], HULL.keelS[i]],
      hullFillDark
    );
  }

  // ── Deck outline ──
  drawPolyline(HULL.deckP, hullStroke, 1.0);
  drawPolyline(HULL.deckS, hullStroke, 1.0);

  // ── Keel outlines ──
  drawPolyline(HULL.keelP, ribStroke, 0.6);
  drawPolyline(HULL.keelS, ribStroke, 0.6);

  // ── Cross ribs ──
  for (let i = 0; i < STATIONS.length; i += 2) {
    drawEdge(HULL.deckP[i], HULL.keelP[i], ribStroke, 0.5);
    drawEdge(HULL.keelP[i], HULL.keelS[i], ribStroke, 0.5);
    drawEdge(HULL.keelS[i], HULL.deckS[i], ribStroke, 0.5);
    drawEdge(HULL.deckP[i], HULL.deckS[i], ribStroke, 0.4);
  }

  // ── Stern transom ──
  drawFace(
    [HULL.deckP[0], HULL.deckS[0], HULL.keelS[0], HULL.keelP[0]],
    hullFillDark, hullStroke, 1.0
  );

  // ── Stern castle ──
  // Back face
  drawFace(
    [[-30, 0, 5], [-30, SC_HEIGHT, 4], [-30, SC_HEIGHT, -4], [-30, 0, -5]],
    scFill, scStroke, 0.8
  );
  // Side faces
  drawFace(
    [[-30, SC_HEIGHT, 4], [-18, SC_HEIGHT, 5], [-10, 0, 9.5], [-30, 0, 5]],
    scFill
  );
  drawFace(
    [[-30, SC_HEIGHT, -4], [-18, SC_HEIGHT, -5], [-10, 0, -9.5], [-30, 0, -5]],
    scFill
  );
  // Top
  drawFace(
    [[-30, SC_HEIGHT, 4], [-30, SC_HEIGHT, -4], [-18, SC_HEIGHT, -5], [-18, SC_HEIGHT, 5]],
    scFill, scStroke, 0.6
  );
  for (const [from, to] of SC.edges) drawEdge(from, to, scStroke, 0.8);

  // ── Main mast ──
  drawEdge([MAIN_MAST_X, 0, 0], [MAIN_MAST_X, MAIN_MAST_H, 0], mastStroke, 1.8);
  // Yard
  drawEdge([MAIN_MAST_X - 14, MAIN_MAST_H - 10, 0], [MAIN_MAST_X + 14, MAIN_MAST_H - 10, 0], mastStroke, 1.2);

  // ── Main sail (with billow) ──
  const billowAmt = 5 * Math.sin(t * 0.8) * 0.5 + 5;
  const sailTop = MAIN_MAST_H - 12;
  const sailBot = 12;
  const sailPts: V3[] = [];
  const sailSteps = 8;
  // Left edge (straight)
  for (let i = 0; i <= sailSteps; i++) {
    const frac = i / sailSteps;
    const y = sailTop + (sailBot - sailTop) * frac;
    const billow = Math.sin(frac * Math.PI) * billowAmt;
    sailPts.push([MAIN_MAST_X - 12 + frac * 2, y, billow]);
  }
  // Right edge (reverse)
  for (let i = sailSteps; i >= 0; i--) {
    const frac = i / sailSteps;
    const y = sailTop + (sailBot - sailTop) * frac;
    const billow = Math.sin(frac * Math.PI) * billowAmt;
    sailPts.push([MAIN_MAST_X + 12 - frac * 2, y, billow]);
  }
  drawFace(sailPts, sailFill, sailStroke, 0.7);

  // Sail detail — horizontal battens
  for (let i = 1; i < sailSteps; i += 2) {
    const frac = i / sailSteps;
    const y = sailTop + (sailBot - sailTop) * frac;
    const billow = Math.sin(frac * Math.PI) * billowAmt;
    drawEdge(
      [MAIN_MAST_X - 12 + frac * 2, y, billow],
      [MAIN_MAST_X + 12 - frac * 2, y, billow],
      riggingStroke, 0.4
    );
  }

  // ── Foremast ──
  drawEdge([FORE_MAST_X, 0, 0], [FORE_MAST_X, FORE_MAST_H, 0], mastStroke, 1.4);

  // ── Fore lateen sail (with billow) ──
  const foreTop = FORE_MAST_H - 4;
  const foreBot = 10;
  const foreTip = FORE_MAST_X + 16;
  const foreSailPts: V3[] = [];
  const foreSteps = 6;
  // Mast edge
  for (let i = 0; i <= foreSteps; i++) {
    const frac = i / foreSteps;
    const y = foreTop + (foreBot - foreTop) * frac;
    const billow = Math.sin(frac * Math.PI) * billowAmt * 0.6;
    foreSailPts.push([FORE_MAST_X, y, billow]);
  }
  // Outer edge (triangle collapses to tip)
  for (let i = foreSteps; i >= 0; i--) {
    const frac = i / foreSteps;
    const y = foreTop + (foreBot - foreTop) * frac;
    const xLerp = FORE_MAST_X + (foreTip - FORE_MAST_X) * frac;
    const billow = Math.sin(frac * Math.PI) * billowAmt * 0.4;
    foreSailPts.push([xLerp, y, billow]);
  }
  drawFace(foreSailPts, sailFill, sailStroke, 0.6);

  // ── Bowsprit ──
  drawEdge([40, 1, 0], [56, 5, 0], mastStroke, 1.0);

  // ── Rigging ──
  drawEdge([MAIN_MAST_X, MAIN_MAST_H - 4, 0], [-26, SC_HEIGHT, 0], riggingStroke, 0.4);
  drawEdge([MAIN_MAST_X, MAIN_MAST_H - 4, 0], [40, 1, 0], riggingStroke, 0.4);
  drawEdge([MAIN_MAST_X, MAIN_MAST_H, 0], [HULL.deckP[2][0], 0, HULL.deckP[2][2]], riggingStroke, 0.3);
  drawEdge([MAIN_MAST_X, MAIN_MAST_H, 0], [HULL.deckS[2][0], 0, HULL.deckS[2][2]], riggingStroke, 0.3);
  drawEdge([FORE_MAST_X, FORE_MAST_H, 0], [56, 5, 0], riggingStroke, 0.3);
  drawEdge([FORE_MAST_X, FORE_MAST_H, 0], [0, 0, 0], riggingStroke, 0.3);

  // ── Crow's nest ──
  drawEdge([MAIN_MAST_X - 4, MAIN_MAST_H - 4, -2], [MAIN_MAST_X + 4, MAIN_MAST_H - 4, -2], mastStroke, 0.8);
  drawEdge([MAIN_MAST_X - 4, MAIN_MAST_H - 4, 2], [MAIN_MAST_X + 4, MAIN_MAST_H - 4, 2], mastStroke, 0.8);
  drawEdge([MAIN_MAST_X - 4, MAIN_MAST_H - 4, -2], [MAIN_MAST_X - 4, MAIN_MAST_H - 4, 2], mastStroke, 0.8);
  drawEdge([MAIN_MAST_X + 4, MAIN_MAST_H - 4, -2], [MAIN_MAST_X + 4, MAIN_MAST_H - 4, 2], mastStroke, 0.8);

  // ── Flag (fluttering) ──
  const flagWave = Math.sin(t * 3) * 2;
  const flagWave2 = Math.sin(t * 4.5 + 1) * 1;
  const flagPts: V3[] = [
    [MAIN_MAST_X, MAIN_MAST_H, 0],
    [MAIN_MAST_X + 5, MAIN_MAST_H + 1.5, flagWave],
    [MAIN_MAST_X + 10, MAIN_MAST_H + 0.5, flagWave + flagWave2],
    [MAIN_MAST_X + 10, MAIN_MAST_H - 3, flagWave + flagWave2 * 0.8],
    [MAIN_MAST_X + 5, MAIN_MAST_H - 2, flagWave * 0.5],
    [MAIN_MAST_X, MAIN_MAST_H - 4, 0],
  ];
  drawFace(flagPts, flagFill, mastStroke, 0.6);

  // ── Crew ──
  const crewStroke = `rgba(20,60,160,${(0.5 * a).toFixed(3)})`;
  const crewHead = `rgba(20,60,160,${(0.35 * a).toFixed(3)})`;
  const headR = 0.9;
  const bodyH = 3;

  // Draw a stick figure at local position with pose
  const drawPerson = (
    pos: V3,
    opts: {
      bodyTilt?: number;           // lean angle
      leftArm?: [number, number];  // [angle, length] from shoulder
      rightArm?: [number, number];
      leftLeg?: number;            // angle from hip
      rightLeg?: number;
      lookDir?: number;            // head tilt
    } = {}
  ) => {
    const {
      bodyTilt = 0,
      leftArm = [0.4, 3],
      rightArm = [-0.4, 3],
      leftLeg = 0.2,
      rightLeg = -0.2,
      lookDir = 0,
    } = opts;

    const [bx, by, bz] = pos;
    const sway = Math.sin(t * 1.5 + bx * 0.1) * 0.05; // subtle sway

    // Feet
    const feetY = by;
    // Hips
    const hipY = feetY + bodyH * 0.4;
    // Shoulders
    const shoulderY = feetY + bodyH * 0.85;
    // Head
    const headY = feetY + bodyH + headR;

    const tiltTotal = bodyTilt + sway;

    // Body line (feet to head)
    const hipPt: V3 = [bx + Math.sin(tiltTotal) * bodyH * 0.2, hipY, bz];
    const shoulderPt: V3 = [bx + Math.sin(tiltTotal) * bodyH * 0.5, shoulderY, bz];
    const headPt: V3 = [bx + Math.sin(tiltTotal) * bodyH * 0.6 + Math.sin(lookDir) * 1.5, headY, bz + Math.cos(lookDir) * 0.5];

    // Legs
    const footL: V3 = [bx + Math.sin(leftLeg) * 3, feetY, bz + 0.8];
    const footR: V3 = [bx + Math.sin(rightLeg) * 3, feetY, bz - 0.8];

    // Arms
    const handL: V3 = [
      shoulderPt[0] + Math.sin(leftArm[0]) * leftArm[1],
      shoulderPt[1] + Math.cos(leftArm[0]) * leftArm[1],
      bz + 1.5,
    ];
    const handR: V3 = [
      shoulderPt[0] + Math.sin(rightArm[0]) * rightArm[1],
      shoulderPt[1] + Math.cos(rightArm[0]) * rightArm[1],
      bz - 1.5,
    ];

    // Draw legs
    drawEdge(footL, hipPt, crewStroke, 0.7);
    drawEdge(footR, hipPt, crewStroke, 0.7);
    // Draw body
    drawEdge(hipPt, shoulderPt, crewStroke, 0.8);
    // Draw arms
    drawEdge(shoulderPt, handL, crewStroke, 0.6);
    drawEdge(shoulderPt, handR, crewStroke, 0.6);
    // Draw head
    const headScreen = xf(headPt);
    // Project a point slightly above to measure perspective scale
    const headBase = xf([headPt[0], headPt[1] - headR, headPt[2]]);
    if (headScreen && headBase) {
      const headSize = Math.max(1.2, Math.abs(headScreen.sy - headBase.sy));
      ctx.beginPath();
      ctx.arc(headScreen.sx, headScreen.sy, headSize, 0, Math.PI * 2);
      ctx.fillStyle = crewHead;
      ctx.fill();
    }
  };

  // Captain — on stern castle, standing tall, one arm pointing forward
  drawPerson([-24, SC_HEIGHT, 0], {
    bodyTilt: -0.05,
    rightArm: [0.8 + Math.sin(t * 0.3) * 0.05, 2.5],  // pointing forward (angled down)
    leftArm: [0.3, 2],                                   // relaxed at side
    lookDir: 0.3,
  });

  // Crew 1 — near main mast port side, pulling rope
  const pullAnim = Math.sin(t * 2.5) * 0.15;
  drawPerson([MAIN_MAST_X + 2, 0, 4], {
    bodyTilt: 0.1 + pullAnim * 0.1,
    leftArm: [0.1 + pullAnim, 2.5],    // one arm slightly raised for rope
    rightArm: [0.5 - pullAnim, 2.5],   // other arm pulling down
  });

  // Crew 2 — bow lookout, hand shading eyes
  drawPerson([32, 0, 0], {
    bodyTilt: -0.05,
    rightArm: [0.15, 2.5],             // hand near brow
    leftArm: [0.4, 2],                 // relaxed
    lookDir: 0.5,
  });

  // Crew 3 — midship starboard, bending hauling rope
  const haulAnim = Math.sin(t * 2) * 0.1;
  drawPerson([10, 0, -5], {
    bodyTilt: 0.25 + haulAnim,
    leftArm: [0.6 + haulAnim, 2.5],
    rightArm: [0.5 - haulAnim, 2.5],
    leftLeg: 0.3,
    rightLeg: -0.1,
  });

  // Crew 4 — in the crow's nest, arms resting on rail
  drawPerson([MAIN_MAST_X, MAIN_MAST_H - 8, 0], {
    bodyTilt: Math.sin(t * 0.8) * 0.05,
    leftArm: [0.6, 2],
    rightArm: [-0.6, 2],
    leftLeg: 0.15,
    rightLeg: -0.15,
    lookDir: Math.sin(t * 0.4) * 0.5,
  });
}

/* ── 3D Perspective Wave Mesh ── */
const WaveMesh = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const prevMouseRef = useRef({ x: -9999, y: -9999 });
  const ripplesRef = useRef<Ripple[]>([]);
  const animRef = useRef<number>(0);

  // Boat physics — start on left 25%, facing right
  const boatRef = useRef<BoatPhysics>({
    wx: -700, wz: 900,
    vx: 0, vz: 0,
    wy: 0, pitch: 0, roll: 0, heading: 0,
    lastT: 0,
  });
  const draggingRef = useRef(false);
  const hoveringBoatRef = useRef(false);
  const hoveringLocationRef = useRef(false);
  const prevBoatPosRef = useRef({ wx: -700, wz: 900 });

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

    // ── 3D Projection ──
    const fov = 600;
    const horizonY = H * 0.24 + 100;
    const cameraHeight = 500;
    const cellSize = 24;
    const gridCols = 280;
    const gridRows = 90;

    const project = (wx: number, wy: number, wz: number): { sx: number; sy: number } | null => {
      if (wz <= 1) return null;
      return { sx: (wx * fov) / wz + W / 2, sy: ((-wy + cameraHeight) * fov) / wz + horizonY };
    };

    const unproject = (screenX: number, screenY: number): { wx: number; wz: number } | null => {
      const wz = (cameraHeight * fov) / (screenY - horizonY);
      if (wz <= 1 || wz > 5000) return null;
      return { wx: ((screenX - W / 2) * wz) / fov, wz };
    };

    // Mouse world position (needed for boat wave sampling + grid)
    let mouseWorld: { wx: number; wz: number } | null = null;
    if (smx > -999 && smy > horizonY && !draggingRef.current) {
      mouseWorld = unproject(smx, smy);
    }

    // ── Boat physics ──
    const boat = boatRef.current;
    const dt = boat.lastT > 0 ? Math.min(t - boat.lastT, 0.05) : 0.016;
    boat.lastT = t;

    if (draggingRef.current && smx > -999) {
      const clampedY = Math.max(horizonY + 10, smy);
      const wp = unproject(smx, clampedY);
      if (wp) {
        const newWx = Math.max(-1000, Math.min(1000, wp.wx));
        const newWz = Math.max(150, Math.min(1600, wp.wz));
        // Compute velocity from position change
        boat.vx = (newWx - boat.wx) / Math.max(dt, 0.001);
        boat.vz = (newWz - boat.wz) / Math.max(dt, 0.001);
        boat.wx = newWx;
        boat.wz = newWz;
      }
    } else {
      // Apply momentum with damping
      const damping = Math.exp(-2.5 * dt);
      boat.vx *= damping;
      boat.vz *= damping;

      // Auto-sail rightward when momentum is low
      const SAIL_SPEED = 30; // world units per second
      const currentSpeed = Math.sqrt(boat.vx * boat.vx + boat.vz * boat.vz);
      if (currentSpeed < SAIL_SPEED * 1.5) {
        boat.vx += (SAIL_SPEED - boat.vx) * dt * 0.8;
      }

      boat.wx += boat.vx * dt;
      boat.wz += boat.vz * dt;

      // Wrap around when sailing off the right edge
      if (boat.wx > 1100) {
        boat.wx = -1100;
        prevBoatPosRef.current = { wx: boat.wx, wz: boat.wz };
      }

      // Clamp Z
      boat.wz = Math.max(150, Math.min(1600, boat.wz));
    }

    const drift = t * 40;
    const driftZ = t * 12;

    // Full wave height including ripples + mouse push
    const getFullWaveHeight = (wx: number, wz: number) => {
      let wy = getWaveHeight(wx, wz, t, drift, driftZ);

      // Mouse proximity push
      if (mouseWorld) {
        const dx = wx - mouseWorld.wx;
        const dz = wz - mouseWorld.wz;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const influence = Math.max(0, 1 - dist / 250);
        if (influence > 0) wy += influence * influence * 35;
      }

      // Ripple contributions
      for (const rip of ripplesRef.current) {
        const rdx = wx - rip.wx;
        const rdz = wz - rip.wz;
        const rdist = Math.sqrt(rdx * rdx + rdz * rdz);
        const age = t - rip.t;
        const waveRadius = age * 200;
        const ringDist = Math.abs(rdist - waveRadius);
        if (ringDist < 140) {
          const fade = Math.max(0, 1 - age / 4);
          const ringFade = 1 - ringDist / 140;
          wy += Math.sin((rdist - waveRadius) * 0.05) * rip.strength * fade * ringFade * ringFade;
        }
      }

      return wy;
    };

    // Sample wave at boat + nearby points for buoyancy
    const sampleDist = 25 * MODEL_SCALE;
    const wyCenter = getFullWaveHeight(boat.wx, boat.wz);
    const wyBow = getFullWaveHeight(boat.wx + sampleDist * Math.cos(boat.heading), boat.wz + sampleDist * Math.sin(boat.heading));
    const wyStern = getFullWaveHeight(boat.wx - sampleDist * Math.cos(boat.heading), boat.wz - sampleDist * Math.sin(boat.heading));
    const wyPort = getFullWaveHeight(boat.wx - sampleDist * Math.sin(boat.heading), boat.wz + sampleDist * Math.cos(boat.heading));
    const wyStarboard = getFullWaveHeight(boat.wx + sampleDist * Math.sin(boat.heading), boat.wz - sampleDist * Math.cos(boat.heading));

    const targetWy = (wyCenter + wyBow + wyStern + wyPort + wyStarboard) / 5;
    const targetPitch = Math.atan2(wyBow - wyStern, sampleDist * 2) * 0.7;
    const targetRoll = Math.atan2(wyPort - wyStarboard, sampleDist * 2) * 0.7;

    // Smooth interpolation
    const smoothSpeed = 4;
    const lerpAmt = 1 - Math.exp(-smoothSpeed * dt);
    boat.wy += (targetWy - boat.wy) * lerpAmt;
    boat.pitch += (targetPitch - boat.pitch) * lerpAmt;
    boat.roll += (targetRoll - boat.roll) * lerpAmt;

    // Heading follows movement direction
    const speed = Math.sqrt(boat.vx * boat.vx + boat.vz * boat.vz);
    if (speed > 5) {
      const targetHeading = Math.atan2(boat.vz, boat.vx);
      let headingDiff = targetHeading - boat.heading;
      while (headingDiff > Math.PI) headingDiff -= 2 * Math.PI;
      while (headingDiff < -Math.PI) headingDiff += 2 * Math.PI;
      boat.heading += headingDiff * lerpAmt * 0.5;
    }

    // Boat wake ripples when moving
    const boatMoved = Math.sqrt(
      (boat.wx - prevBoatPosRef.current.wx) ** 2 +
      (boat.wz - prevBoatPosRef.current.wz) ** 2
    );
    if (boatMoved > 8) {
      // Stern wake
      const sternX = boat.wx - Math.cos(boat.heading) * sampleDist;
      const sternZ = boat.wz - Math.sin(boat.heading) * sampleDist;
      ripplesRef.current.push({ wx: sternX, wz: sternZ, t, strength: Math.min(boatMoved * 0.5, 20) });
      prevBoatPosRef.current = { wx: boat.wx, wz: boat.wz };
    }

    // Spawn ripples from mouse (skip if dragging boat)
    const pmx = prevMouseRef.current.x;
    const pmy = prevMouseRef.current.y;
    const screenDist = Math.sqrt((smx - pmx) ** 2 + (smy - pmy) ** 2);
    if (!draggingRef.current && smx > -999 && smy > horizonY && screenDist > 15) {
      const wp = unproject(smx, smy);
      if (wp) {
        ripplesRef.current.push({ wx: wp.wx, wz: wp.wz, t, strength: Math.min(screenDist * 0.3, 25) });
      }
      prevMouseRef.current = { x: smx, y: smy };
    }

    ripplesRef.current = ripplesRef.current.filter((r) => t - r.t < 4);

    // ── Build grid ──
    const grid: ({ sx: number; sy: number; wy: number } | null)[][] = [];

    for (let r = 0; r < gridRows; r++) {
      grid[r] = [];
      for (let c = 0; c < gridCols; c++) {
        const wx = (c - gridCols / 2) * cellSize;
        const wz = (r + 2) * cellSize;

        let wy = getWaveHeight(wx, wz, t, drift, driftZ);

        if (mouseWorld) {
          const dx = wx - mouseWorld.wx;
          const dz = wz - mouseWorld.wz;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const influence = Math.max(0, 1 - dist / 250);
          if (influence > 0) wy += influence * influence * 35;
        }

        for (const rip of ripplesRef.current) {
          const rdx = wx - rip.wx;
          const rdz = wz - rip.wz;
          const rdist = Math.sqrt(rdx * rdx + rdz * rdz);
          const age = t - rip.t;
          const waveRadius = age * 200;
          const ringDist = Math.abs(rdist - waveRadius);
          if (ringDist < 140) {
            const fade = Math.max(0, 1 - age / 4);
            const ringFade = 1 - ringDist / 140;
            wy += Math.sin((rdist - waveRadius) * 0.05) * rip.strength * fade * ringFade * ringFade;
          }
        }

        const p = project(wx, wy, wz);
        grid[r][c] = p ? { sx: p.sx, sy: p.sy, wy } : null;
      }
    }

    // ── Draw grid ──
    for (let c = 0; c < gridCols; c++) {
      ctx.beginPath();
      let started = false;
      for (let r = gridRows - 1; r >= 0; r--) {
        const p = grid[r][c];
        if (!p) continue;
        const depthT = r / gridRows;
        ctx.strokeStyle = `rgba(20,60,160,${(0.08 + depthT * 0.22).toFixed(3)})`;
        ctx.lineWidth = 0.8 + depthT * 1.2;
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();
    }

    for (let r = 0; r < gridRows; r++) {
      const depthT = r / gridRows;
      ctx.strokeStyle = `rgba(20,60,160,${(0.08 + depthT * 0.22).toFixed(3)})`;
      ctx.lineWidth = 0.8 + depthT * 1.2;
      ctx.beginPath();
      let started = false;
      for (let c = 0; c < gridCols; c++) {
        const p = grid[r][c];
        if (!p) continue;
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();
    }

    for (let r = Math.floor(gridRows * 0.6); r < gridRows; r++) {
      const depthT = r / gridRows;
      ctx.fillStyle = `rgba(20,60,160,${(0.05 + depthT * 0.15).toFixed(3)})`;
      for (let c = 0; c < gridCols; c++) {
        const p = grid[r][c];
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 0.4 + depthT * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ── Madrid location dots ──
    let hoveredLocIdx = -1;
    for (let i = 0; i < MADRID_LOCATIONS.length; i++) {
      const loc = MADRID_LOCATIONS[i];
      const wy = getFullWaveHeight(loc.wx, loc.wz);
      const p = project(loc.wx, wy, loc.wz);
      if (!p) continue;

      const { sx, sy } = p;
      const depthScale = Math.min(1, fov / loc.wz * 0.45);

      // Hover detection
      const dx = smx - sx, dy = smy - sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isHovered = dist < 22;
      if (isHovered) hoveredLocIdx = i;

      const pulse = Math.sin(t * 1.2 + i * 0.9) * 0.12;
      const baseR = (2.5 + pulse) * depthScale;
      const dotR = isHovered ? baseR * 2 : baseR;

      // Outer glow
      const glowR = dotR + (isHovered ? 18 : 10) * depthScale;
      const g = ctx.createRadialGradient(sx, sy, dotR * 0.3, sx, sy, glowR);
      g.addColorStop(0, `rgba(37,99,235,${(isHovered ? 0.5 : 0.18 + pulse * 0.3).toFixed(3)})`);
      g.addColorStop(1, "rgba(37,99,235,0)");
      ctx.beginPath();
      ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(sx, sy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37,99,235,${isHovered ? 0.95 : 0.55 + pulse * 0.2})`;
      ctx.fill();

      // Bright center
      ctx.beginPath();
      ctx.arc(sx, sy, dotR * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147,197,253,${isHovered ? 0.85 : 0.35})`;
      ctx.fill();

      // Label (on hover)
      if (isHovered) {
        const fs = Math.max(11, Math.round(13 * depthScale));
        ctx.font = `600 ${fs}px -apple-system, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        const tw = ctx.measureText(loc.name).width;
        const labelY = sy - dotR - 10;

        // Chip bg
        ctx.fillStyle = "rgba(10,19,68,0.88)";
        ctx.beginPath();
        ctx.roundRect(sx - tw / 2 - 10, labelY - 16, tw + 20, 24, 6);
        ctx.fill();
        ctx.strokeStyle = "rgba(37,99,235,0.45)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.fillText(loc.name, sx, labelY + 4);
      }
    }
    hoveringLocationRef.current = hoveredLocIdx >= 0;

    // ── Draw boat ──
    const boatDepthAlpha = Math.min(1, Math.max(0.2, fov / boat.wz * 0.5));
    drawBoat3D(ctx, project, boat, t, boatDepthAlpha);

    // ── Hit test ──
    const boatScreen = project(boat.wx, boat.wy, boat.wz);
    if (boatScreen) {
      const hitR = 50 * (fov / boat.wz) * MODEL_SCALE * 0.15;
      const dx = smx - boatScreen.sx;
      const dy = smy - (boatScreen.sy - hitR * 0.5);
      hoveringBoatRef.current = Math.sqrt(dx * dx + dy * dy) < hitR;
    } else {
      hoveringBoatRef.current = false;
    }

    // Cursor
    if (cvs) {
      if (draggingRef.current) cvs.style.cursor = "grabbing";
      else if (hoveringBoatRef.current) cvs.style.cursor = "grab";
      else if (hoveringLocationRef.current) cvs.style.cursor = "pointer";
      else cvs.style.cursor = "";
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
    const onDown = (e: MouseEvent) => {
      if (hoveringBoatRef.current) {
        draggingRef.current = true;
        e.preventDefault();
      }
    };
    const onUp = () => { draggingRef.current = false; };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      draggingRef.current = false;
    };

    cvs.addEventListener("mousemove", onMove);
    cvs.addEventListener("mousedown", onDown);
    cvs.addEventListener("mouseup", onUp);
    cvs.addEventListener("mouseleave", onLeave);
    return () => {
      cvs.removeEventListener("mousemove", onMove);
      cvs.removeEventListener("mousedown", onDown);
      cvs.removeEventListener("mouseup", onUp);
      cvs.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
};

/* ── Hero Section ── */
export const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [vignetteOpacity, setVignetteOpacity] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll-driven vignette: fades in/out based on how far user has scrolled through hero
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = el.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setVignetteOpacity(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let unlockTimer: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      if (!hasScrolled) {
        e.preventDefault();
        setHasScrolled(true);
        // Signal the navbar to fade in too
        window.dispatchEvent(new CustomEvent("hero-reveal"));
        // Keep scroll locked for 2s while fade-in plays
        unlockTimer = setTimeout(() => {
          window.removeEventListener("wheel", onWheel);
        }, 2000);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!hasScrolled) {
        e.preventDefault();
        setHasScrolled(true);
        window.dispatchEvent(new CustomEvent("hero-reveal"));
        unlockTimer = setTimeout(() => {
          window.removeEventListener("touchmove", onTouchMove);
        }, 2000);
      }
    };

    // Block scrolling until 2s after first scroll attempt
    document.body.style.overflow = "hidden";

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      clearTimeout(unlockTimer);
      document.body.style.overflow = "";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unlock scroll 2s after hasScrolled becomes true
  useEffect(() => {
    if (!hasScrolled) return;
    const timer = setTimeout(() => {
      document.body.style.overflow = "";
    }, 2000);
    return () => clearTimeout(timer);
  }, [hasScrolled]);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    filter: mounted ? "blur(0px)" : "blur(8px)",
    transform: mounted ? "translateY(0px)" : "translateY(18px)",
    transition: `opacity 1000ms ease ${delay}ms, filter 1000ms ease ${delay}ms, transform 1000ms ease ${delay}ms`,
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex flex-col"
      style={{
        background: "#F9F9F9",
        minHeight: "calc(100vh + 300px)",
      }}
    >
      {/* Mesh — absolutely positioned, fills entire section */}
      <div
        className="absolute inset-0"
        style={{
          opacity: hasScrolled ? 1 : 0,
          transition: "opacity 1200ms ease",
        }}
      >
        <WaveMesh />
      </div>

      {/* Top gradient — fades text area into mesh */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "calc(100vh * 0.22)",
          height: "calc(100vh * 0.18)",
          background: "linear-gradient(to bottom, #F9F9F9, transparent)",
          zIndex: 1,
          opacity: hasScrolled ? 1 : 0,
          transition: "opacity 1200ms ease",
        }}
        aria-hidden
      />

      {/* Bottom gradient — smooth transition from mesh ocean into content */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          height: 300,
          background: "linear-gradient(to bottom, transparent, #ffffff)",
          zIndex: 3,
          opacity: hasScrolled ? 1 : 0,
          transition: "opacity 1200ms ease",
        }}
        aria-hidden
      />

      {/* Side vignette gradients — scroll-driven opacity */}
      <div
        className="absolute top-0 bottom-0 left-0 pointer-events-none"
        style={{
          width: "30%",
          background: "linear-gradient(to right, #F9F9F9 0%, transparent 100%)",
          zIndex: 1,
          opacity: vignetteOpacity,
        }}
        aria-hidden
      />
      <div
        className="absolute top-0 bottom-0 right-0 pointer-events-none"
        style={{
          width: "30%",
          background: "linear-gradient(to left, #F9F9F9 0%, transparent 100%)",
          zIndex: 1,
          opacity: vignetteOpacity,
        }}
        aria-hidden
      />

      {/* Hero text — fades in immediately on mount */}
      <Container className="relative z-10 pt-24 md:pt-32" style={{ maxWidth: 1287 }}>
        <div className="max-w-292">
          {/* Eyebrow */}
          <p
            className="text-sm md:text-base font-medium tracking-tight text-[#0A1344] uppercase mb-4 mt-15"
            style={fadeIn(0)}
          >
            FRONTIER AI RESEARCH AND PRODUCT COMPANY
          </p>

          {/* Main Heading */}
          <h1
            className="font-light leading-[1.2] text-[#0A1344]"
            style={{
              fontSize: 61,
              letterSpacing: "-0.02em",
              ...fadeIn(80),
            }}
          >
            Building the first in&#8209;production<br />Large Geospatial Model.
          </h1>

          {/* CTA + Nav links — appear after scroll */}
          <div id="hero-cta" className="flex items-center gap-8 mt-7" style={{
            opacity: hasScrolled ? 1 : 0,
            filter: hasScrolled ? "blur(0px)" : "blur(8px)",
            transform: hasScrolled ? "translateY(0px)" : "translateY(18px)",
            transition: "opacity 1000ms ease 200ms, filter 1000ms ease 200ms, transform 1000ms ease 200ms",
          }}>
            <a
              href="mailto:contact@columbus.earth"
              className="group flex items-center justify-between gap-3 leading-none rounded-none hover:opacity-90 transition-opacity"
              style={{ width: 145, height: 45, marginRight: 16, paddingLeft: 20, paddingRight: 16, fontSize: 16, fontWeight: 500, backgroundColor: "#000000", color: "white" }}
            >
              <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Contact</span>
              <svg
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                width="10" height="18" viewBox="0 0 7 12" fill="none"
                stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M1 1l5 5-5 5" />
              </svg>
            </a>
            {[
              { label: "Technology", href: "/technology" },
              { label: "Products", href: "#" },
              { label: "Use Cases", href: "/use-cases" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group flex items-center gap-1 text-md font-medium text-[#0A1344] transition-opacity duration-300 hover:opacity-60"
              >
                {link.label}
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
