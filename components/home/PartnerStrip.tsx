"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GridSection } from "./ContentGrid";

const LOGOS = [
  "/Icon/logo1.png",
  "/Icon/logo2.png",
  "/Icon/image1.png",
  "/Icon/logo4.png",
  "/Icon/image2.png",
  "/Icon/logo6.png",
  "/Icon/logo7.png",
];

const SCROLL_LOGOS = [...LOGOS, ...LOGOS];
const TINT = "grayscale(100%) sepia(40%) hue-rotate(190deg) saturate(120%)";

export const PartnerStrip = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <GridSection style={{ borderTop: "none", paddingTop: 100 }}>
      <div className="flex flex-col items-center px-8 md:px-10 pt-32">
        <h2 className="font-medium tracking-[-0.02em] text-[#1D1D1F] text-center text-[25px] md:text-[31px] lg:text-[39px]">
          High-fidelity and smart datasets
        </h2>
        <p className="text-[16px] lg:text-[20px] mt-3 text-center font-medium" style={{ color: "#6E6E73" }}>
          We vet our data with reputable partner organizations
        </p>
      </div>

      {/* Carousel with edge fade + hover overlay */}
      <div
        className="relative pt-10 pb-28 mx-auto"
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
              className="flex items-center gap-14 w-max"
              style={{
                animation: "partner-scroll 30s linear infinite",
                animationPlayState: hovered ? "paused" : "running",
              }}
            >
              {SCROLL_LOGOS.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={175}
                  height={62}
                  className="object-contain h-[48px] w-auto shrink-0"
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
              href="/technology"
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

      <div className="flex justify-center pb-20">
        <div style={{ width: "85%", height: 1, background: "var(--grid-line)" }} />
      </div>

      <style jsx global>{`
        @keyframes partner-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </GridSection>
  );
};
