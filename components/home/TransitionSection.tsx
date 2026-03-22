"use client";

import { useEffect, useRef, useState } from "react";

export const TransitionSection = () => {
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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F0F0F5 100%)" }}
    >
      {/* Subtle grid lines fading in — representing the shift from organic mesh to structured data */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: visible ? 0.06 : 0, transition: "opacity 2s ease" }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="transition-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0A1344" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#transition-grid)" />
        </svg>
      </div>

      <div className="max-w-[980px] mx-auto px-6 py-[120px] md:py-[160px] text-center relative z-10">
        <p
          className="text-[15px] tracking-[0.2em] uppercase font-medium text-[#0A1344]/30 mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
          }}
        >
          Beyond the surface
        </p>
        <h2
          className="text-[32px] md:text-[42px] font-semibold tracking-[-0.02em] leading-[1.15] text-[#0A1344]"
          style={{
            opacity: visible ? 1 : 0,
            filter: visible ? "blur(0px)" : "blur(6px)",
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1.2s ease 0.4s, filter 1.2s ease 0.4s, transform 1.2s ease 0.4s",
          }}
        >
          Beneath every surface lies structure.
        </h2>
      </div>
    </section>
  );
};
