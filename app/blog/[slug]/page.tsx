import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleStickyNav } from "@/components/blog/BlogArticleStickyNav";
import { ShareButtons } from "@/components/blog/ShareButtons";
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
    <main className={`min-h-screen ${blogStyles.articlePage}`}>
      <div className={blogStyles.greyPanel} aria-hidden />
      <BlogArticleStickyNav sections={stickySections} />

      <article className="relative z-[1] mx-auto w-full max-w-[720px] px-4 pt-[162px] pb-12 md:px-6">
        <h1 className={`${blogStyles.headlineLarge} mb-6`}>{post.title}</h1>
        <p
          className={`${blogStyles.bodyLarge} ${blogStyles.colorOnSurfaceVariant} ${blogStyles.descriptionDivider} mb-3`}
        >
          {post.description}
        </p>
        <div className="flex items-center gap-1">
          <p className={`${blogStyles.labelLarge} ${blogStyles.dateLine}`}>{post.date}</p>
          <ShareButtons title={post.title} size={18} />
        </div>

        <div
          className={blogStyles.articleImagePlaceholder}
          style={post.image ? { backgroundImage: `url(${post.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          aria-hidden
        />

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
