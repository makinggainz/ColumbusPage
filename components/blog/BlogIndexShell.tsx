import { getImageProps } from "next/image";

import { MistxNav } from "@/components/layout/MistxNav";
import { BlogIndexGrid, type BlogFilter } from "@/components/blog/BlogIndexGrid";
import { BlogFilterBar } from "@/components/blog/BlogFilterBar";
import { getAllBlogPostsSorted } from "@/lib/blog-posts";
import styles from "@/app/blog/blog-index.module.css";

const BLOG_HERO_SIZES = "(max-width: 767px) 100vw, 120vw";

const { props: blogHeroDesktopProps } = getImageProps({
  src: "/ColumbusWorldLinesBG.png",
  alt: "",
  width: 3480,
  height: 1808,
  sizes: BLOG_HERO_SIZES,
  quality: 75,
  loading: "eager",
  className: styles.heroWatermarkImage,
});

const {
  props: { srcSet: blogHeroMobileSrcSet },
} = getImageProps({
  src: "/BlogHeroMobile-v2.png",
  alt: "",
  width: 1024,
  height: 1536,
  sizes: BLOG_HERO_SIZES,
  quality: 75,
});

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
        {/* Watermark — art-directed with a portrait mobile source so the
            phone hero keeps the map continents + contour lines instead
            of cropping the desktop canvas. */}
        <div className={styles.heroWatermark} aria-hidden>
          <picture className={styles.heroWatermarkPicture}>
            <source
              media="(max-width: 767px)"
              srcSet={blogHeroMobileSrcSet}
            />
            <img {...blogHeroDesktopProps} alt="" />
          </picture>
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
