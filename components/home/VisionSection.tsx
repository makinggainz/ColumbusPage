"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";

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

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  /* Detect when sticky bar is stuck: top sentinel scrolled past AND bottom sentinel still below */
  const sentinelTopRef = useRef<HTMLDivElement>(null);
  const sentinelBottomRef = useRef<HTMLDivElement>(null);
  const topPastRef = useRef(false);
  const bottomPastRef = useRef(false);

  useEffect(() => {
    const topEl = sentinelTopRef.current;
    const bottomEl = sentinelBottomRef.current;
    if (!topEl || !bottomEl) return;

    const fire = () => {
      const stuck = topPastRef.current && !bottomPastRef.current;
      window.dispatchEvent(new CustomEvent("vision-sticky", { detail: { stuck } }));
    };

    const topObs = new IntersectionObserver(
      ([entry]) => { topPastRef.current = !entry.isIntersecting; fire(); },
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" }
    );
    const bottomObs = new IntersectionObserver(
      ([entry]) => { bottomPastRef.current = !entry.isIntersecting; fire(); },
      { threshold: 0 }
    );

    topObs.observe(topEl);
    bottomObs.observe(bottomEl);
    return () => { topObs.disconnect(); bottomObs.disconnect(); };
  }, []);

  return (
    <div>
      {/* Sentinel — when this scrolls above the navbar, the sticky bar is "stuck" */}
      <div ref={sentinelTopRef} className="h-0" />

      {/* Sticky "Technology" label */}
      <div
        className="sticky top-[56px] z-20 bg-white max-w-[1287px] mx-auto px-8 md:px-10 py-4"
        style={{ borderTop: gl, borderLeft: gl, borderRight: gl, borderBottom: gl }}
      >
        <span className="text-[15px] font-medium text-[#1D1D1F]">Technology</span>
      </div>

    <GridSection>
      {/* Top content area */}
      <div
        ref={ref}
        className="px-8 md:px-10 py-10 md:py-14"
        style={{ borderRight: gl, borderBottom: gl }}
      >
        {/* Heading */}
        <h2
          className="text-[#1D1D1F] leading-[1.15] tracking-[-0.02em] mb-5"
          style={{ fontSize: 48, fontWeight: 300, ...anim(0) }}
        >
          Introducing <span className="font-semibold">new kind of AI</span>,{" "}
          <span className="font-bold">COLUMBUS-01</span>
        </h2>

        {/* Description */}
        <p
          className="text-[15px] leading-[1.6] text-[#6E6E73] max-w-[600px] mb-6"
          style={anim(80)}
        >
          ColumbusPro-1 processes satellite imagery, terrain data, human activity, and temporal patterns
          to generate actionable intelligence across real estate, research, and consumer domains.
        </p>

        {/* Contact link */}
        <div style={anim(150)}>
          <Link
            href="mailto:contact@columbus.earth"
            className="inline-flex items-center gap-2 text-[#0A1344] text-[15px] font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Contact Us
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Image grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px]"
        style={{
          gridAutoFlow: "dense",
          ...anim(200),
        }}
      >
        {/* Row 1 */}
        <Tile src="/image1.png" />
        <TextTile title="General Intelligence" subtitle="for the physical world" />
        <Tile src="/image2.png" />
        <Tile src="/image3.png" />
        <Tile src="/image4.png" />

        {/* Row 2 */}
        <Tile src="/image5.png" />
        <Tile src="/image6.png" />
        <Tile src="/image7.png" />
        <Tile src="/image8.png" />
        <Tile src="/image9.png" />
        <Tile src="/image10.png" />

        {/* Row 3 */}
        <Tile src="/image111.png" />
        <Tile src="/image112.png" />
        <TextTile title="Foundational Models" subtitle="for Earth" />
        <Tile src="/image113.png" />
        <Tile src="/image114.png" />

        {/* Row 4 */}
        <Tile src="/image12.png" />
        <Tile src="/image.png" />
        <Tile src="/image14.png" />
        <Tile src="/image15.png" />
        <Tile src="/image16.png" />
        <Tile src="/image17.png" />
      </div>

      {/* Bottom bar — split: tagline left, CTA right */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto]" style={anim(350)}>
        <div
          className="flex items-center justify-center py-5 px-8"
          style={{ borderRight: gl, borderBottom: gl, backgroundColor: "rgba(10, 19, 68, 0.05)" }}
        >
          <p className="text-[15px] font-medium text-[#1D1D1F] tracking-tight">
            Think of us like the OpenAI for maps.
          </p>
        </div>
        <Link
          href="/technology"
          className="flex items-center justify-center gap-2 py-5 px-10 bg-[#0A1344] text-white text-[15px] font-medium hover:bg-[#0A1344]/90 transition-colors"
          style={{ borderBottom: gl }}
        >
          Our research &amp; technology
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>
      </div>
    </GridSection>
    {/* Bottom sentinel — when this scrolls past, sticky is over */}
    <div ref={sentinelBottomRef} className="h-0" />
    </div>
  );
};

const Tile = ({ src }: { src: string }) => (
  <div
    className="relative w-full h-full overflow-hidden rounded-none"
    style={{ borderRight: gl, borderBottom: gl }}
  >
    <Image src={src} alt="" fill className="object-cover rounded-none" />
  </div>
);

const TextTile = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div
    className="col-span-1 sm:col-span-2 flex flex-col justify-center items-center text-center px-6"
    style={{ borderRight: gl, borderBottom: gl }}
  >
    <h3 className="text-xl md:text-2xl font-semibold text-[#1D1D1F] leading-tight tracking-tight">
      {title}
    </h3>
    <p className="text-base text-[#6E6E73] mt-1 tracking-tight">
      {subtitle}
    </p>
  </div>
);
