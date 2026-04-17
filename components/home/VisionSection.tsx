"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const Vision = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section>
      <div ref={ref} className="max-w-[1287px] mx-auto px-8 md:px-10 py-20 md:py-32 flex flex-col items-center text-center">
        <h2
          className="text-[#0A1344] leading-[1.15] tracking-[-0.02em] text-[32px] md:text-[40px] lg:text-[48px] max-w-[700px]"
          style={{ fontWeight: 500, ...anim(0) }}
        >
          Introducing a new kind of AI for the physical world — COLUMBUS-01
        </h2>

        <p
          className="mt-6 text-[16px] md:text-[18px] leading-[1.65] text-[rgba(10,19,68,0.55)] max-w-[600px]"
          style={anim(100)}
        >
          We&apos;re building foundational geospatial models that understand the
          physical world the way language models understand text. Columbus-01 is
          trained on the largest curated collection of geospatial data ever
          assembled — satellite imagery, mobility patterns, environmental
          sensors, infrastructure records, and demographic signals across every
          continent.
        </p>

        <Link
          href="/technology"
          className="mt-10 inline-flex items-center gap-2 text-[15px] font-medium text-[#0A1344] hover:text-[#2563EB] transition-colors duration-300 group"
          style={anim(200)}
        >
          <span>Our research &amp; technology</span>
          <svg
            width="10"
            height="18"
            viewBox="0 0 10 18"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M1 1l8 8-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
};
