"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./technology.module.css";
import {
  OBSERVED_SECTION_IDS,
  SECTION_TO_NAV_ID,
  SIDEBAR_HIDDEN_ON,
  TECHNOLOGY_NAV_ITEMS,
} from "./redesign/content";
import type { TechnologySectionId } from "./redesign/types";

export function TechSidebarNav() {
  const [activeId, setActiveId] = useState<TechnologySectionId>("index");

  useEffect(() => {
    const pageBody = document.querySelector<HTMLElement>(`.${styles.pageBody}`);
    if (!pageBody) return;

    const sections = OBSERVED_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => Boolean(node)
    );

    if (sections.length === 0) return;

    const updateActiveByPosition = () => {
      const rootRect = pageBody.getBoundingClientRect();
      const probeY = rootRect.top + rootRect.height * 0.42;

      let containing: HTMLElement | null = null;
      let nearest = sections[0];
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= probeY && rect.bottom >= probeY) {
          containing = section;
          break;
        }

        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - probeY);

        if (distance < nearestDistance) {
          nearest = section;
          nearestDistance = distance;
        }
      }

      const nextId = (containing ?? nearest).id as TechnologySectionId;
      setActiveId(nextId);
    };

    updateActiveByPosition();

    pageBody.addEventListener("scroll", updateActiveByPosition, { passive: true });
    window.addEventListener("resize", updateActiveByPosition);

    return () => {
      pageBody.removeEventListener("scroll", updateActiveByPosition);
      window.removeEventListener("resize", updateActiveByPosition);
    };
  }, []);

  const activeNavId = SECTION_TO_NAV_ID[activeId];
  const isHidden = SIDEBAR_HIDDEN_ON.has(activeId);

  return (
    <aside
      className={[styles.sidebar, isHidden ? styles.sidebarHidden : ""].join(" ")}
      aria-label="Technology section index"
      aria-hidden={isHidden}
    >
      <nav>
        <ul className={styles.sidebarList}>
          {TECHNOLOGY_NAV_ITEMS.map((item) => {
            const isActive = item.id !== "index" && activeNavId === item.id;

            return (
              <li key={item.id}>
                <Link
                  href={`#${item.id}`}
                  className={[styles.sidebarLink, isActive ? styles.sidebarLinkActive : ""].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={styles.sidebarMarker}>{isActive ? "+" : ""}</span>
                  <span className={item.id === "index" ? styles.sidebarIndexLabel : undefined}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
