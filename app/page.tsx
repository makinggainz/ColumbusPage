import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Vision } from "@/components/home/VisionSection";
import { Footer } from "@/components/layout/Footer";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ColumbusSection } from "@/components/home/ColumbusSection";
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

      {/* Columbus — Palantir Foundry style */}
      <ColumbusSection />

      <SectionGap />

      {/* MapsGPT — text left, image right */}
      <ProductShowcase
        title="MapsGPT"
        tagline="Travel like a boss"
        description="Find your next hang out spot, easier. An AI-powered social map that helps you plan cool trips, find spots, and create custom maps with friends."
        features={[
          "Plan cool trips with AI-powered recommendations",
          "Group planning — collaborate with friends in real time",
          "Find hidden gems and local spots anywhere",
          "Custom maps tailored to your interests",
        ]}
        cta={{ label: "Try it now", href: "/maps-gpt" }}
        image="/MapsGPTDesktop.png"
        imageAlt="MapsGPT AI-powered social map"
        imagePosition="right"
      />

      <div style={{ height: 80 }} />

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
