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
    <GridSection style={{ borderTop: "none", paddingTop: 100 }}>
      <div ref={ref}>
        <div style={{ marginTop: -54 }}>
        {/* Title */}
        <div
          className="flex items-center justify-center pt-2 pb-12 px-8"
          style={anim(0)}
        >
          <h2 className="font-medium tracking-[-0.02em]" style={{ fontSize: 20, color: "#717074" }}>
            Find your industry
          </h2>
        </div>

        {/* Cards row */}
        <div
          className="flex justify-center items-stretch gap-1.5 px-8 md:px-10 pb-10"
          style={anim(100)}
        >
          {CARDS.map((card, i) => (
            <Link
              key={card.label}
              href={card.href}
              className="group flex flex-col rounded-lg overflow-hidden transition-colors duration-300"
              style={{
                width: card.label === "More" ? 110 : 220,
                background: "rgba(37, 99, 235, 0.06)",
                ...anim(100 + i * 80),
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(37, 99, 235, 0.14)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(37, 99, 235, 0.06)")}
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden" style={card.label === "More" ? { flex: 1 } : { aspectRatio: "4 / 3" }}>
                <Image
                  src={card.src}
                  alt={card.label}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0" style={{ backgroundColor: "rgba(37, 99, 235, 0.14)" }} />
              </div>

              {/* Label */}
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-[#1D1D1F] text-[13px] font-medium">
                  {card.label}
                </span>
                <svg
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                  width="7" height="12" viewBox="0 0 7 12" fill="none"
                  stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M1 1l5 5-5 5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        </div>

        {/* Bottom bar */}
        <div className="grid grid-cols-2 mt-40" style={{ ...anim(550) }}>
          <div className="px-10 flex items-center" style={{ height: 76, borderRight: gl, backgroundColor: "rgba(37, 99, 235, 0.06)" }}>
            <p className="text-[20px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
              Become a super-explorer.
            </p>
          </div>
          <Link
            href="/use-cases"
            className="group pl-10 flex items-center justify-between hover:opacity-90 transition-opacity"
            style={{ height: 76, backgroundColor: "#000000", paddingRight: "calc(var(--page-padding) + 16px)" }}
          >
            <span className="text-white text-[20px] font-medium transition-colors duration-300 group-hover:text-[#2563EB]">Start now</span>
            <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>
    </GridSection>
  );
};
