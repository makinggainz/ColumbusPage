import { MistxNav } from "@/components/layout/MistxNav";
import { Footer } from "@/components/layout/Footer";
import Hero from "@/components/products/Hero";
import DestinationsSection from "@/components/products/DestinationsSection";
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
          its containing block. `heroWhite` floats it transparently over
          the tropical beach hero with WHITE nav contents at rest, so the
          logo / links / arrows read on the dark photo. The Hero itself
          paints a dark-fade band at its top edge that sits behind the
          navbar zone, giving the white nav text a guaranteed legibility
          backdrop independent of which part of the beach lands here. */}
      <MistxNav lightCta darkBackdrop />
      <SectionWithLabel label={sectionLabels[1]}>
        <Hero />
      </SectionWithLabel>
      {/* Post-hero stretch — "New at Elio" leads (formerly the bento
          "A map superapp / Elio makes maps feel alive" slot, since
          replaced) → destinations → "See what people are asking"
          straight into the footer. Three sections have been removed
          from this page: HowItWorksSection, FavoritesSection ("Let
          our AI find you the coolest place, faster."), ClosingCTA-
          Section ("Ready when you are. Your next trip starts with a
          question."), and FinalCTASection ("Elio is updated
          regularly. Request a feature / Report a bug"). */}
      <NewAtMapsGPTSection />
      <DestinationsSection />
      {/* Section D — QuestionsSection (commented out, may restore later)
      <SectionWithLabel label={sectionLabels[3]}>
        <QuestionsSection />
      </SectionWithLabel>
      */}
      <SectionWithLabel label={sectionLabels[7]}>
        <div id="section-see-what-people" />
        <SeeWhatPeopleSection />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[10]}>
        <Footer />
      </SectionWithLabel>
    </main>
  );
}