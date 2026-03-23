"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, GridHeader, GridCell } from "./ContentGrid";

export const SiteSelection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <GridSection>
      <GridHeader
        label="03 — PRODUCT"
        title="Site Selection Reimagined"
        subtitle="An entirely new way to explore, analyze, and decide."
      />

      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2"
        style={anim(100)}
      >
        {/* Text content */}
        <GridCell>
          <ul className="space-y-4 mb-10">
            {[
              "An end-to-end Site Selection tool.",
              "Generate new maps, in seconds.",
              "Find exclusive critical datasets for your decisions.",
              "Cheaper due diligence.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[10px] w-[5px] h-[5px] bg-[#6E6E73] shrink-0" aria-hidden />
                <span className="text-[17px] font-normal leading-[1.47] text-[#1D1D1F]">{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-[17px] leading-[1.47] text-[#6E6E73] mb-8">
            Columbus turns you into a{" "}
            <span className="font-semibold text-[#6E6E73]">super-explorer.</span>
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/platform"
              className="bg-[#0A1344] text-white px-[22px] py-[11px] text-[15px] font-medium hover:bg-[#0A1344]/85 transition-colors"
            >
              Start now
            </Link>
            <Link href="/technology" className="text-[#4F46E5] text-[15px] font-mono tracking-wide hover:underline transition-colors">
              LEARN MORE →
            </Link>
          </div>
        </GridCell>

        {/* Image — flush, no rounded corners */}
        <GridCell flush hoverable={false} className="relative hidden md:block" style={{ minHeight: 450 }}>
          <div
            className="absolute bottom-0 right-0"
            style={{ width: "95%", height: "85%", overflow: "hidden" }}
          >
            <Image src="/Icon/desktop-ui.png" alt="Desktop UI" fill className="object-cover object-top-left" />
          </div>
          <div
            className="absolute bottom-0"
            style={{ right: 12, width: 160, height: "88%", overflow: "hidden" }}
          >
            <Image src="/Icon/mobile-ui.png" alt="Mobile UI" fill className="object-cover" />
          </div>
        </GridCell>
      </div>
    </GridSection>
  );
};
