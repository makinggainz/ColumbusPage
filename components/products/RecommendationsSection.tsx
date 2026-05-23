"use client";

import glassStyles from "@/components/ui/GlassButton.module.css";

export default function RecommendationsSection() {
  return (
    <section className="relative bg-[#F9F9F9] py-16 lg:py-32 px-6 overflow-hidden">
      <div className="relative z-10 max-w-[1730px] mx-auto">
        <div className="flex flex-col items-center">
          <p className="text-[20px] text-[#2C2C2C] mb-3 font-semibold">
            What&apos;re you waiting for?
          </p>

          <a
            href="https://mapsgpt.es"
            className={`group flex items-center justify-center gap-4 lg:gap-10 w-full max-w-214.25 h-14 lg:h-18.5 no-underline cursor-pointer active:scale-[0.98] select-none ${glassStyles.btn}`}
            style={{ borderRadius: "var(--radius-button-xl)", padding: 0 }}
          >
            <span
              style={{
                fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 590,
                fontSize: "clamp(15px, 2vw, 20px)",
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#00B1D4",
                whiteSpace: "nowrap",
              }}
            >
              Find your own favourite spots now
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
