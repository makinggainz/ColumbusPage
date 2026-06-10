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

/* Wide tile (Research) — taller on mobile so the video backdrop has room
   to breathe beneath the text. Desktop keeps the original 308px band. */
.bp-card--wide {
  min-height: 280px;
}
@media (min-width: 1024px) {
  .bp-card--wide {
    grid-column: span 2;
    min-height: unset;
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
/* Columbus: anchor the cover-crop to the top of the photo so more of the sky
   shows (the frame sits higher over the image); the skyline/trees at the
   bottom are cropped — they sit behind the product visual anyway. */
.bp-card--columbus .bp-bg {
  object-position: center top;
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
     contained bg+frost band sitting in the lower portion. The tint here
     becomes the FROST: a strong per-product brand wash painted ON TOP of
     the bg image (since .bp-bg-tint is the last child of .bp-bg-wrap,
     painting over the <Image>). Columbus keeps a frosted blur over the
     photo; Elio drops the blur so the cloud texture reads through. */
  .bp-card--columbus .bp-bg-tint {
    background: linear-gradient(
      160deg,
      rgba(11, 19, 66, 0.80) 0%,
      rgba(2, 141, 227, 0.50) 100%
    );
    -webkit-backdrop-filter: blur(60px);
    backdrop-filter: blur(60px);
    /* backdrop-filter is NOT clipped by the parent's border-radius +
       overflow:hidden (Chrome/Safari), so the frost renders square corners
       over the rounded photo. Give it the matching 13px radius itself. */
    border-radius: 13px;
  }
  .bp-card--elio .bp-bg-tint {
    background: linear-gradient(
      160deg,
      rgba(10, 123, 230, 0.62) 0%,
      rgba(95, 191, 241, 0.42) 100%
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
/* Overlay behind the text on Columbus + Elio tiles. On mobile the photo
   is contained in .bp-bg-wrap below the text, so we bleed the sky color
   upward via a gradient — opaque sky tint at the bottom (where the photo
   panel starts) fading to transparent at the top (card bg white shows
   through). On desktop the frost/blur handles things; reset to flat white. */
.bp-card--columbus::before {
  background: linear-gradient(to bottom, rgba(25, 65, 145, 0.22) 0%, rgba(255, 255, 255, 0) 40%);
}
.bp-card--elio::before {
  background: linear-gradient(to bottom, rgba(45, 125, 215, 0.18) 0%, rgba(255, 255, 255, 0) 40%);
}

/* Columbus + Elio: flex column so the bg image wrapper can sit below the
   text block in flow and flex-fill the card's remaining height. */
.bp-card--columbus,
.bp-card--elio {
  display: flex;
  flex-direction: column;
  /* Card surface = pure white. The bg-wrap + frost sit ABOVE this in the
     lower portion of the card (top edge 20px below the CTA), so the upper
     half (where text + CTA live) reads as a flat white panel. */
  background-color: #FFFFFF;
}

/* Contained bg image + frost — sits 20px below the text block (= 20px below
   the CTA's bottom edge, since the CTA is the last item in the text block),
   rounded corners, clips its own content. z-index 2 puts it above the white
   overlay (z 1). */
.bp-bg-wrap {
  position: relative;
  /* Bleed left/right/bottom out to the card's outer edges via negative
     margins that match the card's per-breakpoint padding (28 / 32 / 40).
     Top keeps the +20px gap from the CTA. */
  margin: 20px -28px -28px;
  /* All four corners rounded to 13px — matches the card's outer radius
     so the contained bg band reads as a smaller, fully-rounded panel.
     The left/right/bottom bleed past the card edge is clipped by the
     card's own overflow:hidden, so those outer corners still tuck into
     the card's 13px. */
  border-radius: 13px;
  overflow: hidden;
  z-index: 2;
  /* Mobile: a 12px padding ring shows the sky photo (the .bp-bg fill below)
     as a frame around the product screenshot that now lives inside this
     wrapper, so the screenshot reads as ONE framed panel instead of a
     detached block floating below the band. Height is auto — the wrapper
     shrink-wraps the screenshot + ring. Desktop resets padding to 0 and
     flex-fills, with the screenshot absolutely peeking from the bottom. */
  padding: 12px;
}
@media (min-width: 640px) {
  .bp-bg-wrap { margin: 20px -32px -32px; padding: 14px; }
}
@media (min-width: 1024px) {
  /* Desktop: stay CONTAINED (not full-bleed). Flex-fills the remaining
     card height after the text block + 20px gap, with card-edge bleed
     on left/right/bottom via negative margins. */
  .bp-bg-wrap {
    margin: 20px -40px -40px;
    padding: 0;
    flex: 1 1 auto;
    aspect-ratio: auto;
    min-height: 0;
  }
  /* Contained photo no longer needs the top-opacity fade (the wrapper has
     a hard top edge of its own). */
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
  /* Notch is 40px tall; card padding is 28px. Target: brand row starts at
     notch-bottom (40px) + 24px gap = 64px from card top. padding-top = 64 - 28 = 36px. */
  padding-top: 36px;
}
@media (min-width: 640px) {
  /* Card padding is 32px. Same 24px gap target → padding-top = 64 - 32 = 32px. */
  .bp-text-block { padding-top: 32px; }
}
@media (min-width: 1024px) {
  /* Notch is on the RIGHT; text is LEFT-aligned — no vertical overlap. */
  .bp-text-block { --bp-gap: 18px; padding-top: 0; }
  .bp-card--wide .bp-text-block { max-width: 34rem; --bp-gap: 22px; }
}

/* Mobile chip wrapper — superseded by the notch at all breakpoints now that
   the notch shows on mobile too. Hidden everywhere; kept in the DOM so the
   JSX doesn't need to change. */
.bp-cutout {
  display: none;
}

/* Audience label — free-floating text, no fill. Colour is per-card (matching
   the backdrop) via the .bp-card--* overrides; the base is a fallback. Set in
   the same uppercase micro-label style as the desktop notch so the two
   treatments read as the same element. */
.bp-chip {
  display: inline-flex;
  align-items: center;
  padding: 0;
  background: transparent;
  font-size: 13px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #015C94;
  white-space: nowrap;
}
/* Per-card label colour — a readable tint drawn from each tile's blue
   backdrop (same values the desktop notch label uses, so mobile + desktop
   labels match): Columbus deep sky, Elio mid blue, Research lighter blue. */
.bp-card--columbus .bp-chip { color: #015C94; }
.bp-card--elio     .bp-chip { color: #1E6BAE; }
.bp-card--research .bp-chip { color: #4B7BC7; }

/* ─────────────────────────────────────────────────────────────────────
   Mobile cut-out chip  vs.  desktop top-right notch.

   The top-LEFT cut-out + tinted chip (above) is the MOBILE treatment
   (<1024px). On desktop (≥1024px) we restore the ORIGINAL design we used
   to have (commit c8075f8): a white notch cut into each card's top-RIGHT
   corner with the audience label tinted inside it, plus the card's 1px
   inset hairline ring (which the notch fillets join onto). The two
   treatments are both in the DOM and swapped purely by breakpoint.
   ───────────────────────────────────────────────────────────────────── */

/* Audience cut-out — page-surface white (#FFFFFF) notched into the card's
   corner. Mobile/tablet (<1024px): top-LEFT corner. Desktop (≥1024px): restored
   to the original top-RIGHT corner. Flush to the card's two outer edges
   (the borderless "opening"); the other two edges carry the hairline silhouette.
   The ::before / ::after radial-gradient fillets ease the convex junctions and
   carry the hairline arc onto the card's ::after ring. */

/* ── Mobile/tablet default: TOP-LEFT corner ── */
.bp-notch {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 22px;
  background-color: #FFFFFF;
  border-radius: 13px 0 13px 0;
  border-right: 1px solid #E7E7F1;
  border-bottom: 1px solid #E7E7F1;
}
/* Fillets for the top-left notch — horizontal mirror of the right-side originals.
   ::before sits to the RIGHT of the notch (where notch right-border meets the card's
   top ring). ::after sits BELOW the notch (where card's left ring meets notch bottom).
   circle at right bottom is the horizontal mirror of circle at left bottom. */
.bp-notch::before,
.bp-notch::after {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  background: radial-gradient(
    circle at right bottom,
    rgba(255, 255, 255, 0) 11.5px,
    #E7E7F1 12.25px,
    #E7E7F1 12.75px,
    #FFFFFF 13.5px
  );
}
.bp-notch::before { top: 0; right: -13px; }
.bp-notch::after  { bottom: -13px; left: 0; }

/* ── Desktop (≥1024px): restore original TOP-RIGHT corner ── */
@media (min-width: 1024px) {
  .bp-notch {
    left: auto;
    right: 0;
    border-radius: 0 13px 0 13px;
    border-right: none;
    border-left: 1px solid #E7E7F1;
  }
  .bp-notch::before,
  .bp-notch::after {
    background: radial-gradient(
      circle at left bottom,
      rgba(255, 255, 255, 0) 11.5px,
      #E7E7F1 12.25px,
      #E7E7F1 12.75px,
      #FFFFFF 13.5px
    );
  }
  .bp-notch::before { top: 0; right: auto; left: -13px; }
  .bp-notch::after  { bottom: -13px; left: auto; right: 0; }
}
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

/* Hairline ring on all breakpoints — inset box-shadow so it adds no
   layout box and stays within the 13px rounded corner. */
.bp-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 13px;
  box-shadow: inset 0 0 0 1px #E7E7F1;
  pointer-events: none;
  z-index: 2;
}
/* Columbus + Elio use a subtler 2px semi-transparent ring (matched to the
   business-page super-section panel style). */
.bp-card--columbus::after,
.bp-card--elio::after {
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.05);
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

/* Brand text colours on the Columbus + Elio tiles. The text sits over the
   card's WHITE surface now (the bg image + frost is contained below the
   CTA), so it reads in brand ink rather than white.

   • Columbus tile  — logo + name + tagline all render in Columbus blue
     (#0F173C; same navy the navbar wordmark uses). The logo already gets
     this colour from the inline COLUMBUS_LOGO_FILTER on the <Image>, and
     .bp-name has its own #0F173C rule above; only the tagline needs a
     scoped override here (the default .bp-card colour is #0B1B2B).

   • Elio tile      — wordmark recoloured to #00A6FF via a CSS filter
     chain (overriding the #059CFA recipe baked into .bp-elio-name); the
     tagline pins to Columbus blue so it reads as the same brand-blue
     family as the Columbus tile next door. */
.bp-card--columbus .bp-tagline,
.bp-card--elio .bp-tagline {
  color: #0F173C;
}
.bp-elio-name {
  /* Approximation of #00A6FF via brightness(0) collapse + hue shift —
     CSS filters are imprecise; tweak the chain numerically if the
     rendered hue drifts. */
  filter: brightness(0) saturate(100%) invert(48%) sepia(99%) saturate(2800%) hue-rotate(180deg) brightness(102%) contrast(102%) !important;
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
  /* No top margin on mobile — the screenshot is centered inside the
     .bp-bg-wrap padding ring (it's a child of the wrapper now), so the sky
     photo frames it on all four sides. */
  margin-top: 0;
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
    name: "Columbus Pro",
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
    logo: "/ResearchPgMedia/lgm-globe-icon.png",
    // Recolour the black globe icon to the navy #0F173C the "Research" title
    // (.bp-card--research .bp-name) uses, so the icon matches its label. Same
    // chain the Columbus logo uses — it normalises any source to black, then
    // tints to #0F173C.
    logoFilter: COLUMBUS_LOGO_FILTER,
    name: "Research",
    tagline: "Building the Large Geospatial Model",
    audience: "For the curious",
    ctaLabel: "Read Thesis",
    video: "/ConsumerPgMedia/bento/research-mesh.mp4",
    poster: "/ConsumerPgMedia/bento/research-mesh-poster.jpg",
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
                      src="/ConsumerPgMedia/elioNameHero.png"
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
                   CTA bottom and rounded corners. The product visual lives
                   INSIDE this wrapper so the photo+frost frames it on every
                   breakpoint: on mobile a padding ring shows the sky photo
                   around the screenshot; on desktop the visual is absolutely
                   positioned to peek from the wrapper's bottom. */
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
                        sizes="(max-width: 1023px) calc(100vw - 84px), 720px"
                        quality={80}
                        placeholder="blur"
                        loading={warm ? "eager" : "lazy"}
                        fetchPriority={warm ? "low" : undefined}
                      />
                    </div>
                  )}
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
