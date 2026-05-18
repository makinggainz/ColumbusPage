/* eslint-disable @next/next/no-img-element */

/**
 * MapsGPT product hero.
 *
 * Layout ported 1:1 from the MistX `/elio` hero — a centred headline
 * block (brand mark, headline, subhead, CTA row, rating) sitting in the
 * upper third, with the platform screenshot below it.
 *
 * Restyled to the Columbus homepage design system: Funnel Display
 * headings via the global `.h1` class, the navy/blue palette
 * (--color-ink / --color-cta / #0081AC accent), the homepage signature
 * CTA pill + 5-dot ArrowDots glyph, the 1287px content bounds, and the
 * HeroNew "floating-div" treatment (navbar pulled behind, 30px bottom
 * gutter, rounded bottom corners).
 *
 * Background: the elio hero's warm-sand beach scene. Product display:
 * the same glass browser-window frame used on the /products/business
 * hero (traffic lights + tab strip + translucent glass gutter).
 */

const CSS = `
.mh-hero {
  position: relative;
  overflow: hidden;
  /* Warm-sand base + the elio beach scene at the top, fading into the
     sand below it — ported from the MistX /elio hero. */
  background-color: #FCF3E8;
  background-image: url('/mapsgpt-hero-bg.png');
  background-size: 100% auto;
  background-position: top center;
  background-repeat: no-repeat;
  /* Navbar is sticky in flow; the hero is pulled up behind it so the
     navbar reads as part of the hero. -120px (not -80px) — comfortably
     more than the navbar height — so no white PageFrame card peeks
     through above the photo background at any breakpoint (same trick as
     BusinessHero); the overshoot is harmlessly clipped by the frame.
     padding-top gives the height back so content stays clear of the nav. */
  margin-top: -120px;
  padding-top: 120px;
  /* Floating-div treatment — matches HeroNew so the hero reads as a card
     inside the PageFrame: 30px bottom gutter + rounded bottom corners. */
  margin-bottom: 30px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  font-family: var(--font-sans);
  color: var(--color-ink);
}

/* Bottom fade — the warm sand resolves to white so the hero hands off
   cleanly to the white section below it (same treatment as HeroNew). */
.mh-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 55%, #FFFFFF 100%);
  pointer-events: none;
  z-index: 0;
}

.mh-bounds {
  position: relative;
  z-index: 1;
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
  padding-top: 128px;
  padding-bottom: 72px;
}
@media (min-width: 768px) {
  .mh-bounds {
    margin-left: auto;
    margin-right: auto;
    padding-top: 188px;
    padding-bottom: 120px;
  }
}

/* Headline column — centred, capped at the reading-column width. */
.mh-head {
  max-width: 768px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 28px;
}
@media (min-width: 768px) { .mh-head { gap: 36px; } }

/* Brand mark — logo + wordmark, a quiet label above the headline. */
.mh-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-muted);
}
.mh-brand img { height: 30px; width: auto; object-fit: contain; }

.mh-title {
  margin: 0;
  text-wrap: balance;
  max-width: 18ch;
}

.mh-lead {
  margin: 0;
  max-width: 32rem;
  font-size: 18px;
  line-height: 1.5;
  font-weight: 400;
  color: var(--color-muted);
}
@media (min-width: 1024px) { .mh-lead { font-size: 20px; } }

.mh-cta-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.mh-cta-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

/* Primary CTA — the homepage signature pill (.bp-cta): navy surface,
   white label that swaps to #0081AC on hover, 5-dot ArrowDots glyph. */
.mh-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background-color: var(--color-cta);
  color: #FFFFFF;
  border-radius: var(--radius-button-md);
  font-size: var(--typography--p-l);
  line-height: 1;
  font-weight: 500;
  white-space: nowrap;
  text-decoration: none;
  transition: color 180ms ease;
}
.mh-cta:hover { color: #0081AC; }
.mh-cta-arrow {
  display: inline-block;
  color: #0081AC;
  transition: transform 180ms ease;
}
.mh-cta:hover .mh-cta-arrow { transform: translateX(2px); }
.mh-cta-arrow svg { display: block; }

/* App-store badges — same navy surface as the CTA, on the homepage
   palette (the MistX badges were #1f1f1f). */
.mh-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background-color: var(--color-cta);
  color: #FFFFFF;
  border-radius: var(--radius-button-md);
  text-decoration: none;
  transition: opacity 180ms ease;
}
.mh-badge:hover { opacity: 0.85; }
.mh-badge > svg { width: 22px; height: 22px; flex-shrink: 0; }
.mh-badge-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.1;
  gap: 1px;
}
.mh-badge-text .small { font-size: 9px; font-weight: 500; opacity: 0.8; }
.mh-badge-text .big { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }

/* Rating row. */
.mh-rating-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 14px;
}
.mh-stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #0081AC;
}
.mh-stars svg { width: 14px; height: 14px; }
.mh-rating-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-muted);
  font-variant-numeric: tabular-nums;
}
.mh-dot { color: var(--color-gridline); }
.mh-free { font-size: 13px; color: var(--color-muted); }

/* ── Product display — glass browser window, ported from BusinessHero ──
   An outer 1.5px gradient ring + a translucent blurred-glass window
   carrying traffic lights, a tab strip, and the screenshot inset 4px so
   the glass shows around it as a gutter. */
.mh-shot { margin-top: 56px; }
@media (min-width: 768px) { .mh-shot { margin-top: 80px; } }

.mh-frame {
  /* Spans the full 1287px content bounds (.mh-bounds). */
  width: 100%;
  margin: 0 auto;
  /* Concentric with the window: 20px window radius + 1.5px ring. */
  border-radius: 21.5px;
  padding: 1.5px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(255, 255, 255, 0.28) 38%,
    rgba(255, 255, 255, 0.04) 62%,
    rgba(255, 255, 255, 0.55) 100%
  );
  box-shadow: 0 30px 70px rgba(11, 27, 43, 0.28),
              0 2px 10px rgba(11, 27, 43, 0.12);
}

.mh-window {
  position: relative;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.3);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
}

.mh-titlebar {
  display: flex;
  align-items: center;
  gap: clamp(7px, 0.8vw, 10px);
  height: clamp(34px, 3.4vw, 46px);
  padding-left: clamp(15px, 1.7vw, 24px);
  padding-right: clamp(12px, 1.5vw, 20px);
}
.mh-light {
  width: clamp(10px, 1vw, 13px);
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
}

.mh-tabs {
  display: flex;
  align-items: center;
  gap: clamp(7px, 0.9vw, 12px);
  margin-left: clamp(12px, 1.5vw, 22px);
  height: 100%;
  flex: 1;
  min-width: 0;
}
.mh-tab {
  display: flex;
  align-items: center;
  gap: clamp(4px, 0.5vw, 7px);
  height: 70%;
  padding-left: clamp(8px, 0.9vw, 13px);
  padding-right: clamp(6px, 0.7vw, 10px);
  border-radius: clamp(6px, 0.6vw, 9px);
  flex: 1 1 0;
  min-width: 0;
  max-width: 185px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.22);
}
.mh-tab--active {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.6);
}
.mh-tab-fav {
  width: clamp(11px, 1.2vw, 16px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: linear-gradient(135deg, #74A0FE 0%, #1451E8 100%);
  flex-shrink: 0;
}
.mh-tab-label {
  font-size: clamp(8px, 0.85vw, 12px);
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
  color: var(--color-muted);
}
.mh-tab--active .mh-tab-label { color: var(--color-ink); }
.mh-tab-x {
  font-size: clamp(9px, 1vw, 13px);
  line-height: 1;
  color: var(--color-muted);
  flex-shrink: 0;
}

/* Screenshot inset 4px so the window glass shows around it as a gutter. */
.mh-window-pad { padding: 4px; }
.mh-window-img {
  border-radius: 16px;
  overflow: hidden;
}
.mh-window-img img {
  display: block;
  width: 100%;
  height: auto;
}
`;

/* Signature 5-dot diagonal arrow — shared with BentoProducts / Careers /
   the company-page CTAs. */
function ArrowDots() {
  return (
    <svg width="12" height="13" viewBox="0 0 9 13" fill="none" aria-hidden="true">
      <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
      <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
      <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
    </svg>
  );
}

function AppStoreBadge() {
  return (
    <a href="https://mapsgpt.es" className="mh-badge" aria-label="Download on the App Store">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.05 12.04c-.03-2.93 2.4-4.34 2.5-4.41-1.36-1.99-3.49-2.27-4.24-2.3-1.81-.18-3.53 1.06-4.45 1.06-.92 0-2.34-1.04-3.85-1.01-1.98.03-3.81 1.15-4.83 2.91-2.06 3.57-.53 8.84 1.48 11.74.99 1.42 2.16 3.02 3.69 2.96 1.49-.06 2.05-.96 3.85-.96 1.79 0 2.31.96 3.88.93 1.6-.03 2.61-1.45 3.59-2.88 1.13-1.65 1.6-3.25 1.62-3.34-.04-.01-3.11-1.19-3.14-4.7zM14.18 3.95c.82-1 1.37-2.4 1.22-3.78-1.18.05-2.6.78-3.45 1.78-.76.88-1.43 2.29-1.25 3.66 1.32.1 2.65-.67 3.48-1.66z" />
      </svg>
      <span className="mh-badge-text">
        <span className="small">Download on the</span>
        <span className="big">App Store</span>
      </span>
    </a>
  );
}

function PlayStoreBadge() {
  return (
    <a href="https://mapsgpt.es" className="mh-badge" aria-label="Get it on Google Play">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="mh-play-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#0078FF" />
          </linearGradient>
          <linearGradient id="mh-play-b" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFCE00" />
            <stop offset="100%" stopColor="#FFB000" />
          </linearGradient>
          <linearGradient id="mh-play-c" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF3A44" />
            <stop offset="100%" stopColor="#C31162" />
          </linearGradient>
          <linearGradient id="mh-play-d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#01E16C" />
            <stop offset="100%" stopColor="#00B14B" />
          </linearGradient>
        </defs>
        <path d="M3.6 1.4c-.3.3-.5.7-.5 1.3v18.6c0 .5.2 1 .5 1.2L13.4 12 3.6 1.4z" fill="url(#mh-play-a)" />
        <path d="M16.4 15l-3-3 3-3 4.1 2.4c1.2.7 1.2 1.8 0 2.5L16.4 15z" fill="url(#mh-play-b)" />
        <path d="M16.4 9l-12.8 13c.4.4 1 .4 1.7 0l11.1-6.4-3-3 3-3.6z" fill="url(#mh-play-c)" />
        <path d="M16.4 9L5.3 2.6c-.7-.4-1.3-.4-1.7 0l12.8 13L19.4 9h-3z" fill="url(#mh-play-d)" />
      </svg>
      <span className="mh-badge-text">
        <span className="small">GET IT ON</span>
        <span className="big">Google Play</span>
      </span>
    </a>
  );
}

function StarRating() {
  return (
    <div className="mh-rating-row">
      <span className="mh-stars" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </span>
      <span className="mh-rating-text">4.8 · 12K ratings</span>
      <span className="mh-dot" aria-hidden="true">·</span>
      <span className="mh-free">Free, forever</span>
    </div>
  );
}

/* Browser-window tabs in the product frame — static (the business hero's
   drag-to-reorder is a page-specific easter egg, not the framing). */
const WINDOW_TABS = ["MapsGPT", "Discover", "My Trips", "New Tab"];
const TRAFFIC_LIGHTS = ["#FF5F57", "#FEBC2E", "#28C840"];

export function Hero() {
  return (
    <section className="mh-hero" aria-label="MapsGPT" data-hero-section>
      <style>{CSS}</style>
      <div className="mh-bounds">
        <div className="mh-head">
          <div className="mh-brand">
            <img src="/MapsGPT-logo.png" alt="" aria-hidden="true" />
            MapsGPT
          </div>

          <h1 className="h1 mh-title tracking-tight text-ink">
            Find your next anything.
          </h1>

          <p className="mh-lead">
            A smarter, more social map for every spot on your list.
          </p>

          <div className="mh-cta-group">
            <div className="mh-cta-row">
              <a className="mh-cta" href="https://mapsgpt.es">
                Try MapsGPT
                <span className="mh-cta-arrow">
                  <ArrowDots />
                </span>
              </a>
              <AppStoreBadge />
              <PlayStoreBadge />
            </div>
            <StarRating />
          </div>
        </div>

        {/* Product display — glass browser window (same frame as the
            /products/business hero). */}
        <div className="mh-shot">
          <div className="mh-frame">
            <div className="mh-window">
              <div className="mh-titlebar">
                {TRAFFIC_LIGHTS.map((c) => (
                  <span key={c} className="mh-light" style={{ backgroundColor: c }} />
                ))}
                <div className="mh-tabs">
                  {WINDOW_TABS.map((label, i) => (
                    <div
                      key={label}
                      className={i === 0 ? "mh-tab mh-tab--active" : "mh-tab"}
                    >
                      <span className="mh-tab-fav" aria-hidden="true" />
                      <span className="mh-tab-label">{label}</span>
                      <span className="mh-tab-x" aria-hidden="true">×</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mh-window-pad">
                <div className="mh-window-img">
                  <img
                    src="/mapsgptdesktopimg.png"
                    alt="MapsGPT — map view with a conversational chat panel"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
