"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GridSection, GridHeader } from "./ContentGrid";

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

  const items = [
    { src: "/Icon/gen.png", label: "Generative Geodata", href: "#" },
    { src: "/Icon/img1.png", label: "Logistics Optimization", href: "#" },
    { src: "/Icon/site.png", label: "Site Selection", href: "#" },
    { src: "/Icon/urban.png", label: "Urban Planning Research", href: "#" },
    { src: "/Icon/more.png", label: "More", href: "#" },
  ];

  return (
    <GridSection>
      <GridHeader
        title="Find your industry"
        subtitle="See how Columbus could help you across every sector."
      />

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="group relative overflow-hidden block transition-colors duration-200 hover:bg-[rgba(120,120,200,0.04)]"
            style={{
              height: 280,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 0.6s ease ${index * 70 + 150}ms, transform 0.6s ease ${index * 70 + 150}ms, background-color 0.2s ease`,
            }}
          >
            <Image
              src={item.src}
              alt={item.label}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              <span className="text-white font-semibold text-[17px]">{item.label}</span>
            </div>
          </Link>
        ))}

        {/* CTA cell fills last spot */}
        <div
          className="flex flex-col items-center justify-center gap-4 p-8 transition-colors duration-200 hover:bg-[rgba(120,120,200,0.04)]"
          style={{
            height: 280,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 600ms",
          }}
        >
          <Link href="/technology" className="text-[#4F46E5] text-sm font-mono tracking-wide hover:underline transition-colors">
            EXPLORE TECHNOLOGY →
          </Link>
          <Link href="/platform" className="text-[#4F46E5] text-sm font-mono tracking-wide hover:underline transition-colors">
            START NOW →
          </Link>
        </div>
      </div>
    </GridSection>
  );
};
