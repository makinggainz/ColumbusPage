/**
 * Columbus product knowledge base — the chat assistant's source of truth
 * (components/business/BusinessHelper.tsx + app/api/columbus-chat).
 *
 * STRICT RULE: everything here must be lifted from copy that actually
 * appears on the /products/business page. Do not add claims, descriptions,
 * numbers, or specifics that aren't on the page. Sources:
 *   • Hero / positioning — components/business/BusinessHero.tsx,
 *     SolutionShowcase.tsx, ProductBanner.tsx
 *   • Problems — components/business/ProblemCards.tsx
 *   • Capabilities — components/business/CapabilitiesGrid.tsx (titles) +
 *     BusinessUseCases.tsx / ComparisonSection.tsx (the on-page feature copy)
 *   • Industries — app/products/business/page.tsx
 *   • FAQ — components/business/FAQSection.tsx (verbatim)
 *   • Demo / contact CTAs — ProductBanner.tsx ("Try Demo"),
 *     BusinessHero.tsx ("Start Now"), ChatSection.tsx ("Talk to Founders")
 *
 * Three uses:
 *  1. COLUMBUS_SUGGESTIONS[].response — canned answers rendered when a
 *     visitor clicks a quick-pick chip (no model call).
 *  2. serializeKb() — flattened into the AI route's system prompt as the
 *     grounding context (app/api/columbus-chat/route.ts).
 *  3. matchQuestion() — the keyword fallback used only when the AI route is
 *     unavailable (rate-limited / erroring), before the contact form.
 *
 * Update flow: when the page copy above changes, change the matching entry
 * here too. Keep the structure stable so serializeKb() stays parseable.
 */

export const COLUMBUS_KB = {
  oneLiner:
    "Columbus Pro is agentic GIS made effortless — a more powerful, more " +
    "intuitive GIS built for the physical world, with highest-fidelity fresh " +
    "data, real spatial and contextual reasoning, and actual maps and visuals " +
    "as the answer.",

  /* The "Legacy GIS slows you down because…" pain points (ProblemCards.tsx) —
     what Columbus is built to fix. */
  problemsSolved: [
    "A single site selection report takes your team weeks to months.",
    "Legacy GIS requires specialists to operate their bulky complex apps.",
    "Your analysts spend 80% of their time finding, cleaning and organizing data.",
    "Finding the right data to support your research is too difficult.",
    "You use 10 different complex apps for one single project.",
    "Combining multiple types of large data on a single map is frustrating and costly.",
  ],

  /* The six "Enterprise-grade capabilities" tiles plus the product features
     described on the page's feature sections. Descriptions are lifted from the
     on-page feature copy (BusinessUseCases / ComparisonSection), generalized
     across industries. */
  capabilities: [
    {
      title: "Ask the map anything",
      description:
        "Conversational map chat — ask directly about anything and have a conversation like you're talking to your best analyst, in plain English.",
    },
    {
      title: "Pattern detection",
      description:
        "Sophisticated pattern detection — ask the chat to uncover hidden patterns across the map and data.",
    },
    {
      title: "Forecasts",
      description:
        "Like weather forecasts, but for your market — predict the future and spot future hot areas, powered by deep-learning pattern recognition fed by the most up-to-date, high-quality data.",
    },
    {
      title: "Transparent reasoning",
      description:
        "Columbus AI considers a wide breadth of data every time it critically thinks, and its reasoning is transparent — tap to see all the investigation it did.",
    },
    {
      title: "Drop in any file",
      description:
        "Drop in any file — Shapefile, KML, CSV, XLSX, PDF, or CAD — and Columbus harmonizes and overlays it as a visualized map layer. No schemas to define, no columns to map; just upload and ask follow-up questions in plain English.",
    },
    {
      title: "Agent research reports",
      description:
        "Hand Columbus your brief and grab a coffee — it researches new sites, runs demand and absorption studies, and delivers professional, review-ready reports while you focus on other work.",
    },
    {
      title: "Data Catalogue",
      description:
        "Access proprietary data and the highest-quality data from a curated data catalogue. Data on Columbus is triple-checked.",
    },
    {
      title: "High-fidelity accurate data",
      description:
        "Continuously ingested and spatially validated authoritative public, commercial, and partner datasets, so what you query is current and coordinate-accurate.",
    },
    {
      title: "Light-speed due diligence",
      description:
        "Site selection and research that used to take weeks to months, done at light speed.",
    },
    {
      title: "24/7 personal support",
      description: "24/7 personal support — you can talk to the founders directly.",
    },
    {
      title: "Dashboard",
      description: "A dashboard that gives you your captain's view across everything.",
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

  /* Verbatim from FAQSection.tsx. */
  faq: [
    {
      q: "Why doesn't Claude or ChatGPT work?",
      a:
        "General chat models are built for text, not space. They regurgitate old articles about an area, hallucinate coordinates, can't reach live data, and produce no map or GIS output. Columbus is built for the physical world — highest-fidelity fresh data, real spatial and contextual reasoning, and actual maps and visuals as the answer.",
    },
    {
      q: "How do we collect our data?",
      a:
        "We continuously ingest and fuse authoritative public, commercial, and partner datasets, then validate them spatially so what you query is current and coordinate-accurate — not scraped article text. Coverage and freshness keep expanding as new sources come online.",
    },
    {
      q: "What security measures do we take?",
      a:
        "Business data is encrypted in transit and at rest, access is scoped per organization, and your private data is never used to train shared models. We support the controls business teams expect before rolling Columbus out across an organization.",
    },
    {
      q: "Is this only for GIS professionals?",
      a:
        "No. Columbus is designed so anyone — from analysts to non-technical teams — can ask spatial questions in plain language and get map-grade answers, while still giving GIS professionals the full depth and control they need.",
    },
  ],

  /* The page does not state a price list. The on-page paths to pricing are the
     demo CTAs ("Try Demo" / "Start Now") and "Talk to Founders". */
  pricing:
    "To see pricing, start a demo or talk to the founders — they'll show " +
    "Columbus running on your own data and walk through what fits your needs.",

  contact: {
    description:
      "Start a demo or talk to the founders to see Columbus running on your own data.",
  },
} as const;

/* ─── Quick-pick suggestions ─────────────────────────────────────────
   The chips rendered at the top of an empty chat. Each ships with a canned
   `response` (rendered directly on click, no model call) that is also fed to
   the AI as grounding, and `keywords` used by matchQuestion()'s fallback. */

export type Suggestion = {
  id: string;
  label: string;
  response: string;
  /* Lower-case single-word stems; used by matchQuestion() (the keyword
     fallback when the AI route is unavailable). */
  keywords: string[];
  /* Override the global MIN_KEYWORD_HITS for this entry. Use 1 only for
     entries whose keywords are specific enough to be unambiguous on their own
     (e.g. "geospatial", "gis") — prevents the 2-hit rule from blocking
     simple definitional questions like "what is GIS" (which tokenizes to
     just {"gis"} after stopword filtering). */
  minHits?: number;
  /* When set, clicking this chip opens the inline contact form instead of
     printing `response` — for next-step intents (e.g. "Can I see a demo?")
     where a dead-end text answer would frustrate. `response` is still kept as
     the AI/<faq> grounding for the same question typed freely. */
  action?: "contact";
};

export const COLUMBUS_SUGGESTIONS: Suggestion[] = [
  {
    id: "what-is-gis",
    label: "What is GIS?",
    response:
      "GIS — Geographic Information System — is software for capturing, analyzing, and visualizing data tied to locations on earth. Columbus makes that effortless: ask the map anything in plain English and get answers, forecasts, and maps instantly.",
    /* "gis" is specific enough to match alone — "what is GIS" tokenizes to
       just {"gis"} after stopword filtering, so minHits:1 is required here. */
    keywords: ["gis", "geospatial", "geographic", "spatial", "gis?"],
    minHits: 1,
  },
  {
    id: "pricing",
    label: "Is Columbus free?",
    response:
      "The best way to see pricing is to start a demo or talk to our founders — they'll show Columbus running on your own data and walk through what fits your needs.",
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
      "Columbus Pro is agentic GIS made effortless. Ask the map anything in plain English, get agent research reports, browse a curated data catalogue, run light-speed due diligence, forecast trends, and drop in any file — Shapefile, KML, CSV, XLSX, PDF, or CAD — to overlay it as a map layer.",
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
      "Columbus is for teams making decisions about physical space — residential and commercial real estate, urban infrastructure, geomarketing, academic research, and environmental research. It's designed so anyone, from non-technical analysts to GIS professionals, can use it.",
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
      "We continuously ingest and fuse authoritative public, commercial, and partner datasets, then validate them spatially so what you query is current and coordinate-accurate — not scraped article text. You can also access proprietary, triple-checked data from our curated data catalogue.",
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
      "General chat models are built for text, not space. They regurgitate old articles about an area, hallucinate coordinates, can't reach live data, and produce no map or GIS output. Columbus is built for the physical world — highest-fidelity fresh data, real spatial and contextual reasoning, and actual maps and visuals as the answer.",
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
    /* Clicking opens the contact form (see `action`) rather than printing this
       text — but it stays as grounding for the same question typed freely. */
    action: "contact",
    response:
      "Yes — start a demo or talk to our founders to see Columbus running on your own data.",
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

/* ─── Industry options for the in-chat form ──────────────────────────
   Mirrors the <select> options on the Columbus Pro tab of the contact
   form (app/contact/page.tsx) so submissions from the chat line up with
   submissions from the main contact form. */

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

/* ─── Keyword-fallback-only answers ─────────────────────────────────
   These are NOT rendered as chips — they exist solely so matchQuestion()
   can give a sensible answer for simple domain questions when the AI route
   is unavailable. Keep responses short, accurate, and Columbus-pivoting. */

export const KEYWORD_FALLBACKS: Suggestion[] = [
  {
    id: "what-is-agentic",
    label: "What is agentic GIS?",
    response:
      "Agentic GIS means Columbus works like an analyst on your behalf — it takes your brief, researches sites, runs analysis, and delivers results while you focus on other work. No manual steps, no specialist required.",
    keywords: ["agentic", "agent", "autonomous", "automation", "automated"],
    minHits: 1,
  },
];

/* ─── KB → system-prompt serializer ──────────────────────────────────
   Flattens the KB into the grounding block dropped into the AI route's
   system prompt. Pure function, no React deps — safe on the server. */

export function serializeKb(): string {
  const k = COLUMBUS_KB;
  const lines: string[] = [];
  lines.push(`# What Columbus is\n${k.oneLiner}\n`);
  lines.push(`# Problems Columbus solves`);
  for (const p of k.problemsSolved) lines.push(`- ${p}`);
  lines.push(`\n# Capabilities`);
  for (const c of k.capabilities) lines.push(`- ${c.title}: ${c.description}`);
  lines.push(`\n# Industries served`);
  for (const ind of k.industries) lines.push(`- ${ind}`);
  /* COLUMBUS_KB.faq is intentionally NOT serialized here: the same Q&A is
     already sent to the model in the route's <faq> block (built from
     COLUMBUS_SUGGESTIONS), so emitting it again would just duplicate tokens
     on every call. The faq field is kept as the canonical reference. */
  lines.push(`\n# Pricing\n${k.pricing}\n`);
  lines.push(`# Contact\n${k.contact.description}`);
  return lines.join("\n");
}

/* ─── Keyword fallback matcher ───────────────────────────────────────
   Used only when the AI route returns no answer (rate-limited, erroring,
   timed out, or no key) — a cheap last attempt to answer a recognized
   question before the chat shows the contact form. Searches KEYWORD_FALLBACKS
   first, then COLUMBUS_SUGGESTIONS. The global MIN_KEYWORD_HITS=2 prevents
   a single generic word from matching the wrong chip answer; KEYWORD_FALLBACKS
   entries may set minHits:1 when their keywords are specific enough to be
   unambiguous on their own (e.g. "gis", "agentic"). When in doubt, returns
   null and the chat shows the contact form. */

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "do", "does", "did", "can", "could", "to",
  "of", "in", "on", "at", "for", "with", "and", "or", "but", "i", "you", "we",
  "it", "this", "that", "be", "by", "as", "from", "my", "your", "our", "me",
  "us", "any", "some", "how", "what", "why", "when", "where", "who", "which",
  "have", "has", "had", "will", "would", "should",
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

/* A match needs at least this many distinct keyword hits. Two avoids the
   "one shared generic word → wrong answer" failure mode; single-keyword
   questions fall through to the contact form instead. */
const MIN_KEYWORD_HITS = 2;

export function matchQuestion(text: string): Suggestion | null {
  const qTokens = tokenize(text);
  if (qTokens.size === 0) return null;
  let best: { overlap: number; s: Suggestion } | null = null;
  for (const s of [...KEYWORD_FALLBACKS, ...COLUMBUS_SUGGESTIONS]) {
    const threshold = s.minHits ?? MIN_KEYWORD_HITS;
    const kw = new Set(s.keywords);
    let overlap = 0;
    for (const t of qTokens) if (kw.has(t)) overlap++;
    if (overlap >= threshold && (!best || overlap > best.overlap)) {
      best = { overlap, s };
    }
  }
  return best?.s ?? null;
}
