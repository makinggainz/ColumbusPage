"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import HeroSection from "@/components/use-cases/HeroSection";
import ResultsSection from "@/components/use-cases/ResultsSection";
import ContactSection from "@/components/use-cases/ContactSection";
import UseCasesHero from "@/components/use-cases/UseCaseHero";
import UseCaseStickyScroll from "@/components/use-cases/UseCaseStickyScroll";
import { IndustryProvider } from "@/components/use-cases/industry/IndustryContext";
import { ResearchBlogSection } from "@/components/technology/redesign/ResearchBlogSection";
import ResearchAppSections from "@/components/use-cases/ResearchAppSections";

export default function ResearchApplicationsRoute() {
  const [navTheme, setNavTheme] = useState<"light" | "dark">("dark");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const NAVBAR_H = 80;
    const update = () => {
      // The hero is dark; everything below it is on a light background. Once
      // the hero has scrolled past the navbar, switch to "light" theme so
      // the navbar reads as dark text on the light sections beneath.
      if (heroRef.current) {
        const hRect = heroRef.current.getBoundingClientRect();
        const pastHero = hRect.bottom <= NAVBAR_H;
        setNavTheme(pastHero ? "light" : "dark");
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <main className="relative" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Page-level vertical structure lines — extend the page grid through
          every section from hero to footer. Sits above section content but
          below the navbar (z 1050); pointer-events-none keeps interactions
          on cards / links unaffected. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 50 }}
        aria-hidden
      >
        <div className="max-w-[1287px] mx-auto relative h-full">
          <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
        </div>
      </div>

      <Navbar theme={navTheme} />

      <section className="relative" ref={heroRef}>
        <HeroSection videoSrc="/research-applications-video.mp4" />
      </section>
      {/* Lifted above the page-level structure lines (z 50) so the vertical
          grid lines do not pass through the Results / Model Columbus-01 block. */}
      <section
        className="relative"
        style={{
          zIndex: 51,
          background: "linear-gradient(to bottom, #000000 50%, #FFFFFF 50%)",
        }}
      >
        <ResultsSection
          compact
          title="Model Columbus-01"
          subtitle="Fundamental engineering results of Columbus-01"
          itemTexts={[
            "Large scale reasoning for spatial data",
            "Generative AI for geospatial data",
            "Large data synthesis",
            "Semantic reasoning layer for coordinate spaces",
          ]}
          itemImages={[
            "/TechnologyPageImages/ReasoningLayer.png",
            "/TechnologyPageImages/LastLayer.png",
            "/TechnologyPageImages/DataCollectionLayer.png",
            "/TechnologyPageImages/FusionLayer.png",
          ]}
        />
      </section>
      <section className="relative">
        <UseCasesHero
          eyebrow=""
          title="Capabilities"
          subtitle="What we've explored so far"
          lightTheme
        />
      </section>

      <ResearchAppSections />

      {/* Industry-aware use-case block (light variant). The provider wraps the
          picker, the sticky sub-navbar, and the four-row sticky-scroll. */}
      <IndustryProvider>
        <UseCaseStickyScroll lightTheme excludeSections={["super-model"]} />
      </IndustryProvider>

      <section className="relative">
        <ResearchBlogSection />
      </section>
      <section className="relative">
        <ContactSection lightTheme />
      </section>
      <Footer theme="light" />
    </main>
  );
}
