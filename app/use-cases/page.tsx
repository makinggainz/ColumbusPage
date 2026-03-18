"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import HeroSection from "@/components/use-cases/HeroSection";
import ResultsSection from "@/components/use-cases/ResultsSection";
import UseCasesHero from "@/components/use-cases/UseCaseHero";
import ContactSection from "@/components/use-cases/ContactSection";
import IndustryGrid from "@/components/use-cases/IndustryGrid";
import Chat from "@/components/use-cases/Chat";
import SuperModelSection from "@/components/use-cases/SuperModelSection";
import AgentResearch from "@/components/use-cases/AgentResearch";
import DataCatalogue from "@/components/use-cases/DataCatalogue";

function SectionLabel({ letter }: { letter: string }) {
  return (
    <span
      className="absolute left-4 top-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-lg font-bold uppercase text-[#0a1628] shadow-md ring-1 ring-black/10 opacity-30"
      aria-hidden
    >
      {letter}
    </span>
  );
}

export default function UseCasesRoute() {
  const [navTheme, setNavTheme] = useState<"light" | "dark">("dark");
  const [heroOverlay, setHeroOverlay] = useState(0);
  const sectionBRef = useRef<HTMLElement>(null);
  const sectionCRef = useRef<HTMLElement>(null);
  const sectionDRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const NAVBAR_H = 80;
    const update = () => {
      // Navbar theme
      if (sectionCRef.current && sectionDRef.current) {
        const cRect = sectionCRef.current.getBoundingClientRect();
        const overC = cRect.top <= NAVBAR_H && cRect.bottom > NAVBAR_H;
        setNavTheme(overC ? "light" : "dark");
      }

      // Hero fade-to-black
      if (sectionBRef.current) {
        const bRect = sectionBRef.current.getBoundingClientRect();
        const bHeight = sectionBRef.current.offsetHeight;
        const scrolled = -bRect.top; // 0 at page top, increases as user scrolls
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
        <SectionLabel letter="b" />
        <HeroSection />
        <div
          className="absolute inset-0 bg-black pointer-events-none z-30"
          style={{ opacity: heroOverlay }}
        />
      </section>
      <section className="relative bg-black" ref={sectionCRef}>
        <SectionLabel letter="c" />
        <ResultsSection />
      </section>
      <section className="relative" ref={sectionDRef}>
        <SectionLabel letter="d" />
        <UseCasesHero />
      </section>
      <section className="relative bg-red-500">
        <SectionLabel letter="e" />
        <Chat />
      </section>
      <section className="relative">
        <SectionLabel letter="f" />
        <SuperModelSection />
      </section>
      <section className="relative">
        <SectionLabel letter="g" />
        <AgentResearch />
      </section>
      <section className="relative">
        <SectionLabel letter="h" />
        <DataCatalogue />
      </section>
      <section className="relative">
        <SectionLabel letter="i" />
        <IndustryGrid />
      </section>
      <section className="relative">
        <SectionLabel letter="j" />
        <ContactSection />
      </section>
      <section className="relative">
        <SectionLabel letter="k" />
        <Footer />
      </section>
    </main>
  );
}
