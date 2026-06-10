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
 * Columbus + Elio use a "split" layout: a flat per-product surface (no
 * photo) with the brand row pinned top-LEFT, the tagline + CTA pinned
 * bottom-LEFT, and the product visual anchored bottom-RIGHT, bleeding off
 * the card's right/bottom edges (overflow:hidden clips it). Research keeps
 * its wide video-banner treatment with text at the top.
 */

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";

// Static imports → Next generates a real low-res `blurDataURL` (progressive
// blur-up) + intrinsic dimensions at build time.
import visualColumbus from "@/public/ColumbusHomeimg.png";
// Elio's bottom-right phone reuses the consumer-Hero map screenshot inside a
// CSS phone bezel (the screen content only; the dark frame is built in CSS).
import elioPhone from "@/public/ConsumerPgMedia/ElioShowcases/ElioHeroShowcase.png";

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
   Flat per-product surface, 16px corners, overflow:hidden so the
   bottom-right visual clips at the card edge. Flex column so the text rail
   (brand top / tagline+CTA bottom) fills the height and the visual is
   absolutely placed over it. */
.bp-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  padding: 28px;
  text-decoration: none;
  color: #0F173C;
  display: flex;
  flex-direction: column;
  min-height: 360px;
}
@media (min-width: 640px)  { .bp-card { padding: 32px; min-height: 400px; } }
@media (min-width: 1024px) { .bp-card { padding: 40px; height: 500px; min-height: 0; } }

/* Per-product surfaces (flat — no photo). */
.bp-card--columbus { background: #EEEFF1; }
.bp-card--elio {
  background: linear-gradient(180deg, #A6C8E8 0%, #C8E0F1 46%, #EFF5F9 100%);
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

/* ── Audience tab (top-right) ──────────────────────────────────────────
   A clean white label tab tucked into the card's top-right corner: its
   top-right corner matches the card radius, its bottom-left is rounded for
   the inset "cut" read. Same on every breakpoint. */
.bp-notch {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 22px;
  background-color: #FFFFFF;
  border-radius: 0 16px 0 16px;
}
.bp-notch-label {
  font-size: 13px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
}
.bp-card--columbus .bp-notch-label { color: #015C94; }
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
.bp-card--research .bp-name { font-family: var(--font-display); color: #0F173C; }

/* Columbus wordmark — navy, Axiforma, semibold, sized to read as the brand. */
.bp-card--columbus .bp-name {
  color: #0F173C;
  font-weight: 600;
  font-size: clamp(24px, 6vw, 29px);
  line-height: 1;
  margin-left: -3px;
  transform: translateY(2px);
}
@media (min-width: 1024px) {
  .bp-card--columbus .bp-name { font-size: 31px; }
}
/* Elio wordmark image — recoloured from white-on-transparent to brand blue. */
.bp-elio-name {
  width: auto;
  height: clamp(30px, 7.5vw, 36px);
  object-fit: contain;
  flex: 0 0 auto;
  margin-left: -4px;
  transform: translateY(1px);
  filter: brightness(0) saturate(100%) invert(46%) sepia(98%) saturate(2009%) hue-rotate(180deg) brightness(102%) contrast(101%);
}
@media (min-width: 1024px) {
  .bp-elio-name { height: 40px; }
}

/* ── Tagline ── */
.bp-tagline {
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0F173C;
  font-size: clamp(20px, 5vw, 24px);
  line-height: 1.18;
  max-width: 13rem;
}
/* Research keeps its lighter, smaller supporting tagline. */
.bp-card--research .bp-tagline {
  font-weight: 500;
  font-size: var(--typography--h5);
  line-height: var(--typography--h5--line-height);
  letter-spacing: -0.015em;
  max-width: 34rem;
}
@media (min-width: 1024px) {
  .bp-card--columbus .bp-tagline,
  .bp-card--elio .bp-tagline { font-size: 25px; max-width: 12rem; }
}

/* ── CTA pill ── */
.bp-cta {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 24px;
  background-color: var(--color-cta);
  color: #FFFFFF;
  border-radius: 11px;
  font-size: var(--typography--p-m);
  line-height: 1;
  font-weight: 500;
  white-space: nowrap;
  transition: color 180ms ease;
}
.bp-cta:hover { color: var(--color-accent); }
.bp-cta-arrow {
  display: inline-flex;
  color: var(--color-accent);
  transition: transform 180ms ease;
}
.bp-cta:hover .bp-cta-arrow { transform: translateX(3px); }
.bp-cta-arrow svg { display: block; }

/* Columbus + Elio: deep-navy pill, white label + white chevron. */
.bp-card--columbus .bp-cta,
.bp-card--elio .bp-cta { background-color: #1B2A4D; color: #FFFFFF; }
.bp-card--columbus .bp-cta:hover,
.bp-card--elio .bp-cta:hover { color: #FFFFFF; }
.bp-card--columbus .bp-cta-arrow,
.bp-card--elio .bp-cta-arrow { color: #FFFFFF; }

@media (prefers-reduced-motion: reduce) {
  .bp-cta, .bp-cta-arrow { transition: none; }
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
}
@media (prefers-reduced-motion: reduce) {
  .bp-visual { transition: none; }
  .bp-card:hover .bp-visual { transform: none; }
}

/* Columbus framed screenshot — black border, no drop shadow. */
.bp-visual--shot img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  border: 2px solid #0B0B0B;
  background-color: #FFFFFF;
}
@media (min-width: 1024px) {
  .bp-card--columbus .bp-visual {
    position: absolute;
    margin-top: 0;
    width: 70%;
    right: -90px;
    bottom: 44px;
  }
}

/* Elio phone (dark PolarX bezel around the map screenshot). */
.bp-visual--phone {
  width: clamp(160px, 46%, 210px);
}
.bp-phone {
  width: 100%;
  aspect-ratio: 0.4949;
  box-sizing: border-box;
  padding: 6px;
  border-radius: 32px;
  background: #10212B;
  box-shadow:
    0 2px 2px -0.25px rgba(0, 0, 0, 0.08),
    0 6px 6px -1px rgba(0, 0, 0, 0.08),
    0 16px 16px -1.5px rgba(0, 0, 0, 0.09),
    0 27px 27px -1.75px rgba(0, 0, 0, 0.10),
    0 50px 50px -2px rgba(0, 40, 60, 0.22);
}
.bp-phone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 26px;
  overflow: hidden;
  background: linear-gradient(180deg, #FFFFFF 0%, #EAF4F5 100%);
}
.bp-phone-screen img {
  object-fit: cover;
  object-position: top center;
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
  /** Audience label shown in the top-right white tab. */
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
    logoFilter: COLUMBUS_LOGO_FILTER,
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
    ctaLabel: "Try Elio",
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

/* Chevron used on the Columbus + Elio CTA pills (matches the reference). */
function Chevron() {
  return (
    <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
      <path
        d="M1.6 1.4L7.2 7l-5.6 5.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Signature 5-dot diagonal arrow — kept for the Research CTA. */
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
          {PRODUCTS.map((p) => (
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

              {/* Audience tab — white label tucked into the top-right corner. */}
              {p.audience && (
                <div className="bp-notch">
                  <span className="bp-notch-label">{p.audience}</span>
                </div>
              )}

              {/* Text rail: brand top-left, tagline + CTA bottom-left. */}
              <div className="bp-text">
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

                <div className="bp-text-bottom">
                  <p className="bp-tagline">{p.tagline}</p>
                  <span className="bp-cta">
                    {p.ctaLabel}
                    <span className="bp-cta-arrow">
                      {p.wide ? <ArrowDots /> : <Chevron />}
                    </span>
                  </span>
                </div>
              </div>

              {/* Columbus framed screenshot, bottom-right. */}
              {p.visual && (
                <div className="bp-visual bp-visual--shot">
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
              )}

              {/* Elio phone, bottom-right. */}
              {p.phone && (
                <div className="bp-visual bp-visual--phone">
                  <PhoneFrame src={p.phone} warm={warm} />
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
