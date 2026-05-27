import Image from "next/image";
import Link from "next/link";

import { blogHref, BLOG_SLUG, BLOG_POSTS } from "@/lib/blog-posts";
import styles from "../technology.module.css";
import { TechScrollIndex } from "../TechScrollIndex";
import {
  RESEARCH_ARTICLES,
  RESEARCH_CARDS,
} from "./content";
import { CoreResearchArt } from "./CoreResearchArt";
import { CoreResearchCarousel } from "./CoreResearchCarousel";
import { Definition } from "./Definition";
import { ResearchAccordionProvider } from "./ResearchAccordionContext";
import { ResearchGroup } from "./ResearchGroup";
import { RevealOnView } from "./RevealOnView";
import { CareersContactForm } from "./CareersContactForm";
import type { TechnologySectionId } from "./types";

function Slide({
  id,
  className,
  children,
}: {
  id: TechnologySectionId;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={[styles.section, className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}


export function TechnologySections() {
  return (
    <>
      {/* Sidebar panel with scroll index */}
      <div className={styles.sidebarPanel}>
        <div className={styles.sidebarPanelSticky}>
          <TechScrollIndex />
        </div>
      </div>

      {/* Main content column. z-index stays low (1) — below the sidebar
          panel (2) and, crucially, below the sticky navbar (z-100) so the
          nav always paints over the page content. */}
      <div style={{ position: "relative", zIndex: 1 }}>
      {/* ── 1. What's an LGM ── */}
      <Slide id="index">
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <div className={styles.lgmCompareLayout}>
              <div className={styles.lgmCompareText}>
                <span className={styles.sectionEyebrow}>A new foundation model</span>
                <h2 className={styles.sectionTitle}>
                  Large Geospatial Model vs Large Language Model.
                </h2>
                <div className={styles.editorialBody}>
                  <p>
                    If an LLM is for the digital world, our LGM is for the
                    physical world.
                    <br />
                    We&rsquo;re personifying earth with physical AI. Instead of
                    words, we process data about our surroundings and the
                    anthropology in them.
                  </p>
                  <p>
                    A new foundational model is needed.
                  </p>
                </div>
                <Link href={blogHref(BLOG_SLUG.philosophyUniversalLgm)} className={styles.lgmInlineCta}>
                  <span>Read our in-depth article</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              <div className={styles.lgmCompareArt} aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/TechnologyPageImages/techDiagram.png"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={styles.lgmCompareArtImg}
                />
              </div>
            </div>

            {/* ── How an LGM is different — comparison table ── */}
            <div className={styles.lgmCompareTable}>
              <div className={styles.dimBranding}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logobueno.png" alt="" className={styles.dimBrandingLogo} aria-hidden loading="lazy" decoding="async" />
                <span>Columbus Earth</span>
              </div>

              <h3 className={styles.lgmCompareTableTitle}>An LGM vs other foundation models</h3>

              {/* Comparison grid — labels column + 3 model columns */}
              <div className={styles.dimTableGrid}>

                {/* ── Header row: empty cell + 3 model headers ── */}
                <div />
                <div className={styles.dimModelHeader}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/TechnologyPageImages/llm-text-icon.png" alt="" className={styles.dimModelHeaderIcon} aria-hidden loading="lazy" decoding="async" />
                  <div className={styles.dimModelHeaderText}>
                    <h4 className={styles.dimModelHeaderName}>LLM</h4>
                    <p className={styles.dimModelHeaderSubtitle}>Large-Language-model</p>
                  </div>
                </div>
                <div className={styles.dimModelHeader}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/TechnologyPageImages/vlm-image-icon.png" alt="" className={styles.dimModelHeaderIcon} aria-hidden loading="lazy" decoding="async" />
                  <div className={styles.dimModelHeaderText}>
                    <h4 className={styles.dimModelHeaderName}>VLM</h4>
                    <p className={styles.dimModelHeaderSubtitle}>Vision-Language-model</p>
                  </div>
                </div>
                <div className={styles.dimModelHeader}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/TechnologyPageImages/lgm-globe-icon.png" alt="" className={styles.dimModelHeaderIcon} aria-hidden loading="lazy" decoding="async" />
                  <div className={styles.dimModelHeaderText}>
                    <h4 className={`${styles.dimModelHeaderName} ${styles.dimModelHeaderNameLgm}`}>LGM</h4>
                    <p className={styles.dimModelHeaderSubtitle}>Large-Geosaptial-model</p>
                  </div>
                </div>

                {/* ── Row 1: Trained on ── */}
                <div className={styles.dimRowLabel}>Trained on</div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellTop}`}>
                  <h4 className={styles.dimCellHeading}>Text</h4>
                  <p className={styles.dimCellNote}>e.g. &ldquo;The grass is&rdquo; → &ldquo;green&rdquo;</p>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellTop}`}>
                  <h4 className={styles.dimCellHeading}>Text &amp; Image</h4>
                  <p className={styles.dimCellNote}>e.g. dog photo → &ldquo;a border collie&rdquo;</p>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellTop} ${styles.dimGridCellLgm}`}>
                  <h4 className={styles.dimCellHeading}>Physical reality</h4>
                  <p className={styles.dimCellNote}>e.g. public data + urban imagery + GIS → crime risk map</p>
                </div>

                {/* ── Row 2: What it outputs ── */}
                <div className={styles.dimRowLabel}>What it<br />outputs</div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellMid}`}>
                  <h4 className={styles.dimCellHeading}>Predictive words</h4>
                  <p className={styles.dimCellNote}>&ldquo;What word comes next?&rdquo;</p>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellMid}`}>
                  <h4 className={styles.dimCellHeading}>Visual reasoning</h4>
                  <p className={styles.dimCellNote}>&ldquo;What&rsquo;s in this image?&rdquo;</p>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellMid} ${styles.dimGridCellLgm}`}>
                  <h4 className={styles.dimCellHeading}>Ground truths</h4>
                  <p className={styles.dimCellNote}>&ldquo;What&rsquo;s in this physical space?&rdquo;</p>
                </div>

                {/* ── Row 3: Who's building it ── */}
                <div className={styles.dimRowLabel}>Who&rsquo;s<br />building it</div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellBottom}`}>
                  <div className={styles.dimLogos}>
                    <div className={styles.dimLogoItem}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/TechnologyPageImages/LogosTable/ChatGPT-Vertical-Logo-Vector.svg-.png" alt="ChatGPT" className={styles.dimLogoImg} loading="lazy" decoding="async" />
                    </div>
                    <div className={styles.dimLogoItem}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/TechnologyPageImages/LogosTable/Claude_AI_logo.svg.png" alt="Claude" className={styles.dimLogoImg} loading="lazy" decoding="async" />
                    </div>
                    <div className={styles.dimLogoItem}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/TechnologyPageImages/LogosTable/Grok-feb-2025-logo.svg.png" alt="Grok" className={styles.dimLogoImg} loading="lazy" decoding="async" />
                    </div>
                    <div className={styles.dimLogoItem}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/TechnologyPageImages/LogosTable/Perplexity_AI_logo.svg.png" alt="Perplexity" className={styles.dimLogoImg} loading="lazy" decoding="async" />
                    </div>
                  </div>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellBottom}`}>
                  <div className={styles.dimLogos} style={{ gridTemplateColumns: "1fr" }}>
                    <div className={styles.dimLogoItem}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/TechnologyPageImages/physical-intelligence-logo.jpeg" alt="Physical Intelligence" className={styles.dimLogoImg} style={{ maxWidth: 135 }} loading="lazy" decoding="async" />
                    </div>
                    <div className={styles.dimLogoItem}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/TechnologyPageImages/runway-logo.jpeg" alt="Runway" className={styles.dimLogoImg} loading="lazy" decoding="async" />
                    </div>
                    <div className={styles.dimLogoItem}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/TechnologyPageImages/meta-logo.jpeg" alt="Meta" className={styles.dimLogoImg} loading="lazy" decoding="async" />
                    </div>
                  </div>
                </div>
                <div className={`${styles.dimGridCell} ${styles.dimGridCellBottom} ${styles.dimGridCellLgm}`}>
                  <div className={styles.dimBrand}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logobueno.png" alt="" className={styles.dimBrandLogo} aria-hidden loading="lazy" decoding="async" />
                    <span className={styles.dimBrandName}>Columbus Earth</span>
                  </div>
                </div>

              </div>
            </div>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 2. A New Foundational Model ── */}
      <Slide id="lgm-vs-llm" className={`${styles.lgmSlide} ${styles.dotGrid}`}>
        <div className={styles.slideFrame}>
          <RevealOnView className={`${styles.editorialSlide} ${styles.lgmFoundationalSlide}`}>
            <h2 className={styles.lgmFoundationalTitle}>
              A Large Geospatial Model is the next frontier in AI
            </h2>
            <p className={styles.lgmFoundationalLead}>The path forward</p>

            {(() => {
              // Timeline spans 2022 → 2028 inclusive (7 years) with a
              // 4%/4% gutter. yearMid(y) positions a milestone at mid-year.
              const yearAt = (y: number) =>
                `${(4 + ((y - 2022) / 7) * 92).toFixed(2)}%`;
              const yearMid = (y: number) => yearAt(y + 0.5);

              // 2025 + 2026 sit only one year apart — shift 2025 left and
              // 2026 right so their labels have breathing room.
              const x2025 = `calc(${yearMid(2025)} - clamp(140px, 16vw, 220px))`;
              const x2026 = `calc(${yearMid(2026)} + clamp(40px, 5vw, 80px))`;

              // Columbus "now" marker — its own dot/stem/date, sitting
              // between 2025 and 2026 on the TOP side of the track.
              const now = new Date();
              const nowFrac =
                now.getFullYear() +
                now.getMonth() / 12 +
                (now.getDate() - 1) / (12 * 30);
              const nowLabel = now.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });
              const xColumbus = `calc(${yearAt(nowFrac)} - clamp(20px, 2.5vw, 40px))`;

              return (
            <div className={styles.lgmTimeline}>
              <div className={styles.lgmTimelineHalo} aria-hidden />
              <div id="lgm-timeline-track" className={styles.lgmTimelineTrack} aria-hidden />

              {/* Faint leading dot for visual symmetry with the trailing dots */}
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: "1.5%" }} aria-hidden />

              {/* (No major milestone dots — only the subtle minor + trailing
                  dots and the Columbus logo above the line remain.) */}

              {/* Minor rhythm dots at in-between years + a handful of off-grid
                  positions so the line reads as a continuous, lived-in track
                  rather than a strict 1-per-year grid. */}
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotMinor}`} style={{ left: yearMid(2023) }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotMinor}`} style={{ left: yearMid(2024) }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotMinor}`} style={{ left: yearMid(2027) }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: "16.5%" }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: "29%" }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: "44.5%" }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: "57%" }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: "71.5%" }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: "84%" }} aria-hidden />

              {/* Trailing dots — cadence continues past UGM */}
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: yearMid(2029) }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: yearMid(2030) }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: yearMid(2031) }} aria-hidden />
              <span className={`${styles.lgmTimelineDot} ${styles.lgmTimelineDotTrailing}`} style={{ left: yearMid(2032) }} aria-hidden />

              {/* ─── 2022 — year above the line (no stem); LLM below ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`} style={{ left: yearMid(2022) }}>
                <span className={styles.lgmTimelineLabel}>LLM</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom} ${styles.lgmTimelineMilestoneCompact}`} style={{ left: yearMid(2022) }}>
                <span className={styles.lgmTimelineYear}>2022</span>
              </div>

              {/* ─── 2025 — Geo-tuned label above; year below ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`} style={{ left: x2025 }}>
                <span className={styles.lgmTimelineLabel}>
                  Geo-tuned LLM<br />&amp; Vision Models
                </span>
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom} ${styles.lgmTimelineMilestoneCompact}`} style={{ left: x2025 }}>
                <span className={styles.lgmTimelineYear}>2025</span>
              </div>

              {/* ─── Columbus — separate "now" marker between 2025 and 2026 ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop} ${styles.lgmTimelineColumbus}`} style={{ left: xColumbus }}>
                <Image
                  src="/logobueno.png"
                  alt="Columbus"
                  width={64}
                  height={64}
                  className={styles.lgmTimelineColumbusLogo}
                />
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>

              {/* ─── 2026 — Generalist LGM label above; year + CTA below ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`} style={{ left: x2026 }}>
                <span className={styles.lgmTimelineLabel}>Generalist<br />LGM</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom}`} style={{ left: x2026 }}>
                <span className={styles.lgmTimelineYear}>2026</span>
                <Link href={blogHref(BLOG_SLUG.lgmTimeline)} className={styles.lgmTimelineCta}>
                  <span>Read our Paper</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* ─── 2028 — UGM label above; year + CTA below ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`} style={{ left: yearMid(2028) }}>
                <span className={styles.lgmTimelineLabel}>UGM</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom}`} style={{ left: yearMid(2028) }}>
                <span className={styles.lgmTimelineYear}>2028</span>
                <Link href={blogHref(BLOG_SLUG.whyBuildingLgm)} className={styles.lgmTimelineCta}>
                  <span>Our Game Plan</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* SEO / a11y — crawler-friendly outline of the timeline */}
              <div className={styles.srOnly}>
                <h3>Timeline of foundational AI models</h3>
                <ul>
                  <li>2022 — LLM (Large Language Model)</li>
                  <li>2025 — Geo-tuned LLM &amp; Vision Models</li>
                  <li>2026 — Generalist LGM (Large Geospatial Model)</li>
                  <li>2028 — UGM (Universal Geospatial Model)</li>
                </ul>
              </div>
            </div>
              );
            })()}

            <Link
              href={blogHref(BLOG_SLUG.lgmVsLlmVision)}
              className={`${styles.lgmArticleCard} ${styles.lgmArticleCardGlass} ${styles.lgmArticleCardBgRadiance}`}
            >
              <span className={styles.lgmArticleKicker}>Read our article on</span>
              <p className={styles.lgmArticleHeadline}>
                the drawbacks of LLMs &amp; vision models.
              </p>
              <p className={styles.lgmArticleHeadlineStrong}>
                How the LGM innovates.
              </p>
            </Link>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 3. Core Reasoning / Our Research ── */}
      <Slide id="core-reasoning" className={styles.coreReasoningSlide}>
        <div className={styles.slideFrame}>
          <RevealOnView className={`${styles.editorialSlide} ${styles.coreResearchSlide}`}>
            <div className={styles.coreResearchHero}>
              {/* Voyager pulsar-map starburst — traced as inline SVG.
                  Spans the full hero so the long horizontal arm extends across
                  the gap between the intro paragraph and the aside, visually
                  splitting them. Center sits on the right side of the layout. */}
              <div className={styles.coreResearchStarburst} aria-hidden>
                <Image
                  src="/TechnologyPageImages/VoyagerGraphic.png"
                  alt=""
                  fill
                  sizes="100vw"
                  style={{ objectFit: "contain", objectPosition: "right center" }}
                  priority={false}
                />
              </div>

              <div className={styles.coreResearchIntroRow}>
                <div className={styles.coreResearchIntroText}>
                  <span className={styles.sectionEyebrow}>Core Reasoning</span>
                  <h2 className={styles.sectionTitle}>Our research</h2>
                  <div className={styles.editorialBody}>
                    <p>
                      We&apos;ve come up with several innovations within data
                      collection, fusion, and core reasoning. We combine several
                      innovations in unique ways in our research.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.coreResearchAside}>
                <div className={styles.editorialBody}>
                  <p>
                    We learned first-hand how LLMs are not built for geospatial
                    needs. We set out to fix every technical issue that came with
                    GPT architecture and it converged into a new foundational
                    model, the LGM.
                  </p>
                </div>
                <Link href={blogHref(BLOG_SLUG.whyLlmsDidntCutIt)} className={styles.lgmInlineCta}>
                  <span>Why LLMs didn&apos;t work</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            <p className={styles.coreResearchIntroLine}>
              Our proprietary architecture is comprised of 3 parts. Within each
              are several innovations built during our practical research.
            </p>

            <ResearchAccordionProvider>
            <div className={styles.coreResearchGrid}>
              <CoreResearchArt />

              <div className={styles.coreResearchBody}>
                <ResearchGroup title={"1. Data Collection"}>
                  <p>
                    The most extensive data collection in the industry. Versatile
                    methods ranging from drones, car data, human data, public data
                    and more.
                  </p>
                  <p>
                    We&apos;ve achieved the cheapest{" "}
                    <Definition
                      term="P/POI."
                      title="P/POI — Price per Point of Interest"
                    >
                      The cost to capture a single geospatial data point. Lower
                      P/POI means richer, more affordable training data — a key
                      economic metric for any geospatial foundation model.
                    </Definition>
                  </p>
                  <Link href="/blog" className={styles.coreResearchGroupLink}>
                    Read our blog
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                      <path d="M2 8l6-6M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </ResearchGroup>

                <ResearchGroup title={"2. Fusion"}>
                  <p>
                    Accurate, automatic data filtering{" "}
                    <Definition
                      term="& labeling."
                      title="Automatic labeling"
                    >
                      The process of tagging raw, unstructured geospatial data
                      with structured metadata so a model can reason about it.
                      Our pipeline does this without human annotation.
                    </Definition>
                  </p>
                  <p>
                    We care about{" "}
                    <Definition
                      term="Ground Truths."
                      title="Ground truth"
                    >
                      A verified, real-world observation confirmed at a specific
                      X, Y, Z coordinate and time. Ground truths are the
                      reference signal we use to validate every layer of the
                      model.
                    </Definition>{" "}
                    We make sure each data point is the truth at that specific
                    X,Y,Z point at that given time.
                  </p>
                  <p>
                    Data scarcity is one of the hardest parts about the LGM
                    endeavor. To solve this, we have built innovative methods to
                    universally digest data. Meaning we are able to fuse data
                    together that our model then trains on. Cheaper and more
                    data &rarr; smarter model.
                  </p>
                </ResearchGroup>

                <ResearchGroup title={`3.${" "}Core Reasoning`}>
                  <p>
                    Our reasoning model considers temporal data, and sifts
                    through vast amounts of aggregated geospatial data &mdash;
                    including anthropologic data.
                  </p>
                  <p>
                    It continuously learns and creates new patterns through our
                    relational architecture.
                  </p>
                  <p>
                    Our core reasoning is comprised of a new permutation of
                    Reverse Diffusion and RAG architecture.
                  </p>
                  <Link href={blogHref(BLOG_SLUG.mappingUnknownGenLayers)} className={styles.coreResearchGroupLink}>
                    Read our Paper
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                      <path d="M2 8l6-6M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </ResearchGroup>

                <ResearchGroup title={`4.${" "}Answers, insights, patterns`}>
                  <p>One model, innumerable granular ground truths.</p>
                  <div className={styles.coreResearchProducts}>
                    <a href="/business" className={styles.coreResearchProduct}>
                      <span className={styles.coreResearchProductGlyph} aria-hidden>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logobueno.png" alt="" loading="lazy" decoding="async" />
                      </span>
                      <span>Columbus</span>
                    </a>
                    <a
                      href="https://mapsgpt.es"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.coreResearchProduct}
                    >
                      <span className={styles.coreResearchProductGlyph} aria-hidden>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/MapsGPT-logo.png" alt="" loading="lazy" decoding="async" />
                      </span>
                      <span>Elio</span>
                    </a>
                    <span
                      className={`${styles.coreResearchProduct} ${styles.coreResearchProductSoon}`}
                      aria-disabled="true"
                    >
                      <span>More Soon</span>
                    </span>
                  </div>
                </ResearchGroup>
              </div>
            </div>
            </ResearchAccordionProvider>

            <div className={styles.coreResearchCarousel}>
              <CoreResearchCarousel />
            </div>

            <a
              href="#"
              className={`${styles.lgmArticleCard} ${styles.lgmArticleCardGlass} ${styles.lgmArticleCardFlush} ${styles.lgmArticleCardBgWave}`}
            >
              <span className={styles.lgmArticleKicker}>Read our articles on</span>
              <p className={styles.lgmArticleHeadlineStrong}>
                our foundational model research
              </p>
            </a>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 4. Results / Model Columbus-01 + Gen Layers + The Grid ── */}
      <Slide id="data-collection" className={styles.dataCollectionSection}>
        <div className={styles.slideFrame}>
          <div className={styles.researchBlogWrap}>
          <RevealOnView className={`${styles.editorialSlide} ${styles.resultsSlide}`}>
            <p className={styles.lgmKicker}>RESULTS</p>
            <h2 className={styles.resultsTitle}>MODEL COLUMBUS-01</h2>
            <p className={styles.resultsLead}>The latest results from our development of the LGM.</p>

            <div className={styles.resultsGrid}>
              {[
                {
                  num: "1",
                  text: "Fast semantic reasoning in cities. Contextual enrichment.",
                },
                {
                  num: "2",
                  text: "Generative geospatial data",
                },
                {
                  num: "3",
                  text: "Generalist model, with access to wide catalogue",
                },
                {
                  num: "4",
                  text: "Deep spatial reasoning at scale",
                },
              ].map((item) => (
                <div key={item.num} className={styles.resultsCard}>
                  <div className={styles.resultsCardArt} aria-hidden>
                    <svg viewBox="0 0 100 100" fill="none" preserveAspectRatio="xMidYMid meet">
                      {/* Wireframe globe — outer rim, latitudes, longitudes, surface marker. */}
                      <circle cx="50" cy="50" r="34" stroke="rgba(255,255,255,0.85)" strokeWidth="0.9" />
                      <ellipse cx="50" cy="50" rx="34" ry="9" stroke="rgba(255,255,255,0.7)" strokeWidth="0.7" />
                      <ellipse cx="50" cy="50" rx="32" ry="22" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                      <ellipse cx="50" cy="50" rx="28" ry="32" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                      <line x1="50" y1="16" x2="50" y2="84" stroke="rgba(255,255,255,0.85)" strokeWidth="0.8" />
                      <line x1="34" y1="22" x2="66" y2="22" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                      <line x1="28" y1="34" x2="72" y2="34" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                      <line x1="28" y1="66" x2="72" y2="66" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                      <line x1="34" y1="78" x2="66" y2="78" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                      <circle cx="61" cy="40" r="3" fill="rgba(255,255,255,0.9)" />
                    </svg>
                  </div>
                  <h3 className={styles.resultsCardText}>{item.text}</h3>
                </div>
              ))}
            </div>

            <div className={styles.resultsArticlesRow}>
              <Link href={blogHref(BLOG_SLUG.mappingUnknownGenLayers)} className={`${styles.lgmArticleCard} ${styles.lgmArticleCardBgUnknownLayers}`}>
                <p>
                  Read our article on Mapping the<br />
                  <strong>unknown with Gen Layers</strong>
                </p>
              </Link>
              <Link href={blogHref(BLOG_SLUG.mimickingAdultBrain)} className={`${styles.lgmArticleCard} ${styles.lgmArticleCardBgDeepLayers}`}>
                <p>
                  Read our article on<br />
                  <strong>deep spatial reasoning</strong>
                </p>
              </Link>
            </div>
          </RevealOnView>

          </div>
        </div>
      </Slide>

      {/* ── 5. Research Blog ── */}
      <Slide id="research-blog">
        <div className={styles.slideFrame}>
          <div className={styles.researchBlogWrap}>
            <RevealOnView className={`${styles.editorialSlide} ${styles.researchEditorial}`}>
              <h2 className={styles.sectionTitle}>Read our latest releases</h2>
              <p className={styles.sectionLead}>
                Explore the innovative research and recent papers from our team.
              </p>

              {/* Blog cards grid — 3 columns matching /Blog page layout */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "48px 32px", marginTop: "48px" }}>
                {(() => {
                  const engineeringPosts = BLOG_POSTS.filter((p) => p.category === "ENGINEERING");
                  const joinUsPost = BLOG_POSTS.find((p) => p.slug === "join-us-research-opportunities");
                  const shuffled = [...engineeringPosts].sort(() => Math.random() - 0.5);
                  const selectedPosts = joinUsPost ? [joinUsPost, ...shuffled.slice(0, 2)] : shuffled.slice(0, 3);
                  return selectedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={blogHref(post.slug)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "16 / 10",
                          borderRadius: "13px",
                          overflow: "hidden",
                          background: "#ECEFF3",
                          marginBottom: "16px",
                        }}
                      >
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt=""
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(min-width: 768px) 33vw, 100vw"
                          />
                        ) : (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "linear-gradient(135deg, #0A3760 0%, #0F4C81 52%, #2C86C6 100%)",
                            }}
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 500, textTransform: "uppercase", color: "var(--tech-color-text-muted)" }}>
                            {post.category}
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--tech-color-text-muted)" }} aria-hidden="true">
                            ·
                          </span>
                          <span style={{ fontSize: "12px", fontWeight: 500, textTransform: "uppercase", color: "var(--tech-color-text-muted)" }}>
                            {post.date}
                          </span>
                        </div>
                        <h3 style={{ fontSize: "22px", color: "var(--tech-color-text)", margin: "0 0 8px", letterSpacing: "-0.015em" }}>
                          {post.title}
                        </h3>
                        <p style={{ fontSize: "16px", color: "var(--tech-color-text-muted)", margin: 0 }}>
                          {post.description}
                        </p>
                      </div>
                    </Link>
                  ));
                })()}
              </div>

              {/* Engineering articles from /Blog page — clean list rows */}
              <div className={styles.articleList}>
                {BLOG_POSTS.filter((p) => p.category === "ENGINEERING").map((post) => (
                  <Link
                    key={post.slug}
                    href={blogHref(post.slug)}
                    className={styles.articleRow}
                  >
                    <span className={styles.articleRowTitle}>{post.title}</span>
                    <div className={styles.articleRowRight}>
                      <span className={styles.articleRowDate}>{post.date}</span>
                      <span className={styles.articleRowArrow}>&rarr;</span>
                    </div>
                    <span className={styles.articleRowHoverLine} />
                  </Link>
                ))}
              </div>
            </RevealOnView>
          </div>
        </div>
      </Slide>

      {/* ── 6. Careers ── */}
      <Slide id="careers" className={styles.noSnapSection}>
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <div className={styles.careersFormShell}>
              <CareersContactForm
                intro={
                  <div className={styles.careersIntro}>
                    <h2 className={styles.sectionTitle}>Careers</h2>
                    <p className={styles.sectionLead}>
                      If you&apos;re excited about creating paradigm shifts in physical
                      world understanding.
                    </p>
                  </div>
                }
              />
            </div>
          </RevealOnView>
        </div>
      </Slide>
      </div>
    </>
  );
}
