"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";

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
    <section className="bg-black py-20 md:py-28 lg:py-36">
      <Container>
        <div className="max-w-full mx-auto">

          {/* Label */}
          <p
            className="text-[10px] font-medium tracking-[0.28em] text-white/22 uppercase mb-8"
            style={{
              opacity: titleVisible ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            Model
          </p>

          {/* TITLE */}
          <h2
            ref={titleRef}
            className="text-display font-semibold leading-tight text-left mb-12 md:mb-16 -mt-2 bg-clip-text text-transparent tracking-[-0.025em]"
            style={{
              backgroundImage: "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 30%, #4472F5 55%, #FFFFFF 70%, #FFFFFF 100%)",
              backgroundSize: "100% 200%",
              backgroundPosition: "0% 0%",
              animation: titleVisible ? "text-shimmer-down 1.4s ease-in-out 0.3s 1 forwards" : "none",
              opacity: titleVisible ? 1 : 0,
              filter: titleVisible ? "blur(0px)" : "blur(8px)",
              transform: titleVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease-out 0.1s, filter 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s",
            }}
          >
            A new species of AI
          </h2>

          {/* GRID */}
          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px]"
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

          {/* BOTTOM ROW */}
          <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-start justify-between gap-6">
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-2xl leading-[1.6]">
              ColumbusPro-1 processes satellite imagery, terrain data, human activity,
              and temporal patterns to generate actionable intelligence across real estate,
              research, and consumer domains.
            </p>

            <button className="border border-white/15 text-white/55 px-8 py-4 text-[14px] font-medium hover:border-white/30 hover:text-white/80 transition-all whitespace-nowrap">
              See what we&apos;re building →
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};

const Tile = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
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
      className={`flex flex-col justify-center px-6 sm:px-8 items-center text-center ${className}`}
      style={{ background: "#080F1E" }}
    >
      <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight tracking-[-0.035em]">
        {title}
      </h3>
      <p className="text-lg md:text-xl font-normal text-white/45 mt-2 tracking-[-0.025em]">
        {subtitle}
      </p>
    </div>
  );
};
