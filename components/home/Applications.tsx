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
    { title: "Residential Real Estate", image: "/UseCases/ResidentialRealEstate.jpg", href: "/applications/residential-real-estate" },
    { title: "Commercial Real Estate", image: "/UseCases/CommercialRealEstate.jpg", href: "/applications/commercial-real-estate" },
    { title: "Generative Geodata", image: "/UseCases/GenDatalayers.png", href: "/applications/generative-geodata" },
    { title: "Logistics Optimization", image: "/UseCases/Logistics.webp", href: "/applications/logistics-optimization" },
    { title: "Urban Planning", image: "/UseCases/UrbanPlanning.jpg", href: "/applications/urban-planning" },
    { title: "Site Selection", image: "/UseCases/SiteSelection.jpg", href: "/applications/site-selection" },
    { title: "Consumer Mapping", image: "/UseCases/ConsumerMapping.jpeg", href: "/applications/consumer-mapping" },
    { title: "Ground Due Diligence", image: "/UseCases/GroundDueDillegence.png", href: "/applications/ground-due-diligence" },
    { title: "More", image: "/UseCases/GeoMarketing.png", href: "/applications" },
  ];

  return (
    <GridSection>
      <div ref={ref} style={{ borderBottom: gl }}>
        {/* Header area */}
        <div className="px-8 md:px-10 pt-14 pb-4">
          <h2
            className="text-[#1D1D1F] font-medium tracking-[-0.02em] leading-[1.12]"
            style={{ fontSize: 48, ...anim(0) }}
          >
            We&apos;re actively exploring various application areas
          </h2>
        </div>

        {/* Subtitle + tag row */}
        <div
          className="px-8 md:px-10 pb-8"
          style={anim(100)}
        >
          <p className="text-[#6E6E73] text-[20px] leading-[1.47]">
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
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                priority={index < 3}
              />
              {/* Purple overlay */}
              <div className="absolute inset-0 transition-opacity duration-300" style={{ backgroundColor: "rgba(100, 60, 220, 0.22)" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col z-20 px-5 pb-5">
                <h3 className="text-[17px] font-semibold text-white mb-2">{item.title}</h3>
                <div className="flex items-center gap-10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                  <span className="text-white/90 text-[15px] font-medium">Learn more</span>
                  <svg width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#7B6FE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1l5 5-5 5" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </GridSection>
  );
};
