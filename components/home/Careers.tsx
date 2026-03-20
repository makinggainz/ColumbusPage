"use client";

import { useEffect, useRef, useState } from "react";

export const Careers = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    filter: visible ? "blur(0px)" : "blur(6px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, filter 0.7s ease ${delay}ms`,
  });

  return (
    <section className="bg-[#F5F5F7] py-[80px] md:py-[120px]">
      <div className="max-w-[980px] mx-auto px-6" ref={sectionRef}>

        {/* Big heading */}
        <div className="mb-16 md:mb-20" style={anim(0)}>
          <h2 className="text-[56px] md:text-[80px] font-semibold tracking-[-0.003em] leading-[1.05] text-[#1D1D1F] text-center">
            Hiring Humans.
          </h2>
          <p className="mt-6 text-[21px] font-normal leading-[1.38] text-[#6E6E73] text-center max-w-[600px] mx-auto">
            Our team is based in Washington DC and Madrid. We are building the first production
            Large Geospatial Model.
          </p>
        </div>

        {/* Form card */}
        <div
          className="bg-white rounded-3xl p-[40px] md:p-[60px] max-w-[580px] mx-auto"
          style={anim(150)}
        >
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your name"
              className="w-full bg-[#F5F5F7] rounded-xl border-none px-4 py-3 text-[17px] text-[#1D1D1F] outline-none placeholder:text-[#6E6E73] focus:ring-2 focus:ring-[#0071E3] transition-shadow"
            />
            <textarea
              placeholder="Your message"
              rows={3}
              className="w-full bg-[#F5F5F7] rounded-xl border-none px-4 py-3 text-[17px] text-[#1D1D1F] outline-none resize-none placeholder:text-[#6E6E73] focus:ring-2 focus:ring-[#0071E3] transition-shadow"
            />
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-[#F5F5F7] rounded-xl border-none px-4 py-3 text-[17px] text-[#1D1D1F] outline-none placeholder:text-[#6E6E73] focus:ring-2 focus:ring-[#0071E3] transition-shadow"
            />
            <button
              type="submit"
              className="w-full bg-[#0071E3] text-white rounded-full py-3 text-[17px] font-semibold mt-4 hover:bg-[#0077ED] transition-colors"
            >
              Send Message
            </button>
            <p className="text-[#6E6E73] text-[14px] text-center mt-4">
              We accept interns.
            </p>
          </form>
        </div>

      </div>
    </section>
  );
};
