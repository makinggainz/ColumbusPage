"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import styles from "./technology.module.css";
import { HERO_SCROLL_INDEX_ITEMS } from "./redesign/content";

export function TechHeroSection() {
  const [visible, setVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 3) setVideoReady(true);
  }, []);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    filter: visible ? "blur(0px)" : "blur(8px)",
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease-out ${delay}s, filter 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
  });

  return (
    <section className={styles.techHero}>
      <video
        ref={videoRef}
        src="/use-cases-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        onPlaying={() => setVideoReady(true)}
        className={styles.techHeroVideo}
      />

      <div
        className={styles.techHeroOverlay}
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 28% 50%, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.20) 100%)",
          backdropFilter: videoReady ? "none" : "blur(20px)",
          WebkitBackdropFilter: videoReady ? "none" : "blur(20px)",
          opacity: visible ? 1 : 0,
          transition:
            "opacity 1.2s ease-out 0s, backdrop-filter 0.8s ease-out, -webkit-backdrop-filter 0.8s ease-out",
        }}
      />

      <div
        className={styles.techHeroGradient}
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease-out 0s",
        }}
        aria-hidden
      />

      <div className={styles.techHeroContent}>
        <div className={styles.techHeroTextBlock}>
          <h1 className={styles.techHeroTitle} style={fadeIn(0)}>
            Why you should be excited
            <br /> about our LGM
          </h1>

          <div
            className={styles.techHeroDivider}
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
              ...fadeIn(0.08),
            }}
          />

          {/* Index items as selectable navigation under the title */}
          <nav className={styles.techHeroNav} style={fadeIn(0.15)}>
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
                <span className={styles.techHeroNavGlow} />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
