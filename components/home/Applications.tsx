"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";

export const Applications = () => {
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

  const items = [
    { title: "Residential Real Estate", image: "/UseCases/ResidentialRealEstate.jpg", href: "/use-cases" },
    { title: "Commercial Real Estate", image: "/UseCases/CommercialRealEstate.jpg", href: "/use-cases" },
    { title: "Generative Geodata", image: "/UseCases/GenDatalayers.png", href: "/use-cases" },
    { title: "Logistics Optimization", image: "/UseCases/Logistics.webp", href: "/use-cases" },
    { title: "Urban Planning", image: "/UseCases/UrbanPlanning.jpg", href: "/use-cases" },
    { title: "Site Selection", image: "/UseCases/SiteSelection.jpg", href: "/use-cases" },
    { title: "Consumer Mapping", image: "/UseCases/ConsumerMapping.jpeg", href: "/use-cases" },
    { title: "Ground Due Diligence", image: "/UseCases/GroundDueDillegence.png", href: "/use-cases" },
    { title: "More", image: "/UseCases/GeoMarketing.png", href: "/use-cases" },
  ];

  return (
    <>
      {/* Top bar — full width with grid lines */}
      <div style={{
        borderTop: "0.8px solid var(--grid-line)",
        borderBottom: "0.8px solid var(--grid-line)"
      }}>
        <div className="flex items-center justify-between max-w-[1287px] mx-auto px-8 min-[1287px]:px-10 py-6" style={anim(0)}>
          <span className="text-[18px] lg:text-[20px] text-[#1D1D1F] font-bold" style={{ letterSpacing: "-0.02em" }}>
            Applications <span className="hidden min-[640px]:inline font-normal">– across industries</span>
          </span>
          <Link
            href="/use-cases"
            className="group flex items-center gap-3 min-[640px]:gap-10 text-[18px] lg:text-[20px] text-[#1D1D1F] font-semibold transition-opacity"
          >
            <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Explore</span>
            <svg
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              width="9" height="16" viewBox="0 0 7 12" fill="none"
              stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M1 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>

    <GridSection extendTop>
      <div ref={ref} style={{ borderBottom: gl }}>
        {/* Header area */}
        <div className="px-8 min-[1287px]:px-10 pt-14 pb-4">
          <h2
            className="text-[#1D1D1F] font-medium tracking-[-0.02em] leading-[1.12] text-[31px] md:text-[39px] lg:text-[49px]"
            style={{ letterSpacing: "-0.02em", ...anim(0) }}
          >
            We&apos;re actively exploring various{" "}<br />application areas
          </h2>
        </div>

        {/* Subtitle + tag row */}
        <div
          className="px-8 min-[1287px]:px-10 pb-8"
          style={anim(100)}
        >
          <p className="text-[#6E6E73] text-[16px] md:text-[20px] leading-[1.47] font-medium">
            We&apos;d love to work within your industry, send us a{" "}
            <a href="mailto:hey@columbus.earth" className="text-[#1D1D1F] hover:underline">
              hey@columbus.earth
            </a>
          </p>
        </div>

        {/* 3×3 image grid — flush, no gaps */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={anim(200)}
        >
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="relative group overflow-hidden block"
              style={{ aspectRatio: "16/10" }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                priority={index < 3}
              />
              {/* Purple overlay */}
              <div className="absolute inset-0 transition-opacity duration-300" style={{ backgroundColor: "rgba(37, 99, 235, 0.18)" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300" />
              {/* Title — sits at bottom, lifts on hover (always lifted on touch) */}
              <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-8 translate-y-0 group-hover:-translate-y-8 pointer-coarse:-translate-y-8 transition-transform duration-300 ease-out">
                <h3 className="text-md font-semibold text-white">{item.title}</h3>
              </div>
              {/* Learn more — fades in at bottom on hover (always visible on touch) */}
              <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-8 flex items-center gap-4 pointer-coarse:gap-4 group-hover:gap-10 opacity-0 group-hover:opacity-100 pointer-coarse:opacity-100 transition-all duration-300 ease-out">
                <span className="text-white/90 text-[15px] font-medium">Learn more</span>
                <svg width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 1l5 5-5 5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </GridSection>
    </>
  );
};
