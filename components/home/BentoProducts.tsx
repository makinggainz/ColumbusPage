"use client";

// Deploy sync marker — touch this comment to retrigger a Vercel build
// without making a substantive code change.

/**
 * Bento grid for the homepage product lineup.
 *
 * Layout (desktop): two equal-width tiles on the top row (Columbus +
 * Elio) and a single elongated banner tile on the bottom row spanning
 * both columns (Research). On mobile all three collapse into a single
 * column.
 *
 * Each tile uses the "text-top, visual-peeks-from-bottom" pattern:
 *   - Top of card:   brand row (logo + name large), short tagline, CTA.
 *   - Bottom of card: the product visual (UI screenshot) anchored to
 *     the bottom edge, partially extending below the card so only its
 *     top portion reads inside the cell (overflow: hidden on the cell
 *     clips the rest).
 *
 * Pattern is adapted from the OurProductsSection / ProductCell "corner"
 * variant on the experimentV6-…-mapTest reference branch (text rail
 * pinned, visual offset toward an edge).
 */

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";

// Static imports → Next generates a real low-res `blurDataURL` (progressive
// blur-up: a tiny preview paints instantly, then swaps to the full-res AVIF
// — no quality loss to the source) and intrinsic dimensions at build time.
// The two card backdrops were previously CSS background-image url()s, which
// bypassed the optimizer entirely and shipped as raw multi-MB PNG.
import bgColumbus from "@/public/ColumbusBackgroundbento.png";
import bgElio from "@/public/elio-bento-bg.png";
import visualColumbus from "@/public/ColumbusHomeimg.png";
import visualElio from "@/public/elio-bento-v3.png";

/* Recolour filter matching MistxNav so the Columbus mark renders in the
   same navy blue everywhere it appears on the site. */
const COLUMBUS_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)";

const CSS = `
.bp-section {
  background: #FFFFFF;
  padding: 0 0 80px;
  font-family: var(--font-sans, "Ppneuemontreal", "PP Neue Montreal", Arial, sans-serif);
}
@media (min-width: 1024px) {
  .bp-section { padding-bottom: 112px; }
}

/* Canonical content-bounds calc trick — 1287px cap, always 40px
   narrower than parent (= 20px gutter on each side at every viewport
   width), centered. Matches navbar / .content-bounds / site-wide. */
.bp-bounds {
  max-width: 1287px;
  width: calc(100% - 2.5rem);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.bp-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 1024px) {
  .bp-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

/* Each tile: full-bleed per-product background, 13px corners. overflow:
   hidden so the bottom-peeking visual clips at the card edge. The card has
   NO drop shadow and NO hairline ring — its edge is defined purely by the
   per-product background (photo / gradient) meeting the white page at the
   rounded corner. Dropping the shadow keeps the white page right next to
   the card at pure #FFFFFF, so it matches the audience cut-out's gutter
   white exactly (the shadow used to darken the surrounding page a few
   percent, making the pure-white gutter read as a brighter patch). */
.bp-card {
  position: relative;
  overflow: hidden;
  border-radius: 13px;
  background-color: #FFFFFF;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 28px;
  text-decoration: none;
  color: #0B1B2B;
  display: block;
}
/* Mobile: drop the fixed pixel height — let the card grow to fit its
   text + the (now statically-positioned) .bp-visual below. The desktop
   "text-top, mockup-peeks-from-bottom" pattern only re-engages at
   ≥1024px where there's room for the absolutely-positioned mockup. */
@media (min-width: 640px)  { .bp-card { padding: 32px; } }
@media (min-width: 1024px) { .bp-card { height: 560px; padding: 40px; } }

/* Wide tile (Research) spans both columns on desktop as an elongated
   banner row. Slightly shorter than the square tiles above so the
   banner reads as a horizontal panel — reduced a further 30%
   (440 → 308) per Gdesign tweak so the panel reads as a thin band. */
@media (min-width: 1024px) {
  .bp-card--wide {
    grid-column: span 2;
    height: 308px;
  }
}

/* Columbus + Elio + Research photo backdrops are all rendered as
   <Image fill> behind the card content (see .bp-bg / .bp-bg-tint below)
   so the next-image optimizer serves AVIF instead of the raw multi-MB
   PNG the old background-image url() shipped. The Elio backdrop matches
   the /products/consumer hero so clicking through lands on a continuous
   image. */

/* Photo backdrop <Image fill> — sits at the bottom of the card stack
   (z-index 0). object-fit: cover + center matches the old
   background-size: cover; background-position: center. */
.bp-bg {
  object-fit: cover;
  object-position: center;
  z-index: 0;
}
/* The Research banner's backdrop is a <video> rather than an <Image fill>, so
   it needs the absolute full-bleed box next/image would otherwise provide. The
   object-fit/position + desktop top-fade mask still come from .bp-bg above. */
video.bp-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
/* Black tint over the photo (Columbus + Elio only — the photo cards).
   Paints just above the image (same z-index, later in DOM) and below the
   top scrim. Vertical gradient (was a flat 0.18): transparent at the TOP —
   where the brand wordmark + tagline sit — ramping to 0.18 at the bottom,
   so the text reads over a much lighter backdrop while the lower half stays
   tinted for depth under the product visual that peeks up there. */
.bp-bg-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0) 100%);
  pointer-events: none;
  z-index: 0;
}
/* Research tile has no bottom-dark tint — the wide banner is too short
   for the gradient to ramp gracefully and the photo is already framed
   to support the text without darkening. */
.bp-card--research .bp-bg-tint {
  display: none;
}
@media (min-width: 1024px) {
  /* Desktop tiles are a fixed 560px with the text at the top and the
     product visual peeking up from the bottom. Keep the tint clear through
     the whole text block, start the darkening just below the CTA (~42%),
     then ramp to a deeper tint at the bottom so the product display reads
     against a darker backdrop before the eye reaches it. */
  .bp-bg-tint {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 42%,
      rgba(0, 0, 0, 0.14) 64%,
      rgba(0, 0, 0, 0.38) 100%
    );
  }
  /* Fade the photo's OWN opacity toward the white card surface at the top,
     instead of overlaying anything. The mask alpha is 0.75 at the very top
     (so the card's #FFFFFF — load-bearing here; nothing opaque sits between
     the photo and the card bg — shows ~25% through, gently lightening the
     text area) and ramps GRADUALLY back to full opacity by 75%, full below.
     The long 0.75→1 ramp keeps the change rate gentle. */
  .bp-bg {
    -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 100%);
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 100%);
  }
}

/* Top scrim — fades from a translucent white surface at the top (where
   the text sits) to transparent past the brand row, so the brand mark +
   tagline + CTA read against the busy bg textures without obscuring
   the lower half where the product visual peeks up. */
.bp-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: transparent;
  pointer-events: none;
  z-index: 1;
}
/* Solid white overlay UNDER the photo backdrop on the Columbus + Elio
   tiles. It paints first (z 1) and the contained .bp-bg-wrap below sits
   above it (z 2) — the card's responsive sizing flows from the white
   overlay + text block, not from the image. */
.bp-card--columbus::before,
.bp-card--elio::before {
  background: #FFFFFF;
}

/* Columbus + Elio: flex column so the bg image wrapper can sit below the
   text block in flow and flex-fill the card's remaining height. */
.bp-card--columbus,
.bp-card--elio {
  display: flex;
  flex-direction: column;
}

/* Contained bg image — sits 20px below the text block (= 20px below the
   CTA's bottom edge, since the CTA is the last item in the text block),
   rounded corners, clips its own content. z-index 2 puts it above the
   white overlay (z 1) so the photo reads above the card surface. */
.bp-bg-wrap {
  position: relative;
  /* Bleed left/right/bottom out to the card's outer edges via negative
     margins that match the card's per-breakpoint padding (28 / 32 / 40).
     Top keeps the +20px gap from the CTA. */
  margin: 20px -28px -28px;
  border-radius: 13px;
  overflow: hidden;
  z-index: 2;
  aspect-ratio: 16 / 9;
}
@media (min-width: 640px) {
  .bp-bg-wrap { margin: 20px -32px -32px; }
}
@media (min-width: 1024px) {
  .bp-bg-wrap {
    margin: 20px -40px -40px;
    flex: 1 1 auto;
    aspect-ratio: auto;
    min-height: 0;
  }
  /* The top-of-image opacity fade was designed to blend a full-bleed
     photo into the card's white surface behind the text. The contained
     wrapper has its own hard top edge now, so the mask just softens the
     wrapper's top — undo it for the two contained tiles. */
  .bp-card--columbus .bp-bg,
  .bp-card--elio .bp-bg {
    -webkit-mask-image: none;
    mask-image: none;
  }
}
/* Elio's backdrop is a bento-specific photo (elio-bento-bg.png) — a
   skyline-from-the-park view kept separate from the consumer Hero so each
   can be reframed independently. */

/* Top text block — brand row, tagline, CTA stacked. One proportional gap
   scale (--bp-gap) drives BOTH the brand→tagline and tagline→CTA gaps so the
   rhythm is even and consistent; it steps up per breakpoint to keep pace with
   the type/padding (which also scale), instead of fixed px that drift. */
.bp-text-block {
  --bp-gap: 14px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 30rem;
}
@media (min-width: 1024px) {
  .bp-text-block { --bp-gap: 18px; }
  .bp-card--wide .bp-text-block { max-width: 34rem; --bp-gap: 22px; }
}

/* Audience cut-out — a white region notched into the card's top-left
   corner (the page surface showing through), with the chip centered inside
   it. Bleeds over the card padding so it sits flush in the corner; the
   right + bottom edges are the cut silhouette (hairline + concave BR
   corner), and the TR / BL convex corners are eased by the fillets. Reuses
   the same 13px radius + #E7E7F1 hairline as the card. */
.bp-cutout {
  position: relative;
  z-index: 3;
  align-self: flex-start;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;  /* pin the chip into the top-left corner */
  /* Negative margins bleed the cut-out's top/left edges all the way out to the
     card's own edges (= the full card padding), so the notch white is flush in
     the corner and reads as the corner bitten out of the card — its opening
     (top + left) merges visually with the white page surface beyond the card.
     There is NO card-perimeter hairline ring (the card edge is defined purely
     by its soft drop shadow); only the notch's own cut silhouette (right +
     bottom borders + the two fillet arcs) carries a hairline, so there is no
     line tracing around the whole card or running out around the label.
     Top/left margins track the card's per-breakpoint padding; the bottom
     margin is the gap down to the brand row (logo + name) below — widened
     from 6px for more mobile breathing room between the chip and the name. */
  margin: -28px 0 18px -28px;
  /* No top/left padding → the chip sits flush in the corner; the small
     right/bottom padding is the tight cut frame before the silhouette. */
  padding: 0 6px 5px 0;
  background: #FFFFFF;
  border-radius: 13px 0 13px 0;   /* TL = card corner, BR = concave cut */
  border-right: 1px solid #E7E7F1;
  border-bottom: 1px solid #E7E7F1;
}
@media (min-width: 640px)  { .bp-cutout { margin-top: -32px; margin-left: -32px; } }
@media (min-width: 1024px) { .bp-cutout { margin-top: -40px; margin-left: -40px; } }

/* Corner fillets — two 13x13 boxes sitting just outside the cut-out, each
   painted with a radial-gradient that (a) eases a convex corner onto a 13px
   arc instead of a hard 90deg corner and (b) carries the #E7E7F1 hairline
   along that arc so the notch's straight cut-border curves continuously back
   onto the card ring.

   The mechanism (copied exactly from the proven desktop notch, just
   repositioned): the gradient circle is centred at the point 13px DIAGONALLY
   INTO THE PHOTO from the convex corner, with the photo-side TRANSPARENT
   (inner stops) and the notch-side WHITE (outer stop). So the quarter-disc
   nearest the photo stays transparent (card shows through, rounded off) while
   the opposite wedge — the sliver adjacent to the notch corner — fills white,
   rounding the corner inward. The 1px #E7E7F1 band at ~12.5px is the hairline
   arc. (The earlier attempt inverted this — white on the photo side — which
   bulged a white "speech-bubble tail" OUT into the photo instead of easing
   the corner in.) Both convex corners here resolve to the SAME origin,
   "right bottom", because both sit with the photo down-and-right of them:
     • ::before = TOP-RIGHT convex corner (notch right cut-edge meets the
       card TOP edge). Box flush right of the notch (left:100%), top-aligned.
     • ::after  = BOTTOM-LEFT convex corner (notch bottom cut-edge meets the
       card LEFT edge). Box flush below the notch (top:100%), left-aligned.
   The 13px gradient stops are absolute, so they already match the 13px radius
   at every breakpoint; the fillets are pinned to the notch box edges
   (top/left 100%) so they auto-track the notch's per-label width + the
   per-breakpoint padding bleed without any media-query overrides. */
.bp-cutout::before,
.bp-cutout::after {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  pointer-events: none;
}
.bp-cutout::before {
  top: 0;
  left: 100%;
  background: radial-gradient(circle at right bottom,
    rgba(255, 255, 255, 0) 11.5px,
    #E7E7F1 12.25px,
    #E7E7F1 12.75px,
    #FFFFFF 13.5px);
}
.bp-cutout::after {
  top: 100%;
  left: 0;
  background: radial-gradient(circle at right bottom,
    rgba(255, 255, 255, 0) 11.5px,
    #E7E7F1 12.25px,
    #E7E7F1 12.75px,
    #FFFFFF 13.5px);
}

/* Audience chip — a rounded pill inside the cut-out. No border, no shadow:
   its background is tinted to match its own card's background image (a colour
   sampled from each photo / gradient), and the label text is white, so the
   chip reads as a little swatch of the card's own colour sitting in the white
   cut-out. Per-card background colours are set in the .bp-card--* overrides
   below; the base value is a fallback. 13px radius matches the card. */
.bp-chip {
  display: inline-flex;
  align-items: center;
  padding: 11px 18px;
  background: #78A2C2;
  border-radius: 13px;
  font-size: 15px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  white-space: nowrap;
}
/* Per-card chip background — the EXACT top-of-sky colour from each card's
   image (where the pill sits), so the pill reads as a true swatch of that
   tile's backdrop. Label text stays the base white where the colour is dark
   enough; the light Research pill flips to navy text for legibility:
     • Columbus — #028DE3 (top sky of ColumbusBackgroundbento.png), white text
     • Elio     — #43A2FC (top sky of elio-bento-bg.png), white text
     • Research — #CAE5F5 (light left/top of the card's gradient → navy text) */
.bp-card--columbus .bp-chip { background: #028DE3; }
.bp-card--elio     .bp-chip { background: #43A2FC; }
.bp-card--research .bp-chip { background: #CAE5F5; color: #0F173C; }

/* ─────────────────────────────────────────────────────────────────────
   Mobile cut-out chip  vs.  desktop top-right notch.

   The top-LEFT cut-out + tinted chip (above) is the MOBILE treatment
   (<1024px). On desktop (≥1024px) we restore the ORIGINAL design we used
   to have (commit c8075f8): a white notch cut into each card's top-RIGHT
   corner with the audience label tinted inside it, plus the card's 1px
   inset hairline ring (which the notch fillets join onto). The two
   treatments are both in the DOM and swapped purely by breakpoint.
   ───────────────────────────────────────────────────────────────────── */

/* Original desktop audience cut-out — page-surface white (#FFFFFF) notched
   into the card's top-RIGHT corner. Flush to the card's top + right edges
   (the borderless cut "opening"); the left + bottom edges carry the
   hairline (the cut silhouette), and the convex TL / BR corners are eased
   by the ::before / ::after radial-gradient fillets, which also carry the
   hairline arc onto the card's ::after ring. Hidden by default; shown only
   at ≥1024px (mobile uses the top-left chip instead). */
.bp-notch {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  box-sizing: border-box;
  display: none;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 22px;
  background-color: #FFFFFF;
  border-radius: 0 13px 0 13px;
  border-left: 1px solid #E7E7F1;
  border-bottom: 1px solid #E7E7F1;
}
.bp-notch::before,
.bp-notch::after {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  background: radial-gradient(
    circle at left bottom,
    rgba(255, 255, 255, 0) 11.5px,
    #E7E7F1 12.25px,
    #E7E7F1 12.75px,
    #FFFFFF 13.5px
  );
}
.bp-notch::before { top: 0; left: -13px; }
.bp-notch::after { bottom: -13px; right: 0; }
/* Per-card label tint — keyed to each tile's blue-dominated backdrop. */
.bp-notch-label {
  font-size: 13px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
}
.bp-card--columbus .bp-notch-label { color: #015C94; }
.bp-card--elio .bp-notch-label { color: #1E6BAE; }
.bp-card--research .bp-notch-label { color: #4B7BC7; }

@media (min-width: 1024px) {
  /* Desktop = the original: hide the mobile chip, show the top-right
     notch, and restore the card's hairline ring (the notch fillets join
     onto it). Mobile stays ring-free for the clean borderless cut-out. */
  .bp-cutout { display: none; }
  .bp-notch { display: flex; }
  .bp-card::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 13px;
    box-shadow: inset 0 0 0 1px #E7E7F1;
    pointer-events: none;
    z-index: 2;
  }
}

.bp-brand {
  display: inline-flex;
  /* Centered: the logo is the tallest, dominant ink, so the brand→tagline gap
     reads from the logo's bottom (= the row box). Keeps the Columbus wordmark's
     tuned baseline nudge intact. (Bottom-aligning to kill the below-name slack
     was considered but regressed that baseline — revisit with a visual check.) */
  align-items: center;
  gap: 12px;
}
/* Nudge the whole brand row (logo + name) 5px left on the Columbus + Elio
   tiles so it sits a touch tighter to the card's left edge. */
.bp-card--columbus .bp-brand,
.bp-card--elio .bp-brand {
  margin-left: -5px;
}
.bp-logo {
  width: clamp(36px, 9vw, 42px);
  height: clamp(36px, 9vw, 42px);
  object-fit: contain;
  flex: 0 0 auto;
}
/* Typography on .bp-name / .bp-tagline pulls from the project scale
   (font-size + line-height tokens). .bp-name uses .h3 on standard
   tiles and .h2 on the wide hero tile; .bp-tagline uses .h5 across
   the board. letter-spacing + max-width remain as layout/wrap
   controls (outside the scale). */
.bp-name {
  font-size: var(--typography--h3);
  line-height: var(--typography--h3--line-height);
  font-weight: 500;
  letter-spacing: -0.025em;
  color: inherit;
}
.bp-card--wide .bp-name {
  font-size: var(--typography--h2);
  line-height: var(--typography--h2--line-height);
}
/* Columbus + Elio tiles render their wordmark at semibold weight
   (Research keeps the default 500). Colour stays inherited. */
.bp-card--columbus .bp-name,
.bp-card--elio .bp-name {
  font-weight: 600;
}
/* Columbus wordmark colour matches the logo to its left — same navy
   #0F173C the COLUMBUS_LOGO_FILTER chain lands on (and the same value
   MistxNav uses for "Columbus Earth"). Font-size is set so this live-text
   wordmark's cap-height matches the VISIBLE height of the Elio wordmark
   IMAGE on the adjacent tile (~21px mobile / ~25px desktop), so the two
   top-row product names read at one consistent size. Axiforma cap-height is
   ~0.7× font-size, and the Elio glyphs occupy ~50% of their image box, so
   font ≈ 0.72 × Elio image height → ~clamp(26,6.5vw,30) mobile / 36px desktop.
   line-height: 1 keeps the box from carrying empty descender space. */
.bp-card--columbus .bp-name {
  color: #0F173C;
  font-size: clamp(26px, 6.5vw, 30px);
  line-height: 1;
  /* Pull the name left to absorb the logobueno.png transparent padding
     (~12.2% of the logo box on every side), so the VISIBLE logo→name gap
     matches the other tiles rather than reading ~6px looser. */
  margin-left: -5px;
  /* Drops the wordmark a hair below the brand row's optical centre so
     the baseline of the "C" sits closer to the bottom of the logo mark
     rather than dead-centred against it. */
  transform: translateY(3px);
}
@media (min-width: 1024px) {
  .bp-card--columbus .bp-name {
    font-size: 36px;
    margin-left: -6px;
    transform: translateY(4px);
  }
}
/* Research tile sets its title in Funnel Display (the design system's
   --font-display heading face). */
.bp-card--research .bp-name {
  font-family: var(--font-display);
  color: #0F173C;
}
/* Elio tile renders only the block "Elio" wordmark next to the brand
   icon. The source PNG is white-on-transparent — recoloured to the same
   navy #0F173C used by the Columbus wordmark on the tile to its left so
   both product names share a palette across the bento row. The negative
   margin-left absorbs BOTH the MapsGPT logo's right transparent padding
   (~6.8%) AND the wordmark PNG's own left dead space (~6.9%), so the
   VISIBLE logo→wordmark gap matches the other tiles. */
.bp-elio-name {
  width: auto;
  height: clamp(36px, 9vw, 42px);
  object-fit: contain;
  flex: 0 0 auto;
  margin-left: -7px;
  /* Nudge the wordmark down 2.2px so it sits a touch lower than the logo
     baseline (purely visual — transform doesn't affect layout flow). */
  transform: translateY(2.2px);
  /* Recolour the wordmark PNG to #059CFA (bright blue) via a CSS filter
     chain. brightness(0) saturate(100%) collapses the source to solid
     black, then the invert/sepia/saturate/hue-rotate chain tints it to
     the target. Derived from a hex→filter generator; tweak the chain
     numerically if the rendered hue drifts. */
  filter: brightness(0) saturate(100%) invert(46%) sepia(98%) saturate(2009%) hue-rotate(180deg) brightness(102%) contrast(101%);
}
@media (min-width: 1024px) {
  .bp-logo { width: 50px; height: 50px; }
  .bp-card--wide .bp-logo { width: 56px; height: 56px; }
  .bp-elio-name { height: 50px; margin-left: -8px; }
}

/* Brand row → tagline gap = the shared --bp-gap scale. */
.bp-tagline {
  margin: var(--bp-gap) 0 0;
  font-size: var(--typography--h5);
  line-height: var(--typography--h5--line-height);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: inherit;
  max-width: 28rem;
}
/* Elio tagline inherits the default ink colour so it matches the
   Columbus tagline on the tile to its left. */
@media (min-width: 1024px) {
  .bp-card--wide .bp-tagline { max-width: 34rem; }
}

/* Signature CTA pill — same pattern as CtaBanner / Careers / ProductCell:
   #1f1f1f surface, white label that swaps to var(--color-accent) on hover, and the
   five-dot blue ArrowDots glyph (var(--color-accent)) that slides 2px to the right
   on hover. Padding + line-height match Careers' "Join our team"
   reference button so every homepage-content CTA renders at the same
   42px height. */
.bp-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  /* tagline→CTA gap = the same --bp-gap as brand→tagline. Equal box gaps +
     the pill's solid filled shape make the CTA read as the slightly stronger
     break on its own, without an asymmetric margin or optical-comp hack. */
  margin-top: var(--bp-gap);
  padding: 14px 28px;
  background-color: var(--color-cta);
  color: #FFFFFF;
  border-radius: var(--radius-button-md);
  font-size: var(--typography--p-m);
  line-height: 1;
  font-weight: 500;
  white-space: nowrap;
  transition: color 180ms ease;
}
.bp-cta:hover { color: var(--color-accent); }
.bp-cta-arrow {
  display: inline-block;
  color: var(--color-accent);
  transition: transform 180ms ease;
}
.bp-cta:hover .bp-cta-arrow { transform: translateX(2px); }
.bp-cta-arrow svg { display: block; }

/* Elio CTA matches the Columbus tile — navy pill with white label —
   so both tiles share a single CTA treatment across the bento row. */
@media (prefers-reduced-motion: reduce) {
  .bp-cta,
  .bp-cta-arrow { transition: none; }
}

/* Mobile (<1024px): the visual sits in normal document flow at the
   bottom of the card, scaling to the card's content width. Aspect
   ratio is preserved (height: auto + max-width: 100% on the inner
   <img>), so the mockup never gets clipped by the card's bounds.

   Desktop (≥1024px) switches back to the original absolute-positioned
   "peeks-from-bottom" pattern that gave the design its signature
   text-top / mockup-bottom rhythm. */
.bp-visual {
  position: relative;
  margin-top: 24px;
  width: 100%;
  z-index: 3;
  display: flex;
  justify-content: center;
  transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
}
.bp-visual img,
.bp-visual > * {
  max-width: 100%;
  height: auto;
}
@media (min-width: 1024px) {
  .bp-visual {
    position: absolute;
    left: 40px;
    right: 40px;
    bottom: -2%;
    margin-top: 0;
    width: auto;
  }
  .bp-card:hover .bp-visual { transform: translateY(-18px); }
}
@media (prefers-reduced-motion: reduce) {
  .bp-visual { transition: none; }
  .bp-card:hover .bp-visual { transform: none; }
}

/* Wide tile shifts its visual to the right half so the text rail can
   read in the left half (text-left / visual-right horizontal split,
   common for banner rows in modern landing pages). */
@media (min-width: 1024px) {
  .bp-card--wide .bp-visual {
    left: auto;
    right: 40px;
    bottom: -22%;
    width: 52%;
  }
}

.bp-visual img {
  display: block;
  width: 100%;
  max-width: 720px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 24px 60px rgba(11, 27, 43, 0.20);
  border: 1px solid rgba(11, 27, 43, 0.08);
  background-color: #FFFFFF;
}

`;

interface Product {
  cellClass: string;
  href: string;
  logo: string;
  logoFilter?: string;
  name: string;
  /** Single short phrase, sits below the brand row. */
  tagline: string;
  /** Audience label. Shown TWO ways by breakpoint: the mobile top-left
   *  cut-out chip (<1024px) and the original desktop top-right notch
   *  (≥1024px). "For business" / "For consumer" / "For the curious". */
  audience?: string;
  /** Pill CTA label, e.g. "Learn more", "Try Elio". */
  ctaLabel: string;
  /** Full-bleed photo backdrop rendered as <Image fill> behind the card
   *  content. Static import → AVIF + real blur-up placeholder. Omit on
   *  tiles with a pure-CSS gradient backdrop (Research). */
  bg?: StaticImageData;
  /** Full-bleed looping background <video> (muted/autoplay) rendered in
   *  place of `bg`. Used by the Research banner — a screen-recording of the
   *  technology-page wave mesh. `poster` is the still shown until it plays. */
  video?: string;
  poster?: string;
  /** Product UI screenshot/graphic anchored to the bottom of the cell.
   *  Optional — omit on tiles that should render text-only (e.g.
   *  Research after the Gdesign tweak that dropped the LGM graphic). */
  visual?: StaticImageData;
  /** When true, the cell spans both columns on desktop as an elongated
   *  banner row (used by Research at the bottom of the grid). */
  wide?: boolean;
}

const PRODUCTS: Product[] = [
  {
    cellClass: "bp-card--columbus",
    href: "/products/business",
    logo: "/logobueno.png",
    logoFilter: COLUMBUS_LOGO_FILTER,
    name: "Columbus",
    tagline: "All-in-one map intelligence platform",
    audience: "For business",
    ctaLabel: "Learn more",
    bg: bgColumbus,
    visual: visualColumbus,
  },
  {
    cellClass: "bp-card--elio",
    href: "/products/consumer",
    logo: "/MapsGPT-logo.png",
    name: "Elio",
    tagline: "Making maps feel alive",
    audience: "For consumer",
    ctaLabel: "Learn more",
    bg: bgElio,
    visual: visualElio,
  },
  {
    cellClass: "bp-card--research",
    href: "/research",
    logo: "/TechnologyPageImages/lgm-globe-icon.png",
    name: "Research",
    tagline: "Building the Large Geospatial Model",
    audience: "For the curious",
    ctaLabel: "Read Thesis",
    video: "/bento/research-mesh.mp4",
    poster: "/bento/research-mesh-poster.jpg",
    wide: true,
  },
];

/* Signature 5-dot diagonal arrow used by CtaBanner / Careers / ProductCell.
   Circles use currentColor so the wrapping `.bp-cta-arrow` controls the
   fill (set to the navbar accent var(--color-accent) by default). */
function ArrowDots() {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 9 13"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

/* Full-bleed looping background <video> for the Research banner. A small
   wrapper so we can force the `muted` IDL property + kick off play() via a ref
   — React doesn't reliably reflect the `muted` prop and some browsers block
   muted-autoplay without it. It fills the card exactly like next/image's `fill`
   (see `video.bp-bg` in CSS); object-fit: cover + the desktop top-fade mask
   come from the shared `.bp-bg` class, so it matches the photo cards. */
function BgVideo({
  src,
  poster,
  warm,
}: {
  src: string;
  poster?: string;
  warm: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const play = v.play();
    if (play && typeof play.catch === "function") play.catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      className="bp-bg"
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      preload={warm ? "auto" : "metadata"}
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export function BentoProducts() {
  // Once the page is loaded + idle, MediaPrefetcher flips this true and the
  // below-fold backdrops + visuals promote themselves from lazy to eager so
  // they're decoded before the user scrolls down (no pop-in).
  const warm = useMediaWarm();
  return (
    <section className="bp-section" aria-label="Our products">
      <style>{CSS}</style>
      <div className="bp-bounds">
        <div className="bp-grid">
          {PRODUCTS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className={`bp-card ${p.cellClass}${p.wide ? " bp-card--wide" : ""}`}
            >
              {p.video ? (
                <>
                  {/* Looping wave-mesh screen-recording backdrop (Research) —
                      same full-bleed .bp-bg treatment as the photo cards, just
                      a <video> instead of an <Image>. Muted/autoplay/loop so
                      it behaves like an animated still. */}
                  <BgVideo src={p.video} poster={p.poster} warm={warm} />
                  <div className="bp-bg-tint" aria-hidden />
                </>
              ) : null}
              {/* Desktop (≥1024px) audience: the original white notch cut
                  into the card's top-RIGHT corner with the tinted label
                  inside. Absolutely positioned on the card; hidden <1024px
                  via CSS (mobile uses the top-left cut-out chip below). */}
                {p.audience && (
                  <div className="bp-notch">
                    <span className="bp-notch-label">{p.audience}</span>
                  </div>
                )}
              <div className="bp-text-block">
                {/* Mobile (<1024px) audience: a white corner cut-out
                    (top-left) with the image-tinted chip inside it. Hidden
                    ≥1024px (desktop uses the top-right notch above). */}
                {p.audience && (
                  <div className="bp-cutout">
                    <span className="bp-chip">{p.audience}</span>
                  </div>
                )}
                <div className="bp-brand">
                  {/* 50×50 logo mark — width/height let Next pick a
                      256-wide AVIF/WebP source even though it renders
                      smaller, so 2x retina stays sharp. */}
                  <Image
                    src={p.logo}
                    alt=""
                    aria-hidden
                    className="bp-logo"
                    width={56}
                    height={56}
                    style={p.logoFilter ? { filter: p.logoFilter } : undefined}
                  />
                  {p.cellClass === "bp-card--elio" ? (
                    /* Elio tile renders just the block "Elio" wordmark
                       next to the brand icon — the script "making
                       maps feel alive" image was dropped because the
                       body tagline below already says it. */
                    <Image
                      src="/consumer/elioNameHero.png"
                      alt={p.name}
                      className="bp-elio-name"
                      width={260}
                      height={110}
                    />
                  ) : (
                    <span
                      className="bp-name"
                      style={
                        p.cellClass === "bp-card--columbus"
                          ? {
                              fontFamily:
                                '"Axiforma", "SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                            }
                          : undefined
                      }
                    >
                      {p.name}
                    </span>
                  )}
                </div>
                <p className="bp-tagline">{p.tagline}</p>
                <span className="bp-cta">
                  {p.ctaLabel}
                  <span className="bp-cta-arrow">
                    <ArrowDots />
                  </span>
                </span>
              </div>
              {p.bg && (
                /* Contained photo backdrop — sits below the text block via
                   the card's flex column layout, with a 20px gap from the
                   CTA bottom and rounded corners. */
                <div className="bp-bg-wrap">
                  <Image
                    src={p.bg}
                    alt=""
                    aria-hidden
                    fill
                    className="bp-bg"
                    sizes="(max-width: 1023px) 100vw, 640px"
                    quality={70}
                    placeholder="blur"
                    loading={warm ? "eager" : "lazy"}
                    fetchPriority={warm ? "low" : undefined}
                  />
                  <div className="bp-bg-tint" aria-hidden />
                </div>
              )}
              {p.visual && (
                <div className="bp-visual">
                  {/* Static import → intrinsic dimensions + real blur-up
                      placeholder. The CSS sizes the rendered image
                      (width:100%; max-width:720px; height:auto); `sizes`
                      hints the optimizer to a small AVIF variant. Lazy
                      until the page is idle, then promoted to eager. */}
                  <Image
                    src={p.visual}
                    alt=""
                    aria-hidden
                    sizes="(max-width: 1023px) calc(100vw - 56px), 720px"
                    quality={80}
                    placeholder="blur"
                    loading={warm ? "eager" : "lazy"}
                    fetchPriority={warm ? "low" : undefined}
                  />
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BentoProducts;
