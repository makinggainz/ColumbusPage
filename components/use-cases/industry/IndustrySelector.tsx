"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIndustry } from "./IndustryContext";
import { INDUSTRY_CONTENT, INDUSTRY_ORDER } from "./content";

type IndustrySelectorProps = {
  lightTheme?: boolean;
};

/**
 * Industry tile picker — 4 rows × 3 cols on desktop, bounded by the page's
 * 1287px content rail (vertical structure lines on either side via
 * section-lines-{dark,light}). Tiles are short (16:9) with a blurred photo
 * background and a label overlaid. Hover reveals an underline + downward
 * arrow on the label; the active selection has no extra emphasis here (the
 * sticky sub-navbar above shows what's active).
 */
export default function IndustrySelector({ lightTheme = false }: IndustrySelectorProps) {
  const { industryId, setIndustryId } = useIndustry();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  const handleSelect = (id: typeof industryId) => {
    setIndustryId(id);
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>("[data-use-case-rows]");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // Theme tokens.
  const sectionBg = lightTheme ? "bg-white" : "bg-black";
  const sectionLinesClass = lightTheme ? "section-lines-light" : "section-lines-dark";
  const headingTextClass = lightTheme ? "text-[#1D1D1F]" : "text-white";
  const subtitleTextClass = lightTheme ? "text-[rgba(29,29,31,0.55)]" : "text-white/55";

  return (
    <section className={`w-full ${sectionBg} flex justify-center`}>
      <div
        ref={sectionRef}
        className={`${sectionLinesClass} w-full max-w-[1287px] mx-auto py-[120px] max-md:py-[72px]`}
      >
        {/* Header */}
        <div className="text-center px-8 md:px-10 mb-[48px] max-md:mb-[36px]" style={anim(0)}>
          <p className={`text-[13px] font-normal tracking-[0.08em] uppercase ${subtitleTextClass}`}>
            Pick your industry
          </p>
          <h2
            className={`mt-3 text-[39px] md:text-[49px] font-medium leading-[1.15] tracking-[-0.02em] ${headingTextClass}`}
          >
            Tell us where you work
          </h2>
        </div>

        {/* Tile grid — bounded inside the section-lines container. Short
            (16:9) tiles, edge-to-edge within the bounds. */}
        <div
          className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-0"
          style={anim(120)}
        >
          {INDUSTRY_ORDER.map((id) => {
            const item = INDUSTRY_CONTENT[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                className="group relative block aspect-16/5 overflow-hidden cursor-pointer"
                aria-pressed={industryId === id}
              >
                {/* Blurred image background */}
                <Image
                  src={item.imageSrc}
                  alt=""
                  fill
                  className="object-cover scale-110 transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: "blur(6px) brightness(0.55)" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Idle scrim — slight dim to keep label legible */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none" aria-hidden />

                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-center px-6 md:px-8 text-center">
                  <span className="relative inline-flex items-baseline gap-3 text-white text-[20px] md:text-[20px] lg:text-[25px] font-medium leading-[1.15] tracking-[-0.01em]">
                    <span className="relative">
                      {item.name}
                      {/* Hover-only underline */}
                      <span
                        className="absolute left-0 -bottom-2 h-px bg-white w-0 group-hover:w-full pointer-events-none"
                        style={{ transition: "width 500ms cubic-bezier(0.22, 1, 0.36, 1)" }}
                        aria-hidden
                      />
                    </span>
                    {/* Hover-only down arrow */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center"
                      aria-hidden
                    >
                      <path d="M9 3v12M4 10l5 5 5-5" />
                    </svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer text */}
        <div className="text-center px-8 md:px-10 mt-[48px] max-md:mt-[36px]" style={anim(120)}>
          <p className={`text-[16px] md:text-[20px] leading-[1.5] ${subtitleTextClass}`}>
            The sections below tailor to the industry you choose. You can switch any time.
          </p>
        </div>
      </div>
    </section>
  );
}
