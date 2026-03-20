"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
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

  return (
    <section className="bg-white py-20 md:py-28 lg:py-36">
      <Container>
        <div>

          {/* GRID */}
          <div
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1.25 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px]"
            style={{
              opacity: gridVisible ? 1 : 0,
              filter: gridVisible ? "blur(0px)" : "blur(8px)",
              transform: gridVisible ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.6s ease-out 0.15s, filter 0.6s ease-out 0.15s, transform 0.6s ease-out 0.15s",
            }}
          >
            {/* ROW 1 */}
            <Tile src="/image1.png" className="rounded-tl-[20px]" />

            <div className="col-span-2 bg-white flex flex-col items-center justify-center px-6">
              <span className="inline-block border border-[#0A1344]/30 rounded-full px-4 py-1.5 text-sm text-[#1C274C]/70 mb-3">
                We are
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0A1344] leading-tight tracking-tight text-center">
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

            {/* ROW 2 */}
            <Tile src="/image7.png" className="rounded-bl-[20px]" />
            <Tile src="/image8.png" />
            <Tile src="/image9.png" />
            <Tile src="/image10.png" />
            <Tile src="/image12.png" />
            <Tile src="/image14.png" />
            <Tile src="/image15.png" />
            <Tile src="/image16.png" className="rounded-br-[20px]" />
          </div>

          {/* BOTTOM TEXT */}
          <div className="mt-12 md:mt-16 flex flex-col items-center text-center max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-[#1C274C]/70 leading-relaxed">
              We&apos;re building foundation models that{" "}
              <span className="text-[#0A1344]">understand the physical
              world through geospatial core reasoning</span>. <span className="text-[#0A1344]">ColumbusPro-1</span> processes
              satellite imagery, terrain data, human activity, and temporal
              patterns to generate{" "}
              <span className="text-[#0A1344]">actionable intelligence</span> across real estate,
              research, and consumer domains.
            </p>

            <p className="text-base md:text-lg text-[#0A1344] font-medium mt-6">
              Think of us like the OpenAI for maps.
            </p>

            <Link
              href="/technology"
              className="mt-8 inline-flex items-center justify-center border border-[#0A1344]/30 px-12 py-4 text-lg font-bold tracking-wide rounded-full hover:opacity-80 transition-opacity whitespace-nowrap text-[#0A1344]"
            >
              [ Check out our technology ]
            </Link>
          </div>

        </div>
      </Container>
    </section>
  );
};

const Tile = ({ src, className = "" }: { src: string; className?: string }) => (
  <div className={`relative w-full h-full overflow-hidden ${className}`}>
    <Image src={src} alt="" fill className="object-cover" />
  </div>
);
