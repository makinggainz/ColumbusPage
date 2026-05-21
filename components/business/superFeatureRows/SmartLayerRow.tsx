"use client";

import MapThumb from "./MapThumb";
import RowHeader from "./RowHeader";
import ColumbusMark from "./ColumbusMark";

/* Row 1 — "With smart layers, you become an artist".
   Stacked layout: chip + heading + subtitle on top, full-width composite
   panel below. The panel mocks a Columbus workspace — a navy left rail of
   nav icons, a Columbus "created a new smart layer" card on the left, a
   hex-bin heatmap on the right, and a full-width prompt input bar pinned
   to the bottom. */

const FONT =
  "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif";

export default function SmartLayerRow() {
  return (
    <div style={{ fontFamily: FONT }}>
      <RowHeader
        align="left"
        title="With smart layers, you become an artist"
        subtitle={
          <>
            Columbus has brought accurate GenAI to GeoData.
            <br />
            <a href="#" style={{ color: "var(--ent-accent)", fontWeight: 500 }}>
              Smart layers
            </a>{" "}
            complete gaps in data when its unavailable or hard to survey.
            Columbus turns you into a Cartography artist
          </>
        }
      />

      {/* Outer composite — a single rounded card with the sidebar pinned to
          the left running the full height, the main canvas (Columbus
          content + map) filling the rest, and the prompt bar as the
          bottom row inside the same card. */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "var(--ent-radius-2xl)",
          border: "1px solid var(--ent-border-card)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "64px 1fr",
        }}
      >
        <Sidebar />

        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div
            className="grid grid-cols-1 lg:grid-cols-12 items-start"
            style={{
              gap: 0,
              padding: "clamp(20px, 2vw, 28px)",
            }}
          >
            <div className="lg:col-span-4" style={{ paddingRight: "clamp(0px, 1.5vw, 24px)" }}>
              <SmartLayerOverlay />
            </div>
            <div className="lg:col-span-8">
              <MapThumb
                src="/business/becomeartistMap.png"
                alt="Nashville smart layer heatmap"
                aspectRatio="4 / 3"
                radius="var(--ent-radius-card)"
                shadow={false}
              />
            </div>
          </div>

          <PromptBar
            text="Create a smart layer called 'Value-Add Rent Lift Probability' for every multifamily property of 100+ units built between 1975 and 2000 across the Nashville MSA. Score each property on the probability of supporting a 25%+ rent lift within 24 months of renovation"
          />
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const ACTIVE_INDEX = 1;
  const icons: React.ReactNode[] = [
    <BurgerIcon key="b" />,
    <GridIcon key="g" />,
    <SearchIcon key="s" />,
    <PencilIcon key="p" />,
    <DatabaseIcon key="d" />,
  ];
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRight: "1px solid #ECECEC",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0",
        gap: 14,
      }}
    >
      {icons.map((icon, i) => {
        const active = i === ACTIVE_INDEX;
        return (
          <span
            key={i}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: active ? "#0A1344" : "transparent",
              color: active ? "#FFFFFF" : "#6B7280",
            }}
          >
            {icon}
          </span>
        );
      })}
      <span style={{ flex: 1 }} />
      <span
        aria-hidden
        style={{
          width: 28,
          height: 28,
          borderRadius: 9999,
          background: "linear-gradient(135deg,#C9A782,#7E5A3C)",
          marginBottom: 6,
        }}
      />
      <SettingsIcon />
    </div>
  );
}

function SmartLayerOverlay() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div className="flex items-center gap-2">
        <ColumbusMark size={18} />
        <span
          style={{
            color: "#9AA3AE",
            fontSize: 14,
            letterSpacing: "-0.005em",
            fontWeight: 500,
          }}
        >
          Columbus created a new smart layer
        </span>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--ent-text-primary)",
          letterSpacing: "-0.005em",
        }}
      >
        AI-generated layer scoring the probability of achieving 25%+ rent lift
        within 24 months of renovation.
      </p>

      <div
        style={{
          background: "#F4F4F5",
          borderRadius: 14,
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ent-text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Value-Add Rent Lift Probability
            </div>
            <div
              style={{
                marginTop: 2,
                fontSize: 13,
                color: "#7C7C85",
                letterSpacing: "-0.005em",
              }}
            >
              Subtitle information maybe
            </div>
          </div>
          <SmartLayerPill />
        </div>

        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <FeatureRow
            title="Generated from 20+ data sources"
            description="Historical electricity outage records resolved to the individual distribution feeder, harmonized across major utilities"
          />
          <FeatureRow
            title="Fills critical data gaps"
            description="Triple-checked for completeness and consistency"
          />
          <FeatureRow
            title="property level scoring"
            description="Fresh data, continuously monitored and maintained"
          />
        </ul>
      </div>
    </div>
  );
}

function FeatureRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: "#E4E4E7",
          flexShrink: 0,
          marginTop: 2,
        }}
      />
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

function SmartLayerPill() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#E5ECFF",
        color: "#1B37CE",
        borderRadius: 9999,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        flexShrink: 0,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Smart Layer
    </span>
  );
}

function PromptBar({ text }: { text: string }) {
  return (
    <div
      style={{
        marginTop: "auto",
        background: "#FFFFFF",
        borderTop: "1px solid #ECECEC",
        padding: "20px clamp(20px, 2vw, 28px)",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <p
        style={{
          margin: 0,
          flex: 1,
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--ent-text-primary)",
          letterSpacing: "-0.005em",
        }}
      >
        {text}
      </p>
      <StopButton />
    </div>
  );
}

function StopButton() {
  return (
    <button
      type="button"
      aria-label="Stop"
      style={{
        flexShrink: 0,
        width: 36,
        height: 36,
        borderRadius: 9,
        background: "#E5E7EB",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 12,
          height: 12,
          borderRadius: 2,
          background: "#0A1344",
        }}
      />
    </button>
  );
}

/* Sidebar icon glyphs — simple stroked SVGs at 18px. */
function BurgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 20l4-1 11-11-3-3L5 16l-1 4Z" />
    </svg>
  );
}
function DatabaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
      <path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ marginBottom: 6 }}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.3l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}
