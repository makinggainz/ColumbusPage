"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDot, NavArrowStack, elioMenuItems } from "../layout/MistxNav";
import { heroOptimizerSrcSet } from "@/lib/hero-assets";

const APPEAR = "cubic-bezier(0.22, 1.4, 0.36, 1)";

function slideLeft(ready: boolean, delayMs: number) {
  return {
    opacity: ready ? 1 : 0,
    filter: ready ? "blur(0px)" : "blur(8px)",
    transform: ready ? "translateX(0)" : "translateX(-22px)",
    transition: `opacity 1000ms ease ${delayMs}ms, filter 1000ms ease ${delayMs}ms, transform 900ms ${APPEAR} ${delayMs}ms`,
  };
}

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
   in the media-query block.
   opacity starts at 0 and transitions to 1 via onLoad so the image
   fades in smoothly rather than popping in.
   hn-colorize: image starts fully desaturated (grayscale) and blooms
   back to color once the blue glow has animated in. The 1.4s delay
   lands when the glow is ~80% visible (ease-out 1.6s at 350ms offset),
   so the color feels "unlocked" by the glow rather than arriving with it. */
@keyframes hn-colorize {
  from { filter: grayscale(1); }
  to   { filter: grayscale(0); }
}
.hn-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.45s ease;
  animation: hn-colorize 0.9s ease-in 1.4s both;
}
.hn-bg-desktop {
  object-position: right center;
}
.hn-bg-mobile {
  object-position: center center;
  display: none;
}
@media (max-width: 767px) {
  .hn-bg-desktop {
    display: none;
  }
  .hn-bg-mobile {
    display: block;
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
  /* On mobile, lift the title block 100px above the section's vertical
     centre — lands the headline + subtitle + CTA in the upper third of
     the viewport (≈ 40 % from top), leaving breathing room from the
     navbar above and the lower 60 % for the ship illustration to read.
     Pattern matches Mobbin references (Duolingo, Yazio) for hero with
     title overlaid on illustration. */
  .hn-bounds {
    transform: translateY(-100px);
  }
  /* Stacked white halo on the subtitle so glyphs stay readable over the
     image where the radial wash thins out. Three zero-offset shadows
     ramp the halo from a tight 2px core out to an 8px diffuse glow. */
  .hn-subtitle {
    text-shadow:
      0 0 2px rgba(255, 255, 255, 0.95),
      0 0 4px rgba(255, 255, 255, 0.9),
      0 0 8px rgba(255, 255, 255, 0.85);
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
     layers; keep only the top-right white wash. The blue glow is now
     handled by .hn-glow (a separate animated element) so it can fade
     in independently on both breakpoints. */
  .hn-section::after {
    background:
      /* Top-right white wash — wide ellipse anchored at the top-right
         that extends across most of the upper section. Sized 130% wide ×
         70% tall so it reaches past the subtitle's left edge on mobile,
         keeping the skyline buildings from interfering with text. */
      radial-gradient(
        ellipse 130% 70% at top right,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.82) 30%,
        rgba(255, 255, 255, 0.5) 55%,
        rgba(255, 255, 255, 0) 82%
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

/* Two-layer overlay (single ::after). Blue glow moved to .hn-glow so
   it can animate independently. CSS multi-background paints the *first*
   layer on top, so the stack from top to bottom is:
   1. Middle — linear bottom fade. Ensures the section's bottom edge
      is fully opaque white so the hand-off to the next section
      (TextScrollIntro / page wrapper #FFFFFF) is seamless, with no
      leftover image showing at the seam.
   2. Bottom — radial vignette centred at ~76% horizontal / 50%
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

/* Blue emanating glow — separated from ::after so it can animate in
   independently. Fades from invisible to full over 1.6s, starting
   0.35s after mount, giving it a "breathing into existence" quality
   that complements the text sliding in from the left. */
@keyframes hn-glow-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.hn-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background: radial-gradient(
    circle at top left,
    rgba(96, 148, 193, 0.35) 0%,
    rgba(255, 255, 255, 0) 25%
  );
  animation: hn-glow-in 1.6s ease-out 0.35s both;
}

.hn-bounds {
  position: relative;
  z-index: 3;
  /* Canonical content-bounds calc trick — 1287px cap, always 40px
     narrower than parent (= 20px gutter on each side at every viewport
     width), centered. Matches navbar / .content-bounds / site-wide. */
  max-width: 1287px;
  width: calc(100% - 2.5rem);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}
/* Lift the title 50px above the section's vertical centre on desktop.
   translateY is preferred over a negative margin so the flex centering
   math stays clean and adjacent siblings (none today, but future-proof)
   aren't dragged with it. Gated to ≥768px so the mobile @media block
   higher in this stylesheet (which sets -200px) wins on phones — the
   earlier mobile rule would otherwise be overridden by this one due to
   matching specificity + later source order. */
@media (min-width: 768px) {
  .hn-bounds {
    transform: translateY(-50px);
  }
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
  const [ctaOpen, setCtaOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const desktopImgRef = useRef<HTMLImageElement>(null);
  const mobileImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ctaOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!ctaRef.current?.contains(e.target as Node)) {
        setCtaOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCtaOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [ctaOpen]);

  return (
    <section className="hn-section" aria-label="Columbus hero" data-hero-section>
      <style>{HN_CSS}</style>
      {/* LCP image — two viewport variants (CSS hides one: .hn-bg-mobile
          shown ≤767px, .hn-bg-desktop shown ≥768px). The <Image>s are NOT
          `priority` (that emitted an unconstrained preload for BOTH, so
          every device high-priority-fetched the hidden variant too). Instead
          we emit *media-scoped* <link rel="preload"> below — React 19 hoists
          these into <head> and the browser evaluates `media` against the
          live viewport, so only the variant actually shown is fetched at
          high priority. The srcset matches the optimizer URL the <Image>
          requests, so the preload and the render share one cache entry. */}
      <link
        rel="preload"
        as="image"
        media="(min-width: 768px)"
        imageSrcSet={heroOptimizerSrcSet("/HomeHeroBg.png", 80)}
        imageSizes="100vw"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        media="(max-width: 767px)"
        imageSrcSet={heroOptimizerSrcSet("/HomeHeroBackMobile.png", 80)}
        imageSizes="100vw"
        fetchPriority="high"
      />
      {/* Desktop background — /HomeHeroBg.png. onLoad sets opacity:1 via
          ref so the image fades in smoothly (CSS starts it at opacity:0). */}
      <Image
        ref={desktopImgRef}
        className="hn-bg hn-bg-desktop"
        src="/HomeHeroBg.png"
        alt=""
        fill
        sizes="100vw"
        quality={80}
        draggable={false}
        onLoad={() => {
          if (desktopImgRef.current) desktopImgRef.current.style.opacity = "1";
        }}
      />
      <Image
        ref={mobileImgRef}
        className="hn-bg hn-bg-mobile"
        src="/HomeHeroBackMobile.png"
        alt=""
        fill
        sizes="100vw"
        quality={80}
        draggable={false}
        onLoad={() => {
          if (mobileImgRef.current) mobileImgRef.current.style.opacity = "1";
        }}
      />
      {/* Animated blue glow — separated from ::after so it can fade in
          independently via CSS animation (hn-glow-in). */}
      <div className="hn-glow" aria-hidden="true" />
      <div className="hn-bounds">
        <h1
          className="h1 hn-title tracking-tight text-ink"
          style={slideLeft(mounted, 100)}
        >
          The Applied AI Lab building a thinking earth
        </h1>
        <p className="hn-subtitle" style={slideLeft(mounted, 280)}>
          Geospatial Intelligence<br className="md:hidden" /> for the real world.
        </p>
        {/* Try Elio CTA — mirrors the navbar dropdown verbatim: same
            button class set (rounded-button px-5 py-2 p-m, bg-cta + white
            text, hover:text-accent, NavArrowStack icon) and the same dark
            glassy translucent panel + stagger animation below. The
            elioMenuItems data is imported from MistxNav so the two stay
            in sync. Hover opens it (matches navbar); click toggles for
            touch; Esc / outside-click closes. */}
        <div
          ref={ctaRef}
          className="relative mt-7 inline-block md:mt-9 md:hidden"
          onMouseEnter={() => setCtaOpen(true)}
          onMouseLeave={() => setCtaOpen(false)}
          style={slideLeft(mounted, 440)}
        >
          <button
            type="button"
            className="group cursor-pointer rounded-button-md px-7 py-3.5 p-l md:rounded-button md:px-5 md:py-2 md:p-m flex items-center gap-2 transition-colors hover:text-accent bg-cta text-white"
            onClick={() => setCtaOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={ctaOpen}
          >
            Try Elio
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
              <NavArrowStack className="text-accent" />
            </span>
          </button>
          <div
            aria-hidden={!ctaOpen}
            className="absolute left-0 top-full pt-2.5 w-[320px] z-50"
            style={{
              opacity: ctaOpen ? 1 : 0,
              transform: ctaOpen
                ? "translateY(0) scale(1)"
                : "translateY(-6px) scale(0.96)",
              transformOrigin: "top left",
              pointerEvents: ctaOpen ? "auto" : "none",
              transition:
                "opacity 300ms cubic-bezier(0.6,0.6,0,1), transform 300ms cubic-bezier(0.6,0.6,0,1)",
            }}
          >
            <div
              role="menu"
              className="p-1.5"
              style={{
                backgroundColor: "#091345",
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "rgba(9,1,20,0.06) 0px 8px 8px -3px, rgba(8,1,20,0.06) 0px 3px 3px -1.5px, rgba(8,1,20,0.04) 0px 2px 2px -1px, rgba(8,1,20,0.03) 0px 1px 1px -0.5px, rgba(8,1,20,0.03) 0px 0.5px 0.5px 0px, rgba(255,255,255,0.08) 0px -4px 12px -4px inset, rgba(255,255,255,0.06) 0px 1px 3px 0px inset, rgba(255,255,255,0.12) 0px 0.5px 0.5px 0px inset",
              }}
            >
              <ul>
                {elioMenuItems.map((item, i) => (
                  <li key={item.label} role="none">
                    <a
                      role="menuitem"
                      href={item.href}
                      className="group flex items-start gap-3 px-3 py-2.5 rounded-[10px] transition-colors duration-150 hover:bg-white/8"
                      style={{
                        opacity: ctaOpen ? 1 : 0,
                        transform: ctaOpen
                          ? "translateY(0)"
                          : "translateY(4px)",
                        transition: `opacity 260ms cubic-bezier(0.6,0.6,0,1) ${
                          ctaOpen ? 70 + i * 45 : 0
                        }ms, transform 260ms cubic-bezier(0.6,0.6,0,1) ${
                          ctaOpen ? 70 + i * 45 : 0
                        }ms`,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="p-m font-medium leading-snug text-white">{item.label}</div>
                        <div className="p-s leading-snug mt-0.5 text-white/50">{item.desc}</div>
                      </div>
                      <span className="mt-1 shrink-0 text-white/35 transition-transform group-hover:translate-x-0.5">
                        <ArrowDot />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroNew;
