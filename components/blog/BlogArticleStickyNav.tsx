"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import styles from "./blog-sticky-nav.module.css";

export type BlogStickySection = {
  id: string;
  label: string;
};

type Props = {
  sections: BlogStickySection[];
};

export function BlogArticleStickyNav({ sections }: Props) {
  const [logoHovered, setLogoHovered] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [pastEnd, setPastEnd] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    // Scope to the article's own footer, which lives inside <main>. A
    // plain `querySelector("footer")` instead matches the global reveal
    // footer (layout.tsx) — a position:fixed, full-height element pinned
    // to the viewport, so it reads as "intersecting" the moment this
    // effect runs and hides the dock on load.
    const footer = document.querySelector("main footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastEnd(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-10% 0% -80% 0%" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      className={`${styles.dock} ${pastEnd ? styles.dockHidden : ""} ${minimized ? styles.dockMinimized : ""}`}
      aria-label="Article navigation"
    >
      {/* Minimize/restore toggle — single button sitting in the top-right
          of the panel. When minimized the panel shrinks to a small circle
          centred on this button so clicking it (or the bubble itself)
          re-expands the panel. */}
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setMinimized((m) => !m)}
        aria-label={minimized ? "Show table of contents" : "Minimize table of contents"}
        aria-expanded={!minimized}
      >
        {/* PanelLeftClose / PanelLeftOpen — a rounded sidebar rectangle
            with a vertical divider near the left and an inset chevron
            pointing the direction the panel will move. Matches the
            collapse/expand glyph used in chat-app sidebars. */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={styles.toggleBtnIcon}
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
          {minimized ? (
            <path d="m14 9 3 3-3 3" />
          ) : (
            <path d="m16 15-3-3 3-3" />
          )}
        </svg>
      </button>

      {/* All content lives inside .dockContent so it can be faded out
          atomically when the panel collapses. */}
      <div className={styles.dockContent} aria-hidden={minimized || undefined}>

      {/* Logo */}
      <Link
        href="/"
        className={styles.homeLink}
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
        onFocus={() => setLogoHovered(true)}
        onBlur={() => setLogoHovered(false)}
      >
        <span className={styles.logoGlyph}>
          <Image src="/logobueno.png" alt="Columbus Earth" fill sizes="32px" className="object-contain" priority />
        </span>
        <span className={styles.wordmarkClip} style={{ maxWidth: logoHovered ? 240 : 0 }}>
          <span
            className={styles.wordmarkText}
            style={{
              fontFamily: "var(--font-hero)",
              opacity: logoHovered ? 1 : 0,
              transform: logoHovered ? "translateX(0)" : "translateX(-12px)",
            }}
          >
            Columbus Earth
          </span>
        </span>
      </Link>

      {/* Back */}
      <Link href="/blog" className={styles.back}>
        <svg className={styles.backArrow} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M10 4l-4 4 4 4" />
        </svg>
        Back to Blog
      </Link>

      {/* TOC — a vertical stepper: each section is a circle indicator
          on a continuous guide rail, with the section title to its right.
          Sections above the current reading position read as completed
          (filled accent circle + check), the current section is active
          (filled accent + inner dot), and sections below are pending
          (hollow circle). Visually mirrors the multi-step onboarding
          pattern but rendered on the page's neutral panel palette. */}
      {sections.length > 0 && (() => {
        // Before the scroll-spy observer fires, treat the first section
        // as active so the stepper isn't all-pending on initial paint.
        const matchIndex = sections.findIndex((x) => x.id === activeId);
        const activeIndex = matchIndex === -1 ? 0 : matchIndex;
        return (
        <div className={styles.tocSection}>
          <span className={styles.tocHeading}>On this page</span>
          <ul className={styles.tocList}>
            {sections.map((s, i) => {
              const status =
                i < activeIndex
                  ? "completed"
                  : i === activeIndex
                    ? "active"
                    : "pending";
              return (
                <li key={s.id} className={styles.tocStep}>
                  <a
                    href={`#${s.id}`}
                    className={`${styles.tocItem} ${status === "active" ? styles.tocItemActive : ""} ${status === "completed" ? styles.tocItemCompleted : ""}`}
                    aria-current={status === "active" ? "location" : undefined}
                  >
                    <span className={styles.tocCircle} data-status={status}>
                      {status === "completed" && (
                        <svg
                          className={styles.tocCheck}
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M2 5.2l2 2 4-4.4" />
                        </svg>
                      )}
                      {status === "active" && (
                        <span className={styles.tocActiveDot} aria-hidden />
                      )}
                    </span>
                    <span className={styles.tocItemLabel}>{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        );
      })()}

      </div>
    </nav>
  );
}
