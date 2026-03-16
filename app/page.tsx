import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Vision } from "@/components/home/VisionSection";
import { MainFeatures } from "@/components/home/MainFeatures";
import { Applications } from "@/components/home/Applications";
import { Careers } from "@/components/home/Careers";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="bg-[#070709] min-h-screen">
      <Navbar />
      <Hero />
      <Vision />
      <MainFeatures />
      <Applications />
      <Careers />
      <Footer />
    </main>
  );
}
