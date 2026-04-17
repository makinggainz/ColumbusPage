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
function SectionGap() {
  return (
    <div className="max-w-[1287px] mx-5 md:mx-auto" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div style={{ height: 1, background: "linear-gradient(to right, var(--grid-line) 0%, var(--grid-line) 60%, transparent 100%)" }} />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff", "--grid-line": "transparent" } as React.CSSProperties}>
      <Navbar />
      <Hero />

      {/* Island 1: Vision */}
      <div className="mt-16">
        <Vision />
      </div>

      <SectionGap />

      {/* Island 2: Columbus Pro */}
      <div data-island-2>
        <SiteSelection />
        <Capabilities />
        <PartnerStrip />
        <Industries />
      </div>

      <SectionGap />

      {/* Island 3: MapsGPT */}
      <div>
        <TravelSection />
        <TrustStrip />
        <GeneratedMaps />
        <UniqueSpotsSection />
      </div>

      <SectionGap />

      {/* Island 4: Applications */}
      <div>
        <Applications />
      </div>

      <SectionGap />

      {/* Island 5: Hiring Humans */}
      <div>
        <Careers />
      </div>

      <Footer />
    </main>
  );
}
