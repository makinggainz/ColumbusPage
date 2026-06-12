"use client";

import ColumbusMark from "./ColumbusMark";
import ComparisonCard from "./ComparisonCard";
import { useIndustry } from "@/components/use-cases/industry/IndustryContext";
import { INDUSTRY_COLOR } from "@/components/use-cases/industry/content";

/* Row 3 — "Better Data, Better Prices".
   Side-by-side layout: heading + subtitle in a 4-col left column, two
   ComparisonCards in an 8-col right column. Columbus card carries the real
   logomark and full data; the competitor card runs parallel content sized
   to make Columbus's advantage read at a glance. */

const FONT =
  "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif";

export type ComparisonFeature = {
  title: string;
  description: string;
};

export type BetterPricesRowProps = {
  columbusTitle?: string;
  columbusPrice?: string;
  columbusMapAlt?: string;
  columbusFeatures?: ComparisonFeature[];
  competitorTitle?: string;
  competitorPrice?: string;
  competitorMapAlt?: string;
  competitorFeatures?: ComparisonFeature[];
};

const DEFAULT_COLUMBUS_TITLE = "Power grid outage history with feeder-circuit-level granularity";
const DEFAULT_COLUMBUS_PRICE = "$2,400 / year";
const DEFAULT_COLUMBUS_MAP_ALT = "Power grid outage layer preview";
const DEFAULT_COLUMBUS_FEATURES: ComparisonFeature[] = [
  { title: "55,010 rows", description: "Historical outage records resolved to the individual distribution feeder, harmonized across major utilities" },
  { title: "Verified accuracy", description: "Triple-checked for completeness and consistency before every release" },
  { title: "Updated quarterly", description: "Fresh data, continuously monitored and maintained" },
];
const DEFAULT_COMPETITOR_TITLE = "Power grid outages, county-level aggregates only";
const DEFAULT_COMPETITOR_PRICE = "$18,000 / year";
const DEFAULT_COMPETITOR_MAP_ALT = "Competitor data layer preview";
const DEFAULT_COMPETITOR_FEATURES: ComparisonFeature[] = [
  { title: "8,200 rows", description: "County-level aggregated outage counts pulled from a single utility's public reports" },
  { title: "Self-reported data", description: "Provided directly by utilities, not independently audited or cross-checked" },
  { title: "Updated annually", description: "Refreshed once a year, often months behind real-world conditions" },
];

export default function BetterPricesRow({
  columbusTitle = DEFAULT_COLUMBUS_TITLE,
  columbusPrice = DEFAULT_COLUMBUS_PRICE,
  columbusMapAlt = DEFAULT_COLUMBUS_MAP_ALT,
  columbusFeatures = DEFAULT_COLUMBUS_FEATURES,
  competitorTitle = DEFAULT_COMPETITOR_TITLE,
  competitorPrice = DEFAULT_COMPETITOR_PRICE,
  competitorMapAlt = DEFAULT_COMPETITOR_MAP_ALT,
  competitorFeatures = DEFAULT_COMPETITOR_FEATURES,
}: BetterPricesRowProps = {}) {
  /* Columbus card's feature icons track the selected industry's accent
     (the same colour as its data-layer glyph); the competitor card keeps
     the neutral navy. */
  const { industryId } = useIndustry();
  const columbusIconColor = INDUSTRY_COLOR[industryId] ?? "var(--ent-accent)";
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
      style={{ fontFamily: FONT }}
    >
      {/* Heading column — sits on the left for the full row height */}
      <div className="lg:col-span-4 lg:pr-8">
        <h3
          className="text-[28px] md:text-[36px] lg:text-[44px] leading-[1.05]"
          style={{
            color: "var(--ent-text-primary)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            maxWidth: 360,
          }}
        >
          Better Data, Better Prices
        </h3>
        <div
          className="mt-4 text-[14px] md:text-[15px] leading-[1.6]"
          style={{
            color: "var(--ent-text-secondary)",
            letterSpacing: "-0.005em",
            maxWidth: 320,
          }}
        >
          Purchase{" "}
          <span style={{ color: "var(--ent-accent)", fontWeight: 500 }}>
            premium data
          </span>{" "}
          at the most{" "}
          <span style={{ color: "var(--ent-accent)", fontWeight: 500 }}>
            competitive prices
          </span>
          .
        </div>
      </div>

      {/* Comparison cards on the right — two columns */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        <ComparisonCard
          title="Columbus Data Layer"
          priceLabel="Market price"
          price={columbusPrice}
          avatar={<ColumbusMark size={20} />}
          mapAlt={columbusMapAlt}
          highlighted
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--ent-text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
            }}
          >
            {columbusTitle}
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {columbusFeatures.map((f, i) => (
              <FeatureRow
                key={`col-${i}`}
                icon={<CheckIcon />}
                title={f.title}
                description={f.description}
                color={columbusIconColor}
              />
            ))}
          </ul>
        </ComparisonCard>

        <ComparisonCard
          title="Best Competitor"
          priceLabel="Market price"
          price={competitorPrice}
          avatar={<CompetitorMark />}
          mapAlt={competitorMapAlt}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--ent-text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
            }}
          >
            {competitorTitle}
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {competitorFeatures.map((f, i) => (
              <FeatureRow
                key={`comp-${i}`}
                icon={<XIcon />}
                title={f.title}
                description={f.description}
              />
            ))}
          </ul>
        </ComparisonCard>
      </div>
    </div>
  );
}

function FeatureRow({
  icon,
  title,
  description,
  color = "#0B1B2B",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  /* Drives the icon colour via currentColor (FeatureIconSvg uses
     stroke="currentColor"). Defaults to the neutral navy for the
     competitor card. */
  color?: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="inline-flex items-center justify-center"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: "rgba(11,27,43,0.06)",
          color,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ent-text-primary)",
            letterSpacing: "-0.005em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 13,
            color: "var(--ent-text-secondary)",
            letterSpacing: "-0.005em",
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>
    </li>
  );
}

function FeatureIconSvg({
  children,
  strokeWidth = 2,
}: {
  children: React.ReactNode;
  strokeWidth?: number;
}) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/* Columbus features = checkmarks (what you get); competitor = X marks
   (what you don't). Both inherit colour from the FeatureRow via
   currentColor. */
function CheckIcon() {
  return (
    <FeatureIconSvg strokeWidth={3.25}>
      <path d="M20 6 9 17l-5-5" />
    </FeatureIconSvg>
  );
}

function XIcon() {
  return (
    <FeatureIconSvg strokeWidth={3.25}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </FeatureIconSvg>
  );
}

/* Generic "data vendor" mark for the competitor card — a building glyph
   that reads as a neutral corporate/vendor identity without committing to a
   real brand. Kept in greyscale so the Columbus mark visually leads. */
function CompetitorMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#71717A"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
