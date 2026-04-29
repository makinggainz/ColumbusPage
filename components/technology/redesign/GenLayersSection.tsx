"use client";

import { useEffect, useRef, useState } from "react";

import glassStyles from "@/components/ui/GlassButton.module.css";
import styles from "../technology.module.css";

const TILES = [
  { kicker: "Columbus GenLayer", title: "Solar roof possibility" },
  { kicker: "Columbus GenLayer", title: "Resident Vibes" },
  { kicker: "Columbus GenLayer", title: "Safety Score" },
];

export function GenLayersSection() {
  const displayRef = useRef<HTMLDivElement | null>(null);
  const [displayRevealed, setDisplayRevealed] = useState(false);
  const [activeTile, setActiveTile] = useState(0);

  useEffect(() => {
    const node = displayRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setDisplayRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle the active tile left → right every 5 seconds. Manual clicks
  // reset the timer so the user gets a fresh 5s on the tile they chose.
  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveTile((i) => (i + 1) % TILES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [activeTile]);

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

        {/* Image-backed display — headline top-left, 3 tile labels inside,
            top+bottom blur gradients. Expands from a rounded card to
            near-full-screen on scroll-reveal. */}
        <div
          ref={displayRef}
          className={[
            styles.genLayersDisplay,
            displayRevealed ? styles.genLayersDisplayRevealed : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <h3 className={styles.genLayersHeadline}>
            Dynamically creating geodata layers, without complex and
            expensive surveying.
          </h3>

          <div className={styles.genLayersTilesRow}>
            {TILES.map((tile, i) => (
              <button
                key={tile.title}
                type="button"
                className={`${styles.genLayersTile} ${i === activeTile ? styles.genLayersTileActive : ""}`}
                onClick={() => setActiveTile(i)}
                aria-pressed={i === activeTile}
              >
                <span className={styles.genLayersTileKicker}>{tile.kicker}</span>
                <span className={styles.genLayersTileTitle}>{tile.title}</span>
              </button>
            ))}
          </div>
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
