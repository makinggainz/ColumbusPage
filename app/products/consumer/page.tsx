import { MistxNav } from "@/components/layout/MistxNav";
import Hero from "@/components/products/Hero";
import StickyScrollScenes from "@/components/products/StickyScrollScenes";
import DestinationsSection from "@/components/products/DestinationsSection";
import FinalCTASection from "@/components/products/FinalCTASection";

export default function ProductsPage() {
  return (
    <main style={{ overflowX: "clip", background: "#FFFFFF" }}>
      <MistxNav lightCta darkBackdrop />

      {/* Hero + sticky-phone scroll choreography. The phone visible in
          the hero is the same phone that stays pinned as the three
          scenes scroll past below it. */}
      <StickyScrollScenes>
        <Hero />
      </StickyScrollScenes>

      <DestinationsSection />
      <FinalCTASection />
    </main>
  );
}
