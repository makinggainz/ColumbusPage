import { MistxNav } from "@/components/layout/MistxNav";
import { Footer } from "@/components/layout/Footer";
import FavoritesSection from "@/components/products/FavoritesSection";
import FinalCTASection from "@/components/products/FinalCTASection";
import Hero from "@/components/products/Hero";
import HowItWorksSection from "@/components/products/HowItWorksSection";
import NewAtMapsGPTSection from "@/components/products/NewAtMapsGPTSection";
import InspirationSection from "@/components/products/InspirationSection";
// import QuestionsSection from "@/components/products/QuestionsSection";
// import RecommendationsSection from "@/components/products/RecommendationsSection";
import SeeWhatPeopleSection from "@/components/products/SeeWhatPeopleSection";


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
    <main style={{ overflowX: "clip" }}>
      {/* MistxNav is a direct child of <main> — not wrapped in a
          SectionWithLabel — so its position:sticky has the full page as
          its containing block. `heroLight` floats it over the light
          MapsGPT hero (dark contents, pale scrim) like the business page. */}
      <MistxNav heroLight />
      <SectionWithLabel label={sectionLabels[1]}>
        <Hero />
      </SectionWithLabel>
      {/* Section C — ShowcaseSection removed; the scrollytelling Hero now
          carries the product-showcase role. */}
      {/* Section D — QuestionsSection (commented out, may restore later)
      <SectionWithLabel label={sectionLabels[3]}>
        <QuestionsSection />
      </SectionWithLabel>
      */}
      <SectionWithLabel label={sectionLabels[4]}>
        <HowItWorksSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[5]}>
        <NewAtMapsGPTSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[6]}>
        <FavoritesSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[7]}>
        <div id="section-see-what-people" />
        <SeeWhatPeopleSection />
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