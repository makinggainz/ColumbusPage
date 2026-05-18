import Image from "next/image";
import Link from "next/link";
import { getAllBlogPostsSorted, blogHref, type BlogCategory } from "@/lib/blog-posts";
import indexStyles from "@/app/blog/blog-index.module.css";
import blogStyles from "@/app/blog/blog.module.css";

type Props = {
  currentSlug: string;
  currentCategory: BlogCategory;
};

export function RelatedPosts({ currentSlug, currentCategory }: Props) {
  const allPosts = getAllBlogPostsSorted();

  const sameCategoryPosts = allPosts.filter(
    (p) => p.category === currentCategory && p.slug !== currentSlug
  );

  const relatedPosts =
    sameCategoryPosts.length >= 3
      ? sameCategoryPosts.slice(0, 3)
      : [
          ...sameCategoryPosts,
          ...allPosts.filter(
            (p) => p.slug !== currentSlug && p.category !== currentCategory
          ),
        ].slice(0, 3);

  return (
    <section className={blogStyles.relatedSection}>
      <h2 className={blogStyles.relatedHeading}>Don&apos;t miss these</h2>
      {/* Cards mirror the blog-index bento tiles exactly — rounded media
          tile, hairline ring, corner notch — so the related strip reads as
          the same family as the index grid. */}
      <div className={blogStyles.relatedGrid}>
        {relatedPosts.map((post) => (
          <Link key={post.slug} href={blogHref(post.slug)} className={indexStyles.card}>
            <div className={indexStyles.cardMedia}>
              {post.image ? (
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 33vw, (min-width: 580px) 50vw, 100vw"
                />
              ) : (
                <div className={indexStyles.cardImagePlaceholder} aria-hidden="true" />
              )}
              <div className={indexStyles.notch}>
                <span className={indexStyles.notchLabel}>{post.audience}</span>
              </div>
            </div>

            <div className={indexStyles.cardBody}>
              <span className={indexStyles.cardDate}>{post.date}</span>
              <span className={`h5 ${indexStyles.cardTitle}`}>{post.title}</span>
              <span className={`p-m ${indexStyles.cardDescription}`}>
                {post.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
