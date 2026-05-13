"use client";

/**
 * Columbus features cell — sticky-scroll, layerzero-style.
 *
 * Visual ref: the user's screenshot, which shows all three feature
 * NAMES stacked on the left at all times; only the *active* feature's
 * description + "Learn more" link reveals below its name. The right
 * column updates its radial glow + card-bg plate to the active
 * feature's colour.
 *
 * Mechanic:
 *   - Outer `.cfc-cell` is intentionally tall (N × STEP_HEIGHT) so the
 *     section has scroll budget for N progress states.
 *   - `.cfc-ss-sticky` inside the cell sticks at `top: 0` for the
 *     whole stuck phase — the page appears pinned.
 *   - `useScroll` on the cell ref drives `activeIdx` via
 *     `useMotionValueEvent` (floor(progress × N)).
 *   - Each feature row pairs an always-visible `<h3>` with a
 *     CSS-transitioned `.cfc-ss-content` wrapper (max-height + opacity)
 *     that collapses to 0 when inactive.
 *
 * Sticky bug fix from the prior version: `overflow: hidden` on
 * `.cfc-cell` made the cell itself the sticky scrollport, but the cell
 * isn't actually scrollable — so sticky never engaged. Removing it
 * lets sticky fall back to the viewport scrollport. Clipping that
 * was previously on the cell is no longer needed (the moving stack
 * is gone); the right-column visual keeps its own `overflow: hidden`
 * to clip the radial glow + skeleton card.
 *
 * Wrapper preserved from earlier versions:
 *   .cfc-grid with `border-left` + .cfc-filler rows above and below +
 *   top/bottom fade overlays — so the vertical hairlines still extend
 *   past the cell and dissolve into the page surface, matching the
 *   three cells under "We're all about maps".
 */

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";

interface Feature {
  key: string;
  name: string;
  desc: string;
  /** rgb triplet (no `rgba()` wrap) — drives the radial-glow layer
   *  for this feature and the card-bg plate when active. */
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

// One scroll "step" worth of cell height. STEP_HEIGHT === sticky-inner
// height so one full step of page scroll progresses the section by
// 1/N of total progress, which advances `activeIdx` by one. 728 =
// +40% over the prior 520px static cell.
const STEP_HEIGHT = 728;

const CSS = `
/* ── wrapper: matches OurProductsSection's grid + fillers + fades ── */
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

/* NOTE: NO overflow: hidden on .cfc-cell — that would make the cell
   itself the sticky scrollport and break the sticky inner. The cell
   is a tall container that the sticky inner pins inside. */
.cfc-cell {
  position: relative;
  background-color: #ffffff;
}

.cfc-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 4; }
.cfc-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.cfc-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }

/* ── desktop sticky-scroll ───────────────────────────────────────── */
.cfc-ss-sticky {
  position: sticky;
  top: 0;
  height: ${STEP_HEIGHT}px;
}

.cfc-ss-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  height: 100%;
}

/* left column — vertical stack of feature rows, all names always
   visible; only the active one expands its content. */
.cfc-ss-features {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;
  padding: 64px 44px;
  height: 100%;
  box-sizing: border-box;
}

.cfc-ss-step {
  position: relative;
}

.cfc-ss-name {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--color-muted);
  opacity: 0.55;
  transition: color 300ms ease, opacity 300ms ease;
}
@media (min-width: 1024px) { .cfc-ss-name { font-size: 32px; } }

.cfc-ss-step[data-active="true"] .cfc-ss-name {
  color: var(--color-ink);
  opacity: 1;
}

/* expanding content wrapper — max-height + opacity transitions give
   a smooth reveal/collapse as activeIdx changes */
.cfc-ss-content {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  transition: max-height 450ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 280ms ease,
              margin-top 450ms cubic-bezier(0.22, 1, 0.36, 1);
}
.cfc-ss-step[data-active="true"] .cfc-ss-content {
  max-height: 320px;
  opacity: 1;
  margin-top: 16px;
}

.cfc-ss-desc {
  margin: 0;
  max-width: 36rem;
  font-size: 17px;
  line-height: 1.5;
  color: var(--color-ink);
}
@media (min-width: 1024px) { .cfc-ss-desc { font-size: 19px; } }

.cfc-ss-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-brand);
  text-decoration: none;
}
.cfc-ss-link:hover { text-decoration: underline; }

/* right column — visual canvas; glow layers crossfade for smooth
   colour transition; card-bg plate retains its existing position
   under the white skeleton card */
.cfc-ss-visual {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.cfc-ss-glow {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transition: opacity 500ms ease;
}

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

/* ── mobile fallback: no sticky, no scroll behaviour ──────────────── */
@media (max-width: 767px) {
  .cfc-cell { min-height: 0 !important; }
  .cfc-ss-sticky { position: static; height: auto; }
  .cfc-ss-grid { display: flex; flex-direction: column; height: auto; }
  .cfc-ss-features { padding: 48px 28px; gap: 24px; height: auto; }
  /* on mobile, all features show their content (no scroll mechanic) */
  .cfc-ss-name { color: var(--color-ink) !important; opacity: 1 !important; }
  .cfc-ss-content { max-height: 320px !important; opacity: 1 !important; margin-top: 12px !important; }
  .cfc-ss-visual { display: none; }
}
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
  const cellRef = useRef<HTMLDivElement>(null);

  // Progress from "cell top hits viewport top" to "cell bottom hits
  // viewport bottom". Since cell-height = N × STEP_HEIGHT and the
  // sticky inner ≤ viewport-height on a typical desktop, this maps
  // cleanly across the stuck phase.
  const { scrollYProgress } = useScroll({
    target: cellRef,
    offset: ["start start", "end end"],
  });

  // activeIdx = floor(progress × N), clamped — gives clean thresholds
  // at progress = 1/N, 2/N, ... so each feature owns 1/N of the
  // section's scroll budget.
  const [activeIdx, setActiveIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(
      FEATURES.length - 1,
      Math.max(0, Math.floor(p * FEATURES.length)),
    );
    setActiveIdx(idx);
  });

  const activeGlow = FEATURES[activeIdx].glow;
  const cellHeight = FEATURES.length * STEP_HEIGHT;

  return (
    <section className="section">
      <style>{CSS}</style>
      <div className="container-site">
        <div className="cfc-grid">
          <div className="cfc-grid-inner">
            <div className="cfc-filler" aria-hidden />

            <div
              ref={cellRef}
              className="cfc-cell"
              style={{ minHeight: `${cellHeight}px` }}
            >
              <div className="cfc-ss-sticky">
                <div className="cfc-ss-grid">
                  {/* left — all feature names visible; active one
                      expands its description + Learn more */}
                  <div className="cfc-ss-features">
                    {FEATURES.map((f, i) => (
                      <div
                        key={f.key}
                        className="cfc-ss-step"
                        data-active={activeIdx === i}
                      >
                        <h3 className="cfc-ss-name">{f.name}</h3>
                        <div className="cfc-ss-content">
                          <p className="cfc-ss-desc">{f.desc}</p>
                          <a className="cfc-ss-link" href="#">
                            Learn more →
                          </a>
                        </div>
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
