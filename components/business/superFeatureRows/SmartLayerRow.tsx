"use client";

import Image from "next/image";
import RowHeader from "./RowHeader";
import ColumbusMark from "./ColumbusMark";

/* Row 1 — "With smart layers, you become an artist".
   Wraps the smart-layer mock in the shared ResearchFrame chrome (the
   same PNG used by AgenticResearchMockup) so the workspace reads with
   the canonical Columbus app frame: baked-in left rail + top bar, with
   the inner pane (4.32% left, 7.02% top, 0 right, 0.57% bottom) hosting
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

      {/* ResearchFrame chrome — same PNG used by AgenticResearchMockup.
          Carries a baked left rail + top bar (with a "Columbus / project"
          breadcrumb and a "Shared with" group). We cover the project-
          specific portion of the breadcrumb with smart-layer text and
          blank out the collaborator group; the inner pane (4.32% left,
          7.02% top, 0 right, 0.57% bottom) hosts the smart-layer mock. */}
      <div
        className="relative w-full mx-auto"
        style={{
          aspectRatio: "5190 / 2993",
          maxWidth: 1180,
          borderRadius: "var(--ent-radius-2xl)",
          border: "1px solid var(--ent-border-card)",
          /* White wrapper background blends with the chrome image's
             white edges, so the 6px chrome inset below reads as
             seamless across the 24px rounded-corner negative space. */
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
          containerType: "inline-size",
        }}
      >
        {/* Chrome image inset 6px on all sides so its baked-in
            bottom-left settings gear icon doesn't fall inside the
            24px rounded-corner clip — the wrapper's white background
            fills the 6px breathing room around the chrome. */}
        <div
          className="absolute pointer-events-none"
          style={{ inset: 6, zIndex: 5 }}
        >
          <Image
            src="/business/ResearchFrame.png"
            alt=""
            fill
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Breadcrumb cover — replaces the chrome's baked "Kansans
            Project 435..." text with smart-layer breadcrumb. Spans the
            same x range AgenticResearchMockup uses (17.34% → 60.89%). */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "17.34%",
            width: "43.55%",
            height: "7.02%",
            backgroundColor: "#FFFFFF",
            zIndex: 6,
            display: "flex",
            alignItems: "center",
            paddingLeft: "clamp(2px, 0.3cqw, 4px)",
            fontFamily: FONT,
          }}
        >
          <span
            style={{
              fontSize: "clamp(0.7rem, 1.15cqw, 1rem)",
              fontWeight: 600,
              color: "#0F173C",
              letterSpacing: "-0.015em",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Smart Layers
            <span
              style={{
                color: "#6B7280",
                fontWeight: 500,
                margin: "0 clamp(6px, 0.8cqw, 10px)",
              }}
            >
              /
            </span>
            {layerName}
          </span>
        </div>

        {/* Shared-with cover — blanks out the baked-in collaborator
            avatars since the smart-layer view doesn't share an artifact
            the way agentic research does. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "69.36%",
            width: "15.42%",
            height: "7.02%",
            backgroundColor: "#FFFFFF",
            zIndex: 6,
          }}
        />

        {/* Inner pane — sits flush against the chrome's solid white
            content area. Map fills the pane; the smart-layer card and
            the prompt bar float on top. */}
        <div
          className="absolute"
          style={{
            left: "4.32%",
            top: "7.02%",
            right: 0,
            bottom: "0.57%",
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
            zIndex: 10,
            fontFamily: FONT,
          }}
        >
          {/* Map — fills the inner pane with a 3px gutter on top and
              right; extends all the way left and down so it sits
              BEHIND the smart-layer overlay card and prompt bar.
              Carries the same vibrancy filter as MapThumb /
              MapLayeredVisual so industry maps match the CRE reference
              regardless of which renderer they're piped through. */}
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
              filter: "saturate(1.2) contrast(1.08)",
            }}
          />

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
