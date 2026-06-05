/**
 * Columbus product knowledge base — facts that power the in-page chat
 * assistant (components/business/BusinessHelper.tsx).
 *
 * Everything in here is hand-curated from the live site copy:
 *   • FAQ — components/business/FAQSection.tsx
 *   • Capabilities — components/business/CapabilitiesGrid.tsx
 *   • Industries — app/products/business/page.tsx (BUSINESS_INDUSTRIES)
 *   • Contact / book-a-demo — components/business/ProductBanner.tsx,
 *     BusinessHero.tsx, ChatSection.tsx (all link to
 *     /contact?tab=columbus-pro)
 *
 * For v1 we use this file two ways:
 *  1. SUGGESTIONS[].response — canned answers rendered when the user
 *     clicks a quick-pick chip.
 *  2. serializeKb() — flattens the structured data into a single string
 *     ready to drop into a Claude system prompt once the chat is wired
 *     to the API (see /Users/alexramirezblonski/.claude/plans/
 *     ok-now-can-you-goofy-kettle.md, Option A).
 *
 * Update flow: whenever the live site copy in the sources above changes
 * meaningfully, the corresponding section here should change too. Keep
 * the structure consistent so serializeKb() output stays parseable.
 */

export const COLUMBUS_KB = {
  oneLiner:
    "Columbus is the geospatial AI layer for the physical world — fresh, " +
    "high-fidelity data and real spatial reasoning, with maps and visuals " +
    "as the answer.",

  capabilities: [
    {
      title: "Ask the map anything",
      description:
        "Plain-language questions about places. No filters, no menus — the map answers back.",
    },
    {
      title: "Agent research reports",
      description:
        "Autonomous agents produce structured spatial reports — due-diligence packs, market scans, site comparisons.",
    },
    {
      title: "24/7 personal support",
      description:
        "Dedicated humans in the loop — onboarding, custom data ingestion, and follow-up support whenever you need it.",
    },
    {
      title: "High-fidelity accurate data",
      description:
        "Continuously ingested and spatially validated authoritative datasets — public, commercial, and partner. Always current, coordinate-accurate.",
    },
    {
      title: "Data Catalogue",
      description:
        "Browse and query the underlying datasets directly — every layer Columbus uses is auditable and queryable on its own.",
    },
    {
      title: "Light-speed due diligence",
      description:
        "Complete environmental, market, regulatory, and operational checks on a property or operation in minutes instead of weeks.",
    },
  ],

  industries: [
    "Residential real estate",
    "Commercial real estate",
    "Urban infrastructure",
    "Geomarketing",
    "Academic research",
    "Environmental research",
  ],

  faq: [
    {
      q: "Why doesn't Claude or ChatGPT work for this?",
      a:
        "General chat models are built for text, not space. They regurgitate old articles, hallucinate coordinates, can't reach live data, and produce no map or GIS output. Columbus is built for the physical world — highest-fidelity fresh data, real spatial and contextual reasoning, and actual maps and visuals as the answer.",
    },
    {
      q: "How does Columbus collect its data?",
      a:
        "We continuously ingest and fuse authoritative public, commercial, and partner datasets, then validate them spatially so what you query is current and coordinate-accurate — not scraped article text. Coverage and freshness keep expanding as new sources come online.",
    },
    {
      q: "What security measures do you have?",
      a:
        "Business data is encrypted in transit and at rest, access is scoped per organization, and your private data is never used to train shared models. We support the controls business teams expect before rolling Columbus out across an organization.",
    },
    {
      q: "Is this only for GIS professionals?",
      a:
        "No. Columbus is designed so anyone — from analysts to non-technical teams — can ask spatial questions in plain language and get map-grade answers, while still giving GIS professionals the full depth and control they need.",
    },
  ],

  pricing:
    "Columbus Pro is a paid business product with team-tailored pricing. " +
    "There's no public price list — pricing is shaped around your team " +
    "size, dataset needs, and usage. The right way to get a quote is to " +
    "book a demo at /contact?tab=columbus-pro.",

  contact: {
    bookDemo: "/contact?tab=columbus-pro",
    description:
      "Book a demo to see Columbus running on your own data. Reach out at /contact?tab=columbus-pro.",
  },
} as const;

/* ─── Quick-pick suggestions ─────────────────────────────────────────
   The three chips rendered at the top of an empty chat. Picked to match
   what visitors most commonly ask before any sales conversation. Each
   suggestion ships with its own canned response so v1 can answer
   without an LLM call — the same responses are usable as gold answers
   when an LLM-backed v2 is wired up. */

export type Suggestion = {
  id: string;
  label: string;
  response: string;
  /* Tokens used by matchQuestion() to map a typed question to this entry
     without calling an LLM. Should be lower-case, single-word stems —
     plurals/variants are folded back to the root in tokenize(). */
  keywords: string[];
};

/* Full pool of canned Q&A. The chat shows three at a time as chips; once
   the visitor clicks one, it's removed and the next from the pool slides
   into its place (see SuggestionChips rotation in BusinessHelper.tsx). */
export const COLUMBUS_SUGGESTIONS: Suggestion[] = [
  {
    id: "pricing",
    label: "Is Columbus free?",
    response:
      "Columbus Pro is a paid business product — we don't publish a price list because pricing is tailored to your team size, the datasets you need, and how you'll use it. The fastest way to get a quote is to book a demo and we'll put together a plan that fits.",
    keywords: [
      "free",
      "price",
      "pricing",
      "cost",
      "paid",
      "pay",
      "subscription",
      "plan",
      "quote",
      "much",
      "afford",
      "money",
    ],
  },
  {
    id: "what-is-it",
    label: "What can Columbus do?",
    response:
      "Columbus is the geospatial AI layer for the physical world. You can ask the map anything in plain language, generate agent research reports, browse the underlying data catalogue, and run light-speed due diligence on a property, region, or operation — all backed by fresh, coordinate-accurate data, with 24/7 personal support.",
    keywords: [
      "what",
      "do",
      "feature",
      "capability",
      "capabilities",
      "work",
      "does",
      "function",
      "purpose",
      "about",
    ],
  },
  {
    id: "who-for",
    label: "Who uses Columbus?",
    response:
      "Columbus is built for teams making decisions about physical space — residential and commercial real estate, urban infrastructure, geomarketing, academic research, and environmental research. It's designed for non-technical analysts and GIS professionals alike.",
    keywords: [
      "who",
      "user",
      "customer",
      "industry",
      "industries",
      "team",
      "audience",
      "for",
      "client",
      "company",
    ],
  },
  {
    id: "data",
    label: "What data does Columbus have?",
    response:
      "We continuously ingest and fuse authoritative public, commercial, and partner datasets, then validate them spatially so what you query is current and coordinate-accurate — not scraped article text. Coverage and freshness keep expanding as new sources come online.",
    keywords: [
      "data",
      "dataset",
      "datasets",
      "source",
      "sources",
      "coverage",
      "layer",
      "layers",
      "catalogue",
      "ingest",
      "where",
    ],
  },
  {
    id: "vs-chatgpt",
    label: "How is it different from ChatGPT?",
    response:
      "General chat models are built for text, not space. They regurgitate old articles, hallucinate coordinates, can't reach live data, and produce no map or GIS output. Columbus is built for the physical world — highest-fidelity fresh data, real spatial and contextual reasoning, and actual maps and visuals as the answer.",
    keywords: [
      "chatgpt",
      "claude",
      "llm",
      "gpt",
      "openai",
      "anthropic",
      "compare",
      "comparison",
      "different",
      "difference",
      "vs",
      "ai",
      "model",
    ],
  },
  {
    id: "security",
    label: "Is my data secure?",
    response:
      "Business data is encrypted in transit and at rest, access is scoped per organization, and your private data is never used to train shared models. We support the controls business teams expect before rolling Columbus out across an organization.",
    keywords: [
      "secure",
      "security",
      "encrypt",
      "encryption",
      "privacy",
      "private",
      "safe",
      "protect",
      "data",
      "compliance",
      "soc",
    ],
  },
  {
    id: "demo",
    label: "Can I see a demo?",
    response:
      "Yes — we run demos on your own data so you can see Columbus working against real questions from your team. The fastest way to book one is to share a few details about your team and what you're trying to solve, and we'll set it up.",
    keywords: [
      "demo",
      "demos",
      "see",
      "show",
      "trial",
      "preview",
      "try",
      "watch",
      "example",
      "walkthrough",
    ],
  },
  {
    id: "gis-expert",
    label: "Do I need to be a GIS expert?",
    response:
      "No. Columbus is designed so anyone — from analysts to non-technical teams — can ask spatial questions in plain language and get map-grade answers, while still giving GIS professionals the full depth and control they need.",
    keywords: [
      "gis",
      "expert",
      "technical",
      "hard",
      "easy",
      "learn",
      "training",
      "analyst",
      "professional",
      "skill",
      "need",
    ],
  },
];

/* ─── Local question matcher (no LLM, no network) ────────────────────
   Given a free-text question, return the suggestion whose keyword bag
   has the highest Jaccard overlap with the question's tokens. Returns
   null when no entry clears MATCH_THRESHOLD — the chat then escalates
   to the Columbus-Pro mini-form. This is intentionally cheap so it can
   run on every keystroke if we ever want live-preview matching. */

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "do",
  "does",
  "did",
  "can",
  "could",
  "to",
  "of",
  "in",
  "on",
  "at",
  "for",
  "with",
  "and",
  "or",
  "but",
  "i",
  "you",
  "we",
  "it",
  "this",
  "that",
  "be",
  "by",
  "as",
  "from",
  "my",
  "your",
  "our",
  "me",
  "us",
  "any",
  "some",
  "how",
  "what",
  "why",
  "when",
  "where",
  "who",
  "which",
  "have",
  "has",
  "had",
  "will",
  "would",
  "should",
]);

function tokenize(input: string): Set<string> {
  const out = new Set<string>();
  const normalised = input.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  for (const raw of normalised.split(/\s+/)) {
    if (!raw) continue;
    /* Fold common plurals so "industries" matches "industry" etc. */
    let t = raw;
    if (t.length > 4 && t.endsWith("ies")) t = t.slice(0, -3) + "y";
    else if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss"))
      t = t.slice(0, -1);
    if (t.length < 2) continue;
    if (STOPWORDS.has(t)) continue;
    out.add(t);
  }
  return out;
}

/* Cosine-like score on bag-of-words. Threshold tuned so a single shared
   distinctive keyword ("pricing", "demo", "gis") is enough to trigger a
   match, while generic words alone aren't. */
const MATCH_THRESHOLD = 0.18;

export function matchQuestion(text: string): Suggestion | null {
  const qTokens = tokenize(text);
  if (qTokens.size === 0) return null;
  let best: { score: number; s: Suggestion } | null = null;
  for (const s of COLUMBUS_SUGGESTIONS) {
    const kw = new Set(s.keywords);
    let overlap = 0;
    for (const t of qTokens) if (kw.has(t)) overlap++;
    /* Jaccard-style: shared / union size. Slight bias toward suggestions
       with more keywords would skew results, so we normalise to the
       smaller bag (question or keyword set). */
    const denom = Math.min(qTokens.size, kw.size);
    const score = denom > 0 ? overlap / denom : 0;
    if (score >= MATCH_THRESHOLD && (!best || score > best.score)) {
      best = { score, s };
    }
  }
  return best?.s ?? null;
}

/* ─── Industry options for the in-chat form ──────────────────────────
   Mirrors the <select> options on the Columbus Pro tab of the contact
   form (app/contact/page.tsx ~L561-L570) so submissions from the chat
   line up with submissions from the main contact form. */

export const INDUSTRY_OPTIONS: { value: string; label: string }[] = [
  { value: "real-estate", label: "Real Estate" },
  { value: "government", label: "Government" },
  { value: "logistics", label: "Logistics & Supply Chain" },
  { value: "urban-planning", label: "Urban Planning" },
  { value: "environmental", label: "Environmental" },
  { value: "security", label: "Security & Defense" },
  { value: "insurance", label: "Insurance" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

/* ─── KB → system-prompt serializer ──────────────────────────────────
   When the chat is wired to Claude (see the plan file), the server
   route should drop this string into the system prompt inside a
   <kb>…</kb> block. Pure function, no React deps — safe to call on the
   server. */

export function serializeKb(): string {
  const k = COLUMBUS_KB;
  const lines: string[] = [];
  lines.push(`# What Columbus is\n${k.oneLiner}\n`);
  lines.push(`# Capabilities`);
  for (const c of k.capabilities) {
    lines.push(`- ${c.title}: ${c.description}`);
  }
  lines.push(`\n# Industries served`);
  for (const ind of k.industries) lines.push(`- ${ind}`);
  lines.push(`\n# FAQ`);
  for (const f of k.faq) lines.push(`Q: ${f.q}\nA: ${f.a}\n`);
  lines.push(`# Pricing\n${k.pricing}\n`);
  lines.push(`# Contact\n${k.contact.description}`);
  return lines.join("\n");
}
