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
export default function Home() {
  return (
    <main className="bg-[#F9F9F9]">
      <Navbar />
      <Hero />
      <MeshSection />
      <Vision />
      
      <GeoWarning />
      <SiteSelection />
      <PartnerStrip />
      <MainFeatures />
      <Industries />
      <TravelPromo/>
      <TravelSection />
      <TrustStrip />
      <UniqueSpotsSection/>
      <Applications />
      <Careers />
      
      <Footer />
    </main>
  );
}