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
import BusinessFeatureIndex from "@/components/business/BusinessFeatureIndex";
import SuperFeatureSection from "@/components/business/SuperFeatureSection";
import PatternsDetectedCard from "@/components/business/PatternsDetectedCard";
import ColumbusReasoningCard from "@/components/business/ColumbusReasoningCard";
import SmartLayerRow from "@/components/business/superFeatureRows/SmartLayerRow";
import SurveyEarthRow from "@/components/business/superFeatureRows/SurveyEarthRow";
import BetterPricesRow from "@/components/business/superFeatureRows/BetterPricesRow";
import AgenticResearchTriad from "@/components/business/superFeatureRows/AgenticResearchTriad";
import DashboardListMockup from "@/components/business/superFeatureRows/DashboardListMockup";
import ForecastCard from "@/components/business/ForecastCard";
import HarmonizedFilesCard from "@/components/business/HarmonizedFilesCard";
import MapLayeredVisual from "@/components/business/MapLayeredVisual";

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

/* 36×36 chip that wraps a 24-vbox SVG icon — used for the super-feature
   header icon and for each sub-feature's icon. Children are <path>/<circle>
   elements; the chip controls fill/stroke/size so all icons share the same
   weight and colour. */
function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center"
      style={{
        width: 36,
        height: 36,
        borderRadius: 9999,
        background: "rgba(11,27,43,0.06)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0B1B2B"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

export default function BusinessPage() {
  const darkStartRef = useRef<HTMLDivElement>(null);

  return (
    <main className="ent-scope">
      <style>{FRAME_NO_BORDER_CSS}</style>
      <BusinessFeatureIndex />
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
      {/* White mid-block, holding the "Legacy GIS slows you down…" intro
          and the sections below it. */}
      <div
        ref={darkStartRef}
        className="relative"
        style={{ backgroundColor: "#ffffff", paddingTop: "clamp(48px, 6vw, 96px)" }}
      >
        {/* z-30 keeps this content above the hero photo (z-20). */}
        <div className="relative z-30">
          {/* ProblemCards sits on plain white — no backdrop. SolutionShowcase
              carries its own line-art (a hand-drawn galleon on the left, a
              harbour town on the right); see
              components/business/SolutionShowcase.tsx. */}
          <section id="problem" className="relative">
            <ProblemCards />
          </section>
          {/* SolutionShowcase is the title/intro, ComparisonSection is its
              content directly below. The gap between them is a
              heading→content space (set on SolutionShowcase's header
              padding), not a section gap. */}
          <section id="solution" className="relative">
            <SolutionShowcase />
            <ComparisonSection />
          </section>
        </div>
      </div>
      <section className="relative">
        <ProductBanner />
      </section>
      <section id="capabilities" className="relative">
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
          {/* Industry sticky zone — the sub-navbar above observes this
              wrapper, so the navbar appears the moment the user scrolls
              into the first super-feature ("Ask, Discover, Understand")
              and stays visible through the use-case stack below. */}
          <div data-industry-sticky-zone>
          <SuperFeatureSection
            id="chat"
            icon={
              <IconChip>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </IconChip>
            }
            title="Ask, Discover, Understand"
            subtitle={
              <>
                With <a href="#" style={{ color: "var(--ent-accent)" }}>conversational map chat</a>, ask your chat directly about anything.<br />
                Have a conversation like you&rsquo;re talking to your best Noids analyst
              </>
            }
            backgroundImage="/ColumBuzHero.png"
            subFeatureBackdrop="/Residential/res-bg-2.png"
            demoImage="/business/mapchatBusiness.png"
            demoAlt="Conversational map chat"
            subFeatures={[
              {
                title: "See what others cant",
                description: (
                  <>
                    Sophisticated <a href="#" style={{ color: "var(--ent-accent)" }}>pattern detection</a>.
                    Ask chat to uncover hidden patterns across the map &amp; data
                  </>
                ),
                visual: (
                  <MapLayeredVisual
                    map="/MapChatbackgroundimg.png"
                    alt="Map chat background"
                    variant="floating"
                  >
                    <PatternsDetectedCard />
                  </MapLayeredVisual>
                ),
              },
              {
                title: "Like weather forcasts for real-estate",
                description: (
                  <>
                    <p>
                      Like weather forecasts, but for [UserIndustry]. <a href="#" style={{ color: "var(--ent-accent)" }}>Predict the future</a> on Columbus.
                    </p>
                    <p className="mt-3">Forecast residential prices, note future hot areas.</p>
                    <p className="mt-3">Powered by a deep-learning pattern recognition fed by the most up-to-date and high quality data.</p>
                  </>
                ),
                visual: (
                  <MapLayeredVisual map="/MapChatbackgroundimg.png" alt="Map chat background">
                    <ForecastCard />
                  </MapLayeredVisual>
                ),
              },
              {
                title: "AI that critically thinks",
                description: (
                  <>
                    <p>Columbus AI considers a wide breadth of data everytime it critically thinks.</p>
                    <p className="mt-3">Transparent reasoning. You can tap to see all the investigation the AI does.</p>
                  </>
                ),
                visual: <ColumbusReasoningCard />,
              },
              {
                title: "Drop Any File, Columbus does the rest",
                description: (
                  <>
                    <p>
                      Drop in messy spreadsheets, PDFs, or exports — Columbus <a href="#" style={{ color: "var(--ent-accent)" }}>harmonizes</a> them and puts them on the map.
                    </p>
                    <p className="mt-3">No schemas to define, no columns to map. Just upload and ask follow-up questions in plain English.</p>
                  </>
                ),
                visual: (
                  <MapLayeredVisual map="/MapChatbackgroundimg.png" alt="Map chat background">
                    <HarmonizedFilesCard />
                  </MapLayeredVisual>
                ),
              },
            ]}
          />
          <SuperFeatureSection
            id="data-catalogue"
            icon={
              <IconChip>
                {/* database — trusted data catalogue */}
                <ellipse cx="12" cy="5" rx="8" ry="3" />
                <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
                <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
              </IconChip>
            }
            title="Trusted data, verified for confidence"
            subtitle={
              <>
                Access proprietary data, and the highest quality data from our <a href="#" style={{ color: "var(--ent-accent)" }}>curated data catalogue</a>. Data on Columbus is triple-checked.
              </>
            }
            backgroundImage="/vibegreen.png"
            subFeatureBackdrop="/Residential/res-bg-6.png"
            demoImage="/dataCataSm.png"
            demoAlt="Columbus data manager"
            subFeatures={[
              {
                title: "With smart layers, you become an artist",
                description: null,
                visual: <SmartLayerRow />,
                stacked: true,
              },
              {
                id: "super-model",
                title: "Survey the earth with a super model",
                description: null,
                visual: <SurveyEarthRow />,
                stacked: true,
              },
              {
                title: "Better Data, Better Prices",
                description: null,
                visual: <BetterPricesRow />,
                stacked: true,
              },
            ]}
          />
          <SuperFeatureSection
            id="agentic-research"
            icon={
              <IconChip>
                {/* document with pencil — research / report */}
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="m11 13 4 4" />
                <path d="M15 11h3v3" />
              </IconChip>
            }
            title="Agentic Research"
            subtitle={<>Send our fleet to do all the exploring for you.</>}
            backgroundImage="/ColumBuzHero.png"
            subFeatureBackdrop="/Residential/res-bg-7.png"
            demoImage="/business/mapchatBusiness.png"
            demoAlt="Columbus Map Chat View — Minneapolis real estate property flips"
            subFeatures={[
              {
                title: "Agentic research sub-features",
                description: null,
                visual: <AgenticResearchTriad />,
                stacked: true,
              },
            ]}
          />
          <SuperFeatureSection
            id="dashboard"
            icon={
              <IconChip>
                {/* 2x2 grid — dashboard */}
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </IconChip>
            }
            title="Dashboard"
            subtitle={<>All your work organized and easy to access.</>}
            backgroundImage="/ColumBuzHero.png"
            demoVisual={<DashboardListMockup />}
            panel={false}
          />
          <UseCaseStickyScroll lightTheme roundedTop disableSticky />
          </div>
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
