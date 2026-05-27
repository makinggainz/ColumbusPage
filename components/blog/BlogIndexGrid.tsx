import Image from "next/image";
import Link from "next/link";

import { getBlogAccentColor, type BlogCategory, type BlogPost } from "@/lib/blog-posts";
import styles from "@/app/blog/blog-index.module.css";
import type { CSSProperties } from "react";

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
            {/* Columbus brand lockup — small logo + "Columbus" wordmark
                anchored to the top-left of every card image. */}
            <div className={styles.cardBrand} aria-hidden="true">
              <span className={styles.cardBrandLogo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logobueno.png" alt="" width={16} height={16} />
              </span>
              <span className={styles.cardBrandText}>Columbus</span>
            </div>
            <div
              className={styles.notch}
              style={getBlogAccentColor(post)
                ? ({ "--notch-accent": getBlogAccentColor(post) } as CSSProperties)
                : undefined}
            >
              <span className={styles.notchLabel}>{post.audience}</span>
            </div>
          </div>

          {/* Article text — sits underneath the tile. */}
          <div className={styles.cardBody}>
            <span className={styles.cardMeta}>
              <span className={styles.cardCategory}>{post.category}</span>
              <span className={styles.cardMetaDot} aria-hidden="true">·</span>
              <span className={styles.cardDate}>{post.date}</span>
            </span>
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
