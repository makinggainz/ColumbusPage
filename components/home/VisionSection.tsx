"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GridSection, GridHeader, gl } from "./ContentGrid";

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

  return (
    <GridSection>
      <GridHeader
        label="01 — VISION"
        title="A new species of AI"
        subtitle="ColumbusPro-1 processes satellite imagery, terrain data, human activity, and temporal patterns to generate actionable intelligence."
      />

      <div ref={ref}>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px]"
          style={{
            gridAutoFlow: "dense",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
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
      </div>

      {/* CTA */}
      <div style={{ borderRight: gl, borderBottom: gl }} className="py-5 px-8 text-center">
        <a href="#" className="text-[#4F46E5] text-sm font-mono tracking-wide hover:underline transition-colors">
          SEE WHAT WE&apos;RE BUILDING →
        </a>
      </div>
    </GridSection>
  );
};

const Tile = ({ src }: { src: string }) => (
  <div
    className="relative w-full h-full overflow-hidden"
    style={{ borderRight: gl, borderBottom: gl }}
  >
    <Image src={src} alt="" fill className="object-cover" />
  </div>
);

const TextTile = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div
    className="col-span-1 sm:col-span-2 flex flex-col justify-center items-center text-center px-6 transition-colors duration-200 hover:bg-[rgba(120,120,200,0.04)]"
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
