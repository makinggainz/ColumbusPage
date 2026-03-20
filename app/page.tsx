import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
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

function SectionLabel({ n }: { n: number }) {
  return (
    <div
      className="absolute top-2 left-2 z-50 bg-red-500 text-white text-[11px] font-bold rounded-full w-6 h-6 flex items-center justify-center pointer-events-none"
      style={{ lineHeight: 1 }}
    >
      {n}
    </div>
  );
}

function Section({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="relative">
      <SectionLabel n={n} />
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Section n={1}><Hero /></Section>
      <Section n={2}><Vision /></Section>
      <Section n={3}><GeoWarning /></Section>
      <Section n={4}><SiteSelection /></Section>
      <Section n={5}><PartnerStrip /></Section>
      <Section n={6}><MainFeatures /></Section>
      <Section n={7}><Industries /></Section>
      <Section n={8}><TravelPromo /></Section>
      <Section n={9}><TravelSection /></Section>
      <Section n={10}><TrustStrip /></Section>
      <Section n={11}><UniqueSpotsSection /></Section>
      <Section n={12}><Applications /></Section>
      <Section n={13}><Careers /></Section>
      <Footer />
    </main>
  );
}
