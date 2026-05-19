"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import styles from "./technology.module.css";
import { HERO_SCROLL_INDEX_ITEMS } from "./redesign/content";

export function TechScrollIndex() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  const updateActive = useCallback(() => {
    const probeY = window.innerHeight * 0.42;

    for (let i = HERO_SCROLL_INDEX_ITEMS.length - 1; i >= 0; i--) {
      const item = HERO_SCROLL_INDEX_ITEMS[i];
      for (const sectionId of item.sectionIds) {
        const el = document.getElementById(sectionId);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY) {
          setActiveIdx(i);
          return;
        }
      }
    }

    setActiveIdx(0);
  }, []);

  const updatePastHero = useCallback(() => {
    const hero = document.querySelector<HTMLElement>('[class*="techHero"]');
    if (!hero) {
      setPastHero(true);
      return;
    }
    const rect = hero.getBoundingClientRect();
    setPastHero(rect.bottom <= 80);
  }, []);

  /* Flip to white-text mode when the index's own Y-range overlaps with the
     full-viewport-width Gen Layers band (dark navy bg). */
  const updateOnDark = useCallback(() => {
    const band = document.getElementById("gen-layers-band");
    if (!band) {
      setOnDark(false);
      return;
    }
    const bandRect = band.getBoundingClientRect();
    // Probe Y = roughly where the sticky index sits on screen.
    const probeY = window.innerHeight * 0.42;
    const overlap = bandRect.top <= probeY && bandRect.bottom >= probeY;
    setOnDark(overlap);
  }, []);

  /* Fade the index out once the user reaches the bottom of the last
     section (Careers) — its bottom edge scrolling into view. */
  const updateAtEnd = useCallback(() => {
    const careers = document.getElementById("careers");
    if (!careers) {
      setAtEnd(false);
      return;
    }
    const rect = careers.getBoundingClientRect();
    setAtEnd(rect.bottom <= window.innerHeight);
  }, []);

  useEffect(() => {
    updateActive();
    updatePastHero();
    updateOnDark();
    updateAtEnd();

    const handler = () => {
      updateActive();
      updatePastHero();
      updateOnDark();
      updateAtEnd();
    };

    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [updateActive, updatePastHero, updateOnDark, updateAtEnd]);

  return (
    <nav
      className={[
        styles.scrollIndex,
        onDark ? styles.scrollIndexOnDark : "",
        atEnd ? styles.scrollIndexHidden : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Page section index"
      aria-hidden={!pastHero || atEnd}
    >
      {HERO_SCROLL_INDEX_ITEMS.map((item, i) => {
        const isActive = i === activeIdx;
        return (
          <Link
            key={item.sectionIds[0]}
            href={`#${item.sectionIds[0]}`}
            className={[
              styles.scrollIndexLabel,
              isActive ? styles.scrollIndexLabelActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={isActive ? "true" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
