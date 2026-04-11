"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, fadeLine } from "./ContentGrid";

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
    <GridSection>
      <div ref={ref} className="px-6 md:px-10 py-16 md:py-24">
        {/* Heading */}
        <h2
          className="text-[#1D1D1F] leading-[1.2] tracking-[-0.02em] text-[28px] md:text-[36px] lg:text-[44px] max-w-[700px]"
          style={{ fontWeight: 500, ...anim(0) }}
        >
          Introducing a new kind of AI for the physical world — COLUMBUS-01
        </h2>

        {/* Body text */}
        <div className="mt-8 max-w-[600px]" style={anim(100)}>
          <p className="text-[16px] md:text-[18px] leading-[1.65] text-[#6E6E73]">
            We&apos;re building foundational geospatial models that understand the physical world the way language models understand text. Columbus-01 is trained on the largest curated collection of geospatial data ever assembled — satellite imagery, mobility patterns, environmental sensors, infrastructure records, and demographic signals across every continent.
          </p>
          <p className="text-[16px] md:text-[18px] leading-[1.65] text-[#6E6E73] mt-5">
            The result is a model that can reason spatially — answering questions about places, predicting patterns, and generating insights that were previously impossible without teams of analysts and months of manual research.
          </p>
        </div>

        {/* Separator */}
        <div className="mt-12 mb-8 max-w-[500px]" style={anim(180)}>
          <div style={fadeLine} />
        </div>

        {/* CTA */}
        <div className="flex items-center gap-8" style={anim(220)}>
          <Link
            href="/technology"
            className="group flex items-center gap-4 hover:opacity-90 transition-opacity"
            style={{ height: 36, paddingLeft: 20, paddingRight: 16, fontSize: 15, fontWeight: 500, backgroundColor: "#000000", color: "white" }}
          >
            <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Our research &amp; technology</span>
            <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </Link>
          <span className="text-[15px] text-[#6E6E73]">
            Think of us like the OpenAI for maps.
          </span>
        </div>
      </div>
    </GridSection>
  );
};
