"use client";

import React from "react";
import { useAccordion } from "./ResearchAccordionContext";
import styles from "../technology.module.css";

const BUBBLES: { delay: string; size: "sm" | "md" }[] = [
  { delay: "0s",    size: "sm" },
  { delay: "0.5s",  size: "md" },
  { delay: "1.1s",  size: "md" },
  { delay: "0.25s", size: "md" },
  { delay: "0.85s", size: "md" },
];

export function CoreResearchArt() {
  const accordion = useAccordion();
  const isDataCollection = accordion?.openTitle === "Data Collection";

  return (
    <div className={styles.coreResearchArt} aria-hidden>
      {isDataCollection ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/TechnologyPageImages/techdiagramA1.png"
            alt=""
            className={`${styles.coreResearchArtImg} ${styles.coreResearchArtImgA1} ${styles.coreResearchArtImgFade}`}
          />

          <div className={styles.coreResearchBubbleRow}>
            {BUBBLES.map(({ delay, size }, i) => (
              <span
                key={i}
                className={`${styles.coreResearchBubble} ${size === "sm" ? styles.coreResearchBubbleSm : ""}`}
                style={{ animationDelay: delay } as React.CSSProperties}
              />
            ))}
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/TechnologyPageImages/techdiagramA1.5.png"
            alt=""
            className={`${styles.coreResearchArtImg} ${styles.coreResearchArtImgFade}`}
          />
        </>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/TechnologyPageImages/techDiagram2.png"
          alt=""
          className={`${styles.coreResearchArtImg} ${styles.coreResearchArtImgFade}`}
        />
      )}
    </div>
  );
}
