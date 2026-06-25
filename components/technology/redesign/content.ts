import { blogHref, BLOG_SLUG } from "@/lib/blog-posts";

import type {
  NavItem,
  ResearchArticle,
  ResearchCard,
  TechnologySectionId,
  TimelineEntry,
} from "./types";

export const TECHNOLOGY_NAV_ITEMS: NavItem[] = [
  { id: "foundationmodel", label: "Foundation Model" },
  { id: "timeline", label: "Timeline" },
  { id: "reasoning", label: "Reasoning" },
  { id: "results", label: "Results" },
  { id: "blog", label: "Blog" },
  { id: "inquiries", label: "Inquiries" },
];

export const OBSERVED_SECTION_IDS: TechnologySectionId[] = [
  "foundationmodel",
  "timeline",
  "reasoning",
  "results",
  "blog",
  "inquiries",
  "hiring-humans",
];

export const SECTION_TO_NAV_ID: Record<TechnologySectionId, TechnologySectionId> = {
  foundationmodel: "foundationmodel",
  timeline: "timeline",
  reasoning: "reasoning",
  results: "results",
  blog: "blog",
  inquiries: "inquiries",
  "hiring-humans": "inquiries",
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
    image: "/ResearchPgMedia/multieWaveEminations.jpeg",
  },
  {
    title: "Mimicking the adult brain.",
    href: blogHref(BLOG_SLUG.mimickingAdultBrain),
    image: "/ResearchPgMedia/deep-layers.jpeg",
  },
  {
    title: "Earth recipes.",
    href: blogHref(BLOG_SLUG.earthRecipes),
    image: "/ResearchPgMedia/unkown-layers.jpeg",
  },
  {
    title: "Research: creating a fire prediction model.",
    href: blogHref(BLOG_SLUG.erickFirePrediction),
    image: "/ResearchPgMedia/techpg-radiance.png",
  },
];

export const RESEARCH_ARTICLES: ResearchArticle[] = [
  {
    title: "Elio Version 2.5. Architecture improvements.",
    href: blogHref(BLOG_SLUG.mapsgptV25Architecture),
    date: "Apr 2026",
  },
  {
    title: "Research Paper -- Erick fire prediction",
    href: blogHref(BLOG_SLUG.erickFirePrediction),
    date: "Mar 2026",
  },
  {
    title: "Elio. Building a consumer product",
    href: blogHref(BLOG_SLUG.mapsgptConsumerProduct),
    date: "Feb 2026",
  },
  {
    title: "Why LLMs don't cut it. Issues in LLM architecture for Geospatial queries.",
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
  { label: "Foundation Model", sectionIds: ["foundationmodel"] },
  { label: "Timeline", sectionIds: ["timeline"] },
  { label: "Reasoning", sectionIds: ["reasoning"] },
  { label: "Results", sectionIds: ["results"] },
  { label: "Blog", sectionIds: ["blog"] },
  { label: "Inquiries", sectionIds: ["inquiries"] },
];
