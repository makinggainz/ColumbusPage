"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import styles from "./technology.module.css";
import { HERO_SCROLL_INDEX_ITEMS } from "./redesign/content";

export function TechHeroSection() {
  const [visible, setVisible] = useState(false);
  // Two scroll-driven progress values (both 0–1). Same driving pattern as
  // the use-cases page's hero overlay ([app/use-cases/page.tsx:38-45]):
  // measures the hero section's own scroll progress via
  // getBoundingClientRect. Black overlay uses use-cases' 35%/88% window;
  // blur starts later (60%/95%) so it only kicks in when the user is
  // almost totally past the hero.
  const [blackProgress, setBlackProgress] = useState(0);
  const [blurProgress, setBlurProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const height = el.offsetHeight;
      // `scrolled` = how far the user has scrolled past the section's top.
      // 0 when the hero is pinned at the top of the viewport; == height
      // when the hero has fully scrolled off-screen upward.
      const scrolled = -rect.top;
      const progressIn = (start: number, end: number) =>
        Math.max(
          0,
          Math.min(1, (scrolled - height * start) / (height * (end - start)))
        );
      // Black overlay — matches use-cases' 35% → 88% window
      // ([app/use-cases/page.tsx:42-44]).
      setBlackProgress(progressIn(0.35, 0.88));
      // Blur — starts later, once the user is mostly past the hero.
      setBlurProgress(progressIn(0.6, 0.95));
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    filter: visible ? "none" : "blur(8px)",
    transform: visible ? "none" : "translateY(16px)",
    transition: `opacity 0.7s ease-out ${delay}s, filter 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
  });

  return (
    <section ref={sectionRef} className={styles.techHero}>
      <Image
        src="/TechnologyBackground.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.techHeroVideo}
      />

      {/* Scroll-driven blur overlay — sits above the hero image + text,
          backdrop-filter blurs everything behind it as `blurProgress`
          ramps from 0 to 1. Same fade-in-on-scroll pattern the use-cases
          page uses for its black overlay, but with blur instead. */}
      <div
        aria-hidden
        className={styles.techHeroBlurOverlay}
        style={{
          backdropFilter: blurProgress > 0 ? `blur(${blurProgress * 24}px)` : undefined,
          WebkitBackdropFilter: blurProgress > 0 ? `blur(${blurProgress * 24}px)` : undefined,
          opacity: blurProgress,
          pointerEvents: "none",
        }}
      />

      {/* Scroll-driven fade-to-black — directly mirrors the use-cases
          hero overlay ([app/use-cases/page.tsx:60-63]). Opacity ramps
          0→1 through the same 35%/88% scroll window. */}
      <div
        aria-hidden
        className={styles.techHeroBlackOverlay}
        style={{
          opacity: blackProgress,
          pointerEvents: "none",
        }}
      />

      <div className={styles.techHeroContent}>
        <div className={styles.techHeroTextBlock}>
          <h1 className={styles.techHeroTitle} style={{ fontFamily: "var(--font-hero)", ...fadeIn(0) }}>
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
                "linear-gradient(to right, rgba(10,19,68,0.45) 0%, rgba(10,19,68,0.22) 50%, rgba(10,19,68,0) 100%)",
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
