import styles from "../technology.module.css";
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
      {/* ── 1. Why an LGM ── */}
      <Slide id="index">
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <h2 className={styles.sectionTitle}>Why an LGM</h2>
            <div className={styles.editorialBody}>
              <p>
                The physical world has been largely ignored by modern AI. While
                large language models have transformed how we process text, no
                equivalent breakthrough exists for understanding geography,
                space, and the built environment. An LGM — a Large Geospatial
                Model — fills that gap.
              </p>
              <p>
                At Columbus, we believe the next frontier of intelligence lies
                not in more text, but in comprehending the Earth itself:
                its terrain, its infrastructure, the patterns that emerge when
                billions of spatial data points converge. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
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
              Large Geospatial Model vs Large Language Model
            </h2>
            <p className={styles.sectionLead}>
              If an LLM is for the digital world, our LGM is for the physical
              world. Earth, understood.
            </p>
            <div className={styles.editorialBody}>
              <p>
                A Large Language Model processes text — tokens, sentences,
                documents. A Large Geospatial Model processes the physical world
                — coordinates, terrain, infrastructure, spatial relationships.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
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

            <div className={styles.comparisonBottom}>
              <p className={styles.comparisonBottomLabel}>What we&apos;re doing now</p>
              <p className={styles.comparisonBottomSub}>make it clear</p>
            </div>
          </RevealOnView>
        </div>
      </Slide>

      {/* ── 4. Results of an LGM ── */}
      <Slide id="core-reasoning">
        <div className={styles.slideFrame}>
          <RevealOnView className={styles.editorialSlide}>

            <h2 className={styles.sectionTitle}>Results of an LGM</h2>
            <div className={styles.editorialBody}>
              <p>
                A Large Geospatial Model produces spatial understanding at a
                scale and resolution previously impossible. It enables real-time
                analysis of terrain, infrastructure density, environmental risk,
                and human activity patterns — all from coordinate-level
                reasoning.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                nec odio praesent libero sed cursus ante dapibus diam. Sed nisi
                nulla, sagittis eget nunc sed, faucibus a purus. Etiam
                ullamcorper condimentum magna, sit amet hendrerit ipsum
                fermentum.
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

      {/* ── 5. Research ── */}
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
    </>
  );
}
