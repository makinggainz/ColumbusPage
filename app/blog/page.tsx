import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllBlogPostsSorted } from "@/lib/blog-posts";
import blogStyles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog | Columbus",
  description: "Research notes, releases, and papers from the Columbus Earth team.",
};

export default function BlogIndexPage() {
  const posts = getAllBlogPostsSorted();

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto w-full max-w-[1287px] px-4 pt-28 pb-12 md:px-6">
        <p className={`${blogStyles.labelMediumUpper} ${blogStyles.colorPrimary} mb-4`}>
          Blog
        </p>
        <h1 className={`${blogStyles.headlineLarge} mb-4`}>Latest from our team</h1>
        <p className={`${blogStyles.bodyLarge} ${blogStyles.colorOnSurfaceVariant} mb-12 max-w-2xl`}>
          Research updates, product notes, and longer-form writing on geospatial intelligence.
        </p>

        <ul className="flex flex-col gap-0 border-t border-[var(--md-sys-color-outline-variant)]">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-[var(--md-sys-color-outline-variant)]">
              <Link
                href={`/blog/${post.slug}`}
                className={`group flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8 ${blogStyles.listRow}`}
              >
                <div className="min-w-0 flex-1">
                  <span className={`${blogStyles.titleLarge} block group-hover:underline`}>
                    {post.title}
                  </span>
                  <span className={`${blogStyles.bodyMedium} ${blogStyles.colorOnSurfaceVariant} mt-2 block`}>
                    {post.description}
                  </span>
                </div>
                <span className={`${blogStyles.labelLarge} ${blogStyles.colorOnSurfaceVariant} shrink-0 tabular-nums`}>
                  {post.date}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </main>
  );
}
