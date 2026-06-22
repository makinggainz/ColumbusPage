"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Sparkles, ClipboardCheck } from "lucide-react";

import { useIndustry } from "@/components/use-cases/industry/IndustryContext";
import { INDUSTRY_COLOR } from "@/components/use-cases/industry/content";
import styles from "./business-feature-index.module.css";

const ITEMS = [
  { label: "Map Chat", id: "chat" },
  { label: "Data Catalog", id: "data-catalogue" },
  { label: "Generative Data", id: "super-model" },
  { label: "Research", id: "agentic-research" },
  { label: "Due Dillegence", id: "due-diligence" },
  { label: "Dashboard", id: "dashboard" },
];

/* Standard 24-grid stroke glyph wrapper, matching the BusinessUseCases
   `IconChip` section icons (stroke 1.8, round caps) so each rail icon is the
   same mark shown at the top of its section. Rendered at 20px. */
function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/* Per-feature icons for the collapsed icon-rail (cramped 14″ widths). The four
   that have a section header icon reuse it verbatim; Generative Data + Due
   Diligence (nested sub-features with no section icon) use lucide glyphs. */
const ICONS: Record<string, ReactNode> = {
  chat: (
    <Glyph>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Glyph>
  ),
  "data-catalogue": (
    <Glyph>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </Glyph>
  ),
  "super-model": <Sparkles size={18} strokeWidth={1.8} aria-hidden />,
  "agentic-research": (
    <Glyph>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="m11 13 4 4" />
      <path d="M15 11h3v3" />
    </Glyph>
  ),
  "due-diligence": <ClipboardCheck size={18} strokeWidth={1.8} aria-hidden />,
  dashboard: (
    <Glyph>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </Glyph>
  ),
};

export default function BusinessFeatureIndex() {
  const { industryId } = useIndustry();
  /* Accent for the rail's icon circles — the selected industry's colour, so
     they recolour in lockstep with the super-section title IconChips. */
  const accent = INDUSTRY_COLOR[industryId] ?? "#0B1B2B";

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
    // the sticky-zone + the FAQ ("Commonly asked questions") section has not
    // yet appeared on screen. The moment the FAQ's top edge crosses into the
    // viewport (top <= viewport height) the index hides, even though the
    // sticky-zone's bottom may not have reached the top of the viewport yet.
    const firstEl = document.getElementById(ITEMS[0].id);
    const zone = document.querySelector<HTMLElement>("[data-industry-sticky-zone]");
    const faq = document.querySelector<HTMLElement>("[data-faq-section]");
    const firstEntered = firstEl ? firstEl.getBoundingClientRect().top <= probeY : false;
    const stillInZone = zone ? zone.getBoundingClientRect().bottom > 0 : false;
    const faqOnScreen = faq ? faq.getBoundingClientRect().top <= window.innerHeight : false;
    setVisible(firstEntered && stillInZone && !faqOnScreen);
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
        // Drives the icon-circle tint in the CSS (inherits to each .icon).
        ["--idx-accent" as string]: accent,
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
                onClick={(e) => {
                  /* Tell the IndustryStickyNavbar to keep the main
                     navbar hidden across the upcoming scroll —
                     without this, the upward motion trips its scroll-up
                     "coexist" threshold and the navbar reappears for ~a
                     second before being hidden again. The picker listens for
                     `industry-index-jump` and suppresses its coexist
                     auto-flip for a short window. */
                  window.dispatchEvent(new CustomEvent("industry-index-jump"));

                  /* Smooth-scroll to the section instead of the default
                     instant anchor jump. Let modified clicks / non-primary
                     buttons fall through to native behaviour. */
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  const target = document.getElementById(item.id);
                  if (!target) return;
                  e.preventDefault();
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                  history.replaceState(null, "", `#${item.id}`);
                }}
              >
                <span className={styles.icon}>{ICONS[item.id]}</span>
                <span className={styles.label}>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>,
    document.body,
  );
}
