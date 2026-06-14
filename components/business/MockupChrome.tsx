"use client";

import type React from "react";

/* ───────────────────────── Shared mockup chrome ─────────────────────────

   One programmatic "Columbus app" frame shared by every product-display
   mockup in the hero (Map Chat / Research / Data Catalogue / Dashboard).

   It replaces the four baked chrome PNGs (ConversationalMapChat.png,
   ResearchFrame.png, DataManagerFrame.png, DashboardFrame.png) that each
   mockup used to composite under its coded inner pane. Those PNGs differed
   slightly per view (rail icon set, top-bar actions, baked breadcrumb text)
   and forced every mockup to overlay its UI with fragile %-positioning and
   opaque "cover" divs to hide the baked text. Drawing the chrome in code
   makes all four views pixel-consistent and lets the inner pane simply be
   `children` — no offsets, no covers.

   Geometry mirrors the source frames (native ~5184×3003):
     • left rail width:  215/5184 ≈ 4.17% of the frame width
     • top bar height:   206/3003 ≈ 6.9% of the frame height
   Everything is expressed in container-query width units (cqw) so the whole
   frame miniaturizes faithfully under ScaleToFit / responsive widths — the
   same `containerType: inline-size` + cqw idiom the inner panes already use. */

const FONT_STACK =
  "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif";

const NAVY = "#0A1344";
// Unselected rail icons (nav glyphs + bottom bell/gear).
const RAIL_ICON = "#818181";
const RAIL_ICON_MUTED = "#818181";
const HAIRLINE = "rgba(0,0,0,0.07)";
const CRUMB_MUTED = "#9CA3AF";
/* Breadcrumb ink — the "/" separator and every crumb segment share this
   color and a normal weight. */
const CRUMB = "#818181";

/* Shared font size for the top-bar title row (Columbus wordmark + breadcrumb).
   Exported so views can match their right-side actions to it. */
export const TOPBAR_TITLE_FONT = "clamp(1rem, 1.72cqw, 1.46rem)";
/* Breadcrumb (the "/ page title" to the right of the wordmark) reads as
   secondary navigation context, so it sits one type-step (~12.5%) below the
   "Columbus" wordmark rather than matching it. */
export const TOPBAR_CRUMB_FONT = "clamp(0.875rem, 1.5cqw, 1.28rem)";

/* Earth mascot (with headset) baked into the bottom-right of every source
   frame — drawn here as a real <img> so it stays in every view. */
const MASCOT_SRC = "/BusinessPgMedia/business-helper-mascot.png";

export type RailIconId =
  | "menu"
  | "grid"
  | "search-star"
  | "edit"
  | "database"
  | "chat"
  | "history";

/* SVG path content for each rail glyph. viewBox 0 0 24 24, drawn stroked. */
function RailGlyph({ id }: { id: RailIconId }) {
  switch (id) {
    case "menu":
      // Outer bars spread to y=4.8 / 19.2 (middle fixed at 12) so the
      // hamburger's total height matches the Reports (pencil) glyph.
      return (
        <>
          <path d="M3 4.8h18" />
          <path d="M3 12h18" />
          <path d="M3 19.2h18" />
        </>
      );
    case "grid":
      return (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </>
      );
    case "search-star":
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3-3" />
          {/* small sparkle inside the lens — filled (not just stroked).
              Scaled up ~25% about its own centre (11, 10.3) so it reads a
              touch bigger without drifting off the lens. */}
          <path d="M11 7.6l.85 1.85 1.85.85-1.85.85L11 13l-.85-1.9-1.85-.85 1.85-.85z" fill="currentColor" stroke="none" transform="translate(11 10.3) scale(1.25) translate(-11 -10.3)" />
        </>
      );
    case "edit":
      return (
        <>
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
        </>
      );
    case "database":
      return (
        <>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </>
      );
    case "chat":
      return <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
    case "history":
      return (
        <>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </>
      );
  }
}

function RailIcon({
  id,
  active,
  strokeWidth = 1.9,
  size = "clamp(16px, 1.85cqw, 24px)",
  color,
}: {
  id: RailIconId;
  active: boolean;
  strokeWidth?: number;
  size?: string;
  color?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      // Stroke + any fill="currentColor" paths (e.g. the search-star sparkle)
      // both resolve to this color.
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: size,
        height: size,
        position: "relative",
        zIndex: 1,
        color: color ?? (active ? "#FFFFFF" : RAIL_ICON),
      }}
    >
      <RailGlyph id={id} />
    </svg>
  );
}

export type MockupChromeProps = {
  /* Class names for the outer frame — every consumer passes
     "biz-product-display biz-mockup-frame" so the site-wide radius/border
     tokens + mobile corner overrides keep applying. */
  className?: string;
  /* Top-rail nav glyphs (below the fixed hamburger). One is the active view. */
  railIcons: RailIconId[];
  activeRailIndex: number;
  /* Breadcrumb segments after the "Columbus" wordmark, each preceded by a
     "/" separator. e.g. ["Data Manager"] or ["Kansas Project", "Sector 3"]. */
  crumbs: string[];
  /* Right-hand side of the top bar — view-specific actions. */
  actions?: React.ReactNode;
  /* Hide the bottom-right Earth helper mascot for this view (default shown). */
  hideMascot?: boolean;
  /* The inner pane content (everything that used to overlay the PNG). */
  children: React.ReactNode;
};

export default function MockupChrome({
  className = "",
  railIcons,
  activeRailIndex,
  crumbs,
  actions,
  hideMascot = false,
  children,
}: MockupChromeProps) {
  const railWidth = "clamp(36px, 4.17cqw, 50px)";
  const barHeight = "clamp(34px, 4cqw, 50px)";

  return (
    <div
      className={`relative w-full mx-auto ${className}`}
      style={{
        // Base aspect ≈ the source frames (5184/3003); the denominator is
        // bumped to 3135 so the showcase renders ~30px taller than the source
        // at its 1180px canonical width (1180 × 3135/5184 ≈ 713.6px vs 683.6px).
        aspectRatio: "5184 / 3135",
        maxWidth: 1180,
        borderRadius: "var(--ent-radius-2xl)",
        border: "2px solid var(--ent-border-card)",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        containerType: "inline-size",
        fontFamily: FONT_STACK,
        color: NAVY,
      }}
    >
      {/* ── Left rail ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: railWidth,
          /* No full-height right border — the rail divider is a separate
             element that starts BELOW the top bar (see below), so the top
             bar's bottom hairline reads as continuous/above the rail's
             vertical line at their corner. */
          display: "flex",
          flexDirection: "column",
          zIndex: 6,
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Top group: hamburger + nav glyphs. The hamburger row is exactly
            barHeight tall so the hamburger's centre lines up with the top
            bar's vertical centre (logo / wordmark / actions). */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <RailRow height={barHeight}>
            {/* Hamburger — 20% larger than the nav glyphs, navy ink, and a
                heavier stroke so it reads as the primary menu affordance. */}
            <RailIcon
              id="menu"
              active={false}
              strokeWidth={3}
              size="clamp(19px, 2.22cqw, 29px)"
              color={NAVY}
            />
          </RailRow>
          <div style={{ height: "clamp(4px, 0.6cqw, 10px)" }} />
          {railIcons.map((id, i) => {
            const active = i === activeRailIndex;
            // Glyphs ink at different widths inside the same box, so they're
            // scaled up to share one left/right edge with the pencil (Reports):
            //  • grid (Dashboard): ~6% narrower than the pencil → +6.3%
            //  • database (Data Catalogue) + search-star (Map Chat): narrowest
            //    → +19.5%, with a proportionally thinner stroke so their lines
            //    don't read heavier than the rest.
            const wide = id === "database" || id === "search-star";
            const iconSize =
              id === "grid"
                ? "clamp(17px, 1.97cqw, 25.5px)"
                : wide
                  ? "clamp(19px, 2.21cqw, 28.7px)"
                  : undefined;
            const iconStroke = wide ? 1.6 : undefined;
            return (
              // Row height === rail width so the selected (navy) fill is a
              // perfect square; this also sets the spacing between icons.
              <RailRow key={`${id}-${i}`} active={active} height={railWidth}>
                <RailIcon id={id} active={active} size={iconSize} strokeWidth={iconStroke} />
              </RailRow>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        {/* Bottom group: notifications, avatar, settings — square rows
            (height === rail width) so they're spaced like the nav icons. */}
        <div style={{ display: "flex", flexDirection: "column", paddingBottom: "clamp(8px, 1cqw, 16px)" }}>
          <RailRow height={railWidth}>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke={RAIL_ICON_MUTED}
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "clamp(15px, 1.73cqw, 24px)", height: "clamp(15px, 1.73cqw, 24px)" }}
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </RailRow>
          <RailRow height={railWidth}>
            {/* Circular user avatar — the logged-in user's profile photo. */}
            <img
              src="/BusinessPgMedia/ProfileImages/MainProf.png"
              alt=""
              aria-hidden
              style={{
                width: "clamp(19px, 2.16cqw, 30px)",
                height: "clamp(19px, 2.16cqw, 30px)",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            />
          </RailRow>
          <RailRow height={railWidth}>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke={RAIL_ICON_MUTED}
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "clamp(19px, 2.16cqw, 30px)", height: "clamp(19px, 2.16cqw, 30px)" }}
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </RailRow>
        </div>
      </div>

      {/* ── Top bar ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: railWidth,
          right: 0,
          height: barHeight,
          borderBottom: `1px solid ${HAIRLINE}`,
          display: "flex",
          alignItems: "center",
          gap: "clamp(6px, 0.8cqw, 12px)",
          paddingLeft: "clamp(12px, 1.6cqw, 24px)",
          paddingRight: "clamp(12px, 1.6cqw, 22px)",
          zIndex: 6,
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Columbus logo + wordmark */}
        <img
          src="/logobueno.png"
          alt=""
          aria-hidden
          style={{
            width: "clamp(23px, 2.72cqw, 37px)",
            height: "clamp(23px, 2.72cqw, 37px)",
            objectFit: "contain",
            flexShrink: 0,
            // Nudge the whole left cluster (logo → wordmark → breadcrumb) 7px
            // to the left; later flex siblings follow.
            marginLeft: -7,
            // Net vertical nudge for the logo (was -1px, +1px, +0.1px down).
            transform: "translateY(0.1px)",
            filter:
              "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)",
          }}
        />
        <span
          style={{
            fontWeight: 700,
            color: NAVY,
            fontSize: TOPBAR_TITLE_FONT,
            letterSpacing: "-0.02em",
            flexShrink: 0,
            lineHeight: 1,
            // The font's descent space leaves caps sitting high in the line
            // box; nudge down so the cap-height block optically centers in
            // the bar (+1.1px shift requested on top). Font-relative so it holds.
            transform: "translateY(calc(0.06em + 1.1px))",
          }}
        >
          Columbus
        </span>

        {/* Breadcrumb — "/ seg / seg …" */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            minWidth: 0,
            overflow: "hidden",
            lineHeight: 1,
            // Match the wordmark's optical-centering nudge (+1.1px).
            transform: "translateY(calc(0.06em + 1.1px))",
          }}
        >
          {crumbs.map((seg, i) => (
            <span
              key={`${seg}-${i}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <span
                aria-hidden
                style={{
                  color: CRUMB,
                  fontWeight: "normal",
                  margin: "0 clamp(5px, 0.7cqw, 10px)",
                  fontSize: TOPBAR_CRUMB_FONT,
                }}
              >
                /
              </span>
              <span
                style={{
                  fontSize: TOPBAR_CRUMB_FONT,
                  fontWeight: "normal",
                  // Real page titles take the navy "Columbus" ink; only the
                  // "untitled chat" placeholder stays muted gray.
                  color: seg === "untitled chat" ? CRUMB : NAVY,
                  letterSpacing: "-0.015em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {seg}
              </span>
            </span>
          ))}
        </span>

        <div style={{ flex: 1, minWidth: "clamp(8px, 1cqw, 16px)" }} />

        {/* View-specific right-hand actions. Nudged down to sit on the same
            vertical centre as the "Columbus" title (which carries its own
            optical-centering offset), so the action icons + text align with
            the title rather than the raw bar centre. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(6px, 0.8cqw, 12px)",
            transform: "translateY(1.5px)",
          }}
        >
          {actions}
        </div>
      </div>

      {/* Rail vertical divider — starts at the bottom of the top bar so the
          top bar's horizontal hairline sits above it at the corner. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: railWidth,
          top: barHeight,
          bottom: 0,
          borderLeft: `1px solid ${HAIRLINE}`,
          zIndex: 6,
        }}
      />

      {/* Rounded 4px inner-corner fillet at the rail × top-bar junction.
          The content pane's top-left corner is rounded like a real window: the
          arc bows toward the chrome corner so the rail's vertical hairline and
          the top bar's horizontal hairline flow into a smooth quarter-circle.

          SEAMLESS JOIN: the CSS hairlines render with their 1px stroke CENTERS
          at SVG y=0.5 (top bar border-bottom) and x=0.5 (rail divider border-
          left), since both are 1px borders inside their border boxes. For the
          arc to flow into them without a step it must be TANGENT to those
          centerlines — so the arc starts at (8.5, 0.5) (horizontal tangent) and
          ends at (0.5, 8.5) (vertical tangent), with center at the pane-interior
          corner (8.5, 8.5). The straight stubs (10→8.5 at top, 8.5→11 down the
          left) carry the line out to the box edges where the CSS hairlines
          continue beyond, so the whole line is continuous.

          The SVG sits at left:railWidth, top:barHeight-1px and is painted on top
          (zIndex 7): a base #FFFFFF fill repaints the chrome corner, the #FDFDFD
          fill repaints the content pane, and the boundary is masked by the
          single hairline stroke (stub → arc → stub). Both fills meet only along
          that stroke, so the 2/255 white-vs-pane edge is never exposed. */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          left: railWidth,
          top: `calc(${barHeight} - 1px)`,
          width: 10,
          height: 11,
          display: "block",
          overflow: "visible",
          zIndex: 7,
          pointerEvents: "none",
        }}
        viewBox="0 0 10 11"
      >
        {/* Base chrome-white over the whole junction box (rail + top-bar side). */}
        <path d="M 0 0 H 10 V 11 H 0 Z" fill="#FFFFFF" />
        {/* Content pane fill on the pane side of the line. */}
        <path d="M 10 0.5 L 8.5 0.5 A 8 8 0 0 0 0.5 8.5 L 0.5 11 L 10 11 Z" fill="#FDFDFD" />
        {/* The continuous hairline: top stub → tangent arc → left stub. */}
        <path
          d="M 10 0.5 L 8.5 0.5 A 8 8 0 0 0 0.5 8.5 L 0.5 11"
          fill="none"
          stroke={HAIRLINE}
          strokeWidth="1"
        />
      </svg>

      {/* ── Inner content pane ── */}
      <div
        style={{
          position: "absolute",
          left: railWidth,
          top: barHeight,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          // Interior working-area background.
          backgroundColor: "#FDFDFD",
          zIndex: 4,
        }}
      >
        {children}
      </div>

      {/* ── Earth mascot ── */}
      {!hideMascot && (
        <img
          src={MASCOT_SRC}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            right: "clamp(8px, 1.1cqw, 18px)",
            bottom: "clamp(8px, 1.1cqw, 18px)",
            width: "clamp(26px, 3cqw, 44px)",
            height: "clamp(26px, 3cqw, 44px)",
            objectFit: "contain",
            zIndex: 8,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

/* A single rail slot — full-width flex-centered box. When `active`, fills the
   whole rail width with the navy block + white icon (matching the source
   frames' selected-nav treatment). */
function RailRow({
  children,
  active = false,
  height = "clamp(30px, 3.4cqw, 46px)",
}: {
  children: React.ReactNode;
  active?: boolean;
  height?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: active ? NAVY : "transparent",
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── Shared top-bar action helpers ─────────────────

   Small building blocks for the view-specific actions so the four mockups
   share one button language (faithful to the source frames' top-bar pills). */

/* "Edits not saved" status — slashed-cloud glyph + muted label. With
   `saved`, it flips to "Edits saved" + a clean (un-slashed) cloud. Used by
   the Map Chat and Research views. */
export function EditsNotSaved({
  fontSize = "clamp(0.6rem, 0.95cqw, 0.82rem)",
  fontWeight = 500,
  saved = false,
}: { fontSize?: string; fontWeight?: number; saved?: boolean } = {}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "clamp(4px, 0.6cqw, 8px)",
        color: CRUMB_MUTED,
        fontSize,
        fontWeight,
        whiteSpace: "nowrap",
        letterSpacing: "-0.005em",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        style={{ width: "clamp(13px, 1.5cqw, 19px)", height: "clamp(13px, 1.5cqw, 19px)" }}
      >
        {saved ? (
          // Whole cloud — no slash, no gaps. The cloud's mass (flat bottom +
          // body) sits in the lower half of the viewBox, so it reads low next
          // to the label; lift it ~1.5 units to optically centre with the text.
          <path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.78A6 6 0 1 0 6 19h11.5z" transform="translate(0 -1.5)" />
        ) : (
          <>
            <path d="m2 2 20 20" />
            <path d="M5.8 9.8A5 5 0 0 0 6 19h11a4 4 0 0 0 1.9-.5" />
            <path d="M9 5.5A5.5 5.5 0 0 1 18.6 9 4 4 0 0 1 21 12.5" />
          </>
        )}
      </svg>
      {saved ? "Edits saved" : "Edits not saved"}
    </span>
  );
}

/* Thin vertical divider used between top-bar action groups. */
export function BarDivider({
  height = "44%",
  color = "rgba(0,0,0,0.12)",
}: { height?: string; color?: string } = {}) {
  return (
    <span
      aria-hidden
      style={{
        width: 1,
        height,
        backgroundColor: color,
        flexShrink: 0,
      }}
    />
  );
}

/* Generic pill button for the top bar. `gradient` paints a 1.5px gradient
   ring (the Data Digestion / Smart Layers / Report View treatment). */
export function BarPill({
  children,
  gradient,
  textColor = NAVY,
  fontSize = "clamp(0.6rem, 0.95cqw, 0.82rem)",
  fontWeight = 600,
  radius = 9999,
  paddingY = "clamp(4px, 0.7cqw, 9px)",
}: {
  children: React.ReactNode;
  gradient?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: number;
  radius?: number;
  paddingY?: string;
}) {
  const inner = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "clamp(4px, 0.6cqw, 8px)",
        backgroundColor: "#FFFFFF",
        color: textColor,
        borderRadius: radius,
        border: gradient ? "none" : "1px solid rgba(0,0,0,0.12)",
        // Tighten the line box to the glyphs and bias the vertical padding
        // 0.5px heavier on top: Axiforma rides high in its line box, so equal
        // padding leaves the text reading ~1px above the pill's centre.
        lineHeight: 1,
        padding: `calc(${paddingY} + 0.5px) clamp(9px, 1.2cqw, 16px) calc(${paddingY} - 0.5px)`,
        fontSize,
        fontWeight,
        letterSpacing: "-0.005em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
  if (!gradient) return inner;
  return (
    <span
      style={{
        padding: 1.5,
        // Concentric with the inner pill (+1.5px ring).
        borderRadius: radius === 9999 ? 9999 : radius + 1.5,
        background: gradient,
        display: "inline-flex",
        flexShrink: 0,
      }}
    >
      {inner}
    </span>
  );
}

export const GRADIENT_PURPLE =
  "linear-gradient(90deg, #C9B8F5 0%, #E7B8E0 50%, #F3C7C0 100%)";
export const GRADIENT_RAINBOW =
  "linear-gradient(90deg, #F4A1FF 0%, #F8B4A8 25%, #F9C570 55%, #F5DBA3 80%, #C8E3FA 100%)";
export const GRADIENT_ORANGE =
  "linear-gradient(90deg, #F6C99A 0%, #F0A26A 100%)";

/* Small "+" prefix glyph for "+ Import data" / "+ Smart Layers". */
export function PlusGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ width: "clamp(10px, 1.2cqw, 15px)", height: "clamp(10px, 1.2cqw, 15px)" }}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
