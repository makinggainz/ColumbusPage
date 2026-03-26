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
    <GridSection fadeTop={false} style={{ borderTop: "none", paddingTop: 100 }}>
      <div ref={ref}>
        <div style={{ marginTop: -150 }}>
        {/* Title */}
        <div
          className="flex items-center justify-center py-8 px-8"
          style={anim(0)}
        >
          <h2 className="text-[#1D1D1F] font-bold tracking-[-0.02em]" style={{ fontSize: 36 }}>
            Find your industry
          </h2>
        </div>

        {/* Cards row */}
        <div
          className="flex justify-center gap-1.5 px-8 md:px-10 pb-10"
          style={anim(100)}
        >
          {CARDS.map((card, i) => (
            <Link
              key={card.label}
              href={card.href}
              className="group block rounded-lg overflow-hidden"
              style={{
                width: 220,
                background: "rgba(18, 8, 52, 0.04)",
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
                <div className="absolute inset-0" style={{ backgroundColor: "rgba(255, 106, 61, 0.10)" }} />
              </div>

              {/* Label */}
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-[#1D1D1F] text-[13px] font-medium">
                  {card.label}
                </span>
                <svg
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                  width="7" height="12" viewBox="0 0 7 12" fill="none"
                  stroke="#FF6A3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M1 1l5 5-5 5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        </div>

        {/* Bottom bar */}
        <div className="grid grid-cols-2 mt-24" style={{ ...anim(550) }}>
          <div className="px-10 flex items-center" style={{ height: 76, borderRight: gl, backgroundColor: "rgba(255, 106, 61, 0.05)" }}>
            <p className="text-[20px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
              Become a super-explorer.
            </p>
          </div>
          <Link
            href="/use-cases"
            className="px-10 flex items-center justify-between hover:opacity-90 transition-opacity"
            style={{ height: 76, backgroundColor: "#000000" }}
          >
            <span className="text-white text-[20px] font-medium">Start now</span>
            <svg width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#FF6A3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>
    </GridSection>
  );
};
