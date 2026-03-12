import EnterpriseHero from "@/components/enterprise/EnterpriseHero";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SectionCScroll from "@/components/enterprise/SectionCScroll";
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

const sectionLabels = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"] as const;

function SectionWithLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative">
      <span
        className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-sm font-bold text-white"
        aria-hidden
      >
        {label}
      </span>
      {children}
    </section>
  );
}

export default function EnterprisePage() {
  return (
    <main>
      <SectionWithLabel label={sectionLabels[0]}>
        <Navbar/>
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[1]}>
        <EnterpriseHero />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[2]}>
        <SectionCScroll />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[3]}>
        <ComparisonSection/>
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[4]}>
        <PromptShowcase/>
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[5]}>
        <DrawAreaSection/>
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[6]}>
        <DataCollectionSection/>
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[7]}>
        <DataSection/>
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[8]}>
        <MapChatSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[9]}>
        <ResearchReportsSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[10]}>
        <GeneratedLayersSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[11]}>
        <HumanSupportSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[12]}>
        <ChatSection/>
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[13]}>
        <Footer />
      </SectionWithLabel>
    </main>
  );
}   