"use client";

import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";

import styles from "./technology.module.css";
import { TechFooter } from "./TechFooter";
import { TechHeroSection } from "./TechHeroSection";
import { TechnologySections } from "./redesign/TechnologySections";

export function TechnologyPage() {
  const [navTheme, setNavTheme] = useState<"light" | "dark">("light");

  const updateNavState = useCallback(() => {
    // Hero now has a light background, so navbar stays in "light" mode throughout.
    setNavTheme("light");
  }, []);

  useEffect(() => {
    // Fire hero-reveal so the Navbar sets hasScrolled = true immediately
    window.dispatchEvent(new Event("hero-reveal"));

    updateNavState();

    window.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);

    return () => {
      window.removeEventListener("scroll", updateNavState);
      window.removeEventListener("resize", updateNavState);
    };
  }, [updateNavState]);

  return (
    <main className={styles.page}>
      <Navbar theme={navTheme} />
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
