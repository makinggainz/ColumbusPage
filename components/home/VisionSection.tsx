"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection } from "./ContentGrid";

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

  return (
    <GridSection>
      <div ref={ref} className="px-8 md:px-10 py-12 md:py-16">
        {/* Heading */}
        <h2
          className="text-[#1D1D1F] leading-[1.15] tracking-[-0.02em] mb-10 md:mb-14"
          style={{ fontSize: 48, fontWeight: 300, ...anim(0) }}
        >
          Introducing <span className="font-semibold">new kind of AI</span>,{" "}
          <span className="font-bold">COLUMBUS-01</span>
        </h2>

        {/* Image grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px] gap-[2px]"
          style={{ ...anim(100) }}
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

        {/* Description + logos row */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mt-14 md:mt-20"
          style={anim(300)}
        >
          <p className="text-[17px] leading-[1.6] text-[#6E6E73] max-w-[560px]">
            ColumbusPro-1 processes satellite imagery, terrain data, human activity,
            and temporal patterns to generate actionable intelligence across real
            estate, research, and consumer domains.
          </p>
          <div className="flex items-center gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-12 h-12 bg-[#D1D1D6]"
              />
            ))}
          </div>
        </div>

        {/* Tagline */}
        <p
          className="text-center text-[17px] font-semibold text-[#1D1D1F] mt-16 md:mt-20 mb-6"
          style={anim(400)}
        >
          Think of us like the OpenAI for maps.
        </p>

        {/* CTA link */}
        <div style={anim(450)} className="flex justify-center">
          <Link
            href="/technology"
            className="inline-flex items-center gap-2 text-[#6E6E73] text-[15px] px-5 py-3 border-l-2 border-[#D1D1D6] hover:text-[#1D1D1F] transition-colors"
          >
            Our research &amp; technology
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>
    </GridSection>
  );
};

const Tile = ({ src }: { src: string }) => (
  <div className="relative w-full h-full overflow-hidden rounded-none">
    <Image src={src} alt="" fill className="object-cover rounded-none" />
  </div>
);

const TextTile = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div
    className="col-span-1 sm:col-span-2 flex flex-col justify-center items-center text-center px-6"
    style={{ gridAutoFlow: "dense" }}
  >
    <h3 className="text-xl md:text-2xl font-semibold text-[#1D1D1F] leading-tight tracking-tight">
      {title}
    </h3>
    <p className="text-base text-[#6E6E73] mt-1 tracking-tight">
      {subtitle}
    </p>
  </div>
);
