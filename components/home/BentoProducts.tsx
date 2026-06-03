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

/* Columbus + Elio photo backdrops are now rendered as <Image fill> behind
   the card content (see .bp-bg / .bp-bg-tint below) so the next-image
   optimizer serves AVIF instead of the raw multi-MB PNG the old
   background-image url() shipped. The Elio backdrop matches the
   /products/consumer hero so clicking through lands on a continuous image.
   Research keeps its pure-CSS gradient (no photo). */
.bp-card--research {
  background-image: linear-gradient(to right, #CAE5F5 0%, #76A8F3 100%);
}

/* Photo backdrop <Image fill> — sits at the bottom of the card stack
   (z-index 0). object-fit: cover + center matches the old
   background-size: cover; background-position: center. */
.bp-bg {
  object-fit: cover;
  object-position: center;
  z-index: 0;
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
  /* White readability wash removed per design — it washed out the top of
     the photos. Top lightening now comes from fading the photo's own
     opacity toward the white card at the top (see the .bp-bg mask in the
     desktop block above). Kept as a no-op transparent layer so the
     structure/z-index stay intact. */
  background: transparent;
  pointer-events: none;
  z-index: 1;
}
/* Research has NO photo backdrop — just the light #CAE5F5 → #76A8F3
   gradient with dark navy text, which is already high-contrast. The top
   white scrim above exists to keep text legible over the BUSY photo
   backdrops on the Columbus / Elio tiles; on Research it only washes the
   top of the gradient lighter, breaking the clean left-to-right read. Per
   the Gdesign collaborator note ("simple left-to-right gradient"), disable
   the scrim here so the 'to right' gradient renders as a clean, uniform
   horizontal band (every vertical slice one consistent colour top-to-
   bottom). Placed AFTER .bp-card::before so it wins on source order (equal
   specificity). */
.bp-card--research::before {
  display: none;
}
/* Elio's backdrop is a bento-specific photo (elio-bento-bg.png) — a
   skyline-from-the-park view kept separate from the consumer Hero so each
   can be reframed independently. */

/* Top text block — brand row, tagline, CTA stacked. Spacing is set with
   explicit per-pair margins (on .bp-tagline / .bp-cta) rather than one
   flex gap: see the optical-spacing note on those rules below. */
.bp-text-block {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 30rem;
}
@media (min-width: 1024px) {
  .bp-card--wide .bp-text-block { max-width: 34rem; }
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
     Margins track the card's per-breakpoint padding. */
  margin: -28px 0 6px -28px;
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
/* Per-card chip tint — sampled from each card's background image so the
   label matches the imagery it belongs to:
     • Columbus — #78A2C2 (sky-blue avg of ColumbusBackgroundbento.png)
     • Elio     — #4F8FA8 (deeper sky/teal avg of consumer/heroBackground.png)
     • Research — #76A8F3 (the darker stop of the card's blue gradient, for
       legible white text over the otherwise very light gradient). */
.bp-card--columbus .bp-chip { background: #78A2C2; }
.bp-card--elio     .bp-chip { background: #4F8FA8; }
.bp-card--research .bp-chip { background: #76A8F3; }

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
  align-items: center;
  gap: 12px;
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
   MistxNav uses for "Columbus Earth"). Font-size is pinned so the
   cap-height visually matches the logo (42px mobile / 50px ≥1024px) —
   sans-serif cap-height is ~0.72× font-size, so font-size = logo /
   0.72 ≈ 30px mobile / 36px ≥1024px. line-height: 1 keeps the box from
   carrying empty descender space that would push the row out of sync. */
.bp-card--columbus .bp-name {
  color: #0F173C;
  font-size: clamp(20px, 5.5vw, 26px);
  line-height: 1;
  /* Drops the wordmark a hair below the brand row's optical centre so
     the baseline of the "C" sits closer to the bottom of the logo mark
     rather than dead-centred against it. */
  transform: translateY(3px);
}
@media (min-width: 1024px) {
  .bp-card--columbus .bp-name {
    font-size: 30px;
    transform: translateY(4px);
  }
}
/* Research tile sets its title in Funnel Display (the design system's
   --font-display heading face). */
.bp-card--research .bp-name {
  font-family: var(--font-display);
}
/* Decorative lattice / dots / topography panel anchored to the right
   side of the Research tile. Sits behind the text content so the body
   copy reads on top — pointer-events:none keeps it inert. Hidden on
   narrow viewports where the tile collapses to a single column and the
   art would crowd the text. */
.bp-card--research .bp-research-art {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  /* Extended leftward (was width:45% / max-width:480px) so the lattice
     reaches across most of the tile; the SVG's viewBox width grows in
     step (see ResearchLatticeArt) so the cell size stays constant rather
     than scaling up. */
  width: 82%;
  max-width: 1000px;
  /* Fade the grid out toward the LEFT — full opacity at the right edge,
     ramping to transparent by the far left so the extension dissolves
     behind the text instead of crowding it. */
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 1) 100%);
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 1) 100%);
  pointer-events: none;
  z-index: 0;
}
.bp-card--research .bp-text-block {
  position: relative;
  z-index: 1;
}
@media (max-width: 1023px) {
  .bp-card--research .bp-research-art {
    display: none;
  }
}
/* Transparent (removebg) wireframe-globe graphic in the Research tile,
   bottom-aligned to the card's bottom edge and horizontally centred. Sits
   above the gradient/lattice but BELOW the text block (z-index 0 < the
   text's 1) so it never obscures the copy. pointer-events:none keeps the
   card link live across it.

   The PNG ships as faint blue/grey lines; rather than recolour each line we
   use the image as an ALPHA MASK over a solid accent-blue fill, so every
   opaque pixel (the wireframe lines) renders in var(--color-accent)
   regardless of its source colour. aspect-ratio reserves height from the
   797×313 source so "contain" never letterboxes. */
.bp-research-center {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(240px, 50%, 560px);
  aspect-ratio: 797 / 313;
  z-index: 0;
  pointer-events: none;
  background-color: var(--color-accent);
  -webkit-mask: url(/bento/research-center.png) center bottom / contain no-repeat;
  mask: url(/bento/research-center.png) center bottom / contain no-repeat;
}
/* Elio tile renders only the block "Elio" wordmark next to the brand
   icon. The source PNG is white-on-transparent — recoloured to the same
   navy #0F173C used by the Columbus wordmark on the tile to its left so
   both product names share a palette across the bento row. */
.bp-elio-name {
  width: auto;
  height: clamp(36px, 9vw, 42px);
  object-fit: contain;
  flex: 0 0 auto;
  margin-left: -4px;
  filter: brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%);
}
@media (min-width: 1024px) {
  .bp-logo { width: 50px; height: 50px; }
  .bp-card--wide .bp-logo { width: 56px; height: 56px; }
  .bp-elio-name { height: 50px; margin-left: -5px; }
}

/* Stacked spacing — title→subtitle. The brand row is logo-height
   (42–56px), so it carries empty box space below the shorter product-name
   text; the subtitle→CTA gap below (.bp-cta) adds +6px to optically
   cancel that, so both gaps read as even whitespace. */
.bp-tagline {
  margin: 18px 0 0;
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
  /* Wide tile keeps its roomier stack (22px title→subtitle), with the
     same +6px optical compensation on the subtitle→CTA gap. */
  .bp-card--wide .bp-tagline { max-width: 34rem; margin-top: 22px; }
  .bp-card--wide .bp-cta { margin-top: 28px; }
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
  /* subtitle→CTA gap. 18px (matching the title→subtitle margin) + 6px
     optical compensation: the CTA pill's top edge is hard (line-height 1),
     unlike the brand row above the tagline which has empty box space
     below its name text — so the raw gap here would otherwise look
     tighter than the title→subtitle gap. */
  margin-top: 24px;
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
  z-index: 1;
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
    wide: true,
  },
];

/* Decorative SVG that anchors the right side of the Research tile —
   a layered lattice: fine subdivision grid behind a primary 40px grid,
   crossed with 45° diagonal lines in both directions for a true lattice
   / cross-bracing look. All white at varying opacities so the structure
   reads against the tile's blue gradient. */
function ResearchLatticeArt() {
  // W widened from 400 → 840 so the lattice spans the now-wider (extended-
  // left) .bp-research-art panel with MORE grid columns at the same cell
  // pitch, rather than the SVG scaling up (which would coarsen the grid).
  // 840 stays divisible by both the 40px and 20px steps for clean lines.
  const W = 840;
  const H = 500;
  const big = 40;
  const small = 20;
  const diagStep = 40;

  const bigV = Array.from({ length: W / big + 1 }, (_, i) => i * big);
  const bigH = Array.from({ length: H / big + 1 }, (_, i) => i * big);
  const smallV = Array.from({ length: W / small + 1 }, (_, i) => i * small);
  const smallH = Array.from({ length: H / small + 1 }, (_, i) => i * small);

  // Diagonals (slope +1 and -1) sweeping the whole panel.
  const positiveDiagonals: number[] = [];
  for (let c = -W; c <= H; c += diagStep) positiveDiagonals.push(c);
  const negativeDiagonals: number[] = [];
  for (let c = 0; c <= W + H; c += diagStep) negativeDiagonals.push(c);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Fine subdivision grid */}
      <g stroke="rgba(255,255,255,0.14)" strokeWidth="0.5">
        {smallV.map((x) => <line key={`sv${x}`} x1={x} y1={0} x2={x} y2={H} />)}
        {smallH.map((y) => <line key={`sh${y}`} x1={0} y1={y} x2={W} y2={y} />)}
      </g>

      {/* Diagonal cross-hatch lattice */}
      <g stroke="rgba(255,255,255,0.18)" strokeWidth="0.4">
        {positiveDiagonals.map((c, i) => (
          <line key={`pd${i}`} x1={0} y1={c} x2={W} y2={c + W} />
        ))}
        {negativeDiagonals.map((c, i) => (
          <line key={`nd${i}`} x1={0} y1={c} x2={W} y2={c - W} />
        ))}
      </g>

      {/* Primary 40px grid on top */}
      <g stroke="rgba(255,255,255,0.38)" strokeWidth="0.6">
        {bigV.map((x) => <line key={`bv${x}`} x1={x} y1={0} x2={x} y2={H} />)}
        {bigH.map((y) => <line key={`bh${y}`} x1={0} y1={y} x2={W} y2={y} />)}
      </g>
    </svg>
  );
}

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
              {p.bg && (
                <>
                  {/* Photo backdrop — first child so it sits at the bottom
                      of the card's paint stack. AVIF via the optimizer +
                      progressive blur-up. Stays lazy until the page is
                      idle, then promotes to eager. */}
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
                </>
              )}
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
              {p.cellClass === "bp-card--research" && (
                <div className="bp-research-art" aria-hidden>
                  <ResearchLatticeArt />
                </div>
              )}
              {/* Wireframe globe — rendered as a masked fill (not an <img>)
                  so its lines take the accent blue; see .bp-research-center. */}
              {p.cellClass === "bp-card--research" && (
                <span className="bp-research-center" aria-hidden />
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BentoProducts;
