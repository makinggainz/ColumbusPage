"use client";

import { useState } from "react";
import Image from "next/image";

const USE_CASES_IMAGES = [
  "agent.png", "chat.png", "com.png", "comm.png", "due.png", "env.png",
  "gen.png", "geo.png", "gd.png", "gm.png", "gmap.png", "grid.png",
  "havana.png", "hero.png", "layer1.png", "layer2.png", "layer3.png",
  "logistics.png", "log.png", "map.png", "mapchat.png", "onsite.png",
  "pin.png", "pins.png", "planning.png", "res.png", "research.png",
  "result1.png", "result2.png", "result3.png", "result4.png",
  "security.png", "site.png", "tourism.png", "ub.png", "urban.png", "urb.png",
  "geomarketing.png", "residentila.png", "comercial.png",
];

export default function UseCasesHero() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cellSize = 150;
  const cols = 20;
  const rows = 10;
  const totalCells = cols * rows;

  return (
    <section className="relative w-full min-h-[1055px] flex items-center justify-center overflow-hidden bg-black">

      {/* Interactive grid: image in a square only visible when that square is hovered */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridAutoRows: `${cellSize}px`,
          maskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 70%)",
        }}
        aria-hidden
      >
        {Array.from({ length: totalCells }, (_, i) => (
          <div
            key={i}
            className="relative w-full h-full overflow-hidden"
            style={{ width: cellSize, height: cellSize }}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <Image
              src={`/use-cases/${USE_CASES_IMAGES[i % USE_CASES_IMAGES.length]}`}
              alt=""
              fill
              className={`object-cover transition-opacity ease-in-out ${activeIndex === i ? "opacity-100 duration-[810ms]" : "opacity-0 duration-[585ms]"}`}
              sizes={`${cellSize}px`}
            />
          </div>
        ))}
      </div>

      {/* THIN-LINE GRID — 150px × 150px squares, fades out from center */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "150px 150px",
          maskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* CENTER CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pointer-events-none">

        <p className="text-gray-400 text-[32px] mb-4 max-md:text-[14px]">
          An agentic approach to geography and space
        </p>

        <h1 className="text-white font-semibold text-[64px] leading-[140%] max-md:text-[36px]">
          More than Site Selection
        </h1>

        <p className="text-gray-400 text-[32px] mt-3 max-md:text-[16px]">
          Industry use cases of Columbus Pro
        </p>

      </div>

    </section>
  );
}