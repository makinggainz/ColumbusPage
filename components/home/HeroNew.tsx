"use client";

/**
 * Hero section — minimal layout for the experimentV6-Gdesign redesign.
 *
 * Left column: H1 ("The frontier research lab building geospatial
 * reasoning for the real world.") rendered with the project's `.h1`
 * class (Medium 500, 64px desktop / 40px ≤991px) — same typescale used
 * on every heading across the page.
 *
 * Right side: full-bleed boat-sailing background image
 * (/mapwaterhero.png, a topographic-line water texture with a small
 * tall-ship anchored to the right). A left-side white→transparent
 * gradient overlay sits above the image so the H1 reads cleanly
 * regardless of how the watercolour map texture lands behind it.
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
  background-image: url('/mapwaterhero.png');
  background-position: right center;
  background-size: cover;
  background-repeat: no-repeat;
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
}

/* Left-side readability layer — fades from the section's base surface
   (#FDFCFC) at the left edge to transparent past the H1's max-width,
   so the H1 sits on a near-solid background while the boat half of
   the image reads through cleanly on the right. */
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
      ellipse 38% 55% at 76% 50%,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 32%,
      rgba(255, 255, 255, 0.55) 65%,
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
   This rule only sets the layout/wrap controls — both per-breakpoint
   max-widths are tuned so text-wrap: balance lands the sentence on a
   stable line count at each scale-tier (.h1 mobile vs .h1 desktop).

   Sizing math for "The frontier research lab building geospatial
   reasoning for the real world." (76 chars, 11 words) with balance:
   - 2-line break needs ~38 chars per line; longest-line lower bound
     ~76rem at 64px / ~50rem at 40px.
   - 3-line break needs ~25 chars per line average; longest natural
     word-group is "reasoning for the real world." (28 chars) so
     lower bound ~58rem at 64px / ~38rem at 40px.
   max-width must sit between those two bounds to force exactly 3
   lines. Chosen values: 40rem mobile, 64rem desktop. */
.hn-title {
  text-wrap: balance;
  max-width: 40rem;
}
@media (min-width: 992px) {
  .hn-title { max-width: 64rem; }
}
`;

export function HeroNew() {
  return (
    <section className="hn-section" aria-label="Columbus hero" data-hero-section>
      <style>{HN_CSS}</style>
      <div className="hn-bounds">
        <h1 className="h1 hn-title tracking-tight text-ink">
          The frontier research lab building geospatial reasoning for the real world.
        </h1>
      </div>
    </section>
  );
}

export default HeroNew;
