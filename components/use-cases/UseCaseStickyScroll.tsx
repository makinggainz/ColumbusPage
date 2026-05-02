"use client";

import Chat from "./Chat";
import SuperModelSection from "./SuperModelSection";
import AgentResearch from "./AgentResearch";
import DataCatalogue from "./DataCatalogue";
import { useIndustry } from "./industry/IndustryContext";
import type { RowLeftRail } from "./industry/types";

type UseCaseStickyScrollProps = {
  /** White-background variant for use on light pages. */
  lightTheme?: boolean;
};

/**
 * Section-G-style sticky-scroll wrapper around the four use-case rows.
 *
 * Each row's right column is the visual UI from one of the existing four
 * components (rendered in `embedded` mode — no industry-options sidebar,
 * just the heading + full-width visual). The sticky left rail shows a
 * per-industry sub-item (title + description + optional bullets + optional
 * CTA) that scrolls with the page until it hits the top, then sticks while
 * the right column scrolls past.
 */
export default function UseCaseStickyScroll({ lightTheme = false }: UseCaseStickyScrollProps) {
  const { industry } = useIndustry();

  // Theme tokens
  const bg = lightTheme ? "#FFFFFF" : "#060810";
  const bgOverlay = lightTheme
    ? "linear-gradient(rgba(0,0,0,0.02), rgba(0,0,0,0.02))"
    : "linear-gradient(rgba(255,255,255,0.04), rgba(255,255,255,0.04))";
  const gridLine = lightTheme ? "rgba(10, 19, 68, 0.10)" : "rgba(255, 255, 255, 0.10)";
  const titleColor = lightTheme ? "#1D1D1F" : "#FFFFFF";
  const descriptionColor = lightTheme ? "rgba(29, 29, 31, 0.75)" : "rgba(255, 255, 255, 0.75)";
  const bulletColor = lightTheme ? "rgba(29, 29, 31, 0.75)" : "rgba(255, 255, 255, 0.75)";
  const ctaColor = lightTheme ? "#1D1D1F" : "#FFFFFF";

  type FeatureRow = { id: string; leftRail: RowLeftRail; content: React.ReactNode };
  const features: FeatureRow[] = [
    {
      id: "chat",
      leftRail: industry.chat.leftRail,
      content: <Chat embedded lightTheme={lightTheme} />,
    },
    {
      id: "super-model",
      leftRail: industry.superModel.leftRail,
      content: <SuperModelSection embedded lightTheme={lightTheme} />,
    },
    {
      id: "agent-research",
      leftRail: industry.agentResearch.leftRail,
      content: <AgentResearch embedded lightTheme={lightTheme} />,
    },
    {
      id: "data-catalogue",
      leftRail: industry.dataCatalogue.leftRail,
      content: <DataCatalogue embedded lightTheme={lightTheme} />,
    },
  ];

  const renderLeftRail = (rail: RowLeftRail) => (
    <div className="max-w-[280px]">
      <h3
        className="m-0 text-[18px] font-medium leading-[1.3] tracking-[-0.01em]"
        style={{ color: titleColor }}
      >
        {rail.title}
      </h3>
      <p
        className="mt-3 text-[14px] leading-[1.55] whitespace-pre-line"
        style={{ color: descriptionColor }}
      >
        {rail.description}
      </p>
      {rail.bullets && rail.bullets.length > 0 && (
        <ul
          className="mt-3 text-[14px] leading-[1.55] space-y-1.5"
          style={{ color: bulletColor }}
        >
          {rail.bullets.map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>
      )}
      {rail.ctaLabel && (
        <a
          href={rail.ctaHref ?? "#"}
          className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
          style={{ color: ctaColor }}
        >
          {rail.ctaLabel}
          <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 9L9 3M9 3H4M9 3V8" />
          </svg>
        </a>
      )}
    </div>
  );

  return (
    <div
      data-use-case-rows
      className="relative w-full"
      style={{
        backgroundColor: bg,
        backgroundImage: bgOverlay,
        ["--grid-line" as string]: gridLine,
      }}
    >
      {/* Noise grain — subtle texture on the dark variant only. */}
      {!lightTheme && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1, opacity: 0.4, mixBlendMode: "multiply" }}
          aria-hidden
        >
          <filter id="useCaseStickyNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#useCaseStickyNoise)" />
        </svg>
      )}

      {/* Bounded content with vertical edge lines mirroring the page-level
          structure. We inline the bounds (max-w-1287px, centered, 20px lateral
          margin on mobile) instead of importing the enterprise-tokens.css
          `.ent-content-bounds` utility, since that file isn't loaded on these
          two pages. */}
      <div
        className="relative z-10 mx-5 md:mx-auto max-w-[1287px]"
        style={{
          borderLeft: `1px solid ${gridLine}`,
          borderRight: `1px solid ${gridLine}`,
        }}
      >
        {features.map((feature, i) => (
          <div key={feature.id}>
            {i > 0 && (
              <div className="w-full" style={{ height: 1, backgroundColor: gridLine }} />
            )}
            <div className="relative grid grid-cols-1 lg:grid-cols-[330px_1px_1fr]">
              {/* Mobile: left-rail block above content */}
              <div className="lg:hidden px-6 pt-10 pb-6">
                {renderLeftRail(feature.leftRail)}
              </div>

              {/* Desktop: sticky left rail */}
              <div className="hidden lg:block bg-transparent">
                <div className="sticky top-20 px-8 py-[64px]">
                  {renderLeftRail(feature.leftRail)}
                </div>
              </div>

              {/* Vertical divider between sticky rail and content (desktop only) */}
              <div className="hidden lg:block" style={{ backgroundColor: gridLine }} />

              {/* Right column — full-bleed: the row component fills the full
                  width and height of this cell. The section title overlays
                  the visual at the top with its own gradient backdrop, so we
                  intentionally leave NO inner padding here. */}
              <div className="bg-transparent">
                {feature.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom horizontal line caps the block, matching the enterprise reference. */}
      <div className="relative z-10 w-full" style={{ height: 1, backgroundColor: gridLine }} />
    </div>
  );
}
