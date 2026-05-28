"use client";

/**
 * StoreBadges — Apple App Store + Google Play download badges.
 * The site's dark-pill store-badge pattern, mirroring
 * components/home/lightspark/ElioFinalCTA.tsx so download CTAs read
 * consistently across the site. hrefs are placeholders until the real
 * store links land.
 *
 * `size`:
 *   "default" — small badges (~44px tall), used in the Hero alongside
 *               the small "Try Elio in browser" pill.
 *   "lg"      — large badges (~57px tall), matched to FinalCTASection's
 *               desktop "Try Elio it's free!" pill (px-6 py-4 + 20px
 *               label, rounded-button-lg radius).
 */

function AppleGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg style={{ width: size, height: size, flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GooglePlayGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg style={{ width: size, height: size, flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5 3v18l15-9z" />
    </svg>
  );
}

const CSS = `
.mg-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #1f1f1f;
  color: #ffffff;
  border-radius: var(--radius-button-md, 18px);
  padding: 8px 16px;
  text-decoration: none;
  transition: color 150ms ease;
}
.mg-badge:hover { color: #154ACC; }
.mg-badge-label { display: flex; flex-direction: column; text-align: left; line-height: 1.1; }
.mg-badge-l1 { font-size: 10px; letter-spacing: 0.02em; }
.mg-badge-l2 { font-size: 14px; font-weight: 500; }

/* Large variant — matches FinalCTASection's ~57px tall pill. Same dark
   fill, larger padding + radius + label scale so the badges read at the
   same visual weight as the navy "Try Elio it's free!" CTA next to them. */
.mg-badge--lg {
  gap: 12px;
  border-radius: var(--radius-button-lg, 26px);
  padding: 14px 22px;
}
.mg-badge--lg .mg-badge-l1 { font-size: 12px; }
.mg-badge--lg .mg-badge-l2 { font-size: 18px; font-weight: 600; }

/* Light variant — white pill with dark text, for use over photo
   backgrounds (consumer hero). Hover stays in the cyan band. */
.mg-badge--light { background: #ffffff; color: #0B1342; }
.mg-badge--light:hover { color: #154ACC; }
`;

export default function StoreBadges({
  size = "default",
  light = false,
}: { size?: "default" | "lg"; light?: boolean } = {}) {
  const cls = `mg-badge${size === "lg" ? " mg-badge--lg" : ""}${light ? " mg-badge--light" : ""}`;
  const glyphSize = size === "lg" ? 26 : 20;
  return (
    <>
      <style>{CSS}</style>
      <a
        href="https://mapsgpt.es"
        target="_blank"
        rel="noreferrer"
        className={cls}
        aria-label="Coming soon to the App Store — try Elio in your browser"
      >
        <AppleGlyph size={glyphSize} />
        <span className="mg-badge-label">
          <span className="mg-badge-l1">Coming soon to</span>
          <span className="mg-badge-l2">App Store</span>
        </span>
      </a>
      <a
        href="https://mapsgpt.es"
        target="_blank"
        rel="noreferrer"
        className={cls}
        aria-label="Coming soon to Google Play — try Elio in your browser"
      >
        <GooglePlayGlyph size={glyphSize} />
        <span className="mg-badge-label">
          <span className="mg-badge-l1">COMING SOON TO</span>
          <span className="mg-badge-l2">Google Play</span>
        </span>
      </a>
    </>
  );
}
