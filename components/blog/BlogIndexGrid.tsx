import Image from "next/image";
import Link from "next/link";

import { type BlogCategory, type BlogPost } from "@/lib/blog-posts";
import styles from "@/app/blog/blog-index.module.css";

export type BlogFilter = "ALL" | BlogCategory;

type Props = {
  posts: BlogPost[];
  activeFilter: BlogFilter;
};

/**
 * The article grid. `id="articles"` is the scroll target the hero's
 * filter row jumps to (see BlogFilterBar). Cards mirror the
 * BentoProducts bento tiles — rounded media tile, hairline ring, corner
 * notch — with the article text sitting underneath.
 */
export function BlogIndexGrid({ posts, activeFilter }: Props) {
  const visiblePosts =
    activeFilter === "ALL" ? posts : posts.filter((p) => p.category === activeFilter);

  return (
    <div className={styles.grid} id="articles">
      {visiblePosts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
          {/* Media tile — 13px corners + hairline ring + corner notch. */}
          <div className={styles.cardMedia}>
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
            <div className={styles.notch}>
              <span className={styles.notchLabel}>{post.category}</span>
            </div>
          </div>

          {/* Article text — sits underneath the tile. */}
          <div className={styles.cardBody}>
            <span className={styles.cardDate}>{post.date}</span>
            <span className={`h5 ${styles.cardTitle}`}>{post.title}</span>
            <span className={`p-m ${styles.cardDescription}`}>
              {post.description}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
