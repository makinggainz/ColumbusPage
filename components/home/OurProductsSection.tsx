"use client"; // only needed on Next.js App Router; harmless / ignored elsewhere

/**
 * "We're all about maps" section — standalone (no Tailwind, no theme tokens, no UI lib).
 * Styles are inlined in a scoped <style> block; class names are prefixed `ops-`.
 * Only dependency: React 18+.
 *
 * Layout:
 *   - centred "We're all about maps" <h2> (bold)
 *   - a 3-up grid of self-contained product cards (1px gridline border,
 *     7px corners) — mirrors the contained-card pattern used by CtaBanner
 *     ("No GIS experience..." block). No extending hairlines or fade overlays.
 *   - each card uses ProductCell with its original per-product blue
 *     radial wash + plate (sky-400 for Columbus, sky-300 for Elio,
 *     charcoal for Research).
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ProductCell, type ProductCellProps } from "./ProductCell";

// Columbus uses the same recolour filter as MistxNav so the mark reads
// as the same navy-blue brand colour the navbar shows.
const COLUMBUS_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)";

// Each product keeps its original cell-level radial wash + plate
// (restored after V2 zeroed them out). Elio inherits the ProductCell
// corner defaults (sky-300, alphas 0.28 / 0.10 / 0.42, plate 0.275).
const PRODUCTS: ProductCellProps[] = [
  {
    name: "Columbus",
    desc: "An agentic GIS platform for professionals",
    href: "#",
    logo: "/logobueno.png",
    logoFilter: COLUMBUS_LOGO_FILTER,
    // sky-400, slightly darker than the default sky-300. Plate drops
    // to 0.18 because the darker hue reads heavier at the same alpha.
    glow: "56, 189, 248",
    cardBgAlpha: 0.18,
    className: "ops-cell--columbus",
    card: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/ColumbusHomeimg.png"
        alt=""
        aria-hidden
        className="ops-product-img"
      />
    ),
  },
  {
    name: "Elio",
    desc: "Smart and social maps",
    href: "#",
    logo: "/MapsGPT-logo.png",
    className: "ops-cell--elio",
    card: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/mapsgptdesktopimg.png"
        alt=""
        aria-hidden
        className="ops-product-img"
      />
    ),
  },
  {
    name: "Research",
    desc: "Our jurney to the Large Geospacial Model",
    href: "#",
    logo: "/TechnologyPageImages/lgm-globe-icon.png",
    // charcoal matching the LGM globe line-art (#0B1B2B). Heavier
    // than sky-blue, so all alphas drop to keep the cell airy.
    glow: "11, 27, 43",
    glowAlphas: { a1: 0.09, a2: 0.03, a3: 0.14 },
    cardBgAlpha: 0.06,
    // Drops the white card + colored plate; the point-cloud mountain
    // image sits directly in the cell, anchored to the bottom of its
    // portrait canvas where the meaningful content lives. The text
    // head (logo + name + desc + Learn more) still floats on top via
    // .pc-cell-head's z-index: 2 over .pc-bg-img's z-index: 1.
    bgImage: {
      src: "/Researchimg.png",
      objectPosition: "center bottom",
    },
  },
];

const CSS = `
.ops-section {
  --ops-surface: #ffffff;
  --ops-ink: #0B1B2B;
  --ops-muted: #6F7790;
  --ops-brand: #183FD9;
  --ops-gridline: #E7E7F1;
  --ops-skel: #F0F1F4;
  --ops-sans: "Ppneuemontreal", "PP Neue Montreal", Arial, "Helvetica Neue", Helvetica, ui-sans-serif, system-ui, sans-serif;
  --ops-mono: "Ppneuemontrealmono", "PP Neue Montreal Mono", ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Courier New", monospace;

  background: var(--ops-surface);
  color: var(--ops-ink);
  font-family: var(--ops-sans);
  -webkit-font-smoothing: antialiased;
  /* design-system section rhythm: py-20 → py-28 (matches .section in
     app/globals.css). Symmetric top/bottom so the gap to neighbouring
     sections reads the same on both sides. */
  padding-top: 80px;
  padding-bottom: 80px;
}
@media (min-width: 1024px) {
  .ops-section { padding-top: 112px; padding-bottom: 112px; }
}

.ops-container {
  /* match ColumbusPage's content bounds (its sections use max-w-[1287px] mx-5 md:mx-auto) */
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .ops-container { margin-left: auto; margin-right: auto; }
}

/* scroll reveal — opacity fade only, no upward movement. */
.ops-reveal {
  transition: opacity 700ms ease-out;
  will-change: opacity;
}
.ops-reveal[data-shown="false"] { opacity: 0; }
.ops-reveal[data-shown="true"]  { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .ops-reveal { transition: none; opacity: 1; }
}

/* title → content rhythm matching DatasetsCarousel (56 → 80px) so
   adjacent sections share the same h2-to-content gap. */
.ops-gridwrap { margin-top: 56px; }
@media (min-width: 1024px) { .ops-gridwrap { margin-top: 80px; } }

/* 3-up grid of self-contained cards — matches the contained-card
   pattern used by CtaBanner ("No GIS experience..." block). No
   extending hairlines, no fade overlays, no shared cell borders. */
.ops-grid {
  position: relative;
  width: 100%;
  margin-inline: auto;
}
.ops-grid-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px)  { .ops-grid-inner { grid-template-columns: 1fr 1fr; gap: 20px; } }
@media (min-width: 1024px) { .ops-grid-inner { grid-template-columns: 1fr 1fr 1fr; gap: 24px; } }

/* each cell is a contained card: 1px gridline border + 7px corners */
.ops-cell {
  border: 1px solid var(--ops-gridline);
  border-radius: 7px;
  overflow: hidden;
}

/* Columbus + Elio cells use a full-bleed photo background instead of
   the bare white surface. The image sits behind ProductCell's radial
   wash (which lives on a ::before pseudo) and behind the text head +
   card + plate, so it reads as the cell's backdrop. */
.ops-cell--columbus {
  background-image: url("/Colbackgroundcard.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.ops-cell--elio {
  background-image: url("/eliobackground.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* product image (drops into ProductCell's .pc-card in place of the
   default skeleton). Top + left edges are flush with the card edges;
   the image scales to fill the card via object-fit: cover. The card's
   default 22-26px padding is neutralised via :has() so nothing offsets
   the image from the card's borders. */
.pc-card:has(> .ops-product-img) {
  padding: 0;
}
.ops-product-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top left;
}
`;

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Reading an external system (matchMedia) to decide initial state — intentional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`ops-reveal ${className}`} data-shown={shown}>
      {children}
    </div>
  );
}

export default function OurProductsSection() {
  return (
    <section id="products" className="ops-section">
      <style>{CSS}</style>
      <div className="ops-container">
        <Reveal>
          <h2 className="h2 mx-auto max-w-lg text-center text-ink">We&rsquo;re all about maps</h2>
        </Reveal>

        <Reveal className="ops-gridwrap">
          <div className="ops-grid">
            <div className="ops-grid-inner">
              {PRODUCTS.map((p) => (
                <ProductCell
                  key={p.name}
                  {...p}
                  className={`ops-cell ${p.className ?? ""}`.trim()}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
