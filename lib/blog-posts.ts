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
  mapsgptBuildingUseful: "mapsgpt-building-useful",
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
  mapsgptV25Architecture: "mapsgpt-building-useful",          // closest mapsgpt article
  mapsgptConsumerProduct: "mapsgpt-building-useful",          // closest mapsgpt article
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
    image: "/Blogs/EngineeringCover.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.definitionsLgm,
    title: "Definitions of a Large Geospatial Model",
    date: "Apr 2026",
    publishedAt: "2026-04-02",
    image: "/Blogs/EngineeringCover.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.whyLlmsDidntCutIt,
    title: "Why LLMs didnt cut it.",
    date: "Apr 2026",
    publishedAt: "2026-04-03",
    image: "/Blogs/EngineeringCover.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.earthRecipesWorldThink,
    title: "Earth Recipes: How a world would think",
    date: "Apr 2026",
    publishedAt: "2026-04-04",
    image: "/Blogs/EngineeringCover.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.mimickingAdultBrain,
    title: "Mimicking an adult brain",
    date: "Apr 2026",
    publishedAt: "2026-04-05",
    image: "/Blogs/EngineeringCover.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.lgmVsLlmVision,
    title: "LGM vs LLM Vision: Drawbacks and innovations",
    date: "Apr 2026",
    publishedAt: "2026-04-06",
    image: "/Blogs/EngineeringCover.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.mappingUnknownGenLayers,
    title: "Mapping the uknown: Generative Geospatial layers",
    date: "Apr 2026",
    publishedAt: "2026-04-07",
    image: "/Blogs/EngineeringCover.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.turningDormantDataUsable,
    title: "Turning Dormant data usable",
    date: "Apr 2026",
    publishedAt: "2026-04-08",
    image: "/Blogs/EngineeringCover.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.lgmTimeline,
    title: "Large Geospatial Model: Our timeline.",
    date: "Apr 2026",
    publishedAt: "2026-04-09",
    image: "/Blogs/EngineeringCover.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.whyBuildingLgm,
    title: "Why we're building an LGM.",
    date: "Apr 2026",
    publishedAt: "2026-04-10",
    image: "/Blogs/EngineeringCover.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.firePredictonModel,
    title: "Research Demonstration: Fire Prediction Model",
    date: "Apr 2026",
    publishedAt: "2026-04-11",
    image: "/Blogs/firePrediction.png",
    category: "ENGINEERING",
    audience: "For engineers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.mapsgptBuildingUseful,
    title: "MapsGPT: Building a useful mapping AI",
    date: "Apr 2026",
    publishedAt: "2026-04-01",
    image: "/Blogs/MapsGPT.png",
    category: "PRODUCT",
    audience: "For builders",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioChooseCities,
    title: "How to choose cities within to live in: by Elio",
    date: "Apr 2026",
    publishedAt: "2026-04-02",
    image: "/Academic/acad-bg-1.png",
    category: "PRODUCT",
    audience: "For travelers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioMadridGuide,
    title: "A guide to Madrid: Written by Elio",
    date: "Apr 2026",
    publishedAt: "2026-04-03",
    image: "/Blogs/madrid.png",
    category: "PRODUCT",
    audience: "For travelers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioEuropeGuide,
    title: "A guide to Europe: Cheap but unique cities",
    date: "Apr 2026",
    publishedAt: "2026-04-04",
    image: "/UrbanInfrastructure/urb-bg-6.png",
    category: "PRODUCT",
    audience: "For travelers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioSpainGuide,
    title: "A guide to Spain: Written by Elio",
    date: "Apr 2026",
    publishedAt: "2026-04-05",
    image: "/Blogs/spain.jpeg",
    category: "PRODUCT",
    audience: "For travelers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioFunResearch,
    title: "Using Elio for fun research",
    date: "Apr 2026",
    publishedAt: "2026-04-06",
    image: "/Blogs/newyork.jpeg",
    category: "PRODUCT",
    audience: "For travelers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.announcingColumbusProPreOrders,
    title: "Announcing Columbus Pro pre-orders",
    date: "Apr 2026",
    publishedAt: "2026-04-07",
    image: "/Blogs/columbusPreOrder.png",
    category: "PRODUCT",
    audience: "For builders",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.fasterSiteSelectionColumbus,
    title: "Faster Site Selection with Columbus",
    date: "Apr 2026",
    publishedAt: "2026-04-08",
    image: "/CREbg/cre-bg-1.png",
    category: "PRODUCT",
    audience: "For builders",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.elioV2NewFeatures,
    title: "Elio: V2 new features",
    date: "Apr 2026",
    publishedAt: "2026-04-01",
    image: "/Blogs/elio.png",
    category: "COMPANY NEWS",
    audience: "For travelers",
    description: "lorem",
    paragraphs: ["lorem"],
  },
  {
    slug: BLOG_SLUG.joinUsResearchOpportunities,
    title: "Join us! Research opportunities for the rebelious",
    date: "Apr 2026",
    publishedAt: "2026-04-02",
    image: "/Blogs/joinUs.png",
    category: "COMPANY NEWS",
    audience: "For the interested",
    description: "lorem",
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
 */
const BLOG_IMAGE_ACCENT_COLORS: Record<string, string> = {
  "/Blogs/EngineeringCover.png": "#8A6628",
  "/Blogs/firePrediction.png": "#1C5097",
  "/Blogs/MapsGPT.png": "#16579C",
  "/Academic/acad-bg-1.png": "#16689C",
  "/Blogs/madrid.png": "#165D9C",
  "/UrbanInfrastructure/urb-bg-6.png": "#16769C",
  "/Blogs/spain.jpeg": "#8D4E26",
  "/Blogs/newyork.jpeg": "#8E4F24",
  "/Blogs/columbusPreOrder.png": "#16679C",
  "/CREbg/cre-bg-1.png": "#16609C",
  "/Blogs/elio.png": "#16579C",
  "/Blogs/joinUs.png": "#283A8A",
};

export function getBlogAccentColor(post: BlogPost): string | undefined {
  return post.image ? BLOG_IMAGE_ACCENT_COLORS[post.image] : undefined;
}

export function getAllBlogPostsSorted(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
