"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../technology.module.css";

/* Wraps a Magellan-1.0 results-card art tile and pauses its animations whenever
   the tile is not fully in frame (and while off-screen entirely), so the 3D
   iconography only animates when the viewer can actually see the whole box. */
export function ResultsArtFrame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Start paused — the observer flips it on once the tile is fully visible.
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPaused(entry.intersectionRatio < 0.99),
      { threshold: [0, 0.5, 0.99, 1] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.resultsCardArt}${paused ? ` ${styles.resultsArtPaused}` : ""}`}
      aria-hidden
    >
      {children}
    </div>
  );
}
