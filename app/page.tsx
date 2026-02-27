"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { SmoothScroll } from "@/components/home/SmoothScroll";
import { Vision } from "@/components/home/VisionSection";
import { Footer } from "@/components/layout/Footer";
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

export default function Home() {
  return (
    <main className="bg-[#F9F9F9]">
      <SmoothScroll />
      <Navbar />
      <Hero />
      <Vision />
      <GeoWarning />
      <SiteSelection />
      <PartnerStrip />
      <MainFeatures />
      <Industries />
      <TravelPromo />
      <TravelSection />
      <TrustStrip />
      <UniqueSpotsSection />
      <Applications />
      <Careers />
      <Footer />
    </main>
  );
}
