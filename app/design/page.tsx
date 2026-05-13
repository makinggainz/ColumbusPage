/**
 * /design — design-system reference page.
 *
 * This page documents the design system AS IT IS CODED in this project.
 * Sources of truth, in priority order:
 *   1. design-system/tokens.css   — Material Design 3 reference, system, and component tokens
 *   2. app/globals.css            — project-specific overrides and additions (--grid-line,
 *                                   --accent, --primary, --page-padding, --container-padding,
 *                                   --font-hero, --text-md, --text-display)
 *   3. app/fonts.ts               — registered next/font families
 *   4. components/                — observed component patterns
 *
 * Every value below references a real CSS variable. If the underlying token
 * changes, this page reflects the new value automatically.
 *
 * No invented values, no aspirational components.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { MistxNav } from "@/components/layout/MistxNav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Design System — Columbus Earth",
  description:
    "Reference for every token, type style, shape, elevation, motion curve, and component variant defined in this codebase.",
};

// ─────────────────────────────────────────────────────────────────────────
// Local style tokens — reference the project's globals/tokens at runtime.
// ─────────────────────────────────────────────────────────────────────────
const PAGE_BG = "#FFFFFF"; // app/globals.css --background
const FG = "#1D1D1F"; // app/globals.css --foreground / --primary
const ACCENT = "#0066CC"; // app/globals.css --accent
const HAIRLINE = "rgba(37, 99, 235, 0.3)"; // app/globals.css --grid-line
const HAIRLINE_SOFT = "rgba(0, 0, 0, 0.08)";
const MUTED = "rgba(29, 29, 31, 0.62)";
const FAINT = "rgba(29, 29, 31, 0.42)";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

// ─────────────────────────────────────────────────────────────────────────
// Data — every entry below corresponds to a real entry in tokens.css /
// globals.css / fonts.ts. Numbers and CSS variables are NOT invented.
// ─────────────────────────────────────────────────────────────────────────

// Reference palettes — six palettes × 13 tones each, defined in
// design-system/tokens.css lines 18-107.
const TONE_KEYS = ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "95", "99", "100"] as const;

const PALETTES: { id: string; label: string }[] = [
  { id: "primary", label: "Primary" },
  { id: "secondary", label: "Secondary" },
  { id: "tertiary", label: "Tertiary" },
  { id: "error", label: "Error" },
  { id: "neutral", label: "Neutral" },
  { id: "neutral-variant", label: "Neutral Variant" },
];

// System color roles — design-system/tokens.css lines 122-168 (light theme).
const COLOR_ROLES: { token: string; pair?: string; note?: string }[] = [
  { token: "primary", pair: "on-primary" },
  { token: "primary-container", pair: "on-primary-container" },
  { token: "secondary", pair: "on-secondary" },
  { token: "secondary-container", pair: "on-secondary-container" },
  { token: "tertiary", pair: "on-tertiary" },
  { token: "tertiary-container", pair: "on-tertiary-container" },
  { token: "error", pair: "on-error" },
  { token: "error-container", pair: "on-error-container" },
  { token: "background", pair: "on-background" },
  { token: "surface", pair: "on-surface" },
  { token: "surface-variant", pair: "on-surface-variant" },
  { token: "surface-dim" },
  { token: "surface-bright" },
  { token: "surface-container-lowest" },
  { token: "surface-container-low" },
  { token: "surface-container" },
  { token: "surface-container-high" },
  { token: "surface-container-highest" },
  { token: "outline" },
  { token: "outline-variant" },
  { token: "inverse-surface", pair: "inverse-on-surface" },
  { token: "inverse-primary" },
];

// Project-specific colors — app/globals.css lines 74-80.
const PROJECT_COLORS: { name: string; value: string; cssVar: string; usage: string }[] = [
  { name: "Background", value: "#FFFFFF", cssVar: "--background", usage: "Default page background" },
  { name: "Foreground", value: "#1D1D1F", cssVar: "--foreground", usage: "Default text color" },
  { name: "Primary", value: "#1D1D1F", cssVar: "--primary", usage: "Project primary (overrides M3 purple)" },
  { name: "Accent", value: "#0066CC", cssVar: "--accent", usage: "Brand accent — links, CTA, highlights" },
  { name: "Grid line", value: "rgba(37, 99, 235, 0.3)", cssVar: "--grid-line", usage: "Vertical structure lines, IslandGap dividers" },
];

// Type scale — design-system/tokens.css lines 224-319. 15 styles.
const TYPE_SCALE: { name: string; varBase: string; sizePx: number; lhPx: number; weight: number; trackingPx: string; sample: string }[] = [
  { name: "Display Large",   varBase: "display-large",   sizePx: 57, lhPx: 64, weight: 400, trackingPx: "-0.25px",   sample: "Display Large" },
  { name: "Display Medium",  varBase: "display-medium",  sizePx: 45, lhPx: 52, weight: 400, trackingPx: "0",          sample: "Display Medium" },
  { name: "Display Small",   varBase: "display-small",   sizePx: 36, lhPx: 44, weight: 400, trackingPx: "0",          sample: "Display Small" },
  { name: "Headline Large",  varBase: "headline-large",  sizePx: 32, lhPx: 40, weight: 400, trackingPx: "0",          sample: "Headline Large" },
  { name: "Headline Medium", varBase: "headline-medium", sizePx: 28, lhPx: 36, weight: 400, trackingPx: "0",          sample: "Headline Medium" },
  { name: "Headline Small",  varBase: "headline-small",  sizePx: 24, lhPx: 32, weight: 400, trackingPx: "0",          sample: "Headline Small" },
  { name: "Title Large",     varBase: "title-large",     sizePx: 22, lhPx: 28, weight: 400, trackingPx: "0",          sample: "Title Large" },
  { name: "Title Medium",    varBase: "title-medium",    sizePx: 16, lhPx: 24, weight: 500, trackingPx: "0.15px",     sample: "Title Medium" },
  { name: "Title Small",     varBase: "title-small",     sizePx: 14, lhPx: 20, weight: 500, trackingPx: "0.1px",      sample: "Title Small" },
  { name: "Body Large",      varBase: "body-large",      sizePx: 16, lhPx: 24, weight: 400, trackingPx: "0.5px",      sample: "Body large — paragraph copy and list supporting text." },
  { name: "Body Medium",     varBase: "body-medium",     sizePx: 14, lhPx: 20, weight: 400, trackingPx: "0.25px",     sample: "Body medium — secondary copy and dense layouts." },
  { name: "Body Small",      varBase: "body-small",      sizePx: 12, lhPx: 16, weight: 400, trackingPx: "0.4px",      sample: "Body small — legal text and metadata." },
  { name: "Label Large",     varBase: "label-large",     sizePx: 14, lhPx: 20, weight: 500, trackingPx: "0.1px",      sample: "Label Large — buttons, chips" },
  { name: "Label Medium",    varBase: "label-medium",    sizePx: 12, lhPx: 16, weight: 500, trackingPx: "0.5px",      sample: "Label Medium" },
  { name: "Label Small",     varBase: "label-small",     sizePx: 11, lhPx: 16, weight: 500, trackingPx: "0.5px",      sample: "Label Small" },
];

// Fonts registered in app/fonts.ts plus the Axiforma reference in globals.css.
const FONTS: { name: string; usage: string; loader: string }[] = [
  { name: "DM Sans",            usage: "M3 brand + plain typeface (default body/UI)", loader: "next/font/google" },
  { name: "Geist",              usage: "Available via --font-geist-sans (alt sans)",  loader: "next/font/google" },
  { name: "Cormorant Garamond", usage: "Display serif (weight 600)",                  loader: "next/font/google" },
  { name: "Cambo",              usage: "Display serif (weight 400)",                  loader: "next/font/google" },
  { name: "Instrument Serif",   usage: "Display serif (weight 400)",                  loader: "next/font/google" },
  { name: "Axiforma",           usage: "Hero font (--font-hero)",                     loader: "globals.css @font-face" },
];

// Shape scale — design-system/tokens.css lines 326-332.
const SHAPE_SCALE: { name: string; cssVar: string; px: string }[] = [
  { name: "None",        cssVar: "--md-sys-shape-corner-none",        px: "0px" },
  { name: "Extra Small", cssVar: "--md-sys-shape-corner-extra-small", px: "4px" },
  { name: "Small",       cssVar: "--md-sys-shape-corner-small",       px: "8px" },
  { name: "Medium",      cssVar: "--md-sys-shape-corner-medium",      px: "12px" },
  { name: "Large",       cssVar: "--md-sys-shape-corner-large",       px: "16px" },
  { name: "Extra Large", cssVar: "--md-sys-shape-corner-extra-large", px: "28px" },
  { name: "Full",        cssVar: "--md-sys-shape-corner-full",        px: "9999px" },
];

// Spacing — per design-system/design-system.md §5: 4px base grid.
const SPACING: { units: number; px: number; usage: string }[] = [
  { units: 1,  px: 4,  usage: "Icon inner padding, dense list dividers" },
  { units: 2,  px: 8,  usage: "Icon-to-label gap, chip internal padding" },
  { units: 3,  px: 12, usage: "—" },
  { units: 4,  px: 16, usage: "Card padding, list item padding, standard horizontal margins" },
  { units: 6,  px: 24, usage: "Dialog padding, section separation, --container-padding" },
  { units: 8,  px: 32, usage: "Large section gaps" },
  { units: 12, px: 48, usage: "Page section vertical rhythm" },
  { units: 16, px: 64, usage: "Hero spacing, large layout gaps; --text-display" },
];

// Elevation — design-system/tokens.css lines 339-356.
const ELEVATIONS: { level: number; cssVar: string; usage: string }[] = [
  { level: 0, cssVar: "--md-sys-elevation-level0", usage: "Flat surfaces, filled containers" },
  { level: 1, cssVar: "--md-sys-elevation-level1", usage: "Cards (resting), nav bars" },
  { level: 2, cssVar: "--md-sys-elevation-level2", usage: "Menus, dropdowns, popovers" },
  { level: 3, cssVar: "--md-sys-elevation-level3", usage: "FAB, dialogs" },
  { level: 4, cssVar: "--md-sys-elevation-level4", usage: "Modals" },
  { level: 5, cssVar: "--md-sys-elevation-level5", usage: "Navigation drawers" },
];

// Motion — design-system/tokens.css lines 364-391.
const MOTION_DURATIONS: { name: string; ms: number }[] = [
  { name: "short1",       ms: 50 },
  { name: "short2",       ms: 100 },
  { name: "short3",       ms: 150 },
  { name: "short4",       ms: 200 },
  { name: "medium1",      ms: 250 },
  { name: "medium2",      ms: 300 },
  { name: "medium3",      ms: 350 },
  { name: "medium4",      ms: 400 },
  { name: "long1",        ms: 450 },
  { name: "long2",        ms: 500 },
  { name: "long3",        ms: 550 },
  { name: "long4",        ms: 600 },
  { name: "extra-long1",  ms: 700 },
  { name: "extra-long2",  ms: 800 },
  { name: "extra-long3",  ms: 900 },
  { name: "extra-long4",  ms: 1000 },
];

const MOTION_EASINGS: { name: string; bezier: string; usage: string }[] = [
  { name: "standard",                bezier: "cubic-bezier(0.2, 0, 0, 1)",      usage: "Default. UI elements that enter and exit." },
  { name: "standard-decelerate",     bezier: "cubic-bezier(0, 0, 0, 1)",        usage: "Standard variant for entering elements." },
  { name: "standard-accelerate",     bezier: "cubic-bezier(0.3, 0, 1, 1)",      usage: "Standard variant for exiting elements." },
  { name: "emphasized",              bezier: "cubic-bezier(0.2, 0, 0, 1)",      usage: "Larger transitions: FABs, sheets, full-page." },
  { name: "emphasized-decelerate",   bezier: "cubic-bezier(0.05, 0.7, 0.1, 1)", usage: "Entering elements (preferred)." },
  { name: "emphasized-accelerate",   bezier: "cubic-bezier(0.3, 0, 0.8, 0.15)", usage: "Exiting elements (preferred)." },
  { name: "legacy",                  bezier: "cubic-bezier(0.4, 0, 0.2, 1)",    usage: "Compatibility with older Material." },
  { name: "legacy-decelerate",       bezier: "cubic-bezier(0, 0, 0.2, 1)",      usage: "Legacy variant for entering." },
  { name: "legacy-accelerate",       bezier: "cubic-bezier(0.4, 0, 1, 1)",      usage: "Legacy variant for exiting." },
  { name: "linear",                  bezier: "cubic-bezier(0, 0, 1, 1)",        usage: "Equivalent to CSS linear; rarely correct." },
];

// State layers — design-system/tokens.css lines 399-404.
const STATE_LAYERS: { name: string; opacity: number; usage: string }[] = [
  { name: "hover",              opacity: 0.08, usage: "Interactive surface on hover" },
  { name: "focus",              opacity: 0.12, usage: "Keyboard focus ring layer" },
  { name: "pressed",            opacity: 0.12, usage: "Active/pressed state" },
  { name: "dragged",            opacity: 0.16, usage: "Element being dragged" },
  { name: "disabled-container", opacity: 0.12, usage: "Disabled container fill" },
  { name: "disabled-content",   opacity: 0.38, usage: "Disabled icon/text alpha" },
];

// Component tokens — design-system/tokens.css lines 411-516.
const COMPONENT_SPECS: { name: string; rows: { k: string; v: string }[] }[] = [
  {
    name: "Filled Button",
    rows: [
      { k: "Container color",  v: "primary" },
      { k: "Label color",      v: "on-primary" },
      { k: "Container height", v: "40px" },
      { k: "Container shape",  v: "shape-corner-full (9999px)" },
      { k: "Horizontal padding", v: "24px" },
      { k: "Icon size",        v: "18px" },
      { k: "Label style",      v: "Label Large" },
    ],
  },
  {
    name: "FAB (Floating Action Button)",
    rows: [
      { k: "Container color",  v: "primary-container" },
      { k: "Icon color",       v: "on-primary-container" },
      { k: "Container shape",  v: "shape-corner-large (16px)" },
      { k: "Container size",   v: "56px" },
      { k: "Icon size",        v: "24px" },
      { k: "Elevation",        v: "level3" },
    ],
  },
  {
    name: "Card",
    rows: [
      { k: "Container color",  v: "surface-container-low" },
      { k: "Container shape",  v: "shape-corner-medium (12px)" },
      { k: "Elevation",        v: "level1" },
      { k: "Outline color",    v: "outline-variant" },
      { k: "Padding",          v: "16px" },
    ],
  },
  {
    name: "Navigation Bar",
    rows: [
      { k: "Container color",  v: "surface-container" },
      { k: "Active indicator color", v: "secondary-container" },
      { k: "Icon color (rest)", v: "on-surface-variant" },
      { k: "Active icon color", v: "on-secondary-container" },
      { k: "Container height", v: "80px" },
      { k: "Icon size",        v: "24px" },
      { k: "Active indicator", v: "64×32, shape-corner-full" },
    ],
  },
  {
    name: "Outlined Text Field",
    rows: [
      { k: "Container shape",  v: "shape-corner-extra-small (4px)" },
      { k: "Container height", v: "56px" },
      { k: "Outline color",    v: "outline" },
      { k: "Focus outline",    v: "primary" },
      { k: "Horizontal padding", v: "16px" },
      { k: "Body text",        v: "Body Large" },
    ],
  },
  {
    name: "Chip",
    rows: [
      { k: "Container shape",  v: "shape-corner-small (8px)" },
      { k: "Container height", v: "32px" },
      { k: "Horizontal padding", v: "16px" },
      { k: "Outline color",    v: "outline" },
      { k: "Selected fill",    v: "secondary-container" },
      { k: "Icon size",        v: "18px" },
    ],
  },
  {
    name: "Dialog",
    rows: [
      { k: "Container color",  v: "surface-container-high" },
      { k: "Container shape",  v: "shape-corner-extra-large (28px)" },
      { k: "Elevation",        v: "level3" },
      { k: "Padding",          v: "24px" },
    ],
  },
  {
    name: "Top App Bar",
    rows: [
      { k: "Container color",  v: "surface" },
      { k: "Headline color",   v: "on-surface" },
      { k: "Container height", v: "64px (small: 56px)" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Page sections (anchor list for the table of contents)
// ─────────────────────────────────────────────────────────────────────────
const TOC: { id: string; label: string }[] = [
  { id: "color",          label: "Color" },
  { id: "color-roles",    label: "Color Roles" },
  { id: "project-color",  label: "Project Colors" },
  { id: "typography",     label: "Typography" },
  { id: "fonts",          label: "Fonts" },
  { id: "shape",          label: "Shape" },
  { id: "spacing",        label: "Spacing" },
  { id: "elevation",      label: "Elevation" },
  { id: "motion",         label: "Motion" },
  { id: "state",          label: "State Layers" },
  { id: "components",     label: "Components" },
  { id: "patterns",       label: "Patterns" },
];

// ─────────────────────────────────────────────────────────────────────────
// Reusable building blocks
// ─────────────────────────────────────────────────────────────────────────
function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: FAINT,
      }}
    >
      <span style={{ color: FG }}>{index}</span>
      <span style={{ width: 32, height: 1, background: HAIRLINE }} />
      <span>{label}</span>
    </div>
  );
}

function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ borderTop: `1px solid ${HAIRLINE_SOFT}` }}>
      <div className="max-w-[1408px] mx-auto px-6 md:px-12 py-20 md:py-24">
        <Eyebrow index={index} label={eyebrow} />
        <h2 className="mt-6 font-light leading-[1.1] tracking-[-0.02em]" style={{ fontSize: "clamp(28px, 3.4vw, 44px)", color: FG }}>
          {title}
        </h2>
        {description && (
          <p className="mt-4 leading-[1.6]" style={{ fontSize: 16, color: MUTED, maxWidth: 720 }}>
            {description}
          </p>
        )}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function CodeChip({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: MONO,
        fontSize: 11,
        padding: "2px 6px",
        borderRadius: 4,
        background: "rgba(0,0,0,0.04)",
        color: FG,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </code>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────
export default function DesignPage() {
  return (
    <main style={{ background: PAGE_BG, color: FG }}>
      <MistxNav />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header style={{ borderBottom: `1px solid ${HAIRLINE_SOFT}` }}>
        <div className="max-w-[1408px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20 md:pb-28">
          <Eyebrow index="00" label="Reference" />
          <h1
            className="mt-8 font-light leading-[1.02] tracking-[-0.03em]"
            style={{ fontSize: "clamp(40px, 7vw, 96px)", color: FG, maxWidth: 1100 }}
          >
            Design system
          </h1>
          <p className="mt-8 leading-[1.6]" style={{ fontSize: 18, color: MUTED, maxWidth: 720 }}>
            Every token, type style, shape, elevation, motion curve, and component variant defined in
            this codebase. Sourced from{" "}
            <CodeChip>design-system/tokens.css</CodeChip>,{" "}
            <CodeChip>app/globals.css</CodeChip>,{" "}
            <CodeChip>app/fonts.ts</CodeChip>, and observed component patterns. Nothing on this page
            is invented — values are pulled live from CSS variables.
          </p>

          {/* TOC */}
          <nav
            className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-3"
            aria-label="Sections"
          >
            {TOC.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: FG,
                  textDecoration: "none",
                  borderTop: `1px solid ${HAIRLINE_SOFT}`,
                  paddingTop: 8,
                  display: "flex",
                  gap: 12,
                }}
              >
                <span style={{ color: FAINT }}>{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Color palettes ───────────────────────────────────────────── */}
      <Section
        id="color"
        index="01"
        eyebrow="Foundations / Color"
        title="Reference palettes"
        description="Six tonal palettes — primary, secondary, tertiary, error, neutral, and neutral variant — each with 13 tones from 0 (black) through 100 (white). System color roles are derived from these."
      >
        <div className="grid grid-cols-1 gap-8">
          {PALETTES.map((p) => (
            <div key={p.id}>
              <div className="flex items-baseline justify-between mb-3">
                <h3 style={{ fontSize: 18, fontWeight: 500 }}>{p.label}</h3>
                <CodeChip>{`--md-ref-palette-${p.id}{0…100}`}</CodeChip>
              </div>
              <div className="grid grid-cols-13" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))", gap: 1, background: HAIRLINE_SOFT, border: `1px solid ${HAIRLINE_SOFT}` }}>
                {TONE_KEYS.map((tone) => {
                  const cssVar = `--md-ref-palette-${p.id}${tone}`;
                  // Tones 0-50 read as dark; 60-100 as light. Pick label color accordingly.
                  const labelDark = Number(tone) >= 60;
                  return (
                    <div
                      key={tone}
                      style={{
                        background: `var(${cssVar})`,
                        height: 84,
                        padding: 8,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        color: labelDark ? "#1D1D1F" : "#FFFFFF",
                      }}
                    >
                      <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.7 }}>{tone}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Color roles ──────────────────────────────────────────────── */}
      <Section
        id="color-roles"
        index="02"
        eyebrow="Foundations / Color"
        title="System color roles"
        description="Semantic color slots used by components. Each role pairs with an `on-*` color for accessible text/icons. Roles auto-flip when [data-theme=&quot;dark&quot;] is applied."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1" style={{ background: HAIRLINE_SOFT, border: `1px solid ${HAIRLINE_SOFT}` }}>
          {COLOR_ROLES.map((role) => {
            const bgVar = `--md-sys-color-${role.token}`;
            const fgVar = role.pair ? `--md-sys-color-${role.pair}` : undefined;
            return (
              <div key={role.token} style={{ background: PAGE_BG }}>
                <div
                  style={{
                    background: `var(${bgVar})`,
                    color: fgVar ? `var(${fgVar})` : undefined,
                    padding: 16,
                    minHeight: 120,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ fontFamily: MONO, fontSize: 11, opacity: 0.85 }}>{role.token}</div>
                  {fgVar && <div style={{ fontFamily: MONO, fontSize: 10, opacity: 0.7 }}>{role.pair}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Project-specific colors ──────────────────────────────────── */}
      <Section
        id="project-color"
        index="03"
        eyebrow="Foundations / Color"
        title="Project colors"
        description="Project-specific color tokens defined in app/globals.css. These override or complement the M3 palette and are what most components actually paint with."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: HAIRLINE_SOFT, border: `1px solid ${HAIRLINE_SOFT}` }}>
          {PROJECT_COLORS.map((c) => (
            <div key={c.cssVar} style={{ background: PAGE_BG, padding: 16, display: "flex", gap: 16, alignItems: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: c.value,
                  border: `1px solid ${HAIRLINE_SOFT}`,
                  flexShrink: 0,
                  borderRadius: 4,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED, marginTop: 2 }}>
                  {c.cssVar} → {c.value}
                </div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>{c.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Typography ───────────────────────────────────────────────── */}
      <Section
        id="typography"
        index="04"
        eyebrow="Foundations / Type"
        title="Type scale"
        description="The 15-style M3 type scale. Each style is a complete bundle (font, size, line-height, weight, tracking) — components reference the bundle via tokens, not raw values."
      >
        <div className="space-y-px" style={{ background: HAIRLINE_SOFT }}>
          {TYPE_SCALE.map((t) => (
            <div key={t.varBase} style={{ background: PAGE_BG, padding: "20px 0" }}>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-baseline">
                <div>
                  <div style={{ fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED, marginTop: 4 }}>
                    {t.sizePx}/{t.lhPx} · {t.weight} · {t.trackingPx}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: FAINT, marginTop: 2 }}>
                    --md-sys-typescale-{t.varBase}-*
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: `var(--md-sys-typescale-${t.varBase}-font)`,
                    fontSize: `var(--md-sys-typescale-${t.varBase}-size)`,
                    lineHeight: `var(--md-sys-typescale-${t.varBase}-line-height)`,
                    fontWeight: `var(--md-sys-typescale-${t.varBase}-weight)` as React.CSSProperties["fontWeight"],
                    letterSpacing: `var(--md-sys-typescale-${t.varBase}-tracking)`,
                    color: FG,
                  }}
                >
                  {t.sample}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Fonts ────────────────────────────────────────────────────── */}
      <Section
        id="fonts"
        index="05"
        eyebrow="Foundations / Type"
        title="Fonts"
        description="Typeface families registered in app/fonts.ts (loaded via next/font) plus globals.css references."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: HAIRLINE_SOFT, border: `1px solid ${HAIRLINE_SOFT}` }}>
          {FONTS.map((f) => (
            <div key={f.name} style={{ background: PAGE_BG, padding: 24 }}>
              <div style={{ fontWeight: 500, fontSize: 18 }}>{f.name}</div>
              <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED, marginTop: 4 }}>{f.loader}</div>
              <div style={{ fontSize: 14, color: MUTED, marginTop: 8 }}>{f.usage}</div>
              <div className="mt-4" style={{ fontSize: 32, lineHeight: 1.2, fontFamily: f.name === "Geist" ? "var(--font-geist-sans)" : f.name === "DM Sans" ? "var(--font-dm-sans)" : f.name }}>
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Shape ────────────────────────────────────────────────────── */}
      <Section
        id="shape"
        index="06"
        eyebrow="Foundations / Shape"
        title="Corner radii"
        description="Seven corner-radius levels. Use the named token rather than raw px so radii stay consistent."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {SHAPE_SCALE.map((s) => (
            <div key={s.cssVar} className="flex flex-col items-center gap-3">
              <div
                style={{
                  width: 88,
                  height: 88,
                  background: `var(--md-sys-color-primary-container)`,
                  borderRadius: `var(${s.cssVar})`,
                }}
              />
              <div className="text-center">
                <div style={{ fontWeight: 500, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: MUTED, marginTop: 2 }}>{s.px}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Spacing ──────────────────────────────────────────────────── */}
      <Section
        id="spacing"
        index="07"
        eyebrow="Foundations / Spacing"
        title="4px base grid"
        description="All spacing must be a multiple of 4px (no exceptions per design-system.md). Container padding is 24px desktop, 1vw on mobile (--container-padding)."
      >
        <div className="space-y-px" style={{ background: HAIRLINE_SOFT, border: `1px solid ${HAIRLINE_SOFT}` }}>
          {SPACING.map((s) => (
            <div key={s.units} style={{ background: PAGE_BG, padding: "12px 16px", display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ width: 100, fontFamily: MONO, fontSize: 12 }}>
                <span style={{ color: FG, fontWeight: 500 }}>{s.units} unit{s.units > 1 ? "s" : ""}</span>
                <span style={{ color: MUTED }}> · {s.px}px</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ width: s.px, height: 12, background: ACCENT }} />
              </div>
              <div style={{ flex: "0 1 320px", fontSize: 13, color: MUTED }}>{s.usage}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Elevation ────────────────────────────────────────────────── */}
      <Section
        id="elevation"
        index="08"
        eyebrow="Foundations / Elevation"
        title="Shadow levels"
        description="Five shadow levels (plus level0 = no shadow). M3 also uses tonal surfacing for elevation; see surface-container-* roles."
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {ELEVATIONS.map((e) => (
            <div key={e.cssVar} className="flex flex-col items-center gap-3">
              <div
                style={{
                  width: "100%",
                  height: 96,
                  background: PAGE_BG,
                  border: `1px solid ${HAIRLINE_SOFT}`,
                  borderRadius: 12,
                  boxShadow: `var(${e.cssVar})`,
                }}
              />
              <div className="text-center">
                <div style={{ fontWeight: 500, fontSize: 14 }}>level{e.level}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: MUTED, marginTop: 2 }}>{e.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Motion ───────────────────────────────────────────────────── */}
      <Section
        id="motion"
        index="09"
        eyebrow="Foundations / Motion"
        title="Durations & easing"
        description="medium2 (300ms) is the default for most state changes. Use emphasized-decelerate for entering elements and emphasized-accelerate for exiting."
      >
        <h3 className="mt-2 mb-4" style={{ fontSize: 18, fontWeight: 500 }}>Durations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {MOTION_DURATIONS.map((d) => (
            <div key={d.name} style={{ padding: 12, border: `1px solid ${HAIRLINE_SOFT}` }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>{d.name}</div>
              <div style={{ fontWeight: 500, fontSize: 16, marginTop: 4 }}>{d.ms}ms</div>
            </div>
          ))}
        </div>

        <h3 className="mt-12 mb-4" style={{ fontSize: 18, fontWeight: 500 }}>Easing curves</h3>
        <div className="space-y-px" style={{ background: HAIRLINE_SOFT, border: `1px solid ${HAIRLINE_SOFT}` }}>
          {MOTION_EASINGS.map((e) => (
            <div key={e.name} style={{ background: PAGE_BG, padding: "12px 16px", display: "grid", gridTemplateColumns: "200px 1fr 280px", gap: 16, alignItems: "center" }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{e.name}</div>
              <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.bezier}</div>
              <div style={{ fontSize: 13, color: MUTED }}>{e.usage}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── State layers ─────────────────────────────────────────────── */}
      <Section
        id="state"
        index="10"
        eyebrow="Foundations / State"
        title="State-layer opacities"
        description="Interactive states are a translucent layer of the appropriate `on-*` color over the container, at these opacities."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px" style={{ background: HAIRLINE_SOFT, border: `1px solid ${HAIRLINE_SOFT}` }}>
          {STATE_LAYERS.map((s) => (
            <div key={s.name} style={{ background: PAGE_BG, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>{s.name}</div>
              <div style={{ fontWeight: 500, fontSize: 18 }}>{(s.opacity * 100).toFixed(0)}%</div>
              <div style={{ fontSize: 12, color: MUTED }}>{s.usage}</div>
              <div
                style={{
                  width: "100%",
                  height: 12,
                  background: `rgba(29,29,31,${s.opacity})`,
                  borderRadius: 4,
                  marginTop: 4,
                }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Components ───────────────────────────────────────────────── */}
      <Section
        id="components"
        index="11"
        eyebrow="Components"
        title="Component specs"
        description="The 8 component-token blocks declared at the bottom of design-system/tokens.css. Specs below mirror the M3 component reference."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COMPONENT_SPECS.map((c) => (
            <div key={c.name} style={{ border: `1px solid ${HAIRLINE_SOFT}`, padding: 20, borderRadius: 12 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>{c.name}</h3>
              <dl style={{ display: "grid", gridTemplateColumns: "max-content 1fr", gap: "8px 16px" }}>
                {c.rows.map((r) => (
                  <div key={r.k} style={{ display: "contents" }}>
                    <dt style={{ fontFamily: MONO, fontSize: 11, color: MUTED, alignSelf: "center" }}>{r.k}</dt>
                    <dd style={{ fontSize: 13, color: FG }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Patterns ─────────────────────────────────────────────────── */}
      <Section
        id="patterns"
        index="12"
        eyebrow="Patterns"
        title="Observed in components"
        description="Recurring patterns extracted from the existing component code — not part of the M3 spec, but consistent across pages."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eyebrow */}
          <div style={{ border: `1px solid ${HAIRLINE_SOFT}`, padding: 24, borderRadius: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Section eyebrow</h3>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
              Mono uppercase label with index, hairline divider, and category. Used at the top of every redesigned section.
            </p>
            <Eyebrow index="00" label="Section / Subsection" />
            <div style={{ marginTop: 16, fontFamily: MONO, fontSize: 11, color: MUTED }}>
              ui-monospace · 11px · 0.2em tracking · uppercase
            </div>
          </div>

          {/* Vertical structure line */}
          <div style={{ border: `1px solid ${HAIRLINE_SOFT}`, padding: 24, borderRadius: 12, position: "relative", overflow: "hidden", minHeight: 180 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Vertical structure lines</h3>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
              1px hairlines flanking the content column. Color: <CodeChip>--grid-line</CodeChip> = rgba(37, 99, 235, 0.3). Used in IslandGap, hero, and homepage frame.
            </p>
            <div style={{ position: "relative", height: 100, background: PAGE_BG }}>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 32, width: 1, background: HAIRLINE }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, right: 32, width: 1, background: HAIRLINE }} />
            </div>
          </div>

          {/* Hairline card */}
          <div style={{ border: `1px solid ${HAIRLINE_SOFT}`, padding: 24, borderRadius: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Hairline-bordered card</h3>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
              No fill, 1px hairline border, soft hover background. Used in HomeRedesign Capabilities bento.
            </p>
            <div style={{ border: `1px solid ${HAIRLINE_SOFT}`, padding: 20, minHeight: 140, display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT }}>Tag</span>
              <h4 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em" }}>Card title</h4>
              <p style={{ fontSize: 14, color: MUTED }}>Supporting paragraph copy on a hairline card.</p>
            </div>
          </div>

          {/* Industry row */}
          <div style={{ border: `1px solid ${HAIRLINE_SOFT}`, padding: 24, borderRadius: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Numbered list row</h3>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
              Mono index + label, hairline divider per row. Used in HomeRedesign IndustriesList.
            </p>
            <ul style={{ borderTop: `1px solid ${HAIRLINE_SOFT}` }}>
              {["Residential Real Estate", "Logistics Optimization", "Geomarketing"].map((name, i) => (
                <li key={name} style={{ borderBottom: `1px solid ${HAIRLINE_SOFT}`, padding: "16px 0", display: "flex", alignItems: "baseline", gap: 24 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: FAINT }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 18 }}>{name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stat card */}
          <div style={{ border: `1px solid ${HAIRLINE_SOFT}`, padding: 24, borderRadius: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Stat tile</h3>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
              Large display number + mono uppercase label. Used in HomeRedesign ProductFeature.
            </p>
            <div style={{ padding: 24, border: `1px solid ${HAIRLINE_SOFT}` }}>
              <div style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1 }}>240M+</div>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: FAINT, marginTop: 12 }}>
                Locations indexed
              </div>
            </div>
          </div>

          {/* Pill button */}
          <div style={{ border: `1px solid ${HAIRLINE_SOFT}`, padding: 24, borderRadius: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Pill CTA</h3>
            <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
              Filled (primary) and outlined (secondary) pill buttons used across CTAs. Per M3: shape-corner-full, 40px height, 24px horizontal padding.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                style={{
                  background: FG,
                  color: PAGE_BG,
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "0 24px",
                  height: 40,
                  borderRadius: 9999,
                  border: 0,
                  cursor: "pointer",
                }}
              >
                Primary action
              </button>
              <button
                style={{
                  background: "transparent",
                  color: FG,
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "0 24px",
                  height: 40,
                  borderRadius: 9999,
                  border: `1px solid ${HAIRLINE_SOFT}`,
                  cursor: "pointer",
                }}
              >
                Secondary action
              </button>
            </div>
          </div>
        </div>

        {/* See it in context */}
        <div className="mt-16">
          <p style={{ fontSize: 14, color: MUTED }}>
            For these patterns rendered in production, see{" "}
            <Link href="/" style={{ color: ACCENT, textDecoration: "underline" }}>the homepage</Link>
            .
          </p>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
