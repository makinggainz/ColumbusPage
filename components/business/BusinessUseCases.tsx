"use client";

import React from "react";
import SuperFeatureSection from "./SuperFeatureSection";
import { CODEX_GRADIENTS } from "./GradientPanel";
import PatternsDetectedCard, { type PatternsDetectedCardProps } from "./PatternsDetectedCard";
import ColumbusReasoningCard, { type ColumbusReasoningCardProps } from "./ColumbusReasoningCard";
import ForecastCard, { type ForecastCardProps } from "./ForecastCard";
import HarmonizedFilesCard, { type HarmonizedFilesCardProps } from "./HarmonizedFilesCard";
import MapLayeredVisual from "./MapLayeredVisual";
import MapChatPlatform, { type MapChatPlatformProps } from "./MapChatPlatform";
import SmartLayerRow, { type SmartLayerRowProps } from "./superFeatureRows/SmartLayerRow";
import SurveyEarthRow, { type SurveyEarthRowProps } from "./superFeatureRows/SurveyEarthRow";
import BetterPricesRow, { type BetterPricesRowProps } from "./superFeatureRows/BetterPricesRow";
import AgenticResearchTriad, { type AgenticResearchTriadProps } from "./superFeatureRows/AgenticResearchTriad";
import DashboardListMockup, { type DashboardListMockupProps } from "./superFeatureRows/DashboardListMockup";
import { useIndustry } from "@/components/use-cases/industry/IndustryContext";
import type { IndustryId } from "@/components/use-cases/industry/types";

/* 36×36 chip that wraps a 24-vbox SVG icon — local to the use-cases
   block since this is the only place it's used now. */
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

/* Inline blue keyword. Always rendered as an underline-less <a> to match the
   site's existing pattern — link target is left as # because these are
   styled tokens, not navigation. */
function Blue({ children }: { children: React.ReactNode }) {
  return (
    <a href="#" style={{ color: "var(--ent-accent)", fontWeight: 500 }}>
      {children}
    </a>
  );
}

/* Per-section backdrop set for one industry. `chatSub` is an array of
   4 backdrops, one per chat sub-feature — passed through each sub-item's
   `backdropImage` override so each row gets its own photo instead of
   sharing one. Other sections only have a hero backdrop today since their
   sub-features are stacked and don't render SkyBackdrops. */
type IndustryBackdrops = {
  chatHero: string;
  chatSub: [string, string, string, string];
  dataCatalogueHero: string;
  agenticResearchHero: string;
  dashboardHero: string;
  /* Used as the main frame's backgroundSize for the data-catalogue hero
     so the ColumBuzHero "all blue" crop still works for residential while
     other industries use the default cover behavior. */
  dataCatalogueHeroPosition?: string;
  dataCatalogueHeroSize?: string;
  /* Chat hero positional tweak (residential's tall portrait photos do
     better with center top so the sky doesn't dominate). */
  chatHeroPosition?: string;
  /* Optional per-sub-feature background-position override for the chat
     sub-feature SkyBackdrops. `undefined` entries inherit SkyBackdrop's
     default "center". Aligned to `chatSub` by index. */
  chatSubPositions?: [string?, string?, string?, string?];
};

/* Mapping authored against /Users/.../Downloads/comi.pdf (which the user
   confirmed is the design pass for the residential industry — its
   filename and content were swapped). Each slot's image matches the
   preview thumbnail under the corresponding feature title in that PDF.

   Slot → PDF preview → asset:
   chatHero          → sky + clouds with roof peeks → res-bg-1 @ 40%
   chatSub[0]        → suburban houses landscape    → res-bg-2
   chatSub[1]        → dense city aerial (Madrid)   → res-bg-3
   chatSub[2]        → apts + distant skyline       → res-bg-5
   chatSub[3]        → hillside houses + city       → res-bg-4
   dataCatalogueHero → European tree-lined street   → res-bg-6
                       (consumed as the Agentic Research hero — see the
                       "Backdrop shifted down" comment below)
   agenticResearchHero → modern apts, NO skyline    → res-bg-7
                         (consumed as the Dashboard hero)
   dashboardHero     → unused (slot chain shifted up). */
const RESIDENTIAL_BACKDROPS: IndustryBackdrops = {
  chatHero: "/Residential/res-bg-1.png",
  /* res-bg-1 is a portrait suburban shot with the cloud band at ~30–55%
     of the photo. "center 40%" puts the visible slice on the clouds with
     a sliver of roof peaks at the bottom — matching the PDF chatHero. */
  chatHeroPosition: "center 40%",
  chatSub: [
    "/Residential/res-bg-2.png",
    "/Residential/res-bg-3.png",
    "/Residential/res-bg-5.png",
    "/Residential/res-bg-4.png",
  ],
  dataCatalogueHero: "/Residential/res-bg-6.png",
  agenticResearchHero: "/Residential/res-bg-7.png",
  dashboardHero: "/Residential/res-bg-1.png",
};

/* Mapping authored against /Users/.../Downloads/resi.pdf (which the user
   confirmed is the design pass for the commercial industry — its
   filename and content were swapped). Each slot's image matches the
   preview thumbnail under the corresponding feature title in that PDF.

   Slot → PDF preview → asset:
   chatHero          → sky + clouds + faint skyscraper peaks
                       → ColumBuzHero @ "center 25%" (top sky band)
   chatSub[0]        → skyscrapers + clouds (former hero photo)
                       → ColumbusBackgroundV2 @ "center 40%"
   chatSub[1]        → London skyline + Thames + Tower Bridge → London
   chatSub[2]        → NYC 3-point perspective of Central Park
                       + flanking skyscrapers → businessback3
   chatSub[3]        → same portrait as chatSub[0], anchored to the
                       very bottom so the visible band lands on the
                       park lawn → ColumbusBackgroundV2 @ "center bottom"
   dataCatalogueHero → aerial city neighbourhoods       → cre-bg-2
                       (consumed as the Agentic Research hero)
   agenticResearchHero → downtown buildings close-up    → cre-bg-1
                         (consumed as the Dashboard hero)
   dashboardHero     → unused (slot chain shifted up). */
const COMMERCIAL_BACKDROPS: IndustryBackdrops = {
  chatHero: "/ColumBuzHero.png",
  /* ColumBuzHero is a portrait NYC photo with pure blue sky at the very
     top, cloud + skyscraper-peak band at ~30–55%, full skyline at
     ~55–70%, and a faded Central Park at the bottom. "center 25%" puts
     the visible slice on the upper sky + cloud zone so the chat hero
     reads as clouds with just a hint of the skyline at the bottom. */
  chatHeroPosition: "center 25%",
  chatSub: [
    "/ColumbusBackgroundV2.png",
    "/London.png",
    "/businessback3.png",
    "/ColumbusBackgroundV2.png",
  ],
  /* chatSub[0] uses the former portrait hero photo of NYC's Central Park
     skyline; "center 40%" lands the square crop on the cloud + skyscraper
     band so the "See what others cant" tile reads as skyscrapers framed
     by clouds. chatSub[3] reuses the same portrait, but anchored to the
     very bottom so the visible band lands on the park lawn (matches the
     "Drop Any File" tile in the PDF). */
  chatSubPositions: ["center 40%", undefined, undefined, "center bottom"],
  dataCatalogueHero: "/CREbg/cre-bg-2.png",
  agenticResearchHero: "/CREbg/cre-bg-1.png",
  dashboardHero: "/CREbg/cre-bg-2.png",
};

const ENVIRONMENTAL_BACKDROPS: IndustryBackdrops = {
  chatHero: "/Environmental/env-bg-1.png",
  chatSub: [
    "/Environmental/env-bg-2.png",
    "/Environmental/env-bg-3.png",
    "/Environmental/env-bg-4.png",
    "/Environmental/env-bg-5.png",
  ],
  dataCatalogueHero: "/Environmental/env-bg-6.png",
  agenticResearchHero: "/Environmental/env-bg-7.png",
  dashboardHero: "/Environmental/env-bg-1.png",
};

const ACADEMIC_BACKDROPS: IndustryBackdrops = {
  chatHero: "/Academic/acad-bg-1.png",
  /* chatSub[3] (Drop Any File) uses acad-bg-6; the chain then shifts so
     the Agentic Research and Dashboard hero slots pick up acad-bg-7 and
     acad-bg-8 respectively. acad-bg-5 — the Screenshot file at slot 5 —
     drops out of the active mapping. */
  chatSub: [
    "/Academic/acad-bg-2.png",
    "/Academic/acad-bg-3.png",
    "/Academic/acad-bg-4.png",
    "/Academic/acad-bg-6.png",
  ],
  dataCatalogueHero: "/Academic/acad-bg-7.png",
  agenticResearchHero: "/Academic/acad-bg-8.png",
  dashboardHero: "/Academic/acad-bg-1.png",
};

const GEOMARKETING_BACKDROPS: IndustryBackdrops = {
  chatHero: "/Geomarketing/geo-bg-1.png",
  chatSub: [
    "/Geomarketing/geo-bg-2.png",
    "/Geomarketing/geo-bg-3.png",
    "/Geomarketing/geo-bg-4.png",
    "/Geomarketing/geo-bg-5.png",
  ],
  dataCatalogueHero: "/Geomarketing/geo-bg-6.png",
  agenticResearchHero: "/Geomarketing/geo-bg-7.png",
  dashboardHero: "/Geomarketing/geo-bg-1.png",
};

const URBAN_INFRASTRUCTURE_BACKDROPS: IndustryBackdrops = {
  chatHero: "/UrbanInfrastructure/urb-bg-1.png",
  chatSub: [
    "/UrbanInfrastructure/urb-bg-2.png",
    "/UrbanInfrastructure/urb-bg-3.png",
    "/UrbanInfrastructure/urb-bg-4.png",
    "/UrbanInfrastructure/urb-bg-5.png",
  ],
  dataCatalogueHero: "/UrbanInfrastructure/urb-bg-6.png",
  agenticResearchHero: "/UrbanInfrastructure/urb-bg-7.png",
  dashboardHero: "/UrbanInfrastructure/urb-bg-1.png",
};

const GRADIENT_BACKDROPS: IndustryBackdrops = {
  chatHero: CODEX_GRADIENTS.chat,
  chatSub: [CODEX_GRADIENTS.chat, CODEX_GRADIENTS.chat, CODEX_GRADIENTS.chat, CODEX_GRADIENTS.chat],
  dataCatalogueHero: CODEX_GRADIENTS.dataCatalogue,
  agenticResearchHero: CODEX_GRADIENTS.agenticResearch,
  dashboardHero: CODEX_GRADIENTS.dashboard,
};

function backdropsFor(industryId: IndustryId): IndustryBackdrops {
  /* Commercial real estate is the ONLY industry that uses the /CREbg set —
     never fall back to it for any other industry. Every industry without
     its own photo set falls back to Residential. */
  if (industryId === "commercial-real-estate") return COMMERCIAL_BACKDROPS;
  if (industryId === "environmental-research") return ENVIRONMENTAL_BACKDROPS;
  if (industryId === "academic-research") return ACADEMIC_BACKDROPS;
  if (industryId === "geomarketing") return GEOMARKETING_BACKDROPS;
  if (industryId === "urban-infrastructure") return URBAN_INFRASTRUCTURE_BACKDROPS;
  return RESIDENTIAL_BACKDROPS;
}

/* Per-industry copy block. Titles never change (they brand the feature),
   only the section subtitles + each chat sub-feature's description vary.
   Blue keywords ("conversational map chat", "pattern detection", "Predict
   the future", "harmonizes", "curated data catalogue") are preserved
   across every industry — the per-industry copy is woven around them. */
type IndustryCards = {
  /* Props injected into the 4 chat sub-feature cards. Each card has sensible
     residential/CRE defaults, so any field can be omitted when an industry
     doesn't have specific PDF content to substitute. */
  patterns: PatternsDetectedCardProps;
  forecast: ForecastCardProps;
  reasoning: ColumbusReasoningCardProps;
  harmonized: HarmonizedFilesCardProps;
};

type IndustryStackedRows = {
  /* Props injected into the 5 stacked-row components rendered inside the
     data-catalogue, agentic-research, and dashboard sections. Same default
     pattern as `cards`. */
  smartLayer: SmartLayerRowProps;
  surveyEarth: SurveyEarthRowProps;
  betterPrices: BetterPricesRowProps;
  agenticTriad: AgenticResearchTriadProps;
  dashboard: DashboardListMockupProps;
};

type IndustryCopy = {
  chatSubtitle: React.ReactNode;
  sub1Description: React.ReactNode;
  sub2Description: React.ReactNode;
  sub3Description: React.ReactNode;
  sub4Description: React.ReactNode;
  dataCatalogueSubtitle: React.ReactNode;
  agenticResearchSubtitle: React.ReactNode;
  cards: IndustryCards;
  rows: IndustryStackedRows;
  /* Props for the live MapChatPlatform shown as the demo visual on both
     the chat super-section and the agentic-research super-section. */
  mapChat: MapChatPlatformProps;
};

const RESIDENTIAL_COPY: IndustryCopy = {
  chatSubtitle: (
    <>
      With <Blue>conversational map chat</Blue>, ask your chat directly about anything. Have a conversation like you&rsquo;re talking to your best analyst.
      <div className="mt-3">
        Faster site-selection for Residential Real Estate customers, including Consultants, Residential Developers, and Wholesale brokers.
      </div>
    </>
  ),
  sub1Description: (
    <>
      Sophisticated <Blue>pattern detection</Blue>.
      Ask chat to uncover hidden patterns across the map &amp; data.
    </>
  ),
  sub2Description: (
    <>
      <p>
        Like weather forecasts, but for residential real estate. <Blue>Predict the future</Blue> on Columbus.
      </p>
      <p className="mt-3">Forecast residential prices, note future hot areas.</p>
      <p className="mt-3">Powered by a deep-learning pattern recognition fed by the most up-to-date and high quality data.</p>
    </>
  ),
  sub3Description: (
    <>
      <p>Columbus AI considers a wide breadth of data everytime it critically thinks.</p>
      <p className="mt-3">Transparent reasoning. You can tap to see all the investigation the AI does.</p>
    </>
  ),
  sub4Description: (
    <>
      <p>
        Drop in any file — Shapefile, KML, CSV, XLSX, PDF, CAD — Columbus <Blue>harmonizes</Blue> them and overlays them as a visualized map layer.
      </p>
      <p className="mt-3">No schemas to define, no columns to map. Just upload and ask follow-up questions in plain English.</p>
    </>
  ),
  dataCatalogueSubtitle: (
    <>
      Access proprietary data, and the highest quality data from our <Blue>curated data catalogue</Blue>. Data on Columbus is triple-checked.
    </>
  ),
  agenticResearchSubtitle: (
    <>
      Hand Columbus your residential brief and grab a coffee — it&rsquo;ll research new sites, run buyer-demand and absorption studies, and deliver professional, review-ready reports while you focus on other work.
    </>
  ),
  cards: {
    patterns: {
      heading: "4 patterns detected",
      area: "Across the Madrid metro area · Q2 2026",
      patterns: [
        { n: 1, title: "Single-Entity Holdings Near New Metro", properties: "412 parcels", roi: "Avg ROI: 26%" },
        { n: 2, title: "Undeveloped Lots Below €800/m²", properties: "189 parcels", roi: "Avg ROI: 22%" },
        { n: 3, title: "10+ Year Holds Ripe For Rezoning", properties: "276 parcels", roi: "Avg ROI: 19%" },
        { n: 4, title: "Single-Family Hot Zones", properties: "340 areas", roi: "Avg ROI: 17%" },
      ],
    },
    forecast: {
      questionRecap:
        "Here are the Madrid neighborhoods forecasted to see the highest selling prices for single-family homes in the next 1–2 years",
      panelTitle: "Top 4 Neighborhoods by Forecasted Sale Price Growth",
      panelSubtitle: "Next 24 Months",
      items: [
        { rank: 1, label: "Chamberí", delta: "+9.4%" },
        { rank: 2, label: "Salamanca", delta: "+8.1%" },
        { rank: 3, label: "Alcobendas", delta: "+7.2%" },
        { rank: 4, label: "Pozuelo", delta: "+6.5%" },
      ],
      takeaway:
        "Single-family demand in Madrid is concentrating in inner-ring neighborhoods with new transit, with Alcobendas leading the suburban set.",
    },
    reasoning: {
      prompt:
        "Should I acquire this 12,000 m² parcel in Alcobendas for a 60-unit residential project?",
      items: [
        { label: "Current zoning vs. likely upcoming municipal plan revisions", body: "" },
        { label: "Absorption rate", body: "of comparable units in 5km radius" },
        { label: "Demographic in-migration trends", body: "" },
        { label: "Infrastructure load", body: "(school capacity, road throughput)" },
        { label: "Competitor pipeline", body: "within the submarket" },
        { label: "Mortgage rate sensitivity", body: "of the target buyer profile" },
        { label: "Soil / flood / seismic risk layers", body: "" },
        { label: "Historical permit approval timelines", body: "for this municipality" },
      ],
    },
    harmonized: {
      files: [
        "ZoningMap_Municipal.pdf",
        "shapefile_GIS_contractor.shp",
        "parcel_addresses.xlsx",
        "houseCAD_file.cad",
      ],
      followUp:
        "now show me which of these parcels could legally hold a 60-unit project under current zoning",
    },
  },
  rows: {
    smartLayer: {
      layerName: "Façade Renovation Status",
      layerSubtitle: "Villanueva del Pardillo · every residential structure",
      layerDescription:
        "AI-generated layer classifying every residential building as Recently Renovated, Original Condition / Well-Maintained, or Deteriorated / Renovation Candidate.",
      features: [
        { title: "Inferred from satellite + street-level imagery", description: "Façade condition graded across the full municipality, even where survey data is missing." },
        { title: "Cross-checked against cadastral construction dates", description: "Triple-checked for completeness and consistency before every release." },
        { title: "Building-level scoring", description: "Fresh data, continuously monitored and maintained." },
      ],
      mapAlt: "Villanueva del Pardillo façade condition heatmap",
      promptText:
        "Generate a smart layer estimating building age, façade condition, and renovation status for every residential structure in the municipality of Villanueva del Pardillo. Classify each building as: Recently Renovated (last 10 years), Original Condition / Well-Maintained, or Deteriorated / Renovation Candidate.",
    },
    surveyEarth: {
      reasoningBullets: [
        "Considering proximity to public and private schools rated 7+/10",
        "Filtering for density of parks over 2,000 m² within 500m walking distance",
        "Filtering for presence of pediatric clinics and family healthcare within 1km",
        "Filtering for traffic volume and street-safety scores on residential streets",
        "Filtering density of grocery stores and pharmacies within walking distance",
      ],
      promptText:
        "Create a smart layer showing 'family-friendliness density' — combining proximity to schools rated 7+/10, parks over 2,000 m², pediatric clinics, low-traffic streets, and grocery stores within 500m walking distance.",
      mapAlt: "Family-friendliness density choropleth for residential Madrid",
    },
    betterPrices: {
      columbusTitle: "Forward-Looking Municipal Plan Revision Tracker",
      columbusPrice: "€2,400 / year",
      columbusMapAlt: "Spanish PGOU revision tracker preview",
      columbusFeatures: [
        { title: "55,010 rows", description: "Aggregated, structured data on every pending PGOU revision across Spanish municipalities — drafts, public-comment phases, approval timelines." },
        { title: "Verified accuracy", description: "Triple-checked against municipal filings and registry records." },
        { title: "Updated quarterly", description: "Fresh data, continuously monitored as revisions move through public comment." },
      ],
      competitorTitle: "Planning-consultancy engagement, generic municipal summaries",
      competitorPrice: "€20,000+ / year",
      competitorMapAlt: "Planning consultancy report preview",
      competitorFeatures: [
        { title: "Engagement-based", description: "Delivered through a consultancy engagement, scoped to specific municipalities you flag in advance." },
        { title: "Self-reported summaries", description: "Pulled from municipal press releases, not independently cross-checked." },
        { title: "Updated on request", description: "Refreshes are tied to the consulting engagement cycle, not the revision cycle itself." },
      ],
    },
    agenticTriad: {
      reports: {
        description: "Find the top development sites for mid-rise residential in your target region — review-ready shortlists with parcel-level comps and envelope criteria.",
      },
      audits: {
        description: "Generative parcel due diligence: zoning, infrastructure, soil/flood/seismic risk, and competitor pipeline — with an on-the-ground surveying team available on request.",
      },
      compliance: {
        description: "Audit candidate parcels for the legal maximum buildable residential square footage across all applicable zoning, overlays, and municipal regulations.",
      },
    },
    dashboard: {
      rows: [
        { title: "Madrid metro parcels over 5,000 m² zoned for residential", body: "In this chat we filtered undeveloped parcels within 1km of a metro station and owned by a single entity for 10+ years.", age: "20 hours ago" },
        { title: "Alcobendas — 12,000 m² parcel acquisition due diligence", body: "In this chat we evaluated a 60-unit residential project against zoning, absorption rate, and competitor pipeline.", age: "1 day ago" },
        { title: "Madrid neighborhoods forecasted for highest single-family price growth", body: "In this chat we ranked districts by demographic trajectory, lot-price recency, and planned infrastructure.", age: "2 days ago" },
        { title: "Family-friendliness density layer across central Madrid", body: "In this chat we built a custom smart layer combining schools, parks, pediatric clinics, and grocery access.", age: "3 days ago" },
        { title: "Valencia province mid-rise residential site shortlist", body: "In this chat Columbus ranked 15 development sites against your 8,000–20,000 m² envelope and 30-min city-center radius.", age: "4 days ago" },
        { title: "East Austin maximum buildable envelope audit", body: "In this chat we audited the legal cap on residential square footage under SF-3 zoning + HOME Initiative Phase 2 amendments.", age: "5 days ago" },
      ],
    },
  },
  mapChat: {
    breadcrumb: "Madrid · residential parcel search",
    cityLabel: "Madrid",
    pois: [
      { top: "28%", left: "55%", label: "Salamanca", tone: "accent" },
      { top: "78%", left: "46%", label: "Chamberí", tone: "dark" },
    ],
    filterLabel: "Income data",
    filterHelp: "Filter by household income (€ amounts)",
    dataCardTitle: "Households Median Income",
    dataCardMin: "€18,400",
    dataCardMax: "€96,200",
    dataCardSecondary: "Single-Family Buyer Density",
  },
};

const COMMERCIAL_COPY: IndustryCopy = {
  chatSubtitle: (
    <>
      With <Blue>conversational map chat</Blue>, ask your chat directly about anything.<br />
      Have a conversation like you&rsquo;re talking to your best analyst.
    </>
  ),
  sub1Description: (
    <>
      Sophisticated <Blue>pattern detection</Blue>.
      Ask chat to uncover hidden patterns across the map &amp; data.
    </>
  ),
  sub2Description: (
    <>
      <p>
        Like weather forecasts, but for commercial real estate. <Blue>Predict the future</Blue> on Columbus.
      </p>
      <p className="mt-3">Forecast prime-rent growth, submarket trajectory, and emerging hotspots.</p>
      <p className="mt-3">Powered by a deep-learning pattern recognition fed by the most up-to-date and high quality data.</p>
    </>
  ),
  sub3Description: (
    <>
      <p>Columbus AI considers a wide breadth of data everytime it critically thinks — separating broker narrative from ground truth.</p>
      <p className="mt-3">Transparent reasoning. You can tap to see safety, footfall, credit-quality, and macro signals the AI weighs on every acquisition.</p>
    </>
  ),
  sub4Description: (
    <>
      <p>
        Drop in any file — Shapefile, KML, KMZ, CSV, XLSX, PDF, GeoTIFF — Columbus <Blue>harmonizes</Blue> them and overlays them as unified, coordinate-aligned map layers.
      </p>
      <p className="mt-3">No schemas to define, no columns to map. Just upload and ask follow-up questions in plain English.</p>
    </>
  ),
  dataCatalogueSubtitle: (
    <>
      Access proprietary data, and the highest quality data from our <Blue>curated data catalogue</Blue>. Data on Columbus is triple-checked.
    </>
  ),
  agenticResearchSubtitle: (
    <>
      Hand Columbus your CRE brief and grab a coffee — it&rsquo;ll research acquisition shortlists, run due diligence, and deliver professional, review-ready reports while you focus on other work.
    </>
  ),
  cards: {
    patterns: {
      heading: "4 patterns detected",
      area: "Across Manhattan · trailing 18 months",
      patterns: [
        { n: 1, title: "PE Funds Concentrating in Pre-War Office", properties: "187 transactions", roi: "Avg cap: 5.4%" },
        { n: 2, title: "Multifamily Rotation Out of Midtown", properties: "94 transactions", roi: "Avg cap: 4.9%" },
        { n: 3, title: "Mixed-Use Buys Near New Subway Stops", properties: "61 transactions", roi: "Avg cap: 5.1%" },
        { n: 4, title: "Industrial-to-Residential Conversions", properties: "42 transactions", roi: "Avg cap: 5.6%" },
      ],
    },
    // Current defaults are already London / Grade A CRE — keep them.
    forecast: {},
    // Current default prompt is already the Milan Porta Nuova CRE prompt.
    reasoning: {},
    harmonized: {
      files: [
        "Portfolio_RentRoll_2011_Master.xlsx",
        "Holdings_Map_Brokerage_Hauck.kmz",
        "Planning_Consultant_Parcels_DE.shp",
        "Yardi_Export_Q1_2026.csv",
      ],
      followUp:
        "now overlay our nearest 2 competitors, and their portfolios. I want to see a easy visual of the comparison",
    },
  },
  rows: {
    // Default smart-layer / survey-earth content is already the Nashville
    // multifamily and "next Williamsburg/Bushwick" CRE prompts — keep defaults.
    smartLayer: {},
    surveyEarth: {},
    betterPrices: {
      columbusTitle: "Permitting Approval Map for CRE Acquisitions",
      columbusPrice: "$2,400 / year",
      columbusMapAlt: "CRE permitting approval map preview",
      columbusFeatures: [
        { title: "33,520 rows", description: "Per-submarket permitting approval rates, timelines, and entitlement risk for office, multifamily, and mixed-use." },
        { title: "Verified accuracy", description: "Triple-checked against municipal filings and entitlement records." },
        { title: "Updated quarterly", description: "Fresh data, continuously monitored as deals move through entitlement." },
      ],
      competitorTitle: "Broker-network estimates, market-wide aggregates only",
      competitorPrice: "$18,000 / year",
      competitorMapAlt: "Competitor data layer preview",
      competitorFeatures: [
        { title: "8,200 rows", description: "Market-wide aggregated permitting counts pulled from a single brokerage's quarterly report." },
        { title: "Self-reported data", description: "Provided directly by the broker, not independently audited or cross-checked." },
        { title: "Updated annually", description: "Refreshed once a year, often months behind real-world conditions." },
      ],
    },
    /* Use the AgenticResearchTriad defaults for all three slots. */
    agenticTriad: {},
    dashboard: {
      rows: [
        { title: "Manhattan PE-buyer pattern map · trailing 18 months", body: "In this chat we mapped every CRE transaction over $25M to the ultimate beneficial owner and clustered by asset class.", age: "20 hours ago" },
        { title: "London Grade A office submarket rent forecast", body: "In this chat we ranked the strongest prime-rent submarkets over the next 24 months given vacancy, pipeline, and TfL.", age: "1 day ago" },
        { title: "Milan Porta Nuova €50M mixed-use IM audit", body: "In this chat Columbus challenged the IM with footfall, safety, and tenant-credit reality vs. broker narrative.", age: "2 days ago" },
        { title: "Madrid mixed-use parcel filter — luxury retail + low office vacancy", body: "In this chat we filtered 2,500–4,000 sqm parcels by surrounding retail density and Metro adjacency.", age: "3 days ago" },
        { title: "Sun Belt multifamily acquisition shortlist due diligence", body: "In this chat we ran comparative DD on four targets across East Austin, Nashville, Doral, and Chandler.", age: "4 days ago" },
        { title: "Greater Boston mixed-use site regulatory audit", body: "In this chat we audited five candidate sites against MBTA Communities Act overlays and inclusionary zoning.", age: "5 days ago" },
      ],
    },
  },
  mapChat: {
    breadcrumb: "Manhattan · PE buyer pattern map",
    cityLabel: "Manhattan",
    pois: [
      { top: "28%", left: "55%", label: "Hudson Yards", tone: "accent" },
      { top: "78%", left: "46%", label: "Midtown East", tone: "dark" },
    ],
    filterLabel: "Vacancy data",
    filterHelp: "Filter by Grade A office vacancy rate (%)",
    dataCardTitle: "Prime Rent Growth (24-mo)",
    dataCardMin: "+2.1%",
    dataCardMax: "+11.8%",
    dataCardSecondary: "Cap Rate Compression",
  },
};

const URBAN_COPY: IndustryCopy = {
  chatSubtitle: (
    <>
      With <Blue>conversational map chat</Blue>, ask your chat directly about anything.<br />
      Have a conversation like you&rsquo;re talking to your best analyst.
    </>
  ),
  sub1Description: (
    <>
      Sophisticated <Blue>pattern detection</Blue>.
      Ask chat to uncover hidden patterns across the map &amp; data.
    </>
  ),
  sub2Description: (
    <>
      <p>
        Like weather forecasts, but for urban infrastructure. <Blue>Predict the future</Blue> on Columbus.
      </p>
      <p className="mt-3">Forecast congestion growth, demand on transit and utilities, and the districts most likely to need new capacity.</p>
      <p className="mt-3">Powered by a deep-learning pattern recognition fed by the most up-to-date and high quality data.</p>
    </>
  ),
  sub3Description: (
    <>
      <p>Columbus AI considers a wide breadth of data everytime it critically thinks — climate stress, demographics, budget, land availability, and equity overlays.</p>
      <p className="mt-3">Transparent reasoning. You can tap to see every constraint the AI weighed when siting infrastructure.</p>
    </>
  ),
  sub4Description: (
    <>
      <p>
        Drop in any file — Shapefile, KMZ, CSV, XLSX, PDF, GeoTIFF, GDB — Columbus <Blue>harmonizes</Blue> them and overlays them as unified, coordinate-aligned map layers for GIS visualization.
      </p>
      <p className="mt-3">No schemas to define, no columns to map. Just upload and ask follow-up questions in plain English.</p>
    </>
  ),
  dataCatalogueSubtitle: (
    <>
      Access proprietary data, and the highest quality data from our <Blue>curated data catalogue</Blue>. Data on Columbus is triple-checked.
    </>
  ),
  agenticResearchSubtitle: (
    <>
      Hand Columbus your planning brief and grab a coffee — it&rsquo;ll evaluate candidate parcels, audit infrastructure programs, and deliver professional, review-ready reports while you focus on other work.
    </>
  ),
  cards: {
    patterns: {
      heading: "4 patterns detected",
      area: "Across the 7th arrondissement · trailing 36 months",
      patterns: [
        { n: 1, title: "Tram-Vibration Pothole Corridors", properties: "84 segments", roi: "Repair priority: High" },
        { n: 2, title: "Heavy Axle-Load Bus Routes", properties: "62 segments", roi: "Repair priority: High" },
        { n: 3, title: "North-Facing Freeze-Thaw Streets", properties: "117 segments", roi: "Repair priority: Med" },
        { n: 4, title: "Plane-Tree Root-Heave Hotspots", properties: "49 segments", roi: "Repair priority: Med" },
      ],
    },
    forecast: {
      questionRecap:
        "Here are the districts in greater Munich forecasted to experience the worst traffic-congestion growth over the next 2–3 years",
      panelTitle: "Top 4 Districts by Forecasted Congestion Growth",
      panelSubtitle: "Next 24–36 Months",
      items: [
        { rank: 1, label: "Schwabing-West", delta: "+14.2%" },
        { rank: 2, label: "Bogenhausen", delta: "+12.8%" },
        { rank: 3, label: "Sendling-Westpark", delta: "+11.1%" },
        { rank: 4, label: "Riem", delta: "+9.7%" },
      ],
      takeaway:
        "Congestion growth concentrates on residential pipelines feeding the BMW / Siemens employment ring, with S-Bahn capacity ceilings amplifying spill-over.",
    },
    reasoning: {
      prompt:
        "Where should we locate the next three fire stations to meet our 4-minute response time standard over the next 20 years, given projected growth, climate stress, and budget constraints?",
      items: [
        { label: "Extreme heat day projections", body: "(Phoenix-specific — heat-related EMS calls scale with 110°F+ days)" },
        { label: "Aging population concentrations", body: "driving medical call volume growth" },
        { label: "Existing station age, condition, and replacement schedules", body: "(avoid stranded assets)" },
        { label: "Mutual aid coverage", body: "from neighboring jurisdictions (Tempe, Glendale, Scottsdale)" },
        { label: "Land availability", body: "— vacant parcels, city-owned land, zoning compatibility" },
        { label: "Environmental constraints", body: "(floodplains, protected desert habitat, archaeological zones)" },
        { label: "Equity overlay", body: "— historically underserved neighborhoods with worse current response times" },
        { label: "Bond capacity", body: "and the city's 10-year capital improvement program funding window" },
      ],
    },
    harmonized: {
      files: [
        "cta_ridership_by_stop_2025.parquet",
        "uchicago_jobs_access_study.gdb",
        "ada_bus_stop_audit.kml",
        "cps_school_locations_bell_times.xlsx",
        "paratransit_trip_origins.csv",
        "metra_rail_stations.shp",
      ],
      followUp:
        "now flag every stop in the redesign where ADA access fails AND a CPS school bell falls inside the 30-minute trip-origin band",
    },
  },
  rows: {
    smartLayer: {
      layerName: "Building Structural Safety Score",
      layerSubtitle: "Havana · every building · earthquake & hurricane resilience",
      layerDescription:
        "AI-generated layer scoring every building in Havana on structural safety where local survey data is incomplete.",
      features: [
        { title: "Inferred from satellite + street-level imagery", description: "Façade, roof, and footprint cues evaluated across the full city." },
        { title: "Cross-checked against historical permit + cadastral records", description: "Triple-checked for consistency before every release." },
        { title: "Building-level scoring", description: "Fresh data, continuously monitored as new imagery arrives." },
      ],
      mapAlt: "Havana building structural safety choropleth",
      promptText:
        "I need a data layer of buildings in Havana scored by structural safety, from the perspective of city planning and earthquake/hurricane resilience. Local survey data is incomplete.",
    },
    surveyEarth: {
      reasoningBullets: [
        "Streetlighting density and lumen output per meter",
        "Active ground-floor frontage vs. blank walls or shuttered shops after 9pm",
        "Reported harassment incidents (Mossos d'Esquadra public data)",
        "CCTV coverage gaps",
        "Pedestrian flow density by hour",
        "Distance to nearest 24h establishment",
        "Tree canopy density (obscures sightlines at night)",
      ],
      promptText:
        "Create a smart layer showing 'Streets that feel unsafe to walk at night for women aged 18–35' across the district.",
      mapAlt: "Night-safety choropleth across an urban district",
    },
    betterPrices: {
      columbusTitle: "Full road network with classification, speed limits, and pavement condition",
      columbusPrice: "$2,400 / year",
      columbusMapAlt: "Road-network condition layer preview",
      columbusFeatures: [
        { title: "40,206 rows", description: "Lane counts, speed limits, and pavement condition scores resolved to individual segments." },
        { title: "Verified accuracy", description: "Triple-checked against municipal survey data and field audits." },
        { title: "Updated quarterly", description: "Fresh data, continuously monitored as repairs and reconstructions complete." },
      ],
      competitorTitle: "Public road shapefiles, classification-level only",
      competitorPrice: "$18,000 / year",
      competitorMapAlt: "Competitor road network preview",
      competitorFeatures: [
        { title: "8,200 rows", description: "Classification-only segments pulled from a single municipal open-data portal." },
        { title: "Self-reported data", description: "Provided directly by the municipality, not independently audited or cross-checked." },
        { title: "Updated annually", description: "Refreshed once a year, often months behind real-world repair cycles." },
      ],
    },
    agenticTriad: {
      reports: {
        description: "Hand Columbus your planning brief — it'll evaluate candidate parcels against transit, schools, soil, flood risk, infrastructure capacity, and PRG compliance.",
      },
      audits: {
        description: "Independent due diligence on internal survey findings — verifying severity classifications, coordination opportunities, and timeline feasibility.",
      },
      compliance: {
        description: "Audit planned resurfacing programs against road construction standards, noise reduction targets, EU construction-waste directives, and accessibility provisions.",
      },
    },
    dashboard: {
      rows: [
        { title: "Paris 7th arrondissement pothole pattern analysis", body: "In this chat we mapped pothole formation against tram vibration, freeze-thaw cycles, and tree-root proximity.", age: "20 hours ago" },
        { title: "Greater Munich congestion forecast — next 2–3 years", body: "In this chat we ranked districts by projected congestion growth given pipelines and S-Bahn capacity ceilings.", age: "1 day ago" },
        { title: "Phoenix — next three fire stations under 20-year horizon", body: "In this chat we weighed climate stress, equity, mutual aid, and bond capacity to recommend three station sites.", age: "2 days ago" },
        { title: "Chicago bus-network redesign data harmonization", body: "In this chat Columbus overlaid CTA ridership, ADA stop audits, CPS bell times, and paratransit origins.", age: "3 days ago" },
        { title: "Rome District 3 affordable housing site suitability", body: "In this chat we compared three candidate parcels across transit, soil, flood risk, and PNRR compliance.", age: "4 days ago" },
        { title: "Hammerbrook district asphalt resurfacing compliance audit", body: "In this chat we audited 14.2 km of planned works against ZTV Asphalt-StB and Hamburg Klimaplan thresholds.", age: "5 days ago" },
      ],
    },
  },
  mapChat: {
    breadcrumb: "Munich · congestion-growth forecast",
    cityLabel: "Munich",
    pois: [
      { top: "28%", left: "55%", label: "BMW HQ", tone: "accent" },
      { top: "78%", left: "46%", label: "Hauptbahnhof", tone: "dark" },
    ],
    filterLabel: "Congestion data",
    filterHelp: "Filter by hourly vehicle throughput",
    dataCardTitle: "Daily Vehicle Throughput",
    dataCardMin: "4,200",
    dataCardMax: "62,800",
    dataCardSecondary: "Transit Capacity Headroom",
  },
};

const ENVIRONMENTAL_COPY: IndustryCopy = {
  chatSubtitle: (
    <>
      With <Blue>conversational map chat</Blue>, ask your chat directly about anything. Have a conversation like you&rsquo;re talking to your best Forest Ecologist.
      <div className="mt-3">
        Faster field-team prioritization for Environmental Research customers, including Forest Ecologists, Field Research Coordinators, and Conservation Scientists.
      </div>
    </>
  ),
  sub1Description: (
    <>
      <p>
        Sophisticated <Blue>pattern detection</Blue> — smart layers fill in the map where official surveys are missing, slow, or impossibly expensive at the resolution you need.
      </p>
      <p className="mt-3">Baseline-grade habitat mapping for Marine Ecologists, Conservation Scientists, and Marine Protected Area Planners.</p>
    </>
  ),
  sub2Description: (
    <>
      <p>
        Like weather forecasts, but for ecological events. <Blue>Predict the future</Blue> on Columbus.
      </p>
      <p className="mt-3">Forecast where the next bleaching, fire, outbreak, or mass mortality event is likely to peak.</p>
      <p className="mt-3">Powered by a deep-learning pattern recognition fed by daily-refreshed environmental data.</p>
    </>
  ),
  sub3Description: (
    <>
      <p>Columbus reasons across ecological, climatic, hydrological, and socioeconomic data everytime it answers — separating interventions that look good on paper from ones that actually work on the ground.</p>
      <p className="mt-3">Transparent reasoning. You can tap to see every constraint the AI weighed.</p>
    </>
  ),
  sub4Description: (
    <>
      <p>
        Drop in any file — Shapefile, KML, KMZ, CSV, XLSX, PDF, GeoTIFF, NetCDF — Columbus <Blue>harmonizes</Blue> them and overlays them as unified, coordinate-aligned map layers.
      </p>
      <p className="mt-3">No schemas to define, no columns to map. Just upload and ask follow-up questions in plain English.</p>
    </>
  ),
  dataCatalogueSubtitle: (
    <>
      Pull from our <Blue>curated data catalogue</Blue> of environmental and earth-science data — triple-checked and harmonized across countries and methodologies so layers actually overlay without manual reconciliation.
    </>
  ),
  agenticResearchSubtitle: (
    <>
      Hand Columbus a national-scale planning brief and it produces a professional, review-ready research report — running templates that match the deliverables environmental ministries and oversight bodies actually expect.
    </>
  ),
  cards: {
    patterns: {
      heading: "4 patterns detected",
      area: "Across the North Atlantic · trailing 20 years",
      patterns: [
        { n: 1, title: "Sperm Whale Aggregation Bands", properties: "812 sightings", roi: "Confidence: High" },
        { n: 2, title: "Seasonal Plankton-Bloom Overlap", properties: "367 events", roi: "Confidence: High" },
        { n: 3, title: "Shipping-Lane Avoidance Corridors", properties: "184 transects", roi: "Confidence: Med" },
        { n: 4, title: "SST-Driven Range Shifts (2010→2024)", properties: "9 cohorts", roi: "Confidence: Med" },
      ],
    },
    forecast: {
      questionRecap:
        "Here are the Sierra Nevada foothills 1km grid cells most likely to experience a wildfire ignition exceeding 1,000 acres in the next 12–24 months",
      panelTitle: "Top 4 Grid Cells by Forecasted Ignition Risk",
      panelSubtitle: "Next 12–24 Months",
      items: [
        { rank: 1, label: "Plumas Ridge North", delta: "+38%" },
        { rank: 2, label: "Tahoe Foothills SE", delta: "+31%" },
        { rank: 3, label: "Mariposa Corridor", delta: "+27%" },
        { rank: 4, label: "Sequoia Buffer", delta: "+22%" },
      ],
      takeaway:
        "Ignition risk peaks where bark-beetle mortality patches overlap historic Santa Ana / Diablo wind corridors and the wildland-urban interface.",
    },
    reasoning: {
      prompt:
        "We've got €18M of solar panels to allocate across 200,000 hectares of land in Spain. Where best to place the new large-scale solar farm?",
      items: [
        { label: "Sunlight hours and solar intensity", body: "throughout the year" },
        { label: "Land slope and which direction it faces", body: "(south-facing is best)" },
        { label: "Existing land use", body: "to avoid prime farmland" },
        { label: "Protected nature areas and Natura 2000 sites", body: "" },
        { label: "Proximity to the electrical grid", body: "for connection" },
        { label: "Grid capacity in each area", body: "(some regions are already saturated)" },
        { label: "Bird migration corridors", body: "that could be disrupted" },
        { label: "Water availability for panel cleaning", body: "in this dry region" },
        { label: "Dust and sand-storm frequency", body: "that reduces panel efficiency" },
      ],
    },
    harmonized: {
      files: [
        "shipping_lanes_rijkswaterstaat.shp",
        "dolphin_sightings_2024.csv",
        "seabed_survey_1995.pdf",
        "north_sea_currents.nc",
        "seabird_feeding_zones.kml",
      ],
      followUp:
        "I'm assessing a new offshore wind farm. I've attached different data collected. I'd like to visualize them all on the map",
    },
  },
  rows: {
    smartLayer: {
      layerName: "Forest Dryness Index",
      layerSubtitle: "Central Portugal · forest health · monthly refresh",
      layerDescription:
        "AI-generated layer showing how dry each forest patch is right now, based on satellite vegetation health, recent rainfall, and tree species.",
      features: [
        { title: "Generated from satellite vegetation + water signals", description: "NDVI and NDWI deltas, calibrated against weather-station rainfall totals." },
        { title: "Cross-checked against national forest inventory", description: "Tree-species behavior factored in (eucalyptus dries differently than pine or oak)." },
        { title: "Patch-level scoring", description: "Fresh data, continuously refreshed as new satellite passes complete." },
      ],
      mapAlt: "Central Portugal forest dryness heatmap",
      promptText:
        "Create a map showing how dry the forests are across central Portugal this month, based on satellite images, recent rainfall, and tree types.",
    },
    surveyEarth: {
      reasoningBullets: [
        "Considering historical poaching incident locations over the last 10 years",
        "Considering ranger patrol coverage, frequency, and response times",
        "Considering distance to roads, highways, and vehicle access points",
        "Considering distance to villages and human settlements",
        "Considering recent crop-raiding reports filed by local farmers",
        "Considering permanent and seasonal waterhole locations",
        "Considering river availability during dry-season months",
        "Considering vegetation type and food-plant abundance from satellite imagery",
      ],
      promptText:
        "Create a map scoring every area in and around the Maasai Mara on how safe it is for elephants — consider things like poaching risk, conflict with farmers, water access, and food availability.",
      mapAlt: "Maasai Mara elephant-safety choropleth",
    },
    betterPrices: {
      columbusTitle: "Institutional-grade hydrological + environmental datasets",
      columbusPrice: "€2,400 / year",
      columbusMapAlt: "Hydrological data layer preview",
      columbusFeatures: [
        { title: "55,010 rows", description: "Citizen-science wildlife sightings, high-res satellite imagery, and historical wildfire perimeters with cause + suppression cost." },
        { title: "Verified accuracy", description: "Triple-checked against research-vessel logs, official authorities, and peer-reviewed sources." },
        { title: "Updated quarterly", description: "Fresh data, continuously refreshed as new field and satellite observations arrive." },
      ],
      competitorTitle: "Specialist consultancy engagement",
      competitorPrice: "€20,000+ / year",
      competitorMapAlt: "Consultancy report preview",
      competitorFeatures: [
        { title: "Engagement-based", description: "Delivered through a specialist consultancy engagement, scoped to your specific study area." },
        { title: "Self-reported summaries", description: "Pulled from consultancy field surveys, not independently audited across sources." },
        { title: "Updated on request", description: "Refreshes tied to the engagement cycle, not the underlying data cycle." },
      ],
    },
    agenticTriad: {
      reports: {
        description: "Hand Columbus a national-scale planning brief and it produces a review-ready research report — including which habitat patches remain intact and most important to protect.",
      },
      audits: {
        description: "Full environmental due-diligence on a parcel or operation: soil contamination history, nearby industrial activity, air quality, groundwater pollution, historical chemical storage.",
      },
      compliance: {
        description: "Audit proposed projects against EU wildlife protection rules and national nature laws — flagging issues before approval can be granted.",
      },
    },
    dashboard: {
      rows: [
        { title: "Southern Spain shrinking rivers + nearby farms (10-year)", body: "In this chat we mapped where rivers and lakes have shrunk the most across southern Spain and overlaid the nearest farms.", age: "20 hours ago" },
        { title: "North Atlantic sperm whale sighting patterns (20-year)", body: "In this chat we found patterns in sperm whale sightings against SST shifts, currents, and shipping-lane density.", age: "1 day ago" },
        { title: "Sierra Nevada wildfire ignition risk forecast (1km grid)", body: "In this chat we ranked grid cells by 12–24 month ignition probability above 1,000 acres given fuel moisture, beetle mortality, and wind corridors.", age: "2 days ago" },
        { title: "Spain €18M solar farm siting reasoning", body: "In this chat Columbus weighed sunlight, slope, grid capacity, Natura 2000 sites, and bird migration corridors across 200,000 hectares.", age: "3 days ago" },
        { title: "Borneo orangutan habitat loss + last strongholds (20-year)", body: "In this chat we produced a review-ready report on palm-oil-driven loss and identified intact forest patches to protect.", age: "4 days ago" },
        { title: "Cádiz solar farm extension — EU wildlife compliance audit", body: "In this chat we checked a 180MW expansion against EU rules and SEO/BirdLife migration counts; three areas failed and need design changes.", age: "5 days ago" },
      ],
    },
  },
  mapChat: {
    breadcrumb: "Sierra Nevada · wildfire ignition forecast",
    cityLabel: "Sierra Nevada",
    pois: [
      { top: "28%", left: "55%", label: "Plumas Ridge", tone: "accent" },
      { top: "78%", left: "46%", label: "Tahoe Foothills", tone: "dark" },
    ],
    filterLabel: "Fuel moisture data",
    filterHelp: "Filter by dryness percentile (live fuel moisture)",
    dataCardTitle: "Live Fuel Moisture",
    dataCardMin: "62%",
    dataCardMax: "180%",
    dataCardSecondary: "Bark Beetle Mortality Patches",
  },
};

const ACADEMIC_COPY: IndustryCopy = {
  chatSubtitle: (
    <>
      With <Blue>conversational map chat</Blue>, ask your chat directly about anything. Have a conversation like you&rsquo;re talking to your best Spatial Epidemiologist.
      <div className="mt-3">
        Faster cluster identification for Academic Research customers, including Spatial Epidemiologists, Public Health Researchers, and Population Health Postdocs.
      </div>
    </>
  ),
  sub1Description: (
    <>
      Sophisticated <Blue>pattern detection</Blue> — ask chat to uncover hidden patterns across the map and underlying data, even when the signal only appears at the join of historical archives that have never been combined before.
    </>
  ),
  sub2Description: (
    <>
      <p>
        Like weather forecasts, but for spatial research outcomes. <Blue>Predict the future</Blue> on Columbus.
      </p>
      <p className="mt-3">Forecast demographic shifts, migration patterns, and emerging hotspots.</p>
      <p className="mt-3">Powered by a deep-learning pattern recognition fed by the most up-to-date environmental, economic, and demographic data available.</p>
    </>
  ),
  sub3Description: (
    <>
      <p>Columbus reasons across data architecture, methodology, comparability, and feasibility every time it answers — the kind of structured assessment a senior advisor brings to evaluating a research proposal.</p>
      <p className="mt-3">Transparent reasoning. You can tap to see every consideration the AI weighed.</p>
    </>
  ),
  sub4Description: (
    <>
      <p>
        Drop in any file — Shapefile, KML, KMZ, CSV, XLSX, PDF, GeoTIFF, photo folders — Columbus <Blue>harmonizes</Blue> them and overlays them as unified, coordinate-aligned map layers.
      </p>
      <p className="mt-3">No schemas to define, no columns to map. Just upload and ask follow-up questions in plain English.</p>
    </>
  ),
  dataCatalogueSubtitle: (
    <>
      Pull from our <Blue>curated data catalogue</Blue> of comparative urban, demographic, and administrative data — triple-checked and harmonised across cities and countries so layers actually overlay without manual reconciliation.
    </>
  ),
  agenticResearchSubtitle: (
    <>
      Hand Columbus a grant-application brief and it produces a professional, review-ready spatial evidence base — running templates that match the deliverables funder review committees actually expect.
    </>
  ),
  cards: {
    patterns: {
      heading: "4 patterns detected",
      area: "Across Tokyo's 23 special wards",
      patterns: [
        { n: 1, title: "Vending Density Near Konbini Gaps", properties: "1,204 machines", roi: "Signal: Strong" },
        { n: 2, title: "Setback-Alcove Clustering", properties: "812 sites", roi: "Signal: Strong" },
        { n: 3, title: "Daytime Commuter-Pop Corridors", properties: "146 corridors", roi: "Signal: Med" },
        { n: 4, title: "Fragmented Land-Ownership Pockets", properties: "523 parcels", roi: "Signal: Med" },
      ],
    },
    forecast: {
      questionRecap:
        "Here are the Greater London boroughs forecasted to see the largest increases in young-professional populations (ages 25–34) over the next 2–3 years",
      panelTitle: "Top 4 Boroughs by Forecasted 25–34 Growth",
      panelSubtitle: "Next 24–36 Months",
      items: [
        { rank: 1, label: "Hackney", delta: "+8.6%" },
        { rank: 2, label: "Walthamstow", delta: "+7.4%" },
        { rank: 3, label: "Lewisham", delta: "+6.8%" },
        { rank: 4, label: "Peckham", delta: "+5.9%" },
      ],
      takeaway:
        "Crossrail-adjacent boroughs lead, with tech-cluster spillover and lifestyle-amenity density tracking the strongest cohort growth.",
    },
    reasoning: {
      prompt: "Compare gentrification in Chicago, Atlanta, and Detroit.",
      items: [
        { label: "Median household income changes by census tract", body: "over the past 10–20 years" },
        { label: "Racial and ethnic demographic shifts", body: "at the tract level (American Community Survey data)" },
        { label: "Median home value and rent trajectories", body: "per neighborhood" },
        { label: "Property tax assessment increases", body: "and reassessment patterns" },
        { label: "Educational attainment shifts", body: "(% of residents with bachelor's degrees over time)" },
        { label: "Displacement indicators", body: "— eviction filings, mortgage foreclosure rates, length-of-tenure data" },
        { label: "Business turnover patterns", body: "(independent vs. chain, restaurant categories, retail mix)" },
        { label: "Building permit activity", body: "for renovations vs. new construction" },
      ],
    },
    harmonized: {
      files: [
        "groceryStorePrices.xlsx",
        "hospitalLocations.xlsx",
        "informalTransitRoutes.kml",
        "newsArticle.pdf",
        "researchPaperOpinions.pdf",
      ],
      followUp:
        "Help me compare these two cities for my urban studies paper. I've attached some files to organize on the map",
    },
  },
  rows: {
    smartLayer: {
      layerName: "Northern Ontario Grocery Basket Index",
      layerSubtitle: "Indigenous communities · populations under 5,000",
      layerDescription:
        "AI-generated layer scoring the average price of a basic grocery basket (milk, bread, eggs, vegetables, ground beef) at every store across remote Northern Ontario communities.",
      features: [
        { title: "Inferred from regional pricing patterns + subsidy data", description: "Northern Store / North West Company pricing and Nutrition North Canada subsidy program coverage." },
        { title: "Cross-checked against StatsCan Northern Food Basket surveys", description: "Triple-checked for completeness and consistency before every release." },
        { title: "Community-level scoring", description: "Fresh data, continuously refreshed against access mode (fly-in vs. winter road)." },
      ],
      mapAlt: "Northern Ontario grocery basket pricing layer",
      promptText:
        "For my Urban Studies class, generate a smart layer showing the average price of a basic grocery basket (milk, bread, eggs, vegetables, ground beef) at stores across Indigenous communities in Northern Ontario. Include only communities with populations under 5,000.",
    },
    surveyEarth: {
      reasoningBullets: [
        "Active job postings on Spanish job boards (InfoJobs, LinkedIn, Indeed Spain)",
        "Required experience levels filtered to 0–2 years",
        "Industry distribution per city",
        "Average graduate starting salaries by region",
        "1-bedroom rental prices per neighborhood",
        "Cost of groceries and transit",
        "Density of universities and cultural institutions",
        "Recent population growth among 22–30 year olds",
      ],
      promptText:
        "Create a layer showing 'entry-level job availability for humanities graduates' across Spain's 20 largest cities, consider cost of living and average rent for a 1-bedroom apartment.",
      mapAlt: "Spain entry-level job availability layer",
    },
    betterPrices: {
      columbusTitle: "Historical EU land-use change · longitudinal panel",
      columbusPrice: "€500 / year",
      columbusMapAlt: "EU land-use change data preview",
      columbusFeatures: [
        { title: "55,010 rows", description: "Consistent longitudinal data across countries — census, demographic, GDP, unemployment, land-use change." },
        { title: "Verified accuracy", description: "Triple-checked against EU statistical offices and peer-reviewed sources." },
        { title: "Updated annually", description: "Fresh data, refreshed against the EU statistical release cycle." },
      ],
      competitorTitle: "Subscription access only top-tier universities can afford",
      competitorPrice: "€2,000+ / year",
      competitorMapAlt: "Subscription dataset preview",
      competitorFeatures: [
        { title: "Institutional subscription", description: "Locked behind enterprise subscriptions sized for top-tier universities." },
        { title: "Self-reported attribution", description: "Provided directly by the data vendor, with limited methodology transparency." },
        { title: "Updated annually", description: "Refreshed once a year, methodology shifts can break longitudinal comparability." },
      ],
    },
    agenticTriad: {
      reports: {
        description: "Hand Columbus a grant brief and it produces a review-ready spatial evidence base — running templates that match the deliverables funder review committees actually expect.",
      },
      audits: {
        description: "Generative due-diligence reports on a project, parcel, or policy proposal — defensibility, equity implications, comparable outcomes.",
      },
      compliance: {
        description: "Audit active research projects against ethical, data protection, research security, and funder mandate stacks — across the institution.",
      },
    },
    dashboard: {
      rows: [
        { title: "Amsterdam neighborhood rent vs. independent business loss (5-year)", body: "In this chat we overlaid rent increases with shifts in independent vs. chain businesses across Amsterdam buurts.", age: "20 hours ago" },
        { title: "Tokyo vending machine + map-feature pattern detection", body: "In this chat we found hidden patterns linking vending machine density to population, transit, and building types across the 23 wards.", age: "1 day ago" },
        { title: "Greater London 25–34 cohort forecast — next 2–3 years", body: "In this chat we ranked boroughs by projected young-professional growth given Crossrail and tech-cluster spillover.", age: "2 days ago" },
        { title: "Chicago / Atlanta / Detroit gentrification reasoning", body: "In this chat Columbus weighed tract-level income, tenure, displacement indicators, and HOPE VI / land bank timelines.", age: "3 days ago" },
        { title: "Shimokitazawa vs. Kōenji comparative neighborhood study", body: "In this chat we produced a citation-ready academic report comparing two Tokyo youth-culture districts.", age: "4 days ago" },
        { title: "Vienna 10th district student housing compliance audit", body: "In this chat we audited a 6-story mixed-use proposal against Bauordnung für Wien and UVP-G 2000.", age: "5 days ago" },
      ],
    },
  },
  mapChat: {
    breadcrumb: "Tokyo · neighborhood comparison study",
    cityLabel: "Tokyo",
    pois: [
      { top: "28%", left: "55%", label: "Shimokitazawa", tone: "accent" },
      { top: "78%", left: "46%", label: "Kōenji", tone: "dark" },
    ],
    filterLabel: "Demographic data",
    filterHelp: "Filter by age cohort and household composition",
    dataCardTitle: "Median Household Income",
    dataCardMin: "¥3.2M",
    dataCardMax: "¥14.8M",
    dataCardSecondary: "Daytime / Resident Population Ratio",
  },
};

const GEOMARKETING_COPY: IndustryCopy = {
  chatSubtitle: (
    <>
      With <Blue>conversational map chat</Blue>, ask your chat directly about anything. Have a conversation like you&rsquo;re talking to your best Site Selection Analyst.
      <div className="mt-3">
        Faster trade-area shortlisting for Geomarketing customers, including Site Selection Directors, Network Strategy VPs, and Franchise Development Leads.
      </div>
    </>
  ),
  sub1Description: (
    <>
      Sophisticated <Blue>pattern detection</Blue> — ask chat to uncover hidden patterns across the map and underlying data, even when the signal only appears at the join of branch performance, demographic shift, and competitor activity.
    </>
  ),
  sub2Description: (
    <>
      <p>
        Like weather forecasts, but for your target customer. <Blue>Predict the future</Blue> on Columbus.
      </p>
      <p className="mt-3">Forecast where your specific buyer is growing fastest, and where to weight expansion next.</p>
      <p className="mt-3">Powered by a deep-learning pattern recognition fed by demographic, mobility, real-estate, and competitive data.</p>
    </>
  ),
  sub3Description: (
    <>
      <p>Columbus reasons across submarket trajectory, competitive pipeline, demographic shift, and the brand&rsquo;s own performance data every time it answers — so a 10-year lease decision gets the analysis it deserves.</p>
      <p className="mt-3">Transparent reasoning. You can tap to see every signal the AI weighed.</p>
    </>
  ),
  sub4Description: (
    <>
      <p>
        Drop in any file — Shapefile, KML, KMZ, CSV, XLSX, PDF, GeoTIFF — Columbus <Blue>harmonizes</Blue> them and overlays them as unified, geocoded map layers across multiple brand systems.
      </p>
      <p className="mt-3">No schemas to define, no columns to map. Just upload and ask follow-up questions in plain English.</p>
    </>
  ),
  dataCatalogueSubtitle: (
    <>
      Pull from our <Blue>curated data catalogue</Blue> of audience, mobility, segmentation, and media-inventory data — triple-checked and harmonized to a single trade-area spine so layers actually overlay without manual reconciliation.
    </>
  ),
  agenticResearchSubtitle: (
    <>
      Hand Columbus a network-strategy brief and it produces a professional, review-ready report — running templates that match the deliverables retail boards and executive committees actually expect.
    </>
  ),
  cards: {
    patterns: {
      heading: "4 patterns detected",
      area: "Across 580 Canadian branches · trailing 6 years",
      patterns: [
        { n: 1, title: "Spend Wasted in Saturated Trade Areas", properties: "112 branches", roi: "Reallocate: High" },
        { n: 2, title: "High-Lift Underserved Corridors", properties: "87 branches", roi: "Reallocate: High" },
        { n: 3, title: "Demographic-Shift Misalignment", properties: "94 branches", roi: "Reallocate: Med" },
        { n: 4, title: "Digital-Adoption Erosion", properties: "146 branches", roi: "Reallocate: Med" },
      ],
    },
    forecast: {
      questionRecap:
        "Here are the European cities and submarkets forecasted to see the fastest growth in our target customer over the next 24 months",
      panelTitle: "Top 4 Submarkets by Forecasted Target-Customer Growth",
      panelSubtitle: "Next 24 Months",
      items: [
        { rank: 1, label: "Milan — Porta Romana", delta: "+12.1%" },
        { rank: 2, label: "Madrid — Chamberí", delta: "+10.7%" },
        { rank: 3, label: "Berlin — Neukölln", delta: "+9.3%" },
        { rank: 4, label: "Lisbon — Marvila", delta: "+8.5%" },
      ],
      takeaway:
        "Italian, Spanish, and Latin-American diaspora concentration is the strongest forward signal — Porta Romana leads on disposable-income trajectory.",
    },
    reasoning: {
      prompt:
        "Show which metros we should shift spending toward and which ones to pull back on, based on where our target audience is actually concentrating versus where we're paying for reach we're not converting.",
      items: [
        { label: "The brand's existing member retention", body: "in similar submarkets" },
        { label: "Trade-area demographic composition", body: "vs. the brand's high-LTV member profile" },
        { label: "Competing fitness-operator pipeline", body: "within a 3-mile drive" },
        { label: "Anonymized mobility data", body: "showing actual fitness-category visits" },
        { label: "Alternative space availability", body: "and rent trajectory in the submarket" },
        { label: "Build-out cost estimates", body: "with regional cost variation" },
        { label: "The broker's track record", body: "on “better space coming” claims" },
      ],
    },
    harmonized: {
      files: [
        "toyota_dealer_areas.kmz",
        "gm_pma_definitions.shp",
        "customer_transactions_5yr.csv",
        "honda_dealer_territory_2023.pdf",
        "dealership_financials_reynolds.xlsx",
        "original_2014_trade_area_study.kml",
      ],
      followUp:
        "All seven sources reconciled, geocoded, and aligned across all 12 brands and 38 dealerships into a unified Greater Toronto market view",
    },
  },
  rows: {
    smartLayer: {
      layerName: "Real EV-Audience Panel Quality Score",
      layerSubtitle: "Every OOH panel in France · calibrated against ground truth",
      layerDescription:
        "AI-generated layer scoring every OOH advertising panel in France on real audience quality for an EV target buyer — audience volume, audience match, viewability, dwell time.",
      features: [
        { title: "Inferred from anonymized mobility data", description: "Actual dwell time near each panel, calibrated against panel-owner audience claims." },
        { title: "Cross-checked against INSEE + SIV registries", description: "Demographic data at IRIS resolution per catchment, plus EV buyer location patterns." },
        { title: "Panel-level scoring", description: "Fresh data, continuously refreshed against new mobility traces." },
      ],
      mapAlt: "France OOH panel audience quality choropleth",
      promptText:
        "Score every OOH advertising panel in France on real audience quality for an electric vehicle target buyer. Show the breakdown across audience volume, audience match, viewability, and dwell time.",
    },
    surveyEarth: {
      reasoningBullets: [
        "Considering PLZ-5 demographic composition from the 2022 census",
        "Considering anonymized retail loyalty card data from dm and Edeka",
        "Considering specialty coffee shop and craft beer retail density",
        "Considering classic soda consumption decline trajectory from Nielsen scan data",
        "Considering anonymized mobility data showing time at premium-positioning retail",
        "Considering gym, fitness studio, and wellness retail density as a proxy",
        "Considering Google Trends and online consumer interest signals",
      ],
      promptText:
        "Score every German postal code on density of: urban professionals 28–48, with household income €55K+, who consume premium beverage categories like specialty coffee and craft beer, but have measurably reduced classic soft drink consumption.",
      mapAlt: "Germany PLZ-5 premium-beverage audience density",
    },
    betterPrices: {
      columbusTitle: "UK consumer segmentation at postcode resolution",
      columbusPrice: "£2,400 / year",
      columbusMapAlt: "UK postcode segmentation preview",
      columbusFeatures: [
        { title: "40,206 rows", description: "6 categories, 18 groups, 62 lifestyle-income types, aligned with Acorn — postcode-level granularity." },
        { title: "Verified accuracy", description: "Triple-checked against census data and panel surveys." },
        { title: "Updated quarterly", description: "Fresh data, continuously refreshed against new audience signals." },
      ],
      competitorTitle: "CACI direct + planning consultancy engagement",
      competitorPrice: "£25,000–£80,000 / year",
      competitorMapAlt: "CACI segmentation preview",
      competitorFeatures: [
        { title: "Engagement-based", description: "Direct CACI license plus a planning consultancy engagement scoped to your specific catchments." },
        { title: "Self-reported attribution", description: "Provided through the vendor, with limited transparency on the underlying mobility signals." },
        { title: "Updated annually", description: "Refreshes tied to the engagement cycle, not the audience-signal cycle." },
      ],
    },
    agenticTriad: {
      reports: {
        description: "Hand Columbus a network-strategy brief — it'll deliver a national catchment report showing where your core shopper lives and where to weight Q2 media spend.",
      },
      audits: {
        description: "Pre-launch audits of OOH campaigns: per-panel audience reach, competitor share-of-voice, restricted-category overlaps, and risks before you go live.",
      },
      compliance: {
        description: "Audit retail networks and OOH campaigns against municipal regulations — alcohol licensing, tobacco display, signage, language requirements, store by store.",
      },
    },
    dashboard: {
      rows: [
        { title: "580 Canadian branches — 6-year campaign performance heatmap", body: "In this chat we mapped campaign performance to each branch's trade-area boundary, flagging waste and high-lift corridors.", age: "20 hours ago" },
        { title: "European target-customer growth forecast — next 24 months", body: "In this chat we ranked submarkets across Milan, Madrid, Berlin, and Lisbon by projected target-buyer concentration.", age: "1 day ago" },
        { title: "Metro spend reallocation reasoning — pull back vs. shift toward", body: "In this chat Columbus weighed member retention, fitness-category mobility, competitor pipeline, and broker claims.", age: "2 days ago" },
        { title: "Greater Toronto multi-brand portfolio harmonization", body: "In this chat we reconciled 7 sources across 12 brands and 38 dealerships into a unified GTA market view.", age: "3 days ago" },
        { title: "Spanish supermarket — national catchment & media weight plan", body: "In this chat we produced a Madrid-Sur vs. Vallès Occidental trade-area report with Q2 2026 media weight recommendations.", age: "4 days ago" },
        { title: "Benelux 2026 OOH campaign compliance audit (4,800 panels)", body: "In this chat we audited Dutch + Belgian panels against alcohol exclusion zones, tobacco directives, and linguistic regulations.", age: "5 days ago" },
      ],
    },
  },
  mapChat: {
    breadcrumb: "Lisbon · Q2 OOH campaign network",
    cityLabel: "Lisbon",
    pois: [
      { top: "28%", left: "55%", label: "Baixa-Chiado", tone: "accent" },
      { top: "78%", left: "46%", label: "Avenidas Novas", tone: "dark" },
    ],
    filterLabel: "Audience data",
    filterHelp: "Filter by daypart impressions and dwell time",
    dataCardTitle: "Daily Impressions",
    dataCardMin: "1,840",
    dataCardMax: "112,400",
    dataCardSecondary: "Target-Buyer Match %",
  },
};

function copyFor(industryId: IndustryId): IndustryCopy {
  switch (industryId) {
    case "residential-real-estate":
      return RESIDENTIAL_COPY;
    case "commercial-real-estate":
      return COMMERCIAL_COPY;
    case "urban-infrastructure":
      return URBAN_COPY;
    case "environmental-research":
      return ENVIRONMENTAL_COPY;
    case "academic-research":
      return ACADEMIC_COPY;
    case "geomarketing":
      return GEOMARKETING_COPY;
    default:
      // Fall back to residential copy for industries without a PDF.
      return RESIDENTIAL_COPY;
  }
}

/* Industry-aware use-case stack. Titles + sub-feature card visuals stay
   identical across industries; per-industry custom copy lives in the
   IndustryCopy blocks above, and backdrop images swap via backdropsFor.
   The chat sub-feature card components themselves still hold residential
   sample text inside — making those industry-aware is a follow-up. */
export default function BusinessUseCases() {
  const { industryId } = useIndustry();
  const bg = backdropsFor(industryId);
  const copy = copyFor(industryId);

  return (
    <>
      <SuperFeatureSection
        id="chat"
        icon={
          <IconChip>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </IconChip>
        }
        title="Ask, Discover, Understand"
        subtitle={copy.chatSubtitle}
        backgroundImage={bg.chatHero}
        backgroundPosition={bg.chatHeroPosition}
        subFeatureBackdrop={bg.chatSub[0]}
        demoVisual={<MapChatPlatform {...copy.mapChat} />}
        subFeatures={[
          {
            title: "See what others cant",
            description: copy.sub1Description,
            backdropImage: bg.chatSub[0],
            backdropPosition: bg.chatSubPositions?.[0],
            visual: (
              <MapLayeredVisual map="/MapChatbackgroundimg.png" alt="Map chat background" variant="floating">
                <PatternsDetectedCard {...copy.cards.patterns} />
              </MapLayeredVisual>
            ),
          },
          {
            title: "Like weather forcasts for real-estate",
            description: copy.sub2Description,
            backdropImage: bg.chatSub[1],
            backdropPosition: bg.chatSubPositions?.[1],
            visual: (
              <MapLayeredVisual map="/MapChatbackgroundimg.png" alt="Map chat background" variant="floating">
                <ForecastCard {...copy.cards.forecast} />
              </MapLayeredVisual>
            ),
          },
          {
            title: "AI that critically thinks",
            description: copy.sub3Description,
            backdropImage: bg.chatSub[2],
            backdropPosition: bg.chatSubPositions?.[2],
            visual: <ColumbusReasoningCard {...copy.cards.reasoning} />,
          },
          {
            title: "Drop Any File, Columbus does the rest",
            description: copy.sub4Description,
            backdropImage: bg.chatSub[3],
            backdropPosition: bg.chatSubPositions?.[3],
            visual: (
              <MapLayeredVisual map="/MapChatbackgroundimg.png" alt="Map chat background">
                <HarmonizedFilesCard {...copy.cards.harmonized} />
              </MapLayeredVisual>
            ),
          },
        ]}
      />
      <SuperFeatureSection
        id="data-catalogue"
        icon={
          <IconChip>
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
            <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
          </IconChip>
        }
        title="Trusted data, verified for confidence"
        subtitle={copy.dataCatalogueSubtitle}
        /* Pure blue-sky backdrop, no photo. SkyBackdrop accepts a raw CSS
           gradient (detected via the `gradient(` substring) and skips the
           scrim, so the frame renders as clean sky-blue with nothing else
           in it. */
        backgroundImage="linear-gradient(180deg, #5DADE2 0%, #AED6F1 100%)"
        subFeatureBackdrop={bg.dataCatalogueHero}
        demoImage="/dataCataSm.png"
        demoAlt="Columbus data manager"
        subFeatures={[
          { title: "With smart layers, you become an artist", description: null, visual: <SmartLayerRow {...copy.rows.smartLayer} />, stacked: true },
          { id: "super-model", title: "Survey the earth with a super model", description: null, visual: <SurveyEarthRow {...copy.rows.surveyEarth} />, stacked: true },
          { title: "Better Data, Better Prices", description: null, visual: <BetterPricesRow {...copy.rows.betterPrices} />, stacked: true },
        ]}
      />
      <SuperFeatureSection
        id="agentic-research"
        icon={
          <IconChip>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="m11 13 4 4" />
            <path d="M15 11h3v3" />
          </IconChip>
        }
        title="Agentic Research"
        subtitle={copy.agenticResearchSubtitle}
        /* Backdrop shifted down: this slot now uses the photo that
           previously sat behind the data-catalogue section. */
        backgroundImage={bg.dataCatalogueHero}
        subFeatureBackdrop={bg.agenticResearchHero}
        demoVisual={<MapChatPlatform {...copy.mapChat} />}
        subFeatures={[
          { id: "due-diligence", title: "Agentic research sub-features", description: null, visual: <AgenticResearchTriad {...copy.rows.agenticTriad} />, stacked: true },
        ]}
      />
      <SuperFeatureSection
        id="dashboard"
        icon={
          <IconChip>
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </IconChip>
        }
        title="Dashboard"
        subtitle={<>All your work organized and easy to access.</>}
        /* Backdrop shifted down: this slot now uses the photo that
           previously sat behind the agentic-research section. The
           original `bg.dashboardHero` is unused but kept in the data
           shape in case the chain is unwound. */
        backgroundImage={bg.agenticResearchHero}
        demoVisual={<DashboardListMockup {...copy.rows.dashboard} />}
        panel={false}
      />
    </>
  );
}
