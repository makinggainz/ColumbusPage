"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { TechDiagramSVG } from "./TechDiagramSVG";
import { WarmTechImage } from "./WarmTechImage";
import columbusLogo from "@/public/logobueno.png";
import mapsGptLogo from "@/public/MapsGPT-logo.png";
import styles from "../technology.module.css";

interface Slide {
  title: string;
  text: string;
  link?: { label: string; href: string };
  products?: boolean;
}

const SLIDES: Slide[] = [
  {
    title: "Data Collection",
    text: "The most extensive data collection in the industry. Versatile methods ranging from drones, car data, human data, public data and more.",
    link: { label: "Read our blog", href: "/blog" },
  },
  {
    title: "Fusion",
    text: "Accurate, automatic data filtering & labeling. We verify each data point at its specific X, Y, Z coordinate and time — the Ground Truth standard our model trains on.",
  },
  {
    title: "Core Reasoning",
    text: "Our reasoning model considers temporal data and sifts through vast amounts of aggregated geospatial data. Built on a new permutation of Reverse Diffusion and RAG architecture.",
    link: { label: "Read our Paper", href: "/blog/generative-geospatial-layers" },
  },
  {
    title: "Answers, insights, patterns",
    text: "One model, innumerable granular ground truths.",
    products: true,
  },
];

export function CoreResearchCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);

  const prev = () => setActiveIndex(i => Math.max(0, i - 1));
  const next = () => setActiveIndex(i => Math.min(3, i + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  const slide = SLIDES[activeIndex];

  return (
    <div className={styles.carouselSlide} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <h3 className={styles.carouselTitle}>{slide.title}</h3>

      <div className={styles.carouselDiagramContainer}>
        <button
          className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
          onClick={prev}
          disabled={activeIndex === 0}
          aria-label="Previous slide"
        >
          <svg width="16" height="24" viewBox="0 0 7 12" fill="none" stroke="#1e2e7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 1L1 6l5 5" />
          </svg>
        </button>

        <div className={styles.carouselDiagramWrap}>
          <TechDiagramSVG
            activeTitle={slide.title}
            onLayerClick={(title) => {
              const newIndex = SLIDES.findIndex(s => s.title === title);
              if (newIndex !== -1) setActiveIndex(newIndex);
            }}
          />
        </div>

        <button
          className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
          onClick={next}
          disabled={activeIndex === 3}
          aria-label="Next slide"
        >
          <svg width="16" height="24" viewBox="0 0 7 12" fill="none" stroke="#1e2e7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </button>
      </div>

      <div className={styles.carouselDots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.carouselDot} ${i === activeIndex ? styles.carouselDotActive : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === activeIndex ? "true" : undefined}
          />
        ))}
      </div>

      <div className={styles.carouselDivider} />

      <div className={styles.carouselBody}>
        <p>{slide.text}</p>

        {slide.products && (
          <div className={styles.coreResearchProducts}>
            <a href="/" className={styles.coreResearchProduct}>
              <span className={styles.coreResearchProductGlyph} aria-hidden>
                <WarmTechImage src={columbusLogo} alt="" width={36} height={36} />
              </span>
              <span>Columbus</span>
            </a>
            <a href="/products/consumer" className={styles.coreResearchProduct}>
              <span className={styles.coreResearchProductGlyph} aria-hidden>
                <WarmTechImage src={mapsGptLogo} alt="" width={36} height={36} />
              </span>
              <span>Elio</span>
            </a>
            <a href="#" className={`${styles.coreResearchProduct} ${styles.coreResearchProductSoon}`}>
              <span>More Soon</span>
            </a>
          </div>
        )}

        {slide.link && (
          <Link href={slide.link.href} className={styles.coreResearchGroupLink}>
            {slide.link.label}
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path
                d="M2 8l6-6M3.5 2H8v4.5"
                stroke="currentColor"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
