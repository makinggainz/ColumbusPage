"use client";

/**
 * Featured + 2-stacked bento grid for the homepage product lineup.
 *
 * Layout mirrors the most common modern landing-page bento pattern
 * (Linear, Vercel, Apple, Stripe — see Mobbin reference set, 2026):
 * one large "featured" tile takes the left ~58% of the row at full
 * grid height; two smaller tiles stack on the right. On mobile all
 * three collapse into a single column (Columbus → Elio → Research).
 *
 * Each tile is a self-contained card: 1px hairline border, 7px corners
 * (design-system shape token), full-bleed per-product background image
 * with a bottom-aligned scrim so the title + tagline read cleanly.
 *
 * Replaces the older 3-up OurProductsSection.
 */

/* eslint-disable @next/next/no-img-element */

/* Recolour filter matching MistxNav so the Columbus mark renders in the
   same navy blue everywhere it appears on the site. */
const COLUMBUS_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)";

const CSS = `
.bp-section {
  background: #FFFFFF;
  /* matches the project section rhythm (py-20 → py-28). No top padding
     here — the section directly above (TextScrollIntro) already supplies
     its own bottom padding. */
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

/* Grid: 1-col mobile (each tile = 1 row). 2-col desktop with the
   featured tile spanning both rows of the right-hand column track. */
.bp-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 1024px) {
  .bp-grid {
    grid-template-columns: 1.4fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 20px;
  }
}

/* Each tile is a self-contained card. The per-product background image
   is set on the cell itself; a bottom-aligned scrim (.bp-card::after)
   keeps the title + tagline legible across every photo theme. */
.bp-card {
  position: relative;
  overflow: hidden;
  border: 1px solid #E7E7F1;
  border-radius: 7px;
  background-color: #FFFFFF;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 24px;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #0B1B2B;
  /* Fixed (not min-) height per breakpoint so the natural size of the
     centered product image can't push the cell taller. Values mirror
     the original OurProductsSection ProductCell defaults (340 / 420 /
     480). The visual region below uses flex-basis: 0 + min-height: 0
     so the image shrinks to fit whatever space is left after the
     top-left brand mark + bottom-aligned title block. */
  height: 340px;
}
@media (min-width: 640px) {
  .bp-card { height: 420px; }
}
@media (min-width: 1024px) {
  .bp-card { padding: 32px; height: 480px; }
}

/* Featured tile spans both rows of the right-hand column track on
   desktop (i.e. fills the whole left column). At lg+ its height
   equals 2 × secondary tile height + the row gap, so the two columns
   bottom-align without leftover space. */
.bp-card--featured { height: 340px; }
@media (min-width: 640px)  { .bp-card--featured { height: 420px; } }
@media (min-width: 1024px) {
  .bp-card--featured {
    grid-row: span 2;
    padding: 40px;
    height: calc(480px * 2 + 20px);
  }
}

.bp-card--columbus { background-image: url('/Colbackgroundcard.png'); }
.bp-card--elio     { background-image: url('/eliocardbackground.png'); }
.bp-card--research {
  background-image: url('/Researchimg.png');
  background-position: center bottom;
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.18);
}

/* Bottom-aligned readability scrim — fades from transparent at the top
   to a translucent surface at the bottom where the text sits. The dark
   Research tile gets a navy-tinted scrim instead of a white one. */
.bp-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.0) 35%, rgba(255,255,255,0.78) 100%);
  pointer-events: none;
  z-index: 0;
}
.bp-card--research::after {
  background: linear-gradient(180deg, rgba(11,27,43,0.0) 25%, rgba(11,27,43,0.72) 100%);
}
.bp-card > * { position: relative; z-index: 1; }

/* Top-left meta row: logo + product name. Larger than a chip — reads
   as the brand mark for the tile. */
.bp-meta-row {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: inherit;
}
@media (min-width: 1024px) {
  .bp-card--featured .bp-meta-row { gap: 16px; font-size: 24px; }
}
.bp-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex: 0 0 auto;
}
@media (min-width: 1024px) {
  .bp-card--featured .bp-logo { width: 44px; height: 44px; }
}

/* Centered product visual. flex-basis: 0 + min-height: 0 lets the
   region shrink and grow with the leftover space inside the cell —
   without those, the image's natural height would push the card
   taller than its declared height. */
.bp-visual {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  overflow: hidden;
}
.bp-visual img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 7px;
  box-shadow: 0 12px 32px rgba(11, 27, 43, 0.12);
  border: 1px solid rgba(11, 27, 43, 0.06);
  background-color: #FFFFFF;
}
.bp-card--research .bp-visual img {
  background-color: transparent;
  border-color: rgba(255, 255, 255, 0.14);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.32);
}

/* Bottom content block: title (display) + tagline (body). Constrained
   max-width so long lines don't run past the natural reading column. */
.bp-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 32rem;
}
.bp-title {
  margin: 0;
  font-size: 22px;
  line-height: 1.14;
  letter-spacing: -0.02em;
  font-weight: 500;
  color: inherit;
}
@media (min-width: 768px) {
  .bp-title { font-size: 26px; }
}
@media (min-width: 1024px) {
  .bp-card--featured .bp-title { font-size: 38px; line-height: 1.06; }
  .bp-title { font-size: 24px; }
}
.bp-tagline {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: inherit;
  opacity: 0.72;
  max-width: 28rem;
}
@media (min-width: 1024px) {
  .bp-card--featured .bp-tagline { font-size: 15px; max-width: 32rem; }
}
`;

interface Product {
  cellClass: string;
  href: string;
  logo: string;
  logoFilter?: string;
  name: string;
  title: string;
  tagline: string;
  featured?: boolean;
  /** Centered product visual — the screenshot/graphic that sits between
   *  the top-left brand mark and the bottom-aligned title block. */
  visual: string;
}

const PRODUCTS: Product[] = [
  {
    cellClass: "bp-card--columbus",
    href: "/products/enterprise",
    logo: "/logobueno.png",
    logoFilter: COLUMBUS_LOGO_FILTER,
    name: "Columbus",
    title: "The agentic GIS platform for professionals.",
    tagline:
      "Query, generate, and reason over any location on Earth in plain English.",
    featured: true,
    visual: "/ColumbusHomeimg.png",
  },
  {
    cellClass: "bp-card--elio",
    href: "/elio",
    logo: "/MapsGPT-logo.png",
    name: "Elio",
    title: "Smart, social maps for every spot on your list.",
    tagline:
      "Find your next anything — ranked by vibe, value, and time of day.",
    visual: "/mapsgptdesktopimg.png",
  },
  {
    cellClass: "bp-card--research",
    href: "/research-applications",
    logo: "/TechnologyPageImages/lgm-globe-icon.png",
    name: "Research",
    title: "Our journey to the Large Geospatial Model.",
    tagline:
      "Open research on geospatial foundation models and terrain reasoning.",
    visual: "/TechnologyPageImages/LGMsummaryGraphic.png",
  },
];

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
              className={`bp-card ${p.cellClass}${p.featured ? " bp-card--featured" : ""}`}
            >
              <div className="bp-meta-row">
                <img
                  src={p.logo}
                  alt=""
                  aria-hidden
                  className="bp-logo"
                  style={p.logoFilter ? { filter: p.logoFilter } : undefined}
                />
                {p.name}
              </div>
              <div className="bp-visual">
                <img src={p.visual} alt="" aria-hidden />
              </div>
              <div className="bp-content">
                <h3 className="bp-title">{p.title}</h3>
                <p className="bp-tagline">{p.tagline}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BentoProducts;
