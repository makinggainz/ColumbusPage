"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { GridSection, gl } from "./ContentGrid";

const LOGOS = [
  "/MapsGPTLogos/Logo1.png",
  "/MapsGPTLogos/Logo2.png",
  "/MapsGPTLogos/Logo3.png",
  "/MapsGPTLogos/Logo4.png",
  "/MapsGPTLogos/Logo5.png",
  "/MapsGPTLogos/Logo6.png",
];

const SCROLL_LOGOS = [...LOGOS, ...LOGOS];
const TINT = "grayscale(100%) sepia(40%) hue-rotate(190deg) saturate(120%)";

export const TrustStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

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
            left: -380,
            top: -360,
            opacity: visible ? 1 : 0,
            transform: visible ? "translate(0, 0) scaleX(-1)" : "translate(-500px, -80px) scaleX(-1)",
            transition: "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
          }}
        >
          <Image src="/Fern.png" alt="" width={650} height={910} />
        </div>
        {/* Fern — right side, beyond screen edge */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            right: -380,
            top: -360,
            opacity: visible ? 1 : 0,
            transform: visible ? "translate(0, 0)" : "translate(500px, -80px)",
            transition: "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
          }}
        >
          <Image src="/Fern.png" alt="" width={650} height={910} />
        </div>
        {/* Heading */}
        <div className="flex flex-col items-center text-center px-8 pt-16 pb-4" style={anim(0)}>
          <h2 className="text-[#1D1D1F] text-[36px] font-semibold tracking-[-0.02em] leading-[1.1]">
            Your plans are in good hands
          </h2>
        </div>

        {/* Subtitle */}
        <div className="flex items-center justify-center px-8 pb-10" style={anim(100)}>
          <p className="text-[#6E6E73] text-[20px] font-medium">
            We work with data from reputable brands
          </p>
        </div>

        {/* Logo carousel with edge fade + hover overlay */}
        <div style={anim(200)}>
        <div
          className="relative py-12 mx-auto"
          style={{ width: "85%" }}
        >
          <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="overflow-hidden">
              {/* Left fade */}
              <div
                className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
                style={{ width: 100, background: "linear-gradient(to right, white, transparent)" }}
              />
              {/* Right fade */}
              <div
                className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
                style={{ width: 100, background: "linear-gradient(to left, white, transparent)" }}
              />

              <div
                className="flex items-center gap-16 w-max"
                style={{
                  animation: "trust-scroll 25s linear infinite",
                  animationPlayState: hovered ? "paused" : "running",
                }}
              >
                {SCROLL_LOGOS.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt=""
                    width={120}
                    height={36}
                    className="object-contain h-5.5 md:h-6.5 w-auto shrink-0"
                    style={{ filter: TINT, opacity: 0.5 }}
                  />
                ))}
              </div>
            </div>

            {/* Hover overlay + button */}
            <div
              className="absolute z-20 flex items-center justify-center transition-opacity duration-300"
              style={{
                top: -28,
                bottom: -28,
                left: 0,
                right: 0,
                opacity: hovered ? 1 : 0,
                pointerEvents: hovered ? "auto" : "none",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
                backgroundColor: "rgba(255,255,255,0.4)",
              }}
            >
              <Link
                href="/products"
                className="group flex items-center justify-between gap-3 leading-none whitespace-nowrap hover:opacity-90 transition-all duration-300"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  height: 45,
                  paddingLeft: 20,
                  paddingRight: 16,
                  backgroundColor: "#000000",
                  color: "white",
                  transform: hovered ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 0.3s, transform 0.3s",
                }}
              >
                <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Learn more</span>
                <svg
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  width="10" height="18" viewBox="0 0 7 12" fill="none"
                  stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M1 1l5 5-5 5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-12" />
      </div>

      <style jsx global>{`
        @keyframes trust-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </GridSection>
  );
};
