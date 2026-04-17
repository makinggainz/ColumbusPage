"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GridSection, GridHeader, GridCell, gl } from "./ContentGrid";

const LOGOS = [
  "/MapsGPTLogos/Logo1.png",
  "/MapsGPTLogos/Logo2.png",
  "/MapsGPTLogos/Logo3.png",
  "/MapsGPTLogos/Logo4.png",
  "/MapsGPTLogos/Logo5.png",
  "/MapsGPTLogos/Logo6.png",
];

const TINT = "grayscale(100%) sepia(40%) hue-rotate(190deg) saturate(120%)";

const FAQ = [
  { q: "How does Columbus handle data privacy?", a: "All data is processed securely in compliance with GDPR and SOC 2 standards. We never sell or share your data with third parties." },
  { q: "What datasets are available?", a: "Columbus aggregates hundreds of geospatial datasets including demographics, mobility, environmental, infrastructure, and real estate data from vetted partner organizations." },
  { q: "Can I bring my own data?", a: "Yes. You can upload proprietary datasets and overlay them with Columbus data for combined analysis and AI-powered insights." },
  { q: "What industries do you serve?", a: "Columbus serves real estate, urban planning, logistics, government, security, and environmental sectors with tailored geospatial intelligence." },
];

export const TrustStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <GridSection>
      <div ref={ref}>
        <GridHeader
          label=""
          title="Your plans are in good hands"
          subtitle="We work with data from reputable brands"
        />

        {/* Logo grid */}
        <div className="grid grid-cols-3 md:grid-cols-6">
          {LOGOS.map((src, i) => (
            <GridCell key={i} style={anim(i * 40 + 150)}>
              <div className="flex items-center justify-center h-14">
                <Image
                  src={src}
                  alt=""
                  width={120}
                  height={36}
                  className="object-contain h-6 w-auto"
                  style={{ filter: TINT, opacity: 0.5 }}
                />
              </div>
            </GridCell>
          ))}
        </div>

        {/* FAQ accordion */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", ...anim(i * 60 + 250) }}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 md:px-10 py-5 text-left hover:bg-[rgba(120,120,200,0.04)] transition-colors duration-200"
              >
                <span className="text-[17px] font-semibold text-[#1D1D1F]">{item.q}</span>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round"
                  style={{
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                    flexShrink: 0,
                    marginLeft: 16,
                  }}
                >
                  <path d="M7 1v12M1 7h12" />
                </svg>
              </button>
              <div
                style={{
                  maxHeight: openFaq === i ? 200 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <p className="px-6 md:px-10 pb-5 text-[15px] leading-[1.6] text-[#6E6E73]">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GridSection>
  );
};
