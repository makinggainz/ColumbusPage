import { Navbar } from "@/components/layout/Navbar";
import { CoverLetter } from "@/components/home/CoverLetter";
import { Hero } from "@/components/home/Hero";
import { Vision } from "@/components/home/VisionSection";
import { MainFeatures } from "@/components/home/MainFeatures";
import { Applications } from "@/components/home/Applications";
import { Careers } from "@/components/home/Careers";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="bg-[#070709] min-h-screen">
      <CoverLetter />
      {/* Content sits above the fixed footer */}
      <div className="relative z-10" style={{ paddingBottom: "100vh" }}>
        <Navbar />
        <Hero />
        <Vision />
        <MainFeatures />
        <Applications />
        <Careers />
      </div>

      {/* Footer: fixed at z-0, revealed as content scrolls away */}
      <section className="relative z-0">
        <Footer reveal />
      </section>
    </main>
  );
}
