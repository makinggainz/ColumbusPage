import Image from "next/image";
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
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 2. An LGM vs LLM ── */}
      <Slide id="lgm-vs-llm" className={styles.lgmSlide}>
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>
            <h2 className={styles.sectionTitle}>
              An LGM vs LLM
            </h2>
            <p className={styles.sectionLead}>
              The differences between a Large Language Model and a Large
              Geospatial Model.
            </p>
            <div className={styles.editorialBody}>
              <p>
                An LLM is trained on text — billions of tokens from the
                internet — and learns to predict the next word. An LGM is
                trained on the physical world — satellite imagery, geospatial
                databases, coordinate systems — and learns to reason about
                space, terrain, and the fabric of cities.
              </p>
              <p>
                Where an LLM hallucinates facts it never observed, an LGM is
                grounded in real-world coordinates. It doesn&apos;t guess where
                a building is — it knows, because it was trained on the actual
                geometry of the Earth. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Integer nec odio praesent libero sed cursus ante
                dapibus diam.
              </p>
            </div>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 3. Timeline ── */}
      <Slide id="data-collection" className={styles.dataCollectionSection}>
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>
            <h2 className={styles.sectionTitle}>
              A timeline of the LGM
            </h2>

            {/* Horizontal divider line */}
            <div className={styles.comparisonTrack} />

            <div className={styles.comparisonGrid}>
              {/* Column 1: LLM */}
              <div className={styles.comparisonColumn}>
                <h3 className={styles.comparisonHeading}>LLM</h3>
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

              {/* Column 2: Geo-tuned LLM + Vision Models */}
              <div className={styles.comparisonColumn}>
                <h3 className={styles.comparisonHeading}>Geo-tuned LLM + Vision Models</h3>
                <div className={styles.comparisonBody}>
                  <p>Comprehending images, and predicting certain things like size from Earth imagery and context.</p>
                  <p>use; clay and other ai satellite website for inspo</p>
                </div>
                <div className={styles.comparisonFooter}>
                  <span>[ Reverse Diffusion ]</span>
                </div>
              </div>

              {/* Column 3: Generalist LGM */}
              <div className={styles.comparisonColumn}>
                <h3 className={styles.comparisonHeading}>Generalist LGM</h3>
                <div className={styles.comparisonBody}>
                  <p>Big Data pre-trained Large Geospatial Model</p>
                  <p>requiring fine-tuned labeling for each earth topic (e.g. physics etc)</p>
                </div>
                <a href="#" className={styles.comparisonLink}>Read our Paper &#8250;</a>
              </div>

              {/* Column 4: Universal Geospatial Model */}
              <div className={styles.comparisonColumn}>
                <h3 className={styles.comparisonHeading}>Universal Geospatial Model</h3>
                <div className={styles.comparisonBody}>
                  <p>An AGI for the physical world</p>
                </div>
                <a href="#" className={styles.comparisonLink}>Our Game Plan &#8250;</a>
              </div>
            </div>

            <div className={styles.comparisonBottom} />
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 4. Results of an LGM ── */}
      <Slide id="core-reasoning" className={styles.coreReasoningSlide}>
        <div className={styles.verticalLineOverlay} aria-hidden="true" />
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <h2 className={styles.sectionTitle}>Results of an LGM</h2>
            <p className={styles.sectionLead}>
              The products of an LGM — what it produces, how it performs, and
              how it compares.
            </p>
            <div className={styles.editorialBody}>
              <p>
                An LGM generates high-resolution spatial intelligence: land-use
                classification, infrastructure density scoring, environmental
                risk assessment, and real-time pattern detection across entire
                regions. These are outputs that previously required expensive
                manual surveying or fragmented datasets.
              </p>
              <p>
                When benchmarked against traditional geospatial pipelines, our
                model achieves superior accuracy at a fraction of the cost and
                time. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed nisi nulla, sagittis eget nunc sed, faucibus a purus. Etiam
                ullamcorper condimentum magna.
              </p>
            </div>

            <div className={styles.resultMetrics}>
              <div className={styles.resultMetric}>
                <span className={styles.resultNumber}>13T+</span>
                <span className={styles.resultLabel}>Grid cells</span>
              </div>
              <div className={styles.resultMetric}>
                <span className={styles.resultNumber}>100m</span>
                <span className={styles.resultLabel}>Resolution</span>
              </div>
              <div className={styles.resultMetric}>
                <span className={styles.resultNumber}>Global</span>
                <span className={styles.resultLabel}>Coverage</span>
              </div>
            </div>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 5. A New Category ── */}
      <Slide id="new-category" className={styles.newCategorySlide}>
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.newCategoryInner}>
            {/* Section title + subtitle */}
            <div className={styles.newCategoryHeader}>
              <h2 className={styles.sectionTitle}>A New Category</h2>
              <p className={styles.sectionLead}>
                We believe geospatial intelligence deserves its own category —
                with open benchmarks that the entire industry can compete on.
                Today there is no standard way to measure spatial reasoning.
                We&apos;re building one.
              </p>
            </div>

            {/* Visual statement */}
            <div className={styles.newCategoryVisual}>
              <div className={styles.newCategoryText}>
                <h3 className={styles.newCategoryTitle}>We want to be here.</h3>
                <p className={styles.newCategorySubtitle}>
                  Chart on{" "}
                  <span className={styles.newCategoryBrand}>LMArena</span>
                </p>
              </div>

              <div className={styles.newCategoryImageWrap}>
                <div className={styles.newCategoryLabel}>
                  <span>Geospatial</span>
                  <svg width="20" height="36" viewBox="0 0 20 36" fill="none" aria-hidden>
                    <path d="M10 0 L10 28 M4 22 L10 28 L16 22" stroke="#0A1344" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              <Image
                src="/LMArena.png"
                alt="LMArena Leaderboard showing AI model rankings"
                width={960}
                height={540}
                className={styles.newCategoryImage}
              />
              <div className={styles.newCategoryImageFade} aria-hidden />
              </div>
            </div>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 6. Research ── */}
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
