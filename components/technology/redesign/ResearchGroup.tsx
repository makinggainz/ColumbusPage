"use client";

import { ReactNode, useEffect, useId, useRef, useState } from "react";
import styles from "../technology.module.css";
import { useAccordion } from "./ResearchAccordionContext";

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  autoOpenOnView?: boolean;
  autoOpenDelayMs?: number;
};

export function ResearchGroup({
  title,
  children,
  defaultOpen = false,
  autoOpenOnView = false,
  autoOpenDelayMs = 500,
}: Props) {
  const accordion = useAccordion();

  // Controlled mode: accordion context is present — use shared open state.
  // Uncontrolled mode: no context — manage own state as before.
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const isOpen = accordion ? accordion.openTitle === title : localOpen;

  function handleToggle() {
    if (accordion) {
      accordion.toggle(title);
    } else {
      setLocalOpen((v) => !v);
    }
  }

  const contentId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    if (!autoOpenOnView || hasAutoOpenedRef.current) return;
    const el = rootRef.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoOpenedRef.current) {
          hasAutoOpenedRef.current = true;
          timeoutId = setTimeout(() => {
            if (accordion) {
              accordion.toggle(title);
            } else {
              setLocalOpen(true);
            }
          }, autoOpenDelayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenOnView, autoOpenDelayMs]);

  return (
    <div
      ref={rootRef}
      className={`${styles.coreResearchGroup} ${isOpen ? styles.coreResearchGroupOpen : ""}`}
    >
      <button
        type="button"
        className={styles.coreResearchGroupHead}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={handleToggle}
      >
        <span className={styles.coreResearchGroupDash} aria-hidden />
        <h3>{title}</h3>
        <span className={styles.coreResearchGroupPlus} aria-hidden>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1v14M1 8h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <div
        id={contentId}
        className={styles.coreResearchGroupContent}
        aria-hidden={!isOpen}
      >
        <div className={styles.coreResearchGroupInner}>{children}</div>
      </div>
    </div>
  );
}
