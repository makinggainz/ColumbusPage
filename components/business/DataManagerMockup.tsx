"use client";

import type { IndustryId } from "@/components/use-cases/industry/types";
import MockupChrome, {
  BarPill,
  PlusGlyph,
  GRADIENT_PURPLE,
  GRADIENT_RAINBOW,
} from "./MockupChrome";

/* Mock UI: the "Trusted data, verified for confidence" demo. The app chrome
   (left icon rail + top bar with the Columbus logo, "Data Manager" crumb, and
   the +Import data / Data Digestion / +Smart Layers actions) is now drawn
   programmatically by the shared <MockupChrome>; this component only supplies
   the inner pane content.

   Layout matches the cards as they appear in the per-industry source
   PDFs (Residential Real Estate.pdf, Commercial Real Estate.pdf,
   Academic Research.pdf, Environmental Research.pdf, Geomarketing.pdf,
   Urban Planning & Infrastructure.pdf): 3 data-catalogue cards in a
   single row under the search bar + tabs. Card titles, row counts, and
   descriptions are pulled verbatim from each industry's PDF; industries
   not covered by a PDF fall back to the residential set.

   Card visual style mirrors ForecastCard / ColumbusReasoningCard /
   MapChatPlatform — Axiforma, navy text on white, var(--ent-text-navy)
   tokens, soft 1px border, and a small "?" help glyph in the corner
   per the source. */

const TABS = [
  "My Data",
  "Suggested",
  "All",
  "Base Maps",
  "Overlays",
  "Packs",
  "Environmental",
  "Infrastructure",
  "Smart Layers",
  "Demographics",
];
const ACTIVE_TAB = "Smart Layers";

type Card = { title: string; rows: string; desc?: string; map: string };

/* CSS gradient stand-ins for smart-layer raster thumbnails. Six distinct
   looks; the per-industry card sets reach into this palette by index so
   each card has a unique visual without duplicating gradient strings. */
const MAPS = {
  /* Dark satellite + warm red dot scatter — Future-Hot-style. */
  redDots:
    "radial-gradient(circle at 24% 38%, rgba(255,55,55,0.65) 0%, transparent 14%)," +
    "radial-gradient(circle at 62% 22%, rgba(255,90,70,0.55) 0%, transparent 12%)," +
    "radial-gradient(circle at 78% 64%, rgba(255,60,40,0.55) 0%, transparent 14%)," +
    "radial-gradient(circle at 36% 72%, rgba(255,110,60,0.5) 0%, transparent 16%)," +
    "linear-gradient(160deg, #1c3621 0%, #0a1810 100%)",
  /* Magenta heatmap radial bloom. */
  heatmap:
    "radial-gradient(ellipse 80% 60% at 50% 45%, #ffe06a 0%, #ff66b5 22%, #6a1c8c 48%, #1a0533 80%, #07021a 100%)",
  /* Blue choropleth with subtle parcel grid. */
  blueChoro:
    "linear-gradient(135deg, rgba(174,217,232,0.95) 0%, rgba(93,141,184,0.95) 35%, rgba(42,77,114,0.95) 70%, rgba(14,60,90,0.95) 100%)," +
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 14px)," +
    "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 14px)," +
    "#9CC4DC",
  /* Dark navy with bright cyan parcel dots. */
  cyanDots:
    "radial-gradient(circle at 28% 32%, rgba(120,255,255,0.55) 0%, transparent 4%)," +
    "radial-gradient(circle at 64% 48%, rgba(120,200,255,0.5) 0%, transparent 4%)," +
    "radial-gradient(circle at 46% 70%, rgba(80,180,255,0.5) 0%, transparent 4%)," +
    "radial-gradient(circle at 80% 22%, rgba(140,220,255,0.5) 0%, transparent 4%)," +
    "radial-gradient(circle at 18% 64%, rgba(160,240,255,0.55) 0%, transparent 4%)," +
    "linear-gradient(180deg, #0a1530 0%, #061026 100%)",
  /* Multi-band income choropleth (green→amber→red). */
  multiChoro:
    "conic-gradient(from 30deg at 50% 55%, #5cae5a 0%, #b6c64a 18%, #f5d35a 35%, #f29a40 55%, #d65a40 75%, #aa3030 92%, #5cae5a 100%)," +
    "#cdd6db",
  /* Red density on dark — incident/accident style. */
  redDensity:
    "radial-gradient(ellipse 75% 55% at 48% 52%, #ff6644 0%, #d33015 25%, #6b1500 55%, #200500 100%)",
} as const;

/* Per-industry card sets — three cards each, lifted verbatim from the
   data-catalogue panels in each industry's source PDF (see
   /tmp/columbus-pdfs/*.txt for the extracted text the strings below
   were drawn from). The MAPS palette is reused across industries; only
   the titles/rows/descriptions are industry-specific. */
const CARDS_BY_INDUSTRY: Partial<Record<IndustryId, [Card, Card, Card]>> = {
  "residential-real-estate": [
    {
      title: "Future Hot Turnover Zones",
      rows: "55,010 rows",
      desc: "Predicts 2-5 year property value growth using migration, job forecasts, and permit trends.",
      map: MAPS.redDots,
    },
    {
      title: "Rental yield data by postal code (gross and net)",
      rows: "40,206 rows",
      map: MAPS.heatmap,
    },
    {
      title: "Short-term rental saturation",
      rows: "33,520 rows",
      desc: "Airbnb density — relevant for assessing rental market dynamics.",
      map: MAPS.blueChoro,
    },
  ],
  "commercial-real-estate": [
    {
      title: "Future Hot Turnover Zones",
      rows: "55,010 rows",
      desc: "Predicts 2-5 year property value growth using migration, job forecasts, and permit trends.",
      map: MAPS.redDots,
    },
    {
      title: "Rental yield data by postal code (gross and net)",
      rows: "40,206 rows",
      map: MAPS.heatmap,
    },
    {
      title: "Permitting approval map",
      rows: "33,520 rows",
      map: MAPS.blueChoro,
    },
  ],
  "academic-research": [
    {
      title: "Census and demographic data",
      rows: "55,010 rows",
      map: MAPS.multiChoro,
    },
    {
      title: "Unemployment rates heatmap",
      rows: "40,206 rows",
      map: MAPS.heatmap,
    },
    {
      title: "GDP heatmap",
      rows: "33,520 rows",
      map: MAPS.redDensity,
    },
  ],
  "environmental-research": [
    {
      title: "Citizen science wildlife sightings",
      rows: "55,010 rows",
      map: MAPS.cyanDots,
    },
    {
      title: "High-resolution satellite imagery",
      rows: "40,206 rows",
      desc: "From the last 10 years.",
      map: MAPS.redDots,
    },
    {
      title: "Historical wildfire perimeters",
      rows: "33,520 rows",
      desc: "With cause and suppression cost.",
      map: MAPS.redDensity,
    },
  ],
  geomarketing: [
    {
      title: "Drugstore shopper audience segmentation by neighborhood",
      rows: "41,200 rows",
      desc: "With chronic-condition, beauty, value, and wellness segments.",
      map: MAPS.multiChoro,
    },
    {
      title: "OOH advertising panel inventory",
      rows: "40,206 rows",
      desc: "Billboards, transit, and DOOH with audience reach.",
      map: MAPS.cyanDots,
    },
    {
      title: "Audience exposure heatmap by panel catchment",
      rows: "33,520 rows",
      desc: "Impressions and dwell time per panel catchment.",
      map: MAPS.heatmap,
    },
  ],
  "urban-infrastructure": [
    {
      title: "Building footprints",
      rows: "55,010 rows",
      desc: "With height, age, use type, and floor area.",
      map: MAPS.blueChoro,
    },
    {
      title: "Full road network",
      rows: "40,206 rows",
      desc: "Classification, speed limits, lane counts, and pavement condition.",
      map: MAPS.cyanDots,
    },
    {
      title: "Historical traffic accident data",
      rows: "33,520 rows",
      desc: "Severity, mode, and time-of-day.",
      map: MAPS.redDensity,
    },
  ],
};

const FONT_STACK =
  "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif";

export type DataManagerMockupProps = {
  industryId?: IndustryId;
  /* Accepted for call-site compatibility (ComparisonSection passes it). The
     chrome is now code-drawn, so there's no frame raster left to preload —
     the prop is a no-op. */
  preload?: boolean;
};

export default function DataManagerMockup({ industryId }: DataManagerMockupProps = {}) {
  const cards =
    (industryId && CARDS_BY_INDUSTRY[industryId]) ??
    CARDS_BY_INDUSTRY["residential-real-estate"]!;

  return (
    <MockupChrome
      className="biz-product-display biz-mockup-frame"
      railIcons={["grid", "search-star", "edit", "database"]}
      activeRailIndex={3}
      crumbs={["Data Manager"]}
      actions={
        // The shared actions wrapper is nudged down 1.5px to align action TEXT
        // with the Columbus title; these are bordered pill rectangles, so
        // counter-shift the group up 1px to keep the rectangles centred in the
        // bar (same treatment as Map Chat's Report View).
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(6px, 0.8cqw, 12px)",
            transform: "translateY(-1px)",
          }}
        >
          <BarPill fontSize="14px" fontWeight={500} radius={10} paddingY="calc(clamp(4px, 0.7cqw, 9px) - 1.5px)">
            <PlusGlyph />
            Import data
          </BarPill>
          <BarPill gradient={GRADIENT_PURPLE} textColor="#154ACC" fontSize="14px" fontWeight={500} radius={10} paddingY="calc(clamp(4px, 0.7cqw, 9px) - 1.5px)">
            Data Digestion
          </BarPill>
          <BarPill gradient={GRADIENT_RAINBOW} textColor="#154ACC" fontSize="14px" fontWeight={500} radius={10} paddingY="calc(clamp(4px, 0.7cqw, 9px) - 1.5px)">
            <PlusGlyph />
            Smart Layers
          </BarPill>
        </div>
      }
    >
      {/* Inner pane content — search / tabs / card grid. The horizontal
          padding keeps the grid at the same visual width as the source
          screenshot, distributed symmetrically. */}
      <div
        key={industryId ?? "default"}
        className="industry-fade-in"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          paddingLeft: "clamp(28px, 10.5cqw, 124px)",
          paddingRight: "clamp(28px, 10.5cqw, 124px)",
          paddingTop: "clamp(16px, 2.5cqw, 36px)",
          fontFamily: FONT_STACK,
          color: "var(--ent-text-navy, #0F173C)",
        }}
      >
        {/* Search bar — placeholder + trailing search glyph. Corner radius
            matches the Dashboard's top-bar search field (borderRadius 10). */}
        <div className="relative">
          <input
            readOnly
            placeholder="Not sure which data sources are relevant? Ask Columbus Chatbot!"
            // placeholder:* forces the placeholder to the icon's #6B7280 at full
            // opacity (browsers otherwise render placeholders lighter than `color`).
            className="w-full placeholder:text-[#6B7280] placeholder:opacity-100"
            style={{
              borderRadius: 10,
              border: "1px solid rgba(0, 0, 0, 0.05)",
              backgroundColor: "#FFFFFF",
              padding: "clamp(6px, 0.85cqw, 11px) clamp(14px, 1.6cqw, 22px)",
              paddingRight: "clamp(34px, 3.4cqw, 46px)",
              fontSize: "clamp(0.62rem, 0.95cqw, 0.78rem)",
              color: "#6B7280",
              outline: "none",
              fontFamily: FONT_STACK,
            }}
          />
          <span
            className="absolute pointer-events-none"
            style={{
              right: "clamp(10px, 1.1cqw, 16px)",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6B7280",
              display: "inline-flex",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              style={{
                width: "clamp(11px, 1.1cqw, 16px)",
                height: "clamp(11px, 1.1cqw, 16px)",
              }}
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
        </div>

        {/* Tabs row. Active tab carries the heavier weight + a 2px
            navy underline sitting exactly on the row's bottom border. */}
        <div
          className="relative flex items-end"
          style={{
            marginTop: "clamp(8px, 1.4cqw, 18px)",
            gap: "clamp(12px, 2cqw, 30px)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            paddingBottom: "clamp(7px, 0.9cqw, 13px)",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {TABS.map((label) => {
            const active = label === ACTIVE_TAB;
            return (
              <span
                key={label}
                style={{
                  position: "relative",
                  fontSize: "clamp(0.62rem, 0.95cqw, 0.78rem)",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--ent-text-navy, #0F173C)" : "#6B7280",
                  fontFamily: FONT_STACK,
                  letterSpacing: "-0.005em",
                }}
              >
                {label}
                {active && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: "calc(-1 * clamp(7px, 0.9cqw, 13px) - 1px)",
                      height: 2,
                      backgroundColor: "var(--ent-text-navy, #0F173C)",
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>

        {/* 3-card row — one card per data-catalogue entry in the source
            PDF for the active industry. */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(10px, 1.5cqw, 22px)",
            marginTop: "clamp(10px, 1.6cqw, 22px)",
          }}
        >
          {cards.map((card) => (
            <article
              key={card.title}
              style={{
                border: "1px solid rgba(0, 0, 0, 0.05)",
                borderRadius: "clamp(8px, 0.9cqw, 12px)",
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                aria-hidden
                style={{
                  width: "100%",
                  aspectRatio: "16 / 11",
                  background: card.map,
                }}
              />
              <div
                style={{
                  padding:
                    "clamp(8px, 1cqw, 14px) clamp(10px, 1.1cqw, 16px) clamp(10px, 1.1cqw, 16px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(2px, 0.25cqw, 4px)",
                  position: "relative",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "clamp(0.7rem, 1cqw, 0.86rem)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                    color: "var(--ent-text-navy, #0F173C)",
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: "clamp(0.62rem, 0.88cqw, 0.74rem)",
                    color: "#1F2937",
                  }}
                >
                  {card.rows}
                </div>
                {card.desc && (
                  <p
                    style={{
                      margin: 0,
                      marginTop: "clamp(3px, 0.4cqw, 6px)",
                      fontSize: "clamp(0.6rem, 0.85cqw, 0.72rem)",
                      lineHeight: 1.4,
                      color: "#6B7280",
                      paddingRight: "clamp(14px, 1.6cqw, 24px)",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {card.desc}
                  </p>
                )}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: "clamp(8px, 1cqw, 14px)",
                    bottom: "clamp(8px, 0.9cqw, 12px)",
                    width: "clamp(12px, 1.1cqw, 16px)",
                    height: "clamp(12px, 1.1cqw, 16px)",
                    borderRadius: "50%",
                    border: "1px solid #9CA3AF",
                    color: "#6B7280",
                    fontSize: "clamp(0.54rem, 0.7cqw, 0.66rem)",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  ?
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MockupChrome>
  );
}
