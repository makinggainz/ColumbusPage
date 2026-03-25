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
        backgroundColor: "#FFFFFF",
        backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        backgroundPosition: "calc(50vw - 640px) 0",
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
