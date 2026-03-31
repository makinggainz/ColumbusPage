import { type ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Vision } from "@/components/home/VisionSection";
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
const TAIL_LENGTH = 96;

function IslandTail({ side, edge }: { side: "left" | "right"; edge: "top" | "bottom" }) {
  return (
    <div
      style={{
        position: "absolute",
        ...(edge === "top" ? { top: -TAIL_LENGTH } : { bottom: -TAIL_LENGTH }),
        [side]: 0,
        width: 1,
        height: TAIL_LENGTH,
        background: edge === "top"
          ? "linear-gradient(to bottom, transparent 0px, var(--grid-line) 100%)"
          : "linear-gradient(to top, transparent 0px, var(--grid-line) 100%)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

function Island({ children, className = "", tailTop = true, tailBottom = true }: { children: ReactNode; className?: string; tailTop?: boolean; tailBottom?: boolean }) {
  const showTails = tailTop || tailBottom;
  return (
    <div className={`mt-64 ${className}`} style={{ position: "relative", overflow: "visible" }}>
      {showTails && (
        <div
          className="pointer-events-none absolute mx-auto"
          style={{ maxWidth: 1287, zIndex: 1, top: 0, bottom: 0, left: 0, right: 0 }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {tailTop && <IslandTail side="left" edge="top" />}
            {tailTop && <IslandTail side="right" edge="top" />}
            {tailBottom && <IslandTail side="left" edge="bottom" />}
            {tailBottom && <IslandTail side="right" edge="bottom" />}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Navbar />
      <Hero />

      {/* Island 1: Vision */}
      <Island className="mt-16!" tailTop={false}>
        <Vision />
      </Island>

      {/* Island 2: Columbus Pro */}
      <Island>
        <SiteSelection />
        <Capabilities />
        <PartnerStrip />
        <Industries />
      </Island>

      {/* Island 3: MapsGPT */}
      <Island>
        <TravelSection />
        <TrustStrip />
        <GeneratedMaps />
        <UniqueSpotsSection />
      </Island>

      {/* Island 4: Applications */}
      <Island>
        <Applications />
      </Island>

      {/* Island 5: Hiring Humans */}
      <Island tailTop={false} tailBottom={false}>
        <Careers />
      </Island>

      <Footer />
    </main>
  );
}
