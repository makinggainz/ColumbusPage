"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Tile = ({ src, className = "" }: { src: string; className?: string }) => (
  <div className={`relative w-full h-full overflow-hidden ${className}`}>
    <Image src={src} alt="" fill className="object-cover" />
  </div>
);

export const Vision = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridVisible, setGridVisible] = useState(false);

  useEffect(() => {
    if (!gridRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGridVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: gridVisible ? 1 : 0,
    filter: gridVisible ? "blur(0px)" : "blur(8px)",
    transform: gridVisible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, filter 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section>
      <div className="py-20 md:py-32">

        {/* Image grid — full navbar width */}
        <div
          ref={gridRef}
          className="max-w-[1287px] mx-auto px-6 min-[1287px]:px-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-[5px] auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px]"
          style={anim(0)}
        >
          {/* Row 1 */}
          <Tile src="/image1.png" className="rounded-tl-[20px]" />

          <div className="col-span-2 bg-white flex flex-col items-center justify-center px-6">
            <h3
              className="text-[24px] md:text-[28px] font-medium text-[#0A1344] leading-tight text-center"
              style={{ letterSpacing: "-0.02em" }}
            >
              Moving beyond LLMs
              <br />
              and into LGMs
            </h3>
          </div>

          <Tile src="/image2.png" />
          <Tile src="/image3.png" />
          <Tile src="/image4.png" />
          <Tile src="/image5.png" />
          <Tile src="/image6.png" className="rounded-tr-[20px]" />

          {/* Row 2 */}
          <Tile src="/image7.png" className="rounded-bl-[20px]" />
          <Tile src="/image8.png" />
          <Tile src="/image9.png" />
          <Tile src="/image10.png" />
          <Tile src="/image12.png" />
          <Tile src="/image14.png" />
          <Tile src="/image15.png" />
          <Tile src="/image16.png" className="rounded-br-[20px]" />
        </div>

        {/* Bottom text */}
        <div className="mt-12 md:mt-16 flex flex-col items-center text-center max-w-[700px] mx-auto px-8 md:px-10">
          <p
            className="text-[16px] md:text-[18px] leading-[1.65] text-[rgba(10,19,68,0.55)]"
            style={anim(150)}
          >
            We&apos;re building foundation models that understand the physical
            world through{" "}
            <span className="text-[#0A1344]">geospatial core reasoning</span>. Columbus-01 processes
            satellite imagery, terrain data, human activity, and temporal
            patterns to generate{" "}
            <span className="text-[#0A1344]">actionable intelligence</span>{" "}
            across real estate, research, and consumer domains.{" "}
            <span className="text-[#0A1344] font-medium">Think of us like the OpenAI for maps.</span>
          </p>

          <Link
            href="/technology"
            className="mt-10 inline-flex items-center gap-2 text-[15px] font-medium text-[#0A1344] hover:text-[#2563EB] transition-colors duration-300 group"
            style={anim(150)}
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

      </div>
    </section>
  );
};
