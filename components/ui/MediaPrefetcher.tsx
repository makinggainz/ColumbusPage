"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";

/**
 * Eager prefetch-all coordinator for the homepage.
 *
 * The brief: the homepage must ALWAYS be fast (hero LCP is preloaded and
 * paints first) AND on first run it must reliably load *all* media so the
 * user never scrolls into a half-loaded section or a grey skeleton.
 *
 * Below-the-fold images stay default-lazy (so they never contend with the
 * hero LCP). Once the page has fully loaded and the main thread goes idle,
 * <MediaPrefetcher> flips a global `warm` flag. Every below-fold next/image
 * subscribes via `useMediaWarm()` and, when warm, re-renders itself with
 * `loading="eager"` + low fetch priority — so the browser fetches the exact
 * optimizer variant it would have lazy-loaded later (guaranteed cache hit,
 * no hand-built URLs to drift out of sync). The heavy footer video is
 * pre-buffered last, on a later idle tick.
 *
 * Why a module-level store instead of context: the homepage renders its
 * sections as flat siblings (no shared wrapper), so a singleton +
 * useSyncExternalStore lets any image subscribe without threading a
 * provider through the tree. SSR + first client render both read `false`
 * (images render lazy), so there's no hydration mismatch; the flip happens
 * strictly post-load.
 */

let warm = false;
const listeners = new Set<() => void>();

/** Flip the global warm flag and notify all subscribed images. Idempotent. */
export function markMediaWarm() {
  if (warm) return;
  warm = true;
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getSnapshot() {
  return warm;
}
function getServerSnapshot() {
  return false;
}

/**
 * Subscribe a below-fold image to the warm flag. Returns `true` once the
 * page is loaded + idle. Spread the result into next/image, e.g.:
 *   const warm = useMediaWarm();
 *   <Image … loading={warm ? "eager" : "lazy"} fetchPriority={warm ? "low" : "auto"} />
 */
export function useMediaWarm() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

type IdleCb = (cb: () => void) => void;

/**
 * Renders nothing. Mount once near the end of the homepage. After the
 * window `load` event + an idle callback, warms all below-fold media and
 * pre-buffers the footer video. Bails entirely on data-saver connections.
 */
export function MediaPrefetcher() {
  useEffect(() => {
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) return;

    let cancelled = false;
    const onIdle: IdleCb =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? (cb) =>
            (
              window as Window & {
                requestIdleCallback: (cb: () => void) => void;
              }
            ).requestIdleCallback(cb)
        : (cb) => window.setTimeout(cb, 200);

    const run = () => {
      if (cancelled) return;
      // First idle tick: promote below-fold images to eager.
      onIdle(() => {
        if (cancelled) return;
        markMediaWarm();
        // Second idle tick: pre-buffer the heavy footer video last, so it's
        // ready even on a fast scroll-to-bottom. Skip if Footer's own
        // scroll gate already promoted it to preload="auto".
        onIdle(() => {
          if (cancelled) return;
          const video = document.querySelector<HTMLVideoElement>(
            "video[data-footer-video]",
          );
          if (video && video.preload !== "auto") {
            video.preload = "auto";
            video.load();
          }
        });
      });
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
  }, []);

  return null;
}

export default MediaPrefetcher;
