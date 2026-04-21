"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./technology.module.css";
import { HERO_SCROLL_INDEX_ITEMS } from "./redesign/content";

export function TechHeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    filter: visible ? "none" : "blur(8px)",
    transform: visible ? "none" : "translateY(16px)",
    transition: `opacity 0.7s ease-out ${delay}s, filter 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
  });

  return (
    <section className={styles.techHero}>
      <Image
        src="/TechpgHero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.techHeroVideo}
      />

      <div className={styles.techHeroContent}>
        <div className={styles.techHeroTextBlock}>
          <h1 className={styles.techHeroTitle} style={fadeIn(0)}>
            Building a brain for earth
          </h1>

          <p className={styles.techHeroSubtitle} style={fadeIn(0.06)}>
            At Columbus, we collect the world&rsquo;s data, and build a brain
            that comprehends it all.
            <br />
            We&rsquo;re building frontier geospatial intelligence.
          </p>

          <div
            className={styles.techHeroDivider}
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
              ...fadeIn(0.12),
            }}
          />

          {/* Index items as selectable navigation under the title */}
          <nav className={styles.techHeroNav} style={fadeIn(0.18)}>
            {HERO_SCROLL_INDEX_ITEMS.map((item) => (
              <Link
                key={item.sectionIds[0]}
                href={`#${item.sectionIds[0]}`}
                className={styles.techHeroNavItem}
              >
                <span className={styles.techHeroNavText}>{item.label}</span>
                <svg
                  className={styles.techHeroNavArrow}
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M8 3v8.5M4 8.5l4 4.5 4-4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
