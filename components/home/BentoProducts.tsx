"use client";

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

/* eslint-disable @next/next/no-img-element */

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

.bp-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .bp-bounds { margin-left: auto; margin-right: auto; }
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

/* Each tile: full-bleed per-product background, hairline border, 13px
   corners. overflow: hidden so the bottom-peeking visual clips at the
   card edge. */
.bp-card {
  position: relative;
  overflow: hidden;
  border: 1px solid #E7E7F1;
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

.bp-card--columbus { background-image: url('/Colbackgroundcard.png'); }
.bp-card--elio     { background-image: url('/eliocardbackground.png'); }
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

/* Top text block — brand row, tagline, CTA stacked. */
.bp-text-block {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  max-width: 30rem;
}
@media (min-width: 1024px) {
  .bp-card--wide .bp-text-block { gap: 22px; max-width: 34rem; }
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
@media (min-width: 1024px) {
  .bp-logo { width: 50px; height: 50px; }
  .bp-card--wide .bp-logo { width: 56px; height: 56px; }
}

.bp-tagline {
  margin: 0;
  font-size: var(--typography--h5);
  line-height: var(--typography--h5--line-height);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: inherit;
  max-width: 28rem;
}
@media (min-width: 1024px) {
  .bp-card--wide .bp-tagline { max-width: 34rem; }
}

/* Signature CTA pill — same pattern as CtaBanner / Careers / ProductCell:
   #1f1f1f surface, white label that swaps to #154ACC on hover, and the
   five-dot blue ArrowDots glyph (#154ACC) that slides 2px to the right
   on hover. Padding + line-height match Careers' "Join our team"
   reference button so every homepage-content CTA renders at the same
   42px height. */
.bp-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background-color: #1f1f1f;
  color: #FFFFFF;
  border-radius: 9999px;
  font-size: var(--typography--p-m);
  line-height: 1;
  font-weight: 500;
  white-space: nowrap;
  transition: color 180ms ease;
}
.bp-cta:hover { color: #154ACC; }
.bp-cta-arrow {
  display: inline-block;
  color: #154ACC;
  transition: transform 180ms ease;
}
.bp-cta:hover .bp-cta-arrow { transform: translateX(2px); }
.bp-cta-arrow svg { display: block; }
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
    href: "/products/enterprise",
    logo: "/logobueno.png",
    logoFilter: COLUMBUS_LOGO_FILTER,
    name: "Columbus",
    tagline: "All-in-one map intelligence platform",
    ctaLabel: "Learn more",
    visual: "/ColumbusHomeimg.png",
  },
  {
    cellClass: "bp-card--elio",
    href: "/elio",
    logo: "/MapsGPT-logo.png",
    name: "Elio",
    tagline: "Making maps feel alive again",
    ctaLabel: "Try Elio",
    visual: "/mapsgptdesktopimg.png",
  },
  {
    cellClass: "bp-card--research",
    href: "/research-applications",
    logo: "/TechnologyPageImages/lgm-globe-icon.png",
    name: "Research",
    tagline: "Building the Large Geospatial Model",
    ctaLabel: "Read Thesis",
    wide: true,
  },
];

/* Signature 5-dot diagonal arrow used by CtaBanner / Careers / ProductCell.
   Circles use currentColor so the wrapping `.bp-cta-arrow` controls the
   fill (set to brand blue #154ACC by default). */
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
      <style>{CSS}</style>
      <div className="bp-bounds">
        <div className="bp-grid">
          {PRODUCTS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className={`bp-card ${p.cellClass}${p.wide ? " bp-card--wide" : ""}`}
            >
              <div className="bp-text-block">
                <div className="bp-brand">
                  <img
                    src={p.logo}
                    alt=""
                    aria-hidden
                    className="bp-logo"
                    style={p.logoFilter ? { filter: p.logoFilter } : undefined}
                  />
                  <span className="bp-name">{p.name}</span>
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
                  <img src={p.visual} alt="" aria-hidden />
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
