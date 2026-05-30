import type { Metadata } from "next";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";

import { MistxNav } from "@/components/layout/MistxNav";
import {
  ScrollHighlightStatement,
  type StatementSegment,
} from "@/components/company/ScrollHighlightStatement";
import { BLOG_POSTS, blogHref } from "@/lib/blog-posts";
import styles from "./company.module.css";

export const metadata: Metadata = {
  title: "Company — Columbus Earth",
  description:
    "Columbus Earth Inc. is a spatial frontier AI company building the first production Large Geospatial Model.",
};

/**
 * Dot-arrow glyph — the 5-circle SVG used by every CTA across the site
 * (navbar, hero pills, BlogSection cards). Reused here on the active
 * "Read more" card and the contact CTA so the iconography matches.
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

/**
 * Quote-mark glyph — two filled comma shapes forming an opening double
 * quotation mark, set above each founder quote. A genuine curly quote
 * (rounded head + tapering tail) reads instantly, so it recedes rather
 * than snagging the eye. Colour comes from `currentColor`.
 */
function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 31"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11 2C15.97 2 20 6.03 20 11C20 15.97 15.97 20 11 20C9 23 7 26 3 29C6 24 4 18 2 11C2 6.03 6.03 2 11 2Z" />
      <path d="M31 2C35.97 2 40 6.03 40 11C40 15.97 35.97 20 31 20C29 23 27 26 23 29C26 24 24 18 22 11C22 6.03 26.03 2 31 2Z" />
    </svg>
  );
}

function getRandomCompanyProductPosts() {
  const companyProductPosts = BLOG_POSTS.filter(
    (p) => p.category === "COMPANY NEWS" || p.category === "PRODUCT"
  );
  const shuffled = [...companyProductPosts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

/* Founder quotes — copy reproduced verbatim from the design mockup.
   `FEATURED` fills the left photo tile; `QUOTES` are the two stacked
   cards on the right. */
type Quote = { quote: string; name: string; role: string; avatar: string };

const FEATURED: Quote = {
  quote:
    "We apply semantic AI in simple and beautiful products helping real people.",
  name: "David Ramirez Blonski",
  role: "Co-Founder, CEO",
  avatar: "/David.png",
};

const QUOTES: Quote[] = [
  {
    quote:
      "As the bridge between the physical world and digital world, maps are one of the most ubiquitous interfaces that haven't changed in decades.",
    name: "Alexander Ramirez Blonski",
    role: "Co-Founder, CPO",
    avatar: "/Alex.jpg",
  },
  {
    quote: "Like Columbus, and the great voyagers, we are entering the new frontier of AI. While LLMs are book-smart, we wish to be street-smart.",
    name: "Erick Lara",
    role: "Co-Founder, CTO",
    avatar: "/Erick.png",
  },
];

/* Mission / vision statements, segmented for ScrollHighlightStatement —
   `important` segments stay dark after the fill; the rest dims back. */
const MISSION_STATEMENT: StatementSegment[] = [
  { text: "To bring a" },
  { text: "paradigm shift", important: true },
  { text: "in the relationship between" },
  { text: "AI and the physical world", important: true },
];

const VISION_STATEMENT: StatementSegment[] = [
  { text: "We believe maps will lead the journey to" },
  { text: "a Universal Geospatial model.", important: true },
  { text: "A thinking earth.", important: true },
];

/* ── What we're building — the Large Geospatial Model, as three parts.
   Each pillar paraphrases one strand of the company mission. ─────────── */
type Pillar = { index: string; title: string; body: string };

const PILLARS: Pillar[] = [
  {
    index: "01",
    title: "Surveying all of earth",
    body: "Granular, accurate and continuous surveying of our planet. From geology to anthropology in spaces.",
  },
  {
    index: "02",
    title: "Semantic AI model to reason with all data",
    body: "Our semantic AI reasons across multiple data types including satellite imagery, temporal patterns, public data, private data, 3d data and more",
  },
  {
    index: "03",
    title: "The most powerful map platforms",
    body: "Actionable intelligence delivered in intuitive and simple platforms.",
  },
];

const COMPANY_HERO_SIZES = "100vw";

const { props: companyHeroDesktopProps } = getImageProps({
  src: "/company-illustration-enhanced.png",
  alt: "",
  width: 3762,
  height: 2174,
  sizes: COMPANY_HERO_SIZES,
  quality: 75,
  loading: "eager",
  className: styles.heroWatermarkImage,
});

const {
  props: { srcSet: companyHeroMobileSrcSet },
} = getImageProps({
  src: "/company-illustration-enhanced-mobile.png",
  alt: "",
  width: 1440,
  height: 2880,
  sizes: COMPANY_HERO_SIZES,
  quality: 75,
});

export default function CompanyPage() {
  return (
    <main className={styles.page}>
      <MistxNav />

      {/* ════════ 1. HERO ════════
          Full-viewport, navbar-overlaying hero with the companyhero
          watermark — the tall-ship-and-globe sketch that ties back to
          the homepage hero. `data-hero-section` lets the navbar render
          transparent at the top of the page. */}
      <section className={styles.hero} data-hero-section aria-label="Company">
        {/* Watermark — art-directed with a portrait mobile source so the
            phone hero keeps both the globe and tall ship instead of
            cropping the desktop canvas. */}
        <div className={styles.heroWatermark} aria-hidden>
          <picture className={styles.heroWatermarkPicture}>
            <source
              media="(max-width: 767px)"
              srcSet={companyHeroMobileSrcSet}
            />
            <img {...companyHeroDesktopProps} alt="" />
          </picture>
        </div>
        <div className={styles.heroInner}>
          <h1 className={`h1 tracking-tight ${styles.heroHeadline}`}>
            Building a thinking earth
          </h1>
          <p className={styles.heroLead}>
            Columbus Earth Inc. is a spatial frontier AI company building the
            first production Large Geospatial Model to answer the most
            difficult questions about our planet.
          </p>
        </div>
      </section>

      {/* ════════ 2. OUR MISSION ════════
          Open statement (no card) — starts fully lit; the body fades out
          on scroll, leaving the key phrases (ScrollHighlightStatement). */}
      <section className="section">
        <div className={styles.textColumn}>
          <h2 className={`mb-6 md:mb-8 ${styles.sectionLabel}`}>
            Our Mission
          </h2>
          <ScrollHighlightStatement segments={MISSION_STATEMENT} />
        </div>
      </section>

      {/* ════════ 3. WHAT WE'RE BUILDING ════════
          The substance section — the Large Geospatial Model broken into
          three pillars, each a hairline card. */}
      <section className="section">
        <div className={styles.bounds}>
          <h2 className={`mb-6 md:mb-8 ${styles.sectionLabel}`}>
            What we&apos;re building
          </h2>
          <div className={styles.pillarGrid}>
            {PILLARS.map((pillar) => (
              <div key={pillar.index} className={styles.pillar}>
                <span className={styles.pillarIndex}>{pillar.index}</span>
                <h3 className={`h5 ${styles.pillarTitle}`}>{pillar.title}</h3>
                <p className={styles.pillarBody}>{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 4. OUR VISION ════════
          Static statement — the scroll-fade is a signature effect, used
          once (Mission); rendering Vision lit keeps the page from
          animating two sections back-to-back. */}
      <section className="section">
        <div className={styles.textColumn}>
          <h2 className={`mb-6 md:mb-8 ${styles.sectionLabel}`}>
            Our Vision
          </h2>
          <ScrollHighlightStatement segments={VISION_STATEMENT} static />
          <div className={styles.timelineWrap}>
            <Link href="/research" className={`p-m ${styles.timelineLink}`}>
              The timeline
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3.5 9.5 9.5 3.5M4.5 3.5h5v5" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ 5. READ MORE ════════ */}
      <section className="section">
        <div className={styles.bounds}>
          <h2 className={`mb-6 md:mb-8 ${styles.sectionLabel}`}>
            Read more about what we do
          </h2>
          {/* 3-col desktop / 2-col tablet / 1-col mobile. Previously
              this was an inline gridTemplateColumns: repeat(3, 1fr)
              with no media queries, so on mobile each card squeezed
              to ~107 px wide with a ~67-px-tall hero image (unreadable).
              gap-y-12 = 48 px row gap (matches design); gap-x-8 = 32 px
              column gap (matches design). */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
            {getRandomCompanyProductPosts().map((post) => (
              <Link
                key={post.slug}
                href={blogHref(post.slug)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 10",
                    borderRadius: "13px",
                    overflow: "hidden",
                    background: "#ECEFF3",
                    marginBottom: "16px",
                  }}
                >
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, #0A3760 0%, #0F4C81 52%, #2C86C6 100%)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, textTransform: "uppercase", color: "var(--color-muted)" }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--color-muted)" }} aria-hidden="true">
                      ·
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 500, textTransform: "uppercase", color: "var(--color-muted)" }}>
                      {post.date}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "22px", color: "var(--color-ink)", margin: "0 0 8px", letterSpacing: "-0.015em" }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: "16px", color: "var(--color-muted)", margin: 0 }}>
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 6. A QUOTE FROM OUR FOUNDERS ════════ */}
      <section className="section">
        <div className={styles.bounds}>
          <h2
            className={`h2 tracking-tight mb-10 md:mb-20 ${styles.sectionHeading}`}
          >
            A quote from our founders
          </h2>
          <div className={styles.foundersGrid}>
            {/* Left — featured photo tile: the group photo with a
                top/bottom black gradient for legibility, the featured
                founder quote over the top and the attribution bottom-left.
                Square (aspect-ratio 1/1) — the right column stretches to
                match its height. */}
            <div className={styles.founderPhoto}>
              <div className={styles.founderPhotoMedia}>
                <Image
                  src="/grouppic-founders.png"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 640px, 100vw"
                />
              </div>
              <div className={styles.featuredQuoteBlock}>
                <QuoteMark className={styles.quoteMarkLight} />
                <p className={styles.featuredQuote}>{FEATURED.quote}</p>
              </div>
              <div
                className={`${styles.attribution} ${styles.featuredAttribution}`}
              >
                <div className={styles.avatar}>
                  <Image
                    src={FEATURED.avatar}
                    alt={FEATURED.name}
                    fill
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className={styles.attributionName}>{FEATURED.name}</p>
                  <p className={styles.attributionRole}>{FEATURED.role}</p>
                </div>
              </div>
            </div>

            {/* Right — two stacked quote cards. */}
            <div className={styles.quoteCol}>
              {QUOTES.map((q) => (
                <div key={q.name} className={styles.quoteCard}>
                  <QuoteMark className={styles.quoteMarkAccent} />
                  <p className={styles.quoteText}>{q.quote}</p>
                  <div className={styles.quoteSpacer} aria-hidden />
                  <div className={styles.attribution}>
                    <div className={styles.avatar}>
                      <Image src={q.avatar} alt={q.name} fill sizes="64px" />
                    </div>
                    <div>
                      <p className={styles.attributionName}>{q.name}</p>
                      <p className={styles.attributionRole}>{q.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 7. CONTACT CTA ════════ */}
      <section className="section">
        <div className={styles.bounds}>
          <div className={styles.card}>
            <p className={`h4 ${styles.contactText}`}>
              {"We're always open to communicate. If you have any questions send us a message in a bottle here"}
            </p>
            <div className={styles.contactActions}>
              <a
                href="https://www.linkedin.com/company/columbusearth/about/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconCircle}
                aria-label="Columbus Earth on LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              {/* On-brand pill CTA — sized to the homepage's canonical
                  ~42px content CTA (BentoProducts / Careers): 14×28px box,
                  line-height 1. Fully rounded so it reads as a peer of the
                  circular icon buttons beside it. */}
              <Link
                href="/contact"
                className="group rounded-full px-7 py-3.5 text-sm leading-none flex items-center gap-2.5 transition-colors bg-cta text-white hover:text-[#154ACC]"
              >
                Contact Us
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  <ArrowDots className="text-[#154ACC]" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
