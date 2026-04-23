"use client";

import { useEffect, useRef, useState } from "react";

import glassStyles from "@/components/ui/GlassButton.module.css";
import styles from "../technology.module.css";

export function GenLayersSection() {
  const displayRef = useRef<HTMLDivElement | null>(null);
  const [displayRevealed, setDisplayRevealed] = useState(false);

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
          <div className={styles.genLayersDisplayFadeTop} aria-hidden />
          <div className={styles.genLayersDisplayFadeBottom} aria-hidden />

          <h3 className={styles.genLayersHeadline}>
            Dynamically creating geodata layers, without complex and
            expensive surveying.
          </h3>

          <div className={styles.genLayersTilesRow}>
            <div className={styles.genLayersTile}>
              <span className={styles.genLayersTileKicker}>Columbus GenLayer</span>
              <span className={styles.genLayersTileTitle}>Solar roof possibility</span>
            </div>
            <div className={styles.genLayersTile}>
              <span className={styles.genLayersTileKicker}>Columbus GenLayer</span>
              <span className={styles.genLayersTileTitle}>Resident Vibes</span>
            </div>
            <div className={styles.genLayersTile}>
              <span className={styles.genLayersTileKicker}>Columbus GenLayer</span>
              <span className={styles.genLayersTileTitle}>Safety Score</span>
            </div>
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

        {/* THE GRID section — unchanged */}
        <div className={styles.genLayersGrid}>
          <span className={styles.genLayersGridKicker}>THE GRID</span>
          <div className={styles.genLayersGridArt} aria-hidden>
            <svg viewBox="0 0 900 520" fill="none" preserveAspectRatio="xMidYMid slice">
              <rect width="900" height="520" fill="rgba(18, 25, 40, 0.85)" />
              {Array.from({ length: 28 }).map((_, i) => (
                <line key={`vx${i}`} x1={i * 34} y1="0" x2={i * 34 - 80} y2="520" stroke="rgba(180, 180, 190, 0.12)" strokeWidth="0.6" />
              ))}
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={`hz${i}`} x1="0" y1={i * 34} x2="900" y2={i * 34 - 30} stroke="rgba(180, 180, 190, 0.12)" strokeWidth="0.6" />
              ))}
              <polygon points="360,180 540,180 560,280 340,280" fill="rgba(240, 240, 240, 0.75)" stroke="rgba(220, 220, 220, 0.85)" />
              <polygon points="340,280 560,280 580,340 320,340" fill="rgba(230, 230, 230, 0.55)" />
              {[[150, 150, 80, 60], [680, 140, 100, 70], [140, 370, 110, 70], [700, 370, 90, 80]].map(([x, y, w, h], idx) => (
                <g key={idx}>
                  <rect x={x} y={y} width={w} height={h} fill="rgba(60, 70, 85, 0.85)" stroke="rgba(140, 150, 170, 0.6)" />
                  <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} fill="rgba(90, 100, 115, 0.55)" />
                </g>
              ))}
            </svg>
            <span className={styles.genLayersGridCaption}>SHIBUYA, TOKYO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
