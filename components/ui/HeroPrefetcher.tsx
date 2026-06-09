"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { HERO_ASSETS, heroOptimizerSrcSet } from "@/lib/hero-assets";

/**
 * Cross-page hero warmer. Mounted once in the root layout, so it runs on
 * every route.
 *
 * The problem it solves: each page preloads its OWN hero, but navigating to a
 * sibling page cold-fetched that page's hero (optimize → download → decode),
 * leaving the hero briefly absent. Here, once the current page has loaded and
 * the main thread goes idle, we warm the heroes of the OTHER primary routes
 * into the browser HTTP cache using the EXACT optimizer srcset they will
 * request (derived from the shared HERO_ASSETS registry). next/image serves
 * those with a 1-year immutable cache, so the warmed bytes survive the
 * (hard) navigation → the destination hero is a cache hit and paints at once.
 *
 * Politeness: bails on data-saver; waits for window `load` + idle so it never
 * contends with the current page's LCP or MediaPrefetcher's below-fold warming;
 * prefetches only the ONE variant matching the current viewport; uses a
 * detached low-priority Image so it stays out of the way; staggers one route
 * per idle tick. Renders nothing.
 */
export function HeroPrefetcher() {
  const pathname = usePathname() ?? "";

  useEffect(() => {
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) return;

    let cancelled = false;
    const onIdle: (cb: () => void) => void =
      "requestIdleCallback" in window
        ? (cb) =>
            (
              window as Window & {
                requestIdleCallback: (cb: () => void) => void;
              }
            ).requestIdleCallback(cb)
        : (cb) => window.setTimeout(cb, 200);

    const warmOne = (src: string, quality: number) => {
      const img = new Image();
      img.decoding = "async";
      // Low priority so it never competes with anything on the current page.
      (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
        "low";
      img.sizes = "100vw";
      // Setting srcset (+ sizes) makes the browser select and fetch the same
      // candidate the destination <Image>/preload will request.
      img.srcset = heroOptimizerSrcSet(src, quality);
    };

    const run = () => {
      if (cancelled) return;
      const wide =
        typeof window.matchMedia === "function"
          ? window.matchMedia("(min-width: 768px)").matches
          : true;

      // Every primary route except the one we're already on.
      const routes = Object.keys(HERO_ASSETS).filter((r) => r !== pathname);

      // Stagger one route per idle tick so we never burst the network.
      const step = (i: number) => {
        if (cancelled || i >= routes.length) return;
        onIdle(() => {
          if (cancelled) return;
          const entry = HERO_ASSETS[routes[i]];
          const variant = !wide && entry.mobile ? entry.mobile : entry.desktop;
          warmOne(variant.src, variant.quality);
          step(i + 1);
        });
      };
      onIdle(() => step(0));
    };

    if (document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run, { once: true });
    }
    return () => {
      cancelled = true;
      window.removeEventListener("load", run);
    };
  }, [pathname]);

  return null;
}

export default HeroPrefetcher;
