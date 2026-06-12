"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Brain,
  Milestone,
  Microscope,
  ChartColumnBig,
  Newspaper,
  Mail,
  type LucideIcon,
} from "lucide-react";

import styles from "./technology.module.css";
import { HERO_SCROLL_INDEX_ITEMS } from "./redesign/content";

/* Section icons for the compact "dock" variant of the index — shown only in
   the ~1400–1610px (MacBook-14") band, where the full-text labels won't fit
   the narrow gutter. Index-aligned with HERO_SCROLL_INDEX_ITEMS. lucide icons
   default to stroke="currentColor", so they inherit the label colour and
   follow the light/dark-band switch for free. */
const SECTION_ICONS: LucideIcon[] = [
  Brain, // Foundation Model
  Milestone, // Timeline
  Microscope, // Research
  ChartColumnBig, // Results
  Newspaper, // Blog
  Mail, // Inquiries
];

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
    const careers = document.getElementById("inquiries");
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
        const Icon = SECTION_ICONS[i];
        const targetId = item.sectionIds[0];
        return (
          <Link
            key={targetId}
            href={`#${targetId}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              const target = document.getElementById(targetId);
              if (!target) return;
              e.preventDefault();
              target.scrollIntoView({ behavior: "smooth", block: "start" });
              history.replaceState(null, "", `#${targetId}`);
            }}
            className={[
              styles.scrollIndexLabel,
              isActive ? styles.scrollIndexLabelActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={isActive ? "true" : undefined}
          >
            <span className={styles.scrollIndexDot} aria-hidden />
            {Icon ? (
              <span className={styles.scrollIndexIcon} aria-hidden>
                <Icon size={20} strokeWidth={1.8} />
              </span>
            ) : null}
            <span className={styles.scrollIndexText}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
