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
  postTitle?: string;
};

export function BlogArticleStickyNav({ sections, postTitle = "" }: Props) {
  const [logoHovered, setLogoHovered] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

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
    <nav className={styles.dock} aria-label="Article navigation">

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

      {/* TOC */}
      {sections.length > 0 && (
        <div className={styles.tocSection}>
          <div className={styles.tocHeader}>
            <p className={styles.tocHeading}>In this Article</p>
            <div className={styles.a11yIcons}>
              <button
                type="button"
                aria-label="Toggle dark mode"
                aria-pressed={bgColor === "dark"}
                className={`${styles.a11yIcon} ${bgColor === "dark" ? styles.a11yIconActive : ""}`}
                onClick={() => setBgColor(bgColor === "dark" ? "default" : "dark")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Toggle sepia mode"
                aria-pressed={bgColor === "sepia"}
                className={`${styles.a11yIcon} ${bgColor === "sepia" ? styles.a11yIconActive : ""}`}
                onClick={() => setBgColor(bgColor === "sepia" ? "default" : "sepia")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Toggle dyslexia font"
                aria-pressed={dyslexiaMode}
                className={`${styles.a11yIcon} ${styles.a11yIconAa} ${dyslexiaMode ? styles.a11yIconActive : ""}`}
                onClick={() => setDyslexiaMode(!dyslexiaMode)}
              >
                Aa
              </button>
              <button
                type="button"
                aria-label={isSpeaking ? "Stop reading aloud" : "Read article aloud"}
                aria-pressed={isSpeaking}
                className={`${styles.a11yIcon} ${isSpeaking ? styles.a11yIconActive : ""}`}
                onClick={toggleSpeech}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>
            </div>
          </div>
          <ul className={styles.tocList}>
            {sections.map((s, i) => {
              const isActive = activeId === s.id;
              return (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={`${styles.tocItem} ${isActive ? styles.tocItemActive : ""}`}>
                    <span className={styles.tocBullet} aria-hidden>
                      <svg width="4" height="4" viewBox="0 0 4 4" fill="none">
                        <circle cx="2" cy="2" r="2" fill="#101144" />
                      </svg>
                    </span>
                    <span>{i + 1}. {s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

    </nav>
  );
}
