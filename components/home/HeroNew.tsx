"use client";

/* eslint-disable @next/next/no-img-element */

/**
 * Mapbox / Foursquare-style homepage hero — replaces the legacy WebGL
 * boat hero in app/page.tsx. Self-contained: one file, scoped <style>
 * block, no globals.css edits, no shared dependencies beyond the public
 * image assets it references.
 *
 * Structure (top → bottom):
 *   1. Header — 2-column at lg+: large H1 left, body lede right.
 *   2. CTAs — solid black "Sign up" + outlined "Contact sales" pills.
 *   3. Showcase card (dark forest green, rounded) — interactive carousel:
 *        - top-left:  3 tab pills (Columbus / Elio / Research)
 *        - top-right: slide title + tagline (changes with active tab)
 *        - centre:    product screenshot
 *        - L/R edges: circular arrow buttons (prev / next with wrap)
 *        - bottom:    "N of 3" indicator + slide description
 *   4. Category pills — Data & Maps / Developer APIs / Location
 *      Intelligence / Mobile SDKs / Enterprise (one active).
 *   5. Floating "Sign up" FAB — fixed bottom-right; fades in after the
 *      in-section CTA scrolls out of view.
 *
 * All state local (useState). No auto-rotate; tabs + arrows both wired
 * to the same `slide` index with circular wrap-around.
 */

import { useEffect, useRef, useState } from "react";

interface Tab {
  label: string;
  logo: string;
  /** Showcase-card background image for this slide. Sourced from
   *  OurProductsSection's "We're all about maps" cells so the per-product
   *  imagery is consistent across the page. */
  bg: string;
}

interface Slide {
  title: string;
  tagline: string;
  description: string;
}

const TABS: Tab[] = [
  {
    label: "Columbus",
    logo: "/logobueno.png",
    bg: "/Colbackgroundcard.png",
  },
  {
    label: "Elio",
    logo: "/MapsGPT-logo.png",
    bg: "/eliocardbackground.png",
  },
  {
    label: "Research",
    logo: "/TechnologyPageImages/lgm-globe-icon.png",
    bg: "/Researchimg.png",
  },
];

/** Auto-rotate duration per slide. Must match the CSS `hn-tab-fill`
 *  animation duration (3000ms) so the fill completes right when the
 *  slide auto-advances. */
const SLIDE_INTERVAL_MS = 3000;

const SLIDES: Slide[] = [
  {
    title: "Columbus",
    tagline: "The agentic GIS platform for professionals.",
    description:
      "Query, generate, and reason over any location on Earth in plain English.",
  },
  {
    title: "Elio",
    tagline: "Smart, social maps for every spot on your list.",
    description:
      "Find your next anything — ranked by vibe, crowd, value, and time of day.",
  },
  {
    title: "Research",
    tagline: "Our journey to the Large Geospatial Model.",
    description:
      "Open research on geospatial foundation models, point clouds, and terrain reasoning.",
  },
];

const HN_CSS = `
.hn-section {
  position: relative;
  background-color: #FDFCFC;
  /* Top breathing room accounts for the fixed navbar; bottom rhythm
     matches the .section pattern used elsewhere on the page. */
  padding-top: 120px;
  padding-bottom: 80px;
  color: #0B1B2B;
  font-family: var(--font-sans, "Ppneuemontreal", "PP Neue Montreal", Arial, sans-serif);
}
@media (min-width: 768px) {
  .hn-section { padding-top: 140px; padding-bottom: 112px; }
}

.hn-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .hn-bounds { margin-left: auto; margin-right: auto; padding-left: 32px; padding-right: 32px; }
}

/* ─── Header: H1 left + lede right ─────────────────────────────────────── */
.hn-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (min-width: 1024px) {
  .hn-header {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    column-gap: 64px;
    align-items: start;
  }
}

.hn-h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 500;
  color: #0B1B2B;
}
@media (min-width: 768px)  { .hn-h1 { font-size: 40px; } }
@media (min-width: 1024px) { .hn-h1 { font-size: 52px; } }

.hn-lede {
  margin: 0;
  font-size: 16px;
  line-height: 1.55;
  color: #4B5563;
  max-width: 36rem;
}
@media (min-width: 1024px) {
  /* Right-column lede sits flush with the visual baseline of the H1
     rather than its top — small top offset keeps the two columns feeling
     paired but the lede slightly settled into the row. */
  .hn-lede { padding-top: 12px; }
}

/* ─── CTAs ─────────────────────────────────────────────────────────────── */
.hn-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
@media (min-width: 1024px) { .hn-ctas { margin-top: 36px; } }

.hn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  /* 7px corners match the navbar's "Contact" + "Try Elio" CTAs
     (rounded-[7px]) — keeps the in-section CTAs visually paired with
     the nav buttons above. */
  border-radius: 7px;
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
  white-space: nowrap;
}
.hn-cta--solid {
  background-color: #111111;
  color: #ffffff;
  border: 1px solid #111111;
}
.hn-cta--solid:hover { background-color: #1f1f1f; }
.hn-cta--ghost {
  background-color: #ffffff;
  color: #111111;
  border: 1px solid #E5E7EB;
}
.hn-cta--ghost:hover { background-color: #F3F4F6; }

/* ─── Showcase card ───────────────────────────────────────────────────
   Background image is sourced from the matching OurProductsSection
   "We're all about maps" cell for the currently active slide — Columbus
   uses /Colbackgroundcard.png, Elio uses /eliocardbackground.png,
   Research uses /Researchimg.png. The image is set inline per render
   via the JSX backgroundImage style on .hn-showcase so it updates in
   sync with the slide state. A subtle dark wash over the image keeps
   the tab pills + meta text legible across all three product themes
   (Columbus is warm cream, Elio is peach, Research is dark navy). */
.hn-showcase {
  position: relative;
  margin-top: 48px;
  background-color: #FFFFFF;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 24px;
  padding: 24px 20px 28px;
  /* Dark text by default — the per-slide bg images (Colbackgroundcard /
     eliocardbackground / Researchimg) are warm cream / peach / dark navy.
     Dark ink keeps the tabs + meta legible on the cream + peach slides;
     Research's darker bg may need a per-slide tweak later. */
  color: #0B1B2B;
  overflow: hidden;
  transition: background-image 200ms ease;
  /* Fixed-height flex column. Top header (tabs + meta) + bottom footer
     (pagination + caption) take their natural height; the product image
     in the middle flex-fills the remaining space with object-fit: contain
     so different aspect-ratio screenshots don't resize the card. */
  display: flex;
  flex-direction: column;
  height: 480px;
}
@media (min-width: 768px) {
  .hn-showcase { margin-top: 64px; padding: 32px 32px 36px; height: 580px; }
}
@media (min-width: 1024px) {
  .hn-showcase { margin-top: 72px; padding: 36px 48px 44px; height: 640px; }
}

.hn-showcase > * { position: relative; z-index: 1; }
.hn-showcase-top { flex: 0 0 auto; }
.hn-footer       { flex: 0 0 auto; }

.hn-showcase-top {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 24px;
}
@media (min-width: 768px) {
  .hn-showcase-top {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 32px;
    margin-bottom: 16px;
  }
}

/* Segmented control with full roundness — both the container and the
   active pill are fully rounded (border-radius: 9999px). Container has
   zero internal padding + zero gap so the active pill stretches to fill
   the container height and the first tab sits flush with the container's
   left edge. The active pill renders an animated 50%→100% white fill
   from left-to-right over 3s, indicating the auto-rotate timer for that
   slide. The fill resets on each slide change because the .hn-tab-fill
   span is keyed by slide (forced remount restarts the CSS animation). */
.hn-tabs {
  display: inline-flex;
  align-items: stretch;
  padding: 0;
  gap: 0;
  /* Subtle dark-translucent pill — gives the tabs group a defined edge
     on the light cream / peach bg images while staying restrained. */
  background-color: rgba(11, 27, 43, 0.08);
  border-radius: 9999px;
  overflow: hidden;
}
.hn-tab {
  position: relative;
  appearance: none;
  border: 0;
  background: transparent;
  color: rgba(11, 27, 43, 0.65);
  padding: 12px 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 180ms ease;
  white-space: nowrap;
  font-family: inherit;
  line-height: 1;
  border-radius: 9999px;
  overflow: hidden;
}
.hn-tab:hover { color: #0B1B2B; }
.hn-tab[aria-selected="true"] {
  background-color: rgba(255, 255, 255, 0.5);
  color: #0B1B2B;
}

/* Animated fill: scales from 0 → 1 along X over 3s, indicating the
   auto-rotate progress for the active slide. transform-origin: left so
   the fill grows left → right. Sits beneath the content via z-index. */
.hn-tab-fill {
  position: absolute;
  inset: 0;
  background-color: #ffffff;
  transform: scaleX(0);
  transform-origin: left center;
  animation: hn-tab-fill 3000ms linear forwards;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
}
@keyframes hn-tab-fill {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@media (prefers-reduced-motion: reduce) {
  .hn-tab-fill { animation: none; transform: scaleX(1); }
}

/* Tab content (logo + label) sits above the fill so it remains visible
   as the white slides across. */
.hn-tab-content {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Tab logo renders in its own native colors (no filter) on either the
   active or inactive state. Each product's logo art already carries its
   brand colour and reads on the light cream / peach bgs. */
.hn-tab-logo {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  object-fit: contain;
}

.hn-meta {
  text-align: left;
  max-width: 360px;
}
@media (min-width: 768px) { .hn-meta { text-align: right; } }

.hn-slide-title { margin: 0; font-size: 18px; font-weight: 500; color: #0B1B2B; }
.hn-slide-tagline {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.4;
  color: rgba(11, 27, 43, 0.65);
}

/* ── Carousel arrows ────────────────────────────────────────────────── */
.hn-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  border: 0;
  /* Dark-translucent pill so the arrow reads against the light cream /
     peach bg images without a hard outline. */
  background-color: rgba(11, 27, 43, 0.12);
  color: #0B1B2B;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: background-color 180ms ease;
  z-index: 2;
}
.hn-arrow:hover { background-color: rgba(11, 27, 43, 0.22); }
.hn-arrow--prev { left: 12px; }
.hn-arrow--next { right: 12px; }
@media (min-width: 768px) {
  .hn-arrow { width: 44px; height: 44px; font-size: 22px; }
  .hn-arrow--prev { left: 16px; }
  .hn-arrow--next { right: 16px; }
}

/* ── Showcase footer (pagination + caption) ─────────────────────────── */
.hn-footer {
  margin-top: 20px;
  text-align: center;
}
.hn-pagination {
  font-size: 13px;
  color: rgba(11, 27, 43, 0.55);
  letter-spacing: 0.02em;
}
.hn-slide-desc {
  margin: 8px auto 0;
  max-width: 540px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(11, 27, 43, 0.7);
}

/* ─── Floating bottom-right CTA ───────────────────────────────────────── */
.hn-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #111111;
  border: 1px solid #111111;
  border-radius: 7px;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity 200ms ease, transform 200ms ease, background-color 180ms ease;
}
.hn-fab:hover { background-color: #1f1f1f; }
.hn-fab[data-visible="true"] {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
@media (prefers-reduced-motion: reduce) {
  .hn-fab { transition: opacity 0ms; transform: none; }
}
`;

export function HeroNew() {
  const [slide, setSlide] = useState(0);
  const [fabVisible, setFabVisible] = useState(false);
  const inSectionCtasRef = useRef<HTMLDivElement | null>(null);

  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % SLIDES.length);

  // FAB fades in once the in-section CTAs scroll out of view above the
  // viewport — keeps the floating CTA from competing with the in-flow one.
  useEffect(() => {
    const el = inSectionCtasRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setFabVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setFabVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance the carousel every SLIDE_INTERVAL_MS ms. The timer
  // restarts whenever `slide` changes (manual click on a tab or an
  // arrow also resets the countdown). The visual progress is the white
  // fill animation on the active .hn-tab — its keyframe duration is
  // kept in lock-step with SLIDE_INTERVAL_MS.
  useEffect(() => {
    const id = window.setTimeout(
      () => setSlide((s) => (s + 1) % SLIDES.length),
      SLIDE_INTERVAL_MS,
    );
    return () => window.clearTimeout(id);
  }, [slide]);

  const current = SLIDES[slide];
  const currentBg = TABS[slide].bg;

  return (
    <section className="hn-section" aria-label="Columbus product hero">
      <style>{HN_CSS}</style>
      <div className="hn-bounds">
        {/* Header: H1 left + lede right (md+ stacked, lg+ side-by-side) */}
        <div className="hn-header">
          <h1 className="hn-h1">
            Frontier geospatial AI<br />for a smarter world
          </h1>
          <p className="hn-lede">
            Columbus builds AI-powered maps and location intelligence platforms
            to help organizations and developers understand the world, act with
            confidence, and build for what&rsquo;s next.
          </p>
        </div>

        {/* CTAs — observed by an IntersectionObserver to toggle the FAB */}
        <div className="hn-ctas" ref={inSectionCtasRef}>
          <a className="hn-cta hn-cta--solid" href="#">Sign up</a>
          <a className="hn-cta hn-cta--ghost" href="#">Contact sales</a>
        </div>

        {/* Showcase card — background image swaps per slide. */}
        <div
          className="hn-showcase"
          role="region"
          aria-roledescription="carousel"
          aria-label="Columbus product showcase"
          style={{ backgroundImage: `url(${currentBg})` }}
        >
          <div className="hn-showcase-top">
            <div className="hn-tabs" role="tablist" aria-label="Product">
              {TABS.map((tab, i) => {
                const active = slide === i;
                return (
                  <button
                    key={tab.label}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className="hn-tab"
                    onClick={() => setSlide(i)}
                  >
                    {/* Animated 0 → 100% white fill on the active tab.
                        Keyed by `slide` so the span remounts on each
                        slide change, which restarts the CSS animation. */}
                    {active && (
                      <span
                        key={slide}
                        className="hn-tab-fill"
                        aria-hidden="true"
                      />
                    )}
                    <span className="hn-tab-content">
                      <img
                        src={tab.logo}
                        alt=""
                        aria-hidden="true"
                        className="hn-tab-logo"
                      />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="hn-meta">
              <h3 className="hn-slide-title">{current.title}</h3>
              <p className="hn-slide-tagline">{current.tagline}</p>
            </div>
          </div>

          <button
            type="button"
            className="hn-arrow hn-arrow--prev"
            onClick={prev}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            className="hn-arrow hn-arrow--next"
            onClick={next}
            aria-label="Next slide"
          >
            ›
          </button>

          <div className="hn-footer">
            <div
              className="hn-pagination"
              aria-live="polite"
              aria-atomic="true"
            >
              {slide + 1} of {SLIDES.length}
            </div>
            <p className="hn-slide-desc">{current.description}</p>
          </div>
        </div>

      </div>

      {/* Floating bottom-right CTA — fades in once the in-flow CTAs are
          scrolled past, so the user always has a path to sign up. */}
      <a
        className="hn-fab"
        href="#"
        data-visible={fabVisible ? "true" : "false"}
      >
        Sign up
      </a>
    </section>
  );
}

export default HeroNew;
