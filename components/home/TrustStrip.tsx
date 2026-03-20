"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

export const TrustStrip = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
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
    <section className="bg-[#FFFFFF] py-[80px] md:py-[120px]">
      <div className="max-w-[980px] mx-auto px-6" ref={sectionRef}>

        {/* Header */}
        <div
          className="mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            filter: visible ? "blur(0px)" : "blur(6px)",
            transition: "opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease",
          }}
        >
          <h2 className="text-[48px] md:text-[56px] font-semibold tracking-[-0.003em] leading-[1.07] text-[#1D1D1F] text-center">
            Your plans are in good hands
          </h2>
          <p className="mt-4 text-[21px] md:text-[24px] font-normal leading-[1.38] text-[#6E6E73] text-center">
            We work with data from reputable global partners.
          </p>
        </div>

        {/* Logos */}
        <div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 items-center justify-items-center mb-20"
          style={{
            opacity: visible ? 0.5 : 0,
            transition: "opacity 0.7s ease 0.15s",
            filter: "grayscale(100%)",
          }}
        >
          <Logo src="/MapsGPTLogos/Logo1.png" />
          <Logo src="/MapsGPTLogos/Logo2.png" />
          <Logo src="/MapsGPTLogos/Logo3.png" />
          <Logo src="/MapsGPTLogos/Logo4.png" />
          <Logo src="/MapsGPTLogos/Logo5.png" />
          <Logo src="/MapsGPTLogos/Logo6.png" />
        </div>

        {/* FAQ */}
        <div
          className="max-w-[680px] mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
          }}
        >
          <h3 className="text-[21px] md:text-[24px] font-semibold text-[#1D1D1F] text-center mb-10">
            Frequently Asked Questions
          </h3>

          <div>
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-[rgba(0,0,0,0.08)]">
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
        </div>

      </div>
    </section>
  );
};

const Logo = ({ src }: { src: string }) => (
  <div className="flex justify-center">
    <Image
      src={src}
      alt=""
      width={105}
      height={30}
      className="object-contain h-6 sm:h-7 w-auto"
    />
  </div>
);
