/**
 * Blog post content and metadata. Single source of truth for /blog and /blog/[slug].
 */

import type { StaticImageData } from "next/image";

// Cover images are static-imported (not string paths) so next/image emits a
// real low-res `blurDataURL` for instant blur-up, then swaps to the full-res
// AVIF the optimizer serves. See MEDIA_LOADING_PLAYBOOK.md.
import engineeringCover from "@/public/Blogs/EngineeringCover.png";
import firePredictionBlog from "@/public/Blogs/firePredictionBlog.png";
import mapsgptBlog from "@/public/Blogs/mapsgptBlog.png";
import chooseCitiesBlog from "@/public/Blogs/chooseCitiesBlog.png";
import madridBlog from "@/public/Blogs/madridBlog.png";
import europeGuideBlog from "@/public/Blogs/europeGuideBlog.png";
import spainGuideBlog from "@/public/Blogs/spainGuideBlog.png";
import funResearchBlog from "@/public/Blogs/funResearchBlog.png";
import preOrdersBlog from "@/public/Blogs/preOrdersBlog.png";
import siteSelectionBlog from "@/public/Blogs/siteSelectionBlog.png";
import elioV2Blog from "@/public/Blogs/elioV2Blog.png";
import joinUs from "@/public/Blogs/joinUs.png";

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
  /** Optional hero image (static import) shown at the top of the article. */
  image?: StaticImageData;
  category: BlogCategory;
  /** Playful "For …" audience tag shown as the label on article cards
      (the notch on the blog index + the related-posts cards). `category`
      still drives filtering — this is display-only personality. */
  audience: string;
};

export function blogHref(slug: string): string {
  return `/blog/${slug}`;
}

export const BLOG_SLUG = {
  philosophyUniversalLgm: "philosophy-universal-lgm",
  definitionsLgm: "definitions-lgm",
  whyLlmsDidntCutIt: "why-llms-didnt-cut-it",
  earthRecipesWorldThink: "earth-recipes-world-think",
  mimickingAdultBrain: "mimicking-adult-brain",
  lgmVsLlmVision: "lgm-vs-llm-vision",
  mappingUnknownGenLayers: "mapping-unknown-gen-layers",
  turningDormantDataUsable: "turning-dormant-data-usable",
  lgmTimeline: "lgm-timeline",
  whyBuildingLgm: "why-building-lgm",
  firePredictonModel: "fire-prediction-model",
  mapsgptBuildingUseful: "elio-building-useful",
  elioChooseCities: "elio-choose-cities",
  elioMadridGuide: "elio-madrid-guide",
  elioEuropeGuide: "elio-europe-guide",
  elioSpainGuide: "elio-spain-guide",
  elioFunResearch: "elio-fun-research",
  announcingColumbusProPreOrders: "announcing-columbus-pro-pre-orders",
  fasterSiteSelectionColumbus: "faster-site-selection-columbus",
  elioV2NewFeatures: "elio-v2-new-features",
  joinUsResearchOpportunities: "join-us-research-opportunities",
  /* ── Aliases for legacy keys referenced by /research page CTAs
        (TechnologySections + content.ts). The original keys were renamed
        when blog-posts.ts was reorganised; rather than chase down every
        call site, these aliases point each legacy name at its closest
        living article so the CTAs resolve to a real `/blog/<slug>` URL
        instead of `/blog/undefined`. Pick the nearest topical match;
        update later as new articles ship. */
  earthRecipes: "earth-recipes-world-think",                  // → earthRecipesWorldThink
  erickFirePrediction: "fire-prediction-model",               // → firePredictonModel
  mapsgptV25Architecture: "elio-building-useful",          // closest mapsgpt article
  mapsgptConsumerProduct: "elio-building-useful",          // closest mapsgpt article
  llmsGeospatialQueries: "why-llms-didnt-cut-it",             // closest LLM-vs-geo article
  generativeGeospatialLayers: "mapping-unknown-gen-layers",   // closest gen-layers article
  foundingLgmsInDepth: "philosophy-universal-lgm",            // closest LGM-foundation article
  timelineGeneralistLgm: "lgm-timeline",                      // → lgmTimeline
  ugmRoadmapGamePlan: "why-building-lgm",                     // closest "why/roadmap" article
  deepSpatialReasoningScale: "mapping-unknown-gen-layers",    // closest spatial-reasoning article
} as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: BLOG_SLUG.philosophyUniversalLgm,
    title: "Philosophy of a Universal LGM",
    date: "Apr 2026",
    publishedAt: "2026-04-01",
    image: engineeringCover,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "The core principles behind building a Universal Large Geospatial Model — why the physical world needs a dedicated spatial intelligence layer and what sets the LGM apart from general-purpose AI.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.definitionsLgm,
    title: "Definitions of a Large Geospatial Model",
    date: "Apr 2026",
    publishedAt: "2026-04-02",
    image: engineeringCover,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "A precise definition of what a Large Geospatial Model is, how it differs from LLMs and computer vision models, and the key capabilities that make it purpose-built for the physical world.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.whyLlmsDidntCutIt,
    title: "Why LLMs didn't cut it.",
    date: "Apr 2026",
    publishedAt: "2026-04-03",
    image: engineeringCover,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "An analysis of why Large Language Models fall short for geospatial reasoning, and the architectural differences that led Columbus Earth to build a dedicated Large Geospatial Model.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.earthRecipesWorldThink,
    title: "Earth Recipes: How a world would think",
    date: "Apr 2026",
    publishedAt: "2026-04-04",
    image: engineeringCover,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "A conceptual framework for how a geospatial AI processes and reasons about the world — the design patterns that translate raw earth data into actionable spatial intelligence.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.mimickingAdultBrain,
    title: "Mimicking an adult brain",
    date: "Apr 2026",
    publishedAt: "2026-04-05",
    image: engineeringCover,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "How Columbus Earth's Large Geospatial Model draws on principles of mature spatial cognition to build AI that reasons about the physical world like an experienced human would.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.lgmVsLlmVision,
    title: "LGM vs LLM Vision: Drawbacks and innovations",
    date: "Apr 2026",
    publishedAt: "2026-04-06",
    image: engineeringCover,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "A direct comparison of the Large Geospatial Model versus LLM vision systems for spatial tasks — where vision models fall short and where the LGM innovates.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.mappingUnknownGenLayers,
    title: "Mapping the unknown: Generative Geospatial layers",
    date: "Apr 2026",
    publishedAt: "2026-04-07",
    image: engineeringCover,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "How Columbus Earth's LGM generates new geospatial layers from incomplete data, turning fragmented earth observations into structured, actionable spatial knowledge.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.turningDormantDataUsable,
    title: "Turning Dormant data usable",
    date: "Apr 2026",
    publishedAt: "2026-04-08",
    image: engineeringCover,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "The challenge of activating the world's vast stores of unused geospatial data — how Columbus Earth ingests, normalizes, and reasons over satellite imagery, temporal patterns, and private datasets.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.lgmTimeline,
    title: "Large Geospatial Model: Our timeline.",
    date: "Apr 2026",
    publishedAt: "2026-04-09",
    image: engineeringCover,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "Columbus Earth's development roadmap for the Large Geospatial Model — from data collection and model training through to production deployment as a thinking earth.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.whyBuildingLgm,
    title: "Why we're building an LGM.",
    date: "Apr 2026",
    publishedAt: "2026-04-10",
    image: engineeringCover,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "The founding motivation behind Columbus Earth: why the world needs a dedicated Large Geospatial Model and what becomes possible when AI truly understands the physical world.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.firePredictonModel,
    title: "Research Demonstration: Fire Prediction Model",
    date: "Apr 2026",
    publishedAt: "2026-04-11",
    image: firePredictionBlog,
    category: "ENGINEERING",
    audience: "For engineers",
    description:
      "A research demonstration of the Columbus Earth Large Geospatial Model applied to fire prediction — using geospatial AI to forecast fire risk and behavior at scale.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.mapsgptBuildingUseful,
    title: "Elio: Building a useful mapping AI",
    date: "Apr 2026",
    publishedAt: "2026-04-01",
    image: mapsgptBlog,
    category: "PRODUCT",
    audience: "For builders",
    description:
      "How Columbus Earth built Elio — a mapping AI that returns actual maps and geographic reasoning, not just text. The design decisions behind making AI genuinely useful for location questions.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioChooseCities,
    title: "How to choose cities within to live in: by Elio",
    date: "Apr 2026",
    publishedAt: "2026-04-02",
    image: chooseCitiesBlog,
    category: "PRODUCT",
    audience: "For travelers",
    description:
      "Elio's approach to helping you choose a city to live in — weighing neighborhoods, walkability, culture, and quality of life through geospatial intelligence.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioMadridGuide,
    title: "A guide to Madrid: Written by Elio",
    date: "Apr 2026",
    publishedAt: "2026-04-03",
    image: madridBlog,
    category: "PRODUCT",
    audience: "For travelers",
    description:
      "Elio's AI-generated guide to Madrid — neighborhoods, hidden spots, local culture, and travel tips curated through spatial intelligence.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioEuropeGuide,
    title: "A guide to Europe: Cheap but unique cities",
    date: "Apr 2026",
    publishedAt: "2026-04-04",
    image: europeGuideBlog,
    category: "PRODUCT",
    audience: "For travelers",
    description:
      "Elio's guide to Europe's most affordable yet distinctive cities — off-the-beaten-path destinations selected through geospatial analysis of cost, culture, and character.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioSpainGuide,
    title: "A guide to Spain: Written by Elio",
    date: "Apr 2026",
    publishedAt: "2026-04-05",
    image: spainGuideBlog,
    category: "PRODUCT",
    audience: "For travelers",
    description:
      "Elio's AI-powered guide to Spain — regions, cities, and experiences recommended through geospatial intelligence for travelers and city-curious explorers.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioFunResearch,
    title: "Using Elio for fun research",
    date: "Apr 2026",
    publishedAt: "2026-04-06",
    image: funResearchBlog,
    category: "PRODUCT",
    audience: "For travelers",
    description:
      "How to use Elio's geospatial AI for personal research — exploring data about cities, neighborhoods, and destinations in ways that go beyond standard travel guides.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.announcingColumbusProPreOrders,
    title: "Announcing Columbus Pro pre-orders",
    date: "Apr 2026",
    publishedAt: "2026-04-07",
    image: preOrdersBlog,
    category: "PRODUCT",
    audience: "For builders",
    description:
      "Columbus Earth opens pre-orders for Columbus Pro — the agentic GIS platform built for site selection, due diligence, and location research.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.fasterSiteSelectionColumbus,
    title: "Faster Site Selection with Columbus",
    date: "Apr 2026",
    publishedAt: "2026-04-08",
    image: siteSelectionBlog,
    category: "PRODUCT",
    audience: "For builders",
    description:
      "How Columbus Pro accelerates site selection for real estate and business expansion — replacing weeks of manual GIS work with conversational spatial intelligence.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioV2NewFeatures,
    title: "Elio: V2 new features",
    date: "Apr 2026",
    publishedAt: "2026-04-01",
    image: elioV2Blog,
    category: "COMPANY NEWS",
    audience: "For travelers",
    description:
      "A look at what's new in Elio V2 — the latest updates to Columbus Earth's social super map, bringing new features for city exploration and travel discovery.",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.joinUsResearchOpportunities,
    title: "Join us! Research opportunities for the rebellious",
    date: "Apr 2026",
    publishedAt: "2026-04-02",
    image: joinUs,
    category: "COMPANY NEWS",
    audience: "For the interested",
    description:
      "Columbus Earth is hiring — open research opportunities for those who want to build the Large Geospatial Model and help shape the future of geospatial AI.",
    paragraphs: ["lorem"],
  },
];

const bySlug = new Map(BLOG_POSTS.map((p) => [p.slug, p]));

export function getBlogPost(slug: string): BlogPost | undefined {
  return bySlug.get(slug);
}

/**
 * Accent color used for the audience-label notch on each blog card. Picked
 * from the dominant hue of the post's hero image (see scripts/extract-blog-colors.mjs)
 * and rendered at a fixed dark lightness so contrast against the white notch
 * passes WCAG AA (≥ 4.5:1). Fallback is the global accent.
 *
 * Keyed by slug (not image path) because cover images are now static imports —
 * `post.image` is a StaticImageData whose `.src` is a hashed
 * `/_next/static/media/...` URL, so a path-keyed lookup can't match. Slug is
 * stable. The 10 EngineeringCover articles all share the navy override below.
 */
const BLOG_ACCENT_COLORS: Record<string, string> = {
  // EngineeringCover.png is a near-neutral cream backdrop with a navy
  // Columbus brand mark + faint world-map line art. The extractor picked
  // up #8A6628 (warm paper-grain noise) because the cream falls below
  // the saturation threshold and the navy brand mark covers too few
  // pixels to win the hue vote. Overridden manually to navy so the
  // label matches the brand mark — same colour joinUs.png naturally
  // resolved to. All EngineeringCover articles share this navy.
  [BLOG_SLUG.philosophyUniversalLgm]: "#283A8A",
  [BLOG_SLUG.definitionsLgm]: "#283A8A",
  [BLOG_SLUG.whyLlmsDidntCutIt]: "#283A8A",
  [BLOG_SLUG.earthRecipesWorldThink]: "#283A8A",
  [BLOG_SLUG.mimickingAdultBrain]: "#283A8A",
  [BLOG_SLUG.lgmVsLlmVision]: "#283A8A",
  [BLOG_SLUG.mappingUnknownGenLayers]: "#283A8A",
  [BLOG_SLUG.turningDormantDataUsable]: "#283A8A",
  [BLOG_SLUG.lgmTimeline]: "#283A8A",
  [BLOG_SLUG.whyBuildingLgm]: "#283A8A",
  [BLOG_SLUG.firePredictonModel]: "#1D4F95",
  [BLOG_SLUG.mapsgptBuildingUseful]: "#16579C",
  [BLOG_SLUG.elioChooseCities]: "#16689C",
  [BLOG_SLUG.elioMadridGuide]: "#165D9C",
  [BLOG_SLUG.elioEuropeGuide]: "#28548A",
  [BLOG_SLUG.elioSpainGuide]: "#225E91",
  [BLOG_SLUG.elioFunResearch]: "#28608A",
  [BLOG_SLUG.announcingColumbusProPreOrders]: "#16679C",
  [BLOG_SLUG.fasterSiteSelectionColumbus]: "#16609C",
  [BLOG_SLUG.elioV2NewFeatures]: "#16579C",
  [BLOG_SLUG.joinUsResearchOpportunities]: "#283A8A",
};

export function getBlogAccentColor(post: BlogPost): string | undefined {
  return BLOG_ACCENT_COLORS[post.slug];
}

export function getAllBlogPostsSorted(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
