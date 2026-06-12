"use client";

import RowHeader from "./RowHeader";
import ColumbusMark from "./ColumbusMark";
import { ScaleToFit } from "../../technology/redesign/ScaleToFit";
import MapBgImage from "../MapBgImage";
import MockupChrome from "../MockupChrome";

/* Row 1 — "With smart layers, you become an artist".
   Wraps the smart-layer mock in the shared programmatic <MockupChrome> —
   the same code-drawn Columbus app frame used by the hero's Agentic
   Research view — so the two stay visually identical. The inner pane hosts
   the map, the floating smart-layer card, and the prompt bar. */

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
const DEFAULT_MAP_SRC = "/BusinessPgMedia/CREUseCases/MapVisuals/becomeartistMap.png";
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
    <div style={{ fontFamily: FONT }}>
      <RowHeader
        align="left"
        title="With smart layers, you become an artist"
        subtitle={
          <>
            Columbus has brought accurate GenAI to GeoData.
            <br />
            <span style={{ color: "var(--ent-accent)", fontWeight: 500 }}>
              Smart layers
            </span>{" "}
            complete gaps in data when its unavailable or hard to survey.
            Columbus turns you into a Cartography artist
          </>
        }
      />

      {/* Faithful-miniature wrap: passthrough at ≥1180, uniform scale below. */}
      <ScaleToFit designWidth={1180} className="biz-scale-visual">
      <MockupChrome
        className="biz-product-display"
        railIcons={["grid", "search-star", "edit", "database"]}
        activeRailIndex={0}
        crumbs={["Smart Layers", layerName]}
        hideMascot
      >
        {/* Inner pane — map fills it; the smart-layer card and the prompt
            bar float on top. */}
        <div
          className="absolute"
          style={{
            inset: 0,
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
            fontFamily: FONT,
          }}
        >
          {/* Map — fills the entire inner pane (flush to all four edges,
              up to the bottom of the top nav bar) so it sits BEHIND the
              smart-layer overlay card and prompt bar. Carries the same
              vibrancy filter as MapThumb / MapLayeredVisual so industry
              maps match the CRE reference regardless of which renderer
              they're piped through. */}
          <div
            role={mapAlt ? "img" : undefined}
            aria-label={mapAlt || undefined}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 12,
              overflow: "hidden",
              filter: "saturate(1.2) contrast(1.08)",
            }}
          >
            <MapBgImage src={mapSrc} />
          </div>

          {/* Content stack — fills the inner pane vertically. The
              overlay wrapper carries its own top + left + bottom
              inset (so the smart-layer card stays clear of the inner
              pane's edges), but the chatbox sits FLUSH against the
              inner pane's bottom, left, and right edges. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "min(58%, 580px)",
                flex: 1,
                minHeight: 0,
                marginTop: "clamp(10px, 1.2cqw, 16px)",
                marginLeft: "clamp(10px, 1.2cqw, 16px)",
                marginBottom: "clamp(10px, 1.2cqw, 16px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding:
                    "clamp(12px, 1.4cqw, 18px) clamp(14px, 1.5cqw, 20px)",
                  flex: 1,
                  minHeight: 0,
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

            <PromptBar text={promptText} />
          </div>
        </div>
      </MockupChrome>
      </ScaleToFit>
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
        /* Top corners rounded (12px to match the map above); bottom
           corners square because the bar is flush with the inner
           pane's bottom edge — a rounded bottom would create visible
           map slivers in the bottom-left/right corners. */
        borderRadius: "12px 12px 0 0",
        borderTop: "1px solid var(--ent-border-card)",
        /* Shadow projects ONLY upward: negative Y offset, negative
           spread to choke off horizontal/downward bleed. */
        boxShadow: "0 -10px 24px -6px rgba(11, 27, 43, 0.18), 0 -2px 6px -2px rgba(11, 27, 43, 0.08)",
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
          width: "63%",
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
