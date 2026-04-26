import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { getAllBlogPostsSorted } from "@/lib/blog-posts";
import styles from "./blog-index.module.css";

export const metadata: Metadata = {
  title: "Blog | Columbus",
  description: "Research notes, releases, and papers from the Columbus Earth team.",
};

export default function BlogIndexPage() {
  const posts = getAllBlogPostsSorted();

  return (
    <main className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.headline}>Blog</h1>
        <p className={styles.lead}>
          Research updates, product notes, and longer-form writing on geospatial intelligence.
        </p>

        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.slug} className={styles.row}>
              <Link href={`/blog/${post.slug}`} className={styles.rowLink}>
                <div className={styles.rowText}>
                  <span className={styles.rowTitle}>{post.title}</span>
                  <span className={styles.rowDescription}>{post.description}</span>
                </div>
                <span className={styles.rowDate}>{post.date}</span>
                <span className={styles.rowHoverLine} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
