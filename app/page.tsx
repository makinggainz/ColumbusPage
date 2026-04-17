import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Vision } from "@/components/home/VisionSection";
import { Footer } from "@/components/layout/Footer";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { UseCaseCards } from "@/components/home/UseCaseCards";
import { Careers } from "@/components/home/Careers";

function SectionGap() {
  return (
    <div className="max-w-[1287px] mx-5 md:mx-auto" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div style={{ height: 1, background: "linear-gradient(to right, var(--grid-line) 0%, var(--grid-line) 60%, transparent 100%)" }} />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Navbar />
      <Hero />

      {/* Vision statement */}
      <div className="mt-16">
        <Vision />
      </div>

      <SectionGap />

      {/* Columbus Pro — image left, text right */}
      <ProductShowcase
        title="Columbus Pro"
        tagline="Enterprise geospatial intelligence"
        description="A comprehensive platform for organizations that need to understand the physical world at scale. Analyze any location on Earth with AI-powered spatial reasoning — from site selection to risk assessment."
        features={[
          "Real-time geospatial analysis across any region",
          "AI-generated data layers without manual surveying",
          "Coordinate-level reasoning for precise decision making",
          "Integration with existing enterprise workflows",
        ]}
        cta={{ label: "Learn more", href: "/products/enterprise" }}
        image="/enterprise/HeroImage.png"
        imageAlt="Columbus Pro enterprise platform interface"
        imagePosition="left"
        background="#F9F9F9"
      />

      <SectionGap />

      {/* MapsGPT — text left, image right */}
      <ProductShowcase
        title="MapsGPT"
        tagline="Maps that understand you"
        description="A consumer-grade geospatial product that makes spatial intelligence accessible to everyone. Ask questions about any place, get instant answers backed by our Large Geospatial Model."
        features={[
          "Natural language queries about any location",
          "Personalized travel and exploration recommendations",
          "Real-time local insights and hidden gems",
          "Powered by the same LGM as Columbus Pro",
        ]}
        cta={{ label: "Try MapsGPT", href: "/maps-gpt" }}
        image="/MapsGPTDesktop.png"
        imageAlt="MapsGPT consumer product interface"
        imagePosition="right"
      />

      <SectionGap />

      {/* Use cases */}
      <UseCaseCards />

      <SectionGap />

      {/* Careers */}
      <div>
        <Careers />
      </div>

      <Footer />
    </main>
  );
}
