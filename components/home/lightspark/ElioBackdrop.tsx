"use client";

/* eslint-disable @next/next/no-img-element */

/**
 * Visual backdrop for the Elio super-section block on the homepage
 * (ElioTextScrollIntro → ElioFeatureCell → ElioValuesCards → ElioFinalCTA).
 *
 * Mirrors the warm "beach / sun-warmed-sand" surface used on MistX's
 * /elio route:
 *   • base colour          #FCF3E8 (sampled centre of ElioBackground2.png)
 *   • hero-edge artwork    ElioBackground2.png at the top, blended in
 *                          from white above so the seam with CtaBanner
 *                          (the section just before this) is invisible.
 *   • perimeter silhouettes /elio/palm-left, parasol-trans-right, etc.
 *                          scattered down the left and right margins
 *                          (replicates how the MistX Elio page uses one
 *                          decorative silhouette per section).
 *
 * The `data-elio-section` attribute is what MistxNav watches to swap its
 * backdrop colour from white → #FCF3E8 while the user is inside this
 * block (see MistxNav.tsx).
 */

import type { ReactNode } from "react";

const BG_COLOR = "#FCF3E8";
// Navbar height (py-6 = 24px each side + 34px logo ≈ 82px). Used to size
// the intro sub-section so it reads as a hero: viewport height minus nav.
const NAV_H = "82px";
// Inter-section gap contributed by ElioBackdrop on its top + bottom edges.
// Matches the design-system rhythm (40px mobile, 100px md+) so the bg-
// image's top sits at the proper distance from the preceding CtaBanner
// and the cream surface tails off the same distance below the final CTA
// before the next white section begins.
const EDGE_PAD_MOBILE = "40px";
const EDGE_PAD_DESKTOP = "120px";

interface Decoration {
  src: string;
  alt?: string;
  className: string;
  style?: React.CSSProperties;
}

// Scattered silhouettes around the perimeter — one per Elio sub-section,
// alternating left/right to feel naturally distributed (matches the per-
// section placement on MistX's /elio page).
const DECORATIONS: Decoration[] = [
  // Top-left palm, anchored near the ElioTextScrollIntro intro.
  {
    src: "/elio/palm-left.png",
    className: "elio-decor elio-decor--top-left",
  },
  // Right side near ElioFeatureCell.
  {
    src: "/elio/plants-trans-right.png",
    className: "elio-decor elio-decor--upper-right",
  },
  // Left side near ElioValuesCards.
  {
    src: "/elio/plants-trans-left.png",
    className: "elio-decor elio-decor--lower-left",
  },
  // Right side near ElioFinalCTA.
  {
    src: "/elio/parasol-trans-right.png",
    className: "elio-decor elio-decor--bottom-right",
  },
];

const CSS = `
.elio-backdrop {
  position: relative;
  isolation: isolate;
  background-color: ${BG_COLOR};
  /* Inter-section gap. The bg-image top is the user-declared content
     origin for this section, so we add the design-system inter-section
     gap *above* it (40 mobile / 120 desktop) and the same below the
     final CTA, before the next white section starts. */
  padding-top: ${EDGE_PAD_MOBILE};
  padding-bottom: ${EDGE_PAD_MOBILE};
}
@media (min-width: 768px) {
  .elio-backdrop {
    padding-top: ${EDGE_PAD_DESKTOP};
    padding-bottom: ${EDGE_PAD_DESKTOP};
  }
}

/* Hero-edge artwork: same image MistX uses on /elio's hero (ElioBackground2.png).
   The image's top is the section's content origin per the user — it
   sits at the bottom of the wrapper's top padding (the inter-section gap)
   and stretches down to cover the full intro sub-section (≈ viewport
   height minus nav). The bottom-mask dissolves the image into cream as
   the intro ends and the next sub-section (features) takes over. */
.elio-backdrop::before {
  content: "";
  position: absolute;
  top: ${EDGE_PAD_MOBILE};
  left: 0;
  right: 0;
  /* Height = intro-section min-height. They're sized to match so the
     image's bottom edge fades out exactly where the intro ends. */
  height: calc(100vh - ${NAV_H});
  background-color: ${BG_COLOR};
  background-image: url("/ElioBackground2.png");
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  /* Tight top fade so the image is visible right from the section's
     content origin; gentle bottom fade so it dissolves into cream where
     the intro ends and the features sub-section begins. */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 40px, #000 75%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0, #000 40px, #000 75%, transparent 100%);
  z-index: 0;
  pointer-events: none;
}
@media (min-width: 768px) {
  .elio-backdrop::before { top: ${EDGE_PAD_DESKTOP}; }
}

/* Make the intro sub-section (ElioTextScrollIntro) hero-tall — viewport
   height minus nav — and vertically centre its content so the "Elio"
   wordmark + scroll-reveal paragraph sit in the middle of the hero zone
   instead of pinning to the top. .section is the wrapper class shared
   by every Elio sub-section; :first-of-type picks the first one (the
   intro) without leaking into Features / Values / Final CTA. Internal
   .section padding is zeroed because the wrapper's own padding-top
   already provides the inter-section gap above and min-height + flex
   centring handles the vertical rhythm inside the hero zone. */
.elio-backdrop > section.section:first-of-type {
  min-height: calc(100vh - ${NAV_H});
  padding-top: 0;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.elio-backdrop > * {
  position: relative;
  z-index: 1;
}

/* ─── Perimeter silhouettes ────────────────────────────────────────────── */
.elio-decor {
  position: absolute;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  width: 38%;
  max-width: 520px;
  height: auto;
  opacity: 0.85;
}

/* Vertical positions are rough — they sit beside / above the four
   sub-sections (intro, features, values, final CTA). The intro now
   takes ≈ 100vh, so the first decoration anchors a little above the
   hero centre and the rest follow. Calc() based on viewport keeps
   alignment reasonable across screen sizes; absolute fallbacks below
   for narrower viewports. */
.elio-decor--top-left    { top: calc(40vh);                left: 0; }
.elio-decor--upper-right { top: calc(100vh + 80px);        right: 0; }
.elio-decor--lower-left  { top: calc(100vh + 1100px);      left: 0; }
.elio-decor--bottom-right{ bottom: 240px;                  right: 0; }

@media (max-width: 768px) {
  .elio-decor { width: 55%; max-width: 320px; opacity: 0.7; }
  .elio-decor--top-left    { top: 28vh; }
  .elio-decor--upper-right { top: calc(100vh + 60px); }
  .elio-decor--lower-left  { top: calc(100vh + 700px); }
}

/* ─── Inside-the-Elio-backdrop overrides ───────────────────────────────
   The Elio sub-sections (Intro / Features / Values / Final CTA) ship
   with a #ffffff card-on-white surface. Inside this backdrop the page
   surface is cream (#FCF3E8), so every white fill is re-routed here to
   either match the cream surface (transparent / cream) or land on a
   tonally adjacent warm shade. Hairlines are warmed from the cool
   #E7E7F1 gridline to the MistX /elio warm-tan (#D8C8AE) so the
   blueprint grid reads on the new bg without competing with it. */
.elio-backdrop { --color-gridline: #D8C8AE; }

/* Design-system section rhythm (design-system/content-and-text-spacing.md
   §2.2): "Between major sections | 200px desktop / 80px mobile |
   py-10 md:py-[100px]". The project-wide .section class uses 80/112 — a
   pre-system holdover. Inside ElioBackdrop the user has defined the bg-
   image top as the section's content origin, so we apply the design-
   system values literally: 40px top/bottom on mobile, 100px from md up.
   Each sub-section (Intro / Features / Values / Final CTA) contributes
   100px on either side, so adjacent sub-sections sit 200px apart and
   the wrapper edges (against CtaBanner above / StickyScrollFeatures
   below) contribute the same 100px to the inter-section gap. */
.elio-backdrop .section {
  padding-top: 40px;
  padding-bottom: 40px;
}
@media (min-width: 768px) {
  .elio-backdrop .section {
    padding-top: 100px;
    padding-bottom: 100px;
  }
}

/* ElioFeatureCell: solid white cell → transparent; white fade overlays
   (which mask the top/bottom hairline borders of the grid) → cream. */
.elio-backdrop .efc-cell { background-color: transparent; }
.elio-backdrop .efc-fade--top {
  background-image: linear-gradient(${BG_COLOR}, rgba(252, 243, 232, 0.64) 54%, rgba(252, 243, 232, 0.06));
}
.elio-backdrop .efc-fade--bottom {
  background-image: linear-gradient(to top, ${BG_COLOR}, rgba(252, 243, 232, 0.64) 54%, rgba(252, 243, 232, 0.06));
}

/* ElioValuesCards: the per-cell vignette was rgba→#F9FAFB (off-white)
   on white. Re-tint to a warm dark sand (#F6EBDE, MistX --color-elio-
   bg-dark) so the "dimming corners" effect still reads on the cream
   surface. Both edge-fade overlays are likewise rebuilt cream → transparent. */
.elio-backdrop .evc-cell {
  background: radial-gradient(
    77% 100% at 50% 0%,
    rgba(246, 235, 222, 0) 20%,
    #F6EBDE 100%
  );
}
.elio-backdrop .evc-fade--top {
  background-image: linear-gradient(${BG_COLOR}, rgba(252, 243, 232, 0.64) 54%, rgba(252, 243, 232, 0.06));
}
.elio-backdrop .evc-fade--bottom {
  background-image: linear-gradient(to top, ${BG_COLOR}, rgba(252, 243, 232, 0.64) 54%, rgba(252, 243, 232, 0.06));
}

/* The three feature rows inside ElioFeatureCell ("Ranked spots, curated
   for you", "Itineraries you build together.", "Find a place that matches
   your mood.") render through <ProductCell variant="split">, which paints
   its own #ffffff cell surface, white card, and sky-blue accent plate.
   Inside the Elio backdrop all three layers drop their fills so the rows
   read as text + abstract-UI mocks floating directly on the cream surface,
   separated only by the warm-tan hairline that already divides them.
   --pc-fade-color also moves to cream so the V2 edge-fade overlay (if it
   fires on the row) dissolves into cream instead of white. */
.elio-backdrop .efc-row.pc-cell {
  background-color: transparent;
  background-image: none;
}
.elio-backdrop .efc-row .pc-card,
.elio-backdrop .efc-row .pc-card-bg {
  background: transparent;
  border-color: transparent;
}
.elio-backdrop .efc-row { --pc-fade-color: ${BG_COLOR}; }

/* ElioFinalCTA: the "Find your world now" island was a solid white card
   with a sky-blue radial glow + perspective grid emanating from its
   bottom edge. Dropping the fill lets that glow + grid paint directly
   onto the cream surface (reads like a horizon rising out of the page);
   the warm-tan hairline still frames the card subtly. */
.elio-backdrop .efcta-card { background: transparent; }
`;

export function ElioBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="elio-backdrop" data-elio-section>
      <style>{CSS}</style>
      {DECORATIONS.map((d) => (
        <img
          key={d.src + d.className}
          src={d.src}
          alt=""
          aria-hidden="true"
          className={d.className}
          style={d.style}
        />
      ))}
      {children}
    </div>
  );
}

export default ElioBackdrop;
