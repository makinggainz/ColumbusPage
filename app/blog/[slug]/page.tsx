import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog-posts";
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

  return (
    <main className="min-h-screen">
      <Navbar />

      <article className="mx-auto w-full max-w-[720px] px-4 pt-28 pb-12 md:px-6">
        <Link href="/blog" className={`${blogStyles.labelLarge} ${blogStyles.colorPrimary} ${blogStyles.backLink}`}>
          ← All posts
        </Link>

        <p className={`${blogStyles.labelLarge} ${blogStyles.colorPrimary} mb-4 mt-8`}>{post.date}</p>
        <h1 className={`${blogStyles.headlineLarge} mb-6`}>{post.title}</h1>
        <p
          className={`${blogStyles.bodyLarge} ${blogStyles.colorOnSurfaceVariant} mb-12 border-b border-[var(--md-sys-color-outline-variant)] pb-12`}
        >
          {post.description}
        </p>

        <div className={`${blogStyles.bodyLarge} flex flex-col gap-8 text-[var(--md-sys-color-on-surface)]`}>
          {post.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      <Footer />
    </main>
  );
}
