"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import styles from "./technology.module.css";
import { TechHeroMesh } from "./TechHeroMesh";
import { HERO_SCROLL_INDEX_ITEMS } from "./redesign/content";

export function TechHeroSection() {
  const [visible, setVisible] = useState(false);
  // Scroll-driven blur progress (0–1). Measures the hero section's own
  // scroll progress via getBoundingClientRect; the blur kicks in only
  // once the user is almost totally past the hero (60%/95% window).
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
      // Blur — starts late, once the user is mostly past the hero.
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
    <section ref={sectionRef} data-hero-section className={styles.techHero}>
      {/* Animated 3D wave-mesh background — ported from the experimentV6
          home hero. Fills the whole hero (including the band that sits
          under the transparent navbar). */}
      <TechHeroMesh />

      {/* Top→bottom gradient stack — ported from the experimentV6 hero.
          A blue accent tint at the top, a horizon softener mid-way, and
          a fade to white that blends the mesh into the section below. */}
      <div aria-hidden className={styles.techHeroAccentGradient} />
      <div aria-hidden className={styles.techHeroHorizonGradient} />
      <div aria-hidden className={styles.techHeroBottomGradient} />

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

      <div className={styles.techHeroContent} style={{ display: "none" }}>
        <div className={styles.techHeroTextBlock}>
          <h1 className={styles.techHeroTitle} style={fadeIn(0)}>
            Building a brain for earth.
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
                "linear-gradient(to right, color-mix(in srgb, var(--color-cta) 45%, transparent) 0%, color-mix(in srgb, var(--color-cta) 22%, transparent) 50%, color-mix(in srgb, var(--color-cta) 0%, transparent) 100%)",
              ...fadeIn(0.12),
            }}
          />

          {/* Label introducing the index list below */}
          <p className={styles.techHeroIndexLabel} style={fadeIn(0.16)}>
            An interactive Thesis
          </p>

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
