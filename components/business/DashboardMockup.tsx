"use client";

import Image from "next/image";
import type { IndustryId } from "@/components/use-cases/industry/types";

/* Mock UI: the "Dashboard" demo. Reuses the same chrome PNG as
   DataManagerMockup / AgenticResearchMockup and paints the inner pane
   with a list-style activity view, modelled on the reference
   screenshot's Chats tab.

   Structure (top-to-bottom):
     1. Underlined tab row — Audits / Site Selections / Chats /
        Mapshots, with Chats active (2px navy underline + bolder weight)
     2. Toolbar row — "Select" text-action, "Sort by: Newest ▾"
        dropdown, and a "✎ New Chat" rainbow-bordered CTA
     3. Vertical list of items — each item a #F4F4F5 panel with
        title, description, and a footer of date / visibility /
        avatars

   Frame inset boundaries (measured on the 5184×2976 DashboardFrame
   source — sharp chrome edges, no drop-shadow):
     • left rail right-edge: x=215  →  4.167%
     • top bar bottom-edge:  y=179  →  6.048%

   Visual tokens come from the established Columbus design system:
   Axiforma, navy text on white, gray #F4F4F5 panels, 1px #E4E4E7
   hairline rules. The "+ New Chat" CTA uses the same rainbow
   gradient border treatment that appears on the "Data Digestion" and
   "+ Smart Layers" buttons in the chrome frame, so the inner UI reads
   as a continuation of the frame's button language.

   Per-industry content is lifted from the user's source PDFs (chat /
   site-selection / mapshot / audit panels). Descriptions are
   intentionally longer and more substantive than the previous
   grid-card version — matching the screenshot's narrative density. */

const FONT_STACK =
  "Axiforma, 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif";

const PANEL_BG = "#F4F4F5";
const BORDER = "#E4E4E7";
const TEXT_NAVY = "#0F173C";
const TEXT_BODY = "#1F2937";
const TEXT_MUTED = "#6B7280";

type ItemKind = "audit" | "site-selection" | "chat" | "mapshot";
type Visibility = "public" | "private";

type DashboardItem = {
  title: string;
  body: string;
  date: string;
  visibility: Visibility;
  kind: ItemKind;
};

const TABS: { id: ItemKind; label: string }[] = [
  { id: "audit", label: "Audits" },
  { id: "site-selection", label: "Site Selections" },
  { id: "chat", label: "Chats" },
  { id: "mapshot", label: "Mapshots" },
];

const ACTIVE_TAB: ItemKind = "chat";

const CONTENT: Partial<Record<IndustryId, DashboardItem[]>> = {
  "residential-real-estate": [
    {
      title: "Mechlen County 600k sqft Property Pipeline Analysis",
      body: "Analyzed 3 candidate parcels in Mechlen County for a 600,000 sqft middle-income residential site; ranked Westfield Industrial Park at 94/100 against R-3 zoning, topography, flood risk, and utilities-infrastructure criteria.",
      date: "May 21, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "Amsterdam Buurten Rent Growth",
      body: "Cross-referenced free-sector rent growth against tram-line corridor density across 24 Amsterdam buurten; surfaced 4 high-growth pockets led by De Pijp-Noord at +28.4%, with takeaway on new-build pipeline tightness over a 5-year window.",
      date: "May 18, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "Valencia Mid-Rise Shortlist",
      body: "Investigated 4,200+ parcels across Valencia province for 8,000–20,000 m² mid-rise envelopes; prioritized 15 sites with positive demographic in-migration and competitor pipeline density inside a 30-minute drive-time radius.",
      date: "May 12, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "Patraix flood-risk vs zoning overlay",
      body: "Stacked the 2050 floodplain evolution model against R-3 zoning permissions and tram-line access in the Valencia Patraix district; flagged 3 parcels at acceptable risk and 2 with disqualifying drainage history for the rezoning panel.",
      date: "May 6, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "Short-term rental saturation thresholds",
      body: "Modeled Airbnb density against postal-code rental yields to identify where short-term rental saturation is depressing long-term residential pricing; produced a 7-tier saturation index with thresholds tuned to mid-tier metro residential portfolios.",
      date: "Apr 28, 2026",
      visibility: "private",
      kind: "chat",
    },
  ],
  "commercial-real-estate": [
    {
      title: "French flagship rollout — 36-month sequence",
      body: "Built a market-entry shortlist across 47 French metros against 14 weighted criteria; ranked Lyon's Presqu'île and Bordeaux's Sainte-Catherine corridor at the top, with 3–5 high-street sites per city and lease comps inside a 36-month opening sequence.",
      date: "May 21, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "Sun Belt multifamily IC comparative DD",
      body: "Comparative due-diligence across four Sun Belt acquisition targets (1,040 units / $250M aggregate) — East Austin, Madison-Nashville, Doral, Chandler. Flagged in-place vs. market rent gaps and 2-mile Class A/B supply against eleven weighted criteria.",
      date: "May 15, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "Nashville value-add rent-lift probability",
      body: "Generative smart layer scoring multifamily properties of 100+ units built between 1975 and 2000 across the Nashville MSA on probability of supporting a 25%+ rent lift within 24 months of renovation; harmonized with broker rent-roll evidence.",
      date: "May 8, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "London Grade A prime rent forecast",
      body: "Forecasted top 5 London office submarkets for Grade A prime rent growth over the next 24 months against tenant industry mix, return-to-office mobility data, and ESG compliance stranding pressure; City Core leads at +11.8%.",
      date: "May 1, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "Manhattan CRE buyer-pattern detection",
      body: "Mined every $25M+ Manhattan transaction over 18 months for ultimate beneficial owner concentration, submarket clustering, capital structure, and cap-rate compression signals; surfaced 6 fund-vintage flip patterns worth monitoring.",
      date: "Apr 24, 2026",
      visibility: "private",
      kind: "chat",
    },
  ],
  "academic-research": [
    {
      title: "Shimokitazawa vs Kōenji — capstone comparative",
      body: "Comparative review-ready academic report contrasting Shimokitazawa (Setagaya, Odakyū / Keiō Inokashira) and Kōenji (Suginami, JR Chūō) on independent music venues, vintage retail density, pedestrian demographics, and line-infrastructure shifts.",
      date: "May 21, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "EU land-use change — longitudinal",
      body: "Pulled harmonized longitudinal land-use change data across 18 EU countries from 1995–2024; cross-checked with academic-grade methodology notes to support a comparative urban-development thesis with consistent country panels.",
      date: "May 16, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "Northern Canadian pricing-pattern study",
      body: "Compared Northern Store and North West Company pricing across remote Canadian communities, cross-referenced with Nutrition North Canada subsidy eligibility and winter-road dependency status; surfaced cost-of-living differentials by accessibility tier.",
      date: "May 9, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "Tokyo wards — pedestrian demographic capture",
      body: "Inferred median age and apparent income of pedestrians from street-view image analysis across six Tokyo wards; built a comparative cohort dataset suitable for citation in subculture-district capstone research.",
      date: "May 4, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "Suginami line-undergrounding impact",
      body: "Traced the measured effect of the Odakyū-line undergrounding on Shimokitazawa's pedestrian flow, vintage retail density, and rent dynamics; assembled an evidence base aligned with funder review-committee expectations.",
      date: "Apr 27, 2026",
      visibility: "private",
      kind: "chat",
    },
  ],
  "environmental-research": [
    {
      title: "Borneo forest loss 2003–2023",
      body: "Combined two decades of satellite forest cover, palm oil concession boundaries, NASA fire detection, and NGO orangutan population surveys to map exactly where habitat has been lost and where the highest-integrity strongholds remain.",
      date: "May 21, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "Tabin–Kulamba corridor connectivity",
      body: "Built a habitat connectivity model for the Tabin–Kulamba corridor linking Borneo's eastern strongholds; identified 3 priority corridor segments at risk of fragmentation under current concession boundary plans.",
      date: "May 17, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "NDWI satellite water content monitoring",
      body: "Smart layer integrating NDWI satellite water-content signals against drought-stress indicators across Mediterranean catchments; surfaced 4 watersheds approaching critical thresholds in advance of the regional drought-response cycle.",
      date: "May 10, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "Sebangau peat-forest integrity audit",
      body: "Saved overlay combining forest-cover layers, NASA fire perimeters, and palm oil concession boundaries across the 5,690 km² Sebangau peat-forest stronghold; quantified intact-forest integrity at +91 against the protection priority index.",
      date: "May 3, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "Ecosystem health pollution-source tracking",
      body: "Cross-referenced NASA fire perimeters and conservation NGO field surveys to trace pollution sources affecting the Sebangau buffer ecosystems; produced a 12-source attribution report for the regional environmental ministry review.",
      date: "Apr 26, 2026",
      visibility: "private",
      kind: "chat",
    },
  ],
  geomarketing: [
    {
      title: "Spanish drugstore Q2 media-weighting plan",
      body: "Built a trade-area targeting report across 1,400 stores: surfaced where core shoppers actually live and where to weight Q2 media spend, ranking 12 regional clusters led by Madrid Sur and Vallès Occidental for Cercanías-served catchments.",
      date: "May 21, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "Madrid Sur Cercanías cluster deep-dive",
      body: "Profiled the 84-store Madrid Sur cluster across Móstoles, Fuenlabrada, Leganés, Getafe, and Parla; quantified C-5 Cercanías and A-42 corridor catchment dynamics against discount-store pressure and audience segmentation.",
      date: "May 16, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "UK commuter audience flow — 2.4M rows",
      body: "Mapped daily commute flows and dwell zones across UK transit and road corridors using 2.4 million journey records; surfaced 6 weekday-evening OOH inventory opportunities aligned with the chain's UK store catchments.",
      date: "May 11, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "Vallès Occidental industrial-belt cluster",
      body: "Modeled the 62-store Vallès Occidental cluster along the Catalan industrial belt — Sabadell, Terrassa, Cerdanyola del Vallès, Rubí — across the R4 Rodalies and AP-7 axis against loyalty-data core-shopper concentration.",
      date: "May 5, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "UK postcode consumer segmentation",
      body: "Built a postcode-resolution consumer segmentation aligned with Acorn — 6 categories, 18 groups, 62 lifestyle-income types — at a fraction of CACI's £25K–£80K/year licensing economics for the chain's media-planning team.",
      date: "Apr 28, 2026",
      visibility: "private",
      kind: "chat",
    },
  ],
  "urban-infrastructure": [
    {
      title: "Rome Municipio V PNRR site selection",
      body: "Evaluated three candidate parcels in Municipio V for the PNRR 2026–2028 affordable housing programme across transit access, schools, soil conditions, flood risk, infrastructure capacity, and PRG compliance; Parcel A leads at 88.",
      date: "May 21, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "Seville asphalt-foundation repair DD",
      body: "Independent due-diligence review of 23 flagged road segments across Triana, Macarena, and Nervión districts; verified severity classifications, flagged adjacent-project coordination risks, and validated the 12-month repair timeline.",
      date: "May 14, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "Hammerbrook resurfacing compliance",
      body: "Regulatory compliance audit of the 14.2 km Hammerbrook asphalt-resurfacing programme against federal, state, and EU frameworks; surfaced 4 segments at non-compliance risk and recommended an adjusted scope before tender release.",
      date: "May 7, 2026",
      visibility: "private",
      kind: "chat",
    },
    {
      title: "Metro-region building footprint catalogue",
      body: "Compiled 55,010 rows of harmonized building footprints with height, age, use type, and floor area across the metro region; integrated against full road network and traffic-accident severity for a unified infrastructure dataset.",
      date: "Apr 30, 2026",
      visibility: "public",
      kind: "chat",
    },
    {
      title: "Madrid pedestrian-safety perception index",
      body: "Smart layer surfacing pedestrian safety perception across Madrid arterial streets — combined broken-window patterns, after-dark female pedestrian counts, and historical accident severity into a single Streets-That-Feel-Unsafe overlay.",
      date: "Apr 22, 2026",
      visibility: "private",
      kind: "chat",
    },
  ],
};

/* Three gradient palettes used for the small collaborator avatar
   chips on Public items. Indexed by position so each item's avatar
   row reads as a distinct trio. */
const AVATAR_PALETTES: { from: string; to: string }[] = [
  { from: "#F5D386", to: "#C28C4E" },
  { from: "#A7C2E8", to: "#3A6FB3" },
  { from: "#E8B8B0", to: "#A45C58" },
];

export type DashboardMockupProps = {
  industryId?: IndustryId;
};

export default function DashboardMockup({ industryId }: DashboardMockupProps = {}) {
  const items =
    (industryId && CONTENT[industryId]) ?? CONTENT["residential-real-estate"]!;

  return (
    <div
      className="biz-product-display biz-mockup-frame relative w-full mx-auto"
      style={{
        aspectRatio: "5184 / 2976",
        maxWidth: 1180,
        /* 24px rounded corners matching the other demos in the
           ComparisonSection (MapChatPlatform / DataManagerMockup /
           AgenticResearchMockup). The chrome PNG runs flush to the
           rounded edges — the white-frame inset that used to live
           here was creating a visible polaroid-style border around
           the demo and was removed per the design pass. The
           rounded clip slightly trims the baked-in burger / gear
           icons at the corners — accepted tradeoff for a cleaner
           edge that matches the rest of the family. */
        borderRadius: "var(--ent-radius-2xl)",
        overflow: "hidden",
        containerType: "inline-size",
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{ inset: 0, zIndex: 5 }}
      >
        <Image
          src="/business/DashboardFrame.png"
          alt="Columbus Dashboard"
          fill
          sizes="(max-width: 1180px) 100vw, 1180px"
          className="object-cover object-center"
        />
      </div>

      <div
        className="absolute"
        style={{
          left: "4.167%",
          top: "6.048%",
          right: 0,
          bottom: 0,
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
          zIndex: 10,
          fontFamily: FONT_STACK,
          color: TEXT_NAVY,
          display: "flex",
          flexDirection: "column",
          padding:
            "clamp(14px, 2.2cqw, 32px) clamp(20px, 4cqw, 60px) clamp(12px, 2cqw, 24px)",
        }}
      >
      {/* Inner content column — capped to a narrower max-width and
          centered, so the tabs / toolbar / list don't run the full pane
          width. Mirrors the reference Dashboard screenshot where the
          content sits as a centered column inside the right pane. */}
      <div
        style={{
          width: "100%",
          maxWidth: "clamp(280px, 60cqw, 720px)",
          marginLeft: "auto",
          marginRight: "auto",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Tab row — underlined active tab, gray inactive labels. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(14px, 2.4cqw, 36px)",
            paddingBottom: "clamp(8px, 1.1cqw, 14px)",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {TABS.map((t) => {
            const active = t.id === ACTIVE_TAB;
            return (
              <span
                key={t.id}
                style={{
                  position: "relative",
                  fontSize: "clamp(0.7rem, 1.05cqw, 0.9rem)",
                  fontWeight: active ? 600 : 500,
                  color: active ? TEXT_NAVY : TEXT_MUTED,
                  letterSpacing: "-0.01em",
                  paddingBottom: "clamp(8px, 1.1cqw, 14px)",
                }}
              >
                {t.label}
                {active && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: -1,
                      height: 2,
                      backgroundColor: TEXT_NAVY,
                      borderRadius: 2,
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>

        {/* Toolbar: Select · Sort by · New Chat (rainbow-bordered CTA) */}
        <div
          style={{
            marginTop: "clamp(8px, 1.2cqw, 16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(8px, 1.2cqw, 16px)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(14px, 2cqw, 26px)",
            }}
          >
            <span
              style={{
                fontSize: "clamp(0.62rem, 0.95cqw, 0.8rem)",
                color: TEXT_NAVY,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              Select
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "clamp(4px, 0.6cqw, 7px)",
                fontSize: "clamp(0.62rem, 0.95cqw, 0.8rem)",
                color: TEXT_NAVY,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              Sort by: Newest
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
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>

          {/* New Chat — rainbow-gradient border, white fill. Matches
              the language of the +Smart Layers / Data Digestion buttons
              in the chrome frame above. */}
          <span
            style={{
              padding: "1.5px",
              borderRadius: 9999,
              background:
                "linear-gradient(90deg, #F4A1FF 0%, #F8B4A8 25%, #F9C570 55%, #F5DBA3 80%, #C8E3FA 100%)",
              display: "inline-flex",
            }}
          >
            <button
              type="button"
              style={{
                backgroundColor: "#FFFFFF",
                color: TEXT_NAVY,
                borderRadius: 9999,
                border: "none",
                padding:
                  "clamp(6px, 0.9cqw, 10px) clamp(12px, 1.6cqw, 20px)",
                display: "inline-flex",
                alignItems: "center",
                gap: "clamp(5px, 0.7cqw, 8px)",
                fontSize: "clamp(0.6rem, 0.92cqw, 0.78rem)",
                fontWeight: 600,
                letterSpacing: "-0.005em",
                cursor: "default",
                fontFamily: FONT_STACK,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                style={{
                  width: "clamp(11px, 1.3cqw, 14px)",
                  height: "clamp(11px, 1.3cqw, 14px)",
                }}
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              New Chat
            </button>
          </span>
        </div>

        {/* Activity list — vertical stack of gray panels. Second-to-last
            item naturally clips at the inner pane's bottom, matching
            the screenshot's natural cutoff. */}
        <div
          style={{
            flex: 1,
            marginTop: "clamp(10px, 1.5cqw, 20px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(8px, 1.2cqw, 14px)",
            minHeight: 0,
            overflow: "hidden",
            alignContent: "start",
          }}
        >
          {items.map((item) => (
            <ItemRow key={item.title} item={item} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

function ItemRow({ item }: { item: DashboardItem }) {
  return (
    <article
      style={{
        backgroundColor: PANEL_BG,
        borderRadius: "clamp(8px, 1cqw, 14px)",
        padding:
          "clamp(10px, 1.4cqw, 18px) clamp(14px, 2cqw, 26px) clamp(10px, 1.3cqw, 16px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(4px, 0.6cqw, 8px)",
      }}
    >
      <div
        style={{
          fontSize: "clamp(0.74rem, 1.1cqw, 0.95rem)",
          fontWeight: 600,
          color: TEXT_NAVY,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {item.title}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "clamp(0.6rem, 0.9cqw, 0.78rem)",
          lineHeight: 1.5,
          color: TEXT_BODY,
          letterSpacing: "-0.005em",
        }}
      >
        {item.body}
      </p>
      <div
        style={{
          marginTop: "clamp(3px, 0.4cqw, 5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(8px, 1.2cqw, 16px)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "clamp(14px, 2cqw, 28px)",
            fontSize: "clamp(0.54rem, 0.82cqw, 0.7rem)",
            color: TEXT_MUTED,
            letterSpacing: "-0.005em",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "clamp(4px, 0.55cqw, 6px)" }}>
            <ClockGlyph />
            {item.date}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "clamp(4px, 0.55cqw, 6px)" }}>
            <LockGlyph />
            {item.visibility === "public" ? "Public" : "Private"}
          </span>
        </div>
        {item.visibility === "public" && <AvatarStack />}
      </div>
    </article>
  );
}

function AvatarStack() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {AVATAR_PALETTES.map((p, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            width: "clamp(14px, 1.7cqw, 22px)",
            height: "clamp(14px, 1.7cqw, 22px)",
            borderRadius: 9999,
            background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`,
            border: "1.5px solid #FFFFFF",
            marginLeft: i === 0 ? 0 : "clamp(-6px, -0.7cqw, -4px)",
            boxShadow: "0 1px 2px rgba(15,23,60,0.10)",
          }}
        />
      ))}
    </div>
  );
}

function ClockGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ width: "clamp(10px, 1.2cqw, 14px)", height: "clamp(10px, 1.2cqw, 14px)" }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ width: "clamp(10px, 1.2cqw, 14px)", height: "clamp(10px, 1.2cqw, 14px)" }}
    >
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
