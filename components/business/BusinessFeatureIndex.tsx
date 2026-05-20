"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./business-feature-index.module.css";

const ITEMS = [
  { label: "Pain Points", id: "problem" },
  { label: "Solution", id: "solution" },
  { label: "Capabilities", id: "capabilities" },
  { label: "Conversational chat", id: "chat" },
  { label: "Generative surveying", id: "super-model" },
  { label: "Agent research", id: "agent-research" },
  { label: "Data catalogue", id: "data-catalogue" },
];

export default function BusinessFeatureIndex() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const update = useCallback(() => {
    const probeY = window.innerHeight * 0.42;

    const first = document.getElementById(ITEMS[0].id);
    const last = document.getElementById(ITEMS[ITEMS.length - 1].id);
    if (!first || !last) {
      setVisible(false);
      return;
    }
    const firstTop = first.getBoundingClientRect().top;
    const lastBottom = last.getBoundingClientRect().bottom;
    setVisible(firstTop <= probeY && lastBottom > 0);

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
      {ITEMS.map((item, i) => {
        const isActive = i === activeIdx;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
            aria-current={isActive ? "true" : undefined}
          >
            <span className={styles.dot} aria-hidden />
            <span className={styles.text}>{item.label}</span>
          </a>
        );
      })}
    </nav>,
    document.body,
  );
}
