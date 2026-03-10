import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Image from "next/image";
import HeroSection from "@/components/use-cases/HeroSection";
import ResultsSection from "@/components/use-cases/ResultsSection";
import UseCasesHero from "@/components/use-cases/UseCaseHero";
import ContactSection from "@/components/use-cases/ContactSection";
import IndustryGrid from "@/components/use-cases/IndustryGrid";
import Chat from "@/components/use-cases/Chat"; 
import SuperModelSection from "@/components/use-cases/SuperModelSection";
import AgentResearch from "@/components/use-cases/AgentResearch";
import DataCatalogue from "@/components/use-cases/DataCatalogue";
export default function UseCasesRoute() {

  return (
    <main >
      <Navbar />
      <HeroSection />
      <ResultsSection />
      <UseCasesHero/>
      <Chat  />
      <SuperModelSection/>
      <AgentResearch />
      <DataCatalogue/>
      <IndustryGrid/>
      <ContactSection/>
      
      <Footer />
    </main>
  );
}
