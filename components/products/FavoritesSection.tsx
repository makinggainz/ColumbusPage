"use client";

import Image from "next/image";
import glassStyles from "@/components/ui/GlassButton.module.css";
import "@/components/products/how-it-works-tokens.css";

export default function FavoritesSection() {
  return (
    <section
      className="hiw-scope"
      style={{
        background: "var(--hiw-bg-page)",
        paddingTop: "var(--hiw-section-py)",
        paddingBottom: "var(--hiw-space-48)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--hiw-max-width)",
          marginInline: "auto",
          paddingInline: "var(--hiw-content-px)",
        }}
      >
        <div
          className="flex flex-col lg:flex-row items-center justify-center text-center"
          style={{ gap: "var(--hiw-space-12)" }}
        >
          <span className="hover-bee inline-block cursor-default">
            <Image
              src="/how/light.png"
              alt=""
              width={120}
              height={100}
              className="w-20 sm:w-24 lg:w-32 h-auto block"
              style={{ filter: "sepia(1) saturate(4) hue-rotate(165deg) brightness(0.85)" }}
            />
          </span>
          <h2 style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
            fontSize: "clamp(32px, 5vw, var(--hiw-text-4xl))",
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
              style={{ filter: "sepia(1) saturate(4) hue-rotate(165deg) brightness(0.85)" }}
            />
          </span>
        </div>

        {/* CTA */}
        <div
          className="flex flex-col items-center"
          style={{ marginTop: "var(--hiw-space-12)" }}
        >
          <a
            href="https://mapsgpt.es"
            className={`group flex items-center justify-center gap-4 lg:gap-6 h-14 lg:h-16 no-underline cursor-pointer active:scale-[0.98] select-none ${glassStyles.btn}`}
            style={{ borderRadius: "var(--hiw-radius-full)", paddingInline: 48 }}
          >
            <span
              className="text-[clamp(18px,2vw,22px)] lg:text-[20px]!"
              style={{
                fontFamily: "var(--hiw-font-sans)",
                fontWeight: 590,
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#00B1D4",
                whiteSpace: "nowrap",
              }}
            >
              <span className="lg:hidden">Find your Spots now</span>
              <span className="hidden lg:inline">Find your favourite spots now</span>
            </span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            >
              <path
                d="M2 11L11 2M11 2H4M11 2V9"
                stroke="#00B1D4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
