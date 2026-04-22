"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import styles from "../technology.module.css";

/**
 * Pinned-section scroll effect for the Gen Layers tile row.
 *
 * Outer wrapper is taller than the viewport so there's "scroll-room" for the
 * inner sticky panel to remain pinned while the user keeps scrolling. Inside
 * the sticky panel, the tile content scales from `baseScale` up to `1` and
 * back down again on a triangle wave — peak at the wrapper's mid-scroll, both
 * ends at the entrance/exit.
 *
 * The technology page uses a custom scroll container (`.pageBody` with
 * `overflow-y: auto`), so we attach the listener to that element when present
 * and fall back to `window` otherwise.
 */
export function GenLayersStickyTiles({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // The technology page scrolls inside an internal element. Find it by
    // querying for any element with a class that contains "pageBody"
    // (CSS-modules hashes the class name, so we substring-match).
    const scroller =
      document.querySelector<HTMLElement>('[class*="pageBody"]') ?? null;

    const update = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const range = Math.max(1, wrapper.offsetHeight - vh);
      // Linear progress through the wrapper: 0 entering, 1 exiting.
      const p = Math.max(0, Math.min(1, scrolled / range));
      // Triangle wave: 0 → 1 → 0 with peak at p=0.5.
      const tri = p < 0.5 ? p * 2 : (1 - p) * 2;
      // Ease-in-out cubic for a smoother feel near the extremes.
      const eased =
        tri < 0.5 ? 4 * tri * tri * tri : 1 - Math.pow(-2 * tri + 2, 3) / 2;
      setProgress(eased);
    };

    update();
    const target: HTMLElement | Window = scroller ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const baseScale = 0.82;
  const scale = baseScale + (1 - baseScale) * progress;

  const contentStyle: CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: "center center",
  };

  return (
    <div ref={wrapperRef} className={styles.genLayersStickyWrapper}>
      <div className={styles.genLayersStickyInner}>
        <div className={styles.genLayersStickyContent} style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}
