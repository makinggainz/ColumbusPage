import { blogHref, BLOG_SLUG } from "@/lib/blog-posts";

import type {
  NavItem,
  ResearchArticle,
  ResearchCard,
  TechnologySectionId,
  TimelineEntry,
} from "./types";

export const TECHNOLOGY_NAV_ITEMS: NavItem[] = [
  { id: "index", label: "What's an LGM" },
  { id: "lgm-vs-llm", label: "Timeline" },
  { id: "core-reasoning", label: "Development" },
  { id: "data-collection", label: "A New Category" },
  { id: "research-blog", label: "Research Blog" },
  { id: "careers", label: "Careers & inquiry" },
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
    title: "Philosophy behind a Universal Geospatial Model",
    href: blogHref(BLOG_SLUG.philosophyUniversalLgm),
  },
  {
    title: "Mimicking the adult brain.",
    href: blogHref(BLOG_SLUG.mimickingAdultBrain),
  },
  {
    title: "Earth recipes.",
    href: blogHref(BLOG_SLUG.earthRecipes),
  },
  {
    title: "Research: creating a fire prediction model.",
    href: blogHref(BLOG_SLUG.erickFirePrediction),
  },
];

export const RESEARCH_ARTICLES: ResearchArticle[] = [
  {
    title: "MapsGPT Version 2.5. Architecture improvements.",
    href: blogHref(BLOG_SLUG.mapsgptV25Architecture),
    date: "Apr 2026",
  },
  {
    title: "Research Paper -- Erick fire prediction",
    href: blogHref(BLOG_SLUG.erickFirePrediction),
    date: "Mar 2026",
  },
  {
    title: "MapsGPT. Building a consumer product",
    href: blogHref(BLOG_SLUG.mapsgptConsumerProduct),
    date: "Feb 2026",
  },
  {
    title: "Why LLMs dont cut it. Issues in LLM architecture for Geosaptial queries.",
    href: blogHref(BLOG_SLUG.llmsGeospatialQueries),
    date: "Jan 2026",
  },
  {
    title: "A paper on Generative geospatial layers.",
    href: blogHref(BLOG_SLUG.generativeGeospatialLayers),
    date: "Dec 2025",
  },
];

export const HERO_SCROLL_INDEX_ITEMS = [
  { label: "What's an LGM", sectionIds: ["index"] },
  { label: "Timeline", sectionIds: ["lgm-vs-llm"] },
  { label: "Development", sectionIds: ["core-reasoning"] },
  { label: "A New Category", sectionIds: ["data-collection"] },
  { label: "Research Blog", sectionIds: ["research-blog"] },
  { label: "Careers & inquiry", sectionIds: ["careers"] },
];
