"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BLOG_CATEGORIES } from "@/lib/blog-posts";
import type { BlogFilter } from "@/components/blog/BlogIndexGrid";
import styles from "@/app/blog/blog-index.module.css";

/* Sentence-case display labels (data categories stay uppercase). */
const FILTER_LABELS: Record<BlogFilter, string> = {
  ALL: "All articles",
  PRODUCT: "Product",
  ENGINEERING: "Research",
  "COMPANY NEWS": "Company News",
};

const FILTER_HREFS: Record<BlogFilter, string> = {
  ALL: "/blog/AllArticles",
  PRODUCT: "/blog/Product",
  ENGINEERING: "/blog/Engineering",
  "COMPANY NEWS": "/blog/CompanyNews",
};

const FILTERS: BlogFilter[] = ["ALL", ...BLOG_CATEGORIES];

/* sessionStorage key — set when a filter click changes routes, read on the
   destination page to trigger the auto-scroll down to the article grid. */
const SCROLL_FLAG = "blogScrollToArticles";

/** Smooth-scroll the article grid (#articles) into view. The grid carries
    a scroll-margin-top in CSS so it clears the sticky navbar. */
function scrollToArticles() {
  document
    .getElementById("articles")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Centred pill row that rests at the bottom of the full-viewport blog
 * hero. Clicking any pill scrolls the viewer down to the article grid:
 *
 *   • A different filter navigates to that filter's route, then the
 *     destination page reads the SCROLL_FLAG and scrolls on arrival.
 *   • The already-active filter has nowhere to navigate, so it scrolls
 *     straight down on the spot.
 */
export function BlogFilterBar({ activeFilter }: { activeFilter: BlogFilter }) {
  // Re-checked on every route change (keyed on pathname) so the scroll
  // fires whether or not React remounts this component across the
  // sibling filter routes.
  const pathname = usePathname();
  useEffect(() => {
    let flagged = false;
    try {
      flagged = sessionStorage.getItem(SCROLL_FLAG) === "1";
    } catch {
      /* sessionStorage unavailable (private mode) — skip the scroll. */
    }
    if (!flagged) return;

    // Defer past first paint + the route's scroll-to-top restoration so
    // the target offset is settled before the smooth scroll begins.
    //
    // The flag is cleared only when the scroll actually runs — not on
    // read. React StrictMode mounts effects twice in dev (setup →
    // cleanup → setup); clearing on read would let the first pass
    // consume the flag and the cleanup cancel its timeout, leaving the
    // second pass with nothing to do. Clearing inside the timeout keeps
    // the flag alive for the re-run.
    const t = window.setTimeout(() => {
      try {
        sessionStorage.removeItem(SCROLL_FLAG);
      } catch {
        /* sessionStorage unavailable — ignore. */
      }
      scrollToArticles();
    }, 100);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <nav className={styles.filterBar} aria-label="Article categories">
      {FILTERS.map((f) => (
        <Link
          key={f}
          href={FILTER_HREFS[f]}
          className={`${styles.filterButton} ${activeFilter === f ? styles.filterButtonActive : ""}`}
          aria-current={activeFilter === f ? "page" : undefined}
          onClick={(e) => {
            if (f === activeFilter) {
              // Already on this filter's route — no navigation; scroll
              // straight down to the grid instead.
              e.preventDefault();
              scrollToArticles();
              return;
            }
            // Switching filters — flag the destination page to scroll
            // the (now filtered) grid into view once it mounts.
            try {
              sessionStorage.setItem(SCROLL_FLAG, "1");
            } catch {
              /* no-op — navigation still works, just without the scroll. */
            }
          }}
        >
          {FILTER_LABELS[f]}
        </Link>
      ))}
    </nav>
  );
}
