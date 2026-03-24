import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Vision } from "@/components/home/VisionSection";
import { Footer } from "@/components/layout/Footer";
import { SiteSelection } from "@/components/home/SiteSelection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Applications } from "@/components/home/Applications";
import { Careers } from "@/components/home/Careers";
import { Industries } from "@/components/home/Industries";
import { Capabilities } from "@/components/home/Capabilities";
import { PartnerStrip } from "@/components/home/PartnerStrip";
import { TravelSection } from "@/components/home/TravelSection";
import { GeneratedMaps } from "@/components/home/GeneratedMaps";
import { UniqueSpotsSection } from "@/components/home/UniqueSpotsSection";

export default function Home() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "rgba(55, 40, 140, 0.03)",
        backgroundImage: `linear-gradient(rgba(55,40,140,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(55,40,140,0.06) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <Navbar />
      <Hero />
      <Vision />
      <SiteSelection />
      <Capabilities />
      <PartnerStrip />
      <Industries />
      <TravelSection />
      <TrustStrip />
      <GeneratedMaps />
      <UniqueSpotsSection />
      <Applications />
      <Careers />
      <Footer />
    </main>
  );
}
