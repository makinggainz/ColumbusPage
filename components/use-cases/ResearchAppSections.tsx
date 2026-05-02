"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

// ─── Shared helpers ────────────────────────────────────────────────────────

function MapPanel({
  title,
  imageSrc,
  children,
}: {
  title: string;
  imageSrc: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-[640px] max-lg:h-[560px] max-md:h-[440px] overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease" }}
    >
      <Image src={imageSrc} alt="" fill className="object-cover" />
      <div
        className="absolute top-0 left-0 right-0 h-[160px] pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom,rgba(0,0,0,.68) 0%,rgba(0,0,0,.3) 55%,transparent 100%)" }}
        aria-hidden
      />
      <h2 className="absolute top-6 left-6 z-20 text-white text-[24px] md:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.1] m-0">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Predicting future visual ──────────────────────────────────────────────

function PredictingFutureVisual() {
  const items = [
    { label: "Foot traffic +6 months", val: "+18%", up: true },
    { label: "Commercial vacancy forecast", val: "−4.2%", up: false },
    { label: "Gentrification pressure", val: "High", warn: true },
    { label: "Crime index forecast", val: "−11%", up: false },
  ];
  return (
    <MapPanel title="Predicting the future" imageSrc="/ConsumerPageCity.png">
      <div className="absolute bottom-8 left-6 right-6 z-20 grid grid-cols-2 gap-3 max-md:grid-cols-1">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-xl px-4 py-3 backdrop-blur-md flex items-center justify-between gap-3"
            style={{ background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.16)" }}
          >
            <span className="text-white/80 text-[13px] leading-snug">{it.label}</span>
            <span
              className="shrink-0 text-[14px] font-semibold"
              style={{ color: it.warn ? "#fb923c" : it.up ? "#4ade80" : "#60a5fa" }}
            >
              {it.val}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute top-20 right-6 z-20 flex flex-col gap-1 items-end">
        {["2025", "2026 ▸", "2027", "2028"].map((yr, i) => (
          <span
            key={yr}
            className="text-[11px] font-mono px-2 py-0.5 rounded"
            style={{
              background: i === 1 ? "rgba(59,130,246,.7)" : "rgba(0,0,0,.35)",
              color: i === 1 ? "#fff" : "rgba(255,255,255,.5)",
            }}
          >
            {yr}
          </span>
        ))}
      </div>
    </MapPanel>
  );
}

// ─── Creative data layers visual ──────────────────────────────────────────

function CreativeDataLayersVisual() {
  const layers = [
    { label: "Solar Potential", color: "rgba(234,179,8,.85)" },
    { label: "Foot Traffic Density", color: "rgba(59,130,246,.85)" },
    { label: "Safety Score", color: "rgba(34,197,94,.85)" },
    { label: "Vibrancy Index", color: "rgba(168,85,247,.85)" },
    { label: "Heat Risk", color: "rgba(239,68,68,.85)" },
    { label: "Green Cover", color: "rgba(20,184,166,.85)" },
  ];
  return (
    <MapPanel title="Creative data layers" imageSrc="/HK Map-2.png">
      <div
        className="absolute bottom-8 left-6 right-6 z-20 rounded-2xl p-5 backdrop-blur-md"
        style={{ background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.18)" }}
      >
        <p className="text-white/55 text-[11px] uppercase tracking-widest mb-3 font-medium">Active layers</p>
        <div className="flex flex-wrap gap-2">
          {layers.map((l) => (
            <span
              key={l.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[12px] font-medium"
              style={{ background: l.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
              {l.label}
            </span>
          ))}
        </div>
        <p className="text-white/45 text-[12px] mt-3">
          Prompt Columbus to generate any data layer on demand — no surveying required.
        </p>
      </div>
    </MapPanel>
  );
}

// ─── Generative Surveying — long sticky scroll (3 tiles) ──────────────────

type SurveyTile = { kicker: string; title: string; prompt: string; stat: string; statLabel: string };

const SURVEY_TILES: SurveyTile[] = [
  {
    kicker: "Columbus GenSurvey",
    title: "Rooftop Solar Mapping",
    prompt: "estimate solar installation viability for every building in this district",
    stat: "98%",
    statLabel: "Coverage vs manual survey",
  },
  {
    kicker: "Columbus GenSurvey",
    title: "Pedestrian Flow Analysis",
    prompt: "model pedestrian density and movement patterns at peak hours",
    stat: "< 2 min",
    statLabel: "Time to generate vs weeks of fieldwork",
  },
  {
    kicker: "Columbus GenSurvey",
    title: "Structural Condition Index",
    prompt: "assess building structural conditions from imagery and urban data",
    stat: "10×",
    statLabel: "Faster than traditional inspection",
  },
];

// Tile-bucket boundaries (same math as GenLayersSection)
const TILE_BUCKETS = [
  { start: 0, end: 0.46 },
  { start: 0.46, end: 0.73 },
  { start: 0.73, end: 1 },
];
const TRAVEL_VH = 2;
const STICKY_TOP_VH = 0.15;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function GenerativeSurveyingSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const promptRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const textRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const progressRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const [activeTile, setActiveTile] = useState(0);

  // Map images per tile (reuse existing public assets)
  const tileImages = ["/barca.png", "/HK Map-2.png", "/tokyo.png"];

  useEffect(() => {
    const node = outerRef.current;
    if (!node) return;
    let rafId = 0;
    let lastTile = 0;
    let lastRaw = 0;

    const update = () => {
      rafId = 0;
      const rect = node.getBoundingClientRect();
      const stickyTopPx = window.innerHeight * STICKY_TOP_VH;
      const extraPx = window.innerHeight * TRAVEL_VH;
      const raw = clamp01((stickyTopPx - rect.top) / extraPx);

      const introOp = clamp01(1 - (raw - 0.1) / 0.1);
      if (introRef.current) introRef.current.style.opacity = introOp.toString();

      for (let i = 0; i < TILE_BUCKETS.length; i++) {
        const b = TILE_BUCKETS[i];
        const inBucket = raw >= b.start && raw < b.end;
        const local = raw >= b.end ? 1 : inBucket ? (raw - b.start) / (b.end - b.start) : 0;

        const promptEl = promptRefs.current[i];
        if (promptEl) promptEl.style.opacity = (inBucket && local >= 0.2 ? 1 : 0).toString();

        const textEl = textRefs.current[i];
        if (textEl) textEl.style.opacity = (inBucket && local >= 0.5 ? 1 : 0).toString();

        const segEl = progressRefs.current[i];
        if (segEl) segEl.style.width = `${(local * 100).toFixed(2)}%`;
      }

      if (raw !== lastRaw) lastRaw = raw;
      let next = 0;
      if (raw >= 0.73) next = 2;
      else if (raw >= 0.46) next = 1;
      if (next !== lastTile) { lastTile = next; setActiveTile(next); }
    };

    const onScroll = () => { if (rafId === 0) rafId = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative w-full bg-[#060810]" style={{ overflow: "hidden" }}>
      {/* Section intro label */}
      <div className="relative z-10 max-w-[1287px] mx-auto px-6 pt-20 pb-10">
        <span className="text-white/40 text-[11px] uppercase tracking-widest font-medium">Research application</span>
        <h2 className="text-white text-[36px] md:text-[48px] font-medium tracking-[-0.02em] leading-[1.15] mt-3 max-w-[640px]">
          Generative surveying
        </h2>
        <p className="text-white/55 text-[16px] leading-[1.6] mt-4 max-w-[520px]">
          Columbus-01 generates comprehensive geospatial surveys from prompts alone — replacing weeks of expensive fieldwork with seconds of AI inference.
        </p>
      </div>

      {/* Sticky scroll outer — 270vh total (70vh sticky + 200vh travel) */}
      <div ref={outerRef} style={{ height: `${(1 + TRAVEL_VH) * 100}vh` }}>
        <div
          style={{
            position: "sticky",
            top: `${STICKY_TOP_VH * 100}vh`,
            height: `${(1 - STICKY_TOP_VH) * 100}vh`,
          }}
        >
          {/* Tiles row */}
          <div
            className="relative w-full h-full flex"
            style={{ overflow: "hidden" }}
          >
            {SURVEY_TILES.map((tile, i) => {
              const isActive = i === activeTile;
              return (
                <div
                  key={tile.title}
                  ref={(el) => { tileRefs.current[i] = el; }}
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: isActive ? 1 : 0.08 }}
                >
                  <Image
                    src={tileImages[i]}
                    alt=""
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                  {/* dark tint */}
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Prompt box — top left */}
                  <div
                    ref={(el) => { promptRefs.current[i] = el; }}
                    className="absolute top-8 left-8 z-20 max-w-[340px] rounded-xl px-4 py-3 backdrop-blur-md transition-opacity duration-300"
                    style={{ opacity: 0, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.2)" }}
                  >
                    <span className="text-white/50 text-[11px] uppercase tracking-widest block mb-1">Prompt</span>
                    <span className="text-white text-[14px] leading-snug">&ldquo;{tile.prompt}&rdquo;</span>
                  </div>

                  {/* Stat badge — top right */}
                  <div
                    ref={(el) => { textRefs.current[i] = el; }}
                    className="absolute bottom-14 left-8 z-20 transition-opacity duration-300"
                    style={{ opacity: 0 }}
                  >
                    <div
                      className="rounded-2xl px-6 py-4 backdrop-blur-md"
                      style={{ background: "rgba(6,8,16,.72)", border: "1px solid rgba(255,255,255,.14)" }}
                    >
                      <span className="text-white/50 text-[11px] uppercase tracking-widest block mb-1">{tile.kicker}</span>
                      <span className="text-white text-[28px] font-semibold tracking-tight block leading-none">{tile.stat}</span>
                      <span className="text-white/60 text-[12px] mt-1 block">{tile.statLabel}</span>
                      <span className="text-white text-[18px] font-medium mt-2 block">{tile.title}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Intro overlay */}
            <div
              ref={introRef}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none"
              style={{ background: "rgba(6,8,16,.82)" }}
            >
              <h3 className="text-white text-[28px] md:text-[36px] font-medium tracking-[-0.02em] leading-[1.2] text-center max-w-[560px] px-8">
                Columbus-01 surveys the earth without setting foot on it.
              </h3>
              <span className="mt-8 text-white/45 text-[13px] flex items-center gap-2">
                <svg width="14" height="20" viewBox="0 0 18 26" fill="none" aria-hidden>
                  <path d="M9 1V22M1 15l8 8 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Scroll to explore
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2"
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative h-1 w-24 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,.18)" }}
              >
                <div
                  ref={(el) => { progressRefs.current[i] = el; }}
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ width: "0%", background: "rgba(255,255,255,.85)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sticky-scroll wrapper for the two shorter sections ───────────────────

type SectionRow = {
  id: string;
  title: string;
  description: string;
  bullets?: string[];
  visual: React.ReactNode;
};

function StickyScrollBlock({ rows }: { rows: SectionRow[] }) {
  const gridLine = "rgba(10,19,68,0.10)";
  const titleColor = "#1D1D1F";
  const descColor = "rgba(29,29,31,0.75)";

  const renderRail = (row: SectionRow) => (
    <div className="max-w-[280px]">
      <h3 className="m-0 text-[18px] font-medium leading-[1.3] tracking-[-0.01em]" style={{ color: titleColor }}>
        {row.title}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.55]" style={{ color: descColor }}>
        {row.description}
      </p>
      {row.bullets && row.bullets.length > 0 && (
        <ul className="mt-3 text-[14px] leading-[1.55] space-y-1.5" style={{ color: descColor }}>
          {row.bullets.map((b) => <li key={b}>• {b}</li>)}
        </ul>
      )}
    </div>
  );

  return (
    <div className="relative w-full" style={{ backgroundColor: "#FFFFFF", ["--grid-line" as string]: gridLine }}>
      <div
        className="relative z-10 mx-5 md:mx-auto max-w-[1287px]"
        style={{ borderLeft: `1px solid ${gridLine}`, borderRight: `1px solid ${gridLine}` }}
      >
        {rows.map((row, i) => (
          <div key={row.id}>
            {i > 0 && <div className="w-full" style={{ height: 1, backgroundColor: gridLine }} />}
            <div className="relative grid grid-cols-1 lg:grid-cols-[330px_1px_1fr]">
              <div className="lg:hidden px-6 pt-10 pb-6">{renderRail(row)}</div>
              <div className="hidden lg:block bg-transparent">
                <div className="sticky top-20 px-8 py-[64px]">{renderRail(row)}</div>
              </div>
              <div className="hidden lg:block" style={{ backgroundColor: gridLine }} />
              <div className="bg-transparent">{row.visual}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative z-10 w-full" style={{ height: 1, backgroundColor: gridLine }} />
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────

export default function ResearchAppSections() {
  const shortRows: SectionRow[] = [
    {
      id: "predicting-future",
      title: "Predicting the future",
      description:
        "Columbus-01's temporal reasoning engine forecasts how any area will evolve — traffic, vacancy, risk exposure and more.",
      bullets: [
        "6-month to 5-year forecast horizons",
        "Scenario modelling & sensitivity analysis",
        "Confidence intervals on every prediction",
      ],
      visual: <PredictingFutureVisual />,
    },
    {
      id: "creative-data-layers",
      title: "Creative data layers",
      description:
        "Prompt Columbus to generate entirely new geospatial data layers on demand — no field surveys, no waiting.",
      bullets: [
        "Solar potential, vibrancy, safety scores",
        "Fully custom semantic layers",
        "Updated in real-time as conditions change",
      ],
      visual: <CreativeDataLayersVisual />,
    },
  ];

  return (
    <>
      <StickyScrollBlock rows={shortRows} />
      <GenerativeSurveyingSection />
    </>
  );
}
