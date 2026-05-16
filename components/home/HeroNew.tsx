"use client";

import { useEffect, useRef } from "react";

/**
 * Hero section — minimal layout for the experimentV6-Gdesign redesign.
 *
 * Left column: a small eyebrow ("The frontier research lab") sits
 * above the H1 ("building geospatial reasoning for the real
 * world."). The H1 uses the project's `.h1` class (Medium 500, 64px
 * desktop / 40px ≤991px) — same typescale used on every heading across
 * the page.
 *
 * Right side: full-bleed boat-sailing background video
 * (/HeroShipVid.mp4), with /BoatHero.jpg as the poster frame. A
 * left-side white→transparent gradient overlay sits above the video
 * so the H1 reads cleanly regardless of how the footage lands behind it.
 */

const HN_CSS = `
.hn-section {
  position: relative;
  overflow: hidden;
  /* Match the surface colour of the section that follows the hero
     (PageFrame's #FFFFFF) so the bottom edge of the hero blends
     seamlessly into the next section. The radial vignette + left
     readability layer both fade to this same colour. */
  background-color: #FFFFFF;
  /* The navbar is sticky (stays in document flow + occupies its own
     ~80px height). Pulling this section up by -80px makes the boat
     image extend behind the navbar so the navbar reads as part of the
     hero. Section then spans the full viewport (y=0 → 100vh) with the
     navbar overlaying y=0..80. */
  margin-top: -80px;
  /* Asymmetric padding: push content down by the nav height so the
     H1 stays clear of the navbar overlay. With min-height: 100vh +
     flex centering, the H1 lands at exactly 50vh + 40px — the visual
     midpoint of the area *below* the navbar. */
  padding-top: 80px;
  padding-bottom: 0;
  color: #0B1B2B;
  font-family: var(--font-sans, "Ppneuemontreal", "PP Neue Montreal", Arial, sans-serif);
  min-height: 100vh;
  display: flex;
  align-items: center;
  /* Bottom gutter + rounded bottom corners. Reuses the same
     --frame-margin / --frame-radius vars PageFrame animates (30px / 20px
     at scrollY 0 → 0 / 0 within the first 150px of scroll). At rest the
     hero reads as an inset rounded card with a gutter beneath it; as the
     user scrolls it merges to full-bleed in sync with the PageFrame
     reveal. overflow: hidden (above) clips the video to the radius. */
  margin-bottom: var(--frame-margin, 30px);
  border-bottom-left-radius: var(--frame-radius, 20px);
  border-bottom-right-radius: var(--frame-radius, 20px);
}

/* Full-bleed background video. Sits at the very bottom of the section's
   stacking (z-index: 0) so the ::before readability gradient and ::after
   vignette (both z-index: 1) and the .hn-bounds content (z-index: 2)
   all layer cleanly on top. object-position mirrors the old
   background-position so the ::after radial vignette stays aligned. */
.hn-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right center;
  z-index: 0;
}

/* Left-side readability layer — fades from the section's base surface
   (#FDFCFC) at the left edge to transparent past the H1's max-width,
   so the H1 sits on a near-solid background while the boat half of
   the video reads through cleanly on the right. */
.hn-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.92) 0%,
    rgba(255, 255, 255, 0.78) 30%,
    rgba(255, 255, 255, 0.30) 55%,
    transparent 75%
  );
  pointer-events: none;
  z-index: 1;
}

/* Two-layer overlay (single ::after):
   1. Top — linear bottom fade. Ensures the section's bottom edge is
      fully opaque white so the hand-off to the next section
      (TextScrollIntro / page wrapper #FFFFFF) is seamless, with no
      leftover image showing at the seam.
   2. Beneath — radial vignette centred at ~76% horizontal / 50%
      vertical (the tall-ship's position). Transparent at the ship,
      ramps to opaque white outward so the surrounding water + map
      texture fades into the page and the eye lands on the ship.
   Sits above the bg image but beneath bounds content (z-index 1;
   bounds is at z-index 2). */
.hn-section::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to bottom,
      transparent 65%,
      rgba(255, 255, 255, 0.55) 85%,
      rgba(255, 255, 255, 1) 100%
    ),
    radial-gradient(
      ellipse 56% 80% at 76% 50%,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 44%,
      rgba(255, 255, 255, 0.55) 73%,
      rgba(255, 255, 255, 1) 100%
    );
  pointer-events: none;
  z-index: 1;
}

.hn-bounds {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
  /* Lift the title 50px above the section's vertical centre. translateY
     is preferred over a negative margin so the flex centering math
     stays clean and adjacent siblings (none today, but future-proof)
     aren't dragged with it. */
  transform: translateY(-50px);
}
@media (min-width: 768px) {
  .hn-bounds { margin-left: auto; margin-right: auto; }
}

/* Font-size + line-height come from the .h1 class on the element
   (--typography--h1 = 64px ≥992 / 40px ≤991, single project cutoff).
   This rule only sets the layout/wrap controls — the per-breakpoint
   max-widths are tuned so text-wrap: balance lands "building
   geospatial reasoning for the real world." (49 chars, 7 words) on a
   stable 2-line break at each scale-tier (.h1 mobile vs .h1 desktop). */
.hn-title {
  text-wrap: balance;
  max-width: 40rem;
}
@media (min-width: 992px) {
  .hn-title { max-width: 64rem; }
}

/* Eyebrow / kicker — small label above the H1, set in the same accent
   as the "Try Elio" button arrows (#0081AC) so it reads as a distinct
   label rather than faded headline text. Sizing stays well below .h1
   at both tiers so the hierarchy is unambiguous. */
.hn-eyebrow {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: #0081AC;
  margin-bottom: 14px;
}
@media (min-width: 992px) {
  .hn-eyebrow {
    font-size: 18px;
    margin-bottom: 20px;
  }
}
`;

export function HeroNew() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Next SSR doesn't emit the `muted` attribute into the server HTML
  // (it's only set as a property after hydration), so browsers block
  // autoplay. Explicitly set `.muted` and call `.play()` — with a
  // `canplay` retry in case the data wasn't ready on the first attempt.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => { v.play().catch(() => {}); };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <section className="hn-section" aria-label="Columbus hero" data-hero-section>
      <style>{HN_CSS}</style>
      <video
        ref={videoRef}
        className="hn-video"
        src="/HeroShipVid.mp4"
        poster="/BoatHero.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
      <div className="hn-bounds">
        <p className="hn-eyebrow">The frontier research lab</p>
        <h1 className="h1 hn-title tracking-tight text-ink">
          building geospatial reasoning for the real world.
        </h1>
      </div>
    </section>
  );
}

export default HeroNew;
