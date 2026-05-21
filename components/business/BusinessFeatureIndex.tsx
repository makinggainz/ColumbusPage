"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./business-feature-index.module.css";

const ITEMS = [
  { label: "Map Chat", id: "chat" },
  { label: "Data Catalogue", id: "data-catalogue" },
  { label: "Generative Data", id: "super-model" },
  { label: "Research", id: "agentic-research" },
  { label: "Due Dillegence", id: "due-diligence" },
  { label: "Dashboard", id: "dashboard" },
];

export default function BusinessFeatureIndex() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /* Active-item tracking only — visibility is driven separately by the
     industry-sticky-zone observer below so this index hides at the same
     point the takeover sub-navbar does (i.e. when the user scrolls into
     the FAQ section below the super-feature stack). */
  const update = useCallback(() => {
    const probeY = window.innerHeight * 0.42;
    for (let i = ITEMS.length - 1; i >= 0; i--) {
      const el = document.getElementById(ITEMS[i].id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= probeY) {
        setActiveIdx(i);
        return;
      }
    }
    setActiveIdx(0);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  /* Visibility — mirror the IndustryStickyNavbar by observing the same
     [data-industry-sticky-zone] wrapper. The index appears the moment the
     user scrolls into the super-feature zone and disappears as soon as
     they scroll past it (into the FAQ section). Falls back to false if no
     page provides the zone, so the index stays out of the way on pages
     that don't opt in. */
  useEffect(() => {
    const zone = document.querySelector<HTMLElement>("[data-industry-sticky-zone]");
    if (!zone) {
      setVisible(false);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "0px 0px 0px 0px", threshold: 0 },
    );
    obs.observe(zone);
    return () => obs.disconnect();
  }, []);

  if (!mounted) return null;

  return createPortal(
    <nav
      className={styles.root}
      aria-label="Feature index"
      aria-hidden={!visible}
      style={{
        position: "fixed",
        left: 20,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <ul className={styles.list}>
        {ITEMS.map((item, i) => {
          const isActive = i === activeIdx;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
                aria-current={isActive ? "location" : undefined}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>,
    document.body,
  );
}
