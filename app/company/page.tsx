import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";

import { MistxNav } from "@/components/layout/MistxNav";
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

/* "Read more" cards — featured card + 3 small, mirroring the homepage
   BlogSection. Each links to its real blog post. */
type PostCard = {
  title: string;
  href: string;
  image: string;
  featured?: boolean;
};

// Card backgrounds reuse the homepage BlogSection image set verbatim
// (the four /TechnologyPageImages used by the "Read our latest releases"
// row) so this section reads as the same card family as the homepage.
const POSTS: PostCard[] = [
  {
    featured: true,
    title: "Philosophy behind a Universal Geospatial Model",
    href: "/blog/philosophy-universal-lgm",
    image: "/TechnologyPageImages/multieWaveEminations.jpeg",
  },
  {
    title: "MapsGPT Version 2.5. Architecture improvements.",
    href: "/blog/mapsgpt-v2-5-architecture",
    image: "/TechnologyPageImages/techpg-radiance.png",
  },
  {
    title: "Mimicking the adult brain.",
    href: "/blog/mimicking-adult-brain",
    image: "/TechnologyPageImages/deep-layers.jpeg",
  },
  {
    title: "Earth recipes.",
    href: "/blog/earth-recipes",
    image: "/TechnologyPageImages/unkown-layers.jpeg",
  },
];

/* Founder quotes — copy reproduced verbatim from the design mockup. */
const QUOTES: { quote: string; name: string; role: string; avatar: string }[] = [
  {
    quote:
      "I started Columbus just to get some Columbussy on my dih. I like males.",
    name: "David Ramirez Blonski",
    role: "Co-Founder, CEO",
    avatar: "/David.png",
  },
  {
    quote: "When I'm not working on Columbus im gooning to hentai from Japan.",
    name: "Erick Lara",
    role: "Co-Founder, CTO",
    avatar: "/Erick.png",
  },
];

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
        <div className={styles.heroWatermark} aria-hidden />
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
          Open statement (no card) — a large, centred mission statement
          at the cardexperiment1 type sizing (24 / 30 / 36px). */}
      <section className={styles.statementSection}>
        <div className={styles.bounds}>
          <h2 className={`mb-4 md:mb-6 ${styles.sectionLabel}`}>
            Our Mission
          </h2>
          <p className="mx-auto max-w-3xl text-center text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug text-ink">
            {"To create intelligence to critically understand our planet better. Deep surveying of all earth. To create a computer brain, able to think across the vastness of our earth's data. To create the most powerful map platform."}
          </p>
        </div>
      </section>

      {/* ════════ 3. OUR VISION ════════ */}
      <section className={styles.statementSection}>
        <div className={styles.bounds}>
          <h2 className={`mb-4 md:mb-6 ${styles.sectionLabel}`}>
            Our Vision
          </h2>
          <p className="mx-auto max-w-3xl text-center text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug text-ink">
            We believe maps, can lead to the journey to a Universal Geospatial
            Model. A thinking earth.
          </p>
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

      {/* ════════ 4. READ MORE ════════ */}
      <section className="section">
        <div className={styles.bounds}>
          <h2
            className={`h2 tracking-tight mb-10 md:mb-20 ${styles.sectionHeading}`}
          >
            Read more about what we do
          </h2>
          <div className={styles.cardGrid}>
            {POSTS.map((post) => (
              <Link
                key={post.title}
                href={post.href}
                className={
                  post.featured
                    ? `${styles.postCard} ${styles.postCardFeatured}`
                    : styles.postCard
                }
                style={{ ["--card-bg" as string]: `url(${post.image})` }}
              >
                <div className={styles.postCardSpacer} aria-hidden />
                <span className={`h5 ${styles.postCardTitle}`}>
                  {post.title}
                </span>
                <span className={styles.postCardArrow}>
                  <ArrowDots />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 5. A QUOTE FROM OUR FOUNDERS ════════ */}
      <section className="section">
        <div className={styles.bounds}>
          <h2
            className={`h2 tracking-tight mb-10 md:mb-20 ${styles.sectionHeading}`}
          >
            A quote from our founders
          </h2>
          <div className={styles.foundersGrid}>
            {/* Left — bento photo tile with the BentoProducts-style
                top-right cut-out notch carrying the "Our CEO" label. */}
            <div className={styles.founderPhoto}>
              <Image
                src="/grouppic-founders.png"
                alt=""
                fill
                sizes="(min-width: 768px) 640px, 100vw"
              />
              <div className={styles.photoNotch}>
                <span className={styles.photoNotchLabel}>Our Team</span>
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

      {/* ════════ 6. OUR VALUES ════════ */}
      <section className="section">
        <div className={styles.bounds}>
          <h2
            className={`h2 tracking-tight mb-10 md:mb-20 ${styles.sectionHeading}`}
          >
            Our values
          </h2>
          <div className={`${styles.card} ${styles.valuesCard}`}>
            <QuoteMark className={styles.quoteMarkAccent} />
            <div className={styles.valuesImage}>
              <Image src="/henti.png" alt="" fill sizes="200px" />
            </div>
            <div className={styles.attribution}>
              <div className={styles.avatar}>
                <Image
                  src="/Alex.jpg"
                  alt="Alexander Ramirez Blonski"
                  fill
                  sizes="40px"
                />
              </div>
              <div>
                <p className={styles.attributionName}>
                  Alexander Ramirez Blonski
                </p>
                <p className={styles.attributionRole}>Co-Founder, CPO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 7. CONTACT CTA ════════ */}
      <section className="section">
        <div className={styles.bounds}>
          <div className={styles.card}>
            <p className={`h4 ${styles.contactText}`}>
              {"We're always open to communicate. If you have any questions left on the product or company contact us here"}
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
              <a
                href="mailto:contact@columbus.earth"
                className={styles.iconCircle}
                aria-label="Email Columbus Earth"
              >
                <Mail size={18} />
              </a>
              <Link href="/contact" className={`h5 ${styles.contactCta}`}>
                Contact Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
