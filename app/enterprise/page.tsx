import EnterpriseHero from "@/components/enterprise/EnterpriseHero";
import TransitionSection from "@/components/enterprise/TransitionSection";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { main } from "framer-motion/m";
import UseColumbusHero from "@/components/enterprise/UseColumbusHero";
import ComparisonSection from "@/components/enterprise/ComparisonSection";
import ChatSection from "@/components/enterprise/ChatSection";
import PromptShowcase from "@/components/enterprise/PromptShowcase";
import DrawAreaSection from "@/components/enterprise/DrawAreaSection";
import DataCollectionSection from "@/components/enterprise/DataCollectionSection";
import DataSection from "@/components/enterprise/DataSection";
import MapChatSection from "@/components/enterprise/MapChatSection";
import ResearchReportsSection from "@/components/enterprise/ResearchReportSection";
import GeneratedLayersSection from "@/components/enterprise/GeneratedLayerSection";
import HumanSupportSection from "@/components/enterprise/HumanSupportSection";
export default function EnterprisePage() {
  return (
    <main>
        <Navbar/>
      <EnterpriseHero />
      <TransitionSection/>
      <UseColumbusHero/>
      <ComparisonSection/>
      <PromptShowcase/>
      <DrawAreaSection/>
      <DataCollectionSection/>
      <DataSection/>
      <MapChatSection />
      <ResearchReportsSection />
      <GeneratedLayersSection />
      <HumanSupportSection />
      <ChatSection/>
      <Footer />
    </main>
  );
}   