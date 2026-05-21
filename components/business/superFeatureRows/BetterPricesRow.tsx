"use client";

import ColumbusMark from "./ColumbusMark";
import ComparisonCard from "./ComparisonCard";

/* Row 3 — "Better Data, Better Prices".
   Side-by-side layout: heading + subtitle in a 4-col left column, two
   ComparisonCards in an 8-col right column. Columbus card carries the real
   logomark and full data; the competitor card runs parallel content sized
   to make Columbus's advantage read at a glance. */

const FONT =
  "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif";

export default function BetterPricesRow() {
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
          <a href="#" style={{ color: "var(--ent-accent)" }}>
            premium data
          </a>{" "}
          at the most{" "}
          <a href="#" style={{ color: "var(--ent-accent)" }}>
            competitive prices
          </a>
          .
        </div>
      </div>

      {/* Comparison cards on the right — two columns */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        <ComparisonCard
          title="Columbus Data Layer"
          priceLabel="Market price"
          price="$2,400 / year"
          avatar={<ColumbusMark size={20} />}
          mapSrc="/business/map2.png"
          mapAlt="Power grid outage layer preview"
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
            Power grid outage history with feeder-circuit-level granularity
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
            <FeatureRow
              icon={<DatabaseIcon />}
              title="55,010 rows"
              description="Historical outage records resolved to the individual distribution feeder, harmonized across major utilities"
            />
            <FeatureRow
              icon={<ShieldCheckIcon />}
              title="Verified accuracy"
              description="Triple-checked for completeness and consistency before every release"
            />
            <FeatureRow
              icon={<RefreshIcon />}
              title="Updated quarterly"
              description="Fresh data, continuously monitored and maintained"
            />
          </ul>
        </ComparisonCard>

        <ComparisonCard
          title="Best Competitor"
          priceLabel="Market price"
          price="$18,000 / year"
          avatar={<CompetitorMark />}
          mapSrc="/business/map3.png"
          mapAlt="Competitor data layer preview"
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
            Power grid outages, county-level aggregates only
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
            <FeatureRow
              icon={<DatabaseIcon />}
              title="8,200 rows"
              description="County-level aggregated outage counts pulled from a single utility's public reports"
            />
            <FeatureRow
              icon={<AlertIcon />}
              title="Self-reported data"
              description="Provided directly by utilities, not independently audited or cross-checked"
            />
            <FeatureRow
              icon={<CalendarIcon />}
              title="Updated annually"
              description="Refreshed once a year, often months behind real-world conditions"
            />
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
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

function FeatureIconSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0B1B2B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <FeatureIconSvg>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
    </FeatureIconSvg>
  );
}

function ShieldCheckIcon() {
  return (
    <FeatureIconSvg>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </FeatureIconSvg>
  );
}

function RefreshIcon() {
  return (
    <FeatureIconSvg>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
      <path d="M20.49 15A9 9 0 0 1 5.64 18.36L1 14" />
    </FeatureIconSvg>
  );
}

function AlertIcon() {
  return (
    <FeatureIconSvg>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </FeatureIconSvg>
  );
}

function CalendarIcon() {
  return (
    <FeatureIconSvg>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </FeatureIconSvg>
  );
}

/* Generic "data vendor" mark for the competitor card — a four-tile grid
   that reads as a neutral data/geo glyph without committing to a real
   brand identity. Kept in greyscale so the Columbus mark visually leads. */
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
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <rect x="14" y="14" width="7" height="7" rx="1.2" />
    </svg>
  );
}
