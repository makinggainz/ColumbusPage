"use client";

import { BLOG_POSTS, blogHref } from "@/lib/blog-posts";

/**
 * Blog section — adapted from the Technology page's
 * `ResearchBlogSection` (1 featured card + 3 small cards in a flex row
 * with a hover-swap interaction, followed by a list of article rows).
 *
 * Translated from the tech-page source's legacy `--tech-fs-*` /
 * `--tech-color-*` tokens to the homepage's catcherX scale + color
 * tokens:
 *   - section h2  → `.h2` (42 desktop / 32 mobile)
 *   - lede        → `.p-l text-muted`
 *   - card title  → `.h5` (22 desktop / 20 mobile)
 *   - article row → `.p-l text-ink`
 *
 * Card geometry, blur layering, max-width swap on hover, and article
 * row hover underline are all preserved from the original.
 */

/**
 * Dot-arrow icon — the 5-circle SVG used by every CTA across the
 * site (navbar Contact + Try Elio, Hero pills, CtaBanner, BentoProducts).
 * Reused here on the card corner and the "Read all posts" pill so the
 * blog section's iconography matches the rest of the homepage.
 */
function ArrowDots({ className = "" }: { className?: string }) {
  return (
    <svg
      className={"size-3 shrink-0 " + className}
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
  );
}

interface BlogCard {
  title: string;
  href: string;
  image: string;
  featured?: boolean;
}

function getRandomBlogCards(): BlogCard[] {
  const shuffled = [...BLOG_POSTS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 4);
  return selected.map((post, index) => ({
    title: post.title,
    href: blogHref(post.slug),
    image: post.image || "/ColumbusBackgroundbento.png",
    featured: index === 0,
  }));
}

const CSS = `
.blog-bounds {
  max-width: 1287px;
  margin-left: 20px;
  margin-right: 20px;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .blog-bounds { margin-left: auto; margin-right: auto; }
}

.blog-title {
  text-align: center;
}

/* ── Research-card row (featured card + 3 small cards) ──
   No margin-top — the heading lives in a separate .section element
   above, so the gap between heading and cards is owned entirely by
   that heading section's bottom padding (matches the
   maps to BentoProducts rhythm). */
.blog-cardgrid {
  display: flex;
  gap: 16px;
  align-items: stretch;
  justify-content: flex-start;
}

.blog-card {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1.5 1 0;
  min-width: 0;
  max-width: 280px;
  min-height: 320px;
  padding: 20px;
  border-radius: 7px;
  border: none;
  overflow: hidden;
  text-decoration: none;
  color: var(--color-ink);
  cursor: pointer;
  transition: flex-grow 420ms cubic-bezier(0.4, 0, 0.2, 1),
              max-width 420ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Blurred image layer beneath the title. Extends past the card edges
   so the blur's soft fade lives outside the visible area (clipped by
   overflow: hidden on the card). */
.blog-card::before {
  content: "";
  position: absolute;
  inset: -16px;
  background-image: var(--card-bg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(2px);
  z-index: 0;
  transition: filter 300ms ease;
}

/* Glassy backdrop-filter layer to push the imagery further behind
   the title. */
.blog-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  -webkit-backdrop-filter: blur(16px) saturate(1.1);
  backdrop-filter: blur(16px) saturate(1.1);
  z-index: 0;
}

.blog-card > * { position: relative; z-index: 1; }

/* Featured card (and any card on hover) gets the stronger blur. */
.blog-card--featured::before,
.blog-card:hover::before { filter: blur(10px); }

/* When a small card is hovered the original featured drops its strong
   blur — the swap completes visually. */
.blog-cardgrid:has(.blog-card:not(.blog-card--featured):hover) .blog-card--featured::before {
  filter: blur(2px);
}

.blog-card:hover { color: #0A1344; }
.blog-card:hover .blog-card-title { color: #0081AC; }

/* Title — typography from the .h5 class on the element. This rule only
   handles colour, max-width, balance-wrap, and the per-state max-width
   transition (so words re-flow smoothly during the swap). */
.blog-card-title {
  letter-spacing: -0.01em;
  color: var(--color-ink);
  max-width: 18ch;
  text-wrap: balance;
  transition: color 300ms ease, max-width 420ms cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-card--featured .blog-card-title,
.blog-card:not(.blog-card--featured):hover .blog-card-title {
  max-width: 32ch;
}

.blog-cardgrid:has(.blog-card:not(.blog-card--featured):hover) .blog-card--featured .blog-card-title {
  max-width: 18ch;
}

/* Featured tile is ~3.2× wider than the small tiles. */
.blog-card--featured {
  flex: 3.2 1 0;
  max-width: 880px;
}

/* On hover, a small card expands to the featured card's dimensions. */
.blog-card:not(.blog-card--featured):hover {
  flex: 3.2 1 0;
  max-width: 880px;
}

/* Reciprocal: when a small is hovered, the original featured shrinks
   back to a small-card footprint — effective swap. */
.blog-cardgrid:has(.blog-card:not(.blog-card--featured):hover) .blog-card--featured {
  flex: 1.5 1 0;
  max-width: 280px;
}

/* Flex spacer pushes the title to the bottom in featured/hovered
   states. flex-grow IS transitionable, so the title slides smoothly
   between top (small state) and bottom (featured state). */
.blog-card-spacer {
  flex-grow: 0;
  transition: flex-grow 420ms cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-card--featured .blog-card-spacer,
.blog-card:not(.blog-card--featured):hover .blog-card-spacer {
  flex-grow: 1;
}

.blog-cardgrid:has(.blog-card:not(.blog-card--featured):hover) .blog-card--featured .blog-card-spacer {
  flex-grow: 0;
}

/* Dot-arrow icon — visible only on the active (featured/hovered) card,
   so the active card always carries the project's signature CTA glyph
   instead of a plain text arrow. */
.blog-card-arrow {
  position: absolute;
  bottom: 18px;
  right: 18px;
  z-index: 1;
  color: #0081AC;
  opacity: 0;
  transition: transform 300ms ease, opacity 300ms ease;
}

.blog-card--featured .blog-card-arrow { opacity: 1; }

.blog-card:not(.blog-card--featured):hover .blog-card-arrow {
  opacity: 1;
  transform: translateX(2px);
}

.blog-cardgrid:has(.blog-card:not(.blog-card--featured):hover) .blog-card--featured .blog-card-arrow {
  opacity: 0;
}

@media (max-width: 900px) {
  .blog-cardgrid { flex-wrap: wrap; }
  .blog-card { flex: 1 1 calc(50% - 8px); max-width: none; }
  .blog-card--featured { flex: 1 1 100%; max-width: none; }
}
@media (max-width: 600px) {
  .blog-card,
  .blog-card--featured { flex: 1 1 100%; }
}

/* Section bottom CTA — same navbar-style pill used by every other
   homepage section (Hero, BentoProducts, CtaBanner pattern). */
.blog-cta {
  margin-top: 56px;
  display: flex;
  justify-content: center;
}
`;

export function BlogSection() {
  const blogCards = getRandomBlogCards();

  return (
    <>
      {/* Heading section — direct clone of TextScrollIntro's "We're all
          about maps" pattern (own `.section` + minimalistCity watermark
          + centred `.h2` inside `container-site` / `max-w-3xl`) so the
          heading renders in the exact same surface treatment. The card
          grid below is a separate, watermark-free section. */}
      <section className="section relative isolate">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: 'url("/minimalistCity.png")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            /* Stretch image to fully fill the section (both axes) —
               the only way to guarantee full width AND no top/bottom
               crop on sections shorter than the image's 2.25 natural
               aspect. minimalistCity is a flat horizontal scene so
               the small vertical compression is visually invisible. */
            backgroundSize: "100% 100%",
            opacity: 1,
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
          }}
        />
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center h2 tracking-tight text-ink">
              Read our latest releases
            </h2>
          </div>
        </div>
      </section>

      {/* Cards section — top padding is zero (overriding `.section`'s
          default 80px/112px) so the gap between the heading section
          above and the card grid here matches the maps→BentoProducts
          rhythm, where BentoProducts itself uses `padding-top: 0`. */}
      <section className="section relative isolate" style={{ paddingTop: 0 }}>
        <style>{CSS}</style>
        <div className="blog-bounds">
          <div className="blog-cardgrid">
          {blogCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className={card.featured ? "blog-card blog-card--featured" : "blog-card"}
              style={{ ["--card-bg" as string]: `url(${card.image})` }}
            >
              <div className="blog-card-spacer" aria-hidden />
              <span className="h5 blog-card-title">{card.title}</span>
              <span className="blog-card-arrow">
                <ArrowDots />
              </span>
            </a>
          ))}
        </div>

          <div className="blog-cta">
            {/* Padding + line-height match the Careers "Join our team"
                reference button (14px / 28px / line-height: 1 = 42px
                outer height) so every homepage-content CTA renders the
                same. lineHeight is inlined to win over `.p-m`'s
                companion line-height token. */}
            <a
              href="/blog"
              className="group rounded-button-md px-7 py-3.5 p-m flex items-center gap-2 transition-colors bg-cta text-white hover:text-[#0081AC]"
              style={{ lineHeight: 1 }}
            >
              Read all posts
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                <ArrowDots className="text-[#0081AC]" />
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogSection;
