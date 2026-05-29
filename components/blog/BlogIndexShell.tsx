import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { MistxNav } from "@/components/layout/MistxNav";
import { BlogIndexGrid, type BlogFilter } from "@/components/blog/BlogIndexGrid";
import { BlogFilterBar } from "@/components/blog/BlogFilterBar";
import { getAllBlogPostsSorted } from "@/lib/blog-posts";
import styles from "@/app/blog/blog-index.module.css";

export function BlogIndexShell({ activeFilter }: { activeFilter: BlogFilter }) {
  const posts = getAllBlogPostsSorted();

  return (
    <main className={styles.page}>
      <MistxNav />

      {/* Full-viewport hero — the title block centres in the space below
          the navbar; the filter row rests at the bottom edge, inviting a
          click (which scrolls down to the grid) or a manual scroll.
          `data-hero-section` lets the navbar render transparent at the
          top of the page so the watermark reads through it. */}
      <section className={styles.hero} data-hero-section aria-label="Blog">
        {/* Watermark — formerly a CSS background-image (948 KB PNG).
            Routing it through next/image with `priority` lets the
            optimizer ship a sub-200 KB AVIF/WebP variant and emits a
            preload tag so the watermark is on screen before hydration.
            The wrapper still owns the mask/opacity treatment. */}
        <div className={styles.heroWatermark} aria-hidden>
          <ImageWithFallback
            src="/ColumbusWorldLinesBG.png"
            alt=""
            fill
            priority
            sizes="120vw"
            quality={75}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div className={styles.heroInner}>
          <h1 className={`h1 tracking-tight ${styles.headline}`}>Blog</h1>
          <p className={`p-l ${styles.lead}`}>
            Research updates, product notes, and longer-form writing on
            geospatial intelligence.
          </p>
        </div>
        <BlogFilterBar activeFilter={activeFilter} />
      </section>

      <div className={styles.body}>
        <BlogIndexGrid posts={posts} activeFilter={activeFilter} />
      </div>
    </main>
  );
}
