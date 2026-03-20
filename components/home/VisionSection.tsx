"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const Vision = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);

  useEffect(() => {
    const observe = (el: HTMLElement | null, onVisible: () => void) => {
      if (!el) return () => {};
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onVisible();
            observer.disconnect();
          }
        },
        { threshold: 0 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    };

    const cleanups = [
      observe(titleRef.current, () => setTitleVisible(true)),
      observe(gridRef.current, () => setGridVisible(true)),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section className="bg-[#F5F5F7] py-[80px] md:py-[120px]">
      <div className="max-w-[980px] mx-auto px-6">

        {/* Eyebrow */}
        <p
          className="text-[17px] font-semibold text-[#6E6E73] text-center mb-4"
          style={{
            opacity: titleVisible ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          Our Vision
        </p>

        {/* TITLE */}
        <h2
          ref={titleRef}
          className="text-[48px] md:text-[56px] font-semibold tracking-[-0.003em] leading-[1.07] text-[#1D1D1F] text-center mb-4"
          style={{
            opacity: titleVisible ? 1 : 0,
            filter: titleVisible ? "blur(0px)" : "blur(8px)",
            transform: titleVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out 0.1s, filter 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s",
          }}
        >
          A new species of AI
        </h2>

        {/* Subtitle */}
        <p
          className="text-[21px] md:text-[24px] font-normal leading-[1.38] text-[#6E6E73] text-center max-w-[600px] mx-auto mb-12 md:mb-16"
          style={{
            opacity: titleVisible ? 1 : 0,
            filter: titleVisible ? "blur(0px)" : "blur(8px)",
            transform: titleVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease-out 0.2s, filter 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s",
          }}
        >
          ColumbusPro-1 processes satellite imagery, terrain data, human activity,
          and temporal patterns to generate actionable intelligence.
        </p>

        {/* GRID */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px]"
          style={{
            opacity: gridVisible ? 1 : 0,
            filter: gridVisible ? "blur(0px)" : "blur(8px)",
            transform: gridVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease-out 0.2s, filter 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s",
          }}
        >
          {/* ROW 1 */}
          <Tile src="/image1.png" />
          <TextTile className="col-span-2 lg:col-span-2" title="General Intelligence" subtitle="for the physical world" />
          <Tile src="/image2.png" />
          <Tile src="/image3.png" />
          <Tile src="/image4.png" />

          {/* ROW 2 */}
          <Tile src="/image5.png" />
          <Tile src="/image6.png" />
          <Tile src="/image7.png" />
          <Tile src="/image8.png" />
          <Tile src="/image9.png" />
          <Tile src="/image10.png" />

          {/* ROW 3 */}
          <Tile src="/image111.png" />
          <Tile src="/image112.png" />
          <TextTile className="col-span-2 lg:col-span-2" title="Foundational Models" subtitle="for Earth" />
          <Tile src="/image113.png" />
          <Tile src="/image114.png" />

          {/* ROW 4 */}
          <Tile src="/image12.png" />
          <Tile src="/image.png" />
          <Tile src="/image14.png" />
          <Tile src="/image15.png" />
          <Tile src="/image16.png" />
          <Tile src="/image17.png" />
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <a
            href="#"
            className="text-[#0066CC] text-[20px] hover:underline transition-colors"
          >
            See what we&apos;re building &#8250;
          </a>
        </div>
      </div>
    </section>
  );
};

const Tile = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <Image src={src} alt="" fill className="object-cover" />
    </div>
  );
};

const TextTile = ({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col justify-center px-8 sm:px-10 items-center text-center bg-white rounded-2xl ${className}`}
    >
      <h3 className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] leading-tight tracking-tight">
        {title}
      </h3>
      <p className="text-lg md:text-xl font-normal text-[#6E6E73] mt-2 tracking-tight">
        {subtitle}
      </p>
    </div>
  );
};
