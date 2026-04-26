import Image from "next/image";
import Link from "next/link";

import { BLOG_CATEGORIES, type BlogCategory, type BlogPost } from "@/lib/blog-posts";
import styles from "@/app/blog/blog-index.module.css";

export type BlogFilter = "ALL" | BlogCategory;

const FILTER_LABELS: Record<BlogFilter, string> = {
  ALL: "ALL ARTICLES",
  PRODUCT: "PRODUCT",
  ENGINEERING: "ENGINEERING",
  "COMPANY NEWS": "COMPANY NEWS",
};

const FILTER_HREFS: Record<BlogFilter, string> = {
  ALL: "/blog/AllArticles",
  PRODUCT: "/blog/Product",
  ENGINEERING: "/blog/Engineering",
  "COMPANY NEWS": "/blog/CompanyNews",
};

const FILTERS: BlogFilter[] = ["ALL", ...BLOG_CATEGORIES];

type Props = {
  posts: BlogPost[];
  activeFilter: BlogFilter;
};

export function BlogIndexGrid({ posts, activeFilter }: Props) {
  const visiblePosts =
    activeFilter === "ALL" ? posts : posts.filter((p) => p.category === activeFilter);

  return (
    <>
      <nav className={styles.filterBar} aria-label="Article categories">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={FILTER_HREFS[f]}
            className={`${styles.filterButton} ${activeFilter === f ? styles.filterButtonActive : ""}`}
            aria-current={activeFilter === f ? "page" : undefined}
          >
            {FILTER_LABELS[f]}
          </Link>
        ))}
      </nav>

      <div className={styles.grid}>
        {visiblePosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              {post.image ? (
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw"
                />
              ) : (
                <div className={styles.cardImagePlaceholder} aria-hidden="true" />
              )}
            </div>
            <div className={styles.cardMeta}>
              <span className={styles.cardCategory}>{post.category}</span>
              <span className={styles.cardDate}>{post.date}</span>
            </div>
            <span className={styles.cardTitle}>{post.title}</span>
            <span className={styles.cardDescription}>{post.description}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
