import Image from "next/image";

import styles from "../technology.module.css";
import { TechScrollIndex } from "../TechScrollIndex";
import {
  RESEARCH_ARTICLES,
  RESEARCH_CARDS,
} from "./content";
import { Definition } from "./Definition";
import { ResearchGroup } from "./ResearchGroup";
import { RevealOnView } from "./RevealOnView";
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
                <a href="#" className={styles.lgmInlineCta}>
                  <span>Read our in-depth article</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <div className={styles.lgmCompareArt} aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/TechnologyPageImages/LGMsummaryGraphic.svg"
                  alt=""
                  className={styles.lgmCompareArtImg}
                />
              </div>
            </div>

            {/* ── Comparison table ── */}
            <div className={styles.lgmCompareTable} aria-hidden={false}>
              <h3 className={styles.lgmCompareTableTitle}>Whats the difference?</h3>

              <div className={styles.lgmCompareTableHead}>
                <div />
                <div className={styles.lgmCompareColHead}>LLM</div>
                <div className={styles.lgmCompareColHead}>Vision Model</div>
                <div className={styles.lgmCompareColHead}>LGM</div>
              </div>

              <div className={styles.lgmCompareTableBody}>
                <div className={styles.lgmCompareRowLabel}>
                  <div>Input</div>
                  <div>Output</div>
                </div>
                <div className={styles.lgmCompareCell}>
                  <p className={styles.lgmCompareCellText}>
                    alargelanguagelearningmodelistrainedonhugesetsoftextdatafortokenizationofmanywordsoftenfromarticleslargetextbookset
                    280, 1170, 296, 4088, 30773, 4012, 5079, 2534, 3883, 263,
                  </p>
                </div>
                <div className={styles.lgmCompareCell} />
                <div className={styles.lgmCompareCell} />
              </div>

              <div className={styles.lgmCompareTableExamples}>
                <div className={styles.lgmCompareRowLabel}>Examples</div>

                {/* LLM — 2×2 logo grid (names kept in alt + sr-only for a11y/SEO) */}
                <div className={styles.lgmCompareExampleCell}>
                  <div className={styles.lgmLogoGrid}>
                    <div className={styles.lgmLogoItem} title="ChatGPT">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/TechnologyPageImages/LogosTable/ChatGPT-Vertical-Logo-Vector.svg-.png"
                        alt="ChatGPT"
                        className={styles.lgmLogoMark}
                      />
                      <span className={styles.srOnly}>ChatGPT</span>
                    </div>
                    <div className={styles.lgmLogoItem} title="Claude">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/TechnologyPageImages/LogosTable/Claude_AI_logo.svg.png"
                        alt="Claude"
                        className={styles.lgmLogoMark}
                      />
                      <span className={styles.srOnly}>Claude</span>
                    </div>
                    <div className={styles.lgmLogoItem} title="Grok">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/TechnologyPageImages/LogosTable/Grok-feb-2025-logo.svg.png"
                        alt="Grok"
                        className={styles.lgmLogoMark}
                      />
                      <span className={styles.srOnly}>Grok</span>
                    </div>
                    <div className={styles.lgmLogoItem} title="Perplexity">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/TechnologyPageImages/LogosTable/Perplexity_AI_logo.svg.png"
                        alt="Perplexity"
                        className={styles.lgmLogoMark}
                      />
                      <span className={styles.srOnly}>perplexity</span>
                    </div>
                  </div>
                </div>

                {/* Vision Model — text list */}
                <div className={styles.lgmCompareExampleCell}>
                  <ul className={styles.lgmCompareExampleList}>
                    <li>Clay</li>
                    <li>Google Deepmind</li>
                    <li>Maxar</li>
                  </ul>
                </div>

                {/* LGM — Columbus Earth */}
                <div className={styles.lgmCompareExampleCell}>
                  <div className={styles.lgmCompareBrandMark}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logobueno.png"
                      alt=""
                      className={styles.lgmBrandMarkLogo}
                    />
                    <span>Columbus Earth</span>
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

            <div className={styles.lgmTimeline}>
              {/* Soft brand-blue halo above + below the horizontal track */}
              <div className={styles.lgmTimelineHalo} aria-hidden />

              {/* Horizontal track + dots at each milestone year */}
              <div className={styles.lgmTimelineTrack} aria-hidden>
                <span className={styles.lgmTimelineDot} style={{ left: "8%" }} />
                <span className={styles.lgmTimelineDot} style={{ left: "50%" }} />
                <span className={styles.lgmTimelineDot} style={{ left: "64%" }} />
                <span className={styles.lgmTimelineDot} style={{ left: "92%" }} />
              </div>

              {/* Milestones — alternating above / below the track */}
              <div
                className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`}
                style={{ left: "8%" }}
              >
                <span className={styles.lgmTimelineLabel}>LLM</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
                <span className={styles.lgmTimelineYear}>2022</span>
              </div>

              <div
                className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom}`}
                style={{ left: "50%" }}
              >
                <span className={styles.lgmTimelineYear}>2025</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
                <span className={styles.lgmTimelineLabel}>
                  Geo-tuned LLM<br />&amp; Vision Models
                </span>
              </div>

              <div
                className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneTop}`}
                style={{ left: "64%" }}
              >
                <a href="#" className={styles.lgmTimelineCta}>
                  <span>Read our Paper</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <span className={styles.lgmTimelineLabel}>Generalist LGM</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
                <span className={styles.lgmTimelineYear}>2026</span>
              </div>

              <div
                className={`${styles.lgmTimelineMilestone} ${styles.lgmTimelineMilestoneBottom}`}
                style={{ left: "92%" }}
              >
                <span className={styles.lgmTimelineYear}>2028</span>
                <span className={styles.lgmTimelineStem} aria-hidden />
                <span className={styles.lgmTimelineLabel}>UGM</span>
                <a href="#" className={styles.lgmTimelineCta}>
                  <span>Our Game Plan</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              {/* Keyword text — kept in the DOM for crawlers + screen readers, visually hidden */}
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

            <a
              href="#"
              className={`${styles.lgmArticleCard} ${styles.lgmArticleCardGlass}`}
            >
              <span className={styles.lgmArticleKicker}>Read our article on</span>
              <p className={styles.lgmArticleHeadline}>
                the drawbacks of LLMs &amp; vision models.
              </p>
              <p className={styles.lgmArticleHeadlineStrong}>
                How the LGM innovates.
              </p>
            </a>
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
                <a href="#" className={styles.lgmInlineCta}>
                  <span>Why LLMs didn&apos;t work</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>

            <p className={styles.coreResearchIntroLine}>
              Our proprietary architecture is comprised of 3 parts. Within each
              are several innovations built during our practical research.
            </p>

            <div className={styles.coreResearchGrid}>
              <div className={styles.coreResearchArt} aria-hidden>
                <svg viewBox="0 0 300 420" fill="none" preserveAspectRatio="xMidYMid meet">
                  <path d="M40 60 L260 60 L230 130 L70 130 Z" stroke="rgba(10,19,68,0.7)" strokeWidth="1" fill="none" />
                  <path d="M40 60 L70 130" stroke="rgba(10,19,68,0.7)" strokeWidth="1" />
                  <path d="M260 60 L230 130" stroke="rgba(10,19,68,0.7)" strokeWidth="1" />
                  <path d="M70 180 L230 180 L210 250 L90 250 Z" stroke="rgba(10,19,68,0.7)" strokeWidth="1" fill="none" />
                  <path d="M70 180 L90 250" stroke="rgba(10,19,68,0.7)" strokeWidth="1" />
                  <path d="M230 180 L210 250" stroke="rgba(10,19,68,0.7)" strokeWidth="1" />
                  <path d="M30 290 L270 290 L245 380 L55 380 Z" stroke="rgba(10,19,68,0.7)" strokeWidth="1" fill="none" />
                  <path d="M30 290 L55 380" stroke="rgba(10,19,68,0.7)" strokeWidth="1" />
                  <path d="M270 290 L245 380" stroke="rgba(10,19,68,0.7)" strokeWidth="1" />
                </svg>
              </div>

              <div className={styles.coreResearchBody}>
                <ResearchGroup title="Data Collection" autoOpenOnView>
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
                  <a href="#" className={styles.coreResearchGroupLink}>
                    Read our blog
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                      <path d="M2 8l6-6M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
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
                  <a href="#" className={styles.coreResearchGroupLink}>
                    Read our Paper
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                      <path d="M2 8l6-6M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </ResearchGroup>

                <ResearchGroup title="Answers, insights, patterns">
                  <p>One model. Two products.</p>
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

            <a
              href="#"
              className={`${styles.lgmArticleCard} ${styles.lgmArticleCardGlass} ${styles.lgmArticleCardFlush}`}
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
              <a href="#" className={styles.lgmArticleCard}>
                <p>
                  Read our article on Mapping the<br />
                  <strong>unknown with Gen Layers</strong>
                </p>
              </a>
              <a href="#" className={styles.lgmArticleCard}>
                <p>
                  Read our article on<br />
                  <strong>deep spatial reasoning</strong>
                </p>
              </a>
            </div>
          </RevealOnView>

          {/* Gen Layers + The Grid — moved here from section 5 so it sits
              alongside the Results / "A New Category" content. */}
          <div className={`${styles.genLayersBand} ${styles.darkSurface}`}>
            <RevealOnView className={styles.genLayersInner}>
              <div className={styles.genLayersHead}>
                {/* Voyager-style starburst on the right, white strokes on the
                    dark band. The long horizontal arm extends across the row
                    and the "Gen Layers" label sits at its left end (with a
                    matching dark background to mask the line behind the text). */}
                <svg
                  className={styles.genLayersHeadStarburst}
                  viewBox="0 0 1600 220"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden
                >
                  {(() => {
                    const cx = 1500;
                    const cy = 110;
                    const stroke = "rgba(255, 255, 255, 0.92)";
                    type TickStyle = "even" | "end" | "none";
                    type Arm = { angle: number; len: number; ticks: TickStyle };
                    const arms: Arm[] = [
                      { angle: 180.4, len: 1460, ticks: "end" },
                      { angle: 187, len: 200, ticks: "even" },
                      { angle: 226, len: 90, ticks: "even" },
                      { angle: 252, len: 100, ticks: "none" },
                      { angle: 267, len: 105, ticks: "none" },
                      { angle: 282, len: 100, ticks: "none" },
                      { angle: 317, len: 80, ticks: "end" },
                      { angle: 350, len: 85, ticks: "even" },
                      { angle: 4, len: 85, ticks: "even" },
                      { angle: 31, len: 95, ticks: "even" },
                      { angle: 66, len: 100, ticks: "even" },
                      { angle: 90, len: 105, ticks: "even" },
                      { angle: 113, len: 105, ticks: "none" },
                      { angle: 147, len: 95, ticks: "even" },
                    ];
                    return arms.map((arm, i) => {
                      const rad = (arm.angle * Math.PI) / 180;
                      const x2 = cx + Math.cos(rad) * arm.len;
                      const y2 = cy + Math.sin(rad) * arm.len;
                      const perp = rad + Math.PI / 2;
                      const tickHalf = 3.6;
                      const buildTicks = () => {
                        if (arm.ticks === "none") return [] as number[];
                        const spacing = 9;
                        if (arm.ticks === "even") {
                          const out: number[] = [];
                          for (let d = 18; d <= arm.len - 14; d += spacing) out.push(d);
                          return out;
                        }
                        const count = Math.min(8, Math.floor(arm.len / 14));
                        return Array.from({ length: count }, (_, k) => arm.len - 14 - k * spacing);
                      };
                      const ticks = buildTicks();
                      return (
                        <g key={i}>
                          <line
                            x1={cx}
                            y1={cy}
                            x2={x2}
                            y2={y2}
                            stroke={stroke}
                            strokeWidth="1.4"
                            strokeLinecap="round"
                          />
                          {ticks.map((d, t) => {
                            const tx = cx + Math.cos(rad) * d;
                            const ty = cy + Math.sin(rad) * d;
                            return (
                              <line
                                key={t}
                                x1={tx - Math.cos(perp) * tickHalf}
                                y1={ty - Math.sin(perp) * tickHalf}
                                x2={tx + Math.cos(perp) * tickHalf}
                                y2={ty + Math.sin(perp) * tickHalf}
                                stroke={stroke}
                                strokeWidth="1"
                                strokeLinecap="round"
                              />
                            );
                          })}
                        </g>
                      );
                    });
                  })()}
                </svg>
                <span className={styles.genLayersHeadLabel}>Gen Layers</span>
              </div>

              <div className={styles.genLayersTriptych}>
                <h3 className={styles.genLayersHeadline}>
                  Dynamically creating geodata layers, without complex and
                  expensive surveying.
                </h3>

                <div className={styles.genLayersTilesRow}>
                  <div className={styles.genLayersTile}>
                    <div className={styles.genLayersTileArt} aria-hidden>
                      <svg viewBox="0 0 240 280" fill="none" preserveAspectRatio="xMidYMid slice">
                        <rect width="240" height="280" fill="rgba(40, 70, 40, 0.35)" />
                        {Array.from({ length: 40 }).map((_, i) => (
                          <rect key={i} x={(i * 37) % 220} y={(i * 53) % 260} width={(i % 3) + 4} height={(i % 4) + 4} fill={i % 5 === 0 ? "rgba(37,99,235,0.75)" : i % 3 === 0 ? "rgba(220, 110, 80, 0.7)" : "rgba(255,255,255,0.15)"} />
                        ))}
                      </svg>
                    </div>
                    <span className={styles.genLayersTileKicker}>Columbus GenLayer</span>
                    <span className={styles.genLayersTileTitle}>Solar roof possibility</span>
                  </div>

                  <div className={styles.genLayersTile}>
                    <div className={styles.genLayersTileArt} aria-hidden>
                      <svg viewBox="0 0 240 280" fill="none" preserveAspectRatio="xMidYMid slice">
                        <rect width="240" height="280" fill="rgba(130, 70, 50, 0.65)" />
                        {Array.from({ length: 60 }).map((_, i) => (
                          <path key={i} d={`M${(i * 17) % 230} ${(i * 31) % 270} l${(i % 6) + 4} ${(i % 5) + 2}`} stroke="rgba(60, 40, 30, 0.7)" strokeWidth="0.8" />
                        ))}
                        <path d="M40 140 Q130 130 200 155" stroke="rgba(80, 130, 80, 0.85)" strokeWidth="8" fill="none" />
                      </svg>
                    </div>
                    <span className={styles.genLayersTileKicker}>Columbus GenLayer</span>
                    <span className={styles.genLayersTileTitle}>Resident Vibes</span>
                  </div>

                  <div className={styles.genLayersTile}>
                    <div className={styles.genLayersTileArt} aria-hidden>
                      <svg viewBox="0 0 240 280" fill="none" preserveAspectRatio="xMidYMid slice">
                        <rect width="240" height="280" fill="rgba(120, 120, 120, 0.45)" />
                        {Array.from({ length: 40 }).map((_, i) => {
                          const colors = ["rgba(220, 60, 60, 0.85)", "rgba(230, 200, 60, 0.85)", "rgba(80, 200, 120, 0.85)"];
                          const color = colors[i % 3];
                          return <rect key={i} x={(i * 29) % 220} y={(i * 41) % 260} width={(i % 4) + 6} height={(i % 2) + 3} fill={color} />;
                        })}
                      </svg>
                    </div>
                    <span className={styles.genLayersTileKicker}>Columbus GenLayer</span>
                    <span className={styles.genLayersTileTitle}>Safety Score</span>
                  </div>
                </div>

                <a href="/use-cases" className={styles.genLayersExploreBtn}>
                  <span>Explore more maps we&apos;ve made</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <div className={styles.genLayersGrid}>
                <span className={styles.genLayersGridKicker}>THE GRID</span>
                <div className={styles.genLayersGridArt} aria-hidden>
                  <svg viewBox="0 0 900 520" fill="none" preserveAspectRatio="xMidYMid slice">
                    <rect width="900" height="520" fill="rgba(18, 25, 40, 0.85)" />
                    {Array.from({ length: 28 }).map((_, i) => (
                      <line key={`vx${i}`} x1={i * 34} y1="0" x2={i * 34 - 80} y2="520" stroke="rgba(180, 180, 190, 0.12)" strokeWidth="0.6" />
                    ))}
                    {Array.from({ length: 16 }).map((_, i) => (
                      <line key={`hz${i}`} x1="0" y1={i * 34} x2="900" y2={i * 34 - 30} stroke="rgba(180, 180, 190, 0.12)" strokeWidth="0.6" />
                    ))}
                    <polygon points="360,180 540,180 560,280 340,280" fill="rgba(240, 240, 240, 0.75)" stroke="rgba(220, 220, 220, 0.85)" />
                    <polygon points="340,280 560,280 580,340 320,340" fill="rgba(230, 230, 230, 0.55)" />
                    {[[150, 150, 80, 60], [680, 140, 100, 70], [140, 370, 110, 70], [700, 370, 90, 80]].map(([x, y, w, h], idx) => (
                      <g key={idx}>
                        <rect x={x} y={y} width={w} height={h} fill="rgba(60, 70, 85, 0.85)" stroke="rgba(140, 150, 170, 0.6)" />
                        <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} fill="rgba(90, 100, 115, 0.55)" />
                      </g>
                    ))}
                  </svg>
                  <span className={styles.genLayersGridCaption}>SHIBUYA, TOKYO</span>
                </div>
              </div>
            </RevealOnView>
          </div>
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

              {/* Featured papers — 1 wide + 4 narrow.
                  Hovering a narrow card swaps it with the featured card:
                  the hovered card grows to featured dimensions and its title
                  slides to the bottom (via the .researchCardSpacer flex-grow
                  transition); the featured shrinks and its title slides to
                  the top. */}
              <div className={styles.researchCardGrid}>
                <a
                  href={RESEARCH_CARDS[0].href}
                  className={`${styles.researchCard} ${styles.researchCardFeatured}`}
                >
                  <div className={styles.researchCardSpacer} aria-hidden="true" />
                  <span className={styles.researchCardTitle}>
                    Philosophy behind a Universal Geospatial Model
                  </span>
                  <span className={styles.researchCardArrow}>&#8599;</span>
                </a>

                <a href={RESEARCH_CARDS[1].href} className={styles.researchCard}>
                  <div className={styles.researchCardSpacer} aria-hidden="true" />
                  <span className={styles.researchCardTitle}>
                    Mimicking the adult brain.
                  </span>
                  <span className={styles.researchCardArrow}>&#8599;</span>
                </a>
                <a href={RESEARCH_CARDS[2].href} className={styles.researchCard}>
                  <div className={styles.researchCardSpacer} aria-hidden="true" />
                  <span className={styles.researchCardTitle}>
                    Earth recipes.
                  </span>
                  <span className={styles.researchCardArrow}>&#8599;</span>
                </a>
                <a href="#" className={styles.researchCard}>
                  <div className={styles.researchCardSpacer} aria-hidden="true" />
                  <span className={styles.researchCardTitle}>
                    Research, creating a fire prediction model.
                  </span>
                  <span className={styles.researchCardArrow}>&#8599;</span>
                </a>
              </div>

              {/* All articles — clean list rows */}
              <div className={styles.articleList}>
                {RESEARCH_ARTICLES.map((article) => (
                  <a
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
                  </a>
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

            <h2 className={styles.sectionTitle}>Careers</h2>
            <p className={styles.sectionLead}>
              If you&apos;re excited about creating paradigm shifts in physical
              world understanding. <strong>Join us now.</strong>
            </p>

            <form
              action="mailto:contact@columbus.earth?subject=Careers%20Application"
              method="post"
              encType="text/plain"
              className={styles.careersForm}
            >
              <label>
                <span>Name</span>
                <input type="text" name="name" autoComplete="name" required />
              </label>

              <label>
                <span>Enter email</span>
                <input type="email" name="email" autoComplete="email" required />
              </label>

              <div className={styles.careersFormMeta}>
                <button type="submit" className={styles.careersSend}>
                  Send application
                </button>
                <p>We accept interns.</p>
              </div>
            </form>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 7. Hiring Humans ── */}
      <Slide
        id="hiring-humans"
        className={[styles.hiringSection, styles.fullBleedSection, styles.noSnapSection].join(" ")}
      >
        <div className={styles.slideFrame}>
          <div className={styles.hiringArcWrap}>
            <div className={styles.hiringArcHighlight} aria-hidden="true" />
            <RevealOnView className={styles.hiringCopy}>
              <h2>Hiring Humans.</h2>
              <p>Our team is based in Washington DC and Madrid.</p>
            </RevealOnView>
          </div>
        </div>
      </Slide>
      </div>
    </>
  );
}
