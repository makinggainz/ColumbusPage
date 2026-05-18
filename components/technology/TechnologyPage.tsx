"use client";

import { useCallback, useEffect } from "react";
import { MistxNav } from "@/components/layout/MistxNav";
import { Footer } from "@/components/layout/Footer";

import styles from "./technology.module.css";
import { TechHeroSection } from "./TechHeroSection";
import { TechnologySections } from "./redesign/TechnologySections";

export function TechnologyPage() {
  // Toggle a body class while the Gen Layers band crosses the navbar Y so
  // CSS overrides in technology.module.css can make the nav background
  // transparent over that band. MistxNav handles its own scroll backdrop.
  const updateNavState = useCallback(() => {
    const band = document.getElementById("gen-layers-band");
    let inBand = false;
    if (band) {
      const rect = band.getBoundingClientRect();
      const navY = 56;
      inBand = rect.top <= navY && rect.bottom >= navY;
    }
    document.body.classList.toggle("gen-layers-active", inBand);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new Event("hero-reveal"));

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
      document.body.classList.remove("gen-layers-active");
    };
  }, [updateNavState]);

  return (
    <main className={styles.page}>
      {/* heroTint floats the navbar transparent over the animated mesh
          hero, then fades in a #F9F9F9 gradient-opacity scrim on scroll —
          the same float-over-hero behaviour as the MapsGPT/Business
          pages, tinted to the Research hero's surface colour. */}
      <MistxNav heroTint="#F9F9F9" />
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
