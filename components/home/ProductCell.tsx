"use client";

/**
 * ProductCell — the reusable cell pattern from "We're all about maps".
 *
 * Two layout variants:
 *
 *   variant="corner" (default)
 *     - Single cell, soft radial glow from the bottom-right
 *     - Text rail (logo + name + desc + link) pinned top-left
 *     - White card pinned bottom-right with a top-left rounded corner,
 *       sitting on a colored plate that peeks 7-8px out as a thin border
 *       sliver along the card's top & left edges
 *     - Used by OurProductsSection's 3-up grid
 *
 *   variant="split"
 *     - 2-column layout on md+ (text left half, visual right half)
 *     - Text rail vertically centred in the left column
 *     - White card pinned to the bottom of the right column with insets
 *       (24/36/44px), same colored plate + peek behaviour
 *     - Glow spans the full cell width so it reads behind the text too
 *     - Used by ColumbusFeatureCell's stacked feature rows
 *
 * Customization points (all optional):
 *   - glow / glowAlphas / cardBgAlpha — recolour the wash + plate
 *   - minHeight — per-breakpoint cell height (variant-aware defaults)
 *   - card — pass your own mock to replace the default skeleton
 *   - logo — omit for variants/rows that don't show a brand mark
 *   - linkText — defaults to "Learn more"
 *
 * Styling note: <style precedence="default" href="..."> tells React 19
 * to hoist the stylesheet into <head> and de-dupe by href, so rendering
 * N cells only injects the stylesheet once.
 */

import type { CSSProperties, ReactNode } from "react";

interface GlowAlphas {
  /** outer-wash inner alpha */
  a1?: number;
  /** outer-wash mid alpha */
  a2?: number;
  /** inner-glow alpha */
  a3?: number;
}

interface MinHeight {
  /** mobile, px */
  base?: number;
  /** ≥640px, px */
  sm?: number;
  /** ≥1024px, px */
  lg?: number;
}

export type ProductCellVariant = "corner" | "split";

export interface ProductCellProps {
  name: string;
  desc: string;
  href: string;
  /** Optional logo — omit on rows that don't carry a brand mark (e.g. CFC features). */
  logo?: string;
  logoAlt?: string;
  logoFilter?: string;
  linkText?: string;

  /** rgb triplet, e.g. "125, 211, 252". Default: sky-300. */
  glow?: string;
  glowAlphas?: GlowAlphas;
  /** alpha for the colored plate behind the white card. */
  cardBgAlpha?: number;

  minHeight?: MinHeight;

  /** Content of the white card. Defaults to the 1-square + 6-lines skeleton. */
  card?: ReactNode;

  /** When provided (split variant only), replaces the entire right-column
   *  content — both the colored plate and the white card. Use this when
   *  the row needs a fully custom visual (e.g. an image-backed panel with
   *  an overlay) instead of the default plate-behind-skeleton pattern. */
  visual?: ReactNode;

  /** When provided, drops the colored plate + white card entirely and
   *  renders this image directly inside the cell, filling the same area
   *  the card would have occupied. The text head still floats on top. */
  bgImage?: {
    src: string;
    /** Override the default `top left` crop anchor when the image's
     *  meaningful content isn't in the top-left of its canvas. */
    objectPosition?: string;
  };

  variant?: ProductCellVariant;
  className?: string;
}

const DEFAULT_GLOW = "125, 211, 252"; // sky-300

// Variant-specific defaults. Corner mirrors OurProductsSection's Elio
// cell; split mirrors ColumbusFeatureCell's lighter wash (wider rows
// need lower alpha to avoid overpowering the text).
const VARIANT_DEFAULTS = {
  corner: {
    a1: 0.28, a2: 0.10, a3: 0.42,
    cardBgAlpha: 0.275,
    minH: { base: 340, sm: 420, lg: 480 },
  },
  split: {
    a1: 0.14, a2: 0.05, a3: 0.21,
    cardBgAlpha: 0.22,
    minH: { base: 440, sm: 480, lg: 560 },
  },
} as const;

const CSS = `
.pc-cell {
  --pc-skel: #F0F1F4;
  --pc-sans: var(--font-sans, "Ppneuemontreal", "PP Neue Montreal", Arial, sans-serif);
  --pc-mono: var(--font-mono, "Ppneuemontrealmono", "PP Neue Montreal Mono", ui-monospace, monospace);

  position: relative;
  overflow: hidden;
  min-height: var(--pc-minh, 340px);
  background-color: #ffffff;
  font-family: var(--pc-sans);
}
@media (min-width: 640px)  { .pc-cell { min-height: var(--pc-minh-sm, 420px); } }
@media (min-width: 1024px) { .pc-cell { min-height: var(--pc-minh-lg, 480px); } }

/* corner: V2.1 hover model on every corner cell.
   Default state: per-product radial glow is HIDDEN (::before opacity 0)
   so the bare cell surface (white for Columbus/Elio's photo-bg cards,
   point-cloud image for Research's bgImage) reads clean on first paint.
   Hover state: the glow FADES IN to opacity 1 over 280ms ease-out.
   For Research the glow is raised above the bgImage via :has() since
   the bgImage sits at z-index 1. */
.pc-cell--corner { cursor: pointer; }
.pc-cell--corner::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    radial-gradient(200% 135% at 100% 100%, rgba(var(--pc-glow), var(--pc-a1)), rgba(var(--pc-glow), var(--pc-a2)) 48%, transparent 76%),
    radial-gradient(115% 68% at 100% 100%, rgba(var(--pc-glow), var(--pc-a3)), transparent 58%);
  opacity: 0;
  transition: opacity 280ms ease-out;
}
.pc-cell--corner:hover::before { opacity: 1; }
.pc-cell--corner:has(.pc-bg-img)::before { z-index: 2; }
@media (prefers-reduced-motion: reduce) {
  .pc-cell--corner::before { transition: none; }
}

/* split: gentler glow tuned for a wide 2-column row — sizes smaller in
   percentage terms because the row is much wider than a corner cell */
.pc-cell--split {
  background-image:
    radial-gradient(160% 130% at 100% 100%, rgba(var(--pc-glow), var(--pc-a1)), rgba(var(--pc-glow), var(--pc-a2)) 48%, transparent 76%),
    radial-gradient(95% 65% at 100% 100%, rgba(var(--pc-glow), var(--pc-a3)), transparent 58%);
}
.pc-cell--split {
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) {
  .pc-cell--split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

/* ── text head ─────────────────────────────────────────────────────── */

.pc-cell-head {
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
}

/* corner: pinned top-left, compact padding */
.pc-cell--corner .pc-cell-head {
  position: absolute;
  top: 0; left: 0;
  padding: 28px;
}
@media (min-width: 1024px) {
  .pc-cell--corner .pc-cell-head { padding: 36px; }
}

/* split: lives in the left grid column, vertically centred, large padding */
.pc-cell--split .pc-cell-head {
  position: relative;
  justify-content: center;
  padding: 48px 28px;
}
@media (min-width: 768px) {
  .pc-cell--split .pc-cell-head { padding: 64px 36px; }
}
@media (min-width: 1024px) {
  .pc-cell--split .pc-cell-head { padding: 88px 44px; }
}

.pc-cell-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pc-cell-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex: 0 0 auto;
  display: block;
}
@media (min-width: 1024px) { .pc-cell-logo { width: 36px; height: 36px; } }

.pc-cell-name {
  margin: 0;
  font-size: var(--typography--h4);
  line-height: var(--typography--h4--line-height);
  font-weight: 500;
  color: var(--color-ink, #0B1B2B);
}

.pc-cell-desc {
  margin: 16px 0 0;
  font-size: var(--typography--p-l);
  line-height: var(--typography--p-l--line-height);
  color: var(--color-ink, #0B1B2B);
}
/* split desc reads as a longer body lead — muted, max-width to keep
   the line length comfortable in wider cells */
.pc-cell--split .pc-cell-desc {
  max-width: 36rem;
  color: var(--color-muted, #6F7790);
}

.pc-cell-link {
  margin-top: 18px;
  font-family: var(--pc-mono);
  font-size: var(--typography--p-m);
  line-height: var(--typography--p-m--line-height);
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--color-brand, #183FD9);
  text-decoration: none;
}
.pc-cell-link:hover { text-decoration: underline; }

/* split link drops the mono family / tracking and goes a touch bolder
   so it carries weight in the more open left rail */
.pc-cell--split .pc-cell-link {
  margin-top: 24px;
  align-self: flex-start;
  font-family: var(--pc-sans);
  font-weight: 600;
  letter-spacing: 0;
}

/* ── card + plate ──────────────────────────────────────────────────── */

/* split wraps card + plate in a right-column container so they
   position relative to the right half (not the full row) */
.pc-visual {
  position: relative;
  min-height: 320px;
}
@media (min-width: 768px) {
  .pc-visual { min-height: 0; }
}

.pc-card-bg {
  position: absolute;
  z-index: 1;
  background: rgba(var(--pc-glow), var(--pc-cardbg-a));
  border: 1px solid #ffffff;
  border-radius: 16px 0 0 0;
  box-sizing: border-box;
}
.pc-card {
  position: absolute;
  z-index: 2;
  background: #ffffff;
  border-radius: 12px 0 0 0;
  overflow: hidden;
  display: flex;
  gap: 16px;
  padding: 22px;
  box-sizing: border-box;
}
@media (min-width: 1024px) {
  .pc-card { padding: 26px; gap: 20px; }
}

/* corner: card flush to the cell's right & bottom edges. Card left
   matches the .pc-cell-head padding (28px / 36px) so the card's left
   edge aligns vertically with the text-rail's left edge. */
.pc-cell--corner .pc-card-bg {
  right: 0; bottom: 0;
  left: calc(28px - 7px); top: calc(44% - 7px);
}
@media (min-width: 1024px) {
  .pc-cell--corner .pc-card-bg { left: calc(36px - 8px); top: calc(46% - 8px); }
}
.pc-cell--corner .pc-card {
  right: 0; bottom: 0;
  left: 28px; top: 44%;
}
@media (min-width: 1024px) {
  .pc-cell--corner .pc-card { left: 36px; top: 46%; }
}

/* V2.1 edge-fade: a ::after overlay sits on top of the card AND the
   plate, painting two linear gradients along the right + bottom
   edges (transparent at 0–70%, opaque --pc-fade-color by 85%). The
   end colour is a CSS variable so each cell can override it to match
   its own backdrop — defaults to #ffffff (the V2.1 white surface);
   .ops-cell--columbus / .ops-cell--elio set it to their photo-bg
   tone so the card edges dissolve into the photo instead of into
   a white sliver. On hover the overlay's opacity transitions to 0
   over 280ms ease-out, so the edges sharpen up at the same time the
   radial glow fades in. */
.pc-cell--corner .pc-card::after,
.pc-cell--corner .pc-card-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, transparent 0%, transparent 60%, var(--pc-fade-color, #ffffff) 95%),
    linear-gradient(to bottom, transparent 0%, transparent 60%, var(--pc-fade-color, #ffffff) 95%);
  transition: opacity 280ms ease-out;
}
.pc-cell--corner:hover .pc-card::after,
.pc-cell--corner:hover .pc-card-bg::after {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .pc-cell--corner .pc-card::after,
  .pc-cell--corner .pc-card-bg::after { transition: none; }
}

/* split: card sits at the bottom of the right column, inset 24-44px
   from the column's right / left / bottom edges */
.pc-cell--split .pc-card-bg {
  right: 24px; bottom: 24px;
  left: calc(24px - 7px); top: calc(20% - 7px);
}
@media (min-width: 768px) {
  .pc-cell--split .pc-card-bg { right: 36px; bottom: 36px; left: calc(36px - 7px); top: calc(28% - 7px); }
}
@media (min-width: 1024px) {
  .pc-cell--split .pc-card-bg { right: 44px; bottom: 44px; left: calc(44px - 8px); top: calc(26% - 8px); }
}
.pc-cell--split .pc-card {
  right: 24px; bottom: 24px;
  left: 24px; top: 20%;
}
@media (min-width: 768px) {
  .pc-cell--split .pc-card { right: 36px; bottom: 36px; left: 36px; top: 28%; padding: 24px; }
}
@media (min-width: 1024px) {
  .pc-cell--split .pc-card { right: 44px; bottom: 44px; left: 44px; top: 26%; padding: 28px; }
}

/* ── bgImage variant: no plate, no card — image sits directly in
   the cell, filling the same footprint the card would have. ────── */
.pc-bg-img {
  position: absolute;
  display: block;
  object-fit: cover;
  object-position: top left;
  z-index: 1;
  pointer-events: none;
}
.pc-cell--corner .pc-bg-img {
  inset: 0;
  width: auto; height: auto;
}
.pc-cell--split .pc-bg-img {
  right: 24px; bottom: 24px;
  left: 24px; top: 20%;
  width: auto; height: auto;
}
@media (min-width: 768px) {
  .pc-cell--split .pc-bg-img { right: 36px; bottom: 36px; left: 36px; top: 28%; }
}
@media (min-width: 1024px) {
  .pc-cell--split .pc-bg-img { right: 44px; bottom: 44px; left: 44px; top: 26%; }
}

/* ── default skeleton ──────────────────────────────────────────────── */
.pc-skel-sq { flex: 0 0 36%; align-self: stretch; border-radius: 8px; background: var(--pc-skel); }
.pc-skel-lines { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 11px; }
@media (min-width: 1024px) { .pc-skel-lines { gap: 13px; } }
.pc-skel-line { height: 12px; border-radius: 4px; background: var(--pc-skel); }
.pc-skel-line:last-child { width: 58%; }
`;

function DefaultSkeleton() {
  return (
    <>
      <div className="pc-skel-sq" />
      <div className="pc-skel-lines">
        <div className="pc-skel-line" />
        <div className="pc-skel-line" />
        <div className="pc-skel-line" />
        <div className="pc-skel-line" />
        <div className="pc-skel-line" />
        <div className="pc-skel-line" />
      </div>
    </>
  );
}

export function ProductCell({
  name,
  desc,
  href,
  logo,
  logoAlt = "",
  logoFilter,
  linkText = "Learn more",
  glow = DEFAULT_GLOW,
  glowAlphas,
  cardBgAlpha,
  minHeight,
  card,
  visual,
  bgImage,
  variant = "corner",
  className = "",
}: ProductCellProps) {
  const defaults = VARIANT_DEFAULTS[variant];
  const a1 = glowAlphas?.a1 ?? defaults.a1;
  const a2 = glowAlphas?.a2 ?? defaults.a2;
  const a3 = glowAlphas?.a3 ?? defaults.a3;
  const plateAlpha = cardBgAlpha ?? defaults.cardBgAlpha;

  const minH = minHeight?.base ?? defaults.minH.base;
  const minHSm = minHeight?.sm ?? defaults.minH.sm;
  const minHLg = minHeight?.lg ?? defaults.minH.lg;

  const cssVars = {
    "--pc-glow": glow,
    "--pc-a1": a1,
    "--pc-a2": a2,
    "--pc-a3": a3,
    "--pc-cardbg-a": plateAlpha,
    "--pc-minh": `${minH}px`,
    "--pc-minh-sm": `${minHSm}px`,
    "--pc-minh-lg": `${minHLg}px`,
  } as CSSProperties;

  const head = (
    <div className="pc-cell-head">
      <div className="pc-cell-title">
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={logoAlt}
            aria-hidden={logoAlt === ""}
            className="pc-cell-logo"
            style={logoFilter ? { filter: logoFilter } : undefined}
          />
        )}
        <h3 className="pc-cell-name">{name}</h3>
      </div>
      <p className="pc-cell-desc">{desc}</p>
      <a className="pc-cell-link" href={href}>
        {linkText}
      </a>
    </div>
  );

  const plate = <div className="pc-card-bg" aria-hidden />;
  const cardEl = (
    <div className="pc-card" aria-hidden={card === undefined}>
      {card ?? <DefaultSkeleton />}
    </div>
  );
  const bgImg = bgImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={bgImage.src}
      alt=""
      aria-hidden
      className="pc-bg-img"
      style={bgImage.objectPosition ? { objectPosition: bgImage.objectPosition } : undefined}
    />
  ) : null;

  return (
    <>
      <style precedence="default" href="product-cell-styles">{CSS}</style>
      <div
        className={`pc-cell pc-cell--${variant} ${className}`.trim()}
        style={cssVars}
      >
        {head}
        {variant === "split" ? (
          <div className="pc-visual">
            {bgImg ?? visual ?? (
              <>
                {plate}
                {cardEl}
              </>
            )}
          </div>
        ) : (
          bgImg ?? (
            <>
              {plate}
              {cardEl}
            </>
          )
        )}
      </div>
    </>
  );
}

export default ProductCell;
