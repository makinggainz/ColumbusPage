import Image from "next/image";
import Link from "next/link";

import { BLOG_POSTS, blogHref } from "@/lib/blog-posts";
import { RevealOnView } from "./RevealOnView";

const CSS = `
.research-blog-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .research-blog-bounds { margin-left: auto; margin-right: auto; }
}

.research-blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px 32px;
}

@media (max-width: 1024px) {
  .research-blog-grid { grid-template-columns: repeat(2, 1fr); gap: 40px 24px; }
}

@media (max-width: 600px) {
  .research-blog-grid { grid-template-columns: 1fr; }
}

.research-blog-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.research-blog-card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 13px;
  overflow: hidden;
  background: #ECEFF3;
  margin-bottom: 16px;
}

.research-blog-card-media img {
  object-fit: cover;
}

.research-blog-card-body {
  display: flex;
  flex-direction: column;
}

.research-blog-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.research-blog-card-category,
.research-blog-card-date {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.research-blog-card-date {
  font-variant-numeric: tabular-nums;
}

.research-blog-card-meta-dot {
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1;
}

.research-blog-card-title {
  display: block;
  color: var(--color-ink);
  letter-spacing: -0.015em;
  margin: 0 0 8px;
}

.research-blog-card-description {
  display: block;
  color: var(--color-muted);
}

.research-blog-cta {
  margin-top: 56px;
  display: flex;
  justify-content: center;
}
`;

function getRandomBlogCards() {
  const shuffled = [...BLOG_POSTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export function ResearchBlogSection() {
  const randomPosts = getRandomBlogCards();

  return (
    <section
      id="research-blog"
      className="w-full py-[120px] max-md:py-[72px] flex justify-center"
    >
      <style>{CSS}</style>
      <div className="w-full max-w-[1287px] mx-auto px-8 md:px-10">
        <RevealOnView>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "42px", marginBottom: "16px", color: "var(--color-ink)" }}>
              Read our latest releases
            </h2>
            <p style={{ fontSize: "18px", color: "var(--color-muted)" }}>
              Explore the innovative research and recent papers from our team.
            </p>
          </div>

          <div className="research-blog-bounds">
            <div className="research-blog-grid">
              {randomPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={blogHref(post.slug)}
                  className="research-blog-card"
                >
                  <div className="research-blog-card-media">
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
                  </div>

                  <div className="research-blog-card-body">
                    <div className="research-blog-card-meta">
                      <span className="research-blog-card-category">
                        {post.category}
                      </span>
                      <span
                        className="research-blog-card-meta-dot"
                        aria-hidden="true"
                      >
                        ·
                      </span>
                      <span className="research-blog-card-date">{post.date}</span>
                    </div>
                    <h3 style={{ fontSize: "22px" }} className="research-blog-card-title">
                      {post.title}
                    </h3>
                    <p className="research-blog-card-description">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="research-blog-cta">
              <Link
                href="/blog"
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                  borderRadius: "20px",
                  textDecoration: "none",
                  transition: "color 200ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
              >
                Read all posts
              </Link>
            </div>
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
