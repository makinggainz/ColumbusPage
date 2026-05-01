"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import HeroSection from "@/components/use-cases/HeroSection";
import ResultsSection from "@/components/use-cases/ResultsSection";
import UseCasesHero from "@/components/use-cases/UseCaseHero";
import ContactSection from "@/components/use-cases/ContactSection";
import Chat from "@/components/use-cases/Chat";
import SuperModelSection from "@/components/use-cases/SuperModelSection";
import AgentResearch from "@/components/use-cases/AgentResearch";
import DataCatalogue from "@/components/use-cases/DataCatalogue";
import { ResearchBlogSection } from "@/components/technology/redesign/ResearchBlogSection";

export default function ColumbusSolutionsRoute() {
  const [navTheme] = useState<"light" | "dark">("dark");
  const [heroOverlay, setHeroOverlay] = useState(0);
  const sectionBRef = useRef<HTMLElement>(null);
  const sectionDRef = useRef<HTMLElement>(null);
  const sec4Ref = useRef<HTMLElement>(null);
  const sec5Ref = useRef<HTMLElement>(null);
  const sec6Ref = useRef<HTMLElement>(null);
  const sec7Ref = useRef<HTMLElement>(null);

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
      <div className="relative">
        <section className="relative" ref={sec4Ref}>
          <Chat />
        </section>
        <section className="relative" ref={sec5Ref}>
          <SuperModelSection />
        </section>
        <section className="relative" ref={sec6Ref}>
          <AgentResearch />
        </section>
        <section className="relative" ref={sec7Ref}>
          <DataCatalogue />
        </section>
      </div>
      <section className="relative">
        <ResearchBlogSection />
      </section>
      <section className="relative">
        <ContactSection />
      </section>
      <Footer theme="dark" />
    </main>
  );
}
