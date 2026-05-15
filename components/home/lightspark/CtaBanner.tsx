"use client";

/**
 * CTA banner — full-width card with the project's signature visual
 * language: white surface, 1px gridline border (matches the cells in
 * OurProductsSection), 7px corner radius (matches the navbar CTAs),
 * and a brand-blue radial glow + radially-masked grid emanating from
 * the bottom edge.
 *
 * Buttons mirror the MistxNav CTA pattern exactly: pill-corner-7
 * dark-on-white primary + transparent-dark secondary, both with the
 * blue dot-arrow icon on the right.
 */

import { type ReactNode } from "react";

interface Cta {
  label: string;
  href: string;
}

interface CtaBannerProps {
  title: ReactNode;
  primaryCta: Cta;
  secondaryCta?: Cta;
}

/** The dot-arrow icon used by every CTA on the site (navbar + Hero). */
function ArrowDots({ className = "" }: { className?: string }) {
  return (
    <svg
      className={"size-3 shrink-0 " + className}
      width="24"
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

const CSS = `
/* Match OurProductsSection's content bounds (1287px / 20px gutters). */
.ctab-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .ctab-bounds { margin-left: auto; margin-right: auto; }
}

.ctab-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-gridline);
  border-radius: 7px;
  background: #ffffff;
  padding: 64px 24px 96px;
  text-align: center;
}
@media (min-width: 768px) {
  .ctab-card { padding: 96px 48px 144px; }
}
@media (min-width: 1024px) {
  .ctab-card { padding: 120px 64px 176px; }
}

/* Sky-blue radial glow emanating from the bottom — matches the glow
   colour used by the cells in OurProductsSection and ColumbusFeatureCell
   (sky-400, rgb(56, 189, 248)). Fills the white surface with a soft
   brand-coloured wash. */
.ctab-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 95% 75% at 50% 100%,
      rgba(56, 189, 248, 0.30) 0%,
      rgba(56, 189, 248, 0.14) 42%,
      transparent 82%
    );
  pointer-events: none;
  z-index: 1;
}

/* 40px sky-blue hairline grid (diamond pattern via ±45° repeating
   lines), radially masked so it's brightest at the bottom-centre and
   dissolves outward — same footprint and colour as the glow so the
   layers visually align (laravel.com pattern). The whole layer is
   pitched forward via perspective + rotateX, with transform-origin at
   the bottom-centre so the bottom edge stays planted and the top
   recedes toward a vanishing point — reads as a floor tilting away
   from the viewer. */
.ctab-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient( 45deg, rgba(56, 189, 248, 0.18) 0 1px, transparent 1px 40px),
    repeating-linear-gradient(-45deg, rgba(56, 189, 248, 0.18) 0 1px, transparent 1px 40px);
  -webkit-mask-image: radial-gradient(ellipse 95% 75% at 50% 100%, #000 0%, transparent 82%);
  mask-image: radial-gradient(ellipse 95% 75% at 50% 100%, #000 0%, transparent 82%);
  transform: perspective(900px) rotateX(55deg);
  transform-origin: 50% 100%;
  pointer-events: none;
  z-index: 2;
}

.ctab-content {
  position: relative;
  z-index: 3;
  max-width: 720px;
  margin: 0 auto;
}

.ctab-ctas {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
`;

export function CtaBanner({ title, primaryCta, secondaryCta }: CtaBannerProps) {
  return (
    <section className="section">
      <style>{CSS}</style>
      <div className="ctab-bounds">
        <div className="ctab-card">
          <div className="ctab-content">
            <h2 className="h2 tracking-tight text-ink">{title}</h2>
            <div className="ctab-ctas">
              <a
                href={primaryCta.href}
                className="group rounded-full px-5 py-2 text-sm flex items-center gap-2 transition-colors bg-[#1f1f1f] text-white hover:text-[#154ACC]"
              >
                {primaryCta.label}
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                  <ArrowDots className="text-[#154ACC]" />
                </span>
              </a>
              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  className="group rounded-full px-5 py-2 text-sm flex items-center gap-2 transition-colors bg-transparent text-[#1f1f1f] hover:text-[#154ACC]"
                >
                  {secondaryCta.label}
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                    <ArrowDots className="text-[#154ACC]" />
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
