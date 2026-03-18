// import { Navbar } from "@/components/layout/Navbar";
// import { Hero } from "@/components/home/Hero";
// import { Services } from "@/components/home/Services";
// import { DataFusion } from "@/components/home/DataFusion";
// import { WhyColumbus } from "@/components/home/WhyColumbus";
// import { Products } from "@/components/home/Products";
// import { Footer } from "@/components/layout/Footer";
// import { FeatureHighlight } from "@/components/home/FeatureHighlight"; // New Import


// import { GridBackground } from "@/components/home/GridBackground";

// export default function Home() {
//   return (
//     <main className="min-h-screen relative">
//       <Navbar />
//       <div id="home">
//         <Hero />
//       </div>
//       <GridBackground />
//       <div className="mb-0">
//         <WhyColumbus />
//       </div>

//       <FeatureHighlight />

//       <div className="bg-white/30 backdrop-blur-sm [mask-image:linear-gradient(to_bottom,transparent,black_100px_100%)] pt-32">
//         <div id="services" className="mb-32">
//           <Services />
//         </div>
//         <div className="mb-32">
//           <DataFusion />
//         </div>
//         <div id="products" className="mb-32">
//           <Products />
//         </div>
//       </div>
//       <Footer />
//     </main>
//   );
// }


//updated code with new hero section and typography
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
const sectionColors = [
  "bg-[#07112A]",      // a Navbar
  "bg-[#07112A]",       // b Hero
  "bg-[#07112A]",    // c MeshSection
  "bg-[#07112A]",      // d Vision
  "bg-[#07112A]",       // e GeoWarning
  "bg-[#07112A]",       // f SiteSelection
  "bg-[#07112A]",     // g PartnerStrip
  "bg-[#07112A]",       // h MainFeatures
  "bg-[#07112A]",     // i Industries
  "bg-[#07112A]",        // j TravelPromo
  "bg-[#07112A]",       // k TravelSection
  "bg-[#07112A]",     // l TrustStrip
  "bg-[#07112A]",    // m UniqueSpotsSection
  "bg-[#07112A]",     // n Applications
  "bg-[#07112A]",      // o Careers
  "bg-[#07112A]",   // p Footer
] as const;

function SectionLabel({ letter }: { letter: string }) {
  return (
    <span
      className="absolute left-4 top-4 z-10 text-2xl font-bold text-white/10 select-none"
      aria-hidden
    >
      {letter}
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className={`relative ${sectionColors[0]}`}>
        <SectionLabel letter="a" />
        <Navbar theme="dark" />
      </section>
      <section className={`relative ${sectionColors[1]}`}>
        <SectionLabel letter="b" />
        <Hero />
      </section>
      <section className={`relative ${sectionColors[2]}`}>
        <SectionLabel letter="c" />
        <MeshSection />
      </section>
      <section className={`relative ${sectionColors[3]}`}>
        <SectionLabel letter="d" />
        <Vision />
      </section>
      <section className={`relative ${sectionColors[4]}`}>
        <SectionLabel letter="e" />
        <GeoWarning />
      </section>
      <section className={`relative ${sectionColors[5]}`}>
        <SectionLabel letter="f" />
        <SiteSelection />
      </section>
      <section className={`relative ${sectionColors[6]}`}>
        <SectionLabel letter="g" />
        <PartnerStrip />
      </section>
      <section className={`relative ${sectionColors[7]}`}>
        <SectionLabel letter="h" />
        <MainFeatures />
      </section>
      <section className={`relative ${sectionColors[8]}`}>
        <SectionLabel letter="i" />
        <Industries />
      </section>
      <section className={`relative ${sectionColors[9]}`}>
        <SectionLabel letter="j" />
        <TravelPromo />
      </section>
      <section className={`relative ${sectionColors[10]}`}>
        <SectionLabel letter="k" />
        <TravelSection />
      </section>
      <section className={`relative ${sectionColors[11]}`}>
        <SectionLabel letter="l" />
        <TrustStrip />
      </section>
      <section className={`relative ${sectionColors[12]}`}>
        <SectionLabel letter="m" />
        <UniqueSpotsSection />
      </section>
      <section className={`relative ${sectionColors[13]}`}>
        <SectionLabel letter="n" />
        <Applications />
      </section>
      <section className={`relative ${sectionColors[14]}`}>
        <SectionLabel letter="o" />
        <Careers />
      </section>
      <section className="relative">
        <SectionLabel letter="p" />
        <Footer />
      </section>
    </main>
  );
}