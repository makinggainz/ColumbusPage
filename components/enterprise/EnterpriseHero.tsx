"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConsumerEnterpriseToggle } from "./ConsumerEnterpriseToggle";

// ── Topographic contour map with 3D drawn effect ──
// Height field + marching-squares extraction, computed once at module load

const TOPO_W = 600;
const TOPO_H = 500;
const TOPO_CELL = 5;
const TOPO_NX = Math.floor(TOPO_W / TOPO_CELL);
const TOPO_NY = Math.floor(TOPO_H / TOPO_CELL);

// Canyon / ridge chain running diagonally across the top-left corner
function topoHeight(x: number, y: number): number {
  // Diagonal axis — cliff edge runs at ~35° from top-left
  const ang = 0.62;
  const cosA = Math.cos(ang), sinA = Math.sin(ang);
  const along = x * cosA + y * sinA;
  const perp = -x * sinA + y * cosA;

  // Organic undulations along the cliff edge
  const wave =
    28 * Math.sin(along * 0.015) +
    18 * Math.sin(along * 0.033 + 1.8) +
    9 * Math.sin(along * 0.064 + 0.7);
  const ep = perp - wave;

  // Main cliff face — sigmoid creates open contour lines
  let h = 1.0 / (1 + Math.exp((ep + 10) / 32));

  // Second parallel ridge — canyon depth
  const wave2 = 14 * Math.sin(along * 0.022 + 2.5) + 8 * Math.sin(along * 0.05 + 1.0);
  const ep2 = perp - wave2;
  h += 0.3 / (1 + Math.exp((ep2 + 80) / 28));

  // Third shelf further out — more distant ridge in the chain
  const wave3 = 10 * Math.sin(along * 0.028 + 0.8);
  const ep3 = perp - wave3;
  h += 0.18 / (1 + Math.exp((ep3 + 140) / 24));

  // Spur ridges branching off the main cliff for interesting shapes
  h += 0.18 * Math.exp(-((along - 100) * (along - 100)) / 2500)
     * Math.exp(-(ep + 30) * (ep + 30) / 1800);
  h += 0.12 * Math.exp(-((along - 220) * (along - 220)) / 1800)
     * Math.exp(-(ep + 20) * (ep + 20) / 1400);

  // Small knoll / outcrop sitting on the ridge
  h += 0.14 * Math.exp(-((x - 50) * (x - 50) + (y - 40) * (y - 40)) / 600);

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
  for (let l = 0.04; l < 1.3; l += 0.028) {
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
        {/* 3D depth — warm shadow beneath each contour line */}
        <filter id="topo3d" x="-2%" y="-2%" width="104%" height="108%">
          <feDropShadow dx="0.5" dy="1.2" stdDeviation="0.8" floodColor="rgba(120,105,85,0.18)" />
        </filter>
        {/* Radial fade — tight to top-left */}
        <radialGradient id="topoFade" cx="8%" cy="6%" r="52%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="45%" stopColor="white" stopOpacity="0.8" />
          <stop offset="75%" stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="topoMask">
          <rect x="0" y="0" width={TOPO_W} height={TOPO_H} fill="url(#topoFade)" />
        </mask>
      </defs>

      <g mask="url(#topoMask)" filter="url(#topo3d)">
        {CONTOUR_DATA.map(({ level, paths, isIndex }) =>
          paths.map((d, j) => (
            <path
              key={`c${level.toFixed(2)}-${j}`}
              d={d}
              fill="none"
              stroke={isIndex ? "rgba(140,125,105,0.50)" : "rgba(150,138,120,0.28)"}
              strokeWidth={isIndex ? 2.0 : 1.0}
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

  const lidOpen = phase !== "idle" && phase !== "opening";
  const windowVisible = phase === "windowed" || phase === "typing" || phase === "done";
  const showTyped = phase === "typing" || phase === "done";

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#F9F9F9" }}
    >
      {/* Topographic contour map — top-left flowing background */}
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{ top: 0, left: 0, width: "52%", height: "70%", zIndex: 0 }}
        aria-hidden
      >
        <TopoMap3D />
      </div>

      {/* Radial blue gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 65% at 50% -5%, rgba(0, 102, 204, 0.32) 0%, rgba(0, 102, 204, 0.16) 55%, transparent 100%)",
          zIndex: 0,
        }}
        aria-hidden
      />
      {/* ── Toggle ── */}
      <div className="flex justify-center pt-32 pb-10 px-6" style={reveal(visible, 0)}>
        <ConsumerEnterpriseToggle variant="light" active="enterprise" />
      </div>

      {/* ── Text block ── */}
      <div className="flex flex-col items-center text-center px-6" style={reveal(visible, 0.1)}>
        <h1
          className="text-[#1D1D1F] leading-[1.1] text-[39px] md:text-[49px] lg:text-[76px]"
          style={{ fontWeight: 500, letterSpacing: "-0.02em", maxWidth: 900 }}
        >
          An Agentic GIS platform
        </h1>

        <p
          className="mt-5"
          style={{ fontSize: 21, color: "rgba(10,19,68,0.45)", letterSpacing: "-0.01em", fontWeight: 400, maxWidth: 480 }}
        >
          GIS so easy, the janitor could be your new researcher
        </p>

        <Link
          href="/contact"
          className="group flex items-center justify-between mt-8 whitespace-nowrap hover:opacity-90 transition-all duration-300"
          style={{ height: 45, paddingLeft: 20, paddingRight: 16, fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", backgroundColor: "#000000", color: "white", gap: 12 }}
        >
          <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Talk to us</span>
          <svg
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            width="10" height="18" viewBox="0 0 7 12" fill="none"
            stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>
      </div>

      {/* ── MacBook Pro mockup ── */}
      <div
        className="relative flex justify-center w-full"
        style={{ marginTop: "clamp(48px, 6vw, 80px)", paddingLeft: 20, paddingRight: 20, ...reveal(visible, 0.22) }}
      >
        {/* Mockup wrapper */}
        <div style={{ width: "100%", maxWidth: 1287, position: "relative" }}>

          {/* ── Lid with 3D hinge ── */}
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "63%",
              perspective: "2400px",
              perspectiveOrigin: "50% 100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "50% 100%",
                transform: lidOpen ? "rotateX(0deg)" : "rotateX(-76deg)",
                transition: phase === "opening"
                  ? "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)"
                  : phase === "idle"
                  ? "none"
                  : "none",
              }}
            >
              {/* Outer chassis */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#1D1D1F",
                  borderRadius: "clamp(10px, 1.4vw, 20px) clamp(10px, 1.4vw, 20px) 0 0",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.30), 0 12px 32px rgba(0,0,0,0.16)",
                }}
              >
                {/* Screen bezel — thin modern MacBook style */}
                <div
                  style={{
                    position: "absolute",
                    top: "1.8%",
                    left: "1.2%",
                    right: "1.2%",
                    bottom: 0,
                    backgroundColor: "#000",
                    borderRadius: "clamp(4px, 0.6vw, 8px) clamp(4px, 0.6vw, 8px) 0 0",
                    overflow: "hidden",
                  }}
                >
                  {/* Camera notch */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "clamp(8px, 1vw, 14px)",
                      height: "clamp(3px, 0.35vw, 5px)",
                      backgroundColor: "#1D1D1F",
                      borderRadius: "0 0 3px 3px",
                      zIndex: 10,
                    }}
                  />

                  {/* ── Desktop: wallpaper + floating app window ── */}
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>

                    {/* Wallpaper */}
                    <Image
                      src="/ProductBackgroundImageHome.png"
                      alt=""
                      fill
                      className="object-cover object-center"
                      priority
                    />

                    {/* macOS menu bar */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, zIndex: 2,
                      height: "3.5%", minHeight: 14,
                      backgroundColor: "rgba(236,238,245,0.55)",
                      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                      display: "flex", alignItems: "center", paddingLeft: "1.5%", gap: "0.8%",
                    }}>
                      {["rgba(0,0,0,0.55)","rgba(0,0,0,0.25)","rgba(0,0,0,0.25)","rgba(0,0,0,0.25)","rgba(0,0,0,0.18)"].map((c, i) => (
                        <div key={i} style={{ width: `${[0.9,1.8,2.4,1.8,1.4][i]}%`, height: "45%", backgroundColor: c, borderRadius: 2, minWidth: 4 }} />
                      ))}
                    </div>

                    {/* Floating app window */}
                    <div style={{
                      position: "absolute", top: "7%", left: "4%", right: "4%", bottom: "3%",
                      zIndex: 3, borderRadius: "clamp(4px,0.5vw,8px)",
                      overflow: "hidden",
                      boxShadow: "0 16px 56px rgba(0,0,0,0.42), 0 4px 14px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.14)",
                      display: "flex", flexDirection: "column",
                      backgroundColor: "#fff",
                      opacity: windowVisible ? 1 : 0,
                      transform: windowVisible ? "scale(1) translateY(0)" : "scale(0.96) translateY(10px)",
                      transition: "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                    }}>

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
                        {/* Hamburger */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.3vw", marginRight: "0.6%" }}>
                          {[0,1,2].map(i => <div key={i} style={{ width: "clamp(8px,1.1vw,14px)", height: "1px", backgroundColor: "#0A1344" }} />)}
                        </div>
                        {/* Logo mark */}
                        <div style={{ width: "clamp(10px,1.4vw,18px)", height: "clamp(10px,1.4vw,18px)", borderRadius: "50%", backgroundColor: "#0A1344", opacity: 0.85 }} />
                        <span style={{ fontSize: "clamp(7px,0.75vw,11px)", fontWeight: 600, color: "#0A1344", letterSpacing: "-0.01em" }}>Columbus</span>
                        <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(10,19,68,0.35)" }}>/</span>
                        <span style={{ fontSize: "clamp(6px,0.65vw,10px)", color: "rgba(10,19,68,0.45)" }}>untitled chat</span>
                        {/* Right actions */}
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
                          {/* Empty state / typed message */}
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
                          {/* Input bar */}
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
                          {/* Zoom controls */}
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
                </div>
              </div>
            </div>
          </div>

          {/* ── Base ── */}
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{ height: 3, backgroundColor: "#111" }} />
            <div
              style={{
                height: "clamp(16px, 2.4vw, 32px)",
                background: "linear-gradient(180deg, #2A2A2C 0%, #3A3A3C 100%)",
                borderRadius: "0 0 4px 4px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "15%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "clamp(44px, 7%, 90px)",
                  height: "42%",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: 3,
                }}
              />
            </div>
            <div style={{ height: "clamp(6px, 0.9vw, 12px)", background: "linear-gradient(180deg, #3A3A3C 0%, #505052 100%)", borderRadius: "0 0 8px 8px" }} />
            <div style={{ height: "clamp(16px, 2.5vw, 32px)", background: "radial-gradient(ellipse 75% 100% at 50% 0%, rgba(0,0,0,0.20) 0%, transparent 100%)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
