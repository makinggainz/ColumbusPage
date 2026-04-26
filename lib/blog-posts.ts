/**
 * Blog post content and metadata. Single source of truth for /blog and /blog/[slug].
 */

export const BLOG_CATEGORIES = ["PRODUCT", "ENGINEERING", "COMPANY NEWS"] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  /** ISO 8601 date for stable sort (display uses `date`). */
  publishedAt: string;
  description: string;
  paragraphs: string[];
  /** Optional hero image path shown at the top of the article. */
  image?: string;
  category: BlogCategory;
};

export function blogHref(slug: string): string {
  return `/blog/${slug}`;
}

export const BLOG_SLUG = {
  earthRecipes: "earth-recipes",
  philosophyUniversalLgm: "philosophy-universal-lgm",
  mimickingAdultBrain: "mimicking-adult-brain",
  mapsgptV25Architecture: "mapsgpt-v2-5-architecture",
  erickFirePrediction: "erick-fire-prediction",
  mapsgptConsumerProduct: "mapsgpt-consumer-product",
  llmsGeospatialQueries: "llms-geospatial-queries",
  generativeGeospatialLayers: "generative-geospatial-layers",
  foundingLgmsInDepth: "founding-lgms-in-depth",
  lgmVsLlmVision: "lgm-vs-llm-vision",
  ugmRoadmapGamePlan: "ugm-roadmap-game-plan",
  timelineGeneralistLgm: "timeline-generalist-lgm",
  mappingUnknownGenLayers: "mapping-unknown-gen-layers",
  deepSpatialReasoningScale: "deep-spatial-reasoning-scale",
} as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: BLOG_SLUG.earthRecipes,
    title: "Earth recipes",
    date: "Apr 2026",
    publishedAt: "2026-04-01",
    image: "/TechnologyPageImages/unkown-layers.jpeg",
    category: "ENGINEERING",
    description: "How we compose geospatial signals into trainable recipes for the LGM.",
    paragraphs: [
      "Training a Large Geospatial Model is less like scraping the web and more like composing ingredients: satellite passes, street-level captures, administrative boundaries, and human activity layers must be normalized, aligned in space and time, and weighted so the model learns stable physical priors.",
      "We call the resulting pipelines earth recipes: repeatable fusion steps that preserve ground truth while scaling across regions. This note outlines the principles we use when designing them and why they matter for downstream reasoning quality.",
    ],
  },
  {
    slug: BLOG_SLUG.philosophyUniversalLgm,
    title: "Philosophy behind a Universal Geospatial Model",
    date: "Mar 2026",
    publishedAt: "2026-03-01",
    image: "/TechnologyPageImages/multieWaveEminations.jpeg",
    category: "COMPANY NEWS",
    description: "Why we believe maps are the path toward a universal model of the planet.",
    paragraphs: [
      "A Universal Geospatial Model is not a single dataset; it is a commitment to represent the world as it is observed, updated, and questioned. Our philosophy centers on verifiable coordinates, temporal consistency, and interfaces that let analysts and software ask the same questions in the same language.",
      "This article expands on the motivations behind our research program and how we prioritize reality over synthetic shortcuts.",
    ],
  },
  {
    slug: BLOG_SLUG.mimickingAdultBrain,
    title: "Mimicking the adult brain",
    date: "Feb 2026",
    publishedAt: "2026-02-01",
    image: "/TechnologyPageImages/deep-layers.jpeg",
    category: "ENGINEERING",
    description: "Analogies between spatial cognition and model architecture choices.",
    paragraphs: [
      "Human spatial reasoning blends episodic memory, hierarchical maps, and continuous refinement as new evidence arrives. Our architecture borrows metaphors—not literal neuroscience—from these processes to structure attention, memory, and retrieval for geospatial tasks.",
      "We share what has worked in practice and where the analogy breaks down when scaling to planetary data volumes.",
    ],
  },
  {
    slug: BLOG_SLUG.mapsgptV25Architecture,
    title: "MapsGPT Version 2.5: architecture improvements",
    date: "Apr 2026",
    publishedAt: "2026-04-08",
    category: "PRODUCT",
    description: "Release notes focused on reliability, latency, and map fidelity.",
    paragraphs: [
      "MapsGPT 2.5 tightens the path from natural language intent to rendered map products. We improved caching for tile-heavy previews, hardened coordinate parsing, and refined how the model proposes layers when the user is underspecified.",
      "This post is a technical companion to the release for teams integrating MapsGPT into their workflows.",
    ],
  },
  {
    slug: BLOG_SLUG.erickFirePrediction,
    title: "Research paper: Erick fire prediction",
    date: "Mar 2026",
    publishedAt: "2026-03-15",
    image: "/TechnologyPageImages/techpg-radiance.png",
    category: "ENGINEERING",
    description: "Building a fire-risk signal from heterogeneous environmental inputs.",
    paragraphs: [
      "This research thread documents how we combined fuel moisture proxies, terrain, weather windows, and historical ignition points into a model that surfaces early warnings without overfitting to a single geography.",
      "We include lessons learned on evaluation metrics that respect imbalanced rare events.",
    ],
  },
  {
    slug: BLOG_SLUG.mapsgptConsumerProduct,
    title: "MapsGPT: building a consumer product",
    date: "Feb 2026",
    publishedAt: "2026-02-12",
    category: "PRODUCT",
    description: "Product decisions that keep spatial intelligence approachable.",
    paragraphs: [
      "Shipping a consumer geospatial assistant means constraining complexity: sensible defaults for projections, legible legends, and guardrails when users ask for impossible geometry. We walk through the product surface and how it maps to model capabilities.",
    ],
  },
  {
    slug: BLOG_SLUG.llmsGeospatialQueries,
    title: "Why LLMs do not cut it for geospatial queries",
    date: "Jan 2026",
    publishedAt: "2026-01-10",
    category: "ENGINEERING",
    description: "Architectural gaps when text-first models face coordinates and maps.",
    paragraphs: [
      "Large language models excel at language patterns but are not grounded in continuous space by default. Hallucinated coordinates, stale corpora, and ambiguous units are predictable failure modes when users expect map-grade answers.",
      "Here we catalogue the issues we hit in production-like benchmarks and how the LGM stack addresses each one.",
    ],
  },
  {
    slug: BLOG_SLUG.generativeGeospatialLayers,
    title: "Generative geospatial layers",
    date: "Dec 2025",
    publishedAt: "2025-12-01",
    category: "ENGINEERING",
    description: "Notes on learned layers that augment basemaps and feature stores.",
    paragraphs: [
      "Generative layers are not replacements for survey data; they are structured hypotheses that must be validated against ground truth. We describe how we train and blend them with classical GIS layers so downstream agents can reason safely.",
    ],
  },
  {
    slug: BLOG_SLUG.foundingLgmsInDepth,
    title: "Founding large geospatial models: an in-depth primer",
    date: "Nov 2025",
    publishedAt: "2025-11-01",
    category: "COMPANY NEWS",
    description: "From first principles to the Columbus Earth research stack.",
    paragraphs: [
      "This long-form primer introduces the data, fusion, and reasoning pillars that define an LGM at Columbus Earth. It is meant for technical readers who want the narrative behind our public roadmap.",
    ],
  },
  {
    slug: BLOG_SLUG.lgmVsLlmVision,
    title: "Drawbacks of LLMs and vision models—and how the LGM innovates",
    date: "Oct 2025",
    publishedAt: "2025-10-01",
    category: "ENGINEERING",
    description: "A concise comparison across inputs, outputs, and evaluation.",
    paragraphs: [
      "Text and vision backbones brought step-function gains to general AI, but geospatial workloads need stable frames of reference, scale-aware features, and tooling that emits maps—not paragraphs alone.",
      "We contrast failure cases and show where specialized training and data recipes change the outcome.",
    ],
  },
  {
    slug: BLOG_SLUG.ugmRoadmapGamePlan,
    title: "Our game plan toward UGM",
    date: "Sep 2025",
    publishedAt: "2025-09-01",
    category: "COMPANY NEWS",
    description: "Milestones from generalist LGM to a universal geospatial model.",
    paragraphs: [
      "Universal Geospatial Model (UGM) is the horizon: one reasoning stack that can ingest planetary-scale evidence and support enterprise, scientific, and civic use cases. This roadmap highlights dependencies on data coverage, evaluation harnesses, and partner feedback.",
    ],
  },
  {
    slug: BLOG_SLUG.timelineGeneralistLgm,
    title: "Generalist LGM: research paper companion",
    date: "Aug 2025",
    publishedAt: "2025-08-01",
    category: "ENGINEERING",
    description: "Context for the timeline milestone and what shipped in the lab.",
    paragraphs: [
      "As generalist LGM capabilities crossed internal quality bars, we consolidated findings into a paper-style writeup. This companion piece summarizes hypotheses, ablations, and what we deferred to future releases.",
    ],
  },
  {
    slug: BLOG_SLUG.mappingUnknownGenLayers,
    title: "Mapping the unknown with Gen Layers",
    date: "Jul 2025",
    publishedAt: "2025-07-01",
    category: "ENGINEERING",
    description: "Exploration workflows when base coverage is thin or uneven.",
    paragraphs: [
      "Gen Layers help analysts propose intermediate surfaces—hypothetical contours, likely corridors, or candidate regions—when direct observation is sparse. We explain how we keep those proposals auditable and reversible.",
    ],
  },
  {
    slug: BLOG_SLUG.deepSpatialReasoningScale,
    title: "Deep spatial reasoning at scale",
    date: "Jun 2025",
    publishedAt: "2025-06-01",
    category: "ENGINEERING",
    description: "Throughput, tiling, and memory when reasoning spans large extents.",
    paragraphs: [
      "Spatial reasoning at scale is as much an systems problem as a modeling one. We outline how we shard work across tiles, reuse embeddings, and maintain consistent topology at boundaries so answers stay coherent across a continent-sized viewport.",
    ],
  },
];

const bySlug = new Map(BLOG_POSTS.map((p) => [p.slug, p]));

export function getBlogPost(slug: string): BlogPost | undefined {
  return bySlug.get(slug);
}

export function getAllBlogPostsSorted(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
