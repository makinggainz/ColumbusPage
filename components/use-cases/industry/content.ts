import type {
  IndustryId,
  IndustryContent,
  ChatRowContent,
  SuperModelRowContent,
  AgentResearchRowContent,
  DataCatalogueRowContent,
} from "./types";

/**
 * Default industry — pre-selected when the user lands on the page without
 * picking from the IndustrySelector tile grid. Urban Planning is the natural
 * default: the existing Chat dialogue ("Where should the Transportation
 * authority install a new road-signal…") is verbatim Urban Planning content.
 */
export const DEFAULT_INDUSTRY: IndustryId = "urban-infrastructure";

/** Per-industry accent colour used on the /products/business page —
 *  paints the IndustrySelector active-cell background (low-alpha tint)
 *  and the round IconChips next to titles in the section below. Only
 *  the six business-page industries have a colour today; consumers
 *  should fall back gracefully when a key is undefined. */
export const INDUSTRY_COLOR: Partial<Record<IndustryId, string>> = {
  "residential-real-estate": "#00A7C0",
  "commercial-real-estate": "#B6B300",
  "urban-infrastructure": "#8D8D8D",
  "geomarketing": "#0066B6",
  "academic-research": "#8E5801",
  "environmental-research": "#00B539",
};

/** Tile order for the IndustrySelector grid + sticky navbar carousel. */
export const INDUSTRY_ORDER: IndustryId[] = [
  "residential-real-estate",
  "commercial-real-estate",
  "disaster-response",
  "logistics-optimization",
  "urban-infrastructure",
  "gis-research",
  "economic-studies",
  "academic-research",
  "geomarketing",
  "defence-security",
  "environmental-research",
  "critical-minerals",
];

const META: Record<IndustryId, { name: string; shortName: string; imageSrc: string }> = {
  "residential-real-estate": {
    name: "Residential Real Estate",
    shortName: "Residential Real Estate",
    imageSrc: "/use-cases/residentila.png",
  },
  "commercial-real-estate": {
    name: "CRE",
    shortName: "CRE",
    imageSrc: "/use-cases/comercial.png",
  },
  "disaster-response": {
    name: "Disaster Response",
    shortName: "Disaster Response",
    imageSrc: "/use-cases/env.png",
  },
  "logistics-optimization": {
    name: "Logistics Optimization",
    shortName: "Logistics Optimization",
    imageSrc: "/use-cases/logistics.png",
  },
  "urban-infrastructure": {
    name: "Urban Infrastructure",
    shortName: "Urban Infrastructure",
    imageSrc: "/use-cases/planning.png",
  },
  "gis-research": {
    name: "GIS Research",
    shortName: "GIS Research",
    imageSrc: "/use-cases/comercial.png",
  },
  "economic-studies": {
    name: "Economic Studies",
    shortName: "Economic Studies",
    imageSrc: "/use-cases/geomarketing.png",
  },
  "academic-research": {
    name: "Academic Research",
    shortName: "Academic Research",
    imageSrc: "/use-cases/research.png",
  },
  "geomarketing": {
    name: "Geomarketing",
    shortName: "Geomarketing",
    imageSrc: "/use-cases/geomarketing.png",
  },
  "defence-security": {
    name: "Defence & Security",
    shortName: "Defence & Security",
    imageSrc: "/use-cases/security.png",
  },
  "environmental-research": {
    name: "Environmental Research",
    shortName: "Environmental Research",
    imageSrc: "/use-cases/env.png",
  },
  "critical-minerals": {
    name: "Critical Minerals",
    shortName: "Critical Minerals",
    imageSrc: "/use-cases/tourism.png",
  },
};

// ── Urban Planning content (lifted from existing four components verbatim) ──

const URBAN_CHAT: ChatRowContent = {
  leftRail: {
    title: "Urban Planning & Infrastructure",
    description:
      "Enabling faster site-selection for Residential and CRE customers, including:",
    bullets: ["Franchises", "Consultants", "CRE", "Residential Developers", "Wholesale brokers"],
  },
  query: "Where should the Transportation authority install a new road-signal for traffic?",
  considering: [
    "Considering demographics of Miami",
    "Considering lot prices",
    "Considering trade area competition",
    "Considering your customer target",
  ],
  responseHtml:
    'These areas <span class="text-red-700">marked,</span> have streets that often have had crashes. There is poor road signal trafficking. Consumer’s have expressed disastisfaction with this section.',
  followUp:
    "/ Would you like to order a specific dataset and survey? Our partner agents will be dispatched for the study.",
  mapImageSrc: "/HK Map-2.png",
};

const URBAN_SUPER_MODEL: SuperModelRowContent = {
  leftRail: {
    title: "Generative surveying",
    description:
      'Columbus has brought accurate GenAI to GeoData, dynamically creating new layers of geospatial information using our UGM.\n\n"Smart Layers" can be used to create creative data layers that would otherwise be time-intesive or expensive to obtain.\n\nSmart layers can also be used when data is unavaialble or hard to survey.',
    ctaLabel: "See live Smart Layers",
    ctaHref: "#smart-layers",
  },
  mapImageSrc: "/use-cases/havana.png",
  mapQuery:
    "I need a data layer of buildings in Havana by safety score. In the perspective of: City Planning",
};

const URBAN_AGENT_RESEARCH: AgentResearchRowContent = {
  leftRail: {
    title: "Research",
    description:
      "Spin up complete due-diligence reports from a single prompt. What used to take a research team weeks now takes minutes — automated audits, regulatory checks, and full geospatial reports.",
    ctaLabel: "Browse report templates",
    ctaHref: "#templates",
  },
  templates: [
    {
      title: "General Report",
      description: "A general review of the parcel, considering key variables in construction",
    },
    {
      title: "Geotech/soils report",
      description: "Report for bearing capacity, groundwater, rock, slope stability",
    },
    {
      title: "General Geological study",
      description: "Wetlands/flood, stormwater, heritage/trees and other constraints",
    },
  ],
  advancedTemplateTitle: "Advanced Geological study",
  reportTitle: "Greenfield Minnesota Copper Porphyrrs",
  reportBody:
    "A discrete subsurface density anomaly located in central Kansas has been identified as a high-priority exploration target for copper and associated sulfide mineralization. The target exhibits elevated rock density values relative to surrounding formations and aligns with regional structural features interpreted as potential pathways for mineralizing fluids.",
  reportMapSrc: "/use-cases/gmap.png",
  inputPlaceholder: "Input a list of parcels (parcel ID, address, coordinates)",
};

const URBAN_DATA_CATALOGUE: DataCatalogueRowContent = {
  leftRail: {
    title: "Smart Layers for planners",
    description:
      "Every layer your team needs, priced per point of interest and ready to drop into your existing tools. Vetted, high-fidelity, and smart datasets for your most critical decisions.",
    ctaLabel: "Learn about our data",
    ctaHref: "#data",
  },
  tabs: [
    "My Data",
    "Suggested",
    "All",
    "Base Maps",
    "Overlays",
    "Packs",
    "Environmental",
    "Infrastructure",
    "Smart Layers",
  ],
  activeTab: "Smart Layers",
  cards: [
    {
      title: "Future Appreciation Zones",
      rows: "55,010 rows",
      description:
        "Predicts 2–5 year property value growth using migration, job forecasts, and permit trends.",
      imageSrc: "/use-cases/layer1.png",
    },
    {
      title: "Future Turnover Hotspots",
      rows: "40,206 rows",
      description:
        "Predicts high-flip areas (DOM <20 days) from sales velocity, investor inflows, and economic cycles.",
      imageSrc: "/use-cases/layer2.png",
    },
    {
      title: "Future Displacement Risk Overlay",
      rows: "33,520 rows",
      description:
        "Flags areas at risk of resident displacement from rising costs, affordable housing site selection.",
      imageSrc: "/use-cases/layer3.png",
    },
  ],
};

// ── Lorem ipsum factory for the eleven non-default industries ───────────────

const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
const LOREM_MED =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_LONG =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

function loremRow(industryName: string): {
  chat: ChatRowContent;
  superModel: SuperModelRowContent;
  agentResearch: AgentResearchRowContent;
  dataCatalogue: DataCatalogueRowContent;
} {
  return {
    chat: {
      leftRail: {
        title: `${industryName} chat scenario`,
        description: `${LOREM_MED}\n\nThis row will house the Conversational map chat for ${industryName} once authored.`,
        bullets: ["Lorem", "Ipsum", "Dolor sit amet", "Consectetur"],
      },
      query: `Lorem ipsum query for ${industryName}? Dolor sit amet consectetur.`,
      considering: [
        "Considering lorem ipsum",
        "Considering dolor sit amet",
        "Considering consectetur",
        "Considering adipiscing elit",
      ],
      responseHtml: `Lorem ipsum dolor sit amet, <span class="text-red-700">consectetur</span> adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      followUp: "/ Lorem ipsum dolor sit amet? Consectetur adipiscing elit sed do.",
      mapImageSrc: "/HK Map-2.png",
    },
    superModel: {
      leftRail: {
        title: `${industryName} surveying`,
        description: `${LOREM_LONG}\n\n${LOREM_SHORT}`,
        ctaLabel: "See live Smart Layers",
        ctaHref: "#smart-layers",
      },
      mapImageSrc: "/use-cases/havana.png",
      mapQuery: `Lorem ipsum dolor sit amet for ${industryName}. In the perspective of: Lorem Ipsum`,
    },
    agentResearch: {
      leftRail: {
        title: `${industryName} research`,
        description: `${LOREM_MED}\n\n${LOREM_SHORT}`,
        ctaLabel: "Browse report templates",
        ctaHref: "#templates",
      },
      templates: [
        { title: "Lorem Report", description: LOREM_SHORT },
        { title: "Ipsum / soils report", description: LOREM_SHORT },
        { title: "Dolor study", description: LOREM_SHORT },
      ],
      advancedTemplateTitle: "Advanced lorem study",
      reportTitle: `Lorem ipsum ${industryName} report`,
      reportBody: LOREM_LONG,
      reportMapSrc: "/use-cases/gmap.png",
      inputPlaceholder: "Input lorem ipsum (id, address, coordinates)",
    },
    dataCatalogue: {
      leftRail: {
        title: `${industryName} data`,
        description: `${LOREM_MED}\n\n${LOREM_SHORT}`,
        ctaLabel: "Learn about our data",
        ctaHref: "#data",
      },
      tabs: [
        "My Data",
        "Suggested",
        "All",
        "Base Maps",
        "Overlays",
        "Packs",
        "Environmental",
        "Infrastructure",
        "Smart Layers",
      ],
      activeTab: "Smart Layers",
      cards: [
        {
          title: `Lorem ${industryName} layer A`,
          rows: "0 rows",
          description: LOREM_SHORT,
          imageSrc: "/use-cases/layer1.png",
        },
        {
          title: `Ipsum ${industryName} layer B`,
          rows: "0 rows",
          description: LOREM_SHORT,
          imageSrc: "/use-cases/layer2.png",
        },
        {
          title: `Dolor ${industryName} layer C`,
          rows: "0 rows",
          description: LOREM_SHORT,
          imageSrc: "/use-cases/layer3.png",
        },
      ],
    },
  };
}

function buildIndustry(id: IndustryId, useExisting: boolean): IndustryContent {
  const meta = META[id];
  if (useExisting) {
    return {
      id,
      name: meta.name,
      shortName: meta.shortName,
      imageSrc: meta.imageSrc,
      chat: URBAN_CHAT,
      superModel: URBAN_SUPER_MODEL,
      agentResearch: URBAN_AGENT_RESEARCH,
      dataCatalogue: URBAN_DATA_CATALOGUE,
    };
  }
  const lorem = loremRow(meta.name);
  return {
    id,
    name: meta.name,
    shortName: meta.shortName,
    imageSrc: meta.imageSrc,
    ...lorem,
  };
}

export const INDUSTRY_CONTENT: Record<IndustryId, IndustryContent> = {
  "residential-real-estate": buildIndustry("residential-real-estate", false),
  "commercial-real-estate": buildIndustry("commercial-real-estate", false),
  "disaster-response": buildIndustry("disaster-response", false),
  "logistics-optimization": buildIndustry("logistics-optimization", false),
  "urban-infrastructure": buildIndustry("urban-infrastructure", true),
  "gis-research": buildIndustry("gis-research", false),
  "economic-studies": buildIndustry("economic-studies", false),
  "academic-research": buildIndustry("academic-research", false),
  "geomarketing": buildIndustry("geomarketing", false),
  "defence-security": buildIndustry("defence-security", false),
  "environmental-research": buildIndustry("environmental-research", false),
  "critical-minerals": buildIndustry("critical-minerals", false),
};
