"use client";

import Image from "next/image";

/**
 * Hero section — minimal layout for the experimentV6-Gdesign redesign.
 *
 * Left column: a small eyebrow ("The frontier research lab") sits
 * above the H1 ("building geospatial reasoning for the real
 * world."). The H1 uses the project's `.h1` class (Medium 500, 64px
 * desktop / 40px ≤991px) — same typescale used on every heading across
 * the page.
 *
 * Right side: full-bleed HomeHeroBack illustration (sketched tall
 * ship sailing toward a city skyline). A left-side white→transparent
 * gradient overlay sits above the image so the H1 reads cleanly
 * regardless of how the artwork lands behind it.
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
     height). Pulling this section up by -120px makes the hero image
     extend behind the navbar so the navbar reads as part of the hero.
     The pull is *over*-sized on purpose: the navbar's actual height
     drifts a few px above 80 with the current padding + content, so a
     -80 pull leaves a thin white sliver at the section's top edge
     (visible against the new top-left blue tint). -120 overshoots by
     ~40px, which the PageFrame's overflow:clip discards — no gap. */
  margin-top: -120px;
  /* Asymmetric padding: push content down by 120px so the H1 still
     lands clear of the navbar overlay (matches the -120 pull above).
     min-height adds the same +40px so the box's bottom edge — and
     the H1's flex-centered position — stay exactly where they were
     under the -80/-80/100vh values; the box is just 40px taller on
     top, with that extra clipped by the PageFrame. */
  padding-top: 120px;
  padding-bottom: 0;
  color: #0B1B2B;
  font-family: var(--font-sans, "Ppneuemontreal", "PP Neue Montreal", Arial, sans-serif);
  min-height: calc(100vh + 40px);
  display: flex;
  align-items: center;
  /* Floating-div treatment: a fixed 30px gutter below the hero +
     rounded bottom corners, so the hero reads as a self-contained card
     sitting inside the PageFrame. 30px matches the frame's at-rest
     top/side gutter (--frame-margin max); the bottom radius matches the
     frame's at-rest corner (--frame-radius max = 20px). Held static (not
     scroll-tracked) so the hero stays a floating card rather than
     collapsing to full-bleed. overflow: hidden (above) clips the image
     to the rounded corners. The top corners are rounded by the
     PageFrame's own clip. */
  margin-bottom: 30px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

/* Full-bleed background image. Sits at the very bottom of the section's
   stacking (z-index: 0) so the ::before readability gradient and ::after
   vignette (both z-index: 1) and the .hn-bounds content (z-index: 2)
   all layer cleanly on top. Shared rules for both bg variants below;
   .hn-bg-desktop carries the 1672×941 landscape art; .hn-bg-mobile
   carries the 853×1844 portrait variant. Display is swapped by viewport
   in the media-query block. */
.hn-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.hn-bg-desktop {
  object-position: right center;
}
.hn-bg-mobile {
  display: none;
}
@media (max-width: 767px) {
  .hn-bg-desktop {
    display: none;
  }
  /* Mobile bg is rendered smaller than the section (height-capped at
     60vh, width auto-derived from the source 853×1844 aspect) and
     anchored bottom-center so the upper half of the section stays clear
     white behind the headline. The mobile Image uses explicit
     width/height (not fill), so the shared .hn-bg full-bleed rules
     above do not apply to it. */
  .hn-bg-mobile {
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 60vh;
    width: auto;
    z-index: 0;
  }
}

/* Mobile: hero fills the full viewport — same calc(100vh + 40px) the
   desktop rule uses, where the +40 absorbs the navbar overshoot
   (margin-top: -120 + padding-top: 120 leaves the box 40 px taller
   than 100vh on top, then PageFrame's overflow:clip discards it).
   The portrait .hn-bg-mobile (853×1844) cover-fills the section
   naturally; H1+subtitle sit centred on top of the upper white band
   of the illustration. */
@media (max-width: 767px) {
  .hn-section {
    min-height: calc(100vh + 40px);
  }
  /* Flip the readability gradient on mobile from left→right to top→bottom.
     Desktop fades the left side to white so the H1 (which sits left of
     the ship) reads cleanly; on mobile the H1 sits ABOVE the ship
     instead of beside it, so the fade needs to run vertically — opaque
     white behind the headline at the top, transparent down where the
     ship lives. Stops compressed to 0/15/30/45% (vs 0/30/55/75% on
     desktop) so the fade fully clears by ~45% of section height
     (≈y285 on a 633px section), leaving the masts (≈y280–516) and
     hull (≈y516–610) reading at full ink. The headline block only
     extends to ~40% of section height, so this still gives the H1
     all the white backdrop it needs. */
  .hn-section::before {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.92) 0%,
      rgba(255, 255, 255, 0.78) 15%,
      rgba(255, 255, 255, 0.30) 30%,
      transparent 45%
    );
  }
  /* Mobile ::after — strip the desktop bottom-fade and ship-halo
     layers; keep only the top-left blue tint. The bottom-fade was
     blending the hero's bottom edge into the next section, but both
     surfaces are already pure #FFFFFF (see hn-section bg-color +
     app/page.tsx), so the fade is doing visual work it doesn't need
     to and was washing out the hull (≈y516–610 on a 633px section,
     which is exactly where the 80%→100% white ramp landed). The
     centered ellipse halo was a desktop carryover with no purpose
     on mobile. */
  .hn-section::after {
    background: radial-gradient(
      circle at top left,
      rgba(96, 148, 193, 0.35) 0%,
      rgba(255, 255, 255, 0) 25%
    );
  }
}

/* Left-side readability layer — fades from the section's base surface
   (#FDFCFC) at the left edge to transparent past the H1's max-width,
   so the H1 sits on a near-solid background while the ship half of
   the image reads through cleanly on the right.

   Base ::before (positioning + z-index) applies at every viewport so
   the mobile @media block above only needs to override the background.
   The desktop-specific left→right gradient is scoped to min-width 768
   so it doesn't leak onto mobile and override the top→bottom fade. */
.hn-section::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
@media (min-width: 768px) {
  .hn-section::before {
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.92) 0%,
      rgba(255, 255, 255, 0.78) 30%,
      rgba(255, 255, 255, 0.30) 55%,
      transparent 75%
    );
  }
}

/* Three-layer overlay (single ::after). CSS multi-background paints
   the *first* layer on top, so the stack from top to bottom is:
   1. Top — top-left blue emanation. Radial gradient anchored at the
      top-left corner, opaque #81A5FF at the corner and fading to
      transparent (rgba 255,255,255,0) at the farthest-corner extent.
      Sits above the bottom fade + vignette so the blue tint shows
      across the whole top-left quadrant rather than getting hidden
      by the vignette's opaque-white corner zone.
   2. Middle — linear bottom fade. Ensures the section's bottom edge
      is fully opaque white so the hand-off to the next section
      (TextScrollIntro / page wrapper #FFFFFF) is seamless, with no
      leftover image showing at the seam.
   3. Bottom — radial vignette centred at ~76% horizontal / 50%
      vertical (the tall-ship's position). Transparent at the ship,
      ramps to opaque white outward so the surrounding water + map
      texture fades into the page and the eye lands on the ship.
   Sits above the bg image but beneath bounds content (z-index 1;
   bounds is at z-index 2). */
.hn-section::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
@media (min-width: 768px) {
  .hn-section::after {
    background:
      radial-gradient(
        circle at top left,
        rgba(96, 148, 193, 0.35) 0%,
        rgba(255, 255, 255, 0) 25%
      ),
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
  }
}

.hn-bounds {
  position: relative;
  z-index: 2;
  /* Canonical content-bounds calc trick — 1287px cap, always 40px
     narrower than parent (= 20px gutter on each side at every viewport
     width), centered. Matches navbar / .content-bounds / site-wide. */
  max-width: 1287px;
  width: calc(100% - 2.5rem);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  /* Lift the title 50px above the section's vertical centre. translateY
     is preferred over a negative margin so the flex centering math
     stays clean and adjacent siblings (none today, but future-proof)
     aren't dragged with it. */
  transform: translateY(-50px);
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
  .hn-title {
    max-width: 64rem;
    font-size: 60px;
  }
}

/* Eyebrow / kicker — small label above the H1, set in the same accent
   (#6094C1) as the navbar arrow icons and the hero's top-left corner
   radial gradient, so the three accent surfaces read as one unified
   blue tone. */
.hn-eyebrow {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: #6094C1;
  margin-bottom: 14px;
}
@media (min-width: 992px) {
  .hn-eyebrow {
    font-size: 18px;
    margin-bottom: 20px;
  }
}

/* Subhead beneath the H1. Set well below .h1 so the hierarchy stays
   clear, with text-wrap: balance to land "We Are An Applied AI Lab
   For Geospatial Intelligence." on a clean two-line break. */
/* Skip-a-weight from H1 (Funnel Display 500) → subtitle (sans 400) and
   step the colour down from --color-ink to --color-muted so the eye
   reads headline → subtitle as primary → secondary, not as two peer
   labels. Line-height bumped from 1.25 to 1.4 so the body text breathes
   like body text rather than a heading. */
.hn-subtitle {
  margin-top: 28px;
  max-width: 26rem;
  text-wrap: balance;
  font-family: var(--font-sans, "Ppneuemontreal", "PP Neue Montreal", Arial, sans-serif);
  font-size: 18px;
  line-height: 1.4;
  font-weight: 400;
  color: #5A6B7B;
}
@media (min-width: 992px) {
  .hn-subtitle {
    margin-top: 36px;
    max-width: 30rem;
    font-size: 22px;
  }
}
`;

export function HeroNew() {
  return (
    <section className="hn-section" aria-label="Columbus hero" data-hero-section>
      <style>{HN_CSS}</style>
      {/* LCP image — fill-mode <Image priority> emits a <link rel="preload">
          so the browser starts the fetch before the bundle hydrates, and
          serves AVIF/WebP via the next-image optimizer. Two variants are
          rendered; CSS hides one by viewport (.hn-bg-mobile shown ≤767px,
          .hn-bg-desktop shown ≥768px). Both are priority so whichever
          viewport hits the page gets a preloaded LCP image. */}
      {/* Desktop background — /HomeHero.png. */}
      <Image
        className="hn-bg hn-bg-desktop"
        src="/HomeHero.png"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={80}
      />
      <Image
        className="hn-bg-mobile"
        src="/HomeHeroBackMobile.png"
        alt=""
        width={853}
        height={1844}
        priority
        fetchPriority="high"
        sizes="60vh"
        quality={80}
      />
      <div className="hn-bounds">
        <h1 className="h1 hn-title tracking-tight text-ink">
          The Applied AI Lab for geospatial intelligence.
        </h1>
        <p className="hn-subtitle">
          Building street-smart AI for the real world.
        </p>
      </div>
    </section>
  );
}

export default HeroNew;
