"use client";

import React from "react";
import { useAccordion } from "./ResearchAccordionContext";
import styles from "../technology.module.css";
import { TechDiagramSVG } from "./TechDiagramSVG";

export function CoreResearchArt() {
  const accordion = useAccordion();

  const handleLayerClick = (title: string) => {
    accordion?.toggle(title);

    // Scroll to the section
    const sectionId = title === "Data Collection" ? "data-collection" :
                      title === "Fusion" ? "fusion" :
                      title === "Core Reasoning" ? "core-reasoning" :
                      "answers";
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
