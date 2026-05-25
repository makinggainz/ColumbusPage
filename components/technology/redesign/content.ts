import { blogHref, BLOG_SLUG } from "@/lib/blog-posts";

import type {
  NavItem,
  ResearchArticle,
  ResearchCard,
  TechnologySectionId,
  TimelineEntry,
} from "./types";

export const TECHNOLOGY_NAV_ITEMS: NavItem[] = [
  { id: "index", label: "Foundation Model" },
  { id: "lgm-vs-llm", label: "Timeline" },
  { id: "core-reasoning", label: "Research" },
  { id: "data-collection", label: "Results" },
  { id: "research-blog", label: "Blog" },
  { id: "careers", label: "Inquiries" },
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
    image: "/TechnologyPageImages/multieWaveEminations.jpeg",
  },
  {
    title: "Mimicking the adult brain.",
    href: blogHref(BLOG_SLUG.mimickingAdultBrain),
    image: "/TechnologyPageImages/deep-layers.jpeg",
  },
  {
    title: "Earth recipes.",
    href: blogHref(BLOG_SLUG.earthRecipesWorldThink),
    image: "/TechnologyPageImages/unkown-layers.jpeg",
  },
  {
    title: "Research: creating a fire prediction model.",
    href: blogHref(BLOG_SLUG.firePredictonModel),
    image: "/TechnologyPageImages/techpg-radiance.png",
  },
];

export const RESEARCH_ARTICLES: ResearchArticle[] = [
  {
    title: "MapsGPT Version 2.5. Architecture improvements.",
    href: blogHref(BLOG_SLUG.mapsgptBuildingUseful),
    date: "Apr 2026",
  },
  {
    title: "Research Paper -- Erick fire prediction",
    href: blogHref(BLOG_SLUG.firePredictonModel),
    date: "Mar 2026",
  },
  {
    title: "MapsGPT. Building a consumer product",
    href: blogHref(BLOG_SLUG.mapsgptBuildingUseful),
    date: "Feb 2026",
  },
  {
    title: "Why LLMs dont cut it. Issues in LLM architecture for Geosaptial queries.",
    href: blogHref(BLOG_SLUG.whyLlmsDidntCutIt),
    date: "Jan 2026",
  },
  {
    title: "A paper on Generative geospatial layers.",
    href: blogHref(BLOG_SLUG.mappingUnknownGenLayers),
    date: "Dec 2025",
  },
];

export const HERO_SCROLL_INDEX_ITEMS = [
  { label: "Foundation Model", sectionIds: ["index"] },
  { label: "Timeline", sectionIds: ["lgm-vs-llm"] },
  { label: "Research", sectionIds: ["core-reasoning"] },
  { label: "Results", sectionIds: ["data-collection"] },
  { label: "Blog", sectionIds: ["research-blog"] },
  { label: "Inquiries", sectionIds: ["careers"] },
];
