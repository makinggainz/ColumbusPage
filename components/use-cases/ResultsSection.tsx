"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Hairline divider used between rows — fades out toward the right.
// Mirrors the technology-page Results section divider.
const DIVIDER_BG =
  "linear-gradient(to right, rgba(0, 102, 204, 0.35) 0%, rgba(0, 102, 204, 0.32) 55%, rgba(0, 102, 204, 0) 100%)";

const ITEMS: { text: string; image: string }[] = [
  { text: "Ask the map anything", image: "/MadridMap.png" },
  { text: "An AI that considers it all", image: "/use-cases/havana.png" },
  { text: "Faster research reports", image: "/HK Map-2.png" },
  { text: "Generative data layers", image: "/use-cases/gmap.png" },
];

/**
 * Skeleton overlay — a heavily simplified silhouette of the
 * Conversational Map Chat UI (Chat.tsx): a small white rounded panel on
 * the lower-left of the tile, with a header dot + label, a few muted
 * "considering" lines, a divider, and an input bar with a send button.
 * Rendered inside an SVG so it scales with the tile at any size and
 * stays crisp on retina displays.
 */
const ChatSkeleton = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 100 70"
    preserveAspectRatio="none"
    aria-hidden
  >
    {/* Chat panel — bottom-left, ~50% width × ~62% height */}
    <rect
      x="6"
      y="14"
      width="52"
      height="50"
      rx="2.2"
      fill="white"
      stroke="rgba(10,19,68,0.08)"
      strokeWidth="0.3"
    />
    {/* Header — small avatar dot + label bar */}
    <circle cx="11" cy="20" r="1.6" fill="rgba(10,19,68,0.28)" />
    <rect x="14.6" y="19.1" width="20" height="1.6" rx="0.5" fill="rgba(10,19,68,0.22)" />
    {/* Considering lines, indented under the avatar */}
    <rect x="14.6" y="25" width="34" height="1.2" rx="0.3" fill="rgba(10,19,68,0.14)" />
    <rect x="14.6" y="29" width="28" height="1.2" rx="0.3" fill="rgba(10,19,68,0.14)" />
    <rect x="14.6" y="33" width="22" height="1.2" rx="0.3" fill="rgba(10,19,68,0.14)" />
    {/* Response paragraph stub */}
    <rect x="9" y="40" width="44" height="1.4" rx="0.3" fill="rgba(10,19,68,0.18)" />
    <rect x="9" y="44" width="36" height="1.4" rx="0.3" fill="rgba(10,19,68,0.18)" />
    {/* Border-top hairline above the input bar */}
    <line x1="6" y1="52" x2="58" y2="52" stroke="rgba(0,0,0,0.06)" strokeWidth="0.3" />
    {/* Input bar — text field + send button */}
    <rect x="9" y="56" width="32" height="1.6" rx="0.5" fill="rgba(10,19,68,0.14)" />
    <rect x="49" y="54.2" width="6" height="6" rx="1.4" fill="#0A1344" />
  </svg>
);

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
          {ITEMS.map((item, i) => (
            <div
              key={item.text}
              className="relative flex flex-row items-center max-md:flex-col max-md:items-start"
              style={{
                gap: "clamp(28px, 3vw, 48px)",
                ...anim(100 + i * 60),
              }}
            >
              {/* Map tile — real GIS imagery + simplified Chat-UI skeleton on top. */}
              <div
                className="relative shrink-0 aspect-[16/11] overflow-hidden rounded-[12px]"
                style={{
                  width: "clamp(160px, 16vw, 240px)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  background: "#3150B5",
                }}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 240px"
                  className="object-cover"
                />
                {/* Subtle navy scrim so the white skeleton panel reads
                    cleanly over even the lightest map */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "rgba(10, 19, 68, 0.18)" }}
                  aria-hidden
                />
                <ChatSkeleton />
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
          ))}
        </div>
      </div>
    </section>
  );
}
