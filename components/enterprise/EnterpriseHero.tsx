"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConsumerEnterpriseToggle } from "./ConsumerEnterpriseToggle";

// ── Topographic contour map with 3D drawn effect ──
// Height field + marching-squares extraction, computed once at module load

const TOPO_W = 900;
const TOPO_H = 700;
const TOPO_CELL = 5;
const TOPO_NX = Math.floor(TOPO_W / TOPO_CELL);
const TOPO_NY = Math.floor(TOPO_H / TOPO_CELL);

// Realistic map topography — mountain range, valleys, river drainage
const MOUNTAINS = [
  { x: 200, y: 180, h: 1.0, sx: 110, sy: 90 },    // main summit
  { x: 340, y: 220, h: 0.85, sx: 95, sy: 75 },     // adjacent peak
  { x: 130, y: 310, h: 0.72, sx: 80, sy: 100 },    // southern peak
  { x: 450, y: 140, h: 0.60, sx: 70, sy: 65 },     // eastern knob
  { x: 280, y: 100, h: 0.55, sx: 60, sy: 55 },     // northern shoulder
  { x: 550, y: 280, h: 0.45, sx: 90, sy: 80 },     // distant foothill
  { x: 100, y: 130, h: 0.50, sx: 75, sy: 60 },     // NW ridge
  { x: 400, y: 350, h: 0.38, sx: 65, sy: 70 },     // SE outlier
  { x: 680, y: 180, h: 0.30, sx: 80, sy: 55 },     // far east hill
  { x: 250, y: 420, h: 0.42, sx: 70, sy: 90 },     // south basin rim
];

function topoHeight(x: number, y: number): number {
  let h = 0;

  // Mountain peaks — Gaussian summits
  for (const m of MOUNTAINS) {
    const dx = x - m.x, dy = y - m.y;
    h += m.h * Math.exp(-(dx * dx) / (2 * m.sx * m.sx) - (dy * dy) / (2 * m.sy * m.sy));
  }

  // Mountain ridge connecting main peaks — NW to SE trending
  const ridgeLine = 160 + 0.35 * (x - 150);
  const ridgeDist = y - ridgeLine;
  h += 0.35 * Math.exp(-ridgeDist * ridgeDist / 3600)
     * Math.exp(-((x - 280) * (x - 280)) / 80000);

  // Secondary spur ridge branching south
  const spur = 240 + 0.8 * (x - 300);
  const spurDist = y - spur;
  h += 0.20 * Math.exp(-spurDist * spurDist / 2000)
     * Math.exp(-((x - 350) * (x - 350)) / 20000);

  // River valley carving through — sinuous drainage lowering elevation
  const riverX = 320 + 60 * Math.sin(y * 0.008) + 25 * Math.sin(y * 0.022 + 1.5);
  const riverDist = x - riverX;
  h -= 0.25 * Math.exp(-riverDist * riverDist / 900);

  // Tributary joining from the east
  const tribY = 250 + 40 * Math.sin(x * 0.012);
  const tribDist = y - tribY;
  h -= 0.12 * Math.exp(-tribDist * tribDist / 600)
     * (1 / (1 + Math.exp(-(x - 380) / 40)));

  // Gentle base elevation so outer contours exist
  h += 0.08 * Math.exp(-((x - 350) * (x - 350) + (y - 280) * (y - 280)) / 120000);

  return Math.max(0, h);
}

const TOPO_GRID: number[][] = [];
for (let iy = 0; iy <= TOPO_NY; iy++) {
  const row: number[] = [];
  for (let ix = 0; ix <= TOPO_NX; ix++) {
    row.push(topoHeight(ix * TOPO_CELL, iy * TOPO_CELL));
  }
  TOPO_GRID.push(row);
}

function extractContour(level: number): string[] {
  const segments: [number, number, number, number][] = [];

  for (let iy = 0; iy < TOPO_NY; iy++) {
    for (let ix = 0; ix < TOPO_NX; ix++) {
      const tl = TOPO_GRID[iy][ix];
      const tr = TOPO_GRID[iy][ix + 1];
      const br = TOPO_GRID[iy + 1][ix + 1];
      const bl = TOPO_GRID[iy + 1][ix];

      const config =
        (tl >= level ? 8 : 0) |
        (tr >= level ? 4 : 0) |
        (br >= level ? 2 : 0) |
        (bl >= level ? 1 : 0);

      if (config === 0 || config === 15) continue;

      const x0 = ix * TOPO_CELL, y0 = iy * TOPO_CELL;
      const x1 = x0 + TOPO_CELL, y1 = y0 + TOPO_CELL;

      const lerp = (a: number, b: number, va: number, vb: number) => {
        if (Math.abs(vb - va) < 1e-10) return (a + b) / 2;
        const t = Math.max(0, Math.min(1, (level - va) / (vb - va)));
        return a + t * (b - a);
      };

      const top: [number, number] = [lerp(x0, x1, tl, tr), y0];
      const right: [number, number] = [x1, lerp(y0, y1, tr, br)];
      const bottom: [number, number] = [lerp(x0, x1, bl, br), y1];
      const left: [number, number] = [x0, lerp(y0, y1, tl, bl)];

      const add = (a: [number, number], b: [number, number]) =>
        segments.push([a[0], a[1], b[0], b[1]]);

      const avg = (tl + tr + br + bl) / 4;

      switch (config) {
        case 1: add(left, bottom); break;
        case 2: add(bottom, right); break;
        case 3: add(left, right); break;
        case 4: add(top, right); break;
        case 5:
          if (avg >= level) { add(left, top); add(bottom, right); }
          else { add(left, bottom); add(top, right); }
          break;
        case 6: add(top, bottom); break;
        case 7: add(left, top); break;
        case 8: add(top, left); break;
        case 9: add(top, bottom); break;
        case 10:
          if (avg >= level) { add(top, right); add(left, bottom); }
          else { add(top, left); add(bottom, right); }
          break;
        case 11: add(top, right); break;
        case 12: add(left, right); break;
        case 13: add(bottom, right); break;
        case 14: add(left, bottom); break;
      }
    }
  }

  // Join segments into polylines via endpoint hashing
  const EPS = 0.5;
  const k = (x: number, y: number) => `${Math.round(x / EPS)},${Math.round(y / EPS)}`;

  type Seg = { s: [number, number]; e: [number, number]; used: boolean };
  const segs: Seg[] = segments.map(([x1, y1, x2, y2]) => ({
    s: [x1, y1], e: [x2, y2], used: false,
  }));

  const endMap = new Map<string, number[]>();
  for (let i = 0; i < segs.length; i++) {
    for (const pt of [segs[i].s, segs[i].e]) {
      const key = k(pt[0], pt[1]);
      if (!endMap.has(key)) endMap.set(key, []);
      endMap.get(key)!.push(i);
    }
  }

  const chains: [number, number][][] = [];

  for (let i = 0; i < segs.length; i++) {
    if (segs[i].used) continue;
    segs[i].used = true;
    const chain: [number, number][] = [segs[i].s, segs[i].e];

    for (const pickHead of [false, true]) {
      let grew = true;
      while (grew) {
        grew = false;
        const tip = pickHead ? chain[0] : chain[chain.length - 1];
        const key = k(tip[0], tip[1]);
        const cands = endMap.get(key);
        if (!cands) break;
        for (const j of cands) {
          if (segs[j].used) continue;
          const match = k(segs[j].s[0], segs[j].s[1]) === key;
          const pt = match ? segs[j].e : segs[j].s;
          if (pickHead) chain.unshift(pt); else chain.push(pt);
          segs[j].used = true;
          grew = true;
          break;
        }
      }
    }

    if (chain.length >= 3) chains.push(chain);
  }

  // Smooth with quadratic Bezier through midpoints
  return chains.map(pts => {
    if (pts.length < 2) return "";
    if (pts.length === 2)
      return `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} L${pts[1][0].toFixed(1)},${pts[1][1].toFixed(1)}`;

    const closed =
      Math.abs(pts[0][0] - pts[pts.length - 1][0]) < EPS * 2 &&
      Math.abs(pts[0][1] - pts[pts.length - 1][1]) < EPS * 2;

    const mid = (a: [number, number], b: [number, number]): [number, number] =>
      [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

    if (closed) {
      const m0 = mid(pts[pts.length - 1], pts[0]);
      let d = `M${m0[0].toFixed(1)},${m0[1].toFixed(1)}`;
      for (let i = 0; i < pts.length; i++) {
        const m = mid(pts[i], pts[(i + 1) % pts.length]);
        d += ` Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${m[0].toFixed(1)},${m[1].toFixed(1)}`;
      }
      return d + "Z";
    }

    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const m = mid(pts[i], pts[i + 1]);
      d += ` Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${m[0].toFixed(1)},${m[1].toFixed(1)}`;
    }
    const last = pts[pts.length - 1];
    d += ` L${last[0].toFixed(1)},${last[1].toFixed(1)}`;
    return d;
  }).filter(Boolean);
}

// Pre-compute contour paths
const CONTOUR_DATA: { level: number; paths: string[]; isIndex: boolean }[] = [];
{
  let idx = 0;
  for (let l = 0.03; l < 1.1; l += 0.025) {
    CONTOUR_DATA.push({ level: l, paths: extractContour(l), isIndex: idx % 5 === 0 });
    idx++;
  }
}

function TopoMap3D() {
  return (
    <svg
      viewBox={`0 0 ${TOPO_W} ${TOPO_H}`}
      preserveAspectRatio="xMinYMin meet"
      className="absolute"
      style={{ top: 0, left: 0, width: "100%", height: "100%" }}
    >
      <defs>
        {/* Fade edges so contours blend into the background */}
        <radialGradient id="topoFade" cx="12%" cy="10%" r="42%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="45%" stopColor="white" stopOpacity="0.7" />
          <stop offset="75%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="topoMask">
          <rect x="0" y="0" width={TOPO_W} height={TOPO_H} fill="url(#topoFade)" />
        </mask>
      </defs>

      <g mask="url(#topoMask)">
        {CONTOUR_DATA.map(({ level, paths, isIndex }) =>
          paths.map((d, j) => (
            <path
              key={`c${level.toFixed(2)}-${j}`}
              d={d}
              fill="none"
              stroke={isIndex ? "rgba(140,130,115,0.35)" : "rgba(150,140,125,0.18)"}
              strokeWidth={isIndex ? 1.5 : 0.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))
        )}
      </g>
    </svg>
  );
}

const QUESTION = "Where is the best place to purchase property for new company headquarters for our billion dollar company Manthano?";

type Phase = "idle" | "opening" | "open" | "windowed" | "typing" | "done";

const reveal = (visible: boolean, delay: number): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(14px)",
  transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
});

export default function EnterpriseHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [cursorOn, setCursorOn] = useState(true);

  // Intersection observer — kick off animation when section enters view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
          setTimeout(() => setPhase("opening"), 400);
        }
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Phase sequencer
  useEffect(() => {
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("open"), 1100);
      return () => clearTimeout(t);
    }
    if (phase === "open") {
      const t = setTimeout(() => setPhase("windowed"), 600);
      return () => clearTimeout(t);
    }
    if (phase === "windowed") {
      const t = setTimeout(() => setPhase("typing"), 700);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Typewriter
  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(QUESTION.slice(0, i));
      if (i >= QUESTION.length) {
        clearInterval(id);
        setPhase("done");
      }
    }, 38);
    return () => clearInterval(id);
  }, [phase]);

  // Cursor blink
  useEffect(() => {
    if (phase === "idle" || phase === "opening" || phase === "open") return;
    const id = setInterval(() => setCursorOn(c => !c), 520);
    return () => clearInterval(id);
  }, [phase]);

  const windowVisible = phase === "windowed" || phase === "typing" || phase === "done";
  const showTyped = phase === "typing" || phase === "done";

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#F2F4F8" }}
    >
      {/* ── Blue gradient from bottom ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0, 102, 204, 0.15) 0%, rgba(0, 102, 204, 0.10) 50%, rgba(0, 102, 204, 0.04) 80%, transparent 100%)",
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* ── Island topography contour lines — top corners ── */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: "50%", zIndex: 0 }}
        viewBox="0 0 1440 500"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
        aria-hidden
      >
        {(() => {
          // Island peaks — clustered in top-left and top-right corners
          const islands = [
            // Top-left cluster
            { x: 80, y: 70, h: 1.0, sx: 90, sy: 70 },
            { x: 200, y: 120, h: 0.75, sx: 70, sy: 55 },
            { x: 50, y: 180, h: 0.55, sx: 55, sy: 65 },
            { x: 300, y: 60, h: 0.40, sx: 50, sy: 40 },
            { x: 160, y: 220, h: 0.30, sx: 40, sy: 35 },
            // Top-right cluster
            { x: 1350, y: 60, h: 0.90, sx: 85, sy: 65 },
            { x: 1220, y: 130, h: 0.65, sx: 65, sy: 55 },
            { x: 1400, y: 170, h: 0.50, sx: 55, sy: 60 },
            { x: 1120, y: 70, h: 0.35, sx: 45, sy: 38 },
            { x: 1280, y: 230, h: 0.28, sx: 40, sy: 45 },
            // Faint standalone contour shapes in the center — not touching corner islands
            { x: 580, y: 60, h: 0.05, sx: 45, sy: 30 },
            { x: 750, y: 90, h: 0.04, sx: 40, sy: 28 },
            { x: 900, y: 45, h: 0.05, sx: 38, sy: 25 },
          ];

          const heightAt = (x: number, y: number) => {
            let h = 0;
            for (const p of islands) {
              const dx = x - p.x, dy = y - p.y;
              h += p.h * Math.exp(-(dx * dx) / (2 * p.sx * p.sx) - (dy * dy) / (2 * p.sy * p.sy));
            }
            return h;
          };

          // Generate closed contour rings using marching squares on a coarse grid
          const cell = 6;
          const nx = Math.ceil(1440 / cell);
          const ny = Math.ceil(500 / cell);
          const grid: number[][] = [];
          for (let iy = 0; iy <= ny; iy++) {
            const row: number[] = [];
            for (let ix = 0; ix <= nx; ix++) row.push(heightAt(ix * cell, iy * cell));
            grid.push(row);
          }

          const contours: { level: number; isIndex: boolean }[] = [];
          let idx = 0;
          for (let l = 0.06; l < 1.0; l += 0.04) {
            contours.push({ level: l, isIndex: idx % 5 === 0 });
            idx++;
          }

          const paths: React.ReactElement[] = [];

          for (const { level, isIndex } of contours) {
            const segs: [number, number, number, number][] = [];
            for (let iy = 0; iy < ny; iy++) {
              for (let ix = 0; ix < nx; ix++) {
                const tl = grid[iy][ix], tr = grid[iy][ix + 1];
                const br = grid[iy + 1][ix + 1], bl = grid[iy + 1][ix];
                const cfg = (tl >= level ? 8 : 0) | (tr >= level ? 4 : 0) | (br >= level ? 2 : 0) | (bl >= level ? 1 : 0);
                if (cfg === 0 || cfg === 15) continue;
                const x0 = ix * cell, y0 = iy * cell, x1 = x0 + cell, y1 = y0 + cell;
                const lerp = (a: number, b: number, va: number, vb: number) =>
                  Math.abs(vb - va) < 1e-10 ? (a + b) / 2 : a + Math.max(0, Math.min(1, (level - va) / (vb - va))) * (b - a);
                const top: [number, number] = [lerp(x0, x1, tl, tr), y0];
                const right: [number, number] = [x1, lerp(y0, y1, tr, br)];
                const bottom: [number, number] = [lerp(x0, x1, bl, br), y1];
                const left: [number, number] = [x0, lerp(y0, y1, tl, bl)];
                const add = (a: [number, number], b: [number, number]) => segs.push([a[0], a[1], b[0], b[1]]);
                const avg = (tl + tr + br + bl) / 4;
                switch (cfg) {
                  case 1: add(left, bottom); break; case 2: add(bottom, right); break;
                  case 3: add(left, right); break; case 4: add(top, right); break;
                  case 5: if (avg >= level) { add(left, top); add(bottom, right); } else { add(left, bottom); add(top, right); } break;
                  case 6: add(top, bottom); break; case 7: add(left, top); break;
                  case 8: add(top, left); break; case 9: add(top, bottom); break;
                  case 10: if (avg >= level) { add(top, right); add(left, bottom); } else { add(top, left); add(bottom, right); } break;
                  case 11: add(top, right); break; case 12: add(left, right); break;
                  case 13: add(bottom, right); break; case 14: add(left, bottom); break;
                }
              }
            }

            // Join segments into polylines
            const EPS = 0.5;
            const k = (x: number, y: number) => `${Math.round(x / EPS)},${Math.round(y / EPS)}`;
            type Seg = { s: [number, number]; e: [number, number]; used: boolean };
            const ss: Seg[] = segs.map(([a, b, c, d]) => ({ s: [a, b], e: [c, d], used: false }));
            const endMap = new Map<string, number[]>();
            for (let i = 0; i < ss.length; i++) {
              for (const pt of [ss[i].s, ss[i].e]) {
                const key = k(pt[0], pt[1]);
                if (!endMap.has(key)) endMap.set(key, []);
                endMap.get(key)!.push(i);
              }
            }
            for (let i = 0; i < ss.length; i++) {
              if (ss[i].used) continue;
              ss[i].used = true;
              const chain: [number, number][] = [ss[i].s, ss[i].e];
              for (const pickHead of [false, true]) {
                let grew = true;
                while (grew) {
                  grew = false;
                  const tip = pickHead ? chain[0] : chain[chain.length - 1];
                  const cands = endMap.get(k(tip[0], tip[1]));
                  if (!cands) break;
                  for (const j of cands) {
                    if (ss[j].used) continue;
                    const match = k(ss[j].s[0], ss[j].s[1]) === k(tip[0], tip[1]);
                    const pt = match ? ss[j].e : ss[j].s;
                    if (pickHead) chain.unshift(pt); else chain.push(pt);
                    ss[j].used = true;
                    grew = true;
                    break;
                  }
                }
              }
              if (chain.length < 3) continue;
              const d = chain.map((p, pi) => `${pi === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
              paths.push(
                <path
                  key={`c${level.toFixed(2)}-${i}`}
                  d={d}
                  stroke={`rgba(37,99,235,${isIndex ? 0.22 : 0.11})`}
                  strokeWidth={isIndex ? 1.2 : 0.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              );
            }
          }
          return paths;
        })()}
      </svg>

      {/* ── 3D wireframe mesh mountains — bottom area ── */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ height: "52%", zIndex: 0 }}
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        aria-hidden
      >
        {/* Horizontal mesh lines — terrain surface */}
        {Array.from({ length: 40 }, (_, row) => {
          const baseY = 140 + row * 12;
          const depth = row / 40;
          const perspective = 1 - depth * 0.6;
          const pts = Array.from({ length: 145 }, (_, col) => {
            const x = col * 10;
            // Multiple peaks forming a mountain range
            const p1x = 360, p1y = 320, h1 = 180, s1 = 35000;
            const p2x = 720, p2y = 290, h2 = 220, s2 = 50000;
            const p3x = 1060, p3y = 340, h3 = 150, s3 = 30000;
            const p4x = 540, p4y = 380, h4 = 100, s4 = 20000;
            const p5x = 900, p5y = 350, h5 = 120, s5 = 25000;
            const d1 = (x - p1x) ** 2 + (baseY - p1y) ** 2;
            const d2 = (x - p2x) ** 2 + (baseY - p2y) ** 2;
            const d3 = (x - p3x) ** 2 + (baseY - p3y) ** 2;
            const d4 = (x - p4x) ** 2 + (baseY - p4y) ** 2;
            const d5 = (x - p5x) ** 2 + (baseY - p5y) ** 2;
            const elev = (
              h1 * Math.exp(-d1 / s1) +
              h2 * Math.exp(-d2 / s2) +
              h3 * Math.exp(-d3 / s3) +
              h4 * Math.exp(-d4 / s4) +
              h5 * Math.exp(-d5 / s5) +
              8 * Math.sin(x * 0.008 + baseY * 0.006)
            ) * perspective;
            return `${x},${(baseY - elev).toFixed(1)}`;
          }).join(" ");
          const opacity = (0.04 + perspective * 0.20).toFixed(2);
          return (
            <polyline
              key={`mh${row}`}
              points={pts}
              stroke={`rgba(37,99,235,${opacity})`}
              strokeWidth={0.7}
              fill="none"
            />
          );
        })}
        {/* Vertical mesh lines — wireframe depth */}
        {Array.from({ length: 73 }, (_, col) => {
          const x = col * 20;
          const pts = Array.from({ length: 40 }, (_, row) => {
            const baseY = 140 + row * 12;
            const depth = row / 40;
            const perspective = 1 - depth * 0.6;
            const p1x = 360, p1y = 320, h1 = 180, s1 = 35000;
            const p2x = 720, p2y = 290, h2 = 220, s2 = 50000;
            const p3x = 1060, p3y = 340, h3 = 150, s3 = 30000;
            const p4x = 540, p4y = 380, h4 = 100, s4 = 20000;
            const p5x = 900, p5y = 350, h5 = 120, s5 = 25000;
            const d1 = (x - p1x) ** 2 + (baseY - p1y) ** 2;
            const d2 = (x - p2x) ** 2 + (baseY - p2y) ** 2;
            const d3 = (x - p3x) ** 2 + (baseY - p3y) ** 2;
            const d4 = (x - p4x) ** 2 + (baseY - p4y) ** 2;
            const d5 = (x - p5x) ** 2 + (baseY - p5y) ** 2;
            const elev = (
              h1 * Math.exp(-d1 / s1) +
              h2 * Math.exp(-d2 / s2) +
              h3 * Math.exp(-d3 / s3) +
              h4 * Math.exp(-d4 / s4) +
              h5 * Math.exp(-d5 / s5) +
              8 * Math.sin(x * 0.008 + baseY * 0.006)
            ) * perspective;
            return `${x},${(baseY - elev).toFixed(1)}`;
          }).join(" ");
          return (
            <polyline
              key={`mv${col}`}
              points={pts}
              stroke="rgba(37,99,235,0.05)"
              strokeWidth={0.4}
              fill="none"
            />
          );
        })}
      </svg>

      {/* ── Toggle ── */}
      <div className="relative z-10 flex justify-center pt-32 pb-10 px-6" style={reveal(visible, 0)}>
        <ConsumerEnterpriseToggle variant="light" active="enterprise" />
      </div>

      {/* ── Text block ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6" style={reveal(visible, 0.1)}>
        <h1
          className="text-[#1D1D1F] leading-[1.1] text-[39px] md:text-[49px] lg:text-[76px]"
          style={{ fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 900 }}
        >
          An Agentic GIS platform
        </h1>

        <p
          className="mt-5"
          style={{ fontSize: 21, color: "rgba(10,19,68,0.40)", letterSpacing: "-0.01em", fontWeight: 400, maxWidth: 480 }}
        >
          GIS so easy, the janitor could be your new researcher
        </p>

        <Link
          href="/contact"
          className="flex items-center justify-center mt-8 whitespace-nowrap transition-colors duration-200"
          style={{
            height: 46,
            paddingLeft: 28,
            paddingRight: 28,
            fontSize: 15,
            fontWeight: 500,
            color: "white",
            backgroundColor: "#0A1344",
            borderRadius: 6,
            letterSpacing: "-0.01em",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#1a2a5e"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#0A1344"; }}
        >
          Talk to us
        </Link>
      </div>

      {/* ── Desktop monitor mockup ── */}
      <div
        className="relative z-10 flex justify-center w-full"
        style={{ marginTop: "clamp(48px, 6vw, 80px)", paddingLeft: 20, paddingRight: 20, ...reveal(visible, 0.22) }}
      >
        <div style={{ width: "100%", maxWidth: 1100, position: "relative" }}>
          {/* Monitor frame */}
          <div
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: "#1D1D1F",
              borderRadius: "clamp(12px, 1.6vw, 24px)",
              padding: "clamp(6px, 0.8vw, 12px)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.18), 0 12px 32px rgba(0,0,0,0.10)",
            }}
          >
            {/* Screen area */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                borderRadius: "clamp(4px, 0.5vw, 8px)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                opacity: windowVisible ? 1 : 0,
                transform: windowVisible ? "scale(1) translateY(0)" : "scale(0.97) translateY(8px)",
                transition: "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
              }}
            >

              {/* Window title bar */}
              <div style={{
                height: "6%", minHeight: 20,
                backgroundColor: "#F5F5F7",
                borderBottom: "1px solid rgba(0,0,0,0.10)",
                display: "flex", alignItems: "center",
                paddingLeft: "1.5%", gap: "0.55%", flexShrink: 0, position: "relative",
              }}>
                {(["#FF5F57","#FEBC2E","#28C840"] as const).map(c => (
                  <div key={c} style={{ width: "1.3%", aspectRatio: "1", minWidth: 7, borderRadius: "50%", backgroundColor: c }} />
                ))}
                <div style={{
                  position: "absolute", left: "50%", transform: "translateX(-50%)",
                  height: "62%", width: "20%", minWidth: 60,
                  backgroundColor: "rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.09)",
                  borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(0,0,0,0.40)", userSelect: "none" }}>columbus.earth/pro</span>
                </div>
              </div>

              {/* App top navbar */}
              <div style={{
                height: "7%", minHeight: 22,
                backgroundColor: "#fff",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                display: "flex", alignItems: "center",
                paddingLeft: "1.2%", paddingRight: "1.5%",
                flexShrink: 0, gap: "0.8%",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3vw", marginRight: "0.6%" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: "clamp(8px,1.1vw,14px)", height: "1px", backgroundColor: "#0A1344" }} />)}
                </div>
                <div style={{ width: "clamp(10px,1.4vw,18px)", height: "clamp(10px,1.4vw,18px)", borderRadius: "50%", backgroundColor: "#0A1344", opacity: 0.85 }} />
                <span style={{ fontSize: "clamp(7px,0.75vw,11px)", fontWeight: 600, color: "#0A1344", letterSpacing: "-0.01em" }}>Columbus</span>
                <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(10,19,68,0.35)" }}>/</span>
                <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(10,19,68,0.45)" }}>untitled chat</span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.8%" }}>
                  {["Report View","Save Mapshot","Edits not saved"].map((label, i) => (
                    <div key={label} style={{
                      height: "clamp(12px,1.4vw,20px)",
                      paddingLeft: "0.6%", paddingRight: "0.6%",
                      border: `1px solid ${i === 2 ? "transparent" : "rgba(10,19,68,0.18)"}`,
                      borderRadius: 3,
                      display: "flex", alignItems: "center",
                      fontSize: "clamp(5px,0.58vw,9px)", color: i === 2 ? "rgba(10,19,68,0.35)" : "#0A1344",
                      whiteSpace: "nowrap",
                    }}>{label}</div>
                  ))}
                </div>
              </div>

              {/* App body */}
              <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
                {/* Icon sidebar */}
                <div style={{
                  width: "4.5%", minWidth: 16,
                  backgroundColor: "#fff",
                  borderRight: "1px solid rgba(0,0,0,0.07)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", paddingTop: "2%", gap: "1.8%",
                  flexShrink: 0,
                }}>
                  {[
                    <svg key="grid" viewBox="0 0 16 16" fill="none" style={{ width: "55%", maxWidth: 12 }}>
                      <rect x="1" y="1" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                      <rect x="9" y="1" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                      <rect x="1" y="9" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                      <rect x="9" y="9" width="6" height="6" rx="1" stroke="#0A1344" strokeWidth="1.2" opacity="0.5"/>
                    </svg>,
                    <div key="active" style={{ width: "55%", maxWidth: 12, aspectRatio: "1", borderRadius: "50%", backgroundColor: "#0A1344" }} />,
                    <svg key="check" viewBox="0 0 16 16" fill="none" style={{ width: "55%", maxWidth: 12 }}>
                      <rect x="1" y="1" width="14" height="14" rx="2" stroke="#0A1344" strokeWidth="1.2" opacity="0.4"/>
                      <path d="M4 8l3 3 5-5" stroke="#0A1344" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
                    </svg>,
                    <svg key="layers" viewBox="0 0 16 16" fill="none" style={{ width: "55%", maxWidth: 12 }}>
                      <path d="M8 1L14 5L8 9L2 5L8 1Z" stroke="#0A1344" strokeWidth="1.2" opacity="0.4"/>
                      <path d="M2 9l6 4 6-4" stroke="#0A1344" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
                    </svg>,
                  ]}
                </div>

                {/* Chat panel */}
                <div style={{
                  width: "30%",
                  backgroundColor: "#fff",
                  borderRight: "1px solid rgba(0,0,0,0.07)",
                  display: "flex", flexDirection: "column",
                  flexShrink: 0, position: "relative",
                }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8% 6%" }}>
                    {showTyped ? (
                      <span style={{ fontSize: "clamp(7px,0.85vw,13px)", color: "#0A1344", letterSpacing: "-0.01em", lineHeight: 1.4, alignSelf: "flex-start", width: "100%" }}>
                        {typed}
                        <span style={{ opacity: cursorOn ? 1 : 0, transition: "opacity 0.1s", borderRight: "1.5px solid #0A1344", marginLeft: 1 }}>&nbsp;</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: "clamp(7px,0.85vw,13px)", fontWeight: 500, color: "#0A1344", letterSpacing: "-0.01em" }}>
                        Where should we begin?
                      </span>
                    )}
                  </div>
                  <div style={{
                    height: "11%", minHeight: 18,
                    borderTop: "1px solid rgba(0,0,0,0.07)",
                    display: "flex", alignItems: "center",
                    paddingLeft: "5%", paddingRight: "3%", gap: "3%",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(10,19,68,0.30)", flex: 1 }}>Ask Columbus</span>
                    <div style={{
                      width: "clamp(12px,1.6vw,22px)", height: "clamp(12px,1.6vw,22px)",
                      borderRadius: "50%", backgroundColor: "#0A1344",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg viewBox="0 0 10 10" fill="none" style={{ width: "50%" }}>
                        <path d="M2 8L8 2M8 2H4M8 2V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Map panel */}
                <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                  <Image
                    src="/enterprise/mapchat.png"
                    alt=""
                    fill
                    className="object-cover object-center"
                  />
                  <div style={{
                    position: "absolute", right: "2%", top: "50%", transform: "translateY(-50%)",
                    display: "flex", flexDirection: "column", gap: 1,
                    backgroundColor: "#fff",
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: 4, overflow: "hidden",
                  }}>
                    {["+","−"].map(s => (
                      <div key={s} style={{
                        width: "clamp(12px,1.5vw,20px)", height: "clamp(12px,1.5vw,20px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "clamp(8px,0.9vw,13px)", color: "#0A1344", cursor: "pointer",
                        borderBottom: s === "+" ? "1px solid rgba(0,0,0,0.10)" : "none",
                      }}>{s}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monitor stand neck */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "clamp(80px, 10%, 130px)",
              height: "clamp(40px, 5vw, 70px)",
              background: "linear-gradient(180deg, #2A2A2C 0%, #3A3A3C 100%)",
            }} />
          </div>

          {/* Monitor stand base */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "clamp(180px, 25%, 320px)",
              height: "clamp(10px, 1.2vw, 16px)",
              background: "linear-gradient(180deg, #3A3A3C 0%, #505052 100%)",
              borderRadius: "0 0 6px 6px",
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}
