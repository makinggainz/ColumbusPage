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
function IslandGap() {
  return (
    <div className="max-w-[1287px] mx-auto relative pointer-events-none" style={{ height: 240 }}>
      {/* Mesh pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(37, 99, 235, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(37, 99, 235, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          backgroundPosition: "0 0",
        }}
      />
      {/* Side lines */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Navbar />
      <Hero />

      {/* Island 1: Vision */}
      <div className="mt-16">
        <Vision />
      </div>

      <IslandGap />

      {/* Island 2: Columbus Pro */}
      <div>
        <SiteSelection />
        <Capabilities />
        <PartnerStrip />
        <Industries />
      </div>

      <IslandGap />

      {/* Island 3: MapsGPT */}
      <div>
        <TravelSection />
        <TrustStrip />
        <GeneratedMaps />
        <UniqueSpotsSection />
      </div>

      <IslandGap />

      {/* Island 4: Applications */}
      <div>
        <Applications />
      </div>

      <IslandGap />

      {/* Island 5: Hiring Humans */}
      <div>
        <Careers />
      </div>

      <Footer />
    </main>
  );
}
