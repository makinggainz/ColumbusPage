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

/* The reduced industry set shown in the "Tell us where you work"
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

/* The PageFrame carries a 1px #E7E7F1 hairline border site-wide (set in
   PageFrame.tsx). The business page drops it: this scoped <style> sets
   --frame-border to none while the page is mounted, and is removed on
   client-side nav to any other route — which reverts to the global
   default border. */
const FRAME_NO_BORDER_CSS = `:root { --frame-border: none; }`;

export default function BusinessPage() {
  const darkStartRef = useRef<HTMLDivElement>(null);

  return (
    <main className="ent-scope">
      <style>{FRAME_NO_BORDER_CSS}</style>
      {/* MistxNav is rendered as a direct child of <main> so its
          position:sticky has the full page as its containing block.
          Wrapping it in a navbar-height <section> would trap the sticky
          element and let it scroll away after ~88px. */}
      <MistxNav heroWhite />
      {/* z-20 keeps the hero above the white block below so the glass
          window can bleed down and overlap it (see BusinessHero). */}
      <section className="relative z-20">
        <BusinessHero />
      </section>
      {/* White mid-block. The paddingTop reserves an empty white band at the
          top so the hero's glass window can bleed down into it without
          covering the "Legacy GIS slows you down…" header — the content
          starts below the bleed. */}
      <div
        ref={darkStartRef}
        className="relative"
        style={{ backgroundColor: "#ffffff", paddingTop: "clamp(110px, 12vw, 180px)" }}
      >
        <div className="relative z-10">
          {/* ProblemCards sits on plain white — no backdrop. SolutionShowcase
              carries its own line-art (a hand-drawn galleon on the left, a
              harbour town on the right); see
              components/business/SolutionShowcase.tsx. */}
          <section className="relative">
            <ProblemCards />
          </section>
          {/* SolutionShowcase is the title/intro, ComparisonSection is its
              content directly below. The gap between them is a
              heading→content space (set on SolutionShowcase's header
              padding), not a section gap. */}
          <section className="relative">
            <SolutionShowcase />
            <ComparisonSection />
          </section>
        </div>
      </div>
      <section className="relative">
        <ProductBanner />
      </section>
      <section className="relative">
        <CapabilitiesGrid />
      </section>
      <section className="relative">
        {/* The industry-aware block ("Pick your industry" →
            IndustrySelector + the four-row UseCaseStickyScroll under
            IndustryProvider), then ColumbusSolutionsSections and the FAQ.
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
        <section className="relative">
          <FAQSection />
        </section>
      </section>
      <section className="relative">
        <ChatSection />
      </section>
      <div style={{ backgroundColor: "#ffffff" }}>
        <section className="relative">
          <Footer theme="light" />
        </section>
      </div>
    </main>
  );
}
