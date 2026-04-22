"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./technology.module.css";
import { HERO_SCROLL_INDEX_ITEMS } from "./redesign/content";

export function TechScrollIndex() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [segmentStyle, setSegmentStyle] = useState<React.CSSProperties>({});

  const updateSegment = useCallback(() => {
    const track = trackRef.current;
    const item = itemRefs.current[activeIdx];
    if (!track || !item) return;

    const trackRect = track.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    setSegmentStyle({
      top: itemRect.top - trackRect.top,
      height: itemRect.height,
    });
  }, [activeIdx]);

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

  // Track whether the hero has scrolled out of view. The index only
  // renders once the user enters the body content area.
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

  useEffect(() => {
    updateSegment();
  }, [updateSegment]);

  useEffect(() => {
    window.addEventListener("resize", updateSegment);
    return () => window.removeEventListener("resize", updateSegment);
  }, [updateSegment]);

  return (
    <div
      className={[
        styles.scrollIndex,
        pastHero ? styles.scrollIndexVisible : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Page section index"
      aria-hidden={!pastHero}
    >
      <div className={styles.scrollIndexTrack} ref={trackRef}>
        <div className={styles.scrollIndexLine} />
        <div
          className={styles.scrollIndexActiveSegment}
          style={segmentStyle}
        />
      </div>

      <div className={styles.scrollIndexLabels}>
        {HERO_SCROLL_INDEX_ITEMS.map((item, i) => {
          const isActive = i === activeIdx;
          return (
            <Link
              key={item.sectionIds[0]}
              ref={(el) => { itemRefs.current[i] = el; }}
              href={`#${item.sectionIds[0]}`}
              className={[
                styles.scrollIndexLabel,
                isActive ? styles.scrollIndexLabelActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={isActive ? "true" : undefined}
            >
              <span className={styles.scrollIndexLabelText}>{item.label}</span>
              <span className={styles.scrollIndexHoverGlow} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
