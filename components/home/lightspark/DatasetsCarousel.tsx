"use client";

/**
 * "High fidelity and smart data sets." — a centred section heading
 * sitting in the home-page content bounds (1287px), followed by a
 * full-bleed scrolling carousel of partner logos that runs from the
 * left viewport edge to the right viewport edge.
 *
 * The logo assets and the grayscale-blue tint match `PartnerStrip`
 * (`/Icon/logo1.png`…`logo7.png`) so the carousel reads as the same
 * partner-vetted-data family of imagery the home page already uses.
 *
 * Typography follows `design-system/fonts-typescale.md` — section
 * headings at 25 / 31 / 39 px, weight 500, tracking -0.02em — same
 * scale used across the rest of the home page (PartnerStrip,
 * Capabilities, etc.). Section vertical rhythm uses the catcherX
 * `.section` class (`py-20 lg:py-28`) so it slots into the rest of
 * the Lightspark band cleanly.
 */

import Image from "next/image";

// Same logos PartnerStrip uses, so this carousel reads as the same
// "We vet our data with reputable partner organizations" family.
const LOGOS = [
  "/Icon/logo1.png",
  "/Icon/logo2.png",
  "/Icon/image1.png",
  "/Icon/logo4.png",
  "/Icon/image2.png",
  "/Icon/logo6.png",
  "/Icon/logo7.png",
];

// Duplicated so the marquee can wrap seamlessly via translateX(-50%).
const SCROLL_LOGOS = [...LOGOS, ...LOGOS];

// Same tint as PartnerStrip — desaturates the logos to a soft blue-gray.
const LOGO_TINT = "grayscale(100%) sepia(40%) hue-rotate(190deg) saturate(120%)";

const CSS = `
.dcr-section {
  /* .section gives us py-20 lg:py-28 — keep that vertical rhythm */
}

.dcr-heading {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
  text-align: center;
}
@media (min-width: 768px) {
  .dcr-heading { margin-left: auto; margin-right: auto; }
}

.dcr-title {
  margin: 0;
  color: #1D1D1F;
  font-weight: 500;
  letter-spacing: -0.02em;
  font-size: 25px;
  line-height: 1.15;
}
@media (min-width: 768px) { .dcr-title { font-size: 31px; } }
@media (min-width: 1024px) { .dcr-title { font-size: 39px; } }

/* full-bleed carousel — relative-positioned with overflow hidden to
   clip the scrolling track; fade overlays on either edge to soften
   where the track meets the viewport. */
.dcr-track-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 56px;
}
@media (min-width: 1024px) { .dcr-track-wrap { margin-top: 80px; } }

.dcr-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 120px;
  z-index: 2;
  pointer-events: none;
}
.dcr-fade--left {
  left: 0;
  background-image: linear-gradient(to right, #ffffff, rgba(255,255,255,0));
}
.dcr-fade--right {
  right: 0;
  background-image: linear-gradient(to left, #ffffff, rgba(255,255,255,0));
}

.dcr-track {
  display: flex;
  align-items: center;
  gap: 88px;
  width: max-content;
  animation: dcr-scroll 30s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .dcr-track { animation: none; }
}
.dcr-track-wrap:hover .dcr-track { animation-play-state: paused; }

.dcr-logo {
  flex-shrink: 0;
  height: 36px;
  width: auto;
  object-fit: contain;
  filter: ${LOGO_TINT};
  opacity: 0.25;
}

@keyframes dcr-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

export function DatasetsCarousel() {
  return (
    <section className="section">
      <style>{CSS}</style>

      <div className="dcr-heading">
        <h2 className="dcr-title">High fidelity and smart data sets.</h2>
      </div>

      <div className="dcr-track-wrap">
        <div className="dcr-fade dcr-fade--left" aria-hidden />
        <div className="dcr-fade dcr-fade--right" aria-hidden />
        <div className="dcr-track">
          {SCROLL_LOGOS.map((src, i) => (
            <Image
              key={`${src}-${i}`}
              src={src}
              alt=""
              width={175}
              height={62}
              className="dcr-logo"
              aria-hidden
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DatasetsCarousel;
