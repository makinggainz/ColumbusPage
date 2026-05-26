import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BlogArticleStickyNav } from "@/components/blog/BlogArticleStickyNav";
import { ArticleReadingOptions } from "@/components/blog/ArticleReadingOptions";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { MistxNav } from "@/components/layout/MistxNav";
import { Footer } from "@/components/layout/Footer";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog-posts";
import { blogBodyWithSectionIds, mergeBlogBody } from "@/lib/blog-lorem-body";
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

  return (
    <main className={`min-h-screen ${blogStyles.articlePage}`}>
      <div className="max-[1314px]:block hidden">
        <MistxNav />
      </div>
      <BlogArticleStickyNav sections={stickySections} />

      <article className="relative z-[1] mx-auto w-full max-w-[720px] px-4 pt-[175px] min-[1315px]:pt-[162px] pb-12 md:px-6">
        <h1 id="article-title" className={`${blogStyles.headlineLarge} mb-4 scroll-mt-24`}>{post.title}</h1>
        <p
          className={`${blogStyles.bodyLarge} ${blogStyles.colorOnSurfaceVariant} mb-4`}
        >
          {post.description}
        </p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
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
            <Image
              src={post.image}
              alt=""
              aria-hidden
              fill
              priority
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

      <RelatedPosts currentSlug={post.slug} currentCategory={post.category} />
      <div className={blogStyles.footerTransition} aria-hidden />
      <Footer theme="light" />
    </main>
  );
}
