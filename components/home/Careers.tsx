"use client";

import { useEffect, useRef, useState } from "react";
import { GridSection, GridHeader, GridCell } from "./ContentGrid";

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
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <GridSection>
      <GridHeader
        label="12 — JOIN US"
        title="Hiring Humans."
        subtitle="Our team is based in Washington DC and Madrid. We are building the first production Large Geospatial Model."
      />

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2">
        {/* Info cell */}
        <GridCell style={anim(0)} className="flex flex-col justify-center">
          <p className="text-[17px] leading-[1.6] text-[#6E6E73] mb-6">
            We are a group of engineers, designers, and company builders
            developing foundation models and data collection innovations to
            power the geospatial intelligence systems of tomorrow.
          </p>
          <p className="text-[13px] text-[#6E6E73] font-mono tracking-wide uppercase">
            We accept interns.
          </p>
        </GridCell>

        {/* Form cell */}
        <GridCell style={anim(150)}>
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your name"
              className="w-full bg-[#F5F5F7] border border-[var(--grid-line)] px-4 py-3 text-[17px] text-[#1D1D1F] outline-none placeholder:text-[#6E6E73] focus:ring-2 focus:ring-[#4F46E5] transition-shadow"
            />
            <textarea
              placeholder="Your message"
              rows={3}
              className="w-full bg-[#F5F5F7] border border-[var(--grid-line)] px-4 py-3 text-[17px] text-[#1D1D1F] outline-none resize-none placeholder:text-[#6E6E73] focus:ring-2 focus:ring-[#4F46E5] transition-shadow"
            />
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-[#F5F5F7] border border-[var(--grid-line)] px-4 py-3 text-[17px] text-[#1D1D1F] outline-none placeholder:text-[#6E6E73] focus:ring-2 focus:ring-[#4F46E5] transition-shadow"
            />
            <button
              type="submit"
              className="w-full bg-[#0A1344] text-white py-3 text-[17px] font-semibold mt-4 hover:bg-[#0A1344]/85 transition-colors"
            >
              Send Message
            </button>
          </form>
        </GridCell>
      </div>
    </GridSection>
  );
};
