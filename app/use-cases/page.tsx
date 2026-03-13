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
      className="absolute left-4 top-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-lg font-bold uppercase text-[#0a1628] shadow-md ring-1 ring-black/10"
      aria-hidden
    >
      {letter}
    </span>
  );
}

export default function UseCasesRoute() {
  return (
    <main>
      <section className="relative">
        <SectionLabel letter="a" />
        <Navbar />
      </section>
      <section className="relative">
        <SectionLabel letter="b" />
        <HeroSection />
      </section>
      <section className="relative bg-black">
        <SectionLabel letter="c" />
        <ResultsSection />
      </section>
      <section className="relative">
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
