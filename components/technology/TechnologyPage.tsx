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
    // Switch to dark + make the navbar background see-through while the
    // Gen Layers band overlaps the navbar Y position.
    const band = document.getElementById("gen-layers-band");
    let inBand = false;
    if (band) {
      const rect = band.getBoundingClientRect();
      const navY = 56; // approx compact navbar height — switch when band crosses it
      inBand = rect.top <= navY && rect.bottom >= navY;
    }
    document.body.classList.toggle("gen-layers-active", inBand);
    setNavTheme(inBand ? "dark" : "light");
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
      // Always clean up the body class on unmount so other pages don't
      // inherit the transparent-navbar override.
      document.body.classList.remove("gen-layers-active");
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
