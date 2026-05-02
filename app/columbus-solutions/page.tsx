"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import HeroSection from "@/components/use-cases/HeroSection";
import ResultsSection from "@/components/use-cases/ResultsSection";
import UseCasesHero from "@/components/use-cases/UseCaseHero";
import ContactSection from "@/components/use-cases/ContactSection";
import UseCaseStickyScroll from "@/components/use-cases/UseCaseStickyScroll";
import { IndustryProvider } from "@/components/use-cases/industry/IndustryContext";
import IndustrySelector from "@/components/use-cases/industry/IndustrySelector";
import IndustryStickyNavbar from "@/components/use-cases/industry/IndustryStickyNavbar";
import ColumbusSolutionsSections from "@/components/use-cases/ColumbusSolutionsSections";

export default function ColumbusSolutionsRoute() {
  const [navTheme] = useState<"light" | "dark">("dark");
  const [heroOverlay, setHeroOverlay] = useState(0);
  const sectionBRef = useRef<HTMLElement>(null);
  const sectionDRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => {
      if (sectionBRef.current) {
        const bRect = sectionBRef.current.getBoundingClientRect();
        const bHeight = sectionBRef.current.offsetHeight;
        const scrolled = -bRect.top;
        const fadeStart = bHeight * 0.35;
        const fadeEnd = bHeight * 0.88;
        const progress = Math.max(0, Math.min(1, (scrolled - fadeStart) / (fadeEnd - fadeStart)));
        setHeroOverlay(progress);
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <main>
      <Navbar theme={navTheme} />

      <section className="relative" ref={sectionBRef}>
        <HeroSection
          title={<>Columbus<br /> Professional applications</>}
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
        <div
          className="absolute inset-0 bg-black pointer-events-none z-30"
          style={{ opacity: heroOverlay }}
        />
      </section>
      {/* Lifted above any page-level structure lines so the vertical grid
          lines do not pass through the Results / Model Columbus-01 block. */}
      <section className="relative bg-black" style={{ zIndex: 51 }}>
        <ResultsSection />
      </section>
      <section className="relative" ref={sectionDRef}>
        <UseCasesHero />
      </section>

      {/* Industry-aware use-case block. The provider wraps the picker, the
          sticky sub-navbar (which intersection-observes the four-row block to
          show/hide itself), and the four-row sticky-scroll. */}
      <IndustryProvider>
        <IndustryStickyNavbar />
        <IndustrySelector />
        <UseCaseStickyScroll />
      </IndustryProvider>

      <section className="relative">
        <ColumbusSolutionsSections />
      </section>

      <section className="relative">
        <ContactSection />
      </section>
      <Footer theme="dark" />
    </main>
  );
}
