"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
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
    <section className="bg-black py-28 lg:py-36">
      <Container>
        <div ref={sectionRef}>

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
            <p className="text-[10px] font-medium tracking-[0.28em] text-white/22 uppercase mb-5">
              Trusted Data
            </p>
            <h2
              className="font-semibold text-white leading-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 40px)", letterSpacing: "-0.025em" }}
            >
              Your plans are in good hands
            </h2>
            <p className="mt-3 text-[15px] text-white/38">
              We work with data from reputable global partners.
            </p>
          </div>

          {/* Logos */}
          <div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 items-center mb-20 opacity-45"
            style={{
              opacity: visible ? 0.45 : 0,
              transition: "opacity 0.7s ease 0.15s",
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
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
            }}
          >
            <p className="text-[10px] font-medium tracking-[0.28em] text-white/22 uppercase mb-8">
              Frequently Asked
            </p>

            <div>
              {faqs.map((faq, index) => (
                <div key={index} className="border-t border-white/[0.07]">
                  <button
                    className="w-full flex items-center justify-between py-6 text-left group"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className="flex items-center gap-6">
                      <span className="text-[11px] font-medium tracking-[0.18em] text-white/20 shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] font-medium text-white/65 group-hover:text-white transition-colors duration-200">
                        {faq.q}
                      </span>
                    </span>
                    <Plus
                      size={16}
                      strokeWidth={1.5}
                      className={`text-white/25 shrink-0 ml-4 transition-transform duration-300 ${openIndex === index ? "rotate-45" : ""}`}
                    />
                  </button>
                  {openIndex === index && (
                    <p className="pb-6 pl-[calc(11px+24px)] text-[14px] leading-relaxed text-white/40">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
              <div className="border-t border-white/[0.07]" />
            </div>
          </div>

        </div>
      </Container>
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
