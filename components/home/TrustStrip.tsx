"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";

const LOGOS = [
  "/MapsGPTLogos/Logo1.png",
  "/MapsGPTLogos/Logo2.png",
  "/MapsGPTLogos/Logo3.png",
  "/MapsGPTLogos/Logo4.png",
  "/MapsGPTLogos/Logo5.png",
  "/MapsGPTLogos/Logo6.png",
];

export const TrustStrip = () => {
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
    <GridSection style={{ borderTop: "none" }}>
      <div ref={ref} style={{ borderBottom: gl }}>
        {/* Heading */}
        <div className="flex flex-col items-center text-center px-8 pt-16 pb-4" style={anim(0)}>
          <h2 className="text-[#1D1D1F] text-[36px] font-semibold tracking-[-0.02em] leading-[1.1]">
            Your plans are in good hands
          </h2>
        </div>

        {/* Subtitle */}
        <div className="flex items-center justify-center px-8 pb-12" style={anim(100)}>
          <p className="text-[#6E6E73] text-[20px]">
            We work with data from reputable brands
          </p>
        </div>

        {/* Logo row */}
        <div
          className="flex items-center justify-center gap-12 md:gap-16 px-8 py-12 flex-wrap"
          style={{
            ...anim(200),
            filter: "grayscale(100%)",
            opacity: visible ? 0.4 : 0,
          }}
        >
          {LOGOS.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt=""
              width={120}
              height={36}
              className="object-contain h-7 md:h-8 w-auto"
            />
          ))}
        </div>

        {/* Bottom spacing */}
        <div className="h-12" />
      </div>
    </GridSection>
  );
};
