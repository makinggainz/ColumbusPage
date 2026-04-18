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
    <div className="max-w-[1287px] mx-5 md:mx-auto relative" style={{ height: 120 }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Navbar />

      {/* Side blur overlays — blur the areas outside the 1287px content column */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 bottom-0 left-0 hidden min-[1287px]:block"
        style={{
          width: "calc((100vw - 1287px) / 2)",
          backdropFilter: "blur(12px) saturate(1.1)",
          WebkitBackdropFilter: "blur(12px) saturate(1.1)",
          background: "rgba(255, 255, 255, 0.35)",
          zIndex: 30,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 bottom-0 right-0 hidden min-[1287px]:block"
        style={{
          width: "calc((100vw - 1287px) / 2)",
          backdropFilter: "blur(12px) saturate(1.1)",
          WebkitBackdropFilter: "blur(12px) saturate(1.1)",
          background: "rgba(255, 255, 255, 0.35)",
          zIndex: 30,
        }}
      />

      <Hero />

      {/* Hero → Vision gap with vertical structure lines */}
      <div className="max-w-[1287px] mx-5 md:mx-auto relative" style={{ height: 64 }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
      </div>

      {/* Island 1: Vision */}
      <Vision />

      <IslandGap />

      {/* Island 2: Columbus Pro */}
      <div data-island-2>
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
