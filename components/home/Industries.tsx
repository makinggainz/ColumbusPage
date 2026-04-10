"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, GridHeader, GridCell, gl } from "./ContentGrid";

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

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <>
      <GridSection>
        <div ref={ref}>
          <GridHeader
            label=""
            title="Find your industry"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((card, i) => (
              <GridCell key={card.label} flush hoverable={false} style={anim(i * 70 + 150)}>
                <Link href={card.href} className="group relative block overflow-hidden" style={{ minHeight: 280 }}>
                  <Image
                    src={card.src}
                    alt={card.label}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute bottom-0 left-0 px-8 pb-8 text-white text-[17px] font-semibold z-10">
                    {card.label}
                  </span>
                </Link>
              </GridCell>
            ))}

            {/* CTA cell */}
            <GridCell style={anim(CARDS.length * 70 + 150)}>
              <div className="flex flex-col items-center justify-center h-full gap-5 py-12">
                <Link
                  href="/use-cases"
                  className="group flex items-center gap-3 text-[15px] font-medium text-[#0A1344] transition-opacity hover:opacity-60"
                >
                  Explore all industries
                  <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1l5 5-5 5" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="group flex items-center justify-between gap-5 leading-none hover:opacity-90 transition-opacity"
                  style={{ height: 36, paddingLeft: 20, paddingRight: 16, fontSize: 15, fontWeight: 500, backgroundColor: "#000000", color: "white" }}
                >
                  <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Start now</span>
                  <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1l5 5-5 5" />
                  </svg>
                </Link>
              </div>
            </GridCell>
          </div>
        </div>
      </GridSection>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--grid-line)", borderBottom: "1px solid var(--grid-line)" }}>
        <div className="grid-section relative flex flex-wrap max-w-[1287px] mx-5 md:mx-auto" style={anim(550)}>
          <div className="px-8 min-[1287px]:px-10 py-5 flex items-center flex-1 min-w-70" style={{ minHeight: 76, borderRight: gl, backgroundColor: "rgba(37, 99, 235, 0.06)" }}>
            <p className="text-[18px] lg:text-[20px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
              Become a super-explorer.
            </p>
          </div>
          <Link
            href="/use-cases"
            className="group px-8 min-[1287px]:px-10 py-5 flex items-center justify-between hover:opacity-90 transition-opacity flex-1 min-w-70"
            style={{ minHeight: 76, backgroundColor: "#000000" }}
          >
            <span className="text-white text-[18px] lg:text-[20px] font-medium transition-colors duration-300 group-hover:text-[#2563EB]">Start now</span>
            <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
};
