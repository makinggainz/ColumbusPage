"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { AccessibilityMenu } from "@/components/layout/AccessibilityMenu";
import { ShareButtons } from "./ShareButtons";
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
  const [a11yOpen, setA11yOpen] = useState(false);
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

      {/* Share */}
      <div className={styles.shareSection}>
        <p className={styles.shareLabel}>Share this Article</p>
        <ShareButtons title={postTitle} size={18} />
      </div>

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
                      {isActive && (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="9" fill="#101144" />
                          <path d="M6 9h6M10 7l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>{i + 1}. {s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Accessibility */}
      <div className={styles.a11yRow}>
        <button
          type="button"
          className={styles.a11yToggle}
          onClick={() => setA11yOpen(!a11yOpen)}
          aria-expanded={a11yOpen}
        >
          <span className={styles.tocLabel}>Accessibility</span>
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className={a11yOpen ? styles.chevronOpen : styles.chevron}
            aria-hidden
          >
            <path d="M2 3.5l3 3 3-3" />
          </svg>
        </button>
        {a11yOpen && <AccessibilityMenu />}
      </div>

    </nav>
  );
}
