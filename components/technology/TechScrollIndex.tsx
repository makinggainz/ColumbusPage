"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import styles from "./technology.module.css";
import { HERO_SCROLL_INDEX_ITEMS } from "./redesign/content";

export function TechScrollIndex() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [pastHero, setPastHero] = useState(false);

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

  useEffect(() => {
    updateActive();
    updatePastHero();

    const handler = () => {
      updateActive();
      updatePastHero();
    };

    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [updateActive, updatePastHero]);

  return (
    <nav
      className={[
        styles.scrollIndex,
        pastHero ? styles.scrollIndexVisible : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Page section index"
      aria-hidden={!pastHero}
    >
      <span className={styles.scrollIndexLine} aria-hidden />
      <ol className={styles.scrollIndexPills}>
        {HERO_SCROLL_INDEX_ITEMS.map((item, i) => {
          const isActive = i === activeIdx;
          return (
            <li key={item.sectionIds[0]}>
              <Link
                href={`#${item.sectionIds[0]}`}
                className={[
                  styles.scrollIndexPill,
                  isActive ? styles.scrollIndexPillActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={isActive ? "true" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
