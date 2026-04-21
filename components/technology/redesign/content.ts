import type {
  NavItem,
  ResearchArticle,
  ResearchCard,
  TechnologySectionId,
  TimelineEntry,
} from "./types";

export const TECHNOLOGY_NAV_ITEMS: NavItem[] = [
  { id: "index", label: "Index" },
  { id: "lgm-vs-llm", label: "Our Research" },
  { id: "core-reasoning", label: "Under the hood" },
  { id: "data-collection", label: "Results" },
  { id: "research-blog", label: "Research Blog" },
  { id: "careers", label: "Careers" },
];

export const OBSERVED_SECTION_IDS: TechnologySectionId[] = [
  "index",
  "lgm-vs-llm",
  "core-reasoning",
  "data-collection",
  "research-blog",
  "careers",
  "hiring-humans",
];

export const SECTION_TO_NAV_ID: Record<TechnologySectionId, TechnologySectionId> = {
  index: "index",
  "lgm-vs-llm": "lgm-vs-llm",
  "core-reasoning": "core-reasoning",
  "data-collection": "data-collection",
  "research-blog": "research-blog",
  careers: "careers",
  "hiring-humans": "careers",
};

export const SIDEBAR_HIDDEN_ON = new Set<TechnologySectionId>([
  "hiring-humans",
]);

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  { name: "Deep Q Networks", year: "2015" },
  { name: "AlphaGo", year: "2016" },
  { name: "AlphaZero", year: "2017" },
  { name: "MuZero", year: "2019" },
  { name: "PaLM", year: "2022" },
  { name: "GPT-4", year: "2023" },
  { name: "Gemini 1", year: "2023" },
];

export const RESEARCH_CARDS: ResearchCard[] = [
  {
    featured: true,
    title: "Philosphy of a Universal LGM",
    href: "#",
  },
  {
    title: "Mimicing a adult brain",
    href: "#",
  },
  {
    title: "Earth recipes",
    href: "#",
  },
];

export const RESEARCH_ARTICLES: ResearchArticle[] = [
  { title: "Research Paper -- Erick fire prediction", href: "#", date: "Mar 2026" },
  { title: "MapsGPT. Building a consumer product", href: "#", date: "Feb 2026" },
  { title: "Why LLMs dont cut it. Issues in LLM architecture for Geosaptial queries.", href: "#", date: "Jan 2026" },
  { title: "A paper on Generative geospatial layers.", href: "#", date: "Dec 2025" },
];

export const HERO_SCROLL_INDEX_ITEMS = [
  { label: "Why an LGM", sectionIds: ["index"] },
  { label: "Our Research", sectionIds: ["lgm-vs-llm"] },
  { label: "Under the hood", sectionIds: ["core-reasoning"] },
  { label: "Results", sectionIds: ["data-collection"] },
  { label: "Research Blog", sectionIds: ["research-blog"] },
  { label: "Careers & inquiry", sectionIds: ["careers", "hiring-humans"] },
];
