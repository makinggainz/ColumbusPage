"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Easing: smooth deceleration at the end
const easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Smooth scroll for the landing page. Control speed by editing:
 * - wheelMultiplier: higher = faster scroll per wheel tick (default 1)
 * - touchMultiplier: higher = faster touch scroll (default 1.2)
 * - lerp: 0–1, higher = more smoothing / slower feel (default 0.1)
 */
export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      lerp: 0.1,
      easing,
    });

    document.documentElement.classList.add("lenis");

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    const onResize = () => lenis.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return null;
}
