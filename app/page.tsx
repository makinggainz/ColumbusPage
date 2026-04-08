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
    <div className="max-w-[1287px] mx-5 md:mx-auto relative pointer-events-none" style={{ height: 240 }}>
      {/* Side lines */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: "var(--grid-line)" }} />
      {/* Centered vertical rule with logo */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 flex flex-col items-center">
        <div className="flex-1" style={{ width: 1, background: "var(--grid-line)" }} />
        <div className="flex items-center justify-center bg-white py-3">
          <img src="/logobueno.png" alt="" width={20} height={20} style={{ opacity: 0.3, filter: "grayscale(1) brightness(0.6) sepia(1) hue-rotate(190deg) saturate(3)" }} />
        </div>
        <div className="flex-1" style={{ width: 1, background: "var(--grid-line)" }} />
      </div>
      {/* Centered horizontal rules — split around logo */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2" style={{ right: "calc(50% + 22px)", height: 1, background: "var(--grid-line)" }} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2" style={{ left: "calc(50% + 22px)", height: 1, background: "var(--grid-line)" }} />
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
