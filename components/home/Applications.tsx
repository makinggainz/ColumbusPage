"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, GridHeader } from "./ContentGrid";

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
      <GridHeader
        title="Exploring various application areas"
        subtitle="We'd love to work within your industry — hey@columbus.earth"
      />

      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
        }}
      >
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="relative group overflow-hidden block"
            style={{
              aspectRatio: "16/10",
            }}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              priority={index < 3}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col z-20 px-5 pb-5">
              <h3 className="text-[17px] font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-white/70 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out font-mono text-[11px] tracking-wide">
                LEARN MORE →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </GridSection>
  );
};
