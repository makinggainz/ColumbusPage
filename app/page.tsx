import { type ReactNode } from "react";
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
function Island({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mt-64 ${className}`}>{children}</div>;
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Navbar />
      <Hero />

      {/* Island 1: Vision */}
      <Island className="mt-16!">
        <Vision />
      </Island>

      {/* Island 2: Columbus Pro */}
      <Island>
        <SiteSelection />
        <Capabilities />
        <PartnerStrip />
        <Industries />
      </Island>

      {/* Island 3: MapsGPT */}
      <Island>
        <TravelSection />
        <TrustStrip />
        <GeneratedMaps />
        <UniqueSpotsSection />
      </Island>

      {/* Island 4: Applications */}
      <Island>
        <Applications />
      </Island>

      {/* Island 5: Hiring Humans */}
      <Island>
        <Careers />
      </Island>

      <Footer />
    </main>
  );
}
