import styles from "../technology.module.css";
import { TechScrollIndex } from "../TechScrollIndex";
import {
  RESEARCH_ARTICLES,
  RESEARCH_CARDS,
} from "./content";
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
      {/* ── 1. Why an LGM ── */}
      <Slide id="index" className={styles.dotGrid}>
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <h2 className={styles.sectionTitle}>Why an LGM is needed</h2>
            <div className={styles.editorialBody}>
              <p>
                AI has made extraordinary progress in understanding language, but
                the physical world remains largely uncharted territory for
                machine intelligence. There is no foundational model that truly
                comprehends geography, spatial relationships, and the built
                environment at scale.
              </p>
              <p>
                The decisions that shape our cities, infrastructure, and natural
                resources are still made without the benefit of deep spatial
                reasoning. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris.
              </p>
              <p>
                A Large Geospatial Model fills this gap — a foundational model
                purpose-built to reason about Earth, its terrain, its
                infrastructure, and the patterns that emerge when billions of
                spatial data points converge. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            </div>
            <a href="/use-cases" className={styles.sectionCta}>
              <span>Explore use cases</span>
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden>
                <path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 2. Our Research (Synopsis) ── */}
      <Slide id="lgm-vs-llm" className={styles.lgmSlide}>
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>
            <h2 className={styles.sectionTitle}>Our Research</h2>
            <p className={styles.sectionLead}>
              We&apos;ve come up with several innovations within data collection,
              fusion, and reasoning, which we combine in unique ways in our
              research.
            </p>
            <div className={styles.editorialBody}>
              <p>
                <strong>Proprietary Data Collection.</strong> Our collection
                methodology goes beyond conventional satellite imagery and public
                datasets. We&apos;ve developed autonomous ingestion pipelines
                that harvest geospatial signals from dormant data sources —
                infrastructure telemetry, environmental sensors, commercial
                transaction patterns — and normalize them into a unified
                coordinate fabric. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </p>
              <p>
                <strong>Data Digestion &amp; Fusion.</strong> Raw geospatial data
                is inherently fragmented, contradictory, and incomplete. Our
                fusion engine spatially pairs unformatted data, resolves
                geocoding conflicts, and structures broken datasets into coherent
                layers. Sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua. Ut enim ad minim veniam.
              </p>
              <p>
                <strong>Comprehension &amp; Extrapolation.</strong> Where
                traditional systems store and retrieve, our model comprehends —
                understanding the semantic nature of a city&apos;s fabric, the
                relationship between terrain and infrastructure, and the patterns
                that predict what should exist where it doesn&apos;t yet. Duis
                aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur.
              </p>
              <p>
                <strong>Generative Layer Synthesis.</strong> From comprehension,
                the model generates entirely new geospatial layers — predictions
                about solar roof viability, resident behavior patterns, safety
                scoring — without expensive manual surveying. Excepteur sint
                occaecat cupidatat non proident.
              </p>
              <p>
                <strong>Coordinate-level Reasoning.</strong> The final stage
                combines all upstream innovations into a reasoning engine that
                operates at the coordinate level, drawing inferences across
                billions of spatial data points simultaneously. This is the core
                of the Universal Geospatial Model. Lorem ipsum dolor sit amet
                consectetur adipiscing elit integer nec odio.
              </p>
            </div>

            {/* Timeline labels above the line */}
            <div className={styles.timelineLabels}>
              <div className={styles.timelineLabel}>
                <span>LLM</span>
                <div className={styles.timelineLabelStick} />
              </div>
              <div className={styles.timelineLabel}>
                <span>Geo-tuned LLM<br />+ Vision Models</span>
                <div className={styles.timelineLabelStick} />
              </div>
              <div className={styles.timelineLabel}>
                <span>Generalist<br />LGM</span>
                <div className={styles.timelineLabelStick} />
              </div>
              <div className={styles.timelineLabel}>
                <span>Universal<br />Geospatial<br />Model</span>
                <div className={styles.timelineLabelStick} />
              </div>
            </div>

            <div className={styles.comparisonTrack} />

            <div className={styles.comparisonGrid}>
              <div className={styles.comparisonColumn}>
                <div className={styles.comparisonBody}>
                  <p>A large language model is trained on huge sets of text data for tokenization</p>
                  <p className={styles.comparisonMono}>280, 1170, 296, 4088, 30773, 4012, 5079, 2534, 3883, 263, 29072, 268, 64696</p>
                </div>
                <div className={styles.comparisonFooter}>
                  <span>[ Transformer Attention ]</span>
                  <p>Drawbacks: hallucination</p>
                </div>
                <a href="#" className={styles.comparisonLink}>Read our in-depth article &#8250;</a>
              </div>

              <div className={styles.comparisonColumn}>
                <div className={styles.comparisonBody}>
                  <p>Comprehending images, and predicting certain things like size from Earth imagery and context.</p>
                </div>
                <div className={styles.comparisonFooter}>
                  <span>[ Reverse Diffusion ]</span>
                </div>
              </div>

              <div className={styles.comparisonColumn}>
                <div className={styles.comparisonBody}>
                  <p>Big Data pre-trained Large Geospatial Model</p>
                  <p>requiring fine-tuned labeling for each earth topic (e.g. physics etc)</p>
                </div>
                <a href="#" className={styles.comparisonLink}>Read our Paper &#8250;</a>
              </div>

              <div className={styles.comparisonColumn}>
                <div className={styles.comparisonBody}>
                  <p>An AGI for the physical world</p>
                </div>
                <a href="#" className={styles.comparisonLink}>Our Game Plan &#8250;</a>
              </div>
            </div>
            <a href="#" className={styles.sectionCta}>
              <span>Read our research papers</span>
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden>
                <path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 3. Glimpse under the hood ── */}
      <Slide id="core-reasoning" className={styles.coreReasoningSlide}>
        <div className={styles.verticalLineOverlay} aria-hidden="true" />
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>
            <h2 className={styles.sectionTitle}>Glimpse under the hood</h2>
            <p className={styles.sectionLead}>
              Three stages — collect, fuse, reason — working together to
              produce spatial intelligence at scale.
            </p>
            <div className={styles.editorialBody}>
              <p>
                <strong>Data Collection.</strong> We ingest geospatial data from
                hundreds of sources — satellite imagery, sensor networks, public
                records, and proprietary feeds — normalizing them into a unified
                coordinate system.
              </p>
              <p>
                <strong>Fusion.</strong> Fragmented, broken, and unlabeled data
                is spatially paired, geocoded, and structured. Our pipeline
                resolves conflicts between overlapping datasets and fills gaps
                through intelligent interpolation.
              </p>
              <p>
                <strong>Reasoning.</strong> The model reasons over fused data
                using coordinate-level attention — understanding not just what
                exists at a location, but how it relates to everything around it.
              </p>
            </div>

            {/* Horizontal pipeline diagram:
                Many sources → converge → Database → split → Brain Model + Earth Grid → Insights */}
            <div className={styles.pipelineHorizontal}>
              {/* Stage 1: Data Collection — 5 tiles stacked vertically */}
              <div className={styles.pipelineStage}>
                <div className={styles.pipelineLabel}>Data Collection &amp; Labeling</div>
                <div className={styles.pipelineTilesV}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={`tile-${index}`} className={styles.pipelineTile} />
                  ))}
                </div>
              </div>

              {/* Converging lines: 5 sources → 1 */}
              <svg className={styles.pipelineConverge} viewBox="0 0 80 100" fill="none" aria-hidden>
                {[10, 30, 50, 70, 90].map((y) => (
                  <path key={y} d={`M0 ${y} C40 ${y} 60 50 80 50`} className={styles.dashedPathRed} />
                ))}
              </svg>

              {/* Stage 2: Columbus Database */}
              <div className={styles.pipelineStage}>
                <div className={styles.pipelineLabel}>Columbus Database</div>
                <div className={styles.pipelineNode} />
              </div>

              {/* Splitting lines: 1 → 2 */}
              <svg className={styles.pipelineSplit} viewBox="0 0 80 80" fill="none" aria-hidden>
                <path d="M0 40 C20 40 40 20 80 20" className={styles.dashedPathRed} />
                <path d="M0 40 C20 40 40 60 80 60" className={styles.dashedPathRed} />
              </svg>

              {/* Stage 3: Brain Model + Earth Grid stacked */}
              <div className={styles.pipelineOutputs}>
                <div className={styles.pipelineStageSmall}>
                  <div className={styles.pipelineLabel}>Brain Model</div>
                  <div className={styles.pipelineBlob} />
                </div>
                <div className={styles.pipelineStageSmall}>
                  <div className={styles.pipelineLabel}>Earth Grid</div>
                  <div className={styles.pipelineGridIcon} />
                </div>
              </div>

              {/* Final arrow */}
              <svg className={styles.pipelineArrowH} viewBox="0 0 60 24" fill="none" aria-hidden>
                <path d="M0 12 L48 12 M40 4 L48 12 L40 20" className={styles.dashedPathRed} />
              </svg>

              {/* Result */}
              <div className={styles.pipelineResult}>
                <span>Insights, Patterns, Answers.</span>
              </div>
            </div>

            <a href="/maps-gpt" className={styles.sectionCta}>
              <span>Try it yourself</span>
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden>
                <path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 4. Results ── */}
      <Slide id="data-collection" className={styles.dataCollectionSection}>
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>
            <h2 className={styles.sectionTitle}>Results</h2>
            <p className={styles.sectionLead}>
              The products of an LGM — what it produces, how it performs, and
              how it compares.
            </p>

            <div className={styles.metricGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricNumber}>13T+</span>
                <span className={styles.metricLabel}>Grid cells indexed</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricNumber}>100m</span>
                <span className={styles.metricLabel}>Resolution per cell</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricNumber}>Global</span>
                <span className={styles.metricLabel}>Earth coverage</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricNumber}>3&times;</span>
                <span className={styles.metricLabel}>Accuracy vs traditional</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricNumber}>Real-time</span>
                <span className={styles.metricLabel}>Processing speed</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricNumber}>500+</span>
                <span className={styles.metricLabel}>Data sources fused</span>
              </div>
            </div>

            <a href="/use-cases" className={styles.sectionCta}>
              <span>See it in action</span>
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden>
                <path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 5. Research ── */}
      <Slide id="research-blog">
        <div className={styles.slideFrame}>
          <RevealOnView className={`${styles.editorialSlide} ${styles.researchEditorial}`}>

            <h2 className={styles.sectionTitle}>Read our latest releases</h2>
            <p className={styles.sectionLead}>
              Explore the innovative research and recent papers from our team.
            </p>

            {/* Featured papers — rectangular card grid */}
            <div className={styles.researchCardGrid}>
              {/* Card 1: Philosophy — wireframe globe */}
              <a href={RESEARCH_CARDS[0].href} className={styles.researchCard}>
                <svg className={styles.researchCardArt} viewBox="0 0 200 200" fill="none" aria-hidden>
                  <circle cx="100" cy="100" r="70" stroke="rgba(37,99,235,0.3)" strokeWidth="1" />
                  <ellipse cx="100" cy="100" rx="70" ry="30" stroke="rgba(37,99,235,0.22)" strokeWidth="0.8" />
                  <ellipse cx="100" cy="100" rx="70" ry="50" stroke="rgba(37,99,235,0.22)" strokeWidth="0.8" />
                  <ellipse cx="100" cy="100" rx="30" ry="70" stroke="rgba(37,99,235,0.22)" strokeWidth="0.8" />
                  <ellipse cx="100" cy="100" rx="50" ry="70" stroke="rgba(37,99,235,0.22)" strokeWidth="0.8" />
                  <line x1="30" y1="100" x2="170" y2="100" stroke="rgba(37,99,235,0.35)" strokeWidth="1" />
                  <line x1="100" y1="30" x2="100" y2="170" stroke="rgba(37,99,235,0.35)" strokeWidth="1" />
                  <line x1="30" y1="80" x2="170" y2="80" stroke="rgba(37,99,235,0.15)" strokeWidth="0.6" />
                  <line x1="30" y1="120" x2="170" y2="120" stroke="rgba(37,99,235,0.15)" strokeWidth="0.6" />
                </svg>
                <span className={styles.researchCardTitle}>{RESEARCH_CARDS[0].title}</span>
                <span className={styles.researchCardArrow}>&#8599;</span>
              </a>

              {/* Card 2: Architecture — grid/network diagram */}
              <a href={RESEARCH_CARDS[1].href} className={styles.researchCard}>
                <svg className={styles.researchCardArt} viewBox="0 0 200 200" fill="none" aria-hidden>
                  {/* Grid lines */}
                  {[40, 80, 120, 160].map(x => (
                    <line key={`v${x}`} x1={x} y1="30" x2={x} y2="170" stroke="rgba(37,99,235,0.18)" strokeWidth="0.6" />
                  ))}
                  {[40, 80, 120, 160].map(y => (
                    <line key={`h${y}`} x1="30" y1={y} x2="170" y2={y} stroke="rgba(37,99,235,0.18)" strokeWidth="0.6" />
                  ))}
                  {/* Nodes */}
                  {[[40,40],[80,80],[120,40],[160,80],[80,120],[120,120],[160,160],[40,160]].map(([x,y]) => (
                    <circle key={`n${x}${y}`} cx={x} cy={y} r="3.5" fill="rgba(37,99,235,0.35)" />
                  ))}
                  {/* Connections */}
                  <path d="M40 40 L80 80 L120 40 L160 80" stroke="rgba(37,99,235,0.3)" strokeWidth="1" />
                  <path d="M80 80 L80 120 L120 120 L160 160" stroke="rgba(37,99,235,0.3)" strokeWidth="1" />
                  <path d="M40 160 L80 120" stroke="rgba(37,99,235,0.25)" strokeWidth="1" />
                  <path d="M120 40 L120 120" stroke="rgba(37,99,235,0.2)" strokeWidth="0.8" strokeDasharray="4 3" />
                </svg>
                <span className={styles.researchCardTitle}>{RESEARCH_CARDS[1].title}</span>
                <span className={styles.researchCardArrow}>&#8599;</span>
              </a>

              {/* Card 3: Brain — neural network pattern */}
              <a href={RESEARCH_CARDS[2].href} className={styles.researchCard}>
                <svg className={styles.researchCardArt} viewBox="0 0 200 200" fill="none" aria-hidden>
                  {/* Input layer */}
                  {[60, 100, 140].map(y => (
                    <circle key={`i${y}`} cx="40" cy={y} r="5" stroke="rgba(37,99,235,0.35)" strokeWidth="1" fill="none" />
                  ))}
                  {/* Hidden layer 1 */}
                  {[50, 85, 115, 150].map(y => (
                    <circle key={`h1${y}`} cx="100" cy={y} r="5" stroke="rgba(37,99,235,0.35)" strokeWidth="1" fill="none" />
                  ))}
                  {/* Output layer */}
                  {[75, 125].map(y => (
                    <circle key={`o${y}`} cx="160" cy={y} r="5" stroke="rgba(37,99,235,0.35)" strokeWidth="1" fill="none" />
                  ))}
                  {/* Connections: input → hidden */}
                  {[60, 100, 140].flatMap(iy =>
                    [50, 85, 115, 150].map(hy => (
                      <line key={`ih${iy}${hy}`} x1="45" y1={iy} x2="95" y2={hy} stroke="rgba(37,99,235,0.15)" strokeWidth="0.6" />
                    ))
                  )}
                  {/* Connections: hidden → output */}
                  {[50, 85, 115, 150].flatMap(hy =>
                    [75, 125].map(oy => (
                      <line key={`ho${hy}${oy}`} x1="105" y1={hy} x2="155" y2={oy} stroke="rgba(37,99,235,0.15)" strokeWidth="0.6" />
                    ))
                  )}
                  {/* Highlight a couple connections */}
                  <line x1="45" y1="100" x2="95" y2="85" stroke="rgba(37,99,235,0.4)" strokeWidth="1.2" />
                  <line x1="105" y1="85" x2="155" y2="75" stroke="rgba(37,99,235,0.4)" strokeWidth="1.2" />
                </svg>
                <span className={styles.researchCardTitle}>{RESEARCH_CARDS[2].title}</span>
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
