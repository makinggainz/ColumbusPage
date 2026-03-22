import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { TransitionSection } from "@/components/home/TransitionSection";
import { ProductOverview } from "@/components/home/ProductOverview";
import { CoreCapabilities } from "@/components/home/CoreCapabilities";
import { UseCasesSection } from "@/components/home/UseCasesSection";
import { InteractiveDemo } from "@/components/home/InteractiveDemo";
import { Philosophy } from "@/components/home/Philosophy";
import { TechnologySection } from "@/components/home/TechnologySection";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TransitionSection />
      <ProductOverview />
      <CoreCapabilities />
      <UseCasesSection />
      <InteractiveDemo />
      <Philosophy />
      <TechnologySection />
      <ClosingCTA />
      <Footer />
    </main>
  );
}
