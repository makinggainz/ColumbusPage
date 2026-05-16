"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ProductBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: "url(/enterpriseartbackground.png)",
        backgroundSize: "100% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
      }}
    >
      <div
        className="relative z-10 flex flex-col items-center justify-center px-4 md:px-10"
        style={{
          paddingTop: "clamp(120px, 15vw, 230px)",
          paddingBottom: "clamp(120px, 15vw, 230px)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <h2
          className="text-center leading-[1.1] text-[28px] md:text-[39px] lg:text-[49px]"
          style={{
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "#1D1D1F",
          }}
        >
          <strong>Columbus Pro</strong>
          {" — "}
          GIS made effortless
        </h2>

        <Link
          href="/contact"
          className="group mt-10 flex items-center gap-3 text-[15px] lg:text-[20px] font-medium transition-opacity"
          style={{ color: "var(--ent-text-primary)" }}
        >
          <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Try Demo</span>
          <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
