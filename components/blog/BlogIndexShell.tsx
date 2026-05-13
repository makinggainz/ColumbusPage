import { MistxNav } from "@/components/layout/MistxNav";
import { Footer } from "@/components/layout/Footer";
import { BlogIndexGrid, type BlogFilter } from "@/components/blog/BlogIndexGrid";
import { getAllBlogPostsSorted } from "@/lib/blog-posts";
import styles from "@/app/blog/blog-index.module.css";

export function BlogIndexShell({ activeFilter }: { activeFilter: BlogFilter }) {
  const posts = getAllBlogPostsSorted();

  return (
    <main className={styles.page}>
      <MistxNav />

      <div className={styles.container}>
        <h1 className={styles.headline}>Blog</h1>
        <p className={styles.lead}>
          Research updates, product notes, and longer-form writing on geospatial intelligence.
        </p>

        <BlogIndexGrid posts={posts} activeFilter={activeFilter} />
      </div>

      <Footer theme="light" />
    </main>
  );
}
