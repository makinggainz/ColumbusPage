import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { BlogArticleStickyNav } from "@/components/blog/BlogArticleStickyNav";
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
  const stickySections = body
    .filter((b): b is { type: "h2"; text: string; id: string } => b.type === "h2")
    .map((b) => ({ id: b.id, label: b.text }));

  return (
    <main className="min-h-screen">
      <Navbar />

      <BlogArticleStickyNav sections={stickySections} />

      <article className="mx-auto w-full max-w-[720px] px-4 pt-28 pb-12 md:px-6">
        <Link
          href="/blog"
          className={`xl:hidden ${blogStyles.labelLarge} ${blogStyles.colorPrimary} ${blogStyles.backLink}`}
        >
          ← All posts
        </Link>

        <p className={`${blogStyles.labelLarge} ${blogStyles.colorPrimary} mb-4 mt-8 xl:mt-0`}>{post.date}</p>
        <h1 className={`${blogStyles.headlineLarge} mb-6`}>{post.title}</h1>
        <p
          className={`${blogStyles.bodyLarge} ${blogStyles.colorOnSurfaceVariant} mb-12 border-b border-[var(--md-sys-color-outline-variant)] pb-12`}
        >
          {post.description}
        </p>

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
      </article>
    </main>
  );
}
