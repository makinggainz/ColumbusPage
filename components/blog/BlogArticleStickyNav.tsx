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
          <p className={styles.tocHeading}>In this Article</p>
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
                    <span className={styles.tocItemLabel} data-label={`${i + 1}. ${s.label}`}>{i + 1}. {s.label}</span>
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
