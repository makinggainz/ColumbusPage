"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";

/**
 * CircleHero — homepage hero for the "circleUI" redesign concept.
 *
 * The concept: all media lives inside a circular portal, and every piece
 * of text content orbits that circle rather than sitting in a normal
 * column. Here:
 *
 *   • A large circular portal holds the blue ocean footage
 *     (/MistHero.mp4 — sourced from the MistX project, compressed for web).
 *   • The navbar is laid out on the arc of the circle's top rim: four
 *     links (Consumer / Enterprise / Research / Company) plus the globe
 *     logo at top-dead-centre. Each label is rotated to follow the
 *     tangent of the circle so the nav reads as a ring around the portal.
 *   • The H1 sits centred inside the portal, in white over the footage.
 *
 * No sticky <MistxNav> renders on the homepage — this curved ring IS the
 * navigation. Other routes keep the standard nav.
 */

// Top-level links. Angles (via the `.ch-iN` classes in CSS) place each
// label on the rim; the globe logo holds 0° (top-dead-centre).
const NAV: { label: string; href: string; cls: string }[] = [
  { label: "Consumer", href: "/products/mapsgpt", cls: "ch-i0" },
  { label: "Enterprise", href: "/products/business", cls: "ch-i1" },
  { label: "Research", href: "/research", cls: "ch-i2" },
  { label: "Company", href: "/company", cls: "ch-i3" },
];

const CSS = `
.ch-hero {
  position: relative;
  background: #FFFFFF;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: clamp(58px, 8vh, 108px);
  padding-bottom: clamp(48px, 7vh, 110px);
  font-family: var(--font-sans);
  /* Diameter of the portal. Held to the smaller of viewport height /
     width so it always reads as a true circle. The width term subtracts
     76px — the 2×30px PageFrame inset plus a little breathing room — so
     the circle never overflows the rounded card it sits inside. */
  --circle: min(86vh, calc(100vw - 76px));
  /* Distance from the circle centre to a nav label's centre — just
     outside the rim (0.54 = slightly past the 0.5 radius). */
  --rim: calc(var(--circle) * -0.54);
}

/* Square positioning context, exactly the portal's size. The curved nav
   and the circle are both absolutely placed against this. */
.ch-stage {
  position: relative;
  width: var(--circle);
  height: var(--circle);
  flex: none;
}

.ch-circle {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  background: #0a1730;
  box-shadow: 0 30px 80px -30px rgba(11, 27, 43, 0.45);
}

.ch-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

/* Soft radial darkening behind the headline so white type stays legible
   regardless of which frame of the footage is on screen. */
.ch-circle::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 72% 50% at 50% 47%,
    rgba(6, 13, 30, 0.55) 0%,
    rgba(6, 13, 30, 0.20) 46%,
    rgba(6, 13, 30, 0) 72%
  );
  pointer-events: none;
}

.ch-headline {
  position: absolute;
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%);
  width: 80%;
  margin: 0;
  text-align: center;
  color: #ffffff;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: clamp(26px, 4.3vw, 60px);
  line-height: 1.1;
  letter-spacing: -0.025em;
  text-wrap: balance;
  z-index: 2;
}

/* ---- Curved nav ring ------------------------------------------------ */
.ch-nav {
  position: absolute;
  inset: 0;
  z-index: 5;
}

.ch-nav-item,
.ch-logo {
  position: absolute;
  left: 50%;
  top: 50%;
}

/* Each label is translated out to the rim and rotated by --a so it sits
   tangent to the circle. The composite transform keeps the label's
   centre on the arc. --a is set per-item by the .ch-iN classes. */
.ch-nav-item {
  transform: translate(-50%, -50%) rotate(var(--a)) translateY(var(--rim));
  white-space: nowrap;
  font-size: clamp(13px, 1.15vw, 17px);
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #0B1B2B;
  text-decoration: none;
  transition: color 0.2s ease;
}
.ch-nav-item:hover {
  color: #0081AC;
}

.ch-logo {
  transform: translate(-50%, -50%) translateY(var(--rim));
  display: flex;
}
.ch-logo img {
  display: block;
  /* Force the logo to the brand navy so it reads as a dark icon on the
     white field (same filter the standard nav uses). */
  filter: brightness(0) saturate(100%) invert(8%) sepia(80%)
    saturate(1400%) hue-rotate(215deg) brightness(90%);
}

/* Per-item rim angle. 0° is top-dead-centre (the logo). */
.ch-i0 { --a: -29deg; }
.ch-i1 { --a: -13deg; }
.ch-i2 { --a: 13deg; }
.ch-i3 { --a: 29deg; }

/* Narrow viewports: the circle shrinks, so the labels need a wider
   angular spread to clear the logo and each other. */
@media (max-width: 620px) {
  .ch-i0 { --a: -43deg; }
  .ch-i1 { --a: -19deg; }
  .ch-i2 { --a: 19deg; }
  .ch-i3 { --a: 43deg; }
}
`;

export function CircleHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // SSR doesn't emit the `muted` attribute, so browsers can block
  // autoplay — explicitly mute + play, with a `canplay` retry.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => {
      v.play().catch(() => {});
    };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <section className="ch-hero" aria-label="Columbus hero" data-hero-section>
      <style>{CSS}</style>
      <div className="ch-stage">
        <nav className="ch-nav" aria-label="Main navigation">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className={`ch-nav-item ${n.cls}`}>
              {n.label}
            </a>
          ))}
          <a href="/" className="ch-logo" aria-label="Columbus home">
            <img src="/logobueno.png" alt="Columbus" width={38} height={38} />
          </a>
        </nav>

        <div className="ch-circle">
          <video
            ref={videoRef}
            className="ch-video"
            src="/MistHero.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden
          />
          <h1 className="ch-headline">
            The frontier research lab building geospatial reasoning for the
            real world.
          </h1>
        </div>
      </div>
    </section>
  );
}

export default CircleHero;
