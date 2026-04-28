import Image from "next/image";
import Link from "next/link";

import { blogHref, BLOG_SLUG } from "@/lib/blog-posts";
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
import { SidebarRightLine } from "./SidebarRightLine";
import { CareersContactForm } from "./CareersContactForm";
import { GenLayersSection } from "./GenLayersSection";
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

      {/* Right-edge divider line — mirrors sidebarPanel, bends outward at the LGM timeline with a gap */}
      <SidebarRightLine timelineId="lgm-timeline-track" />

      {/* Main content column */}
      <div>
      {/* ── 1. What's an LGM ── */}
      <Slide id="index">
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <div className={styles.lgmCompareLayout}>
              <div className={styles.lgmCompareText}>
                <span className={styles.sectionEyebrow}>What&rsquo;s an LGM</span>
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
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry&rsquo;s
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but
                    also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </div>
                <Link href={blogHref(BLOG_SLUG.foundingLgmsInDepth)} className={styles.lgmInlineCta}>
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
                  className={styles.lgmCompareArtImg}
                />
              </div>
            </div>

            {/* ── Nested-rectangles diagram ── */}
            <div className={styles.lgmCompareTable}>
              <h3 className={styles.lgmCompareTableTitle}>Our LGM adds a new dimension</h3>

              {/* Outer flex row — VLM bordered rect + LGM column */}
              <div className={styles.dimLgmOuter}>

                {/* VLM rect — bordered, contains LLM inner rect + VLM content */}
                <div className={styles.dimVlm}>

                  {/* LLM — bordered inner box */}
                  <div className={styles.dimLlm}>
                    <div>
                      <h4 className={styles.dimModelTitle}>LLM</h4>
                      <p className={styles.dimModelSubtitle}>Large-Language-model</p>
                    </div>
                    <div className={styles.dimPill}>
                      <p><strong>Captures:</strong> text</p>
                      <p><strong>Predicts:</strong> next word</p>
                    </div>
                    <div className={styles.dimPattern}>
                      <div className={styles.dimPatternPlaceholder} aria-hidden />
                      <span className={styles.dimPatternLabel}>language<br />patterns</span>
                    </div>
                    <div className={styles.dimLogos}>
                      <div className={styles.dimLogoPlaceholder} aria-hidden />
                      <div className={styles.dimLogoPlaceholder} aria-hidden />
                      <div className={styles.dimLogoPlaceholder} aria-hidden />
                      <div className={styles.dimLogoPlaceholder} aria-hidden />
                    </div>
                  </div>

                  {/* VLM content — right side inside VLM rect */}
                  <div className={styles.dimVlmContent}>
                    <div>
                      <h4 className={styles.dimModelTitle}>VLM</h4>
                      <p className={styles.dimModelSubtitle}>Vision-Language-model</p>
                    </div>
                    <div className={styles.dimPill}>
                      <p><strong>Captures:</strong> text &amp; image</p>
                      <p><strong>Predicts:</strong> visual reasoning</p>
                    </div>
                    <div className={styles.dimPattern}>
                      <div className={styles.dimPatternPlaceholder} aria-hidden />
                      <span className={styles.dimPatternLabel}>image<br />patterns</span>
                    </div>
                    <div className={styles.dimLogos}>
                      <div className={styles.dimLogoPlaceholder} aria-hidden />
                      <div className={styles.dimLogoPlaceholder} aria-hidden />
                      <div className={styles.dimLogoPlaceholder} aria-hidden />
                      <div className={styles.dimLogoPlaceholder} aria-hidden />
                    </div>
                  </div>

                </div>

                {/* LGM — right column, no box */}
                <div className={styles.dimLgm}>
                  <div>
                    <h4 className={styles.dimModelTitle}>LGM - IRL AI</h4>
                    <p className={styles.dimModelSubtitle}>Large-Geospatial-model</p>
                  </div>
                  <div className={styles.dimPill}>
                    <p><strong>Captures:</strong> physical (geospatial) reality</p>
                    <p><strong>Predicts:</strong> ground truth</p>
                  </div>
                  <div className={styles.dimPattern}>
                    <div className={styles.dimPatternPlaceholder} aria-hidden />
                    <span className={styles.dimPatternLabel}>physical<br />patterns</span>
                  </div>
                  <div className={styles.dimBrand}>
                    <div className={styles.dimBrandLogoPlaceholder} aria-hidden />
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
            <p className={styles.lgmKicker}>A NEW FOUNDATIONAL MODEL</p>
            <h2 className={styles.lgmFoundationalTitle}>
              A Large Geospatial Model is the next frontier in AI
            </h2>
            <p className={styles.lgmFoundationalLead}>And we&apos;ve already flown off the edge.</p>

            {(() => {
              // Timeline spans 2022 → 2028 inclusive (7 years) with a
              // 4%/4% gutter. yearMid(y) positions a milestone at mid-year.
              const yearAt = (y: number) =>
                `${(4 + ((y - 2022) / 7) * 92).toFixed(2)}%`;
              const yearMid = (y: number) => yearAt(y + 0.5);

              // 2025 + 2026 sit only one year apart — shift 2025 left and
              // 2026 right so their labels have breathing room.
              const x2025 = `calc(${yearMid(2025)} - clamp(72px, 9vw, 140px))`;
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
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop} ${styles.lgmTimelineMilestoneCompact}`} style={{ left: yearMid(2022) }}>
                <span className={styles.lgmTimelineYear}>2022</span>
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom}`} style={{ left: yearMid(2022) }}>
                <span className={styles.lgmTimelineStem} aria-hidden />
                <span className={styles.lgmTimelineLabel}>LLM</span>
              </div>

              {/* ─── 2025 — year above (no stem); Geo-tuned label below ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop} ${styles.lgmTimelineMilestoneCompact}`} style={{ left: x2025 }}>
                <span className={styles.lgmTimelineYear}>2025</span>
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom}`} style={{ left: x2025 }}>
                <span className={styles.lgmTimelineStem} aria-hidden />
                <span className={styles.lgmTimelineLabel}>
                  Geo-tuned LLM<br />&amp; Vision Models
                </span>
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

              {/* ─── 2026 — year floats above Generalist/LGM (one word per line), stem to dot, CTA below (no stem above CTA) ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`} style={{ left: x2026 }}>
                <span className={styles.lgmTimelineYear}>2026</span>
                <span className={styles.lgmTimelineLabel}>Generalist<br />LGM</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom}`} style={{ left: x2026 }}>
                <Link href={blogHref(BLOG_SLUG.timelineGeneralistLgm)} className={styles.lgmTimelineCta}>
                  <span>Read our Paper</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* ─── 2028 — year floats above UGM, stem to dot, CTA below (no stem above CTA) ─── */}
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`} style={{ left: yearMid(2028) }}>
                <span className={styles.lgmTimelineYear}>2028</span>
                <span className={styles.lgmTimelineLabel}>UGM</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
              </div>
              <div className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom}`} style={{ left: yearMid(2028) }}>
                <Link href={blogHref(BLOG_SLUG.ugmRoadmapGamePlan)} className={styles.lgmTimelineCta}>
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
                <Link href={blogHref(BLOG_SLUG.llmsGeospatialQueries)} className={styles.lgmInlineCta}>
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
                <ResearchGroup title="Data Collection">
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

                <ResearchGroup title="Fusion">
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

                <ResearchGroup title="Core Reasoning">
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
                  <Link href={blogHref(BLOG_SLUG.generativeGeospatialLayers)} className={styles.coreResearchGroupLink}>
                    Read our Paper
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                      <path d="M2 8l6-6M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </ResearchGroup>

                <ResearchGroup title="Answers, insights, patterns">
                  <p>One model, innumerable granular ground truths.</p>
                  <div className={styles.coreResearchProducts}>
                    <a href="/" className={styles.coreResearchProduct}>
                      <span className={styles.coreResearchProductGlyph} aria-hidden>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logobueno.png" alt="" />
                      </span>
                      <span>Columbus</span>
                    </a>
                    <a href="/products/mapsgpt" className={styles.coreResearchProduct}>
                      <span className={styles.coreResearchProductGlyph} aria-hidden>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/MapsGPT-logo.png" alt="" />
                      </span>
                      <span>Elio</span>
                    </a>
                    <a href="#" className={`${styles.coreResearchProduct} ${styles.coreResearchProductSoon}`}>
                      <span>More Soon</span>
                    </a>
                  </div>
                  <a href="/use-cases" className={styles.coreResearchGroupLink}>
                    Other use cases
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                      <path d="M2 8l6-6M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
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
              <div className={styles.resultsCard}>
                <div className={styles.resultsCardCopy}>
                  <span className={styles.resultsCardNumber}>1</span>
                  <p className={styles.resultsCardText}>
                    Fast semantic reasoning in cities.<br />Contextual enrichment.
                  </p>
                </div>
                <div className={styles.resultsCardArt} aria-hidden>
                  <svg viewBox="0 0 320 220" fill="none" preserveAspectRatio="xMidYMid slice">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={`vx${i}`} x1={40 + i * 32} y1="20" x2={-40 + i * 32} y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                      <line key={`hy${i}`} x1="0" y1={40 + i * 28} x2="320" y2={20 + i * 28} stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                    ))}
                    {[[80,70],[150,60],[220,75],[100,120],[175,110],[250,130],[120,170],[200,165]].map(([x,y], idx) => (
                      <g key={idx}>
                        <path d={`M${x} ${y} L${x+24} ${y-8} L${x+34} ${y+4} L${x+18} ${y+18} L${x} ${y+12} Z`} stroke="rgba(255,255,255,0.8)" strokeWidth="0.9" fill="none" />
                        <path d={`M${x+4} ${y-2} L${x+18} ${y-8}`} stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <div className={styles.resultsCard}>
                <div className={styles.resultsCardCopy}>
                  <span className={styles.resultsCardNumber}>2</span>
                  <p className={styles.resultsCardText}>
                    Generalist model,<br />with access to<br />wide catalogue
                  </p>
                </div>
                <div className={styles.resultsCardArt} aria-hidden>
                  <svg viewBox="0 0 320 220" fill="none" preserveAspectRatio="xMidYMid slice">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <line key={`g1-${i}`} x1={20 + i * 16} y1="120" x2={20 + i * 16} y2={120 + 40 * Math.sin((i / 18) * Math.PI * 2)} stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
                    ))}
                    <ellipse cx="160" cy="115" rx="100" ry="18" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
                    {Array.from({ length: 10 }).map((_, i) => (
                      <ellipse key={`r${i}`} cx="160" cy="115" rx={10 + i * 10} ry={2 + i * 1.8} stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
                    ))}
                    <circle cx="160" cy="115" r="14" stroke="rgba(255,255,255,0.9)" strokeWidth="0.8" fill="rgba(255,255,255,0.12)" />
                  </svg>
                </div>
              </div>

              <div className={styles.resultsCard}>
                <div className={styles.resultsCardCopy}>
                  <span className={styles.resultsCardNumber}>3</span>
                  <p className={styles.resultsCardText}>
                    Generative<br />geospatial data
                  </p>
                </div>
                <div className={styles.resultsCardArt} aria-hidden>
                  <svg viewBox="0 0 320 220" fill="none" preserveAspectRatio="xMidYMid slice">
                    {[0, 1, 2].map((layer) => {
                      const yBase = 60 + layer * 50;
                      return (
                        <g key={layer}>
                          {Array.from({ length: 14 }).map((_, i) => (
                            <line key={`vx${layer}-${i}`} x1={30 + i * 20} y1={yBase - 18} x2={10 + i * 20} y2={yBase + 18} stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
                          ))}
                          {Array.from({ length: 4 }).map((_, i) => (
                            <line key={`hz${layer}-${i}`} x1="30" y1={yBase - 18 + i * 12} x2="290" y2={yBase - 18 + i * 12 - 6} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                          ))}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className={styles.resultsCard}>
                <div className={styles.resultsCardCopy}>
                  <span className={styles.resultsCardNumber}>4</span>
                  <p className={styles.resultsCardText}>
                    Deep spatial<br />reasoning at<br />scale
                  </p>
                </div>
                <div className={styles.resultsCardArt} aria-hidden>
                  <svg viewBox="0 0 320 220" fill="none" preserveAspectRatio="xMidYMid slice">
                    <ellipse cx="160" cy="70" rx="110" ry="22" stroke="rgba(255,255,255,0.45)" strokeWidth="0.7" />
                    <ellipse cx="160" cy="170" rx="120" ry="24" stroke="rgba(255,255,255,0.45)" strokeWidth="0.7" />
                    {Array.from({ length: 14 }).map((_, i) => {
                      const a = (i / 14) * Math.PI * 2;
                      return <line key={`s${i}`} x1={160 + Math.cos(a) * 8} y1="110" x2={160 + Math.cos(a) * 50} y2={120 + Math.sin(a) * 4} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />;
                    })}
                    <path d="M150 30 L160 100 L170 30 M155 30 L165 95" stroke="rgba(255,255,255,0.75)" strokeWidth="0.8" fill="none" />
                    <path d="M160 110 L140 160 M160 110 L180 160 M160 110 L155 170 M160 110 L165 170" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.resultsArticlesRow}>
              <Link href={blogHref(BLOG_SLUG.mappingUnknownGenLayers)} className={`${styles.lgmArticleCard} ${styles.lgmArticleCardBgUnknownLayers}`}>
                <p>
                  Read our article on Mapping the<br />
                  <strong>unknown with Gen Layers</strong>
                </p>
              </Link>
              <Link href={blogHref(BLOG_SLUG.deepSpatialReasoningScale)} className={`${styles.lgmArticleCard} ${styles.lgmArticleCardBgDeepLayers}`}>
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

      {/* Gen Layers + The Grid — full-viewport-width band sitting between
          the data-collection and research-blog slides. Owns its own reveal
          animation via IntersectionObserver. */}
      <GenLayersSection />

      {/* ── 5. Research Blog ── */}
      <Slide id="research-blog">
        <div className={styles.slideFrame}>
          <div className={styles.researchBlogWrap}>
            <RevealOnView className={`${styles.editorialSlide} ${styles.researchEditorial}`}>
              <h2 className={styles.sectionTitle}>Read our latest releases</h2>
              <p className={styles.sectionLead}>
                Explore the innovative research and recent papers from our team.
              </p>

              {/* Featured papers — 1 wide + 4 narrow.
                  Hovering a narrow card swaps it with the featured card:
                  the hovered card grows to featured dimensions and its title
                  slides to the bottom (via the .researchCardSpacer flex-grow
                  transition); the featured shrinks and its title slides to
                  the top. */}
              <div className={styles.researchCardGrid}>
                {RESEARCH_CARDS.map((card, index) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className={
                      index === 0
                        ? `${styles.researchCard} ${styles.researchCardFeatured}`
                        : styles.researchCard
                    }
                    style={card.image ? { "--card-bg": `url(${card.image})` } as Record<string, string> : undefined}
                  >
                    <div className={styles.researchCardSpacer} aria-hidden="true" />
                    <span className={styles.researchCardTitle}>{card.title}</span>
                    <span className={styles.researchCardArrow}>&#8599;</span>
                  </Link>
                ))}
              </div>

              {/* All articles — clean list rows */}
              <div className={styles.articleList}>
                {RESEARCH_ARTICLES.map((article) => (
                  <Link
                    key={article.title}
                    href={article.href}
                    className={styles.articleRow}
                  >
                    <span className={styles.articleRowTitle}>{article.title}</span>
                    <div className={styles.articleRowRight}>
                      <span className={styles.articleRowDate}>{article.date}</span>
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
