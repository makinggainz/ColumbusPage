"use client";

import { useEffect, useRef, useState } from "react";

import glassStyles from "@/components/ui/GlassButton.module.css";
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

// Total scroll distance is 100vh sticky pin + 300vh of travel = 400vh.
// Tile-state buckets across the 0..1 progress range:
//   [0,    0.46) tile 1 active (intro overlay covers it for the first
//                ~20% — tile 1 is already in its expanded layout
//                underneath, so when the intro fades there's no
//                "expand from collapsed" transition).
//   [0.46, 0.73) tile 2
//   [0.73, 1.00] tile 3
const TRAVEL_VH = 3;

export function GenLayersSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  // 0/1/2 = active tile. Tile 1 is active from the start so it sits in
  // its expanded form behind the intro overlay.
  const [activeTile, setActiveTile] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const rect = node.getBoundingClientRect();
      const extraPx = window.innerHeight * TRAVEL_VH;
      const raw = Math.max(0, Math.min(1, -rect.top / extraPx));
      setProgress(raw);
      let next = 0;
      if (raw >= 0.73) next = 2;
      else if (raw >= 0.46) next = 1;
      setActiveTile(next);
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

  // Intro overlay opacity: 1 until raw=0.10, fades to 0 by raw=0.20. Continuous
  // — driven directly by scroll progress rather than discrete step transitions.
  const introOpacity = Math.max(0, Math.min(1, 1 - (progress - 0.10) / 0.10));

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

            {/* Top-edge blur — frosted gradient strongest at the top, fades
                downward. Provides visual continuity with the (now transparent)
                navbar so its text stays readable over the satellite imagery. */}
            <div className={styles.genLayersTopBlur} aria-hidden />

            {/* Intro overlay — heavy blur + headline + scroll hint. Sits on
                top of the tiles; opacity is driven by scroll progress. */}
            <div
              className={styles.genLayersIntro}
              style={{ opacity: introOpacity }}
              aria-hidden={introOpacity === 0}
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
        </div>

        {/* Progress bar — sits below the sticky outer so it appears in
            normal flow once the user has scrolled past the experience. */}
        <div className={styles.genLayersProgressBar} aria-hidden>
          <div
            className={styles.genLayersProgressFill}
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Glass CTA — MapsGPT page style */}
        <div className={styles.genLayersExploreWrap}>
          <a href="/use-cases" className={`${glassStyles.btn} ${styles.genLayersExploreBtn}`}>
            <span>Explore more maps we&apos;ve made</span>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}
