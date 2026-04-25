"use client";

import React from "react";
import { useAccordion } from "./ResearchAccordionContext";
import styles from "../technology.module.css";
import { TechDiagramSVG } from "./TechDiagramSVG";

export function CoreResearchArt() {
  const accordion = useAccordion();

  return (
    <div className={styles.coreResearchArt} aria-hidden>
      <TechDiagramSVG
        className={`${styles.coreResearchArtImg} ${styles.coreResearchArtImgFade}`}
        activeTitle={accordion?.openTitle}
      />
    </div>
  );
}
