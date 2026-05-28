"use client";

import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS, blogHref } from "@/lib/blog-posts";

const CSS = `
/* Canonical content-bounds calc trick — 1287px cap, always 40px
   narrower than parent (= 20px gutter on each side at every viewport
   width), centered. Matches navbar / .content-bounds / site-wide. */
.blog-section-bounds {
  max-width: 1287px;
  width: calc(100% - 2.5rem);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.blog-section-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px 32px;
}

@media (max-width: 1024px) {
  .blog-section-grid { grid-template-columns: repeat(2, 1fr); gap: 40px 24px; }
}

@media (max-width: 600px) {
  .blog-section-grid { grid-template-columns: 1fr; }
}

.blog-section-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.blog-section-card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 13px;
  overflow: hidden;
  background: #ECEFF3;
  margin-bottom: 16px;
}

.blog-section-card-media img {
  object-fit: cover;
}

.blog-section-card-body {
  display: flex;
  flex-direction: column;
}

.blog-section-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.blog-section-card-category,
.blog-section-card-date {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.blog-section-card-date {
  font-variant-numeric: tabular-nums;
}

.blog-section-card-meta-dot {
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1;
}

.blog-section-card-title {
  display: block;
  color: var(--color-ink);
  letter-spacing: -0.015em;
  margin: 0 0 8px;
}

.blog-section-card-description {
  display: block;
  color: var(--color-muted);
}

/* ── Top-right cut-out notch ─────────────────────────────────────────────
   Same shape used on the /company page "Read more about what we do"
   cards (and the /blog index audience notch): a 38px-tall white wedge
   anchored in the tile's top-right corner with a concave fillet curving
   into the image. The notch's white surface matches the surrounding
   page background so it reads as a real cut-out into the photo. */
.blog-section-card-notch {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  box-sizing: border-box;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  background-color: #FFFFFF;
  /* TL TR BR BL — TR matches the tile's 13px corner; BL is the cut. */
  border-radius: 0 13px 0 13px;
  border-left: 1px solid #E7E7F1;
  border-bottom: 1px solid #E7E7F1;
}
.blog-section-card-notch::before,
.blog-section-card-notch::after {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  background: radial-gradient(
    circle at left bottom,
    rgba(255, 255, 255, 0) 11.5px,
    #E7E7F1 12.25px,
    #E7E7F1 12.75px,
    #FFFFFF 13.5px
  );
}
.blog-section-card-notch::before { top: 0; left: -13px; }
.blog-section-card-notch::after { bottom: -13px; right: 0; }

.blog-section-card-notch-label {
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  color: var(--color-muted);
}
`;

function getRandomBlogCards() {
  const shuffled = [...BLOG_POSTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export function BlogSection() {
  const randomPosts = getRandomBlogCards();

  return (
    <>
      <section className="section relative isolate">
        <div className="content-bounds">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center h2 tracking-tight text-ink">
              Read our latest releases
            </h2>
          </div>
        </div>
      </section>

      <section className="section relative isolate" style={{ paddingTop: 0 }}>
        <style>{CSS}</style>
        <div className="blog-section-bounds">
          <div className="blog-section-grid">
            {randomPosts.map((post) => (
              <Link
                key={post.slug}
                href={blogHref(post.slug)}
                className="blog-section-card"
              >
                <div className="blog-section-card-media">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, #0A3760 0%, #0F4C81 52%, #2C86C6 100%)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                  {/* Top-right cut-out — page-surface white so it reads
                      as a real notch out of the image, carrying the
                      post's playful audience tag. Same treatment as the
                      /company "Read more about what we do" cards. */}
                  <div className="blog-section-card-notch">
                    <span className="blog-section-card-notch-label">
                      {post.audience}
                    </span>
                  </div>
                </div>

                <div className="blog-section-card-body">
                  <div className="blog-section-card-meta">
                    <span className="blog-section-card-category">
                      {post.category}
                    </span>
                    <span
                      className="blog-section-card-meta-dot"
                      aria-hidden="true"
                    >
                      ·
                    </span>
                    <span className="blog-section-card-date">{post.date}</span>
                  </div>
                  <h3 className="h5 blog-section-card-title">
                    {post.title}
                  </h3>
                  <p className="p-m blog-section-card-description">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: "56px", display: "flex", justifyContent: "center" }}>
            <Link
              href="/blog"
              className="group rounded-button-md px-7 py-3.5 p-m flex items-center gap-2 transition-colors bg-cta text-white hover:text-[#0081AC]"
              style={{ lineHeight: 1 }}
            >
              Read all posts
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                <svg
                  className="size-3 shrink-0 text-[#0081AC]"
                  width="24"
                  viewBox="0 0 9 13"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="7.22" cy="6.589" r="1.28" fill="currentColor" />
                  <circle cx="4.658" cy="4.018" r="1.28" fill="currentColor" />
                  <circle cx="2.099" cy="1.46" r="1.28" fill="currentColor" />
                  <circle cx="4.658" cy="9.151" r="1.28" fill="currentColor" />
                  <circle cx="2.099" cy="11.718" r="1.28" fill="currentColor" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogSection;
