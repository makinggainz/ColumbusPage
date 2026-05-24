import { MistxNav } from "@/components/layout/MistxNav";
import Hero from "@/components/products/Hero";
import DestinationsSection from "@/components/products/DestinationsSection";
import FinalCTASection from "@/components/products/FinalCTASection";
import InspirationSection from "@/components/products/InspirationSection";
// import QuestionsSection from "@/components/products/QuestionsSection";
// import RecommendationsSection from "@/components/products/RecommendationsSection";

const SectionLabel = ({ letter }: { letter: string }) => (
  <div
    style={{
      position: "absolute",
      top: "20px",
      left: "20px",
      zIndex: 100,
      fontSize: "16px",
      fontWeight: "bold",
      padding: "8px 12px",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "white",
      borderRadius: "4px",
      fontFamily: "monospace",
    }}
  >
    {letter}
  </div>
);

export default function ProductsPage() {
  return (
    <main style={{ overflowX: "clip" }}>
      <SectionLabel letter="a" />
      {/* MistxNav is a direct child of <main> so its position:sticky has
          the full page as its containing block. `darkBackdrop` paints the
          navbar's own dark gradient over the photo hero header; lightCta
          inverts the "Try Elio" CTA to white-on-dark while floating. */}
      <MistxNav lightCta darkBackdrop />

      <div style={{ position: "relative" }}>
        <SectionLabel letter="b" />
        <Hero />
      </div>

      {/* Post-hero stretch — destinations marquee → final CTA. Removed
          from this page: NewAtMapsGPTSection, HowItWorksSection,
          FavoritesSection, ClosingCTASection, SeeWhatPeopleSection. */}
      <div style={{ position: "relative" }}>
        <SectionLabel letter="c" />
        <DestinationsSection />
      </div>

      <div style={{ position: "relative" }}>
        <SectionLabel letter="d" />
        <FinalCTASection />
      </div>
    </main>
  );
}
