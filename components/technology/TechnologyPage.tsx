"use client";

import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import styles from "./technology.module.css";
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

    // Enable smooth scrolling for anchor links and programmatic scrollTo
    // calls scoped to the technology page only. Does NOT affect mouse-wheel
    // or trackpad scrolling — those stay native. Restored to the original
    // value on unmount so other pages aren't impacted.
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";

    updateNavState();

    window.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);

    return () => {
      html.style.scrollBehavior = prevScrollBehavior;
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
            </div>
          </div>
        </div>
      </div>
      <Footer theme="technology" />
    </main>
  );
}
