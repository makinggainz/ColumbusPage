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
      <h2 className={blogStyles.relatedHeading}>Don't miss these</h2>
      <div className={blogStyles.relatedGrid}>
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={blogHref(post.slug)}
            className={indexStyles.card}
          >
            <div className={indexStyles.cardImage}>
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
              ) : (
                <div
                  className={indexStyles.cardImagePlaceholder}
                  aria-hidden
                />
              )}
            </div>
            <div className={indexStyles.cardMeta}>
              <span className={indexStyles.cardCategory}>{post.category}</span>
              <span className={indexStyles.cardDate}>{post.date}</span>
            </div>
            <span className={indexStyles.cardTitle}>{post.title}</span>
            <span className={indexStyles.cardDescription}>
              {post.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
