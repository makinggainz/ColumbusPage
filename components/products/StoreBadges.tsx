"use client";

/**
 * StoreBadges — Apple App Store + Google Play download badges.
 * The site's dark-pill store-badge pattern, mirroring
 * components/home/lightspark/ElioFinalCTA.tsx so download CTAs read
 * consistently across the site. hrefs are placeholders until the real
 * store links land.
 */

function AppleGlyph() {
  return (
    <svg style={{ width: 20, height: 20, flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GooglePlayGlyph() {
  return (
    <svg style={{ width: 20, height: 20, flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
`;

export default function StoreBadges() {
  return (
    <>
      <style>{CSS}</style>
      <a href="#" className="mg-badge" aria-label="Download on the App Store">
        <AppleGlyph />
        <span className="mg-badge-label">
          <span className="mg-badge-l1">Download on the</span>
          <span className="mg-badge-l2">App Store</span>
        </span>
      </a>
      <a href="#" className="mg-badge" aria-label="Get it on Google Play">
        <GooglePlayGlyph />
        <span className="mg-badge-label">
          <span className="mg-badge-l1">GET IT ON</span>
          <span className="mg-badge-l2">Google Play</span>
        </span>
      </a>
    </>
  );
}
