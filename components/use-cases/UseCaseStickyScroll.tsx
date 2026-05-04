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
  excludeSections?: string[];
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
export default function UseCaseStickyScroll({ lightTheme = false, excludeSections = [] }: UseCaseStickyScrollProps) {
  const { industry } = useIndustry();



  type FeatureRow = { id: string; featureTitle: string; leftRail: RowLeftRail; content: (isLight: boolean) => React.ReactNode; forceLight?: boolean };
  const features: FeatureRow[] = [
    {
      id: "chat",
      featureTitle: "Conversational map chat",
      leftRail: industry.chat.leftRail,
      content: (isLight: boolean) => <Chat embedded lightTheme={isLight} />,
    },
    {
      id: "super-model",
      featureTitle: "Surveying the earth with a super model",
      leftRail: industry.superModel.leftRail,
      content: (isLight) => <SuperModelSection embedded lightTheme={isLight} />,
    },
    {
      id: "agent-research",
      featureTitle: "Agentic geospatial research",
      leftRail: industry.agentResearch.leftRail,
      content: (isLight) => <AgentResearch embedded lightTheme={isLight} />,
    },
    {
      id: "data-catalogue",
      featureTitle: "The most accurate data catalogue",
      leftRail: industry.dataCatalogue.leftRail,
      content: (isLight) => <DataCatalogue embedded lightTheme={isLight} />,
    },
  ].filter(f => !excludeSections.includes(f.id));

  const renderLeftRail = (featureTitle: string, rail: RowLeftRail, isLight: boolean) => {
    const rowTitleColor = isLight ? "#1D1D1F" : "#FFFFFF";
    const rowDescriptionColor = isLight ? "rgba(29, 29, 31, 0.75)" : "rgba(255, 255, 255, 0.75)";
    const rowBulletColor = isLight ? "rgba(29, 29, 31, 0.75)" : "rgba(255, 255, 255, 0.75)";
    const rowCtaColor = isLight ? "#1D1D1F" : "#FFFFFF";

    return (
      <div className="max-w-[280px]">
        <h3
          className="m-0 text-[24px] md:text-[28px] font-medium leading-[1.15] tracking-[-0.02em]"
          style={{ color: rowTitleColor }}
        >
          {featureTitle}
        </h3>
        <p
          className="mt-3 text-[14px] leading-[1.55] whitespace-pre-line"
          style={{ color: rowDescriptionColor }}
        >
          {rail.description}
        </p>
        {rail.bullets && rail.bullets.length > 0 && (
          <ul
            className="mt-3 text-[14px] leading-[1.55] space-y-1.5"
            style={{ color: rowBulletColor }}
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
            style={{ color: rowCtaColor }}
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
  };

  return (
    <div data-use-case-rows className="relative w-full">
      {features.map((feature, i) => {
        const isLight = feature.forceLight ? true : lightTheme;
        const rowBg = isLight ? "#FFFFFF" : "#000000";
        const rowBgOverlay = isLight
          ? "linear-gradient(rgba(0,0,0,0.02), rgba(0,0,0,0.02))"
          : "none";
        const rowGridLine = isLight ? "rgba(10, 19, 68, 0.10)" : "rgba(255, 255, 255, 0.10)";

        return (
          <div
            key={feature.id}
            className="relative w-full"
            style={{
              backgroundColor: rowBg,
              backgroundImage: rowBgOverlay,
              ["--grid-line" as string]: rowGridLine,
            }}
          >
            {!isLight && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 1, opacity: 0.4, mixBlendMode: "multiply" }}
                aria-hidden
              >
                <filter id={`noise-${feature.id}`}>
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#noise-${feature.id})`} />
              </svg>
            )}

            <div
              className="relative z-10 mx-5 md:mx-auto max-w-[1287px]"
              style={{
                borderLeft: `1px solid ${rowGridLine}`,
                borderRight: `1px solid ${rowGridLine}`,
              }}
            >
              {i > 0 && (
                <div className="w-full" style={{ height: 1, backgroundColor: rowGridLine }} />
              )}
              <div className="relative grid grid-cols-1 lg:grid-cols-[330px_1px_1fr]">
                {/* Mobile: left-rail block above content */}
                <div className="lg:hidden px-6 pt-10 pb-6">
                  {renderLeftRail(feature.featureTitle, feature.leftRail, isLight)}
                </div>

                {/* Desktop: sticky left rail */}
                <div className="hidden lg:block bg-transparent">
                  <div className="sticky top-20 px-8 py-[64px]">
                    {renderLeftRail(feature.featureTitle, feature.leftRail, isLight)}
                  </div>
                </div>

                {/* Vertical divider */}
                <div className="hidden lg:block" style={{ backgroundColor: rowGridLine }} />

                {/* Right column */}
                <div className="bg-transparent">
                  {feature.content(isLight)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
    </div>
  );
}
