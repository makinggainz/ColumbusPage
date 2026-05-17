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
  ENGINEERING: "Engineering",
  "COMPANY NEWS": "Company News",
};

const FILTER_HREFS: Record<BlogFilter, string> = {
  ALL: "/blog/AllArticles",
  PRODUCT: "/blog/Product",
  ENGINEERING: "/blog/Engineering",
  "COMPANY NEWS": "/blog/CompanyNews",
};

const FILTERS: BlogFilter[] = ["ALL", ...BLOG_CATEGORIES];

/* sessionStorage key — set when a filter is clicked, read on the
   destination page to trigger the auto-scroll down to the article grid. */
const SCROLL_FLAG = "blogScrollToArticles";

/**
 * Centred pill row that rests at the bottom of the full-viewport blog
 * hero. Each pill links to its filter's route; on the destination page
 * the grid is smooth-scrolled into view, so a click reads as "take me
 * down to the (filtered) articles".
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
      if (flagged) sessionStorage.removeItem(SCROLL_FLAG);
    } catch {
      /* sessionStorage unavailable (private mode) — skip the scroll. */
    }
    if (!flagged) return;

    const el = document.getElementById("articles");
    if (!el) return;
    // Defer past first paint / scroll restoration so the target offset
    // is settled before the smooth scroll begins.
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
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
          onClick={() => {
            if (f === activeFilter) return;
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
