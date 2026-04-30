"use client";

import React from "react";
import { useAccordion } from "./ResearchAccordionContext";
import styles from "../technology.module.css";
import { TechDiagramSVG } from "./TechDiagramSVG";

// Maps the diagram's unprefixed layer titles back to the prefixed titles
// used by the ResearchGroup components ("1. Data Collection", etc.)
// so the accordion's keyed comparisons still resolve when the user clicks
// a diagram layer instead of the accordion row.
const LAYER_TO_GROUP_TITLE: Record<string, string> = {
  "Data Collection": "1. Data Collection",
  Fusion: "2. Fusion",
  "Core Reasoning": "3. Core Reasoning",
  "Answers, insights, patterns": "4. Answers, insights, patterns",
};

export function CoreResearchArt() {
  const accordion = useAccordion();

  const handleLayerClick = (title: string) => {
    accordion?.toggle(LAYER_TO_GROUP_TITLE[title] ?? title);
  };

  return (
    <div className={styles.coreResearchArt} aria-hidden>
      <TechDiagramSVG
        className={`${styles.coreResearchArtImg} ${styles.coreResearchArtImgFade}`}
        activeTitle={accordion?.openTitle}
        onLayerClick={handleLayerClick}
      />
    </div>
  );
}
