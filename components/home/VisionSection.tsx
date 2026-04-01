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
      <div ref={sentinelTopRef} className="h-0" />

      <GridSection className="grid-section-fade-top">
        {/* Heading */}
        <div
          ref={ref}
          className="px-8 min-[1287px]:px-10 py-12 md:py-16"
        >
          <h2
            className="text-[#1D1D1F] leading-[1.15] tracking-[-0.02em] text-[31px] md:text-[39px] lg:text-[49px]"
            style={{ fontWeight: 500, ...anim(0) }}
          >
            <span style={{ opacity: 0.7 }}>Introducing</span>{" "}<span className="font-medium">new kind of AI,</span>{" "}
            <span className="font-semibold">COLUMBUS-01</span>
          </h2>
        </div>

        {/* Image grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px]"
          style={{ gridAutoFlow: "dense" }}
        >
          {/* Row 1 */}
          <Tile src="/image1.png" anim={anim} i={0} />
          <TextTile title="General Intelligence" subtitle="for the physical world" anim={anim} i={1} />
          <Tile src="/image2.png" anim={anim} i={2} />
          <Tile src="/image3.png" anim={anim} i={3} />
          <Tile src="/image4.png" anim={anim} i={4} />

          {/* Row 2 */}
          <Tile src="/image111.png" anim={anim} i={5} />
          <Tile src="/image112.png" anim={anim} i={6} />
          <Tile src="/image113.png" anim={anim} i={7} />
          <TextTile title="Foundational Models" subtitle="for Earth" anim={anim} i={8} />
          <Tile src="/image114.png" anim={anim} i={9} />
        </div>

      </GridSection>

      {/* Bottom bar — full width with grid lines */}
      <div style={{
        borderTop: "1px solid var(--grid-line)",
        borderBottom: "1px solid var(--grid-line)"
      }}>
        <div className="grid-section relative flex flex-wrap max-w-[1287px] mx-5 md:mx-auto" style={anim(260)}>
          <div className="px-8 min-[1287px]:px-10 py-5 flex items-center flex-1 min-w-70" style={{ minHeight: 76, borderRight: gl, backgroundColor: "rgba(37, 99, 235, 0.06)" }}>
            <p className="text-[18px] lg:text-[20px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
              Think of us like the OpenAI for maps.
            </p>
          </div>
          <Link
            href="/technology"
            className="group px-8 min-[1287px]:px-10 py-5 flex items-center justify-between hover:opacity-90 transition-opacity flex-1 min-w-70"
            style={{ minHeight: 76, backgroundColor: "#000000" }}
          >
            <span className="text-white text-[18px] lg:text-[20px] font-medium transition-colors duration-300 group-hover:text-[#2563EB]">Our research &amp; technology</span>
            <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>

      <div ref={sentinelBottomRef} className="h-0" />
    </div>
  );
};


/* ── Tile components ── */

const TILE_STAGGER = 120; // ms between each tile appearing

const Tile = ({ src, anim, i }: { src: string; anim: (delay?: number) => React.CSSProperties; i: number }) => (
  <div
    className="relative w-full h-full overflow-hidden"
    style={anim(100 + i * TILE_STAGGER)}
  >
    <Image src={src} alt="" fill className="object-cover" />
  </div>
);

const TextTile = ({ title, subtitle, anim, i }: { title: string; subtitle: string; anim: (delay?: number) => React.CSSProperties; i: number }) => (
  <div
    className="col-span-1 sm:col-span-2 flex flex-col justify-center items-center text-center px-6"
    style={anim(100 + i * TILE_STAGGER)}
  >
    <h3 className="text-[20px] md:text-[25px] font-semibold text-[#1D1D1F] leading-tight tracking-tight">
      {title}
    </h3>
    <p className="text-base md:text-lg text-[#6E6E73] mt-1 tracking-tight">{subtitle}</p>
  </div>
);
