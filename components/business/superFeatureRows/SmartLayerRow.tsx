"use client";

import RowHeader from "./RowHeader";
import ColumbusMark from "./ColumbusMark";

/* Row 1 — "With smart layers, you become an artist".
   Stacked layout: chip + heading + subtitle on top, full-width composite
   panel below. The panel mocks a Columbus workspace — a sidebar image
   pinned to the left, a Columbus "created a new smart layer" card next
   to a hex-bin heatmap stretched to match the card's height, and a
   full-width prompt input bar pinned to the bottom. */

const FONT =
  "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif";

export type SmartLayerFeature = {
  title: string;
  description: string;
};

export type SmartLayerRowProps = {
  layerName?: string;
  layerSubtitle?: string;
  layerDescription?: string;
  features?: SmartLayerFeature[];
  mapAlt?: string;
  mapSrc?: string;
  promptText?: string;
};

const DEFAULT_LAYER_NAME = "Value-Add Rent Lift Probability";
const DEFAULT_LAYER_SUBTITLE = "Subtitle information maybe";
const DEFAULT_LAYER_DESCRIPTION =
  "AI-generated layer scoring the probability of achieving 25%+ rent lift within 24 months of renovation.";
const DEFAULT_FEATURES: SmartLayerFeature[] = [
  { title: "Generated from 20+ data sources", description: "Historical electricity outage records resolved to the individual distribution feeder, harmonized across major utilities" },
  { title: "Fills critical data gaps", description: "Triple-checked for completeness and consistency" },
  { title: "property level scoring", description: "Fresh data, continuously monitored and maintained" },
];
const DEFAULT_MAP_ALT = "Nashville smart layer heatmap";
const DEFAULT_MAP_SRC = "/business/becomeartistMap.png";
const DEFAULT_PROMPT_TEXT =
  "Create a smart layer called 'Value-Add Rent Lift Probability' for every multifamily property of 100+ units built between 1975 and 2000 across the Nashville MSA. Score each property on the probability of supporting a 25%+ rent lift within 24 months of renovation";

export default function SmartLayerRow({
  layerName = DEFAULT_LAYER_NAME,
  layerSubtitle = DEFAULT_LAYER_SUBTITLE,
  layerDescription = DEFAULT_LAYER_DESCRIPTION,
  features = DEFAULT_FEATURES,
  mapAlt = DEFAULT_MAP_ALT,
  mapSrc = DEFAULT_MAP_SRC,
  promptText = DEFAULT_PROMPT_TEXT,
}: SmartLayerRowProps = {}) {
  return (
    <div style={{ fontFamily: FONT, position: "relative" }}>
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

      {/* Main composite — sidebar image pinned to the left, chat content
          (smart-layer overlay + map) on the right. The prompt bar lives
          OUTSIDE this card so it can read as a separate floating
          element with its own drop shadow. */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "var(--ent-radius-2xl)",
          border: "1px solid var(--ent-border-card)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "64px 1fr",
          alignItems: "stretch",
        }}
      >
        <img
          src="/business/become-artist-sidebar.png"
          alt=""
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />

        <div
          style={{
            position: "relative",
            minWidth: 0,
            minHeight: 480,
          }}
        >
          {/* Map — fills the right container almost edge to edge (3px
              gutter on top and right) and extends all the way left and
              down so it sits BEHIND the smart-layer overlay card on the
              left. */}
          <div
            role={mapAlt ? "img" : undefined}
            aria-label={mapAlt || undefined}
            style={{
              position: "absolute",
              top: 3,
              right: 3,
              bottom: 0,
              left: 0,
              borderRadius: 12,
              backgroundImage: `url(${mapSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Smart-layer overlay — its own white card floating on top
              of the map, anchored to the top-left of the right area. */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: "clamp(20px, 2vw, 28px)",
              width: "min(45%, 460px)",
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "18px 20px",
              }}
            >
              <SmartLayerOverlay
                layerName={layerName}
                layerSubtitle={layerSubtitle}
                layerDescription={layerDescription}
                features={features}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prompt bar — floating card anchored to the BOTTOM of the main
          composite so its lower edge sits flush with the card's bottom
          edge regardless of how many lines the prompt text wraps to.
          Absolute positioning pulls it out of the flow so the next
          sub-feature below isn't pushed down by its height. Left offset
          equals the sidebar column width (64px) so the prompt sits to
          the RIGHT of the sidebar image instead of covering it. */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 64,
          right: 0,
          zIndex: 2,
        }}
      >
        <PromptBar text={promptText} />
      </div>
    </div>
  );
}

function SmartLayerOverlay({
  layerName,
  layerSubtitle,
  layerDescription,
  features,
}: {
  layerName: string;
  layerSubtitle: string;
  layerDescription: string;
  features: SmartLayerFeature[];
}) {
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
        {layerDescription}
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
              {layerName}
            </div>
            <div
              style={{
                marginTop: 2,
                fontSize: 13,
                color: "#7C7C85",
                letterSpacing: "-0.005em",
              }}
            >
              {layerSubtitle}
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
          {features.map((f, i) => (
            <FeatureRow
              key={i}
              icon={[<SourceIcon key="src" />, <VerifiedIcon key="ver" />, <FreshIcon key="fresh" />][i] ?? <SourceIcon />}
              title={f.title}
              description={f.description}
            />
          ))}
        </ul>
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
          background: "var(--ent-accent)",
          color: "#FFFFFF",
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
        background: "#FFFFFF",
        borderRadius: 12,
        border: "1px solid var(--ent-border-card)",
        boxShadow: "0 12px 32px rgba(11, 27, 43, 0.10), 0 2px 6px rgba(11, 27, 43, 0.06)",
        padding: "22px clamp(20px, 2vw, 28px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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

/* Feature-row icons — three 12-vbox stroked SVGs that get placed inside
   the accent-coloured square next to each feature. Mapped by index in
   SmartLayerOverlay: source / verified / fresh. */
function FeatureIconSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function SourceIcon() {
  return (
    <FeatureIconSvg>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
    </FeatureIconSvg>
  );
}

function VerifiedIcon() {
  return (
    <FeatureIconSvg>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </FeatureIconSvg>
  );
}

function FreshIcon() {
  return (
    <FeatureIconSvg>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
      <path d="M20.49 15A9 9 0 0 1 5.64 18.36L1 14" />
    </FeatureIconSvg>
  );
}
