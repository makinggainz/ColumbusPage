"use client";

import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";

import styles from "./technology.module.css";
import { TechFooter } from "./TechFooter";
import { TechHeroSection } from "./TechHeroSection";
import { TechScrollIndex } from "./TechScrollIndex";
import { TechnologySections } from "./redesign/TechnologySections";
import { VantorScrollFeel } from "./redesign/VantorScrollFeel";

export function TechnologyPage() {
  const [navTheme, setNavTheme] = useState<"light" | "dark">("dark");

  const updateNavTheme = useCallback(() => {
    const hero = document.querySelector<HTMLElement>(`.${styles.techHero}`);
    if (!hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    // Switch to light when hero scrolls past navbar area (~80px)
    setNavTheme(heroBottom > 80 ? "dark" : "light");
  }, []);

  useEffect(() => {
    const pageBody = document.querySelector<HTMLElement>(`.${styles.pageBody}`);
    if (!pageBody) return;

    updateNavTheme();

    pageBody.addEventListener("scroll", updateNavTheme, { passive: true });
    window.addEventListener("resize", updateNavTheme);

    return () => {
      pageBody.removeEventListener("scroll", updateNavTheme);
      window.removeEventListener("resize", updateNavTheme);
    };
  }, [updateNavTheme]);

  return (
    <main className={styles.page}>
      <Navbar theme={navTheme} />
      <VantorScrollFeel />
      <TechScrollIndex />

      <div className={styles.pageBody}>
        <div className={styles.pageBodyInner}>
          <TechHeroSection />

          <div className={styles.pageShell}>
            <div className={styles.sidebarColumn} />

            <div className={styles.contentColumn}>
              <TechnologySections />
              <div className={styles.footerBleedWrap}>
                <TechFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
