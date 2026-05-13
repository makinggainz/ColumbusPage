"use client";

/**
 * Columbus features cell — sticky-scroll variant.
 *
 * Wrapper structure matches the three cells under "We're all about
 * maps" (`components/home/OurProductsSection.tsx`): a `.cfc-grid` with
 * `border-left`, empty `.cfc-filler` rows above and below the actual
 * cell, plus top/bottom fade overlays that dissolve the vertical
 * gridlines into the page surface.
 *
 * Inside the cell:
 *   - Left column scrolls naturally with the page. Each feature
 *     (Map Chat / Data Digestion / Site Selection and Audits) gets a
 *     viewport-tall block with a title, lorem-ipsum description, and
 *     "Learn more" link.
 *   - Right column is `position: sticky` (md+) so it stays in view
 *     while the features scroll past on the left.
 *   - An IntersectionObserver per feature flips `activeIdx` when a
 *     feature crosses the middle band of the viewport. The active
 *     feature drives the right column's radial-glow colour and the
 *     plate behind the white skeleton card.
 *
 * The glow itself is rendered as three stacked layers — one per
 * feature — cross-faded by opacity. Browsers can't smoothly
 * interpolate `background-image` directly, but they can interpolate
 * opacity, so this gives a smooth recolour without `@property` hacks.
 *
 * Per-feature colours are pastel rainbow (Tailwind ~300 lightness)
 * so they read as the same family as the sky-blue default used on
 * the 3-up cells.
 *
 * Cell visible (sticky) viewport on lg: 728px — the prior static cell
 * was 520px; +40% per the requested height bump.
 */

import { useEffect, useRef, useState } from "react";

interface Feature {
  key: string;
  name: string;
  desc: string;
  /** rgb triplet (no `rgba()` wrap) consumed by both the radial-glow
   *  layer for this feature and the card-bg plate when active. */
  glow: string;
}

const FEATURES: Feature[] = [
  {
    key: "map-chat",
    name: "Map Chat",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    glow: "253, 164, 175", // rose-300
  },
  {
    key: "data-digestion",
    name: "Data Digestion",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    glow: "252, 211, 77", // amber-300
  },
  {
    key: "site-selection",
    name: "Site Selection and Audits",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    glow: "196, 181, 253", // violet-300
  },
];

const CSS = `
/* wrapper — supplies the left vertical hairline; cells supply right */
.cfc-grid {
  position: relative;
  width: 100%;
  margin-inline: auto;
  border-left: 1px solid var(--color-gridline);
}
.cfc-grid-inner { display: grid; grid-template-columns: 1fr; }

.cfc-cell,
.cfc-filler {
  border-bottom: 1px solid var(--color-gridline);
  border-right: 1px solid var(--color-gridline);
}
.cfc-filler { display: none; min-height: 64px; }
@media (min-width: 640px) { .cfc-filler { display: block; } }

/* actual content cell — white surface; the radial glow now lives on
   the right column (.cfc-ss-visual) so it tracks the sticky viewport
   rather than rendering once across a 2000px-tall cell */
.cfc-cell {
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}

/* white fades top + bottom of the wrapper — cover the filler rows
   and dissolve the gridlines into the page surface */
.cfc-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 4; }
.cfc-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.cfc-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }

/* ── sticky-scroll two-column layout ─────────────────────────────── */

.cfc-ss-grid {
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) {
  .cfc-ss-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }
}

/* left column — vertical stack of feature blocks. Each block is
   roughly one sticky-viewport tall on md/lg so the user scrolls one
   feature at a time past the sticky right column. */
.cfc-ss-features { display: flex; flex-direction: column; }

.cfc-ss-feature {
  position: relative;
  padding: 48px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (min-width: 768px) {
  .cfc-ss-feature {
    min-height: 640px;
    padding: 64px 36px;
  }
}
@media (min-width: 1024px) {
  .cfc-ss-feature {
    min-height: 728px;
    padding: 88px 44px;
  }
}

.cfc-ss-name {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}
@media (min-width: 1024px) { .cfc-ss-name { font-size: 32px; } }

.cfc-ss-desc {
  margin: 16px 0 0;
  max-width: 36rem;
  font-size: 17px;
  line-height: 1.5;
  color: var(--color-muted);
}
@media (min-width: 1024px) { .cfc-ss-desc { font-size: 19px; } }

.cfc-ss-link {
  margin-top: 24px;
  align-self: flex-start;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-brand);
  text-decoration: none;
}
.cfc-ss-link:hover { text-decoration: underline; }

/* active feature gets a subtle inkward shift in title weight so the
   user can read at a glance which feature is "current" */
.cfc-ss-feature[data-active="true"] .cfc-ss-name {
  font-weight: 500;
}

/* right column — sticky visual that stays in view while the left
   features scroll past. Hidden on mobile (features stand alone). */
.cfc-ss-visual {
  display: none;
}
@media (min-width: 768px) {
  .cfc-ss-visual {
    display: block;
    position: sticky;
    top: 0;
    align-self: start;
    height: 640px;
    overflow: hidden;
  }
}
@media (min-width: 1024px) {
  .cfc-ss-visual { height: 728px; }
}

/* glow layers — one per feature, all stacked and absolutely
   positioned inside .cfc-ss-visual. The active one is opacity 1, the
   others 0; transition gives a smooth crossfade as activeIdx flips. */
.cfc-ss-glow {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transition: opacity 500ms ease;
}

/* sky-blue plate behind the white card — colour tracks the active
   feature via inline style (rgba alpha 0.275); the css-controlled
   transition smooths the colour swap */
.cfc-card-bg {
  position: absolute;
  right: 36px;
  bottom: 36px;
  left: 36px;
  top: calc(36% - 7px);
  z-index: 1;
  border: 1px solid #ffffff;
  border-radius: 16px 0 0 0;
  box-sizing: border-box;
  transition: background-color 500ms ease;
}
@media (min-width: 1024px) {
  .cfc-card-bg { right: 44px; bottom: 44px; left: 44px; top: calc(34% - 8px); }
}

/* white card pinned bottom of right column with a skeleton UI mock */
.cfc-card {
  position: absolute;
  right: 36px;
  bottom: 36px;
  left: 36px;
  top: 36%;
  z-index: 2;
  background: #ffffff;
  border-radius: 12px 0 0 0;
  overflow: hidden;
  display: flex;
  gap: 18px;
  padding: 24px;
  box-sizing: border-box;
}
@media (min-width: 1024px) {
  .cfc-card { right: 44px; bottom: 44px; left: 44px; top: 34%; padding: 28px; gap: 22px; }
}

.cfc-skel-sq { flex: 0 0 32%; align-self: stretch; border-radius: 10px; background: #F0F1F4; }
.cfc-skel-lines { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 12px; }
@media (min-width: 1024px) { .cfc-skel-lines { gap: 14px; } }
.cfc-skel-line { height: 12px; border-radius: 4px; background: #F0F1F4; }
.cfc-skel-line:nth-child(2) { width: 92%; }
.cfc-skel-line:nth-child(3) { width: 84%; }
.cfc-skel-line:nth-child(4) { width: 78%; }
.cfc-skel-line:nth-child(5) { width: 64%; }
.cfc-skel-line:last-child { width: 46%; }
`;

function SkeletonCard() {
  return (
    <div className="cfc-card" aria-hidden>
      <div className="cfc-skel-sq" />
      <div className="cfc-skel-lines">
        <div className="cfc-skel-line" />
        <div className="cfc-skel-line" />
        <div className="cfc-skel-line" />
        <div className="cfc-skel-line" />
        <div className="cfc-skel-line" />
        <div className="cfc-skel-line" />
      </div>
    </div>
  );
}

export function ColumbusFeatureCell() {
  const [activeIdx, setActiveIdx] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    featureRefs.current.forEach((el, idx) => {
      if (!el) return;
      // 20vh-tall band at the middle of the viewport. When a feature
      // block intersects this band it becomes "active" and the right
      // column's gradient + plate recolour to match.
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(idx);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const activeGlow = FEATURES[activeIdx].glow;

  return (
    <section className="section">
      <style>{CSS}</style>
      <div className="container-site">
        <div className="cfc-grid">
          <div className="cfc-grid-inner">
            <div className="cfc-filler" aria-hidden />

            <div className="cfc-cell">
              <div className="cfc-ss-grid">
                {/* left — scrolling features */}
                <div className="cfc-ss-features">
                  {FEATURES.map((f, i) => (
                    <div
                      key={f.key}
                      ref={(el) => {
                        featureRefs.current[i] = el;
                      }}
                      className="cfc-ss-feature"
                      data-active={activeIdx === i}
                    >
                      <h3 className="cfc-ss-name">{f.name}</h3>
                      <p className="cfc-ss-desc">{f.desc}</p>
                      <a className="cfc-ss-link" href="#">
                        Learn more →
                      </a>
                    </div>
                  ))}
                </div>

                {/* right — sticky visual; gradient crossfades by
                    swapping opacity across stacked layers */}
                <div className="cfc-ss-visual">
                  {FEATURES.map((f, i) => (
                    <div
                      key={f.key}
                      className="cfc-ss-glow"
                      aria-hidden
                      style={{
                        opacity: activeIdx === i ? 1 : 0,
                        backgroundImage: `radial-gradient(160% 130% at 100% 100%, rgba(${f.glow}, 0.28), rgba(${f.glow}, 0.10) 48%, transparent 76%), radial-gradient(95% 65% at 100% 100%, rgba(${f.glow}, 0.42), transparent 58%)`,
                      }}
                    />
                  ))}
                  <div
                    className="cfc-card-bg"
                    aria-hidden
                    style={{ backgroundColor: `rgba(${activeGlow}, 0.275)` }}
                  />
                  <SkeletonCard />
                </div>
              </div>
            </div>

            <div className="cfc-filler" aria-hidden />
          </div>

          <div className="cfc-fade cfc-fade--top" aria-hidden />
          <div className="cfc-fade cfc-fade--bottom" aria-hidden />
        </div>
      </div>
    </section>
  );
}

export default ColumbusFeatureCell;
