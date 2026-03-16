import EnterpriseHero from "@/components/enterprise/EnterpriseHero";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SectionCScroll from "@/components/enterprise/SectionCScroll";
import ComparisonSection from "@/components/enterprise/ComparisonSection";
import ChatSection from "@/components/enterprise/ChatSection";
import PromptShowcase from "@/components/enterprise/PromptShowcase";
import StickyScrollSection from "@/components/enterprise/StickyScrollSection";

const sectionLabels = ["a", "b", "c", "d", "e", "g", "m", "n"] as const;

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
        <StickyScrollSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[6]}>
        <ChatSection/>
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[7]}>
        <Footer />
      </SectionWithLabel>
    </main>
  );
}
