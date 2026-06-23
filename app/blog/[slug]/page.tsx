import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { BlogArticleStickyNav } from "@/components/blog/BlogArticleStickyNav";
import { ArticleReadingOptions } from "@/components/blog/ArticleReadingOptions";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { MistxNav } from "@/components/layout/MistxNav";
import { MediaPrefetcher } from "@/components/ui/MediaPrefetcher";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog-posts";
import { blogBodyWithSectionIds, mergeBlogBody } from "@/lib/blog-lorem-body";
import { JsonLd } from "@/components/JsonLd";
import { BlogSubscribeSection } from "@/components/blog/BlogSubscribeSection";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import blogStyles from "../blog.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not found | Columbus" };
  return {
    title: `${post.title} | Columbus Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const body = blogBodyWithSectionIds(mergeBlogBody(post.paragraphs));
  const stickySections = [
    { id: "article-title", label: "Introduction" },
    ...body
      .filter((b): b is { type: "h2"; text: string; id: string } => b.type === "h2")
      .map((b) => ({ id: b.id, label: b.text })),
  ];

  const BASE_URL = "https://columbus.earth";

  return (
    <main className={`min-h-screen ${blogStyles.articlePage}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${BASE_URL}/blog/${post.slug}`,
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          ...(post.image ? { image: `${BASE_URL}${post.image.src}` } : {}),
          author: { "@id": `${BASE_URL}/#organization` },
          publisher: { "@id": `${BASE_URL}/#organization` },
          mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
          isPartOf: {
            "@type": "Blog",
            url: `${BASE_URL}/blog`,
            name: "Columbus Blog",
          },
        }}
      />
      <div className="max-[1314px]:block hidden">
        <MistxNav />
      </div>
      <BlogArticleStickyNav sections={stickySections} articleSlug={post.slug} />

      <article className="relative z-[1] mx-auto w-full max-w-[720px] px-5 pt-24 md:pt-[175px] min-[1315px]:pt-[162px] pb-12 md:px-6">
        <h1 id="article-title" className={`${blogStyles.headlineLarge} mb-4 scroll-mt-24`}>{post.title}</h1>
        <p
          className={`${blogStyles.bodyLarge} ${blogStyles.colorOnSurfaceVariant} mb-4`}
        >
          {post.description}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="flex items-center gap-1 min-w-0 flex-wrap">
            <p className={`${blogStyles.labelLarge} ${blogStyles.dateLine}`}>{post.date}</p>
            <ShareButtons title={post.title} size={18} />
          </div>
          <ArticleReadingOptions />
        </div>

        <div
          className={blogStyles.articleImagePlaceholder}
          style={{ position: "relative", overflow: "hidden" }}
          aria-hidden
        >
          {post.image && (
            // LCP for blog article pages — `priority` issues a preload
            // and serves an AVIF/WebP variant via the optimizer.
            <ImageWithFallback
              src={post.image}
              alt=""
              aria-hidden
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 768px) 720px, 100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          )}
        </div>

        <div>
          {body.map((block, i) =>
            block.type === "h2" ? (
              <h2 key={i} id={block.id} className={blogStyles.sectionHeading}>
                {block.text}
              </h2>
            ) : (
              <p key={i} className={blogStyles.proseParagraph}>
                {block.text}
              </p>
            )
          )}
        </div>

        <div className={blogStyles.articleShareEnd}>
          <span className={blogStyles.shareEndLabel}>Share this article</span>
          <ShareButtons title={post.title} size={22} />
        </div>
      </article>

      {/* Subscribe section — visible only when the sidebar dock is hidden
          (< 1315px). At ≥ 1315px the compact subscribe widget lives inside
          BlogArticleStickyNav so this section would duplicate it. */}
      <BlogSubscribeSection source="article_bottom" articleSlug={post.slug} className="min-[1315px]:hidden" />

      <RelatedPosts currentSlug={post.slug} currentCategory={post.category} />
      <div className={blogStyles.footerTransition} aria-hidden />

      {/* Warm the below-fold RelatedPosts covers (lazy → eager) after load + idle. */}
      <MediaPrefetcher />
      <ScrollDepthTracker page={`blog/${post.slug}`} />
    </main>
  );
}
