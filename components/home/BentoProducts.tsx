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
 * Columbus + Elio use a "split" layout: a soft per-product surface (flat
 * gray for Columbus; a blurred consumer-hero photo under a light blue wash
 * for Elio) with the brand row pinned top-LEFT, the tagline + CTA pinned
 * bottom-LEFT, and the product visual anchored bottom-RIGHT, bleeding off
 * the card's right/bottom edges (overflow:hidden clips it). Research keeps
 * its wide video-banner treatment with text at the top.
 */

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";

// Static imports → Next generates a real low-res `blurDataURL` (progressive
// blur-up) + intrinsic dimensions at build time.
import visualColumbus from "@/public/ColumbusHomeimg.png";
// Elio's bottom-right phone reuses the consumer-Hero map screenshot inside a
// CSS phone bezel (screen content only; the dark frame is built in CSS).
import elioPhone from "@/public/ConsumerPgMedia/ElioShowcases/ElioHeroShowcase.png";
// Elio's tile background = the consumer-page hero photo.
import elioHeroBg from "@/public/ConsumerPgMedia/heroBackground.png";
// Columbus's tile background = the business-page hero photo.
import columbusHeroBg from "@/public/ColumbusBackgroundV2Enhanced.png";

/* Recolour filter matching MistxNav so the Columbus mark renders in the
   same navy blue everywhere it appears on the site (used by Research's globe). */
const COLUMBUS_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)";

/* White recolour for the Columbus mark on the dark navy tile. */
const LOGO_FILTER_WHITE = "brightness(0) invert(1)";

const CSS = `
.bp-section {
  background: #FFFFFF;
  padding: 0 0 80px;
  font-family: var(--font-sans, "Ppneuemontreal", "PP Neue Montreal", Arial, sans-serif);
}
@media (min-width: 700px) {
  .bp-section { padding-bottom: 112px; }
}

/* Canonical content-bounds calc trick — 1287px cap, 40px narrower than parent. */
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
/* Two-column grid only on true desktop — at 700–1023px the cards stay
   stacked (single column) but each keeps the horizontal desktop interior. */
@media (min-width: 1024px) {
  .bp-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

/* Grid cell — the actual grid item. Wraps the clipped card so the audience
   notch can be rendered as an UNCLIPPED sibling overlay (see .bp-notch).
   position:relative makes it the notch's positioning context. */
.bp-cell {
  position: relative;
  display: flex;
  min-width: 0;
}
@media (min-width: 1024px) {
  .bp-cell--wide { grid-column: span 2; }
}

/* ── Card ──────────────────────────────────────────────────────────────
   Soft per-product surface, 13px corners, overflow:hidden so the
   bottom-right visual clips at the card edge. Flex column so the text rail
   (brand top / tagline+CTA bottom) fills the height and the visual is
   absolutely placed over it. */
.bp-card {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 13px;
  /* Generous top padding on mobile so the brand row sits well below the
     top-LEFT cut-out (40px tall) with clear breathing room. (Mobile padding-top
     is finally set in the ≤699px block below.) */
  padding: 58px 26px 28px;
  text-decoration: none;
  color: #0F173C;
  display: flex;
  flex-direction: column;
  min-height: 360px;
}
@media (min-width: 640px)  { .bp-card { padding: 60px 32px 32px; min-height: 400px; } }
@media (min-width: 700px) { .bp-card { padding: 40px; height: 500px; min-height: 0; } }

/* Per-product surfaces — bases behind each tile's blurred hero photo.
   Columbus = the business-page hero photo under a navy-tinted wash (white
   content on top); Elio = the consumer-page hero photo. */
.bp-card--columbus {
  background-color: #14204A;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.bp-card--elio { background-color: #CDE2F2; }

/* Columbus surface: blurred business-hero photo + a left-weighted navy wash
   that keeps the white brand / features / tagline / CTA legible while the
   right side stays clearer behind the MacBook. */
.bp-columbus-bg {
  object-fit: cover;
  object-position: center;
  z-index: 0;
  filter: blur(9px);
  transform: scale(1.12);
}
.bp-columbus-wash {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    100deg,
    rgba(8, 15, 45, 0.85) 0%,
    rgba(8, 15, 45, 0.58) 40%,
    rgba(8, 15, 45, 0.2) 72%,
    rgba(8, 15, 45, 0.05) 100%
  );
}

/* Wide tile (Research) keeps its video banner + 2-col span. */
.bp-card--wide { min-height: 280px; }
@media (min-width: 700px) {
  .bp-card--wide { min-height: unset; height: 308px; }
}

/* Research video backdrop (<video class="bp-bg">) + optional tint. */
.bp-bg { object-fit: cover; object-position: center; z-index: 0; }
video.bp-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
.bp-bg-tint { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.bp-card--research .bp-bg-tint { display: none; }

/* ── Elio surface: consumer-page hero photo, blurred + washed ──────────
   The hero photo fills the tile (next/image fill, z-0) blurred and scaled up
   from the top so the dark foreground grass is pushed off the bottom edge;
   the wash is a left→right white veil (keeps brand/tagline/CTA legible) plus
   a bottom-right corner glow that lifts the foreground behind the phone. */
.bp-elio-bg {
  object-fit: cover;
  object-position: center;
  z-index: 0;
  /* Blurred hero photo, framed so the skyline + foreground sit a touch higher
     in the tile. */
  filter: blur(9px);
  transform: scale(1.28);
  transform-origin: center 78%;
}

/* ── Audience cut-out (top-right) ──────────────────────────────────────
   White notch tucked into the card's top-right corner, with the ::before /
   ::after radial-gradient fillets that smooth the two inner junctions (the
   "curved edges" the tile had before). Same on every breakpoint. */
.bp-notch {
  position: absolute;
  /* Rendered OUTSIDE the card (sibling overlay on the unclipped .bp-cell), so
     its white can bleed 1px PAST the card's top + right edges and fully cover
     the card's rounded corner — the one thing the card's own clip can't do
     (the corner is the card's outer edge, so a clipped notch always leaves a
     ~1px antialiased sliver of the card colour there). The 1px overhang lands
     on the white page, so it's invisible. The top-right corner is rounded to
     13px to match the card silhouette (a square corner would now jut out as a
     bump). Height/padding gain 1px on the bled sides to stay 40px-tall centred.
     pointer-events:none lets clicks fall through to the card link beneath. */
  top: -1px;
  right: -1px;
  z-index: 3;
  pointer-events: none;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 41px;
  padding: 1px 23px 0 22px;
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
/* Fillets re-anchored to the card edges to cancel the 1px notch bleed. */
.bp-notch::before { top: 1px; left: -13px; }
.bp-notch::after  { bottom: -13px; right: 1px; }

/* Mobile: tuck the cut-out into the top-LEFT corner instead — a horizontal
   mirror of the desktop top-right placement, fillets included. */
@media (max-width: 699px) {
  .bp-notch {
    /* Mirror of desktop: bleed 1px past the top + LEFT card edges; the top-left
       corner is rounded 13px to match the card silhouette, the interior
       bottom-right stays rounded 13px. Left padding gains the 1px back so the
       label stays centred. */
    right: auto;
    left: -1px;
    padding: 1px 22px 0 23px;
    border-radius: 13px 0 13px 0;
    border-left: none;
    border-right: 1px solid #E7E7F1;
  }
  .bp-notch::before,
  .bp-notch::after {
    background: radial-gradient(
      circle at right bottom,
      rgba(255, 255, 255, 0) 11.5px,
      #E7E7F1 12.25px,
      #E7E7F1 12.75px,
      #FFFFFF 13.5px
    );
  }
  .bp-notch::before { left: auto; right: -13px; }
  .bp-notch::after  { right: auto; left: 1px; }
}

/* Narrow two-column desktop (1024–1129px): the half-width Columbus / Elio tiles
   get tight enough that the left-aligned brand name runs under the right-side
   cut-out. Rather than squeeze, mirror those two cut-outs to the top-LEFT (same
   as the mobile placement) so the name has the full tile width to its right —
   then drop the brand below the now-left notch. Research is a full-width banner,
   so it keeps its right-side notch and needs no drop. */
@media (min-width: 1024px) and (max-width: 1129px) {
  .bp-notch--columbus,
  .bp-notch--elio {
    right: auto;
    left: -1px;
    padding: 1px 22px 0 23px;
    border-radius: 13px 0 13px 0;
    border-left: none;
    border-right: 1px solid #E7E7F1;
  }
  .bp-notch--columbus::before,
  .bp-notch--columbus::after,
  .bp-notch--elio::before,
  .bp-notch--elio::after {
    background: radial-gradient(
      circle at right bottom,
      rgba(255, 255, 255, 0) 11.5px,
      #E7E7F1 12.25px,
      #E7E7F1 12.75px,
      #FFFFFF 13.5px
    );
  }
  .bp-notch--columbus::before,
  .bp-notch--elio::before { left: auto; right: -13px; }
  .bp-notch--columbus::after,
  .bp-notch--elio::after  { right: auto; left: 1px; }

  .bp-card--columbus .bp-brand,
  .bp-card--elio .bp-brand { margin-top: 26px; }
}

/* Label colour keyed to each tile's surface so it reads as part of it:
   Columbus = navy ink of the gray tile; Elio = the tile's blue; Research
   = the lighter banner blue. */
.bp-notch-label {
  font-size: 13px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
}
.bp-notch--columbus .bp-notch-label { color: #0F173C; }
.bp-notch--elio .bp-notch-label { color: #1E6BAE; }
.bp-notch--research .bp-notch-label { color: #4B7BC7; }

/* ── Text rail ─────────────────────────────────────────────────────────
   Brand row + a bottom group (tagline + CTA). On Columbus/Elio the rail
   fills the card height and pins the two groups to top/bottom; it's capped
   to the left portion so the bottom-right visual reads clear. Research
   keeps the default top-aligned flow. */
.bp-text {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 32rem;
}
.bp-text-bottom {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-top: 18px;
}
@media (min-width: 700px) {
  .bp-card--columbus .bp-text,
  .bp-card--elio .bp-text {
    flex: 1 1 auto;
    justify-content: space-between;
    max-width: 50%;
  }
  .bp-card--columbus .bp-text-bottom,
  .bp-card--elio .bp-text-bottom { margin-top: auto; }
  .bp-card--wide .bp-text { max-width: 34rem; }
}

/* ── Brand row ── */
.bp-brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
}
/* Elio's wordmark is an image (its margin only crops within its clip box,
   not the flex gap), so tighten Elio's gap directly on mobile so its
   logo→name spacing scales like the smaller lockup. Desktop keeps 11px. */
.bp-card--elio .bp-brand { gap: 7px; }
@media (min-width: 700px) {
  .bp-card--elio .bp-brand { gap: 11px; }
}
.bp-logo {
  object-fit: contain;
  flex: 0 0 auto;
}
/* Logos follow a golden-ratio lockup: each mark's visible ink height = 1.6× the
   wordmark cap height in its cell (cap = 17px mobile / 30px desktop), so the
   symbol reads gently larger than the name and scales with it at every
   breakpoint. Box height = (1.6 × cap) / ink-V-frac (the rest of each PNG is
   transparent padding); width keeps the native aspect ratio.
   → ink target = 27.2px mobile / 48px desktop.
   ink-V-frac: Columbus 0.7555, Research 0.7431, Elio-mark 0.9333 (aspect 1.209). */
.bp-card--columbus .bp-logo { width: 36.06px; height: 36.00px; }
.bp-card--research .bp-logo  { width: 36.60px; height: 36.60px; }
.bp-card--elio .bp-logo      { width: 35.23px; height: 29.14px; }
@media (min-width: 700px) {
  .bp-card--columbus .bp-logo { width: 63.64px; height: 63.53px; }
  .bp-card--research .bp-logo  { width: 64.59px; height: 64.59px; }
  .bp-card--elio .bp-logo      { width: 62.18px; height: 51.43px; }
}

/* Brand name — sized just above the design-system h4 on the standard tiles
   (h2 still drives the wide Research banner). */
.bp-name {
  font-size: clamp(27px, 6vw, 30px);
  line-height: 1.08;
  font-weight: 500;
  letter-spacing: -0.025em;
  color: inherit;
}
.bp-card--wide .bp-name {
  font-size: var(--typography--h2);
  line-height: var(--typography--h2--line-height);
}
.bp-card--research .bp-name {
  font-family: var(--font-display);
  color: #0F173C;
  position: relative;
  display: inline-block;
  line-height: 1;
  /* Ink glyph height = 17px (mobile — sized so the longest name fits a phone);
     desktop override → 30px. */
  font-size: 23.94px;
  transform: translateY(-0.03em);
  /* Pull the wordmark in tight against the globe mark (a touch less space
     than Columbus). Larger pull on mobile keeps the gap scaled down. */
  margin-left: -10px;
}
/* Axiforma sits optically high next to the globe mark — nudge it down so the
   wordmark reads vertically centred with the logo. Sized to match the Research
   label (design-system h2). */
.bp-card--columbus .bp-name {
  color: #FFFFFF;
  font-weight: 600;
  white-space: nowrap;
  position: relative;
  display: inline-block;
  line-height: 1;
  /* Ink glyph height = 17px (mobile — sized so "Columbus Pro" fits a phone);
     desktop override → 30px. */
  font-size: 21.96px;
  transform: translateY(0.103em); /* centre glyph vertically with the logo */
  /* The Columbus globe PNG carries ~12% side padding (vs ~7% on the Elio /
     Research marks). With the larger logos that padding widens the visual
     logo→name gap, so pull the wordmark in tight against the mark. The
     larger pull on mobile keeps the gap scaled to the smaller lockup
     (the fixed 11px flex gap would otherwise read proportionally loose). */
  margin-left: -8.5px;
}

/* Desktop: bump both wordmarks so their ink glyph height = 30px. */
@media (min-width: 700px) {
  .bp-card--columbus .bp-name { font-size: 38.76px; margin-left: -7px; }
  .bp-card--research .bp-name { font-size: 42.25px; margin-left: -9px; }
}

/* Elio wordmark — the "Elio" glyphs occupy only the middle ~50% of the PNG
   (transparent padding around them), so the image is scaled up and the wrapper
   crops to the glyph's exact bounds. Result: the visible "Elio" ink height
   matches the 17px / 30px of the other two labels, and the wrapper box (where
   the guide lines sit) hugs the glyph. width:auto keeps the native aspect ratio —
   only height is set, so the image is never stretched. */
.bp-elio-name {
  display: block;
  /* width:auto + max-width:none so the glyph keeps its native aspect ratio.
     (Tailwind Preflight sets img max-width:100%, which would otherwise clamp the
     width to the narrow wrapper, squashing the image vertically + clipping it.) */
  width: auto;
  max-width: none;
  /* Mobile: image 33.51px tall → "Elio" ink glyph = 17px. */
  height: 33.51px;
  margin-top: -8.05px;   /* crop the top transparent padding */
  margin-left: -5px;     /* crop left padding + nudge toward the logo (scaled gap) */
  filter: brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0, 30, 60, 0.4));
}
.bp-elio-name-wrap {
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
  overflow: hidden;
  height: 17px;
  width: 42.54px;
}
@media (min-width: 700px) {
  .bp-elio-name { height: 59.13px; margin-top: -14.20px; margin-left: -9.5px; }
  .bp-elio-name-wrap { height: 30px; width: 75.07px; }
}

/* ── Tagline — just above the design-system h5 on the standard tiles. ── */
.bp-tagline {
  margin: 0;
  font-size: clamp(18px, 3.2vw, 23px);
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0F173C;
  max-width: 16rem;
}
/* Flagship taglines (Columbus + Elio) use the Funnel Display heading face —
   the same "Research" font — at a lighter weight, with balanced wrapping so
   lines split evenly instead of leaving an orphan word ("…alive / again"). */
.bp-card--columbus .bp-tagline,
.bp-card--elio .bp-tagline {
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.16;
  max-width: 18rem;
  text-wrap: balance;
}
/* Research keeps its lighter, normal-weight h5 supporting tagline. */
.bp-card--research .bp-tagline {
  font-size: var(--typography--h5);
  line-height: var(--typography--h5--line-height);
  font-weight: 500;
  letter-spacing: -0.015em;
  max-width: 34rem;
}

/* ── Classic homepage CTA pill (CtaBanner / Careers / ProductCell pattern):
   var(--color-cta) navy surface, white label that swaps to var(--color-accent)
   on hover, with the signature 5-dot ArrowDots glyph sliding right on hover. */
.bp-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
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
/* The CTA reacts to hover on its own AND to hover anywhere on the card, so
   hovering the whole tile animates the button as if it were hovered. */
.bp-cta:hover,
.bp-card:hover .bp-cta { color: var(--color-accent); }
.bp-cta-arrow {
  display: inline-flex;
  color: var(--color-accent);
  transition: transform 180ms ease;
}
.bp-cta:hover .bp-cta-arrow,
.bp-card:hover .bp-cta-arrow { transform: translateX(2px); }
.bp-cta-arrow svg { display: block; }
@media (prefers-reduced-motion: reduce) {
  .bp-cta, .bp-cta-arrow { transition: none; }
}

/* Research CTA — frosted-glass pill. Keeps the base .bp-cta sizing (padding /
   p-m font / radius-button-md) so it matches the Columbus + Elio pills above,
   but swaps the solid surface for the translucent glass treatment used by the
   Research hero's index buttons: a white veil over a backdrop blur with an
   inset navy hairline. Navy ink that deepens as the glass brightens on hover. */
.bp-card--research .bp-cta {
  position: relative;
  background-color: rgba(255, 255, 255, 0.22);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
  backdrop-filter: blur(18px) saturate(1.35);
  color: color-mix(in srgb, var(--color-cta) 85%, transparent);
  transition: color 180ms ease, background 180ms ease;
}
/* Subtle gradient rim — a 1px border masked to the pill edge. Inverted from the
   usual glass shine: a navy tint concentrated along the top (and left) edge that
   fades to a soft white shine toward the bottom. The steeper 152deg angle keeps
   the dark hugging the top. */
.bp-card--research .bp-cta::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    152deg,
    color-mix(in srgb, var(--color-cta) 26%, transparent) 0%,
    color-mix(in srgb, var(--color-cta) 10%, transparent) 34%,
    rgba(255, 255, 255, 0.16) 70%,
    rgba(255, 255, 255, 0.42) 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
  transition: background 180ms ease;
}
.bp-card--research .bp-cta:hover,
.bp-card--research:hover .bp-cta {
  color: var(--color-cta);
  background-color: rgba(255, 255, 255, 0.32);
}
.bp-card--research .bp-cta:hover::before,
.bp-card--research:hover .bp-cta::before {
  background: linear-gradient(
    152deg,
    color-mix(in srgb, var(--color-cta) 34%, transparent) 0%,
    color-mix(in srgb, var(--color-cta) 14%, transparent) 34%,
    rgba(255, 255, 255, 0.22) 70%,
    rgba(255, 255, 255, 0.6) 100%
  );
}
/* Even vertical rhythm: brand → tagline → link equally spaced. */
.bp-card--research .bp-text-bottom {
  margin-top: 20px;
  gap: 18px;
}

/* Elio (over the photo): white tagline + a white CTA pill with navy ink that
   swaps to the accent on hover — legible against the crisp hero image. */
.bp-card--elio .bp-tagline {
  color: #FFFFFF;
  text-shadow: 0 1px 4px rgba(0, 30, 60, 0.4);
}
.bp-card--elio .bp-cta {
  background-color: #FFFFFF;
  color: #0B1342;
  box-shadow: 0 8px 22px rgba(0, 45, 90, 0.2);
}

/* Columbus (on the dark navy tile): white tagline + a white CTA pill with
   navy ink, so both read crisply against the deep background. */
.bp-card--columbus .bp-tagline { color: #FFFFFF; }
.bp-card--columbus .bp-cta {
  background-color: #FFFFFF;
  color: #0B1342;
}

/* ── Product visual (bottom-right) ─────────────────────────────────────
   Columbus = framed desktop screenshot; Elio = phone in a dark bezel. On
   mobile both sit in normal flow below the text; on desktop they're
   absolutely anchored bottom-right and bleed off the edges. */
.bp-visual {
  position: relative;
  z-index: 1;
  margin-top: 28px;
  /* On mobile the visual sits in normal flow, centred below the text. */
  align-self: center;
  width: 82%;
  transition: transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
}
@media (min-width: 700px) {
  .bp-visual { margin-top: 0; }
  .bp-card:hover .bp-visual { transform: translateY(-10px); }
  /* Columbus: the MacBook sits bled off the right edge — on hover it slides
     LEFT, pulling more of the screenshot into view. */
  .bp-card--columbus:hover .bp-visual { transform: translateX(-26px); }
}
@media (prefers-reduced-motion: reduce) {
  .bp-visual { transition: none; }
  .bp-card:hover .bp-visual { transform: none; }
}

/* Columbus screenshot inside a CSS MacBook Pro mockup ───────────────────
   .bp-mac        — wrapper sizing both the lid and the base
   .bp-mac-screen — dark aluminium lid: thin uniform black bezel, rounded
                    top, with a camera dot centred in the top bezel
   .bp-mac-base   — the silver deck seen edge-on below the lid; slightly
                    wider than the lid with a centred finger-groove dip. */
.bp-mac { width: 100%; }
.bp-mac-screen {
  position: relative;
  background: #0B0B0B;
  border-radius: 11px 11px 5px 5px;
  padding: 6px 6px 7px;
}
.bp-mac-screen img {
  display: block;
  width: 100%;
  height: auto;
  /* Concentric with the display opening: the lid's outer radius is 11px top with
     6px bezel padding (→ 5px inner), and the bottom meets the hinge nearly square
     (5px outer − 7px padding → 0). So the screenshot's corners hug the screen. */
  border-radius: 5px 5px 0 0;
  background-color: #FFFFFF;
}
.bp-mac-cam {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #2A2E33;
}
/* Space-Black MacBook Pro deck — dark aluminium, thinner front lip. */
.bp-mac-base {
  position: relative;
  width: 108%;
  margin-left: -4%;
  height: 10px;
  background: linear-gradient(180deg, #4A4D53 0%, #303338 45%, #232529 78%, #161719 100%);
  border-radius: 2px 2px 10px 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
}
.bp-mac-base::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 14%;
  max-width: 86px;
  height: 5px;
  background: linear-gradient(180deg, #161719 0%, #303338 100%);
  border-radius: 0 0 6px 6px;
}
@media (min-width: 700px) {
  .bp-card--columbus .bp-visual {
    position: absolute;
    margin-top: 0;
    /* Grows up-and-left from the bottom-right anchor. */
    width: 77.76%;
    right: -170px;
    /* Dropped flush to the card's bottom edge. */
    bottom: 0;
  }
}

/* Elio phone (dark PolarX bezel around the map screenshot) — no drop shadow. */
.bp-visual--phone {
  width: clamp(160px, 46%, 210px);
}
.bp-phone {
  position: relative;
  width: 100%;
  aspect-ratio: 0.4949;
  box-sizing: border-box;
  padding: 5px;
  border-radius: 38px;
  background: #0A0A0C;
  /* Titanium-edge rim: a thin lighter inner ring reads as the polished
     metal band around a modern iPhone. */
  box-shadow:
    inset 0 0 0 1.5px #34373D,
    0 1px 3px rgba(10, 14, 20, 0.22);
}
/* Side buttons — thin nubs on the metal edge (volume left, power right). */
.bp-phone::before,
.bp-phone::after {
  content: "";
  position: absolute;
  width: 2px;
  border-radius: 2px;
  background: #34373D;
}
.bp-phone::before { left: -2px; top: 27%; height: 16%; }
.bp-phone::after  { right: -2px; top: 30%; height: 13%; }
.bp-phone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 33px;
  overflow: hidden;
  background: linear-gradient(180deg, #FFFFFF 0%, #EAF4F5 100%);
}
.bp-phone-screen img {
  object-fit: cover;
  object-position: top center;
  /* Nudge the screenshot down so its status bar (5:04 / battery) sits level
     with the Dynamic Island instead of above it. The thin strip exposed at
     the very top is the white screen background, which matches the white
     status-bar area so the seam is invisible. */
  transform: translateY(2.6%);
}
/* Dynamic Island — black pill floating over the top of the screen. */
.bp-phone-island {
  position: absolute;
  top: 2.6%;
  left: 50%;
  transform: translateX(-50%);
  width: 32%;
  aspect-ratio: 3.6 / 1;
  background: #0A0A0C;
  border-radius: 999px;
  z-index: 2;
}
@media (min-width: 700px) {
  .bp-card--elio .bp-visual {
    position: absolute;
    margin-top: 0;
    width: 208px;
    right: 30px;
    bottom: -70px;
  }
}

/* ── Mobile: open up the stacked layout so the content breathes ──────────
   More room below the cut-out, and a deliberate brand → tagline → CTA rhythm:
   the tagline sits close under the title (one content group) while the CTA gets
   clearer separation below it. A larger gap precedes the product visual. The
   taller cards are intentional. */
@media (max-width: 699px) {
  .bp-card { padding-top: 70px; padding-bottom: 46px; min-height: 480px; }
  .bp-card--wide { min-height: 360px; }
  .bp-text-bottom,
  .bp-card--research .bp-text-bottom { margin-top: 16px; gap: 22px; }
  .bp-visual { margin-top: 50px; }
  /* Tighter corner radius on the enlarged mobile Elio phone — the 38px/33px
     desktop curve reads as too rounded at this larger on-screen size. */
  .bp-phone { border-radius: 26px; }
  .bp-phone-screen { border-radius: 22px; }
}

/* ── Full-width stacked range (700–1023px) ──────────────────────────────
   Here the cards keep the horizontal desktop interior but are stacked at
   FULL width — the half-width-tuned visual sizing (Columbus 77.76%+−170px,
   Elio fixed 208px, 500px tall cards) leaves big dead space. Reorganize
   into balanced wide banners: shorter cards, the MacBook enlarged to fill
   the right side (clamped so it doesn't outgrow the height), a bigger Elio
   phone anchored right, and the text rail given a sensible share. */
@media (min-width: 700px) and (max-width: 1023px) {
  .bp-card { height: 400px; }

  .bp-card--columbus .bp-text,
  .bp-card--elio .bp-text { max-width: 46%; }

  .bp-card--columbus .bp-visual {
    /* Kept small enough that the bottom-anchored MacBook's top stays below
       the brand row (≈104px) so the wordmark never overlaps the screen. */
    width: clamp(380px, 56%, 470px);
    right: -56px;
  }

  .bp-card--elio .bp-visual {
    width: clamp(188px, 26%, 212px);
    right: 92px;
    bottom: -105px;
  }
}
`;

interface Product {
  cellClass: string;
  href: string;
  logo: string;
  logoFilter?: string;
  name: string;
  /** Single short phrase; on Columbus/Elio it's the bottom-left headline. */
  tagline: string;
  /** Audience label shown in the top-right white cut-out. */
  audience?: string;
  /** Pill CTA label, e.g. "Learn more", "Try Elio". */
  ctaLabel: string;
  /** Full-bleed looping background <video> (Research banner). */
  video?: string;
  poster?: string;
  /** Columbus: framed desktop screenshot anchored bottom-right. */
  visual?: StaticImageData;
  /** Elio: phone-screen content shown inside a CSS bezel, bottom-right. */
  phone?: StaticImageData;
  /** When true, the cell spans both columns on desktop (Research banner). */
  wide?: boolean;
}

const PRODUCTS: Product[] = [
  {
    cellClass: "bp-card--columbus",
    href: "/products/business",
    logo: "/logobueno.png",
    logoFilter: LOGO_FILTER_WHITE,
    name: "Columbus Pro",
    tagline: "All-in-one map intelligence platform",
    audience: "For business",
    ctaLabel: "Learn more",
    visual: visualColumbus,
  },
  {
    cellClass: "bp-card--elio",
    href: "/products/consumer",
    logo: "/MapsGPT-logo.png",
    name: "Elio",
    tagline: "Making maps feel alive again",
    audience: "For consumer",
    ctaLabel: "Learn more",
    phone: elioPhone,
  },
  {
    cellClass: "bp-card--research",
    href: "/research",
    logo: "/ResearchPgMedia/lgm-globe-icon.png",
    // Recolour the black globe icon to the navy #0F173C the "Research" title uses.
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

/* Signature 5-dot diagonal arrow used by the classic homepage CTA pill
   (CtaBanner / Careers / ProductCell). Circles use currentColor so the
   wrapping .bp-cta-arrow controls the fill (var(--color-accent)). */
function ArrowDots() {
  return (
    <svg width="12" height="13" viewBox="0 0 9 13" fill="none" aria-hidden="true">
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

/* Full-bleed looping background <video> for the Research banner. Forces the
   muted IDL property + kicks off play() via a ref so muted-autoplay isn't
   blocked. Fills the card like next/image `fill` (see video.bp-bg). */
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

/* Elio's phone — the map screenshot inside a dark PolarX-style bezel. */
function PhoneFrame({ src, warm }: { src: StaticImageData; warm: boolean }) {
  return (
    <div className="bp-phone" aria-hidden>
      <div className="bp-phone-screen">
        <span className="bp-phone-island" />
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 1023px) 50vw, 220px"
          placeholder="blur"
          loading={warm ? "eager" : "lazy"}
          fetchPriority={warm ? "low" : undefined}
        />
      </div>
    </div>
  );
}

export function BentoProducts() {
  // Once the page is loaded + idle, MediaPrefetcher flips this true and the
  // below-fold visuals promote themselves from lazy to eager (no pop-in).
  const warm = useMediaWarm();
  return (
    <section className="bp-section" aria-label="Our products">
      <style>{CSS}</style>
      <div className="bp-bounds">
        <div className="bp-grid">
          {PRODUCTS.map((p) => {
            const isColumbus = p.cellClass === "bp-card--columbus";
            const brand = (
              <div className="bp-brand">
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
                  <span className="bp-elio-name-wrap">
                    <Image
                      src="/ConsumerPgMedia/elioNameHero.png"
                      alt={p.name}
                      className="bp-elio-name"
                      width={260}
                      height={110}
                    />
                  </span>
                ) : (
                  <span
                    className="bp-name"
                    style={
                      isColumbus
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
            );
            const cta = (
              <span className="bp-cta">
                {p.ctaLabel}
                <span className="bp-cta-arrow">
                  <ArrowDots />
                </span>
              </span>
            );
            const notchVariant = p.cellClass.replace("bp-card--", "bp-notch--");
            return (
            <div
              key={p.name}
              className={`bp-cell${p.wide ? " bp-cell--wide" : ""}`}
            >
            <a
              href={p.href}
              className={`bp-card ${p.cellClass}${p.wide ? " bp-card--wide" : ""}`}
            >
              {p.video ? (
                <>
                  <BgVideo src={p.video} poster={p.poster} warm={warm} />
                  <div className="bp-bg-tint" aria-hidden />
                </>
              ) : null}

              {/* Elio surface: blurred consumer-hero photo. */}
              {p.cellClass === "bp-card--elio" && (
                <Image
                  src={elioHeroBg}
                  alt=""
                  aria-hidden
                  fill
                  className="bp-elio-bg"
                  sizes="(max-width: 1023px) 100vw, 640px"
                  quality={78}
                  placeholder="blur"
                  loading={warm ? "eager" : "lazy"}
                  fetchPriority={warm ? "low" : undefined}
                />
              )}

              {/* Columbus surface: blurred business-hero photo + navy wash. */}
              {isColumbus && (
                <>
                  <Image
                    src={columbusHeroBg}
                    alt=""
                    aria-hidden
                    fill
                    className="bp-columbus-bg"
                    sizes="(max-width: 1023px) 100vw, 640px"
                    quality={70}
                    placeholder="blur"
                    loading={warm ? "eager" : "lazy"}
                    fetchPriority={warm ? "low" : undefined}
                  />
                  <div className="bp-columbus-wash" aria-hidden />
                </>
              )}

              {/* Text rail: brand top, tagline + CTA bottom. */}
              <div className="bp-text">
                {brand}
                <div className="bp-text-bottom">
                  <p className="bp-tagline">{p.tagline}</p>
                  {cta}
                </div>
              </div>

              {/* Columbus screenshot inside a MacBook Pro mockup, bottom-right. */}
              {p.visual && (
                <div className="bp-visual bp-visual--mac">
                  <div className="bp-mac" aria-hidden>
                    <div className="bp-mac-screen">
                      <span className="bp-mac-cam" />
                      <Image
                        src={p.visual}
                        alt=""
                        aria-hidden
                        sizes="(max-width: 1023px) calc(100vw - 84px), 440px"
                        quality={80}
                        placeholder="blur"
                        loading={warm ? "eager" : "lazy"}
                        fetchPriority={warm ? "low" : undefined}
                      />
                    </div>
                    <div className="bp-mac-base" />
                  </div>
                </div>
              )}

              {/* Elio phone, bottom-right. */}
              {p.phone && (
                <div className="bp-visual bp-visual--phone">
                  <PhoneFrame src={p.phone} warm={warm} />
                </div>
              )}
            </a>

            {/* Audience cut-out — rendered OUTSIDE the clipped card as an
                unclipped overlay so its white can bleed over the card's rounded
                corner (the card's own clip can't, leaving a colour sliver).
                pointer-events:none so clicks fall through to the card link. */}
            {p.audience && (
              <div className={`bp-notch ${notchVariant}`} aria-hidden>
                <span className="bp-notch-label">{p.audience}</span>
              </div>
            )}
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BentoProducts;
