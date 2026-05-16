"use client";

import "@/components/enterprise/enterprise-tokens.css";
import { useRef } from "react";
import EnterpriseHero from "@/components/enterprise/EnterpriseHero";
import ProblemCards from "@/components/enterprise/ProblemCards";
import SolutionShowcase from "@/components/enterprise/SolutionShowcase";
import { MistxNav } from "@/components/layout/MistxNav";
import { Footer } from "@/components/layout/Footer";
import ComparisonSection from "@/components/enterprise/ComparisonSection";
import ChatSection from "@/components/enterprise/ChatSection";
import PromptShowcase from "@/components/enterprise/PromptShowcase";
import ContactSection from "@/components/use-cases/ContactSection";
import UseCaseStickyScroll from "@/components/use-cases/UseCaseStickyScroll";
import { IndustryProvider } from "@/components/use-cases/industry/IndustryContext";
import IndustrySelector from "@/components/use-cases/industry/IndustrySelector";
import IndustryStickyNavbar from "@/components/use-cases/industry/IndustryStickyNavbar";
import ColumbusSolutionsSections from "@/components/use-cases/ColumbusSolutionsSections";
import type { IndustryId } from "@/components/use-cases/industry/types";
import ProductBanner from "@/components/enterprise/ProductBanner";
import CapabilitiesGrid from "@/components/enterprise/CapabilitiesGrid";
import DifferenceSection from "@/components/enterprise/DifferenceSection";

const sectionLabels = ["a", "b", "b2", "b3", "c", "d", "e", "g", "m", "n"] as const;

/* The reduced industry set shown in section g's "Tell us where you work"
   picker (and its sticky sub-navbar), ordered as the design's 3×2 grid.
   Scoped to this page — columbus-solutions still shows the full list. */
const ENTERPRISE_INDUSTRIES: IndustryId[] = [
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

export default function EnterprisePage() {
  const darkStartRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<HTMLDivElement>(null);

  return (
    <main className="ent-scope">
      {/* MistxNav is rendered as a direct child of <main> — not wrapped in
          SectionWithLabel — so its position:sticky has the full page as its
          containing block. Wrapping it in a navbar-height <section> would
          trap the sticky element and let it scroll away after ~88px. */}
      <MistxNav heroWhite />
      <SectionWithLabel label={sectionLabels[1]}>
        <EnterpriseHero />
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
                backgroundImage: "url(/enterpriseartbackground.png)",
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
            ColumbusSolutionsSections, through ContactSection
            ("We're at the frontier. / The horizon is wide.").
            lightTheme is forced on so it matches the enterprise page's
            white/homepage system. topOffset = MistxNav's height (its
            content row is py-6 ≈ 84px) so the industry sub-navbar pins
            flush under it instead of the 56px columbus-solutions navbar. */}
        <IndustryProvider>
          <IndustryStickyNavbar lightTheme topOffset={84} industries={ENTERPRISE_INDUSTRIES} />
          <IndustrySelector lightTheme rounded industries={ENTERPRISE_INDUSTRIES} />
          <UseCaseStickyScroll lightTheme />
        </IndustryProvider>
        <section className="relative">
          <ColumbusSolutionsSections lightTheme />
        </section>
        <section className="relative">
          <ContactSection lightTheme />
        </section>
      </SectionWithLabel>
      <div ref={diffRef}>
        <SectionWithLabel label="diff">
          <DifferenceSection />
        </SectionWithLabel>
        <SectionWithLabel label={sectionLabels[6]}>
          <PromptShowcase />
        </SectionWithLabel>
      </div>
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
