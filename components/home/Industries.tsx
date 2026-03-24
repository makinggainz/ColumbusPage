"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";

const CARDS = [
  { src: "/Icon/gen.png", label: "City Security", href: "/use-cases" },
  { src: "/Icon/urban.png", label: "Urban Planning", href: "/use-cases" },
  { src: "/Icon/site.png", label: "Site Selection", href: "/use-cases" },
  { src: "/Icon/img1.png", label: "CRE", href: "/use-cases" },
  { src: "/Icon/more.png", label: "More", href: "/use-cases" },
];

export const Industries = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <>
    <GridSection style={{ borderTop: "none" }}>
      <div ref={ref}>
        {/* Title */}
        <div
          className="flex items-center justify-center py-8 px-8"
          style={{ borderRight: gl, borderBottom: gl, ...anim(0) }}
        >
          <h2 className="text-[#1D1D1F] text-[24px] md:text-[28px] font-normal tracking-[-0.01em]">
            Find your industry
          </h2>
        </div>

        {/* Cards row */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          style={{ borderBottom: gl }}
        >
          {CARDS.map((card, i) => (
            <Link
              key={card.label}
              href={card.href}
              className="group block"
              style={{
                borderRight: gl,
                ...anim(100 + i * 80),
              }}
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
                <Image
                  src={card.src}
                  alt={card.label}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Label */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[#1D1D1F] text-[15px] font-medium">
                  {card.label}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="#6E6E73"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <path d="M4 1h9v9" />
                  <path d="M13 1L1 13" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA button */}
        <div
          className="flex items-center justify-center py-6 px-8"
          style={{ borderRight: gl, borderBottom: gl, ...anim(550) }}
        >
          <Link
            href="/maps-gpt"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-none border border-[#1D1D1F] text-[#1D1D1F] text-[17px] font-medium hover:bg-[#1D1D1F] hover:text-white transition-colors"
          >
            Learn more about Columbus Pro
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </GridSection>
    <div style={{ borderTop: gl }} />
    </>
  );
};
