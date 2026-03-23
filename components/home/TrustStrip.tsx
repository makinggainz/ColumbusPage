"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { GridSection, GridHeader, GridCell } from "./ContentGrid";

export const TrustStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const faqs = [
    {
      q: "How were the samples in the video and website generated?",
      a: "Our Columbus Pro-1 model processes satellite imagery, terrain data, and temporal patterns to generate high-fidelity geospatial outputs. All samples shown are real model outputs.",
    },
    {
      q: "How does geospatial intelligence generation work?",
      a: "Columbus Pro-1 fuses multiple data modalities — satellite, terrain, human activity signals — and reasons over them spatially to produce insights, maps, and predictions.",
    },
    {
      q: "Is this available over API?",
      a: "Yes. Columbus Pro-1 is accessible via our REST API and SDK. Contact us at contact@columbus.earth to get API access.",
    },
    {
      q: "What data types are supported?",
      a: "We support satellite imagery, terrain data, infrastructure networks, mobility data, parcel data, and custom survey data ordered on demand.",
    },
    {
      q: "What regions does Columbus cover?",
      a: "Columbus Pro-1 has global coverage, with highest resolution and update frequency in North America and Western Europe.",
    },
  ];

  return (
    <GridSection>
      <GridHeader
        title="Your plans are in good hands"
        subtitle="We work with data from reputable global partners."
      />

      <div ref={ref}>
        {/* Logo row */}
        <div
          className="grid grid-cols-3 sm:grid-cols-6"
          style={{
            opacity: visible ? 0.5 : 0,
            transition: "opacity 0.7s ease 0.15s",
            filter: "grayscale(100%)",
          }}
        >
          {[
            "/MapsGPTLogos/Logo1.png",
            "/MapsGPTLogos/Logo2.png",
            "/MapsGPTLogos/Logo3.png",
            "/MapsGPTLogos/Logo4.png",
            "/MapsGPTLogos/Logo5.png",
            "/MapsGPTLogos/Logo6.png",
          ].map((src, i) => (
            <div
              key={i}
              className="flex items-center justify-center py-6 px-4"
              style={{  }}
            >
              <Image
                src={src}
                alt=""
                width={105}
                height={30}
                className="object-contain h-6 sm:h-7 w-auto"
              />
            </div>
          ))}
        </div>

        {/* FAQ section */}
        <GridCell
          hoverable={false}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
          }}
        >
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#0A1344]/30 font-mono block mb-6">
            FAQ
          </span>

          <div className="max-w-[680px]">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  className="w-full flex items-center justify-between py-5 text-left group"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-[17px] font-semibold text-[#1D1D1F] pr-4">
                    {faq.q}
                  </span>
                  <Plus
                    size={18}
                    strokeWidth={1.5}
                    className={`text-[#6E6E73] shrink-0 transition-transform duration-300 ease-in-out ${openIndex === index ? "rotate-45" : ""}`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: openIndex === index ? "200px" : "0px",
                    opacity: openIndex === index ? 1 : 0,
                  }}
                >
                  <p className="pb-5 text-[17px] leading-[1.47] text-[#6E6E73]">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GridCell>
      </div>
    </GridSection>
  );
};
