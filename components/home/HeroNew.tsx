"use client";

/**
 * Hero section — minimal layout for the experimentV6-Gdesign redesign.
 *
 * Composition (centred): a pill badge ("The frontier research lab")
 * sits above the H1 ("Building geospatial reasoning for the real
 * world."). Splitting the lab line out of the headline lets the H1
 * carry the product promise on its own while the badge frames who is
 * making it. The H1 still uses the project's `.h1` class (Medium 500,
 * 64px desktop / 40px ≤991px) — the same typescale as every heading.
 *
 * Background: the ColumbusBackgroundMB map watermark (the same texture
 * that previously sat behind "We're all about maps"). A white wash +
 * bottom fade sit above the image so the centred content reads cleanly
 * and the hero hands off seamlessly into the next section.
 *
 * Full-bleed: the section breaks out of the PageFrame's 16px gutter on
 * its top and both sides so the texture runs edge-to-edge with the
 * viewport (see the negative margins on `.hn-section`). PageFrame
 * switches to `overflow: visible` on the homepage to allow this.
 */

const HN_CSS = `
.hn-section {
  position: relative;
  overflow: hidden;
  /* Match the surface colour of the section that follows the hero
     (PageFrame's #FFFFFF) so the bottom edge of the hero blends
     seamlessly into the next section. */
  background-color: #FFFFFF;
  background-image: url('/ColumbusBackgroundMB.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  /* Full-bleed: the hero escapes the PageFrame's gutter on its top and
     both sides so the map texture runs edge-to-edge with the viewport.
     PageFrame uses overflow: visible on the homepage so this overflow
     is not clipped.
       • top    — the navbar is sticky (in flow, ~80px tall). Pulling
                  up by -80px overlaps it, then a further
                  -var(--frame-margin) clears the frame's top gutter so
                  the section's top edge lands at viewport y=0.
       • sides  — negative left/right margins of var(--frame-margin)
                  widen the section past the frame to both viewport
                  edges. The calc tracks --frame-margin so it stays
                  edge-aligned while the frame's scroll animation runs
                  the gutter 16px → 0. */
  margin-top: calc(-80px - var(--frame-margin, 16px));
  margin-left: calc(-1 * var(--frame-margin, 16px));
  margin-right: calc(-1 * var(--frame-margin, 16px));
  /* Asymmetric padding: push content down past the nav height + the
     reclaimed top gutter so the content stays clear of the navbar
     overlay. With min-height: 100vh + flex centering, the content
     lands at the visual midpoint of the area *below* the navbar. */
  padding-top: calc(80px + var(--frame-margin, 16px));
  padding-bottom: 0;
  color: #0B1B2B;
  font-family: var(--font-sans, "Ppneuemontreal", "PP Neue Montreal", Arial, sans-serif);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

/* Readability wash — a uniform semi-opaque white layer that mutes the
   map texture (matching the 0.5 opacity it had behind "We're all about
   maps") so the centred content sits on a calm, near-solid background. */
.hn-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.55);
  pointer-events: none;
  z-index: 1;
}

/* Bottom fade — ensures the section's bottom edge is fully opaque
   white so the hand-off to the next section (TextScrollIntro / page
   wrapper #FFFFFF) is seamless, with no leftover texture at the seam. */
.hn-section::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 65%,
    rgba(255, 255, 255, 0.55) 85%,
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
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  text-align: center;
  /* Lift the content 50px above the section's vertical centre.
     translateY is preferred over a negative margin so the flex
     centering math stays clean and adjacent siblings aren't dragged. */
  transform: translateY(-50px);
}

/* Pill badge — "The frontier research lab". A minimal full-radius
   pill with a solid brand-blue fill (#1451E8, the exact accent used by
   .btn-primary and the navbar CTA pills) and white text — the same
   fill treatment as every other blue pill on the site, so it reads
   unmistakably as the brand blue rather than a washed-out tint. Sized
   off the project's body type (--font-sans), not the heading face. */
.hn-badge {
  display: inline-flex;
  align-items: center;
  margin-bottom: 22px;
  padding: 8px 16px;
  border-radius: 9999px;
  background: #1451E8;
  font-family: var(--font-sans, "Ppneuemontreal", "PP Neue Montreal", Arial, sans-serif);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
  color: #FFFFFF;
  white-space: nowrap;
}

/* Font-size + line-height come from the .h1 class on the element
   (--typography--h1 = 64px ≥992 / 40px ≤991, single project cutoff).
   This rule only sets the layout/wrap controls — both per-breakpoint
   max-widths are tuned so text-wrap: balance lands the sentence on a
   stable 2-line break at each scale-tier (.h1 mobile vs .h1 desktop).

   Sizing math for "Building geospatial reasoning for the real world."
   (49 chars, 7 words) with balance, at ~0.52em average glyph width:
   - single line ≈ 49·0.52em ≈ 25.5em → 1.63k px at 64px / 1.0k px at
     40px, so any max-width below that forces a wrap.
   - 2-line break: longest natural line is "building geospatial
     reasoning" (29 chars) ≈ 15em → ~60rem at 64px / ~38rem at 40px.
   max-width must sit above the 2-line lower bound but below the
   single-line width to land exactly 2 lines. Chosen values — 40rem
   mobile, 64rem desktop — clear both bounds. The title is centred
   horizontally (margin: auto) and text-centred. */
.hn-title {
  text-wrap: balance;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
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
        <span className="hn-badge">The frontier research lab</span>
        <h1 className="h1 hn-title tracking-tight text-ink">
          Building geospatial reasoning for the real world.
        </h1>
      </div>
    </section>
  );
}

export default HeroNew;
