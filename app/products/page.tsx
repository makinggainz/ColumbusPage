import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import FavoritesSection from "@/components/products/FavoritesSection";
import FinalCTASection from "@/components/products/FinalCTASection";
import Hero from "@/components/products/Hero";
import HowItWorksSection from "@/components/products/HowItWorksSection";
import InspirationSection from "@/components/products/InspirationSection";
import QuestionsSection from "@/components/products/QuestionsSection";
import RecommendationsSection from "@/components/products/RecommendationsSection";
import SeeWhatPeopleSection from "@/components/products/SeeWhatPeopleSection";
import ShowcaseSection from "@/components/products/ShowcaseSection";


const sectionLabels = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"] as const;

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

export default function ProductsPage() {
  return (
    <main className="overflow-x-hidden">
      <SectionWithLabel label={sectionLabels[0]}>
        <Navbar />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[1]}>
        <Hero />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[2]}>
        <ShowcaseSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[3]}>
        <QuestionsSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[4]}>
        <HowItWorksSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[5]}>
        <FavoritesSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[6]}>
        <InspirationSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[7]}>
        <SeeWhatPeopleSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[8]}>
        <RecommendationsSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[9]}>
        <FinalCTASection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[10]}>
        <Footer />
      </SectionWithLabel>
    </main>
  );
}