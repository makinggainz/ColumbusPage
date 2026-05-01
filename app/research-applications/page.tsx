"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import HeroSection from "@/components/use-cases/HeroSection";
import ResultsSection from "@/components/use-cases/ResultsSection";
import ContactSection from "@/components/use-cases/ContactSection";
import IndustryGrid from "@/components/use-cases/IndustryGrid";
import Chat from "@/components/use-cases/Chat";
import SuperModelSection from "@/components/use-cases/SuperModelSection";
import AgentResearch from "@/components/use-cases/AgentResearch";
import DataCatalogue from "@/components/use-cases/DataCatalogue";
import UseCasesHero from "@/components/use-cases/UseCaseHero";
import { GenLayersSection } from "@/components/technology/redesign/GenLayersSection";

export default function ResearchApplicationsRoute() {
  const [navTheme, setNavTheme] = useState<"light" | "dark">("dark");
  const heroRef = useRef<HTMLElement>(null);
  const sec4Ref = useRef<HTMLElement>(null);
  const sec5Ref = useRef<HTMLElement>(null);
  const sec6Ref = useRef<HTMLElement>(null);
  const sec7Ref = useRef<HTMLElement>(null);
  const sec8Ref = useRef<HTMLElement>(null);

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
      <section className="relative" style={{ zIndex: 51, backgroundColor: "#FFFFFF" }}>
        <ResultsSection />
      </section>
      <section className="relative">
        <UseCasesHero
          eyebrow=""
          title="Capabilities"
          subtitle="What we've explored so far"
          lightTheme
        />
      </section>
      <div className="relative">
        <section className="relative" ref={sec4Ref}>
          <Chat lightTheme />
        </section>
        <section className="relative" ref={sec5Ref}>
          <SuperModelSection lightTheme />
        </section>
        <section className="relative" ref={sec6Ref}>
          <AgentResearch lightTheme />
        </section>
        <section className="relative" ref={sec7Ref}>
          <DataCatalogue lightTheme />
        </section>
        <section className="relative" ref={sec8Ref}>
          <IndustryGrid lightTheme />
        </section>
      </div>
      <section className="relative">
        <ContactSection lightTheme />
      </section>
      <section className="relative">
        <GenLayersSection />
      </section>
      <Footer theme="light" />
    </main>
  );
}
