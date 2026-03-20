import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Vision } from "@/components/home/VisionSection";
import { Footer } from "@/components/layout/Footer";
import { MeshSection } from "@/components/home/MeshSection";
import { GeoWarning } from "@/components/home/GeoWarning";
import { SiteSelection } from "@/components/home/SiteSelection";
import { MainFeatures } from "@/components/home/MainFeatures";
import { TravelSection } from "@/components/home/TravelSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Applications } from "@/components/home/Applications";
import { Careers } from "@/components/home/Careers";
import { Industries } from "@/components/home/Industries";
import { PartnerStrip } from "@/components/home/PartnerStrip";
import { TravelPromo } from "@/components/home/TravelPromo";
import { UniqueSpotsSection } from "@/components/home/UniqueSpotsSection";

function Divider() {
  return (
    <div
      className="w-full max-w-6xl mx-auto"
      style={{ height: "1px", background: "#E4E4E7" }}
      aria-hidden
    />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <MeshSection />
      <Divider />
      <Vision />
      <Divider />
      <GeoWarning />
      <Divider />
      <SiteSelection />
      <Divider />
      <PartnerStrip />
      <Divider />
      <MainFeatures />
      <Divider />
      <Industries />
      <Divider />
      <TravelPromo />
      <Divider />
      <TravelSection />
      <Divider />
      <TrustStrip />
      <Divider />
      <UniqueSpotsSection />
      <Divider />
      <Applications />
      <Divider />
      <Careers />
      <Footer />
    </main>
  );
}
