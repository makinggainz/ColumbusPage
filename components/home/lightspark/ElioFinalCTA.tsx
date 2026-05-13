"use client";

/**
 * Elio final CTA — mirrors CtaBanner's visual treatment (white card,
 * 1px gridline border, 7px corner radius, sky-blue radial glow +
 * perspective grid emanating from the bottom) but with a richer
 * content layout: primary "Try Elio in browser" pill, App Store +
 * Google Play badges, and a 4.8 / 12K-ratings row.
 *
 * Copy is lifted from Mistx-Elio's ElioFinalCTA.tsx. All hrefs are
 * placeholders (`#`) until real download links land.
 */

function ArrowDots({ className = "" }: { className?: string }) {
  return (
    <svg
      className={"size-3 shrink-0 " + className}
      width="24"
      viewBox="0 0 9 13"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg
      className="size-5 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GooglePlayGlyph() {
  return (
    <svg
      className="size-5 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5 3v18l15-9z" />
    </svg>
  );
}

function StarsRating() {
  // 4.8 / 5 = 96% — sharp gradient stop at 96% gives 4 full stars + the
  // 5th star ~80% filled (4 × 100% + 1 × 80% = 4.8 across the row width).
  const star =
    "M8 1l1.575 4.83h5.075L10.59 8.84l1.54 4.83L8 10.66l-4.13 3.01 1.54-4.83L1.35 5.83h5.075z";
  return (
    <svg
      className="h-4 w-20 shrink-0"
      viewBox="0 0 80 16"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="elio-stars-fill" x1="0" x2="1" y1="0" y2="0">
          <stop offset="96%" stopColor="#154ACC" />
          <stop offset="96%" stopColor="#E7E7F1" />
        </linearGradient>
      </defs>
      {[0, 16, 32, 48, 64].map((x) => (
        <path
          key={x}
          d={star}
          fill="url(#elio-stars-fill)"
          transform={`translate(${x},0)`}
        />
      ))}
    </svg>
  );
}

const CSS = `
.efcta-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .efcta-bounds { margin-left: auto; margin-right: auto; }
}

.efcta-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-gridline);
  border-radius: 7px;
  background: #ffffff;
  padding: 64px 24px 96px;
  text-align: center;
}
@media (min-width: 768px) {
  .efcta-card { padding: 96px 48px 144px; }
}
@media (min-width: 1024px) {
  .efcta-card { padding: 120px 64px 176px; }
}

.efcta-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 95% 75% at 50% 100%,
      rgba(56, 189, 248, 0.30) 0%,
      rgba(56, 189, 248, 0.14) 42%,
      transparent 82%
    );
  pointer-events: none;
  z-index: 1;
}

.efcta-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient( 45deg, rgba(56, 189, 248, 0.18) 0 1px, transparent 1px 40px),
    repeating-linear-gradient(-45deg, rgba(56, 189, 248, 0.18) 0 1px, transparent 1px 40px);
  -webkit-mask-image: radial-gradient(ellipse 95% 75% at 50% 100%, #000 0%, transparent 82%);
  mask-image: radial-gradient(ellipse 95% 75% at 50% 100%, #000 0%, transparent 82%);
  transform: perspective(900px) rotateX(55deg);
  transform-origin: 50% 100%;
  pointer-events: none;
  z-index: 2;
}

.efcta-content {
  position: relative;
  z-index: 3;
  max-width: 720px;
  margin: 0 auto;
}

.efcta-ctas {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 12px;
}

/* App-store + Google Play badges. Same dark pill family as the primary
   CTA (bg-[#1f1f1f], 7px corners, white text on dark) plus a two-line
   label that mimics the canonical store-badge layout. Hover follows the
   project rule: text shifts to #154ACC, no bg change. */
.efcta-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #1f1f1f;
  color: #ffffff;
  border-radius: 7px;
  padding: 8px 16px;
  text-decoration: none;
  transition: color 150ms ease;
}
.efcta-badge:hover { color: #154ACC; }
.efcta-badge-label { display: flex; flex-direction: column; text-align: left; line-height: 1.1; }
.efcta-badge-label-line1 {
  font-size: 10px;
  letter-spacing: 0.02em;
}
.efcta-badge-label-line2 {
  font-size: 14px;
  font-weight: 500;
}

.efcta-rating {
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
`;

export function ElioFinalCTA() {
  return (
    <section className="section">
      <style>{CSS}</style>
      <div className="efcta-bounds">
        <div className="efcta-card">
          <div className="efcta-content">
            <h2 className="h2 tracking-tight text-ink">Find your world now.</h2>
            <p className="p-l text-muted mt-4 max-w-xl mx-auto">
              Free. Smarter. Made for the next thing on your list.
            </p>
            <div className="efcta-ctas">
              <a
                href="#"
                className="group rounded-[7px] px-5 py-2 text-sm flex items-center gap-2 transition-colors bg-[#1f1f1f] text-white hover:text-[#154ACC]"
              >
                Try Elio in browser
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                  <ArrowDots className="text-[#154ACC]" />
                </span>
              </a>
              <a href="#" className="efcta-badge" aria-label="Download on the App Store">
                <AppleGlyph />
                <span className="efcta-badge-label">
                  <span className="efcta-badge-label-line1">Download on the</span>
                  <span className="efcta-badge-label-line2">App Store</span>
                </span>
              </a>
              <a href="#" className="efcta-badge" aria-label="Get it on Google Play">
                <GooglePlayGlyph />
                <span className="efcta-badge-label">
                  <span className="efcta-badge-label-line1">GET IT ON</span>
                  <span className="efcta-badge-label-line2">Google Play</span>
                </span>
              </a>
            </div>
            <div className="p-m text-muted">
              <span className="efcta-rating">
                <StarsRating />
                <span>4.8 · 12K ratings · Free, forever</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ElioFinalCTA;
