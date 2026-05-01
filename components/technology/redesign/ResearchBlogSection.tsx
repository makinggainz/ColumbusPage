import Link from "next/link";

import styles from "../technology.module.css";
import { RESEARCH_ARTICLES, RESEARCH_CARDS } from "./content";
import { RevealOnView } from "./RevealOnView";

export function ResearchBlogSection() {
  return (
    <section id="research-blog" className={styles.section}>
      <div className={styles.slideFrame}>
        <div className={styles.researchBlogWrap}>
          <RevealOnView className={`${styles.editorialSlide} ${styles.researchEditorial}`}>
            <h2 className={styles.sectionTitle}>Read our latest releases</h2>
            <p className={styles.sectionLead}>
              Explore the innovative research and recent papers from our team.
            </p>

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
                  style={card.image ? ({ "--card-bg": `url(${card.image})` } as Record<string, string>) : undefined}
                >
                  <div className={styles.researchCardSpacer} aria-hidden="true" />
                  <span className={styles.researchCardTitle}>{card.title}</span>
                  <span className={styles.researchCardArrow}>&#8599;</span>
                </Link>
              ))}
            </div>

            <div className={styles.articleList}>
              {RESEARCH_ARTICLES.map((article) => (
                <Link key={article.title} href={article.href} className={styles.articleRow}>
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
    </section>
  );
}
