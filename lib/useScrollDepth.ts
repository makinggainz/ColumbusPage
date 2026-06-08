"use client";

import { useEffect, useRef } from "react";
import { track } from "./analytics";

const CHECKPOINTS = [25, 50, 75, 90] as const;
type Checkpoint = (typeof CHECKPOINTS)[number];

// Fires scroll_depth at 25 / 50 / 75 / 90% scroll position, each exactly
// once per page prop change. Resets all checkpoints when `page` changes
// (SPA navigation). Listener is passive so it never blocks scroll paint.
export function useScrollDepth(page: string) {
  const fired = useRef<Set<Checkpoint>>(new Set());

  useEffect(() => {
    fired.current = new Set();

    function check() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total === 0) return;
      const ratio = scrolled / total;
      for (const depth of CHECKPOINTS) {
        if (!fired.current.has(depth) && ratio >= depth / 100) {
          fired.current.add(depth);
          track.scrollDepth(page, depth);
        }
      }
    }

    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [page]);
}
