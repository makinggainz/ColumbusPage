import type {
  GeoOverlayItem,
  NavItem,
  ResearchCard,
  TechnologySectionId,
} from "./types";

export const TECHNOLOGY_NAV_ITEMS: NavItem[] = [
  { id: "index", label: "Index" },
  { id: "lgm-vs-llm", label: "An LGM vs LLM" },
  { id: "data-collection", label: "Data Collection" },
  { id: "core-reasoning", label: "Core Reasoning" },
  { id: "research-blog", label: "Research Blog" },
  { id: "careers", label: "Careers" },
];

export const OBSERVED_SECTION_IDS: TechnologySectionId[] = [
  "index",
  "lgm-vs-llm",
  "data-collection",
  "fusing",
  "grid-intro",
  "core-reasoning",
  "genlayers",
  "research-blog",
  "dynamic-layers",
  "careers",
  "hiring-humans",
];

export const SECTION_TO_NAV_ID: Record<TechnologySectionId, TechnologySectionId> = {
  index: "index",
  "lgm-vs-llm": "lgm-vs-llm",
  "data-collection": "data-collection",
  fusing: "data-collection",
  "grid-intro": "data-collection",
  "core-reasoning": "core-reasoning",
  genlayers: "core-reasoning",
  "research-blog": "research-blog",
  "dynamic-layers": "research-blog",
  careers: "careers",
  "hiring-humans": "careers",
};

export const SIDEBAR_HIDDEN_ON = new Set<TechnologySectionId>([
  "genlayers",
  "dynamic-layers",
  "hiring-humans",
]);

export const LLM_TOKEN_LINES = [
  "A large language model is trained on",
  "huge sets of text data for tokenization",
  "280, 1170, 296, 4088, 30773, 4012, 5079",
  "2534, 3883, 263, 29072, 268, 64696",
];

export const LGM_COLUMNS = [
  {
    title: "Data-specific LGM & Vision GM",
    lines: [
      "Comprehending images and",
      "predicting certain things like size",
      "from Earth imagery and context.",
    ],
    footer: "Reverse Diffusion",
  },
  {
    title: "Generalist LGM",
    lines: [
      "Big data pre-trained",
      "Large Geospatial Model",
      "requiring fine-tuned labeling",
      "for each Earth topic.",
    ],
    footer: "",
  },
];

export const FUSING_STEPS = [
  "Structure normalization",
  "Fixing broken data",
  "Fixing geocoding",
  "Spatially pairing unformatted data",
  "Labeling",
];

export const RESEARCH_CARDS: ResearchCard[] = [
  {
    featured: true,
    title: "Philosophy behind a Universal Geospatial Model",
    href: "#",
  },
  {
    title: "MapsGPT Version 2.5. Architecture improvements.",
    href: "#",
  },
  {
    title: "Mimicking the adult brain.",
    href: "#",
  },
  {
    title: "Earth recipes.",
    href: "#",
  },
  {
    title: "Research, creating a fire prediction model.",
    href: "#",
  },
];

export const GENLAYERS_OVERLAYS: GeoOverlayItem[] = [
  {
    id: "forest",
    title: "forest",
    items: [
      "Tree Count",
      "Tree Species",
      "Topographical elevation",
      "Soil type",
      "Average rainfall",
      "Average tree heights",
      "Average tree age",
      "Wildfire risk score",
    ],
  },
  {
    id: "coast",
    title: "coast",
    items: [
      "Tree Count",
      "Advanced measurements",
      "Topographical elevation",
      "Sand type",
    ],
  },
];

export const HERO_SCROLL_INDEX_ITEMS = [
  { label: "Why an LGM", sectionIds: ["index"] },
  { label: "An LGM vs LLM", sectionIds: ["lgm-vs-llm"] },
  { label: "Timeline", sectionIds: ["data-collection", "fusing", "grid-intro"] },
  { label: "Results of an LGM", sectionIds: ["core-reasoning", "genlayers"] },
  { label: "A New Category", sectionIds: ["dynamic-layers"] },
  { label: "Research Blog", sectionIds: ["research-blog"] },
  { label: "Careers & inquiry", sectionIds: ["careers", "hiring-humans"] },
];

export const DYNAMIC_LAYER_CAPTIONS = [
  "Solar roof possibility",
  "Resident vibes",
  "Safety score",
];
