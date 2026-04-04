import EnterpriseHero from "@/components/enterprise/EnterpriseHero";
import ProblemCards from "@/components/enterprise/ProblemCards";
import SolutionShowcase from "@/components/enterprise/SolutionShowcase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ComparisonSection from "@/components/enterprise/ComparisonSection";
import ChatSection from "@/components/enterprise/ChatSection";
import PromptShowcase from "@/components/enterprise/PromptShowcase";
import StickyScrollSection from "@/components/enterprise/StickyScrollSection";
import ProductBanner from "@/components/enterprise/ProductBanner";
import DifferenceSection from "@/components/enterprise/DifferenceSection";

const sectionLabels = ["a", "b", "b2", "b3", "c", "d", "e", "g", "m", "n"] as const;

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
        <Navbar theme="dark" />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[1]}>
        <EnterpriseHero />
      </SectionWithLabel>
      <div className="relative" style={{ backgroundColor: "#060810" }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1, opacity: 0.40, mixBlendMode: "multiply" }}>
          <filter id="b2cNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#b2cNoise)" />
        </svg>
        <div className="relative z-10">
          <SectionWithLabel label={sectionLabels[2]}>
            <ProblemCards />
          </SectionWithLabel>
          <SectionWithLabel label={sectionLabels[3]}>
            <SolutionShowcase />
          </SectionWithLabel>
          <SectionWithLabel label={sectionLabels[4]}>
            <ComparisonSection />
          </SectionWithLabel>
        </div>
      </div>
      <SectionWithLabel label={sectionLabels[5]}>
        <ProductBanner />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[7]}>
        <StickyScrollSection />
      </SectionWithLabel>
      <SectionWithLabel label="diff">
        <DifferenceSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[6]}>
        <PromptShowcase />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[8]}>
        <ChatSection />
      </SectionWithLabel>
      <div style={{ backgroundColor: "#ffffff" }}>
        <SectionWithLabel label={sectionLabels[9]}>
          <Footer theme="light" />
        </SectionWithLabel>
      </div>
    </main>
  );
}
