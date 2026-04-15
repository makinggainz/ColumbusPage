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
      <Slide id="index">
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
      <Slide id="lgm-vs-llm">
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
      <Slide id="data-collection">
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>
            <p className={styles.comparisonSuper}>A New Foundational Model</p>
            <h2 className={styles.sectionTitle}>
              Large Geospatial Model vs Large Language Model.
            </h2>
            <p className={styles.sectionLead}>
              If an LLM is for the digital world, our LGM is for the physical
              world. Earth, understood.
            </p>

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
      <Slide id="core-reasoning">
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
      <Slide id="new-category">
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <h2 className={styles.sectionTitle}>A New Category</h2>
            <p className={styles.sectionLead}>
              We believe there needs to be a new category — with new benchmarks
              that the industry can compete on.
            </p>
            <div className={styles.editorialBody}>
              <p>
                Today, geospatial AI has no standard benchmarks. Companies
                operate in silos, measuring progress against internal metrics
                that are impossible to compare. This fragmentation slows the
                entire field.
              </p>
              <p>
                We&apos;re building the benchmarks ourselves — open-source
                evaluation frameworks for spatial reasoning, coordinate-level
                accuracy, and real-world prediction tasks. The goal is to create
                a shared standard that any company can compete on, accelerating
                progress for everyone. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </p>
              <p>
                This is something we intend to invent and open-source as part of
                our research program — a contribution to the field that goes
                beyond our own products. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
            </div>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 6. Research ── */}
      <Slide id="research-blog">
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <h2 className={styles.sectionTitle}>Read our latest releases</h2>
            <p className={styles.sectionLead}>
              Explore the innovative research and recent papers from our team.
            </p>

            {/* Featured papers — rectangular card grid */}
            <div className={styles.researchCardGrid}>
              {RESEARCH_CARDS.map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  className={styles.researchCard}
                >
                  <span className={styles.researchCardTitle}>{card.title}</span>
                  <span className={styles.researchCardArrow}>&#8599;</span>
                </a>
              ))}
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
                  <span className={styles.articleRowArrow}>&rarr;</span>
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
