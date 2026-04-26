"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <nav className={styles.dock} aria-label="Article navigation">
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
              opacity: logoHovered ? 1 : 0,
              transform: logoHovered ? "translateX(0)" : "translateX(-12px)",
            }}
          >
            Columbus Earth
          </span>
        </span>
      </Link>

      <Link href="/blog" className={styles.back}>
        ← All posts
      </Link>

      {sections.length > 0 ? (
        <ul className={styles.sectionList}>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={styles.sectionLink}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={styles.a11yRow}>
        <AccessibilityMenu placement="above-left" triggerSize={18} />
      </div>
    </nav>
  );
}
