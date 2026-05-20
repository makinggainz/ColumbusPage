"use client";

import Image from "next/image";

/* ── Super-feature section scaffold ─────────────────────────────────────────
   One "super feature": a centered title/subtitle, then a hero-style framed
   block (image background + dark scrim) with a product-demo image layered
   on top, then a row of sub-features beneath. The whole thing sits inside
   an #F7F7F7 panel so consecutive super-features can stack as one band. */

export type SuperFeatureSubItem = {
  title: string;
  description: string;
};

export type SuperFeatureSectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  /* Background image for the framed block (hero-style with dark overlay). */
  backgroundImage: string;
  /* Product-demo image that sits on top of the framed block. */
  demoImage: string;
  demoAlt?: string;
  subFeatures?: SuperFeatureSubItem[];
};

export default function SuperFeatureSection({
  id,
  title,
  subtitle,
  backgroundImage,
  demoImage,
  demoAlt = "",
  subFeatures = [],
}: SuperFeatureSectionProps) {
  return (
    <section
      id={id}
      className="relative w-full"
      style={{
        backgroundColor: "#F7F7F7",
        paddingTop: "var(--ent-section-lg)",
        paddingBottom: "var(--ent-section-lg)",
      }}
    >
      <div className="ent-content-bounds">
        {/* Header — centered title + subtitle */}
        <div className="flex flex-col items-center text-center px-6">
          <h2
            className="leading-[1.1] text-[28px] md:text-[36px] lg:text-[45px]"
            style={{
              color: "var(--ent-text-primary)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              maxWidth: 720,
            }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              className="mt-4 max-w-150 text-[15px] md:text-[17px] leading-[1.5]"
              style={{ color: "var(--ent-text-secondary)", letterSpacing: "-0.005em" }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Framed block — background image + dark overlay (hero pattern),
            with the product-demo image layered above. */}
        <div
          className="relative mt-12 lg:mt-16 overflow-hidden"
          style={{
            borderRadius: "var(--ent-radius-card)",
            border: "1px solid var(--ent-border-card)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              zIndex: 0,
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0.12) 62%, rgba(0,0,0,0) 86%)",
              zIndex: 0,
            }}
            aria-hidden
          />

          {/* Product-demo container — sits on top of the image. Inner image
              gets its own rounded card so it reads as a product mock floating
              above the framed backdrop. */}
          <div
            className="relative z-10 flex justify-center w-full"
            style={{
              paddingTop: "clamp(48px, 7vw, 96px)",
              paddingBottom: "clamp(48px, 7vw, 96px)",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 1100,
                borderRadius: "var(--ent-radius-card)",
                overflow: "hidden",
                boxShadow: "var(--ent-shadow-card)",
              }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10" }}>
                <Image
                  src={demoImage}
                  alt={demoAlt}
                  fill
                  sizes="(max-width: 1100px) 100vw, 1100px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sub-features — text grid beneath the framed block */}
        {subFeatures.length > 0 ? (
          <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {subFeatures.map(item => (
              <div key={item.title}>
                <h3
                  className="text-[18px] md:text-[20px] font-semibold leading-[1.2]"
                  style={{ color: "var(--ent-text-primary)", letterSpacing: "-0.01em" }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2 text-[14px] md:text-[15px] leading-[1.5]"
                  style={{ color: "var(--ent-text-secondary)", letterSpacing: "-0.005em" }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
