"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import { AccessibilityMenu } from "@/components/layout/AccessibilityMenu";
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
  const [a11yOpen, setA11yOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translateY(0)");

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;

      const article = document.querySelector("article");
      if (!article) return;

      const articleRect = article.getBoundingClientRect();
      const navHeight = navRef.current.offsetHeight;
      const navTop = 148; // initial top position

      // Calculate the max offset: when article bottom reaches nav bottom position
      const articleBottom = articleRect.bottom;
      const navViewportEnd = navTop + navHeight;

      // Only constrain when article is actually ending (bottom within viewport)
      if (articleBottom <= navViewportEnd) {
        const overflow = navViewportEnd - articleBottom;
        setTransform(`translateY(-${overflow}px)`);
      } else {
        setTransform("translateY(0)");
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={styles.dock}
      style={{ transform }}
      aria-label="Article navigation"
    >
      {/* Home / wordmark — hovering the logo slides "Columbus Earth" out
          to the right from beneath the glyph (same motion language as the
          homepage hero popup). */}
      <Link
        href="/"
        className={styles.homeLink}
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
        onFocus={() => setLogoHovered(true)}
        onBlur={() => setLogoHovered(false)}
      >
        <span className={styles.logoGlyph}>
          <Image
            src="/logobueno.png"
            alt="Columbus Earth"
            fill
            sizes="32px"
            className="object-contain"
            priority
          />
        </span>
        <span
          className={styles.wordmarkClip}
          style={{ maxWidth: logoHovered ? 240 : 0 }}
        >
          <span
            className={styles.wordmarkText}
            style={{
              fontFamily: "var(--font-hero)",
              opacity: logoHovered ? 1 : 0,
              transform: logoHovered ? "translateX(0)" : "translateX(-12px)",
              filter: logoHovered ? "blur(0px)" : "blur(8px)",
            }}
          >
            Columbus Earth
          </span>
        </span>
      </Link>

      <Link href="/blog" className={styles.back}>
        <svg
          className={styles.backArrow}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M10 4l-4 4 4 4" />
        </svg>
        Back to Blog
      </Link>

      {sections.length > 0 ? (
        <div className={styles.tocBlock}>
          <p className={styles.tocLabel}>Table of Contents</p>
          <ul className={styles.sectionList}>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={styles.sectionLink}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={styles.a11yRow}>
        <button
          type="button"
          className={styles.a11yToggle}
          onClick={() => setA11yOpen(!a11yOpen)}
          aria-expanded={a11yOpen}
        >
          <span className={styles.tocLabel}>Accessibility</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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
