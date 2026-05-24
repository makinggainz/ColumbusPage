import { MistxNav } from "@/components/layout/MistxNav";
import Hero from "@/components/products/Hero";
import PhoneMockup from "@/components/products/PhoneMockup";
import DestinationsSection from "@/components/products/DestinationsSection";
import FinalCTASection from "@/components/products/FinalCTASection";
import InspirationSection from "@/components/products/InspirationSection";
// import QuestionsSection from "@/components/products/QuestionsSection";
// import RecommendationsSection from "@/components/products/RecommendationsSection";

export default function ProductsPage() {
  return (
    <main style={{ overflowX: "clip" }}>
      {/* MistxNav is a direct child of <main> so its position:sticky has
          the full page as its containing block. `darkBackdrop` paints the
          navbar's own dark gradient over the photo hero header; lightCta
          inverts the "Try Elio" CTA to white-on-dark while floating. */}
      <MistxNav lightCta darkBackdrop />

      <div style={{ position: "relative" }}>
        <Hero />
        <PhoneMockup />
      </div>

      {/* Post-hero stretch — destinations marquee → final CTA. Removed
          from this page: NewAtMapsGPTSection, HowItWorksSection,
          FavoritesSection, ClosingCTASection, SeeWhatPeopleSection. */}
      <div style={{ position: "relative" }}>
        <DestinationsSection />
      </div>

      <div style={{ position: "relative" }}>
        <FinalCTASection />
      </div>
    </main>
  );
}
