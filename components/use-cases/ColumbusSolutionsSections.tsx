"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

// ─── Shared visual primitives ──────────────────────────────────────────────

/** Animated map image panel with title overlay and gradient backdrop */
function MapPanel({
  title,
  imageSrc,
  children,
  lightTheme = false,
}: {
  title: string;
  imageSrc: string;
  children?: React.ReactNode;
  lightTheme?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
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
      {!lightTheme && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(10,8,40,0.18)" }} />
      )}
      {/* gradient backdrop for title */}
      <div
        className="absolute top-0 left-0 right-0 h-[160px] pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.32) 55%, transparent 100%)" }}
        aria-hidden
      />
      <h2 className="absolute top-6 left-6 z-20 text-white text-[24px] md:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] leading-[1.1] m-0">
        {title}
      </h2>
      {children}
    </div>
  );
}

/** Data-layer pill badge */
function LayerBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[12px] font-medium"
      style={{ background: color }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
      {label}
    </span>
  );
}

// ─── 1. Creative data layers ───────────────────────────────────────────────

function CreativeDataLayersVisual({ lightTheme = false }: { lightTheme?: boolean }) {
  const layers = [
    { label: "Solar Potential", color: "rgba(234,179,8,0.85)" },
    { label: "Foot Traffic Density", color: "rgba(59,130,246,0.85)" },
    { label: "Safety Score", color: "rgba(34,197,94,0.85)" },
    { label: "Vibrancy Index", color: "rgba(168,85,247,0.85)" },
    { label: "Heat Risk", color: "rgba(239,68,68,0.85)" },
    { label: "Green Cover", color: "rgba(20,184,166,0.85)" },
  ];

  return (
    <MapPanel title="Creative data layers" imageSrc="/HK Map-2.png" lightTheme={lightTheme}>
      {/* Layer palette floating card */}
      <div
        className="absolute bottom-8 left-6 right-6 z-20 rounded-2xl p-5 backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
      >
        <p className="text-white/60 text-[11px] uppercase tracking-widest mb-3 font-medium">Active layers</p>
        <div className="flex flex-wrap gap-2">
          {layers.map((l) => (
            <LayerBadge key={l.label} label={l.label} color={l.color} />
          ))}
        </div>
        <p className="text-white/50 text-[12px] mt-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
    </MapPanel>
  );
}

// ─── 2. Predict the future ─────────────────────────────────────────────────

function PredictFutureVisual({ lightTheme = false }: { lightTheme?: boolean }) {
  const forecasts = [
    { label: "Foot traffic in 6 months", trend: "+18%", dir: "up" },
    { label: "Neighborhood gentrification risk", trend: "High", dir: "warn" },
    { label: "Commercial vacancy rate", trend: "−4.2%", dir: "down" },
    { label: "Crime index forecast", trend: "−11%", dir: "down" },
  ];

  return (
    <MapPanel title="Predict the future" imageSrc="/ConsumerPageCity.png" lightTheme={lightTheme}>
      {/* Forecast cards */}
      <div className="absolute bottom-8 left-6 right-6 z-20 grid grid-cols-2 gap-3 max-md:grid-cols-1">
        {forecasts.map((f) => (
          <div
            key={f.label}
            className="rounded-xl px-4 py-3 backdrop-blur-md flex items-center justify-between gap-3"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)" }}
          >
            <span className="text-white/80 text-[13px] leading-snug">{f.label}</span>
            <span
              className="shrink-0 text-[14px] font-semibold"
              style={{
                color: f.dir === "up" ? "#4ade80" : f.dir === "warn" ? "#fb923c" : "#60a5fa",
              }}
            >
              {f.trend}
            </span>
          </div>
        ))}
      </div>
      {/* Timeline strip */}
      <div className="absolute top-20 right-6 z-20 flex flex-col gap-1 items-end">
        {["2025", "2026 ▸", "2027", "2028"].map((yr, i) => (
          <span
            key={yr}
            className="text-[11px] font-mono px-2 py-0.5 rounded"
            style={{
              background: i === 1 ? "rgba(59,130,246,0.7)" : "rgba(0,0,0,0.35)",
              color: i === 1 ? "#fff" : "rgba(255,255,255,0.55)",
            }}
          >
            {yr}
          </span>
        ))}
      </div>
    </MapPanel>
  );
}

// ─── 3. Automated audits & due diligence ──────────────────────────────────

function AuditsDueDiligenceVisual({ lightTheme = false }: { lightTheme?: boolean }) {
  const checks = [
    { label: "Zoning compliance verified", ok: true },
    { label: "Environmental risk assessment", ok: true },
    { label: "Infrastructure capacity report", ok: true },
    { label: "Neighboring land use analysis", ok: true },
    { label: "Historical incident review", ok: false, pending: true },
  ];

  return (
    <MapPanel title="Automated audits & due diligence" imageSrc="/barca.png" lightTheme={lightTheme}>
      {/* Audit checklist */}
      <div
        className="absolute bottom-8 left-6 z-20 w-[340px] max-md:left-4 max-md:right-4 max-md:w-auto rounded-2xl p-5 backdrop-blur-md"
        style={{ background: "rgba(6,8,16,0.72)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <p className="text-white/50 text-[11px] uppercase tracking-widest mb-4 font-medium">Due diligence report</p>
        <div className="flex flex-col gap-2.5">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <span
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{
                  background: c.pending ? "rgba(251,191,36,0.25)" : "rgba(34,197,94,0.22)",
                  color: c.pending ? "#fbbf24" : "#4ade80",
                }}
              >
                {c.pending ? "⋯" : "✓"}
              </span>
              <span className="text-white/80 text-[13px]">{c.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-white/40 text-[11px]">4 / 5 checks passed</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.2)", color: "#93c5fd" }}>
            In progress
          </span>
        </div>
      </div>
    </MapPanel>
  );
}

// ─── 4. Easy regulatory compliance ────────────────────────────────────────

function RegulatoryComplianceVisual({ lightTheme = false }: { lightTheme?: boolean }) {
  const regs = [
    { code: "GDPR Art. 9", status: "Compliant", color: "#4ade80" },
    { code: "FAA Part 107", status: "Compliant", color: "#4ade80" },
    { code: "Local zoning §14.2", status: "Review needed", color: "#fb923c" },
    { code: "Environmental EPA §1502", status: "Compliant", color: "#4ade80" },
  ];

  return (
    <MapPanel title="Easy regulatory compliance" imageSrc="/tokyo.png" lightTheme={lightTheme}>
      {/* Reg panel */}
      <div
        className="absolute bottom-8 right-6 z-20 w-[360px] max-md:left-4 max-md:right-4 max-md:w-auto rounded-2xl p-5 backdrop-blur-md"
        style={{ background: "rgba(6,8,16,0.76)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <p className="text-white/50 text-[11px] uppercase tracking-widest mb-4 font-medium">Regulatory overview</p>
        <div className="flex flex-col gap-3">
          {regs.map((r) => (
            <div key={r.code} className="flex items-center justify-between gap-4">
              <span className="text-white/70 text-[13px] font-mono">{r.code}</span>
              <span className="text-[12px] font-medium" style={{ color: r.color }}>{r.status}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-white/40 text-[11px] leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </MapPanel>
  );
}

// ─── Sticky-scroll wrapper (mirrors UseCaseStickyScroll layout) ───────────

type SectionRow = {
  id: string;
  title: string;
  description: string;
  bullets?: string[];
  visual: React.ReactNode;
};

type ColumbusSolutionsSectionsProps = {
  lightTheme?: boolean;
  /**
   * Drop the desktop left-rail `position: sticky` so each row's rail
   * scrolls normally instead of pinning while the visual scrolls past.
   * Off by default → columbus-solutions keeps the sticky effect.
   * Page-scoped: only the enterprise page opts in.
   */
  disableSticky?: boolean;
  /**
   * Round the bottom corners of the 1287 content card with the PageFrame
   * radius (20px) and drop the full-bleed hairline beneath it, so this
   * marks the rounded END of the long features card. Off by default →
   * columbus-solutions keeps the square edge + full-width rule.
   */
  roundedBottom?: boolean;
};

export default function ColumbusSolutionsSections({ lightTheme = false, disableSticky = false, roundedBottom = false }: ColumbusSolutionsSectionsProps) {
  const bg = lightTheme ? "#FFFFFF" : "#000000";
  const gridLine = lightTheme ? "rgba(10, 19, 68, 0.10)" : "rgba(255,255,255,0.10)";
  const titleColor = lightTheme ? "#1D1D1F" : "#FFFFFF";
  const descColor = lightTheme ? "rgba(29,29,31,0.75)" : "rgba(255,255,255,0.75)";
  const bulletColor = descColor;

  const rows: SectionRow[] = [
    {
      id: "creative-data-layers",
      title: "Creative data layers",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bullets: [
        "Lorem ipsum dolor sit amet",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor",
      ],
      visual: <CreativeDataLayersVisual lightTheme={lightTheme} />,
    },
    {
      id: "predict-the-future",
      title: "Predict the future",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bullets: [
        "Lorem ipsum dolor sit amet",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor",
      ],
      visual: <PredictFutureVisual lightTheme={lightTheme} />,
    },
    {
      id: "automated-audits",
      title: "Automated audits & due diligence",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bullets: [
        "Lorem ipsum dolor sit amet",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor",
      ],
      visual: <AuditsDueDiligenceVisual lightTheme={lightTheme} />,
    },
    {
      id: "regulatory-compliance",
      title: "Easy regulatory compliance",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bullets: [
        "Lorem ipsum dolor sit amet",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor",
      ],
      visual: <RegulatoryComplianceVisual lightTheme={lightTheme} />,
    },
  ];

  const renderRail = (row: SectionRow) => (
    <div className="max-w-[280px]">
      <h3
        className="m-0 text-[18px] font-medium leading-[1.3] tracking-[-0.01em]"
        style={{ color: titleColor }}
      >
        {row.title}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.55]" style={{ color: descColor }}>
        {row.description}
      </p>
      {row.bullets && row.bullets.length > 0 && (
        <ul className="mt-3 text-[14px] leading-[1.55] space-y-1.5" style={{ color: bulletColor }}>
          {row.bullets.map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div
      className="relative w-full"
      style={{ backgroundColor: bg, ["--grid-line" as string]: gridLine }}
    >
      <div
        className="relative z-10 mx-5 md:mx-auto max-w-[1287px]"
        style={{
          borderLeft: `1px solid ${gridLine}`,
          borderRight: `1px solid ${gridLine}`,
          // Bottom of the long features card: close it with the bottom
          // hairline + PageFrame 20px corners, clipping the last visual.
          ...(roundedBottom
            ? {
                borderBottom: `1px solid ${gridLine}`,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                overflow: "hidden",
              }
            : {}),
        }}
      >
        {rows.map((row, i) => (
          <div key={row.id}>
            {i > 0 && <div className="w-full" style={{ height: 1, backgroundColor: gridLine }} />}
            <div className="relative grid grid-cols-1 lg:grid-cols-[330px_1px_1fr]">
              {/* Mobile: rail above content */}
              <div className="lg:hidden px-6 pt-10 pb-6">{renderRail(row)}</div>
              {/* Desktop: left rail — sticky by default; the enterprise
                  page passes disableSticky so it scrolls in normal flow. */}
              <div className="hidden lg:block bg-transparent">
                <div className={`${disableSticky ? "" : "sticky top-20"} px-8 py-16`}>{renderRail(row)}</div>
              </div>
              {/* Vertical divider */}
              <div className="hidden lg:block" style={{ backgroundColor: gridLine }} />
              {/* Right content */}
              <div className="bg-transparent">{row.visual}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Full-bleed closing hairline — replaced by the card's rounded
          bottom edge when roundedBottom is set (enterprise page). */}
      {!roundedBottom && (
        <div className="relative z-10 w-full" style={{ height: 1, backgroundColor: gridLine }} />
      )}
    </div>
  );
}
