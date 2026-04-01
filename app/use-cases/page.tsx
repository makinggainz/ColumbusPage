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
import ScrollProgressTracker from "@/components/use-cases/ScrollProgressTracker";

export default function UseCasesRoute() {
  const [navTheme, setNavTheme] = useState<"light" | "dark">("dark");
  const [heroOverlay, setHeroOverlay] = useState(0);
  const sectionBRef = useRef<HTMLElement>(null);
  const sectionCRef = useRef<HTMLElement>(null);
  const sectionDRef = useRef<HTMLElement>(null);
  const sec4Ref = useRef<HTMLElement>(null);
  const sec5Ref = useRef<HTMLElement>(null);
  const sec6Ref = useRef<HTMLElement>(null);
  const sec7Ref = useRef<HTMLElement>(null);
  const sec8Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const NAVBAR_H = 80;
    const update = () => {
      if (sectionCRef.current && sectionDRef.current) {
        const cRect = sectionCRef.current.getBoundingClientRect();
        const overC = cRect.top <= NAVBAR_H && cRect.bottom > NAVBAR_H;
        setNavTheme(overC ? "light" : "dark");
      }
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
        <span className="absolute top-4 left-4 z-50 text-red-500 font-bold text-xl">1</span>
        <HeroSection />
        <div
          className="absolute inset-0 bg-black pointer-events-none z-30"
          style={{ opacity: heroOverlay }}
        />
      </section>
      <section className="relative bg-black" ref={sectionCRef}>
        <span className="absolute top-4 left-4 z-50 text-red-500 font-bold text-xl">2</span>
        <ResultsSection />
      </section>
      <section className="relative" ref={sectionDRef}>
        <span className="absolute top-4 left-4 z-50 text-red-500 font-bold text-xl">3</span>
        <UseCasesHero />
      </section>
      <div className="relative">
        <ScrollProgressTracker sectionRefs={[sec4Ref, sec5Ref, sec6Ref, sec7Ref, sec8Ref]} />
        <section className="relative" ref={sec4Ref}>
          <span className="absolute top-4 left-4 z-50 text-red-500 font-bold text-xl">4</span>
          <Chat />
        </section>
        <section className="relative" ref={sec5Ref}>
          <span className="absolute top-4 left-4 z-50 text-red-500 font-bold text-xl">5</span>
          <SuperModelSection />
        </section>
        <section className="relative" ref={sec6Ref}>
          <span className="absolute top-4 left-4 z-50 text-red-500 font-bold text-xl">6</span>
          <AgentResearch />
        </section>
        <section className="relative" ref={sec7Ref}>
          <span className="absolute top-4 left-4 z-50 text-red-500 font-bold text-xl">7</span>
          <DataCatalogue />
        </section>
        <section className="relative" ref={sec8Ref}>
          <span className="absolute top-4 left-4 z-50 text-red-500 font-bold text-xl">8</span>
          <IndustryGrid />
        </section>
      </div>
      <section className="relative">
        <span className="absolute top-4 left-4 z-50 text-red-500 font-bold text-xl">9</span>
        <ContactSection />
      </section>
      <Footer theme="dark" />
    </main>
  );
}
