"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import styles from "../technology.module.css";

const VANTOR_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function VantorScrollFeel() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const pageBody = document.querySelector<HTMLElement>(`.${styles.pageBody}`);
    const pageBodyInner = document.querySelector<HTMLElement>(`.${styles.pageBodyInner}`);
    if (!pageBody || !pageBodyInner) return;

    const lenis = new Lenis({
      wrapper: pageBody,
      content: pageBodyInner,
      autoRaf: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.075,
      wheelMultiplier: 0.92,
      touchMultiplier: 0.95,
      lerp: 0.09,
      easing: VANTOR_EASING,
      anchors: {
        duration: 1.05,
        easing: VANTOR_EASING,
        lock: true,
      },
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    // Preserve anchor deep-links when the route loads.
    const syncInitialHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      const target = document.getElementById(hash);
      if (!target) return;

      lenis.scrollTo(target, { immediate: true, lock: true, force: true });
    };
    window.requestAnimationFrame(syncInitialHash);

    const onResize = () => lenis.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
