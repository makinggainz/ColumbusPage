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
    <GridSection style={{ borderTop: "none", paddingTop: 100, overflow: "visible", position: "relative" }}>
      <div ref={ref} style={{ borderBottom: gl, position: "relative", overflow: "visible" }}>
        {/* Fern — left side, beyond screen edge */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: -500,
            top: -450,
            opacity: visible ? 1 : 0,
            transform: visible ? "translate(0, 0) scaleX(-1)" : "translate(-500px, -80px) scaleX(-1)",
            transition: "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
          }}
        >
          <Image src="/Fern.png" alt="" width={840} height={1176} />
        </div>
        {/* Fern — right side, beyond screen edge */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            right: -500,
            top: -450,
            opacity: visible ? 1 : 0,
            transform: visible ? "translate(0, 0)" : "translate(500px, -80px)",
            transition: "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
          }}
        >
          <Image src="/Fern.png" alt="" width={840} height={1176} />
        </div>
        {/* Heading */}
        <div className="flex flex-col items-center text-center px-8 pt-16 pb-4" style={anim(0)}>
          <h2 className="text-[#1D1D1F] text-[36px] font-semibold tracking-[-0.02em] leading-[1.1]">
            Your plans are in good hands
          </h2>
        </div>

        {/* Subtitle */}
        <div className="flex items-center justify-center px-8 pb-10" style={anim(100)}>
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
              className="object-contain h-5.5 md:h-6.5 w-auto"
            />
          ))}
        </div>

        {/* Bottom spacing */}
        <div className="h-12" />
      </div>
    </GridSection>
  );
};
