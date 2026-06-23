"use client";

import type { IndustryId } from "@/components/use-cases/industry/types";
import MockupChrome, { BarDivider, EditsNotSaved } from "./MockupChrome";

/* Mock UI: the "Agentic Research" demo. The app chrome (left icon rail + top
   bar with the Columbus logo, the project breadcrumb, the "Shared with"
   collaborator avatars, and the "Edits not saved" status) is drawn
   programmatically by the shared <MockupChrome>; this component supplies the
   inner pane — the canonical Columbus chat-and-report split. The breadcrumb
   and collaborator set are passed into the chrome as props, so the old
   opaque "cover" divs that used to hide the baked PNG text are gone.

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

/* Collaborator profile photos for the top-bar "Shared with" stack. */
const SHARED_PHOTOS = [
  "/BusinessPgMedia/ProfileImages/Prof2.jpeg",
  "/BusinessPgMedia/ProfileImages/Prof3.png",
];

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
  /* Per-industry research map image (…/MapVisuals/Research.png). Rendered
     over mapBackground, which now only shows as a tint while the image loads
     or if it fails. */
  mapImage: string;
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
      "Find me the top 15 development sites for mid-rise residential in Valencia province, fitting our typical envelope: 8,000–20,000 m², residential or convertible zoning, within 30 minutes of city center, with positive demographic trajectory",
    recap:
      "Here are the top 15 development sites for mid-rise residential across Valencia province that fit your envelope, zoning, and demographic criteria — the leading four shown",
    panelTitle: "Top Sites by Development Suitability",
    panelSubtitle: "Valencia Province · Mid-Rise · 8,000–20,000 m²",
    items: [
      { rank: 1, label: "Quart de Poblet — Parc Central", delta: "+95" },
      { rank: 2, label: "Paterna — Lloma Llarga", delta: "+91" },
      { rank: 3, label: "Alboraya — Patacona", delta: "+87" },
      { rank: 4, label: "Mislata — Quart Sud", delta: "+83" },
    ],
    takeaway:
      "The strongest sites cluster along the metro-served western corridor, where convertible zoning and net in-migration outpace the current mid-rise pipeline; PATRICOVA flood-zone exposure is the main constraint to screen next.",
    reportTitle:
      "Valencia Province Mid-Rise Sites: Western Metro-Corridor Convergence",
    reportMeta: "Site Suitability Report · Residential · Jan 2026",
    reportBody:
      "Across Valencia province, the development sites best matching the 8,000–20,000 m² mid-rise envelope concentrate along the western metro corridor — Quart de Poblet, Paterna, Alboraya, and Mislata each clear the suitability threshold on zoning convertibility, sub-30-minute access to the city center, and positive demographic trajectory. These municipalities pair residential or readily convertible parcels with net in-migration running ahead of the current mid-rise pipeline.",
    mapLabel: "Valencia Province · Site Suitability",
    mapImage: "/BusinessPgMedia/CREUseCases/MapVisuals/Research.png",
    mapBackground:
      "radial-gradient(circle at 52% 60%, #b32a1c 0%, #d35a30 18%, #e88a3a 38%, #f4b465 58%, #fce0a7 80%, #f8efdb 100%)",
    aiSuggestion:
      "Consider layering the PATRICOVA flood-risk map to screen the western-corridor parcels before shortlisting.",
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
    mapImage: "/BusinessPgMedia/ResidentialRealEstateUseCases/MapVisuals/Research.png",
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
    mapImage: "/BusinessPgMedia/AcademicUseCase/MapVisuals/Research.png",
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
    mapImage: "/BusinessPgMedia/EnvironmentalUseCases/MapVisuals/Research.png",
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
    mapImage: "/BusinessPgMedia/GeomarketingUseCases/MapVisuals/Research.png",
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
    mapImage: "/BusinessPgMedia/UrbanInfrastructureUseCases/MapVisuals/Research.png",
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
  /* Accepted for call-site compatibility (ComparisonSection passes it). The
     chrome is now code-drawn, so there's no frame raster to preload — no-op. */
  preload?: boolean;
};

export default function AgenticResearchMockup({ industryId }: AgenticResearchMockupProps = {}) {
  const c =
    (industryId && CONTENT[industryId]) ?? CONTENT["residential-real-estate"]!;

  return (
    <MockupChrome
      className="biz-product-display biz-mockup-frame"
      railIcons={["grid", "search-star", "edit", "database"]}
      activeRailIndex={2}
      crumbs={[c.breadcrumb[0], c.breadcrumb[1]]}
      actions={
        <>
          {/* Shared-with collaborators */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(5px, 0.8cqw, 11px)",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: TEXT_MUTED,
                letterSpacing: "-0.005em",
                whiteSpace: "nowrap",
              }}
            >
              Shared with
            </span>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              {c.sharedWith.map((person, i) => (
                <img
                  key={`${person.initials}-${i}`}
                  src={SHARED_PHOTOS[i % SHARED_PHOTOS.length]}
                  alt=""
                  aria-hidden
                  style={{
                    width: "clamp(16px, 2.2cqw, 30px)",
                    height: "clamp(16px, 2.2cqw, 30px)",
                    borderRadius: 9999,
                    objectFit: "cover",
                    border: "1.5px solid #FFFFFF",
                    marginLeft: i === 0 ? 0 : "clamp(-8px, -0.7cqw, -5px)",
                    boxShadow: "0 1px 2px rgba(15,23,60,0.10)",
                  }}
                />
              ))}
            </span>
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
          </span>
          <BarDivider height="20px" color="#D5D5D5" />
          <EditsNotSaved fontSize="14px" fontWeight={400} saved />
        </>
      }
    >
      <div
        key={industryId ?? "default"}
        className="industry-fade-in"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
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
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Conversation — keeps its inset padding; the input docks flush to
              the column's edges below (mirrors the Map Chat view). */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              // Horizontal inset trimmed 8px each side so the conversation
              // content (user query + response) reads ~8px wider per edge.
              padding:
                "clamp(14px, 2.4cqw, 32px) max(0px, calc(clamp(14px, 2.2cqw, 28px) - 8px)) clamp(12px, 2cqw, 22px)",
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

          </div>

          {/* Input + disclaimer dock — flush to the chat column's
              left/right/bottom edges; only a top hairline separates it from
              the conversation. Mirrors the Map Chat view. */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderTop: `1px solid ${BORDER}`,
              paddingBottom: "clamp(5px, 0.7cqw, 9px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "clamp(46px, 5.6cqw, 76px)",
                padding: "0 clamp(6px, 0.8cqw, 12px) 0 clamp(10px, 1.2cqw, 20px)",
                gap: "clamp(6px, 0.8cqw, 10px)",
              }}
            >
              <input
                readOnly
                placeholder="Ask Columbus anything"
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: TEXT_MUTED,
                  fontSize: "clamp(0.62rem, 0.92cqw, 0.78rem)",
                  fontFamily: FONT_STACK,
                  padding: 0,
                }}
              />
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
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
            <p
              style={{
                margin: 0,
                textAlign: "center",
                color: TEXT_MUTED,
                fontSize: "clamp(0.5rem, 0.72cqw, 0.64rem)",
                letterSpacing: "-0.005em",
                padding: "0 clamp(8px, 1cqw, 16px)",
              }}
            >
              Columbus Pro is an LGM and can get things wrong.
            </p>
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

          {/* Map visualization — per-industry research map image with edit
              affordances overlaid (Interact / Expand) in the corners. The
              mapBackground gradient shows only as a tint while the image
              loads or if it fails. */}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.mapImage}
              alt=""
              aria-hidden
              style={{
                // Cover the whole card (no gaps), anchored to the TOP so the
                // image reads from its top edge and any excess height is
                // clipped at the bottom rather than centre-cropped.
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
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
    </MockupChrome>
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
