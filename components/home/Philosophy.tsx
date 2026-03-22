"use client";

import { useEffect, useRef, useState } from "react";

export const Philosophy = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-[120px] md:py-[180px]">
      <div ref={ref} className="max-w-[720px] mx-auto px-6 text-center">

        {/* Eyebrow */}
        <p
          className="text-[13px] tracking-[0.15em] uppercase font-medium text-[#0A1344]/25 mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          Why Columbus Earth
        </p>

        {/* Core philosophy statement */}
        <h2
          className="text-[32px] md:text-[44px] font-semibold tracking-[-0.02em] leading-[1.15] text-[#0A1344] mb-8"
          style={{
            opacity: visible ? 1 : 0,
            filter: visible ? "blur(0px)" : "blur(6px)",
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 1s ease 0.2s, filter 1s ease 0.2s, transform 1s ease 0.2s",
          }}
        >
          The physical world deserves a foundation model.
        </h2>

        {/* Body paragraphs */}
        <div
          className="space-y-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 1s ease 0.5s, transform 1s ease 0.5s",
          }}
        >
          <p className="text-[17px] leading-[1.8] text-[#0A1344]/50">
            Language models changed how we interact with text. Image models
            changed how we create visuals. But the planet — the most complex,
            consequential dataset in existence — still lacks a model that truly
            understands it.
          </p>
          <p className="text-[17px] leading-[1.8] text-[#0A1344]/50">
            We believe geospatial intelligence should be as intuitive as
            a conversation and as rigorous as a scientific instrument. That
            is what we are building — not another mapping tool, but a reasoning
            engine for the physical world.
          </p>
          <p className="text-[17px] leading-[1.8] text-[#0A1344]/50">
            Every data point has a location. Every location has a story.
            Our model reads both.
          </p>
        </div>

        {/* Minimal divider */}
        <div
          className="mx-auto mt-14"
          style={{
            width: visible ? 48 : 0,
            height: 1,
            background: "#0A1344",
            opacity: 0.12,
            transition: "width 1.2s ease 0.8s",
          }}
        />
      </div>
    </section>
  );
};
