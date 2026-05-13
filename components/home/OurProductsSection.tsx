"use client"; // only needed on Next.js App Router; harmless / ignored elsewhere

/**
 * "We're all about maps" section — standalone (no Tailwind, no theme tokens, no UI lib).
 * Styles are inlined in a scoped <style> block; class names are prefixed `ops-`.
 * Only dependency: React 18+.
 *
 * Layout:
 *   - centred "We're all about maps" <h2> (bold)
 *   - a 3-column blueprint grid (hairline cells, empty rows above & below)
 *   - each large cell: a soft blue radial glow emanating from the bottom-right
 *     (the layered radial gradient from laraX.html's hero, repositioned), the
 *     product name / one-line description / "Learn more" pinned top-left, and a
 *     white card pinned to the bottom-right (top-left corner rounded 12px, the
 *     other corners square so its right & bottom edges sit flush with the cell)
 *     containing a placeholder UI skeleton.
 *
 * Colours/fonts:
 *   ink #0B1B2B · muted #6F7790 · brand #183FD9 · gridline #E7E7F1 · glow rgb(125,211,252) ("#7dd3fc")
 *   sans "PP Neue Montreal" → Arial · mono "PP Neue Montreal Mono" → system mono (neither bundled)
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ProductCell, type ProductCellProps } from "./ProductCell";

// Columbus uses the same recolour filter as MistxNav so the mark reads
// as the same navy-blue brand colour the navbar shows.
const COLUMBUS_LOGO_FILTER =
  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)";

// Each product overrides the ProductCell defaults to match the original
// per-product glow variants. Elio inherits the defaults (sky-300,
// alphas 0.28 / 0.10 / 0.42, plate 0.275).
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
    // Drops the white card + colored plate; the image sits directly
    // in the cell, anchored to the bottom of its portrait canvas where
    // the point-cloud mountain lives.
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
  padding-top: 96px;
  padding-bottom: 72px;
}
@media (min-width: 1024px) {
  .ops-section { padding-top: 136px; padding-bottom: 96px; }
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

/* scroll reveal */
.ops-reveal {
  transition: transform 700ms ease-out, opacity 700ms ease-out;
  will-change: transform, opacity;
}
.ops-reveal[data-shown="false"] { transform: translateY(24px); opacity: 0; }
.ops-reveal[data-shown="true"]  { transform: none; opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .ops-reveal { transition: none; transform: none; opacity: 1; }
}

.ops-gridwrap { margin-top: 28px; }

/* 3-column blueprint grid */
.ops-grid {
  position: relative;
  width: 100%;
  margin-inline: auto;
  border-left: 1px solid var(--ops-gridline);
}
.ops-grid-inner { display: grid; grid-template-columns: 1fr; }
@media (min-width: 640px)  { .ops-grid-inner { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .ops-grid-inner { grid-template-columns: 1fr 1fr 1fr; } }

/* hairlines on the cell + filler boundaries; cell visuals themselves
   live in ProductCell.tsx */
.ops-cell,
.ops-filler {
  border-bottom: 1px solid var(--ops-gridline);
  border-right: 1px solid var(--ops-gridline);
}
.ops-filler { display: none; min-height: 64px; }
@media (min-width: 640px) { .ops-filler { display: block; } }

/* white fades so the hairlines dissolve into the section bg */
.ops-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 3; }
.ops-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.ops-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }

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
              {/* empty hairline row above */}
              <div className="ops-filler" aria-hidden />
              <div className="ops-filler" aria-hidden />
              <div className="ops-filler" aria-hidden />

              {PRODUCTS.map((p) => (
                <ProductCell key={p.name} className="ops-cell" {...p} />
              ))}

              {/* empty hairline row below */}
              <div className="ops-filler" aria-hidden />
              <div className="ops-filler" aria-hidden />
              <div className="ops-filler" aria-hidden />
            </div>

            <div className="ops-fade ops-fade--top" aria-hidden />
            <div className="ops-fade ops-fade--bottom" aria-hidden />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
