"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section ref={sectionRef} className="w-full bg-black flex flex-col items-center pt-[240px] pb-[50px] px-8 md:px-10">

      {/* TOP TEXT */}
      <p
        className="
        text-white text-center
        text-[30px] leading-[140%]
        tracking-[0.3em]
        max-w-[491px]
        mb-[140px]
        max-md:text-[22px]
        -mt-[90px]
        "
        style={anim(0)}
      >
        We’re at the frontier.
        <br />
        The horizon is wide.
      </p>

      {/* IMAGE CARD */}
      <div
        style={anim(150)}
        className="
        relative
        w-full
        max-w-[1296px]
        h-[562px]
        rounded-[9px]
        overflow-hidden
        max-lg:h-[460px]
        max-md:h-[360px]
        "
      >
        <Image
          src="/use-cases/endImage2.png"
          alt=""
          fill
          className="object-cover"
          priority
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/10" />

        {/* CONTENT */}
        <div
          className="
          absolute inset-0
          flex flex-col items-center justify-center
          text-center
          px-6
          "
        >
          <p
            className="
            text-white
            text-[40px]
            max-w-[600px]
            mb-8
            max-md:text-[22px]
            "
            style={{ fontWeight: 300, letterSpacing: "-0.02em", lineHeight: "130%" }}
          >
            We’d love to work with you. Contact us, or
            <br />
            Check out our{" "}
            <Link
              href="/products"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              style={{ borderBottom: "0.5px solid currentColor", paddingBottom: "1px" }}
            >
              Products
            </Link>
          </p>

          <button
            type="button"
            className="group flex items-center gap-3 leading-none whitespace-nowrap hover:opacity-90 transition-all duration-300"
            style={{ fontSize: 14, fontWeight: 500, height: 45, paddingLeft: 20, paddingRight: 16, backgroundColor: "white", color: "#1D1D1F" }}
          >
            <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Talk to us</span>
            <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>

    </section>
  );
}