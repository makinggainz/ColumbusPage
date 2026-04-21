"use client";

import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";

import styles from "./technology.module.css";
import { TechFooter } from "./TechFooter";
import { TechHeroSection } from "./TechHeroSection";
import { TechnologySections } from "./redesign/TechnologySections";
import { VantorScrollFeel } from "./redesign/VantorScrollFeel";

export function TechnologyPage() {
  const [navTheme, setNavTheme] = useState<"light" | "dark">("light");

  const updateNavState = useCallback(() => {
    const hero = document.querySelector<HTMLElement>(`.${styles.techHero}`);
    if (!hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    const pastHero = heroBottom <= 80;

    // Hero now has a light background, so navbar stays in "light" mode throughout.
    setNavTheme("light");

    // Sync window.scrollY so the Navbar detects compact mode (frosted glass).
    // The tech page uses a custom scroll container, so window never scrolls
    // naturally. We nudge documentElement.scrollTop to trigger isCompact.
    const target = pastHero ? 11 : 0;
    if (Math.round(window.scrollY) !== target) {
      window.scrollTo({ top: target, behavior: "instant" as ScrollBehavior });
    }
  }, []);

  useEffect(() => {
    // Fire hero-reveal so the Navbar sets hasScrolled = true immediately
    window.dispatchEvent(new Event("hero-reveal"));

    const pageBody = document.querySelector<HTMLElement>(`.${styles.pageBody}`);
    if (!pageBody) return;

    updateNavState();

    pageBody.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);

    return () => {
      pageBody.removeEventListener("scroll", updateNavState);
      window.removeEventListener("resize", updateNavState);
    };
  }, [updateNavState]);

  return (
    <main className={styles.page}>
      <Navbar theme={navTheme} />
      <VantorScrollFeel />
      <div className={styles.pageBody}>
        <div className={styles.pageBodyInner}>
          <TechHeroSection />

          <div className={styles.pageShell}>
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
