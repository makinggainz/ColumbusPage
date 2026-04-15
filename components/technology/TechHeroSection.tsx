"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./technology.module.css";

const BOTTOM_TEXT = "Explore the technology";
const TYPE_INTERVAL = 28;

export function TechHeroSection() {
  const [visible, setVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger fade-in shortly after mount
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Check if video can play immediately on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 3) {
      setVideoReady(true);
    }
  }, []);

  // Start typing bottom text after title + subtitle have faded in
  useEffect(() => {
    if (!visible) return;
    const start = window.setTimeout(() => {
      let idx = 0;
      const iv = window.setInterval(() => {
        idx++;
        setTypedText(BOTTOM_TEXT.slice(0, idx));
        if (idx >= BOTTOM_TEXT.length) clearInterval(iv);
      }, TYPE_INTERVAL);
      return () => clearInterval(iv);
    }, 1000);
    return () => clearTimeout(start);
  }, [visible]);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    filter: visible ? "blur(0px)" : "blur(8px)",
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease-out ${delay}s, filter 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
  });

  return (
    <section className={styles.techHero}>
      {/* Background video */}
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

      {/* Dark overlay */}
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

      {/* Bottom gradient */}
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

      {/* Content */}
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
                "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.5) 75%, rgba(255,255,255,0) 100%)",
              ...fadeIn(0.08),
            }}
          />

          <p className={styles.techHeroSubtitle} style={fadeIn(0.15)}>
            Our Large Geospatial Model — spatial reasoning at scale, without the
            hallucinations.
          </p>
        </div>

        {/* Bottom typed text */}
        <div className={styles.techHeroBottom}>
          <span>{typedText}</span>
          {typedText.length >= BOTTOM_TEXT.length && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{
                opacity: 0,
                animation: "fadeInArrow 0.4s ease-out forwards",
              }}
            >
              <path
                d="M8 3v8.5M4 8.5l4 4.5 4-4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <style>{`@keyframes fadeInArrow { to { opacity: 1 } }`}</style>
        </div>
      </div>
    </section>
  );
}
