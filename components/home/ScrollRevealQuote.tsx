"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ── Tile data (moved from VisionSection) ── */
type TileItem =
  | { type: "image"; src: string }
  | { type: "text"; title: string; subtitle: string };

const TILES: TileItem[] = [
  // Row 1
  { type: "image", src: "/image1.png" },
  { type: "text", title: "General Intelligence", subtitle: "for the physical world" },
  { type: "image", src: "/image2.png" },
  { type: "image", src: "/image3.png" },
  { type: "image", src: "/image4.png" },
  // Row 2
  { type: "image", src: "/image111.png" },
  { type: "image", src: "/image112.png" },
  { type: "image", src: "/image113.png" },
  { type: "text", title: "Foundational Models", subtitle: "for Earth" },
  { type: "image", src: "/image114.png" },
];

export function ScrollRevealQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [gridProgress, setGridProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Text fill-in
      const start = vh * 0.95;
      const end = vh * 0.525;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));

      // Grid reveal — starts when grid enters viewport
      const gridEl = gridRef.current;
      if (!gridEl) return;
      const gridRect = gridEl.getBoundingClientRect();
      const gridStart = vh * 0.95;
      const gridEnd = vh * 0.55;
      const gridRaw = (gridStart - gridRect.top) / (gridStart - gridEnd);
      setGridProgress(Math.max(0, Math.min(1, gridRaw)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const text =
    "LLMs hallucinate and cannot be trusted in critical operations, a fundamentally new model is needed for this task";

  const words = text.split(" ");

  return (
    <div
      ref={ref}
      className="relative z-10 max-w-[1287px] mx-auto px-8 min-[1287px]:px-10 pt-0 pb-52 md:pb-72 -mt-16 md:-mt-24"
    >
      {/* Scroll-reveal quote text */}
      <p
        className="text-[24px] md:text-[32px] lg:text-[40px] font-medium leading-[1.3] tracking-[-0.02em]"
      >
        {words.map((word, i) => {
          const wordProgress = (i + 1) / words.length;
          const opacity = progress >= wordProgress ? 1 : 0.12;

          return (
            <span
              key={i}
              style={{
                color: "#1D1D1F",
                opacity,
                transition: "opacity 0.3s ease",
              }}
            >
              {word}{" "}
            </span>
          );
        })}
      </p>

      {/* Image grid — tiles reveal one by one on scroll */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px] mt-16 md:mt-24"
        style={{ gridAutoFlow: "dense" }}
      >
        {TILES.map((tile, i) => {
          const tileThreshold = (i + 1) / TILES.length;
          const opacity = gridProgress >= tileThreshold ? 1 : 0.06;

          if (tile.type === "text") {
            return (
              <div
                key={i}
                className="col-span-1 sm:col-span-2 flex flex-col justify-center items-center text-center px-6"
                style={{
                  opacity,
                  transition: "opacity 0.4s ease",
                }}
              >
                <h3 className="text-[20px] md:text-[25px] font-semibold text-[#1D1D1F] leading-tight tracking-tight">
                  {tile.title}
                </h3>
                <p className="text-base md:text-lg text-[#6E6E73] mt-1 tracking-tight">
                  {tile.subtitle}
                </p>
              </div>
            );
          }

          return (
            <div
              key={i}
              className="relative w-full h-full overflow-hidden"
              style={{
                opacity,
                transition: "opacity 0.4s ease",
              }}
            >
              <Image src={tile.src} alt="" fill className="object-cover" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
