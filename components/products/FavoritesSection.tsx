"use client";

import Image from "next/image";
// @ts-expect-error — CSS side-effect import
import "@/components/products/how-it-works-tokens.css";

export default function FavoritesSection() {
  return (
    <section
      className="hiw-scope"
      style={{
        background: "var(--hiw-bg-page)",
        paddingTop: "var(--hiw-section-py)",
        paddingBottom: "var(--hiw-section-py)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--hiw-max-width)",
          marginInline: "auto",
          paddingInline: "var(--hiw-content-px)",
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 text-center">
          <span className="hover-bee inline-block cursor-default">
            <Image
              src="/how/light.png"
              alt=""
              width={120}
              height={100}
              className="w-20 sm:w-24 lg:w-32 h-auto block"
            />
          </span>
          <h2 style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
            fontSize: "clamp(var(--hiw-text-xl), 5vw, var(--hiw-text-4xl))",
            lineHeight: "var(--hiw-leading-tight)" as unknown as number,
            color: "var(--hiw-text-primary)",
            margin: 0,
          }}>
            Let our AI find you
            <br />
            the coolest place, faster.
          </h2>
          <span className="hover-bee inline-block cursor-default">
            <Image
              src="/how/serach.png"
              alt=""
              width={120}
              height={100}
              className="w-20 sm:w-24 lg:w-32 h-auto block"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
