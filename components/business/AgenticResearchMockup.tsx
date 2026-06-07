"use client";

import Image from "next/image";
import type { IndustryId } from "@/components/use-cases/industry/types";
import { useMediaWarm } from "@/components/ui/MediaPrefetcher";
import researchFrame from "@/public/business/ResearchFrame.png";

/* Mock UI: the "Agentic Research" demo. Uses the ResearchFrame chrome
   (5190×2993) and paints the inner pane with the canonical Columbus
   chat-and-report split. The chrome has a soft drop-shadow at its
   inner edge — content starts INSIDE the shadow zone so the white
   inner pane sits flush against the chrome's solid white area (no
   visible "gap" from the shadow gradient):
     • left rail solid right-edge:  x=224  →  4.32%
     • top bar  solid bottom-edge:  y=210  →  7.02%

   The chrome's top bar carries a "Columbus / Kansans Project 435
   Greenfield / Cater County Sector 3" breadcrumb baked into the PNG.
   We cover the project-specific portion (x=900 → x=3160 of the
   original = 17.34% → 60.89%) with a flush-white div and render an
   industry-specific breadcrumb in its place — keeping the Columbus
   logo + wordmark + first "/" separator visible from the source.

   Inner pane layout:
     • Left column (~40%): the chat — user prompt → "Columbus
       forecasted your question" header → recap → ranked submarket
       panel → key takeaway → "View Full Report" CTA → bottom "Ask
       Columbus" input. Mirrors the standalone ForecastCard structure.
     • Right column (~60%): the research document — title, metadata
       strip, intro paragraph, map visualization, and a "Columbus
       Agent" AI-suggestion banner with an "Implement change"
       affordance. Designed to read as editable-by-AI-or-by-hand.

   Panel surfaces use the established #F4F4F5 gray (same as
   ForecastCard / HarmonizedFilesCard); typography uses Axiforma and
   navy text — no cream. Content per industry is lifted from the
   user's source PDFs (residential mirrors the Amsterdam reference
   screenshot verbatim). */

const FONT_STACK =
  "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif";

/* Site-wide panel + accent tokens. Used here directly rather than via
   CSS variables so the component renders correctly in isolation
   (Storybook / docs / etc.) without a wrapping .ent-scope. */
const PANEL_BG = "#F4F4F5";
const BORDER = "#E4E4E7";
const TEXT_NAVY = "#0F173C";
const TEXT_MUTED = "#6B7280";
const BADGE_BG = "#0F173C";
const DELTA_BLUE = "#154ACC";

type RankedItem = { rank: number; label: string; delta: string };

type Collaborator = {
  /* Two-letter initials shown inside the avatar circle. */
  initials: string;
  /* Linear-gradient stops for the avatar fill. Picked so each industry's
     team reads as a distinct pair when the avatars overlap. */
  from: string;
  to: string;
};

type IndustryContent = {
  /* Top-bar breadcrumb override — replaces the "Kansans Project 435
     Greenfield / Cater County Sector 3" text baked into the chrome
     PNG. Two segments joined by a " / " separator. */
  breadcrumb: [string, string];
  /* Shared-with collaborator avatars rendered to the right of the
     top bar — replaces the static "Shared with [UC Trade Joe's]
     [Giant]" overlap baked into the chrome PNG. Two or three entries
     read best at the rendered scale; the renderer overlaps them by
     ~30% per the reference. */
  sharedWith: Collaborator[];
  /* Chat side */
  prompt: string;
  recap: string;
  panelTitle: string;
  panelSubtitle: string;
  items: RankedItem[];
  takeaway: string;
  /* Research-document side */
  reportTitle: string;
  reportMeta: string;
  reportBody: string;
  mapLabel: string;
  /* CSS gradient stand-in for the research map visualization. Same
     palette idea as DataManagerMockup's MAPS — picked per industry so
     each research view reads distinctly. */
  mapBackground: string;
  /* AI suggestion shown at the bottom of the research panel. */
  aiSuggestion: string;
};

const CONTENT: Partial<Record<IndustryId, IndustryContent>> = {
  "residential-real-estate": {
    breadcrumb: ["Mechlen County Property", "600,000 sqft Residential"],
    sharedWith: [
      { initials: "NH", from: "#3A6FB3", to: "#1F4A85" },
      { initials: "DR", from: "#C75A32", to: "#8A2E18" },
    ],

    prompt:
      "Show me which neighborhoods in Amsterdam have seen the largest rent increases over the past 5 years",
    recap:
      "Here are the Amsterdam neighborhoods with the steepest free-sector rent growth over the past five years",
    panelTitle: "Top 4 Neighborhoods by Free-Sector Rent Growth",
    panelSubtitle: "Last 5 Years",
    items: [
      { rank: 1, label: "De Pijp-Noord", delta: "+28.4%" },
      { rank: 2, label: "Oud-West", delta: "+24.1%" },
      { rank: 3, label: "Indische Buurt", delta: "+21.6%" },
      { rank: 4, label: "Oostelijke Eilanden", delta: "+19.3%" },
    ],
    takeaway:
      "Rent growth concentrates in tram-served neighborhoods with tight new-build pipelines; independent business turnover lags the price rise by 18–24 months.",
    reportTitle:
      "Amsterdam Neighborhoods Rent Growth: Tram-Served Pipeline Convergence",
    reportMeta: "Site Suitability Report · Residential · Jan 2026",
    reportBody:
      "Free-sector rent growth across Amsterdam's central neighborhoods has concentrated in tram-served corridors over the past five years, with De Pijp-Noord, Oud-West, Indische Buurt, and Oostelijke Eilanden each posting double-digit cumulative gains. The pattern aligns with tight new-build pipelines along the 24- and 25-tram lines, where municipal woningbouw permits have lagged demand by 18–24 months.",
    mapLabel: "Amsterdam · Free-Sector Rent Δ (5y)",
    mapBackground:
      "radial-gradient(circle at 52% 60%, #b32a1c 0%, #d35a30 18%, #e88a3a 38%, #f4b465 58%, #fce0a7 80%, #f8efdb 100%)",
    aiSuggestion:
      "Consider adding a vacancy-rate overlay to confirm pipeline tightness across the four leading neighborhoods.",
  },
  "commercial-real-estate": {
    breadcrumb: ["French Flagship Rollout", "36-Month Sequence"],
    sharedWith: [
      { initials: "LV", from: "#C8A24A", to: "#8A6E28" },
      { initials: "PR", from: "#3A3A3F", to: "#15151A" },
    ],

    prompt:
      "Build me a market-entry report for our French flagship store rollout. Rank the top candidate cities — exclude anywhere within 50km of our Paris flagship.",
    recap:
      "Here are the French metros best positioned to host a flagship-format store over a 36-month rollout horizon",
    panelTitle: "Top 4 French Cities by Flagship Suitability",
    panelSubtitle: "36-Month Rollout · Q2 2026",
    items: [
      { rank: 1, label: "Lyon — Presqu'île", delta: "+91" },
      { rank: 2, label: "Bordeaux — Sainte-Catherine", delta: "+87" },
      { rank: 3, label: "Marseille — Vieux-Port", delta: "+82" },
      { rank: 4, label: "Lille — Rue Faidherbe", delta: "+78" },
    ],
    takeaway:
      "Lyon's Presqu'île and Bordeaux's Sainte-Catherine corridor lead a shortlist of 47 evaluated metros — strongest catchment power and tourism-driven footfall outside the Paris ring.",
    reportTitle:
      "French Flagship Rollout: 36-Month Sequence Strategy",
    reportMeta: "Retail Market-Entry Report · Commercial · Q2 2026",
    reportBody:
      "Lyon's Presqu'île and Bordeaux's Rue Sainte-Catherine corridor lead a shortlist of 47 evaluated French metros for flagship-format expansion. The recommended 36-month sequence prioritizes catchment purchasing power and tourism-driven footfall outside the Paris ring, with secondary anchors in Marseille's Vieux-Port and Lille's Rue Faidherbe — both showing forward demographic momentum and a thin competitor flagship density.",
    mapLabel: "France · Flagship Suitability Score",
    mapBackground:
      "radial-gradient(ellipse 65% 55% at 35% 50%, #4a76c8 0%, #6892d4 30%, #a3c1e8 55%, #d6e6f4 85%, #eef4fa 100%)",
    aiSuggestion:
      "Add tourism-seasonality data to refine the recommended opening sequence across the top four cities.",
  },
  "academic-research": {
    breadcrumb: ["Tokyo Capstone Study", "Shimokitazawa × Kōenji"],
    sharedWith: [
      { initials: "TU", from: "#A82424", to: "#6B1414" },
      { initials: "SG", from: "#5E8ACC", to: "#2A4D72" },
    ],

    prompt:
      "Compare Shimokitazawa (Setagaya) and Kōenji (Suginami) in Tokyo. Format as a review-ready academic report for my capstone.",
    recap:
      "Here are the Tokyo youth-culture districts ranked on the comparative indicators relevant to your capstone framework",
    panelTitle: "Top 4 Tokyo Districts by Youth-Culture Density",
    panelSubtitle: "Comparative Study · 2024–2026",
    items: [
      { rank: 1, label: "Shimokitazawa — Setagaya", delta: "+94" },
      { rank: 2, label: "Kōenji — Suginami", delta: "+89" },
      { rank: 3, label: "Shin-Ōkubo — Shinjuku", delta: "+82" },
      { rank: 4, label: "Daikanyama — Shibuya", delta: "+77" },
    ],
    takeaway:
      "Shimokitazawa and Kōenji emerge as the strongest comparative cases — independent music venues and vintage retail densities still grow despite Odakyū line-undergrounding pressure.",
    reportTitle:
      "Tokyo Youth-Culture Districts: A Comparative Indicator Study",
    reportMeta: "Capstone Reference · Academic · Review-Ready",
    reportBody:
      "This comparative study evaluates two culturally significant Tokyo neighborhoods — Shimokitazawa (Setagaya Ward, Odakyū / Keiō Inokashira lines) and Kōenji (Suginami Ward, JR Chūō line). Both districts are widely recognized as centers of independent music, vintage retail, small-scale theater, and youth subculture, and both have undergone notable transformation over the past decade.",
    mapLabel: "Tokyo Wards · Youth-Culture Density",
    mapBackground:
      "conic-gradient(from 140deg at 50% 50%, #5e8acc 0%, #88aedb 18%, #c9d8e8 38%, #f5d390 62%, #f0a850 82%, #5e8acc 100%)",
    aiSuggestion:
      "Strengthen the Shimokitazawa section with citation of the Odakyū-line undergrounding project's measured effect.",
  },
  "environmental-research": {
    breadcrumb: ["Borneo Protection Priority", "2003–2023 Forest Loss"],
    sharedWith: [
      { initials: "WW", from: "#2D5A2A", to: "#143B14" },
      { initials: "RA", from: "#5CAE5A", to: "#2E7D32" },
    ],

    prompt:
      "Identify Borneo forest areas lost to palm oil, logging, and fires over the past 20 years. Which patches remain intact and most important to protect?",
    recap:
      "Here are the Borneo strongholds with the highest intact-forest integrity and the most urgent protection priority",
    panelTitle: "Top 4 Borneo Strongholds Worth Protecting",
    panelSubtitle: "2003–2023 Forest-Loss Analysis",
    items: [
      { rank: 1, label: "Sebangau — Central Kalimantan", delta: "+91" },
      { rank: 2, label: "Kutai — East Kalimantan", delta: "+85" },
      { rank: 3, label: "Sabangau Buffer", delta: "+78" },
      { rank: 4, label: "Tabin Wildlife Reserve", delta: "+72" },
    ],
    takeaway:
      "Six million hectares lost in two decades — Sebangau and Kutai retain the highest-integrity orangutan habitat and warrant immediate corridor protection.",
    reportTitle:
      "Borneo Orangutan Habitat: Strongholds Worth Saving 2003–2023",
    reportMeta: "Protection Priority Report · Environmental",
    reportBody:
      "Borneo's tropical forests have shrunk faster than nearly any other habitat on Earth. Between 2003 and 2023 the island lost more than 6 million hectares, much of it prime orangutan territory. This report combines two decades of satellite forest cover data, official palm oil concession boundaries, NASA fire detection records, and population surveys from leading conservation NGOs to identify the strongholds that remain.",
    mapLabel: "Borneo · Forest Integrity & Loss",
    mapBackground:
      "radial-gradient(ellipse 60% 50% at 60% 45%, #2d5a2a 0%, #4a8642 25%, #b7c878 50%, #e8c168 72%, #c75a32 100%)",
    aiSuggestion:
      "Add the Tabin–Kulamba corridor connectivity overlay to flag the inter-stronghold migration risk.",
  },
  geomarketing: {
    breadcrumb: ["Spanish Drugstore Targeting", "Q2 2026 Media Weighting"],
    sharedWith: [
      { initials: "MS", from: "#E89A3C", to: "#A85E14" },
      { initials: "BC", from: "#3A6FB3", to: "#1F4A85" },
    ],

    prompt:
      "Build a targeting report — where their core shopper actually lives, and where to weight Q2 media spend across the trade areas of all 1,400 stores.",
    recap:
      "Here are the regional trade-area clusters ranked on core-shopper density and Q2 media-weighting upside",
    panelTitle: "Top 4 Trade-Area Clusters by Core-Shopper Density",
    panelSubtitle: "Q2 2026 · Media Weighting",
    items: [
      { rank: 1, label: "Madrid Sur — Móstoles · Fuenlabrada", delta: "+89" },
      { rank: 2, label: "Vallès Occidental — Sabadell · Terrassa", delta: "+83" },
      { rank: 3, label: "Sevilla Aljarafe", delta: "+77" },
      { rank: 4, label: "Bilbao Bizkaia", delta: "+71" },
    ],
    takeaway:
      "Madrid Sur's 84-store cluster outperforms despite discount-store pressure — weight Q2 media spend toward Cercanías-served catchments along the C-5 and A-42 corridors.",
    reportTitle:
      "Spanish Drugstore Trade-Area: Q2 Media Weighting Strategy",
    reportMeta: "Network Strategy Report · Geomarketing · 1,400 Stores",
    reportBody:
      "This report presents a comparative analysis of two of the chain's most strategically significant regional trade-area clusters: Madrid Sur — 84 stores across Móstoles, Fuenlabrada, Leganés, Getafe, and Parla along the C-5 Cercanías line and A-42 corridor — and Vallès Occidental, comprising 62 stores across the Catalan industrial belt along the R4 Rodalies line and AP-7 axis.",
    mapLabel: "Spain · Core-Shopper Density",
    mapBackground:
      "radial-gradient(circle at 30% 40%, rgba(255,150,80,0.7) 0%, transparent 22%)," +
      "radial-gradient(circle at 70% 60%, rgba(120,80,200,0.6) 0%, transparent 26%)," +
      "linear-gradient(135deg, #e8eef5 0%, #b8c5d8 100%)",
    aiSuggestion:
      "Layer on the Bilbao and Zaragoza emerging-shopper concentrations as a follow-up media-expansion candidate set.",
  },
  "urban-infrastructure": {
    breadcrumb: ["Rome Municipio V", "PNRR 180-Unit Housing"],
    sharedWith: [
      { initials: "MR", from: "#A82424", to: "#6B1414" },
      { initials: "PN", from: "#3F7AB8", to: "#1F4A85" },
    ],

    prompt:
      "Evaluate three candidate parcels in Municipio V (Rome) for the PNRR 2026–2028 affordable housing programme. Recommend the strongest site and flag any disqualifying issues.",
    recap:
      "Here are the Municipio V parcels ranked against the PNRR 2026–2028 affordable-housing programme criteria",
    panelTitle: "Top 4 Municipio V Parcels by PNRR Suitability",
    panelSubtitle: "2026–2028 · Affordable Housing Programme",
    items: [
      { rank: 1, label: "Parcel A — Tor Tre Teste", delta: "+88" },
      { rank: 2, label: "Parcel B — Centocelle", delta: "+82" },
      { rank: 3, label: "Parcel C — Quarticciolo", delta: "+76" },
      { rank: 4, label: "Parcel D — Centocelle Est", delta: "+71" },
    ],
    takeaway:
      "Parcel A offers the highest combined transit access, school capacity, and PRG compliance — flag asphalt-foundation risk on Parcel C before commit.",
    reportTitle:
      "Rome Municipio V PNRR Affordable Housing: Site Suitability Audit",
    reportMeta: "PNRR 2026–2028 · Urban Infrastructure · 180-Unit Target",
    reportBody:
      "This report evaluates three candidate parcels in the Municipio V district of Rome for the planned 2026–2028 affordable housing initiative under the PNRR housing modernization programme. The objective is to identify the parcel best suited to deliver approximately 180 residential units while meeting the programme's mandated targets for energy performance, social integration, and accessibility.",
    mapLabel: "Rome Municipio V · PNRR Suitability",
    mapBackground:
      "linear-gradient(135deg, #d6e2ee 0%, #8da4c0 38%, #4a6b8c 68%, #2c4564 100%)," +
      "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 18px)," +
      "#7d92ab",
    aiSuggestion:
      "Cross-reference Parcel A with the asphalt-foundation risk audit before publishing the final recommendation.",
  },
};

export type AgenticResearchMockupProps = {
  industryId?: IndustryId;
  /* When true, the frame loads eagerly at low priority even while this demo
     is the inactive (display:none) one — ComparisonSection sets it once the
     section enters the viewport so all showcases are preloaded. */
  preload?: boolean;
};

export default function AgenticResearchMockup({ industryId, preload = false }: AgenticResearchMockupProps = {}) {
  const warm = useMediaWarm();
  const soon = warm || preload;
  const c =
    (industryId && CONTENT[industryId]) ?? CONTENT["residential-real-estate"]!;

  return (
    <div
      className="biz-product-display biz-mockup-frame relative w-full mx-auto"
      style={{
        aspectRatio: "5190 / 2993",
        maxWidth: 1180,
        /* 24px rounded corners matching MapChatPlatform /
           DataManagerMockup. The chrome PNG runs flush to the
           rounded edges (the 6px white-frame inset that used to
           live here was creating a visible polaroid-style border
           around the demo — removed per the design pass). The
           rounded clip slightly trims the baked-in bottom-left
           settings gear icon — accepted tradeoff for a cleaner
           edge that matches the other demos in the family. */
        borderRadius: "var(--ent-radius-2xl)",
        overflow: "hidden",
        /* White placeholder fill — before the chrome PNG loads this wrapper
           would otherwise be transparent and show the section's sky backdrop
           straight through (reading as a borderless/"no-frame" flash). The
           white fill makes it a clean white panel until the chrome paints. */
        backgroundColor: "#FFFFFF",
        containerType: "inline-size",
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{ inset: 0, zIndex: 5 }}
      >
        <Image
          src={researchFrame}
          alt="Columbus Agentic Research"
          fill
          sizes="(max-width: 1180px) 100vw, 1180px"
          placeholder="blur"
          loading={soon ? "eager" : "lazy"}
          fetchPriority={soon ? "low" : undefined}
          className="object-cover object-center"
        />
      </div>

      {/* Breadcrumb cover — opaque white div over everything after the
          chrome's baked "Columbus" wordmark. Extended left to 15.5% so it
          also hides the chrome's baked navy "/" separator (x≈16.8–17.2%) —
          that slash is a different colour + tighter spacing than our
          rendered one, so we re-render BOTH separators here for a single
          consistent style/rhythm. Columbus ends at ~15.25%, so 15.5% clears
          it; right edge stays at 60.89%. Sits above the frame (z-5) but
          below the inner pane (z-10). */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "15.5%",
          width: "45.39%",
          height: "7.02%",
          backgroundColor: "#FFFFFF",
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          fontFamily: FONT_STACK,
        }}
      >
        <span
          style={{
            fontSize: "clamp(0.7rem, 1.15cqw, 1rem)",
            fontWeight: 600,
            color: TEXT_NAVY,
            letterSpacing: "-0.015em",
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {/* Leading separator (Columbus / …) — same style as the inner one
              so all breadcrumb slashes match in colour + spacing. */}
          <span style={{ color: TEXT_MUTED, fontWeight: 500, margin: "0 clamp(6px, 0.8cqw, 10px)" }}>
            /
          </span>
          {c.breadcrumb[0]}
          <span style={{ color: TEXT_MUTED, fontWeight: 500, margin: "0 clamp(6px, 0.8cqw, 10px)" }}>
            /
          </span>
          {c.breadcrumb[1]}
        </span>
      </div>

      {/* Shared-with cover — opaque white div over the
          "Shared with [UC Trade Joe's][Giant] ▾" portion of the
          chrome's top bar (x=3600 → x=4400 of the source = 69.36% →
          84.78% from left). Renders the industry's collaborator
          set: "Shared with" label + overlapping circular avatars +
          chevron dropdown. Same z-stack as the breadcrumb cover. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "69.36%",
          width: "15.42%",
          height: "7.02%",
          backgroundColor: "#FFFFFF",
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          gap: "clamp(6px, 0.9cqw, 12px)",
          paddingLeft: "clamp(2px, 0.3cqw, 4px)",
          fontFamily: FONT_STACK,
        }}
      >
        <span
          style={{
            fontSize: "clamp(0.62rem, 0.95cqw, 0.82rem)",
            fontWeight: 500,
            color: TEXT_MUTED,
            letterSpacing: "-0.005em",
            whiteSpace: "nowrap",
          }}
        >
          Shared with
        </span>
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          {c.sharedWith.map((person, i) => (
            <span
              key={`${person.initials}-${i}`}
              style={{
                width: "clamp(16px, 2.2cqw, 30px)",
                height: "clamp(16px, 2.2cqw, 30px)",
                borderRadius: 9999,
                background: `linear-gradient(135deg, ${person.from} 0%, ${person.to} 100%)`,
                border: "1.5px solid #FFFFFF",
                marginLeft: i === 0 ? 0 : "clamp(-8px, -0.7cqw, -5px)",
                color: "#FFFFFF",
                fontSize: "clamp(0.5rem, 0.78cqw, 0.7rem)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 2px rgba(15,23,60,0.10)",
              }}
            >
              {person.initials}
            </span>
          ))}
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{
            width: "clamp(11px, 1.3cqw, 16px)",
            height: "clamp(11px, 1.3cqw, 16px)",
            color: TEXT_MUTED,
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      <div
        className="absolute"
        style={{
          left: "4.32%",
          top: "7.02%",
          right: 0,
          /* Inner pane extends all the way to the chrome's bottom so
             the AI suggestion banner inside the right column has room
             to breathe and doesn't read as prematurely cut off. */
          bottom: 0,
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
          zIndex: 10,
          fontFamily: FONT_STACK,
          color: TEXT_NAVY,
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.66fr) 1px minmax(0, 1fr)",
        }}
      >
        {/* ────────── Left: chat column ────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding:
              "clamp(14px, 2.4cqw, 32px) clamp(14px, 2.2cqw, 28px) clamp(12px, 2cqw, 22px)",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* User prompt — gray rounded bubble, right-aligned per the
              reference screenshot. */}
          <div
            style={{
              alignSelf: "flex-end",
              backgroundColor: "#EFEFEF",
              borderRadius: "clamp(10px, 1.2cqw, 16px)",
              padding:
                "clamp(8px, 1.1cqw, 14px) clamp(10px, 1.3cqw, 16px)",
              fontSize: "clamp(0.62rem, 0.95cqw, 0.8rem)",
              lineHeight: 1.4,
              maxWidth: "92%",
              letterSpacing: "-0.005em",
              color: TEXT_NAVY,
            }}
          >
            {c.prompt}
          </div>

          <div
            style={{
              marginTop: "clamp(10px, 1.4cqw, 18px)",
              display: "flex",
              alignItems: "center",
              gap: "clamp(5px, 0.7cqw, 10px)",
            }}
          >
            <ColumbusMark />
            <span
              style={{
                fontSize: "clamp(0.58rem, 0.85cqw, 0.72rem)",
                color: "#9AA0A6",
                letterSpacing: "-0.005em",
              }}
            >
              Columbus forecasted your question
            </span>
          </div>

          <p
            style={{
              margin: 0,
              marginTop: "clamp(8px, 1.1cqw, 14px)",
              fontSize: "clamp(0.62rem, 0.95cqw, 0.8rem)",
              lineHeight: 1.45,
              color: TEXT_NAVY,
              letterSpacing: "-0.005em",
            }}
          >
            {c.recap}
          </p>

          {/* Ranked panel — gray surface, navy badges, blue deltas.
              Same recipe as ForecastCard, picked for visual parity. */}
          <div
            style={{
              marginTop: "clamp(10px, 1.4cqw, 18px)",
              backgroundColor: PANEL_BG,
              borderRadius: "clamp(8px, 1cqw, 14px)",
              padding:
                "clamp(10px, 1.3cqw, 18px) clamp(10px, 1.3cqw, 18px) clamp(8px, 1.1cqw, 14px)",
            }}
          >
            <div
              style={{
                fontSize: "clamp(0.66rem, 1cqw, 0.86rem)",
                fontWeight: 600,
                color: TEXT_NAVY,
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
              }}
            >
              {c.panelTitle}
            </div>
            <div
              style={{
                marginTop: "clamp(2px, 0.3cqw, 4px)",
                fontSize: "clamp(0.55rem, 0.8cqw, 0.7rem)",
                color: "#7C7C85",
              }}
            >
              {c.panelSubtitle}
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "clamp(8px, 1.2cqw, 14px) 0 0",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(5px, 0.7cqw, 8px)",
              }}
            >
              {c.items.map((item) => (
                <li
                  key={item.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "clamp(0.6rem, 0.9cqw, 0.78rem)",
                    color: TEXT_NAVY,
                    letterSpacing: "-0.005em",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "clamp(6px, 0.9cqw, 12px)",
                      minWidth: 0,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        flexShrink: 0,
                        width: "clamp(15px, 1.6cqw, 22px)",
                        height: "clamp(15px, 1.6cqw, 22px)",
                        borderRadius: 9999,
                        backgroundColor: BADGE_BG,
                        color: "#FFFFFF",
                        fontSize: "clamp(0.5rem, 0.75cqw, 0.66rem)",
                        fontWeight: 600,
                        lineHeight: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.rank}
                    </span>
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </span>
                  </span>
                  <span
                    style={{
                      color: DELTA_BLUE,
                      fontVariantNumeric: "tabular-nums",
                      fontWeight: 500,
                      flexShrink: 0,
                      marginLeft: "clamp(6px, 0.8cqw, 10px)",
                    }}
                  >
                    {item.delta}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key takeaway — same gray surface. */}
          <div
            style={{
              marginTop: "clamp(6px, 0.9cqw, 10px)",
              backgroundColor: PANEL_BG,
              borderRadius: "clamp(8px, 1cqw, 14px)",
              padding: "clamp(10px, 1.3cqw, 18px)",
            }}
          >
            <div
              style={{
                fontSize: "clamp(0.66rem, 1cqw, 0.86rem)",
                fontWeight: 600,
                color: TEXT_NAVY,
                letterSpacing: "-0.01em",
              }}
            >
              Key takeaway
            </div>
            <p
              style={{
                margin: 0,
                marginTop: "clamp(4px, 0.6cqw, 8px)",
                fontSize: "clamp(0.6rem, 0.9cqw, 0.78rem)",
                lineHeight: 1.45,
                color: TEXT_NAVY,
                letterSpacing: "-0.005em",
              }}
            >
              {c.takeaway}
            </p>
          </div>

          <button
            type="button"
            style={{
              marginTop: "clamp(10px, 1.3cqw, 16px)",
              alignSelf: "flex-start",
              backgroundColor: BADGE_BG,
              color: "#FFFFFF",
              borderRadius: 9999,
              border: "none",
              padding:
                "clamp(7px, 1cqw, 12px) clamp(12px, 1.6cqw, 22px)",
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(6px, 0.9cqw, 12px)",
              fontSize: "clamp(0.6rem, 0.88cqw, 0.78rem)",
              fontWeight: 600,
              letterSpacing: "-0.005em",
              cursor: "default",
              fontFamily: FONT_STACK,
            }}
          >
            View Full Report
            <ArrowGlyph />
          </button>

          <div style={{ flex: 1 }} />

          {/* Bottom Ask Columbus input — white pill with the same
              navy-fill submit button used elsewhere in the site. */}
          <div
            className="relative"
            style={{ marginTop: "clamp(10px, 1.3cqw, 16px)" }}
          >
            <input
              readOnly
              placeholder="Ask Columbus"
              className="w-full"
              style={{
                borderRadius: "clamp(8px, 1cqw, 14px)",
                border: `1px solid ${BORDER}`,
                backgroundColor: "#FFFFFF",
                padding:
                  "clamp(8px, 1.1cqw, 14px) clamp(40px, 4cqw, 54px) clamp(8px, 1.1cqw, 14px) clamp(12px, 1.4cqw, 20px)",
                fontSize: "clamp(0.62rem, 0.92cqw, 0.78rem)",
                color: TEXT_MUTED,
                outline: "none",
                fontFamily: FONT_STACK,
              }}
            />
            <span
              aria-hidden
              style={{
                position: "absolute",
                right: "clamp(6px, 0.7cqw, 10px)",
                top: "50%",
                transform: "translateY(-50%)",
                width: "clamp(22px, 2.6cqw, 34px)",
                height: "clamp(22px, 2.6cqw, 34px)",
                borderRadius: "clamp(6px, 0.7cqw, 10px)",
                backgroundColor: BADGE_BG,
                color: "#FFFFFF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                style={{
                  width: "clamp(11px, 1.3cqw, 16px)",
                  height: "clamp(11px, 1.3cqw, 16px)",
                }}
              >
                <path d="M5 12h14" />
                <path d="m13 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Hairline column divider — same #E4E4E7 used across the site
            on card edges and table rules. */}
        <div style={{ backgroundColor: BORDER }} />

        {/* ────────── Right: research document column ────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding:
              "clamp(14px, 2.4cqw, 32px) clamp(16px, 2.6cqw, 34px) clamp(12px, 2cqw, 22px)",
            minHeight: 0,
            overflow: "hidden",
            gap: "clamp(8px, 1.2cqw, 14px)",
          }}
        >
          {/* Title + metadata + actions row */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "clamp(8px, 1.2cqw, 14px)",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "clamp(0.85rem, 1.3cqw, 1.1rem)",
                    fontWeight: 600,
                    color: TEXT_NAVY,
                    letterSpacing: "-0.015em",
                    lineHeight: 1.2,
                  }}
                >
                  {c.reportTitle}
                </div>
                <div
                  style={{
                    marginTop: "clamp(3px, 0.4cqw, 5px)",
                    fontSize: "clamp(0.56rem, 0.84cqw, 0.72rem)",
                    color: TEXT_MUTED,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {c.reportMeta}
                </div>
              </div>
              {/* Edit / share buttons row */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "clamp(4px, 0.6cqw, 8px)",
                  flexShrink: 0,
                }}
              >
                <IconButton glyph={<EditGlyph />} />
                <IconButton glyph={<ShareGlyph />} />
              </div>
            </div>
          </div>

          {/* Body paragraph */}
          <p
            style={{
              margin: 0,
              fontSize: "clamp(0.6rem, 0.9cqw, 0.78rem)",
              lineHeight: 1.55,
              color: TEXT_NAVY,
              letterSpacing: "-0.005em",
            }}
          >
            {c.reportBody}
          </p>

          {/* Map visualization — gradient-painted card with edit
              affordances overlaid (Interact / Expand) in the corners. */}
          <div
            style={{
              position: "relative",
              flex: 1,
              minHeight: 0,
              borderRadius: "clamp(8px, 1cqw, 14px)",
              border: `1px solid ${BORDER}`,
              overflow: "hidden",
              background: c.mapBackground,
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(35deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, transparent 1px, transparent 22px)," +
                  "repeating-linear-gradient(-55deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 30px)",
                pointerEvents: "none",
              }}
            />
            <MapChip>{c.mapLabel}</MapChip>
            <MapChip right>
              Expand
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                style={{
                  width: "clamp(9px, 1.1cqw, 12px)",
                  height: "clamp(9px, 1.1cqw, 12px)",
                  marginLeft: 4,
                }}
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M21 14v7H3v-7" />
                <path d="M3 10V3h7" />
              </svg>
            </MapChip>
          </div>

          {/* AI Suggestion banner — Columbus Agent + suggestion text +
              "Implement change" pill. Placed at the bottom of the
              research column so it reads as an inline edit affordance. */}
          <div
            style={{
              backgroundColor: PANEL_BG,
              borderRadius: "clamp(8px, 1cqw, 14px)",
              padding:
                "clamp(8px, 1.1cqw, 14px) clamp(10px, 1.3cqw, 18px)",
              display: "flex",
              alignItems: "flex-start",
              gap: "clamp(8px, 1.1cqw, 14px)",
            }}
          >
            <img
              src="/logobueno.png"
              alt=""
              aria-hidden
              style={{
                width: "clamp(18px, 2cqw, 26px)",
                height: "clamp(18px, 2cqw, 26px)",
                flexShrink: 0,
                marginTop: "clamp(1px, 0.15cqw, 2px)",
                objectFit: "contain",
                /* Recolour the logo to the site-wide dark navy so it
                   sits naturally against the gray panel — same filter
                   ForecastCard / ColumbusReasoningCard / MistxNav use
                   for the logo on light backgrounds. */
                filter:
                  "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "clamp(0.6rem, 0.9cqw, 0.78rem)",
                  fontWeight: 600,
                  color: TEXT_NAVY,
                  letterSpacing: "-0.005em",
                }}
              >
                Columbus Agent
              </div>
              <p
                style={{
                  margin: 0,
                  marginTop: "clamp(2px, 0.3cqw, 4px)",
                  fontSize: "clamp(0.56rem, 0.84cqw, 0.72rem)",
                  lineHeight: 1.45,
                  color: TEXT_NAVY,
                  letterSpacing: "-0.005em",
                }}
              >
                {c.aiSuggestion}
              </p>
            </div>
            <button
              type="button"
              style={{
                flexShrink: 0,
                marginTop: "clamp(1px, 0.15cqw, 2px)",
                backgroundColor: "#FFFFFF",
                border: `1px solid ${DELTA_BLUE}`,
                color: DELTA_BLUE,
                borderRadius: 9999,
                padding: "clamp(4px, 0.6cqw, 7px) clamp(8px, 1.1cqw, 14px)",
                fontSize: "clamp(0.54rem, 0.8cqw, 0.68rem)",
                fontWeight: 600,
                letterSpacing: "-0.005em",
                cursor: "default",
                fontFamily: FONT_STACK,
              }}
            >
              Implement change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Sub-components ───────── */

function IconButton({ glyph }: { glyph: React.ReactNode }) {
  return (
    <span
      aria-hidden
      style={{
        width: "clamp(22px, 2.4cqw, 32px)",
        height: "clamp(22px, 2.4cqw, 32px)",
        borderRadius: "clamp(6px, 0.7cqw, 9px)",
        border: `1px solid ${BORDER}`,
        backgroundColor: "#FFFFFF",
        color: TEXT_NAVY,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {glyph}
    </span>
  );
}

function MapChip({
  children,
  right = false,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <span
      style={{
        position: "absolute",
        top: "clamp(8px, 1cqw, 14px)",
        ...(right
          ? { right: "clamp(8px, 1cqw, 14px)" }
          : { left: "clamp(8px, 1cqw, 14px)" }),
        padding:
          "clamp(4px, 0.6cqw, 7px) clamp(8px, 1.1cqw, 12px)",
        backgroundColor: "rgba(255,255,255,0.92)",
        color: TEXT_NAVY,
        borderRadius: 9999,
        border: `1px solid ${BORDER}`,
        fontSize: "clamp(0.54rem, 0.8cqw, 0.68rem)",
        fontWeight: 500,
        letterSpacing: "-0.005em",
        display: "inline-flex",
        alignItems: "center",
        boxShadow: "0 1px 2px rgba(15,23,60,0.08)",
        fontFamily: FONT_STACK,
      }}
    >
      {children}
    </span>
  );
}

function ColumbusMark() {
  return (
    <img
      src="/logobueno.png"
      alt=""
      aria-hidden
      style={{
        display: "block",
        objectFit: "contain",
        width: "clamp(12px, 1.4cqw, 20px)",
        height: "clamp(12px, 1.4cqw, 20px)",
        filter:
          "brightness(0) saturate(100%) invert(8%) sepia(80%) saturate(1400%) hue-rotate(215deg) brightness(90%)",
      }}
    />
  );
}

function ArrowGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{
        width: "clamp(10px, 1.2cqw, 16px)",
        height: "clamp(10px, 1.2cqw, 16px)",
      }}
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function EditGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{
        width: "clamp(11px, 1.3cqw, 16px)",
        height: "clamp(11px, 1.3cqw, 16px)",
      }}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function ShareGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{
        width: "clamp(11px, 1.3cqw, 16px)",
        height: "clamp(11px, 1.3cqw, 16px)",
      }}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51 15.42 17.49" />
      <path d="M15.41 6.51 8.59 10.49" />
    </svg>
  );
}
