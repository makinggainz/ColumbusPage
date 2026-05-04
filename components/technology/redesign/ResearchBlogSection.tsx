import Link from "next/link";

import styles from "../technology.module.css";
import { RESEARCH_ARTICLES, RESEARCH_CARDS } from "./content";
import { RevealOnView } from "./RevealOnView";

/**
 * Token bundle so this section renders correctly when used OUTSIDE the
 * technology page. The technology page sets these on `.page`; on
 * `/columbus-solutions` and `/research-applications` (the two routes that
 * embed this component) `.page` isn't applied, so the inner CSS-module
 * rules (`.sectionTitle`, `.sectionLead`, `.researchCardTitle`,
 * `.articleRowTitle`, etc.) would resolve `var(--tech-fs-*)` to nothing
 * and the type collapses. Inlining the same values on the wrapping
 * `<section>` keeps the cascade intact in both places.
 */
const techTokens: React.CSSProperties = {
  ["--tech-fs-h1" as string]: "61px",
  ["--tech-fs-h2" as string]: "49px",
  ["--tech-fs-h3" as string]: "39px",
  ["--tech-fs-h4" as string]: "28px",
  ["--tech-fs-h5" as string]: "22px",
  ["--tech-fs-body-lg" as string]: "20px",
  ["--tech-fs-body" as string]: "18px",
  ["--tech-fs-body-sm" as string]: "16px",
  ["--tech-fs-caption" as string]: "13px",
  ["--tech-color-text" as string]: "#1D1D1F",
  ["--tech-color-text-brand" as string]: "#0A1344",
  ["--tech-color-text-secondary" as string]: "#6E6E73",
  ["--tech-color-text-muted" as string]: "rgba(10, 19, 68, 0.45)",
  ["--tech-color-bg" as string]: "#F9F9F9",
  ["--tech-color-bg-card" as string]: "#FFFFFF",
  ["--tech-color-accent" as string]: "#0066CC",
  ["--tech-color-border" as string]: "rgba(0, 102, 204, 0.3)",
  ["--tech-color-divider" as string]: "rgba(0, 0, 0, 0.07)",
  ["--tech-color-card-border" as string]: "rgba(10, 19, 68, 0.10)",
  ["--tech-radius-sm" as string]: "3px",
  ["--tech-radius-base" as string]: "6px",
  ["--tech-radius-md" as string]: "0px",
  ["--tech-radius-lg" as string]: "14px",
  ["--tech-radius-xl" as string]: "18px",
  ["--tech-tracking-tight" as string]: "-0.02em",
  ["--tech-tracking-snug" as string]: "-0.01em",
  ["--tech-tracking-wide" as string]: "0.08em",
  fontFamily:
    "var(--font-dm-sans), 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
};

export function ResearchBlogSection() {
  return (
    <section
      id="research-blog"
      className="w-full py-[120px] max-md:py-[72px] flex justify-center"
      style={techTokens}
    >
      <div className="w-full max-w-[1287px] mx-auto px-8 md:px-10">
        <RevealOnView className={styles.researchEditorial}>
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
    </section>
  );
}
