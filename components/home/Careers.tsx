"use client";

import { useEffect, useRef, useState } from "react";
import { GridSection, gl } from "./ContentGrid";

export const Careers = () => {
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
    <>
    <div style={{ borderTop: gl }} />
    <GridSection style={{ borderTop: "none" }}>
      <div ref={ref} style={{ borderRight: gl, borderBottom: gl }}>
        {/* Top centered heading */}
        <div className="text-center pt-20 pb-24 px-8" style={anim(0)}>
          <h2 className="text-[#0A1344] font-semibold tracking-[-0.02em] leading-[1.08] mb-4" style={{ fontSize: "clamp(36px, 4.5vw, 48px)" }}>
            Hiring Humans.
          </h2>
          <p className="text-[#86868b] text-[21px] tracking-[-0.01em]">
            Our team is based in Washington DC and Madrid.
          </p>
        </div>

        {/* Careers & investment queries row */}
        <div className="px-8 md:px-10">
          <div
            className="grid md:grid-cols-2 gap-8 md:gap-12 items-start pb-6"
            style={anim(100)}
          >
            <h3
              className="text-[#0A1344] font-semibold tracking-[-0.02em] leading-[1.12]"
              style={{ fontSize: "clamp(28px, 3.5vw, 36px)" }}
            >
              Careers &amp; investment queries
            </h3>
            <p className="text-[17px] tracking-[-0.01em] text-[#1D1D1F] md:text-right">
              <span className="opacity-50">
                If you&apos;re excited about creating paradigm shifts in physical world understanding.
              </span>{" "}
              <span className="font-semibold">Join us now.</span>
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-14"
            style={{
              background: "linear-gradient(to right, rgba(10,19,68,0.25) 0%, rgba(10,19,68,0.08) 45%, rgba(10,19,68,0.08) 55%, rgba(10,19,68,0.25) 100%)",
              ...anim(150),
            }}
            aria-hidden
          />
        </div>

        {/* Form */}
        <div className="max-w-xl mx-auto px-8 pb-20" style={anim(200)}>
          <form className="space-y-10">
            <input
              type="text"
              placeholder="Name"
              className="w-full bg-transparent border-b border-[#1D1D1F]/20 pb-3 text-[17px] outline-none placeholder:text-[#1D1D1F]/35 focus:border-[#0A1344] transition-colors"
            />
            <textarea
              placeholder="Message"
              rows={1}
              className="w-full bg-transparent border-b border-[#1D1D1F]/20 pb-3 text-[17px] outline-none resize-none placeholder:text-[#1D1D1F]/35 focus:border-[#0A1344] transition-colors"
            />
            <input
              type="email"
              placeholder="Enter email"
              className="w-full bg-transparent border-b border-[#1D1D1F]/20 pb-3 text-[17px] outline-none placeholder:text-[#1D1D1F]/35 focus:border-[#0A1344] transition-colors"
            />
          </form>

          <p className="mt-3 text-[13px] text-[#86868b] text-right">
            We accept interns.
          </p>

          {/* Submit button */}
          <div className="mt-10">
            <button
              type="submit"
              className="inline-flex items-center gap-3 px-10 py-3.5 border border-[#1D1D1F] text-[#1D1D1F] text-[17px] font-semibold rounded-none hover:bg-[#0A1344] hover:text-white hover:border-[#0A1344] transition-colors"
            >
              Submit
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </GridSection>
    </>
  );
};
