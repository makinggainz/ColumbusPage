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

import { useEffect, useRef, type ReactNode } from "react";
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
@media (min-width: 1024px) {
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
@media (min-width: 1024px) {
  .bp-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

/* ── Card ──────────────────────────────────────────────────────────────
   Soft per-product surface, 13px corners, overflow:hidden so the
   bottom-right visual clips at the card edge. Flex column so the text rail
   (brand top / tagline+CTA bottom) fills the height and the visual is
   absolutely placed over it. */
.bp-card {
  position: relative;
  overflow: hidden;
  border-radius: 13px;
  padding: 28px;
  text-decoration: none;
  color: #0F173C;
  display: flex;
  flex-direction: column;
  min-height: 360px;
}
@media (min-width: 640px)  { .bp-card { padding: 32px; min-height: 400px; } }
@media (min-width: 1024px) { .bp-card { padding: 40px; height: 500px; min-height: 0; } }

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
@media (min-width: 1024px) {
  .bp-card--wide { grid-column: span 2; min-height: unset; height: 308px; }
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

/* ── Columbus capability rail (business-page DNA) ──────────────────────
   A vertical list of IconChips — the same device the business page uses for
   its feature rail. Each chip is a 34px circle in a single neutral tint with
   the matching stroke icon, beside a navy label. Even rhythm is owned by the
   parent .bp-text-bottom gap, so no margins here. */
.bp-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
}
.bp-feature {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.bp-feature-chip {
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.bp-feature-chip svg { display: block; }
.bp-feature-label {
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: #E6EAF3;
}
@media (max-width: 1023px) {
  .bp-features { gap: 12px; }
}

/* ── Audience cut-out (top-right) ──────────────────────────────────────
   White notch tucked into the card's top-right corner, with the ::before /
   ::after radial-gradient fillets that smooth the two inner junctions (the
   "curved edges" the tile had before). Same on every breakpoint. */
.bp-notch {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  box-sizing: border-box;
  display: flex;
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
.bp-notch::after  { bottom: -13px; right: 0; }

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
.bp-card--columbus .bp-notch-label { color: #0F173C; }
.bp-card--elio .bp-notch-label { color: #1E6BAE; }
.bp-card--research .bp-notch-label { color: #4B7BC7; }

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
/* Columbus top zone: brand + tagline grouped together. */
.bp-col-head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
@media (min-width: 1024px) {
  .bp-card--columbus .bp-text,
  .bp-card--elio .bp-text {
    flex: 1 1 auto;
    justify-content: space-between;
    max-width: 50%;
  }
  .bp-card--columbus .bp-text-bottom,
  .bp-card--elio .bp-text-bottom { margin-top: auto; }
  .bp-card--wide .bp-text { max-width: 34rem; }
  /* Columbus splits into three zones — brand+tagline (top), capability rail
     (centred), CTA (bottom). space-between distributes them top/centre/bottom,
     and the CTA's bottom edge lines up with the MacBook base. */
  .bp-card--columbus .bp-text { justify-content: space-between; }
  .bp-card--columbus .bp-text-bottom { margin-top: 0; }
}

/* ── Brand row ── */
.bp-brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
}
.bp-logo {
  width: clamp(34px, 8vw, 40px);
  height: clamp(34px, 8vw, 40px);
  object-fit: contain;
  flex: 0 0 auto;
}
@media (min-width: 1024px) {
  .bp-logo { width: 44px; height: 44px; }
  .bp-card--wide .bp-logo { width: 50px; height: 50px; }
}

/* Brand name — sized just above the design-system h4 on the standard tiles
   (h2 still drives the wide Research banner). */
.bp-name {
  font-size: clamp(22px, 4.2vw, 30px);
  line-height: 1.08;
  font-weight: 500;
  letter-spacing: -0.025em;
  color: inherit;
}
.bp-card--wide .bp-name {
  font-size: var(--typography--h2);
  line-height: var(--typography--h2--line-height);
}
.bp-card--research .bp-name { font-family: var(--font-display); color: #0F173C; }
.bp-card--columbus .bp-name { color: #FFFFFF; font-weight: 600; }

/* Elio wordmark image — rendered white over the photo (soft drop-shadow for
   legibility), sized so its glyphs read at roughly the Columbus name's cap
   height. */
.bp-elio-name {
  width: auto;
  height: clamp(32px, 7.4vw, 38px);
  object-fit: contain;
  flex: 0 0 auto;
  margin-left: -4px;
  transform: translateY(1px);
  filter: brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0, 30, 60, 0.4));
}
@media (min-width: 1024px) {
  .bp-elio-name { height: 41px; }
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

/* Research CTA — borderless text link (no pill background). Navy label that
   swaps to the accent on hover, sized up from the pill's small caption and
   paired with a slightly larger ArrowDots glyph. */
.bp-card--research .bp-cta {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  color: var(--color-cta);
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  gap: 12px;
}
.bp-card--research .bp-cta-arrow svg {
  width: 14px;
  height: 15px;
}
/* Without the pill's padding the link crowds the tagline — open the vertical
   rhythm so brand → tagline → link read as evenly spaced. */
.bp-card--research .bp-tagline { margin-bottom: 4px; }
.bp-card--research .bp-text-bottom {
  margin-top: 22px;
  gap: 22px;
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
  margin-top: 24px;
  align-self: flex-end;
  width: 86%;
  transition: transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
}
@media (min-width: 1024px) {
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
  border-radius: 3px;
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
@media (min-width: 1024px) {
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
@media (min-width: 1024px) {
  .bp-card--elio .bp-visual {
    position: absolute;
    margin-top: 0;
    width: 208px;
    right: 30px;
    bottom: -70px;
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

/* Stroke-glyph wrapper matching the business-page IconChip spec (24-vbox,
   stroke 1.8, round caps) so the Columbus capability rail reads as a slice of
   that page. currentColor lets each chip tint its own icon. */
function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* Single neutral tint for every capability chip — light on the dark navy
   tile (no per-feature colour) so the rail reads quiet and uniform. Used at
   ~13% alpha for the circle, full for the icon. */
const FEATURE_COLOR = "#FFFFFF";

/* Columbus capability rail — the four flagship features from the business
   page (Map Chat / Data Catalogue / Agentic Research / Dashboard). */
const COLUMBUS_FEATURES = [
  {
    label: "Map Chat",
    icon: (
      <Glyph>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </Glyph>
    ),
  },
  {
    label: "Data Catalogue",
    icon: (
      <Glyph>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      </Glyph>
    ),
  },
  {
    label: "Agentic Research",
    icon: (
      <Glyph>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="m11 13 4 4" />
        <path d="M15 11h3v3" />
      </Glyph>
    ),
  },
  {
    label: "Dashboard",
    icon: (
      <Glyph>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </Glyph>
    ),
  },
];

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
            return (
            <a
              key={p.name}
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

              {/* Audience cut-out — white notch in the top-right corner. */}
              {p.audience && (
                <div className="bp-notch">
                  <span className="bp-notch-label">{p.audience}</span>
                </div>
              )}

              {/* Text rail. Columbus splits into three zones — brand+tagline
                  (top), capability rail (centred), CTA (bottom, aligned to the
                  MacBook base). Elio/Research keep brand-top + tagline+CTA. */}
              {isColumbus ? (
                <div className="bp-text">
                  <div className="bp-col-head">
                    {brand}
                    <p className="bp-tagline">{p.tagline}</p>
                  </div>

                  <ul className="bp-features">
                    {COLUMBUS_FEATURES.map((f) => (
                      <li key={f.label} className="bp-feature">
                        <span
                          className="bp-feature-chip"
                          style={{ backgroundColor: `${FEATURE_COLOR}21`, color: FEATURE_COLOR }}
                        >
                          {f.icon}
                        </span>
                        <span className="bp-feature-label">{f.label}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bp-text-bottom">{cta}</div>
                </div>
              ) : (
                <div className="bp-text">
                  {brand}
                  <div className="bp-text-bottom">
                    <p className="bp-tagline">{p.tagline}</p>
                    {cta}
                  </div>
                </div>
              )}

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
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BentoProducts;
