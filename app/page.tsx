import { type ReactNode } from "react";
import { MistxNav } from "@/components/layout/MistxNav";
import { Hero } from "@/components/home/Hero";
import OurProductsSection from "@/components/home/OurProductsSection";
import {
  TextScrollIntro,
  ColumbusFeatureCell,
  DatasetsCarousel,
  CtaBanner,
  ElioTextScrollIntro,
  ElioFeatureCell,
  ElioValuesCards,
  ElioFinalCTA,
  StickyScrollFeatures,
  CaseStudyCard,
} from "@/components/home/lightspark";
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
      <MistxNav />
      <Hero />

      {/* Our products — self-contained section from
          ~/Downloads/OurProductsSection.tsx */}
      <OurProductsSection />

      {/* Island 1: Lightspark-style platform band (replaces the old Vision
          island — TextScroll word-reveal intro, three platform tiles,
          sticky-scroll Instant/Open/Grounded pillars, partner case study) */}
      <div className="mt-16">
        <TextScrollIntro />
        <ColumbusFeatureCell />
        <DatasetsCarousel />
        <CtaBanner
          title="No GIS experience needed. Get to critical decisions faster."
          primaryCta={{ label: "Start Now", href: "#" }}
          secondaryCta={{ label: "Learn More", href: "#" }}
        />

        {/* Elio super-section — parallels the Columbus super-section above
            (intro → features → values → final CTA). */}
        <ElioTextScrollIntro />
        <ElioFeatureCell />
        <ElioValuesCards />
        <ElioFinalCTA />

        <StickyScrollFeatures />
        <CaseStudyCard />
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
