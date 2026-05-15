"use client";

import { useEffect, type ReactNode } from "react";

/**
 * The rounded white "card" the entire site sits inside (experimentV6-Gdesign).
 *
 * On scroll, the card expands toward the viewport edges: margin animates
 * from 16px → 0 and border-radius from 24px → 0 over the first
 * SCROLL_RANGE pixels of scroll. The transition runs as a CSS variable
 * (--frame-margin / --frame-radius) on <html> so other elements that
 * need to track the frame — most importantly the sticky navbar's
 * `top` — can read the same value and stay aligned with the card edge
 * during the transition.
 */
const SCROLL_RANGE = 150;
const MAX_MARGIN = 16;
const MAX_RADIUS = 24;

export function PageFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      const t = Math.min(1, Math.max(0, window.scrollY / SCROLL_RANGE));
      const margin = MAX_MARGIN * (1 - t);
      const radius = MAX_RADIUS * (1 - t);
      document.documentElement.style.setProperty("--frame-margin", `${margin}px`);
      document.documentElement.style.setProperty("--frame-radius", `${radius}px`);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        apply();
        raf = 0;
      });
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      style={{
        margin: "var(--frame-margin, 16px)",
        borderRadius: "var(--frame-radius, 24px)",
        backgroundColor: "#FFFFFF",
        overflow: "clip",
        minHeight: "calc(100vh - var(--frame-margin, 16px) * 2)",
      }}
    >
      {children}
    </div>
  );
}
