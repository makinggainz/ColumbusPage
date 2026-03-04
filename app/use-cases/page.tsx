import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Image from "next/image";
import { HeroSection } from "@/components/use-cases/HeroSection";
import { ApplicationGridSection } from "@/components/use-cases/ApplicationGridSection";
// import { CaseIntroSection } from "@/components/use-cases/CaseIntroSection";
import { MoreApplicationsSection } from "@/components/use-cases/MoreApplicationsSection";
import { CTASection } from "@/components/use-cases/CTASection";
import { CaseIntroSection } from "@/components/use-cases/CaseIntroSection";
import { RealEstateSection} from "@/components/use-cases/RealEstateSection";
import { GenerativeGeodataSection } from "@/components/use-cases/GenerativeGeodataSection";
import { LogisticsSection } from "@/components/use-cases/LogisticsSection";
import { UrbanPlanningSection } from "@/components/use-cases/UrbanPlanningSection"; 
import { ConsumerMappingSection } from "@/components/use-cases/ConsumerMappingSection";
import { GeomarketingSection } from "@/components/use-cases/GeomarketingSection";
import { GroundDueDiligenceSection } from "@/components/use-cases/GroundDueDiligenceSection";
import { CommercialRealEstateSection } from "@/components/use-cases/CommercialRealEstateSection";
import { SiteSelectionSection } from "@/components/use-cases/SiteSelectionSection";

export default function UseCasesRoute() {

  return (
    <main >
      <Navbar />
      <HeroSection />
      <ApplicationGridSection/>
      <CaseIntroSection />

      <RealEstateSection />
      <GenerativeGeodataSection />
      <LogisticsSection />
      <UrbanPlanningSection />
      <GroundDueDiligenceSection />
      <CommercialRealEstateSection />
      <SiteSelectionSection />
      <ConsumerMappingSection />
      <GeomarketingSection />

      <MoreApplicationsSection />
      <CTASection />

      <Footer />
    </main>
  );
}
