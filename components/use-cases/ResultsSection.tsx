"use client";

import { useEffect, useRef, useState } from "react";

// Hairline divider used between rows — fades out toward the right.
// Mirrors the technology-page Results section divider.
const DIVIDER_BG =
  "linear-gradient(to right, rgba(0, 102, 204, 0.35) 0%, rgba(0, 102, 204, 0.32) 55%, rgba(0, 102, 204, 0) 100%)";

/* ── Per-card line-art illustrations ─────────────────────────────
   Each card gets a unique wireframe shape rendered in white over the
   solid blue tile, in the same blueprint aesthetic as the technology
   page's Results cards. */

const ART_BG = "rgba(255,255,255,0.85)";
const ART_FG = "rgba(255,255,255,0.7)";
const ART_DIM = "rgba(255,255,255,0.55)";
const ART_FAINT = "rgba(255,255,255,0.4)";

const SVG_PROPS = {
  viewBox: "0 0 100 100",
  fill: "none",
  preserveAspectRatio: "xMidYMid meet" as const,
  className: "absolute inset-0 w-full h-full",
  "aria-hidden": true,
} as const;

/* #1 — City skyline + crosshair. "Fast semantic reasoning in cities." */
const CityArt = () => (
  <svg {...SVG_PROPS}>
    <line x1="50" y1="14" x2="50" y2="86" stroke={ART_FAINT} strokeWidth="0.4" strokeDasharray="2 2" />
    <line x1="14" y1="50" x2="86" y2="50" stroke={ART_FAINT} strokeWidth="0.4" strokeDasharray="2 2" />
    <rect x="20" y="50" width="11" height="34" stroke={ART_BG} strokeWidth="0.8" />
    <rect x="32" y="38" width="13" height="46" stroke={ART_BG} strokeWidth="0.8" />
    <rect x="46" y="44" width="12" height="40" stroke={ART_BG} strokeWidth="0.8" />
    <rect x="59" y="32" width="13" height="52" stroke={ART_BG} strokeWidth="0.8" />
    <rect x="73" y="48" width="11" height="36" stroke={ART_BG} strokeWidth="0.8" />
    <line x1="14" y1="84" x2="86" y2="84" stroke={ART_BG} strokeWidth="0.8" />
    <circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.9)" />
  </svg>
);

/* #2 — 3D wave surface mesh. "Generative geospatial data." */
const WaveArt = () => (
  <svg {...SVG_PROPS}>
    <path d="M 10 40 Q 25 32 40 40 T 70 40 T 95 40" stroke={ART_BG} strokeWidth="0.8" />
    <path d="M 10 52 Q 25 44 40 52 T 70 52 T 95 52" stroke={ART_FG} strokeWidth="0.7" />
    <path d="M 10 64 Q 25 56 40 64 T 70 64 T 95 64" stroke={ART_DIM} strokeWidth="0.6" />
    <path d="M 10 76 Q 25 68 40 76 T 70 76 T 95 76" stroke={ART_DIM} strokeWidth="0.6" />
    <line x1="25" y1="38" x2="25" y2="78" stroke={ART_FAINT} strokeWidth="0.4" />
    <line x1="40" y1="36" x2="40" y2="78" stroke={ART_FAINT} strokeWidth="0.4" />
    <line x1="55" y1="38" x2="55" y2="78" stroke={ART_FAINT} strokeWidth="0.4" />
    <line x1="70" y1="36" x2="70" y2="78" stroke={ART_FAINT} strokeWidth="0.4" />
    <line x1="85" y1="38" x2="85" y2="78" stroke={ART_FAINT} strokeWidth="0.4" />
  </svg>
);

/* #3 — Stacked dataset sheets. "Generalist model, wide catalogue." */
const StackArt = () => (
  <svg {...SVG_PROPS}>
    <rect x="22" y="22" width="48" height="32" stroke={ART_BG} strokeWidth="0.8" />
    <rect x="32" y="34" width="48" height="32" stroke={ART_FG} strokeWidth="0.7" />
    <rect x="42" y="46" width="48" height="32" stroke={ART_DIM} strokeWidth="0.6" />
    <line x1="22" y1="22" x2="32" y2="34" stroke={ART_FAINT} strokeWidth="0.4" />
    <line x1="70" y1="22" x2="80" y2="34" stroke={ART_FAINT} strokeWidth="0.4" />
    <line x1="22" y1="54" x2="32" y2="66" stroke={ART_FAINT} strokeWidth="0.4" />
    <line x1="32" y1="34" x2="42" y2="46" stroke={ART_FAINT} strokeWidth="0.4" />
    <line x1="80" y1="34" x2="90" y2="46" stroke={ART_FAINT} strokeWidth="0.4" />
    <line x1="32" y1="66" x2="42" y2="78" stroke={ART_FAINT} strokeWidth="0.4" />
  </svg>
);

/* #4 — Connected nodes / spatial graph. "Deep spatial reasoning at scale." */
const NetworkArt = () => (
  <svg {...SVG_PROPS}>
    <line x1="25" y1="25" x2="50" y2="50" stroke={ART_DIM} strokeWidth="0.6" />
    <line x1="25" y1="25" x2="40" y2="68" stroke={ART_DIM} strokeWidth="0.6" />
    <line x1="50" y1="50" x2="75" y2="25" stroke={ART_DIM} strokeWidth="0.6" />
    <line x1="50" y1="50" x2="75" y2="75" stroke={ART_DIM} strokeWidth="0.6" />
    <line x1="50" y1="50" x2="40" y2="68" stroke={ART_DIM} strokeWidth="0.6" />
    <line x1="40" y1="68" x2="75" y2="75" stroke={ART_DIM} strokeWidth="0.6" />
    <line x1="75" y1="25" x2="75" y2="75" stroke={ART_DIM} strokeWidth="0.6" />
    <circle cx="25" cy="25" r="3" fill="rgba(255,255,255,0.9)" />
    <circle cx="75" cy="25" r="3" fill="rgba(255,255,255,0.9)" />
    <circle cx="50" cy="50" r="4" fill="rgba(255,255,255,0.95)" />
    <circle cx="40" cy="68" r="3" fill="rgba(255,255,255,0.9)" />
    <circle cx="75" cy="75" r="3" fill="rgba(255,255,255,0.9)" />
  </svg>
);

const ITEMS: { text: string }[] = [
  { text: "Ask the map anything" },
  { text: "An AI that considers it all" },
  { text: "Faster research reports" },
  { text: "Generative data layers" },
];

export default function ResultsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section
      className="relative w-full py-24 rounded-[33px] overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 24px 40px -12px rgba(10, 19, 68, 0.22)",
      }}
    >
      <div ref={ref} className="max-w-[1287px] mx-auto px-8 min-[1287px]:px-0">
        {/* ── Header — eyebrow caption + section heading + supporting
            subtitle, matching the technology-page Results header pattern. */}
        <h2
          className="m-0 text-[39px] font-medium leading-[1.2] tracking-[-0.02em] text-[#1D1D1F]"
          style={anim(0)}
        >
          Columbus Pro
        </h2>
        <p
          className="mt-4 text-[20px] leading-[1.55] text-[#1D1D1F] max-w-[640px]"
          style={anim(50)}
        >
          Essential capabilities
        </p>

        {/* ── Stacked-row catalogue — each row pairs a blue art tile (with the
            wireframe globe) and a single line of numbered copy. Hairline
            dividers separate every row except the last. Matches the
            technology-page Results section. */}
        <div
          className="flex flex-col"
          style={{ marginTop: "clamp(48px, 6vw, 72px)" }}
        >
          {ITEMS.map((item, i) => (
            <div
              key={item.text}
              className="relative flex flex-row items-center max-md:flex-col max-md:items-start"
              style={{
                gap: "clamp(28px, 3vw, 48px)",
                padding: "clamp(2px, 0.3vw, 5px) 0",
                paddingTop: i === 0 ? 0 : undefined,
                paddingBottom: i === ITEMS.length - 1 ? 0 : undefined,
                ...anim(100 + i * 60),
              }}
            >
              {/* Solid-blue art tile — empty rounded blue box. */}
              <div
                className="relative shrink-0 aspect-[16/11] overflow-hidden rounded-[12px]"
                style={{
                  width: "clamp(160px, 16vw, 240px)",
                  background: "#3150B5",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}
              >
              </div>

              {/* Title without numbers */}
              <h3 className="flex-1 m-0 min-w-0 text-[22px] font-medium leading-[1.3] tracking-[-0.01em] text-[#1D1D1F]">
                {item.text}
              </h3>

              {/* Hairline divider beneath every row except the last. Starts
                  from the title's left edge (past the art tile + gap) and
                  fades out toward the right. */}
              {i < ITEMS.length - 1 && (
                <div
                  className="absolute right-0 max-md:hidden pointer-events-none"
                  style={{
                    bottom: 0,
                    left: "calc(clamp(160px, 16vw, 240px) + clamp(28px, 3vw, 48px))",
                    height: 1,
                    background: DIVIDER_BG,
                  }}
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
