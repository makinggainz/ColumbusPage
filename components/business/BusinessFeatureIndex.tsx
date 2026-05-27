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

  /* Combined active-item + visibility tracking, both driven by the same
     scroll handler so they stay in lockstep:
       • activeIdx — highlights the row whose section has crossed the
         probe line (viewport.height * 0.42 below the top).
       • visible  — true once the FIRST item (#chat, "Ask, Discover,
         Understand") has crossed that same probe line, AND we're still
         inside the super-feature stack (the [data-industry-sticky-zone]
         bottom edge has not yet scrolled past the top of the viewport).
         This keeps the index hidden while the user is still scrolling
         through the IndustrySelector grid above #chat, and hides it
         again the moment the stack ends (into the FAQ section). */
  const update = useCallback(() => {
    const probeY = window.innerHeight * 0.42;

    // Active item.
    let nextActive = 0;
    for (let i = ITEMS.length - 1; i >= 0; i--) {
      const el = document.getElementById(ITEMS[i].id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= probeY) {
        nextActive = i;
        break;
      }
    }
    setActiveIdx(nextActive);

    // Visibility — first ITEM (#chat) entered probe line + still inside
    // the sticky-zone.
    const firstEl = document.getElementById(ITEMS[0].id);
    const zone = document.querySelector<HTMLElement>("[data-industry-sticky-zone]");
    const firstEntered = firstEl ? firstEl.getBoundingClientRect().top <= probeY : false;
    const stillInZone = zone ? zone.getBoundingClientRect().bottom > 0 : false;
    setVisible(firstEntered && stillInZone);
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
                onClick={() => {
                  /* Tell the IndustryStickyNavbar to keep the main
                     navbar hidden across the upcoming jump scroll —
                     without this, the post-click upward motion trips
                     its scroll-up "coexist" threshold and the navbar
                     reappears for ~a second before being hidden again.
                     The picker listens for `industry-index-jump` and
                     suppresses its coexist auto-flip for a short window. */
                  window.dispatchEvent(new CustomEvent("industry-index-jump"));
                }}
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
