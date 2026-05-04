"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Hairline divider used between rows — fades out toward the right.
// Mirrors the technology-page Results section divider.
const DIVIDER_BG =
  "linear-gradient(to right, rgba(0, 102, 204, 0.35) 0%, rgba(0, 102, 204, 0.32) 55%, rgba(0, 102, 204, 0) 100%)";

// Common SVG props for every skeleton — viewBox 100×70 closely matches
// the 16:11 tile aspect, and `preserveAspectRatio="none"` keeps each
// skeleton landing in the same relative places no matter the tile size.
const SKELETON_SVG_PROPS = {
  viewBox: "0 0 100 70",
  preserveAspectRatio: "none" as const,
  className: "absolute inset-0 w-full h-full",
  "aria-hidden": true,
};

/* Row 1 — "Ask the map anything"
   Conversational Map Chat silhouette: small white rounded panel pinned
   bottom-left with header dot + label, considering bars, response stub,
   divider, and an input row with a navy send button. */
const ChatSkeleton = () => (
  <svg {...SKELETON_SVG_PROPS}>
    <rect x="6" y="14" width="52" height="50" rx="2.2" fill="white" stroke="rgba(10,19,68,0.08)" strokeWidth="0.3" />
    <circle cx="11" cy="20" r="1.6" fill="rgba(10,19,68,0.28)" />
    <rect x="14.6" y="19.1" width="20" height="1.6" rx="0.5" fill="rgba(10,19,68,0.22)" />
    <rect x="14.6" y="25" width="34" height="1.2" rx="0.3" fill="rgba(10,19,68,0.14)" />
    <rect x="14.6" y="29" width="28" height="1.2" rx="0.3" fill="rgba(10,19,68,0.14)" />
    <rect x="14.6" y="33" width="22" height="1.2" rx="0.3" fill="rgba(10,19,68,0.14)" />
    <rect x="9" y="40" width="44" height="1.4" rx="0.3" fill="rgba(10,19,68,0.18)" />
    <rect x="9" y="44" width="36" height="1.4" rx="0.3" fill="rgba(10,19,68,0.18)" />
    <line x1="6" y1="52" x2="58" y2="52" stroke="rgba(0,0,0,0.06)" strokeWidth="0.3" />
    <rect x="9" y="56" width="32" height="1.6" rx="0.5" fill="rgba(10,19,68,0.14)" />
    <rect x="49" y="54.2" width="6" height="6" rx="1.4" fill="#0A1344" />
  </svg>
);

/* Row 2 — "An AI that considers it all"
   Wider panel — no input bar — populated with a tall stacked list of
   "source-type" rows. Same muted navy-on-white palette as the chat
   skeleton; each row's leading square uses the avatar opacity so they
   read as a list rather than a rainbow. */
const ConsideringSourcesSkeleton = () => (
  <svg {...SKELETON_SVG_PROPS}>
    <rect x="6" y="6" width="68" height="58" rx="2.2" fill="white" stroke="rgba(10,19,68,0.08)" strokeWidth="0.3" />
    {/* Header — Columbus thinking */}
    <circle cx="11" cy="12" r="1.6" fill="rgba(10,19,68,0.28)" />
    <rect x="14.6" y="11.2" width="26" height="1.6" rx="0.5" fill="rgba(10,19,68,0.22)" />
    {/* Source rows — uniform muted grey */}
    {Array.from({ length: 7 }).map((_, i) => {
      const y = 18 + i * 5.5;
      const widths = [44, 38, 50, 32, 46, 36, 42];
      return (
        <g key={i}>
          <rect x="11" y={y} width="2.2" height="2.2" rx="0.5" fill="rgba(10,19,68,0.28)" />
          <rect x="15" y={y + 0.4} width={widths[i]} height="1.4" rx="0.3" fill="rgba(10,19,68,0.16)" />
        </g>
      );
    })}
    {/* Footer counter chip */}
    <rect x="11" y="58" width="22" height="3.5" rx="1" fill="rgba(10,19,68,0.06)" />
    <rect x="13" y="59.4" width="14" height="1.2" rx="0.3" fill="rgba(10,19,68,0.22)" />
  </svg>
);

/* Row 3 — "Faster research reports"
   White-background tile with a clean document silhouette: title +
   subtitle + byline, hairline divider, body paragraphs, an inline
   bar-chart panel, and side body text. Evokes a generated report
   instead of a map view. */
const ReportSkeleton = () => (
  <svg {...SKELETON_SVG_PROPS}>
    {/* Title */}
    <rect x="10" y="9" width="62" height="3.4" rx="0.7" fill="rgba(10,19,68,0.55)" />
    {/* Subtitle */}
    <rect x="10" y="15" width="44" height="1.6" rx="0.4" fill="rgba(10,19,68,0.30)" />
    {/* Byline */}
    <rect x="10" y="19" width="22" height="1.2" rx="0.3" fill="rgba(10,19,68,0.20)" />
    {/* Divider */}
    <line x1="10" y1="23.4" x2="90" y2="23.4" stroke="rgba(10,19,68,0.12)" strokeWidth="0.3" />
    {/* Body paragraph — full width */}
    <rect x="10" y="27" width="80" height="1.2" rx="0.3" fill="rgba(10,19,68,0.16)" />
    <rect x="10" y="30.5" width="76" height="1.2" rx="0.3" fill="rgba(10,19,68,0.16)" />
    <rect x="10" y="34" width="68" height="1.2" rx="0.3" fill="rgba(10,19,68,0.16)" />
    {/* Inline chart panel — left */}
    <rect x="10" y="40" width="38" height="22" rx="1.2" fill="rgba(10,19,68,0.03)" stroke="rgba(10,19,68,0.10)" strokeWidth="0.3" />
    <line x1="13" y1="60" x2="45" y2="60" stroke="rgba(10,19,68,0.18)" strokeWidth="0.3" />
    {[3, 7, 12, 10, 14, 16, 18].map((h, i) => (
      <rect key={i} x={14 + i * 4.4} y={60 - h} width="2.4" height={h} rx="0.4" fill="rgba(10,19,68,0.32)" />
    ))}
    {/* Side body — right column */}
    <rect x="52" y="42" width="38" height="1.2" rx="0.3" fill="rgba(10,19,68,0.16)" />
    <rect x="52" y="45.5" width="34" height="1.2" rx="0.3" fill="rgba(10,19,68,0.16)" />
    <rect x="52" y="49" width="36" height="1.2" rx="0.3" fill="rgba(10,19,68,0.16)" />
    <rect x="52" y="52.5" width="30" height="1.2" rx="0.3" fill="rgba(10,19,68,0.16)" />
    <rect x="52" y="56" width="26" height="1.2" rx="0.3" fill="rgba(10,19,68,0.16)" />
  </svg>
);

/* Row 4 — "Generative data layers"
   Map basemap stays visible underneath; on top, several translucent
   coloured polygons of different domains plus a small "Layers" control
   panel in the top-right with stacked layer rows + an "Add layer" pill
   in the bottom-left. */
const DataLayersSkeleton = () => (
  <svg {...SKELETON_SVG_PROPS}>
    {/* Layer polygons — same navy hue at varying opacities suggests
        stacking without competing with the chat skeleton's monochrome
        palette. */}
    <path d="M 6 14 L 28 10 L 36 24 L 24 32 L 10 28 Z" fill="rgba(10,19,68,0.20)" stroke="rgba(10,19,68,0.45)" strokeWidth="0.35" />
    <path d="M 34 18 L 58 14 L 62 30 L 48 38 L 38 30 Z" fill="rgba(10,19,68,0.16)" stroke="rgba(10,19,68,0.40)" strokeWidth="0.35" />
    <path d="M 8 36 L 30 34 L 34 50 L 18 58 L 10 50 Z" fill="rgba(10,19,68,0.18)" stroke="rgba(10,19,68,0.42)" strokeWidth="0.35" />
    <path d="M 38 42 L 60 40 L 64 56 L 50 62 L 40 54 Z" fill="rgba(10,19,68,0.22)" stroke="rgba(10,19,68,0.48)" strokeWidth="0.35" />
    {/* Layers panel — top-right */}
    <rect x="68" y="6" width="26" height="24" rx="1.5" fill="white" stroke="rgba(10,19,68,0.08)" strokeWidth="0.3" />
    <rect x="70.5" y="8" width="14" height="1.4" rx="0.4" fill="rgba(10,19,68,0.28)" />
    {[
      { y: 13, c: "rgba(10,19,68,0.40)" },
      { y: 17, c: "rgba(10,19,68,0.32)" },
      { y: 21, c: "rgba(10,19,68,0.26)" },
      { y: 25, c: "rgba(10,19,68,0.22)" },
    ].map((row, i) => (
      <g key={i}>
        <rect x="70.5" y={row.y} width="2.2" height="2.2" rx="0.3" fill={row.c} />
        <rect x="74" y={row.y + 0.4} width="14" height="1.4" rx="0.3" fill="rgba(10,19,68,0.16)" />
      </g>
    ))}
    {/* "Add layer" pill — bottom-left */}
    <rect x="6" y="58" width="22" height="6" rx="1.6" fill="white" stroke="rgba(10,19,68,0.08)" strokeWidth="0.3" />
    <line x1="10" y1="61" x2="14" y2="61" stroke="rgba(10,19,68,0.4)" strokeWidth="0.3" />
    <line x1="12" y1="59" x2="12" y2="63" stroke="rgba(10,19,68,0.4)" strokeWidth="0.3" />
    <rect x="16" y="60.4" width="9" height="1.4" rx="0.3" fill="rgba(10,19,68,0.22)" />
  </svg>
);

type Item = {
  text: string;
  /** When null the tile renders on a white background — no satellite. */
  image: string | null;
  Skeleton: () => React.ReactElement;
};

const ITEMS: Item[] = [
  { text: "Ask the map anything", image: "/MadridMap.png", Skeleton: ChatSkeleton },
  { text: "An AI that considers it all", image: "/use-cases/havana.png", Skeleton: ConsideringSourcesSkeleton },
  { text: "Faster research reports", image: null, Skeleton: ReportSkeleton },
  { text: "Generative data layers", image: "/use-cases/gmap.png", Skeleton: DataLayersSkeleton },
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
    // Safety fallback: even if the observer never fires (slow paint / stuck
    // hydration / browser tab backgrounded during mount) force the section
    // to its visible state after 1.5s so the rows never get stuck stacked
    // at translateY(14px) opacity:0.
    const fallback = setTimeout(() => setVisible(true), 1500);
    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
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

        {/* ── Stacked-row catalogue. Explicit gap on the parent guarantees
            consistent vertical spacing between rows even if the row-level
            anim transform is mid-flight or the layout has just hydrated. */}
        <div
          className="flex flex-col"
          style={{
            marginTop: "clamp(48px, 6vw, 72px)",
            gap: "clamp(20px, 2.5vw, 36px)",
          }}
        >
          {ITEMS.map((item, i) => {
            const hasMap = item.image !== null;
            return (
              <div
                key={item.text}
                className="relative flex flex-row items-center max-md:flex-col max-md:items-start"
                style={{
                  gap: "clamp(28px, 3vw, 48px)",
                  ...anim(100 + i * 60),
                }}
              >
                {/* Tile — either a satellite map basemap or a clean white
                    canvas (Row 3, "Faster research reports"). The skeleton
                    is layered on top in either case. */}
                <div
                  className="relative shrink-0 aspect-[16/11] overflow-hidden rounded-[12px]"
                  style={{
                    width: "clamp(160px, 16vw, 240px)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    background: hasMap ? "#3150B5" : "white",
                  }}
                >
                  {hasMap && item.image && (
                    <>
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 50vw, 240px"
                        className="object-cover"
                      />
                      {/* Subtle navy scrim so the white skeleton elements
                          read cleanly over even the lightest map. */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "rgba(10, 19, 68, 0.18)" }}
                        aria-hidden
                      />
                    </>
                  )}
                  <item.Skeleton />
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
                      bottom: "calc(-1 * clamp(20px, 2.5vw, 36px) / 2)",
                      left: "calc(clamp(160px, 16vw, 240px) + clamp(28px, 3vw, 48px))",
                      height: 1,
                      background: DIVIDER_BG,
                    }}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
