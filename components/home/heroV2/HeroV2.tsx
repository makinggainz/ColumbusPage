"use client";

/* eslint-disable @next/next/no-img-element */

/**
 * V2 homepage hero — the Company card.
 *
 * Adapted from MistX's `components/sections/Hero.tsx`: a near-full-screen
 * card with an off-centre background image (the boat / diamond-grid
 * texture) masked at its edges, a large headline, and two dark pill
 * CTAs. The image is the same asset MistX uses (/herobackground2.png)
 * with the same intersected horizontal + vertical mask math so the
 * artwork fades cleanly into the card surface on all four sides.
 *
 * The outer card chrome (white surface, hairline border, 24 px corners,
 * near-full-viewport height) is owned by the shared `.cardv2` utility
 * declared inside this component's <style> block so every V2 card on
 * the page renders the same shell.
 */

const CSS = `
/* Shared V2 card shell — all six page cards (hero, columbus, elio,
   research, hiring, footer) wear this chrome. Lives in the hero's
   <style> because the hero is the first card on the page; the rule
   is a global selector so subsequent cards pick it up without
   duplicating it.

   Cards span nearly the full viewport width with a 10 px gutter on
   every side. Vertical margins collapse between adjacent cards so the
   gap between two cards is also 10 px. The first card carries extra
   top margin to clear the fixed navbar (~80 px tall); every other
   card uses the standard 10 px.

   The cards sit on a black page background; the 10 px gutter between
   each card reads as a dark frame around the card grid. */
.cardv2 {
  position: relative;
  margin: 10px;
  background-color: #ffffff;
  border: 1px solid var(--color-gridline, #E7E7F1);
  border-radius: 24px;
  overflow: hidden;
  box-sizing: border-box;
}
.cardv2:first-of-type { margin-top: 92px; }
@media (min-width: 768px) {
  .cardv2:first-of-type { margin-top: 100px; }
}
.cardv2--full {
  min-height: calc(100vh - 110px);
}
@media (min-width: 768px) {
  .cardv2--full { min-height: calc(100vh - 120px); }
}

/* Hero card — MistX-style: bg image off-centre on the right, headline
   + CTAs on the left, with the bg image masked at all edges. */
.hv2-card {
  display: flex;
  align-items: center;
  padding: 48px 32px;
}
@media (min-width: 768px)  { .hv2-card { padding: 64px 56px; } }
@media (min-width: 1024px) { .hv2-card { padding: 96px 88px; } }

/* Bg image: positioned right of centre, vertically centred, masked to
   fade out at all edges. */
.hv2-bg {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -8%;
  height: 80%;
  width: auto;
  max-width: 70%;
  pointer-events: none;
  user-select: none;
  -webkit-mask-image:
    linear-gradient(to right,  transparent 0%, #000 28%, #000 78%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to right,  transparent 0%, #000 28%, #000 78%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%);
  mask-composite: intersect;
  z-index: 0;
}
@media (min-width: 768px) { .hv2-bg { right: 0; height: 90%; max-width: 60%; } }

/* Left fade overlay so the headline reads on the bg image */
.hv2-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background:
    linear-gradient(to right, #ffffff 0%, #ffffff 36%, transparent 64%);
}

.hv2-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  max-width: 720px;
}
@media (min-width: 1024px) { .hv2-content { gap: 36px; } }

.hv2-title {
  margin: 0;
  font-size: 36px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 500;
  color: #0B1B2B;
}
@media (min-width: 768px)  { .hv2-title { font-size: 44px; } }
@media (min-width: 1024px) { .hv2-title { font-size: 56px; } }

.hv2-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hv2-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 7px;
  background-color: #111111;
  color: #ffffff;
  border: 1px solid #111111;
  transition: background-color 180ms ease, color 180ms ease;
  white-space: nowrap;
  font-family: inherit;
}
.hv2-cta:hover { background-color: #1f1f1f; }
.hv2-cta-arrow {
  width: 14px;
  height: 14px;
  display: inline-block;
  transition: transform 180ms ease;
}
.hv2-cta:hover .hv2-cta-arrow { transform: translateX(2px); }
`;

function ArrowDots() {
  return (
    <svg
      className="hv2-cta-arrow"
      viewBox="0 0 9 13"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7.22"  cy="6.589" r="1.28" fill="#154ACC" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="#154ACC" />
      <circle cx="2.099" cy="1.46"  r="1.28" fill="#154ACC" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="#154ACC" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="#154ACC" />
    </svg>
  );
}

export function HeroV2() {
  return (
    <section className="cardv2 cardv2--full hv2-card" aria-label="Columbus">
      <style>{CSS}</style>
      <img
        src="/mapwaterhero.png"
        alt=""
        aria-hidden="true"
        className="hv2-bg"
      />
      <div className="hv2-fade" aria-hidden="true" />
      <div className="hv2-content">
        <h1 className="hv2-title">
          The frontier research lab building geospatial reasoning for the real world.
        </h1>
        <div className="hv2-ctas">
          <a className="hv2-cta" href="#">
            For consumer
            <ArrowDots />
          </a>
          <a className="hv2-cta" href="#">
            For enterprise
            <ArrowDots />
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroV2;
