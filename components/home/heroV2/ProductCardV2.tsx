"use client";

/* eslint-disable @next/next/no-img-element */

/**
 * V2 product card — generic shell used by Columbus, Elio, and Research.
 *
 * Layout (lg+):
 *   ┌────────────────────────────────────────────────┐
 *   │  [logo] Product name                           │
 *   │                                                │
 *   │  Big headline (tagline)                        │
 *   │  Body paragraph describing the product         │
 *   │                                                │
 *   │  [primary CTA]  [secondary CTA]                │
 *   │                                                │
 *   │                    ┌─────────────────────┐     │
 *   │                    │ product screenshot  │     │
 *   │                    └─────────────────────┘     │
 *   └────────────────────────────────────────────────┘
 *
 * On mobile the screenshot stacks below the text. Each card wears the
 * shared `.cardv2 .cardv2--full` chrome declared in HeroV2.tsx (24 px
 * radius, hairline border, near-full-viewport height).
 *
 * The card surface uses `accent` (defaults to white) so individual
 * products can take on their brand wash (Columbus warm cream, Elio
 * peach, Research dark navy) without redefining the card markup.
 */

import type { ReactNode } from "react";

interface ProductCardV2Props {
  /** Plain-text product name (e.g. "Columbus"). */
  name: string;
  /** Optional logo image rendered to the left of `name`. */
  logo?: string;
  /** Tagline rendered as the card's display H2. */
  tagline: string;
  /** Body paragraph below the tagline. */
  description: string;
  /** Primary CTA (filled). */
  primaryCta: { label: string; href: string };
  /** Optional secondary CTA (outlined). */
  secondaryCta?: { label: string; href: string };
  /** Product screenshot image rendered on the right (or below, on mobile). */
  image: string;
  /** Tone applied to the card surface — light (white card, dark text) or
   *  dark (deep-navy card, light text). Defaults to "light". */
  tone?: "light" | "dark";
  /** Optional warm tint behind the card surface (sampled from
   *  OurProductsSection cell bg). Renders as a subtle wash that doesn't
   *  obscure the text. */
  surfaceTint?: string;
}

const CSS = `
.pcv2-card {
  display: flex;
  flex-direction: column;
  padding: 40px 28px;
  gap: 32px;
}
@media (min-width: 768px)  { .pcv2-card { padding: 56px 48px; gap: 40px; } }
@media (min-width: 1024px) {
  .pcv2-card {
    padding: 80px 80px;
    flex-direction: row;
    align-items: center;
    gap: 64px;
  }
}

.pcv2-text {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 640px;
}
@media (min-width: 1024px) { .pcv2-text { gap: 28px; } }

.pcv2-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: currentColor;
}
.pcv2-eyebrow-logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
  display: block;
}

.pcv2-h2 {
  margin: 0;
  font-size: 32px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 500;
}
@media (min-width: 768px)  { .pcv2-h2 { font-size: 40px; } }
@media (min-width: 1024px) { .pcv2-h2 { font-size: 52px; } }

.pcv2-desc {
  margin: 0;
  font-size: 16px;
  line-height: 1.55;
  max-width: 36rem;
  opacity: 0.78;
}

.pcv2-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.pcv2-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 7px;
  transition: background-color 180ms ease, color 180ms ease;
  white-space: nowrap;
  font-family: inherit;
}
.pcv2-cta--solid {
  background-color: #111111;
  color: #ffffff;
  border: 1px solid #111111;
}
.pcv2-cta--solid:hover { background-color: #1f1f1f; }
.pcv2-cta--ghost {
  background-color: transparent;
  color: currentColor;
  border: 1px solid currentColor;
  opacity: 0.85;
}
.pcv2-cta--ghost:hover { opacity: 1; }

.pcv2-visual {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pcv2-image {
  display: block;
  width: 100%;
  max-width: 640px;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(11, 27, 43, 0.18);
}
@media (min-width: 1024px) { .pcv2-image { max-width: 100%; } }

/* Surface tones */
.pcv2--light { background-color: #ffffff; color: #0B1B2B; }
.pcv2--dark  { background-color: #0B1B2B; color: #F5F7FA; }
.pcv2--dark .pcv2-cta--solid {
  background-color: #ffffff;
  color: #0B1B2B;
  border-color: #ffffff;
}
.pcv2--dark .pcv2-cta--solid:hover { background-color: #f1f3f6; }
`;

export function ProductCardV2({
  name,
  logo,
  tagline,
  description,
  primaryCta,
  secondaryCta,
  image,
  tone = "light",
  surfaceTint,
}: ProductCardV2Props): ReactNode {
  return (
    <section
      className={`cardv2 cardv2--full pcv2-card pcv2--${tone}`}
      aria-label={name}
      style={surfaceTint ? { backgroundColor: surfaceTint } : undefined}
    >
      <style>{CSS}</style>
      <div className="pcv2-text">
        <span className="pcv2-eyebrow">
          {logo && (
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="pcv2-eyebrow-logo"
            />
          )}
          {name}
        </span>
        <h2 className="pcv2-h2">{tagline}</h2>
        <p className="pcv2-desc">{description}</p>
        <div className="pcv2-ctas">
          <a className="pcv2-cta pcv2-cta--solid" href={primaryCta.href}>
            {primaryCta.label}
          </a>
          {secondaryCta && (
            <a className="pcv2-cta pcv2-cta--ghost" href={secondaryCta.href}>
              {secondaryCta.label}
            </a>
          )}
        </div>
      </div>
      <div className="pcv2-visual">
        <img
          src={image}
          alt={`${name} product screenshot`}
          className="pcv2-image"
        />
      </div>
    </section>
  );
}

export default ProductCardV2;
