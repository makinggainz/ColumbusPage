/**
 * Industry-aware content shape for the use-cases sticky-scroll block on
 * `/columbus-solutions` and `/research-applications`.
 *
 * The block is a four-row sticky-scroll. Each row's right column is the
 * existing visual UI from one of the four old sections (Chat, SuperModel,
 * AgentResearch, DataCatalogue) — the per-section sidebar of "industry
 * options" is removed because the user has already picked their industry at
 * the top of the page. Each row's left column is a sticky rail that shows a
 * single sub-item (title + description + optional bullets + optional CTA)
 * specific to the chosen industry.
 *
 * Image paths reuse existing assets across industries — only text differs in
 * the MVP. Industries other than the default are populated with lorem ipsum
 * placeholders until real per-industry copy is authored.
 */

export type IndustryId =
  | "residential-real-estate"
  | "commercial-real-estate"
  | "generative-geodata"
  | "logistics-optimization"
  | "urban-planning"
  | "site-selection"
  | "consumer-mapping"
  | "ground-due-diligence"
  | "geomarketing"
  | "city-security"
  | "environmental"
  | "tourism";

/**
 * Content rendered in the section-G sticky left rail for one row in one
 * industry. Replaces the old per-section sidebar of multiple sub-items —
 * each row now exposes exactly one active sub-item per industry.
 */
export type RowLeftRail = {
  title: string;
  /** Free-text description; supports multi-paragraph via "\n\n" separators. */
  description: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export type ChatRowContent = {
  leftRail: RowLeftRail;
  /** Animated chat dialogue. */
  query: string;
  considering: string[];
  /** First response paragraph. May contain inline `<span class="text-red-700">…</span>`. */
  responseHtml: string;
  /** Follow-up paragraph rendered after the response. */
  followUp: string;
  /** Map image used as the chat panel background. */
  mapImageSrc: string;
};

export type SuperModelRowContent = {
  leftRail: RowLeftRail;
  mapImageSrc: string;
  mapQuery: string;
};

export type ReportTemplate = {
  title: string;
  description: string;
};

export type AgentResearchRowContent = {
  leftRail: RowLeftRail;
  templates: ReportTemplate[];           // 3 fully-rendered template cards
  advancedTemplateTitle: string;          // 4th gradient-locked template
  reportTitle: string;
  reportBody: string;
  reportMapSrc: string;
  inputPlaceholder: string;
};

export type DataLayerCard = {
  title: string;
  rows: string;        // e.g. "55,010 rows"
  description: string;
  imageSrc: string;
};

export type DataCatalogueRowContent = {
  leftRail: RowLeftRail;
  /** Data-type tabs above the card grid (NOT industry options — these stay). */
  tabs: string[];
  activeTab: string;
  cards: DataLayerCard[];
};

export type IndustryContent = {
  id: IndustryId;
  name: string;
  /** Optional short label used by the sticky text-link navbar. */
  shortName?: string;
  /** Selector tile background image. */
  imageSrc: string;

  chat: ChatRowContent;
  superModel: SuperModelRowContent;
  agentResearch: AgentResearchRowContent;
  dataCatalogue: DataCatalogueRowContent;
};
