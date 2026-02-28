import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import styles from "./useCasesPage.module.css";

type CaseStudy = {
  title: string;
  description: string;
  bullets?: string[];
  image: string;
  rightLabel: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Real Estate Site Selection",
    description:
      "Enabling faster site-selection for residential and commercial real-estate customers, including:",
    bullets: ["Franchises", "Consultants", "CRE", "Residential Developers", "Wholesale brokers"],
    image: "/use-cases/case_real_estate_site_selection.jpg",
    rightLabel: "Insert text: Marketing towards this specific person",
  },
  {
    title: "Generative Geodata",
    description:
      "Columbus brings accurate GenAI to geodata, dynamically creating new spatial layers for planning and analysis.",
    bullets: [
      "Create novel geo layers from sparse data.",
      "Reduce expensive manual surveying.",
      "Support faster city-planning decisions.",
    ],
    image: "/use-cases/case_generative_geodata.jpg",
    rightLabel: "Insert text: Marketing towards this specific person",
  },
  {
    title: "Logistics optimization",
    description:
      "Columbus considers weather, traffic, regulations, stop constraints, and driver-state conditions to build smarter routes.",
    bullets: ["Multi-courier", "Multi-route", "Multi-transport"],
    image: "/use-cases/case_logistics.jpg",
    rightLabel: "Insert text: Marketing towards this specific person",
  },
  {
    title: "Urban Planning & Infrastructure",
    description:
      "Understand demographics, lot prices, road-signal risk, and resident sentiment before deploying interventions.",
    image: "/use-cases/case_urban_planning.jpg",
    rightLabel: "Other questions",
  },
  {
    title: "Ground Due Dilligence",
    description:
      "Generate full parcel diligence with AI + field operations support, including ownership, measurements, and survey prompts.",
    image: "/use-cases/case_ground_due_dilligence.jpg",
    rightLabel: "Other questions",
  },
  {
    title: "Commercial Real Estate",
    description:
      "Screen commercial opportunities by demographics, lease comparables, and location demand clusters.",
    image: "/use-cases/case_commercial_real_estate.jpg",
    rightLabel: "Other questions",
  },
  {
    title: "Site Selection",
    description:
      "Locate expansion opportunities by combining trade-area behavior, customer intent, and local constraints.",
    image: "/use-cases/case_site_selection.jpg",
    rightLabel: "Other questions",
  },
  {
    title: "Consumer Mapping",
    description:
      "Model neighborhood vibe and customer language by district to localize offers, messaging, and activation.",
    image: "/use-cases/case_consumer_mapping.jpg",
    rightLabel: "Other questions",
  },
  {
    title: "Geomarketing",
    description:
      "Run location-aware campaigns and optimize placements based on map context, intent, and local footfall.",
    image: "/use-cases/case_geomarketing.jpg",
    rightLabel: "Other questions",
  },
];

const APPLICATION_AREAS = [
  "Disaster response",
  "Environmental and Safety Mitigation and Predictive warning",
  "City Security",
  "Retail Analytics",
  "Academic Research",
  "Columbus Market Spy",
];

export function UseCasesPage() {
  return (
    <main className={styles.page}>
      <Navbar />

      <section className={styles.heroSection}>
        <Image
          src="/use-cases/hero_bg.jpg"
          alt="Use-cases hero"
          width={1920}
          height={1111}
          className={styles.heroImage}
          priority
        />
      </section>

      <section className={styles.gridSection}>
        <Image
          src="/use-cases/apps_grid.jpg"
          alt="Use case category grid"
          width={1920}
          height={1511}
          className={styles.gridImage}
        />
      </section>

      <section className={styles.caseIntro}>
        <h2>See the case studies ↓</h2>
      </section>

      <section className={styles.caseStudies}>
        {CASE_STUDIES.map((study) => (
          <article className={styles.caseRow} key={study.title}>
            <div className={styles.caseLeft}>
              <h3>{study.title}</h3>
              <p>{study.description}</p>
              {study.bullets && (
                <ul>
                  {study.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
              <span className={styles.caseBrand}>Columbus</span>
            </div>

            <div className={styles.caseRight}>
              <div className={styles.caseImageWrap}>
                <Image
                  src={study.image}
                  alt={`${study.title} case study visual`}
                  fill
                  sizes="(max-width: 1200px) 100vw, 72vw"
                  className={styles.caseImage}
                />
              </div>
              <div className={styles.caseMeta}>
                <span>How we do it?</span>
                <span>{study.rightLabel}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.moreApps}>
        <div className={styles.moreAppsLeft}>
          <h2>
            More applications
            <br />
            of our technology.
          </h2>
          <p>
            We&apos;re exploring many more use-cases. We&apos;re interested to work with people in the
            industry. Talk to us.
          </p>
          <button type="button" className={styles.chatButton}>
            Chat with us
          </button>
        </div>

        <div className={styles.moreAppsRight}>
          <p className={styles.appAreaKicker}>↓ APPLICATION AREAS</p>
          <ul>
            {APPLICATION_AREAS.map((item, index) => (
              <li key={`${item}-${index}`}>
                <span className={styles.index}>{String(index + 1).padStart(2, "0")}.</span>
                <span className={styles.itemText}>{item}</span>
                <span className={styles.toggle}>{index === 3 ? "−" : "+"}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <p>
          We&apos;d love to work with you.
          <br />
          Contact us, or
          <br />
          Check out our <Link href="/technology">Products ↗</Link>
        </p>

        <a className={styles.ctaButton} href="mailto:contact@columbus.earth">
          Get in touch
        </a>
      </section>

      <Footer />
    </main>
  );
}
