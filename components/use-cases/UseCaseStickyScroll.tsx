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
  /**
   * Round the top corners of the first row with the PageFrame radius
   * (20px) so it tucks under the rounded IndustrySelector grid above it.
   * Off by default → columbus-solutions stays square.
   */
  roundedTop?: boolean;
  /**
   * Drop the desktop left-rail `position: sticky`, so each row's
   * feature description scrolls normally with its row instead of
   * pinning while the right column scrolls past. Off by default →
   * columbus-solutions / research-applications keep the sticky effect.
   * Page-scoped: only the business page opts in.
   */
  disableSticky?: boolean;
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
export default function UseCaseStickyScroll({ lightTheme = false, excludeSections = [], roundedTop = false, disableSticky = false }: UseCaseStickyScrollProps) {
  const { industry } = useIndustry();



  type FeatureRow = { id: string; featureTitle: string; leftRail: RowLeftRail; content: (isLight: boolean) => React.ReactNode; forceLight?: boolean };
  const features: FeatureRow[] = [
    {
      id: "chat",
      featureTitle: "Conversational map chat",
      leftRail: industry.chat.leftRail,
      content: (isLight) => <Chat embedded lightTheme={isLight} />,
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
        // Light rows are pure #FFFFFF (no tint) so they match the white
        // business page / IndustrySelector above. Dark stays untinted.
        const rowBgOverlay = "none";
        const rowGridLine = isLight ? "rgba(10, 19, 68, 0.10)" : "rgba(255, 255, 255, 0.10)";
        const roundFirst = roundedTop && i === 0;
        // Oscillating layout: even rows keep text-left / visual-right;
        // odd rows flip to visual-left / text-right. Mobile always stacks
        // text above visual regardless (lg:order only applies at lg+).
        const reversed = i % 2 === 1;

        return (
          <div
            key={feature.id}
            id={feature.id}
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
                // First row = top of the long features card: add the top
                // hairline + PageFrame 20px corner radius (and clip the
                // flush right-column visual to it) so it reads as one
                // bordered, rounded card with the IndustrySelector above.
                ...(roundFirst
                  ? {
                      borderTop: `1px solid ${rowGridLine}`,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      overflow: "hidden",
                    }
                  : {}),
              }}
            >
              {i > 0 && (
                <div className="w-full" style={{ height: 1, backgroundColor: rowGridLine }} />
              )}
              <div
                className={`relative grid grid-cols-1 ${
                  reversed
                    ? "lg:grid-cols-[1fr_1px_330px]"
                    : "lg:grid-cols-[330px_1px_1fr]"
                }`}
              >
                {/* Mobile: left-rail block above content */}
                <div className="lg:hidden px-6 pt-10 pb-6">
                  {renderLeftRail(feature.featureTitle, feature.leftRail, isLight)}
                </div>

                {/* Desktop: left rail — sticky by default; the business
                    page passes disableSticky so it scrolls in normal flow.
                    On reversed rows it sits in the third column. */}
                <div className={`hidden lg:block bg-transparent ${reversed ? "lg:order-3" : "lg:order-1"}`}>
                  <div className={`${disableSticky ? "" : "sticky top-20"} px-8 py-16`}>
                    {renderLeftRail(feature.featureTitle, feature.leftRail, isLight)}
                  </div>
                </div>

                {/* Vertical divider */}
                <div className="hidden lg:block lg:order-2" style={{ backgroundColor: rowGridLine }} />

                {/* Visual column — first column on reversed rows. */}
                <div className={`bg-transparent ${reversed ? "lg:order-1" : "lg:order-3"}`}>
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
