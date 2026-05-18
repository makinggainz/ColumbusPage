import { MistxNav } from "@/components/layout/MistxNav";
import Hero from "@/components/products/Hero";
import HowItWorksSection from "@/components/products/HowItWorksSection";
import NewAtMapsGPTSection from "@/components/products/NewAtMapsGPTSection";
import FavoritesSection from "@/components/products/FavoritesSection";
import SeeWhatPeopleSection from "@/components/products/SeeWhatPeopleSection";
import FinalCTASection from "@/components/products/FinalCTASection";

/**
 * MapsGPT product page.
 *
 * The Footer is rendered once, globally, in `app/layout.tsx` (reveal
 * mode) — like the homepage, this page does not render its own.
 */
export default function ProductsPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "#FFFFFF", overflowX: "clip" }}
    >
      {/* MistxNav is a direct child of <main> so its position:sticky has
          the full page as its containing block. `heroLight` floats it
          over the light hero. */}
      <MistxNav heroLight />
      <Hero />
      <HowItWorksSection />
      <NewAtMapsGPTSection />
      <FavoritesSection />
      <SeeWhatPeopleSection />
      <FinalCTASection />
    </main>
  );
}
