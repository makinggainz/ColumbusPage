"use client";

/**
 * Columbus features cell — stacking-sticky-headers sticky-scroll.
 *
 * Visible panel (the "single div" the user sees) looks like one of
 * the cells under "We're all about maps":
 *   - hairline border-left from .cfc-grid + border-right on cell
 *   - sky-blue radial glow from bottom-right
 *   - top/bottom fade overlays dissolving the gridlines
 *
 * The panel is `position: sticky` and fits in viewport (70vh, centred
 * via `top: 15vh`). The outer cell is tall (N × 100vh) so there's
 * scroll budget for N feature states while the panel stays pinned.
 *
 * Inside the left column:
 *   - TOP: collapsed stack of feature names — every feature with
 *     index < activeIdx is rendered here, dimmed, separated by
 *     hairlines.
 *   - BELOW STACK: the active feature in expanded form — large name +
 *     description + "Learn more".
 *
 * Each feature's name has a unique `layoutId`. When activeIdx
 * advances, Framer Motion sees the same layoutId moving from the
 * "active" position (mid-panel, large) into the collapsed stack
 * (top, small) and smoothly interpolates that transition. That's
 * the "collapses into just the feature name, stays at the top" feel
 * the user described.
 *
 * AnimatePresence wraps the active feature's content so description
 * + Learn more fade in/out cleanly as activeIdx flips.
 *
 * Scroll progress is damped via `useSpring` so quick scrolling
 * doesn't snap between states — it lags slightly and lands smoothly.
 */

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
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

const CSS = `
/* ── wrapper: matches OurProductsSection's grid + fillers ─────────── */
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

/* Cell provides the scroll budget — N × 100vh tall. NO overflow:
   hidden so its sticky child can engage. */
.cfc-cell {
  position: relative;
  background-color: #ffffff;
}

/* ── pinned panel (#columbus-features-sticky) ─────────────────────── */
.cfc-ss-sticky {
  position: sticky;
  top: 15vh;
  height: 70vh;
  width: 100%;
  overflow: hidden;
  background-color: #ffffff;
  background-image:
    radial-gradient(160% 130% at 100% 100%, rgba(125, 211, 252, 0.28), rgba(125, 211, 252, 0.10) 48%, transparent 76%),
    radial-gradient(95% 65% at 100% 100%, rgba(125, 211, 252, 0.42), transparent 58%);
}

/* fades sit inside sticky so they track the pinned panel's edges */
.cfc-fade { pointer-events: none; position: absolute; left: -1px; right: -1px; height: 70px; z-index: 4; }
.cfc-fade--top    { top: 0;    background-image: linear-gradient(#fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }
.cfc-fade--bottom { bottom: 0; background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.64) 54%, rgba(255,255,255,0.06)); }

.cfc-ss-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* ── left column ──────────────────────────────────────────────────── */
.cfc-ss-left {
  display: flex;
  flex-direction: column;
  padding: 56px 36px;
  height: 100%;
  box-sizing: border-box;
  min-width: 0;
}
@media (min-width: 1024px) { .cfc-ss-left { padding: 72px 56px; } }

/* collapsed stack — dim names of features the user has progressed
   past. Each row has a hairline above so they read as a stack. */
.cfc-ss-collapsed-stack {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}
.cfc-ss-collapsed-item {
  font-size: 22px;
  line-height: 1.2;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--color-muted);
  opacity: 0.45;
  padding: 14px 0;
  border-top: 1px solid var(--color-gridline);
}
.cfc-ss-collapsed-item:first-child { border-top: none; padding-top: 0; }
@media (min-width: 1024px) {
  .cfc-ss-collapsed-item { font-size: 26px; padding: 16px 0; }
}

/* active feature — expanded with full content. A hairline above it
   when there's a collapsed stack so the regions read as connected. */
.cfc-ss-active {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 20px;
}
.cfc-ss-active--with-stack {
  border-top: 1px solid var(--color-gridline);
  margin-top: 4px;
}

.cfc-ss-active-name {
  margin: 0;
  font-size: 40px;
  line-height: 1.05;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}
@media (min-width: 1024px) { .cfc-ss-active-name { font-size: 48px; } }

.cfc-ss-active-desc {
  margin: 20px 0 0;
  max-width: 32rem;
  font-size: 17px;
  line-height: 1.5;
  color: var(--color-muted);
}
@media (min-width: 1024px) { .cfc-ss-active-desc { font-size: 19px; } }

.cfc-ss-active-link {
  display: inline-block;
  margin-top: 28px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-brand);
  text-decoration: none;
}
.cfc-ss-active-link:hover { text-decoration: underline; }

/* ── right column ─────────────────────────────────────────────────── */
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

/* ── mobile fallback ──────────────────────────────────────────────── */
@media (max-width: 767px) {
  .cfc-cell { min-height: 0 !important; }
  .cfc-ss-sticky { position: static; top: auto; height: auto; overflow: visible; }
  .cfc-ss-grid { display: flex; flex-direction: column; height: auto; }
  .cfc-ss-left { padding: 48px 28px; height: auto; }
  .cfc-ss-active-name { font-size: 32px; }
  .cfc-ss-active-desc { font-size: 17px; }
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

  // Scroll progress over the cell's onscreen range.
  const { scrollYProgress } = useScroll({
    target: cellRef,
    offset: ["start start", "end end"],
  });

  // Damped progress so quick scrolling lands smoothly between states.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const [activeIdx, setActiveIdx] = useState(0);
  useMotionValueEvent(smoothProgress, "change", (p) => {
    const idx = Math.min(
      FEATURES.length - 1,
      Math.max(0, Math.floor(p * FEATURES.length)),
    );
    setActiveIdx(idx);
  });

  const activeFeature = FEATURES[activeIdx];
  const collapsed = FEATURES.slice(0, activeIdx);

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
              style={{ minHeight: `${FEATURES.length * 100}vh` }}
            >
              <div id="columbus-features-sticky" className="cfc-ss-sticky">
                <div className="cfc-fade cfc-fade--top" aria-hidden />

                <div className="cfc-ss-grid">
                  <div className="cfc-ss-left">
                    {/* Collapsed stack at top — features the user has
                       progressed past. Each name keeps its layoutId so
                       Framer Motion animates the previously-active
                       feature smoothly into this stack. */}
                    {collapsed.length > 0 && (
                      <div className="cfc-ss-collapsed-stack">
                        {collapsed.map((f) => (
                          <motion.div
                            key={f.key}
                            layoutId={`feature-name-${f.key}`}
                            className="cfc-ss-collapsed-item"
                            transition={{
                              duration: 0.55,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            {f.name}
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Active feature — expanded with content. Name has
                       the same layoutId as it would in the collapsed
                       stack, so on activeIdx swap Framer Motion
                       interpolates the position smoothly. */}
                    <div
                      className={
                        collapsed.length > 0
                          ? "cfc-ss-active cfc-ss-active--with-stack"
                          : "cfc-ss-active"
                      }
                    >
                      <motion.h3
                        key={activeFeature.key}
                        layoutId={`feature-name-${activeFeature.key}`}
                        className="cfc-ss-active-name"
                        transition={{
                          duration: 0.55,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {activeFeature.name}
                      </motion.h3>

                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={`content-${activeFeature.key}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <p className="cfc-ss-active-desc">
                            {activeFeature.desc}
                          </p>
                          <a className="cfc-ss-active-link" href="#">
                            Learn more →
                          </a>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

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
                      style={{
                        backgroundColor: `rgba(${activeFeature.glow}, 0.275)`,
                      }}
                    />
                    <SkeletonCard />
                  </div>
                </div>

                <div className="cfc-fade cfc-fade--bottom" aria-hidden />
              </div>
            </div>

            <div className="cfc-filler" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ColumbusFeatureCell;
