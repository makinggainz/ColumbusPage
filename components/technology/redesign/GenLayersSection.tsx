"use client";

import { useEffect, useRef, useState } from "react";

import styles from "../technology.module.css";

type Tile = { kicker: string; title: string; prompt: string };

const TILES: Tile[] = [
  {
    kicker: "Columbus GenLayer",
    title: "Solar roof possibility",
    prompt: "rank the possibility of solar roof panel installation in this neighborhood",
  },
  {
    kicker: "Columbus GenLayer",
    title: "Resident Vibes",
    prompt: "rank residential community vibrancy across this area",
  },
  {
    kicker: "Columbus GenLayer",
    title: "Safety Score",
    prompt: "highlight low-incident streets and high-visibility safety zones",
  },
];

// Total scroll distance is 70vh sticky pin + 200vh of travel = 270vh.
// The pin is centered in the viewport (CSS top: 15vh on .genLayersStickyInner),
// so raw = 0 when outerRect.top hits 15vh (sticky starts) and raw = 1 when
// outerRect.top hits -185vh (sticky releases — outer.bottom reaches inner
// bottom at 85vh from viewport top). Travel distance is 200vh.
//
// Tile-state buckets across the 0..1 progress range:
//   [0,    0.46) tile 1 active (intro overlay covers it for the first
//                ~20% — tile 1 is already in its expanded layout
//                underneath, so when the intro fades there's no
//                "expand from collapsed" transition).
//   [0.46, 0.73) tile 2
//   [0.73, 1.00] tile 3
const TRAVEL_VH = 2;
const STICKY_TOP_VH = 0.15;

export function GenLayersSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  // Refs for the elements whose styles we update on every scroll frame.
  // Bypasses React state/re-renders so the visuals track scroll instantly.
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  // 0/1/2 = active tile. Tile 1 is active from the start so it sits in
  // its expanded form behind the intro overlay.
  const [activeTile, setActiveTile] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let rafId = 0;
    let lastTile = 0;
    const update = () => {
      rafId = 0;
      const rect = node.getBoundingClientRect();
      const stickyTopPx = window.innerHeight * STICKY_TOP_VH;
      const extraPx = window.innerHeight * TRAVEL_VH;
      // raw = 0 when outer.top hits the sticky offset (sticky starts).
      // raw = 1 after travel distance (sticky releases).
      const raw = Math.max(0, Math.min(1, (stickyTopPx - rect.top) / extraPx));

      // Direct DOM writes — no React re-render, no CSS transition lag.
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${(raw * 100).toFixed(2)}%`;
      }
      if (introRef.current) {
        const introOpacity = Math.max(0, Math.min(1, 1 - (raw - 0.10) / 0.10));
        introRef.current.style.opacity = introOpacity.toString();
      }

      // Active tile only changes at threshold crossings — gate the React
      // state update so we don't trigger pointless re-renders every frame.
      let next = 0;
      if (raw >= 0.73) next = 2;
      else if (raw >= 0.46) next = 1;
      if (next !== lastTile) {
        lastTile = next;
        setActiveTile(next);
      }
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      id="gen-layers-band"
      className={`${styles.genLayersBand} ${styles.darkSurface}`}
    >
      <div className={styles.genLayersInner}>
        {/* Starburst + "Gen Layers" label sitting over the long left arm */}
        <div className={styles.genLayersHead}>
          <svg
            className={styles.genLayersHeadStarburst}
            viewBox="0 0 1600 220"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            {(() => {
              const cx = 1500;
              const cy = 110;
              const stroke = "rgba(255, 255, 255, 0.92)";
              type TickStyle = "even" | "end" | "none";
              type Arm = { angle: number; len: number; ticks: TickStyle };
              const arms: Arm[] = [
                { angle: 180.4, len: 1460, ticks: "end" },
                { angle: 187, len: 200, ticks: "even" },
                { angle: 226, len: 90, ticks: "even" },
                { angle: 252, len: 100, ticks: "none" },
                { angle: 267, len: 105, ticks: "none" },
                { angle: 282, len: 100, ticks: "none" },
                { angle: 317, len: 80, ticks: "end" },
                { angle: 350, len: 85, ticks: "even" },
                { angle: 4, len: 85, ticks: "even" },
                { angle: 31, len: 95, ticks: "even" },
                { angle: 66, len: 100, ticks: "even" },
                { angle: 90, len: 105, ticks: "even" },
                { angle: 113, len: 105, ticks: "none" },
                { angle: 147, len: 95, ticks: "even" },
              ];
              return arms.map((arm, i) => {
                const rad = (arm.angle * Math.PI) / 180;
                const x2 = cx + Math.cos(rad) * arm.len;
                const y2 = cy + Math.sin(rad) * arm.len;
                const perp = rad + Math.PI / 2;
                const tickHalf = 3.6;
                const buildTicks = () => {
                  if (arm.ticks === "none") return [] as number[];
                  const spacing = 9;
                  if (arm.ticks === "even") {
                    const out: number[] = [];
                    for (let d = 18; d <= arm.len - 14; d += spacing) out.push(d);
                    return out;
                  }
                  const count = Math.min(8, Math.floor(arm.len / 14));
                  return Array.from({ length: count }, (_, k) => arm.len - 14 - k * spacing);
                };
                const ticks = buildTicks();
                return (
                  <g key={i}>
                    <line
                      x1={cx}
                      y1={cy}
                      x2={x2}
                      y2={y2}
                      stroke={stroke}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    {ticks.map((d, t) => {
                      const tx = cx + Math.cos(rad) * d;
                      const ty = cy + Math.sin(rad) * d;
                      return (
                        <line
                          key={t}
                          x1={tx - Math.cos(perp) * tickHalf}
                          y1={ty - Math.sin(perp) * tickHalf}
                          x2={tx + Math.cos(perp) * tickHalf}
                          y2={ty + Math.sin(perp) * tickHalf}
                          stroke={stroke}
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </g>
                );
              });
            })()}
          </svg>
          <span className={styles.genLayersHeadLabel}>Gen Layers</span>
        </div>

        {/* Sticky-scroll experience — outer wrapper is 4 viewports tall;
            the inner panel pins to the top for the duration of the scroll,
            and tile state is driven entirely by scroll progress. */}
        <div ref={sectionRef} className={styles.genLayersStickyOuter}>
          <div className={styles.genLayersStickyInner}>
            <div
              className={[
                styles.genLayersTilesRow,
                activeTile === 0 ? styles.genLayersTilesRowState1 : "",
                activeTile === 1 ? styles.genLayersTilesRowState2 : "",
                activeTile === 2 ? styles.genLayersTilesRowState3 : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {TILES.map((tile, i) => {
                const isActive = i === activeTile;
                const isInactive = activeTile >= 0 && !isActive;
                return (
                  <div
                    key={tile.title}
                    className={[
                      styles.genLayersTile,
                      isActive ? styles.genLayersTileActive : "",
                      isInactive ? styles.genLayersTileInactive : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className={styles.genLayersTileKicker}>{tile.kicker}</span>
                    <span className={styles.genLayersTileTitle}>{tile.title}</span>
                    <span className={styles.genLayersTilePromptLabel}>Prompt:</span>
                    <span className={styles.genLayersTilePrompt}>
                      &ldquo;{tile.prompt}&rdquo;
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Intro overlay — heavy blur + headline + scroll hint. Sits on
                top of the tiles; opacity is updated directly via introRef
                in the rAF tick (see useEffect) — no React state, no
                re-render-per-frame. */}
            <div
              ref={introRef}
              className={styles.genLayersIntro}
              aria-hidden
            >
              <h3 className={styles.genLayersHeadline}>
                Columbus-01 can dynamically creating geodata layers, without
                complex and expensive surveying.
              </h3>
              <span className={styles.genLayersScrollHint}>
                ↓ Scroll to see the magic
              </span>
            </div>
          </div>

          {/* Progress bar — sibling of the sticky panel inside the same
              outer, sticky-pinned just below it so it floats as its own
              bar. The fill width is updated via a ref directly in the
              rAF tick (see useEffect) — no React state, no CSS
              transition — so it tracks scroll instantly. */}
          <div className={styles.genLayersProgressBar} aria-hidden>
            <div
              ref={progressFillRef}
              className={styles.genLayersProgressFill}
            />
          </div>
        </div>

        {/* Glass CTA — MapsGPT page style */}
        <div className={styles.genLayersExploreWrap}>
          <a href="/use-cases" className={styles.genLayersExploreBtn}>
            <span>Explore more maps we&apos;ve made</span>
            <svg width="10" height="18" viewBox="0 0 7 12" fill="none" aria-hidden>
              <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}
