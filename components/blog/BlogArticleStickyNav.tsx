"use client";

import Link from "next/link";
import styles from "./blog-sticky-nav.module.css";

export type BlogStickySection = {
  id: string;
  label: string;
};

type Props = {
  sections: BlogStickySection[];
};

export function BlogArticleStickyNav({ sections }: Props) {
  return (
    <nav className={styles.dock} aria-label="Article navigation">
      <Link href="/blog" className={styles.back}>
        ← All posts
      </Link>
      {sections.length > 0 ? (
        <ul className={styles.sectionList}>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={styles.sectionLink}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
