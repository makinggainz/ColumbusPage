"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./technology.module.css";
import { HERO_SCROLL_INDEX_ITEMS } from "./redesign/content";

export function TechScrollIndex() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [segmentStyle, setSegmentStyle] = useState<React.CSSProperties>({});

  // Measure the active item and position the thick bar to match
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
    const pageBody = document.querySelector<HTMLElement>(
      `.${styles.pageBody}`
    );
    if (!pageBody) return;

    const probeY = window.innerHeight * 0.42;

    const hero = document.querySelector<HTMLElement>(`.${styles.techHero}`);
    if (hero) {
      const heroRect = hero.getBoundingClientRect();
      if (heroRect.bottom > probeY) {
        setActiveIdx(0);
        setIsDark(false);
        return;
      }
    }

    setIsDark(true);

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

  useEffect(() => {
    const pageBody = document.querySelector<HTMLElement>(
      `.${styles.pageBody}`
    );
    if (!pageBody) return;

    updateActive();

    pageBody.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      pageBody.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [updateActive]);

  // Update segment position whenever activeIdx changes
  useEffect(() => {
    updateSegment();
  }, [updateSegment]);

  // Also update on resize
  useEffect(() => {
    window.addEventListener("resize", updateSegment);
    return () => window.removeEventListener("resize", updateSegment);
  }, [updateSegment]);

  // Labels are visible when hovered OR when past the hero
  const labelsVisible = isHovered || isDark;

  return (
    <div
      className={[styles.scrollIndex, isDark ? styles.scrollIndexDark : ""]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Page section index"
    >
      {/* Vertical track with thin line + thick active segment */}
      <div className={styles.scrollIndexTrack} ref={trackRef}>
        <div className={styles.scrollIndexLine} />
        <div
          className={styles.scrollIndexActiveSegment}
          style={segmentStyle}
        />
      </div>

      {/* Labels column */}
      <div
        className={[
          styles.scrollIndexLabels,
          labelsVisible ? styles.scrollIndexLabelsVisible : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
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
