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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
    </MapPanel>
  );
}

// ─── Generative Geodata Visual (Long Scroll) ──────────────────────────────

function GenerativeGeodataVisual() {
  return (
    <div className="flex flex-col gap-0 w-full">
      {/* Visual 1: Surveying the earth with a super model */}
      <div className="relative w-full h-[640px] max-lg:h-[560px] max-md:h-[440px] overflow-hidden border-b border-[rgba(10,19,68,0.10)]">
        <Image src="/use-cases/havana.png" alt="" fill className="object-cover" />
        <div className="absolute top-0 left-0 right-0 h-[140px] pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)" }} />
        <h2 className="absolute top-6 left-6 z-20 text-white text-[24px] md:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.1] m-0">
          Surveying the earth with a super model
        </h2>
        <div className="absolute top-6 right-6 z-20 text-white/80 font-medium text-[13px] flex items-center gap-2">
          <span className="text-[16px]">🌐</span> Built on Columbus Pro
        </div>
        <div className="absolute left-[20px] top-[180px] h-[220px] w-[12px] rounded-full bg-gradient-to-b from-green-400 via-yellow-400 to-red-500 z-10" />
        <div className="absolute bottom-[24px] left-[100px] right-[160px] max-md:left-[20px] max-md:right-[20px] bg-white text-black rounded-xl shadow-xl p-5 z-20 flex items-center justify-between gap-4">
          <p className="text-[16px] md:text-[18px] leading-snug">
            I need a data layer of buildings in Havana by safety score. In the perspective of: City Planning
          </p>
          <div className="w-[32px] h-[32px] bg-[#1c2c6b] rounded-md shrink-0" />
        </div>
      </div>
      
      {/* Visual 2: Solar roof possibility */}
      <div className="relative w-full h-[640px] max-lg:h-[560px] max-md:h-[440px] overflow-hidden border-b border-[rgba(10,19,68,0.10)]">
        <Image src="/beach.png" alt="" fill className="object-cover" />
        <div className="absolute top-0 left-0 right-0 h-[140px] pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)" }} />
        <span className="absolute top-6 left-6 z-20 text-white/70 text-[12px] uppercase">Columbus GenLayer</span>
        <h2 className="absolute top-12 left-6 z-20 text-white text-[24px] md:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.1] m-0">
          Solar roof possibility
        </h2>
        <div className="absolute top-6 right-6 z-20 text-white/80 font-medium text-[13px] flex items-center gap-2">
          <span className="text-[16px]">🌐</span> Built on Columbus Pro
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-center text-[15px] md:text-[16px] bg-black/40 px-6 py-3 rounded-full backdrop-blur-md whitespace-nowrap">
          <span className="opacity-60 mr-3">Prompt:</span>
          &quot;rank the possibility of solar roof panel installation in this neighborhood&quot;
        </div>
      </div>

      {/* Visual 3: Resident Vibes */}
      <div className="relative w-full h-[640px] max-lg:h-[560px] max-md:h-[440px] overflow-hidden border-b border-[rgba(10,19,68,0.10)]">
        <Image src="/barca.png" alt="" fill className="object-cover" />
        <div className="absolute top-0 left-0 right-0 h-[140px] pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)" }} />
        <span className="absolute top-6 left-6 z-20 text-white/70 text-[12px] uppercase">Columbus GenLayer</span>
        <h2 className="absolute top-12 left-6 z-20 text-white text-[24px] md:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.1] m-0">
          Resident Vibes
        </h2>
        <div className="absolute top-6 right-6 z-20 text-white/80 font-medium text-[13px] flex items-center gap-2">
          <span className="text-[16px]">🌐</span> Built on Columbus Pro
        </div>
      </div>

      {/* Visual 4: Safety Score */}
      <div className="relative w-full h-[640px] max-lg:h-[560px] max-md:h-[440px] overflow-hidden">
        <Image src="/terra.png" alt="" fill className="object-cover" />
        <div className="absolute top-0 left-0 right-0 h-[140px] pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)" }} />
        <span className="absolute top-6 left-6 z-20 text-white/70 text-[12px] uppercase">Columbus GenLayer</span>
        <h2 className="absolute top-12 left-6 z-20 text-white text-[24px] md:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.1] m-0">
          Safety Score
        </h2>
        <div className="absolute top-6 right-6 z-20 text-white/80 font-medium text-[13px] flex items-center gap-2">
          <span className="text-[16px]">🌐</span> Built on Columbus Pro
        </div>
      </div>
    </div>
  );
}

// ─── Sticky-scroll wrapper ─────────────────────────────────────────────────

type SectionRow = {
  id: string;
  title: string;
  description: React.ReactNode;
  bullets?: string[];
  visual: React.ReactNode;
  link?: string;
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
      <div className="mt-4 text-[14px] leading-[1.55] space-y-4" style={{ color: descColor }}>
        {row.description}
      </div>
      {row.bullets && row.bullets.length > 0 && (
        <ul className="mt-3 text-[14px] leading-[1.55] space-y-1.5" style={{ color: descColor }}>
          {row.bullets.map((b) => <li key={b}>• {b}</li>)}
        </ul>
      )}
      {row.link && (
        <div className="mt-6">
          <a href="#" className="text-[14px] font-medium hover:text-[#0A1344] underline underline-offset-4" style={{ color: titleColor }}>
            {row.link}
          </a>
        </div>
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
  const rows: SectionRow[] = [
    {
      id: "generative-geodata",
      title: "Generative Geodata",
      description: (
        <>
          <p>Columbus has brought accurate GenAI to GeoData, dynamically creating new layers of geospatial information using UGM.</p>
          <p>&ldquo;Smart Layers&rdquo; can be used to create creative data layers that would otherwise be time-intensive or expensive to obtain.</p>
          <p>Smart layers can also be used when data is unavailable or hard to survey.</p>
        </>
      ),
      link: "See live Smart Layers ↗",
      visual: <GenerativeGeodataVisual />,
    },
    {
      id: "predicting-future",
      title: "Predicting the future",
      description: <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>,
      bullets: [
        "Lorem ipsum dolor sit amet",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor",
      ],
      visual: <PredictingFutureVisual />,
    },
    {
      id: "creative-data-layers",
      title: "Creative data layers",
      description: <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>,
      bullets: [
        "Lorem ipsum dolor sit amet",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor",
      ],
      visual: <CreativeDataLayersVisual />,
    },
  ];

  return <StickyScrollBlock rows={rows} />;
}
