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

import Image from "next/image";
import { WorldMapLineArt } from "./WorldMapLineArt";

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
   hidden so the bottom-peeking visual clips at the card edge. The 1px
   hairline is NOT a CSS border — a CSS border always paints a full
   rectangle and can't be masked, so it would run straight across the
   audience cut-out. It's drawn instead by the ::after ring below, which
   the white notch + fillets can sit on top of. */
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
  height: 460px;
}
@media (min-width: 640px)  { .bp-card { height: 520px; padding: 32px; } }
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

/* Columbus tile: photo backdrop with a subtle flat black overlay
   (the leading solid-colour gradient layer) to deepen the image. */
.bp-card--columbus {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.18)),
    url('/ColumbusBackgroundbento.png');
}
/* Elio tile: same subtle flat black overlay as the Columbus tile.
   Backdrop matches the /products/consumer page hero so clicking through
   from the bento lands on a visually-continuous image. */
.bp-card--elio {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.18)),
    url('/consumer/heroBackground.png');
}
/* Research uses a left-to-right linear gradient — light sky #CAE5F5 at
   0% to mid-blue #76A8F3 at 100%, both fully opaque — matching the
   Figma swatch supplied by Gdesign. Replaces the prior cream backdrop
   (/Colbackgroundcard.png) so the Research tile reads as a distinct
   blue band against the cream Columbus / Elio tiles above. */
.bp-card--research {
  background-image: linear-gradient(to right, #CAE5F5 0%, #76A8F3 100%);
}

/* Top scrim — fades from a translucent white surface at the top (where
   the text sits) to transparent past the brand row, so the brand mark +
   tagline + CTA read against the busy bg textures without obscuring
   the lower half where the product visual peeks up. */
.bp-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.0) 55%);
  pointer-events: none;
  z-index: 0;
}

/* Hairline ring — a 1px inset stroke just inside the card edge, drawn as
   an overlay rather than a CSS border. Two reasons it's an overlay:
     • the white audience notch (z-index 3) + its fillets sit on top of
       it, masking exactly the top/right spans where the silhouette
       detours inward — so the visible hairline follows the cut-out.
     • z-index 2 keeps it above the top scrim (::before, z-index 0) so the
       stroke reads at full strength along the top edge.
   inset box-shadow (not border) so it isn't clipped away and follows the
   13px radius. */
.bp-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 13px;
  box-shadow: inset 0 0 0 1px #E7E7F1;
  pointer-events: none;
  z-index: 2;
}

/* Audience cut-out — the page surface (#FFFFFF, the colour the cards
   sit on) notched into the card's top-right corner, with the audience
   label ("For business" / "For consumer") set inside it. The white is
   flush to the card's top and right edges, so it reads as a piece cut
   out of the corner itself rather than a panel laid on top.

   All three cut corners are rounded by the card's own 13px radius, so
   the cut has no sharp edges:
     • top-right    — coincides with the card's existing rounded corner.
     • bottom-left  — the deep concave corner of the cut (border-radius).
     • top-left + bottom-right — convex corners where the cut runs into
       the card's top / right edges; rounded by the ::before / ::after
       fillets below.
   z-index 3 sits it above the scrim, product visual and text block. */
.bp-notch {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  box-sizing: border-box;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28px;
  background-color: #FFFFFF;
  /* TL TR BR BL — TL/BR are squared off here and rounded by the
     fillets; TR matches the card corner; BL is the concave cut. */
  border-radius: 0 13px 0 13px;
  /* Hairline on the cut edges only — the left + bottom edges are the
     notch's silhouette (the inward detour of the card outline), so they
     carry the 1px stroke; with border-radius BL the concave corner gets
     it for free. The top + right edges are the cut-out opening (flush to
     the card edge) and stay borderless. */
  border-left: 1px solid #E7E7F1;
  border-bottom: 1px solid #E7E7F1;
}
/* Corner fillets — a 13×13 box sitting just outside the notch (::before
   top-left, ::after bottom-right), painted white everywhere except a
   transparent quarter-disc the card keeps. This eases the notch's
   straight edge into the card's edge on a 13px convex arc instead of a
   hard 90° corner.

   The gradient also carries the hairline: a 1px #E7E7F1 band sits at the
   transparent→white transition (~12.5px radius), so the card outline's
   stroke curves along the fillet arc and joins the notch's straight
   border to the card's ::after ring. */
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
/* Label size mirrors the hero section's eyebrow / superscript
   (.hn-eyebrow in HeroNew.tsx): 16px, stepping up to 18px ≥992px.
   line-height: 1 keeps it tight in the notch. Colour is set per card
   below — each label is tinted to its tile's background imagery. */
.bp-notch-label {
  font-size: 16px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.015em;
  white-space: nowrap;
}
@media (min-width: 992px) {
  .bp-notch-label { font-size: 18px; }
}
/* Per-card label tint — keyed to each tile's actual background. All
   three cards are blue-dominated (the Columbus + Elio backdrops are
   bright-blue-sky cityscape photos, and Research is the CAE5F5 → 76A8F3
   gradient), so every label sits in the blue family — each one a
   couple of lightness stops darker than the card's dominant colour so
   it stays legible against the white notch surface.
   • Columbus business tile → deepest blue (#015C94), the saturated
     sky-blue that dominates the cloud + skyline photo.
   • Elio consumer tile → mid sky-blue (#1E6BAE), matching the brighter,
     mid-day sky in the Elio cityscape photo and offsetting the slightly
     warmer building tones below it.
   • Research tile → lighter blue (#4B7BC7), the deeper end of the
     CAE5F5 → 76A8F3 gradient, slightly darkened. */
.bp-card--columbus .bp-notch-label { color: #015C94; }
.bp-card--elio .bp-notch-label { color: #1E6BAE; }
.bp-card--research .bp-notch-label { color: #4B7BC7; }
@media (min-width: 640px) {
  .bp-notch { height: 46px; padding: 0 32px; }
}
@media (min-width: 1024px) {
  .bp-notch { height: 53px; padding: 0 40px; }
}

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

.bp-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.bp-logo {
  width: 42px;
  height: 42px;
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
  font-size: 26px;
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
/* Elio tile renders only the block "Elio" wordmark next to the brand
   icon. The source PNG is white-on-transparent — recoloured to the same
   navy #0F173C used by the Columbus wordmark on the tile to its left so
   both product names share a palette across the bento row. */
.bp-elio-name {
  width: auto;
  height: 42px;
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

/* Bottom-anchored product visual — now lifted above the card's bottom
   edge (positive bottom %) so the entire screenshot is visible and the
   image floats with a small breathing-room gap below it. The
   horizontal insets keep the visual aligned with the text rail's
   left padding so the composition reads as one column. */
.bp-visual {
  position: absolute;
  left: 28px;
  right: 28px;
  bottom: -2%;
  z-index: 1;
  display: flex;
  justify-content: center;
  /* Fast-but-smooth lift on card hover. Eased with a custom decel
     curve (close to ease-out-quart) so the visual snaps up then
     settles. */
  transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
}
@media (min-width: 640px)  { .bp-visual { left: 32px; right: 32px; bottom: -2%; } }
@media (min-width: 1024px) { .bp-visual { left: 40px; right: 40px; bottom: -2%; } }
.bp-card:hover .bp-visual { transform: translateY(-12px); }
@media (min-width: 1024px) {
  .bp-card:hover .bp-visual { transform: translateY(-18px); }
}
/* Research tile opts out of the hover-lift — its visual is the
   WorldMapLineArt graphic, which sits flush to the bottom of the wide
   banner and shouldn't shift on hover. */
.bp-card--research:hover .bp-visual { transform: none; }
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
  /** Optional audience label shown inside a rounded cut-out notched
   *  into the card's top-right corner, e.g. "For business" /
   *  "For consumer" / "For the curious". */
  audience?: string;
  /** Pill CTA label, e.g. "Learn more", "Try Elio". */
  ctaLabel: string;
  /** Product UI screenshot/graphic anchored to the bottom of the cell.
   *  Optional — omit on tiles that should render text-only (e.g.
   *  Research after the Gdesign tweak that dropped the LGM graphic). */
  visual?: string;
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
    visual: "/ColumbusHomeimg.png",
  },
  {
    cellClass: "bp-card--elio",
    href: "/products/consumer",
    logo: "/MapsGPT-logo.png",
    name: "Elio",
    tagline: "Making maps feel alive again",
    audience: "For consumer",
    ctaLabel: "Learn more",
    visual: "/elio-bento-v3.png",
  },
  {
    cellClass: "bp-card--research",
    href: "/research",
    logo: "/TechnologyPageImages/lgm-globe-icon.png",
    name: "Research",
    tagline: "Building the Large Geospatial Model",
    audience: "For the curious",
    ctaLabel: "Read Thesis",
    visual: "world-map",
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

export function BentoProducts() {
  return (
    <section className="bp-section" aria-label="Our products">
      {/* React 19 hoists these <link> tags into the document head. The
          two bento card backdrops are CSS background-images (so the
          next-image optimizer can't see them); preloading at section
          render starts the fetch immediately on first paint instead of
          waiting for the CSSOM to find the url() — a few-hundred ms
          earlier on a slow connection. */}
      <link rel="preload" as="image" href="/ColumbusBackgroundbento.png" />
      <link rel="preload" as="image" href="/consumer/heroBackground.png" />
      <style>{CSS}</style>
      <div className="bp-bounds">
        <div className="bp-grid">
          {PRODUCTS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className={`bp-card ${p.cellClass}${p.wide ? " bp-card--wide" : ""}`}
            >
              {p.audience && (
                <div className="bp-notch">
                  <span className="bp-notch-label">{p.audience}</span>
                </div>
              )}
              <div className="bp-text-block">
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
                  {p.cellClass === "bp-card--research" ? (
                    <WorldMapLineArt />
                  ) : (
                    /* The CSS sizes the image — width:100%; max-width:720px.
                        We give Next a hint via `sizes` so the optimizer
                        picks an appropriately small AVIF/WebP variant
                        (the source PNGs are 2-3 MB each). */
                    <Image
                      src={p.visual}
                      alt=""
                      aria-hidden
                      width={720}
                      height={520}
                      sizes="(max-width: 1023px) calc(100vw - 56px), 720px"
                      quality={80}
                    />
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
