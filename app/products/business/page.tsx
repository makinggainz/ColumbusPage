"use client";

import "@/components/business/business-tokens.css";
import { useRef } from "react";
import BusinessHero from "@/components/business/BusinessHero";
import ProblemCards from "@/components/business/ProblemCards";
import SolutionShowcase from "@/components/business/SolutionShowcase";
import { MistxNav } from "@/components/layout/MistxNav";
import { Footer } from "@/components/layout/Footer";
import ComparisonSection from "@/components/business/ComparisonSection";
import ChatSection from "@/components/business/ChatSection";
import UseCaseStickyScroll from "@/components/use-cases/UseCaseStickyScroll";
import { IndustryProvider } from "@/components/use-cases/industry/IndustryContext";
import IndustrySelector from "@/components/use-cases/industry/IndustrySelector";
import IndustryStickyNavbar from "@/components/use-cases/industry/IndustryStickyNavbar";
import ColumbusSolutionsSections from "@/components/use-cases/ColumbusSolutionsSections";
import type { IndustryId } from "@/components/use-cases/industry/types";
import ProductBanner from "@/components/business/ProductBanner";
import CapabilitiesGrid from "@/components/business/CapabilitiesGrid";
import FAQSection from "@/components/business/FAQSection";

const sectionLabels = ["a", "b", "b2", "b3", "c", "d", "e", "g", "m", "n"] as const;

/* The reduced industry set shown in section g's "Tell us where you work"
   picker (and its sticky sub-navbar), ordered as the design's 3×2 grid.
   Scoped to this page — columbus-solutions still shows the full list. */
const BUSINESS_INDUSTRIES: IndustryId[] = [
  "residential-real-estate",
  "commercial-real-estate",
  "urban-infrastructure",
  "geomarketing",
  "academic-research",
  "environmental-research",
];

function SectionWithLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative">
      {process.env.NODE_ENV !== "production" && (
        <span
          className="absolute left-0 top-0 z-50 flex h-8 w-8 items-center justify-center rounded-br bg-black/80 text-sm font-bold text-white opacity-25"
          aria-hidden
        >
          {label}
        </span>
      )}
      {children}
    </section>
  );
}

export default function BusinessPage() {
  const darkStartRef = useRef<HTMLDivElement>(null);

  return (
    <main className="ent-scope">
      {/* MistxNav is rendered as a direct child of <main> — not wrapped in
          SectionWithLabel — so its position:sticky has the full page as its
          containing block. Wrapping it in a navbar-height <section> would
          trap the sticky element and let it scroll away after ~88px. */}
      <MistxNav heroWhite />
      <SectionWithLabel label={sectionLabels[1]}>
        <BusinessHero />
      </SectionWithLabel>
      {/* White mid-block. */}
      <div
        ref={darkStartRef}
        className="relative"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="relative z-10">
          {/* B2 + B3 share one city line-art backdrop. It is anchored to
              the bottom of B3 and now spans the full B2+B3 stack so the
              line-art is clearly present through ProblemCards (b2), not
              just its lower half. `top` is the single tunable knob: raise
              the % to pull the start line back down (e.g. "20%" to clear
              the b2 heading). The b2 feature cards paint solid white on
              top so they read above the art. */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                top: "0%",
                zIndex: 0,
                backgroundImage: "url(/businessartbackground.png)",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center bottom",
              }}
            />
            <div className="relative z-10">
              <SectionWithLabel label={sectionLabels[2]}>
                <ProblemCards />
              </SectionWithLabel>
              <SectionWithLabel label={sectionLabels[3]}>
                <SolutionShowcase />
              </SectionWithLabel>
            </div>
          </div>
          <SectionWithLabel label={sectionLabels[4]}>
            <ComparisonSection />
          </SectionWithLabel>
        </div>
      </div>
      <SectionWithLabel label={sectionLabels[5]}>
        <ProductBanner />
      </SectionWithLabel>
      <SectionWithLabel label="d2">
        <CapabilitiesGrid />
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[7]}>
        {/* Section g — ported from /columbus-solutions: the industry-aware
            block ("Pick your industry" → IndustrySelector + the four-row
            UseCaseStickyScroll under IndustryProvider), then
            ColumbusSolutionsSections and the FAQ.
            lightTheme is forced on so it matches the business page's
            white/homepage system. topOffset = MistxNav's height (its
            content row is py-6 ≈ 84px) so the industry sub-navbar pins
            flush under it instead of the 56px columbus-solutions navbar. */}
        <IndustryProvider>
          <IndustryStickyNavbar lightTheme topOffset={84} industries={BUSINESS_INDUSTRIES} />
          <IndustrySelector lightTheme rounded industries={BUSINESS_INDUSTRIES} />
          <UseCaseStickyScroll lightTheme roundedTop disableSticky />
        </IndustryProvider>
        <section className="relative">
          <ColumbusSolutionsSections lightTheme disableSticky roundedBottom />
        </section>
        <SectionWithLabel label="faq">
          <FAQSection />
        </SectionWithLabel>
      </SectionWithLabel>
      <SectionWithLabel label={sectionLabels[8]}>
        <ChatSection />
      </SectionWithLabel>
      <div style={{ backgroundColor: "#ffffff" }}>
        <SectionWithLabel label={sectionLabels[9]}>
          <Footer theme="light" />
        </SectionWithLabel>
      </div>
    </main>
  );
}
