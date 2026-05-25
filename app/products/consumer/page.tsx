import { MistxNav } from "@/components/layout/MistxNav";
import Hero from "@/components/products/Hero";
import PhoneMockup from "@/components/products/PhoneMockup";
import DestinationsSection from "@/components/products/DestinationsSection";
import FinalCTASection from "@/components/products/FinalCTASection";

export default function ProductsPage() {
  return (
    <main style={{ overflowX: "clip", background: "#FFFFFF" }}>
      <MistxNav lightCta darkBackdrop />

      <div style={{ position: "relative" }}>
        <Hero />
        <PhoneMockup />
      </div>

      <DestinationsSection />
      <FinalCTASection />
    </main>
  );
}
