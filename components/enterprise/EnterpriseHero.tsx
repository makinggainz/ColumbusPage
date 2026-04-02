"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConsumerEnterpriseToggle } from "./ConsumerEnterpriseToggle";
import { EnterprisePillsToggle } from "./EnterprisePillsToggle";

const fadeIn = (visible: boolean, delay: number): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  filter: visible ? "blur(0px)" : "blur(8px)",
  transform: visible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
});

export default function EnterpriseHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} data-navbar-theme="dark" className="relative w-full overflow-hidden h-[1853px]">

      {/* Background */}
      <Image
        src="/enterprise/HeroImage.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-[140px] pb-[140px]">

        {/* Toggle */}
        <div className="flex items-center mb-12" style={fadeIn(visible, 0.1)}>
          <ConsumerEnterpriseToggle />
        </div>

        {/* Heading */}
        <h1
          className="mt-[40px] max-w-[1206px] text-white font-light leading-[1.15] text-[42px] md:text-[64px] lg:text-[96px]"
          style={{ letterSpacing: "-0.02em", ...fadeIn(visible, 0.25) }}
        >
          GIS so easy, the janitor could be your new researcher
        </h1>

        {/* Subtext */}
        <p
          className="mt-6 text-white font-light text-[24px] md:text-[32px] leading-[1.2] tracking-[-0.02em] max-w-[477px]"
          style={fadeIn(visible, 0.4)}
        >
          Simple, AI powered GIS for Site Selection, and more.
        </p>

        {/* CTA */}
        <Link
          href="/contact"
          className="group mt-[25px] flex items-center gap-3 text-[14px] font-medium leading-none whitespace-nowrap hover:opacity-90 transition-all duration-300"
          style={{ height: 45, paddingLeft: 20, paddingRight: 16, backgroundColor: "white", color: "#1D1D1F", ...fadeIn(visible, 0.5) }}
        >
          <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Talk to us</span>
          <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l5 5-5 5" />
          </svg>
        </Link>

        {/* Pills + product */}
        <div style={{ marginTop: "100px", ...fadeIn(visible, 0.65) }} className="w-full flex flex-col items-center">
          <EnterprisePillsToggle />

          <div data-navbar-theme="light" className="w-full max-w-[1287px]">
            <Image
              src="/enterprise/hero.png"
              alt="product preview"
              width={1400}
              height={817}
              className="rounded-xl shadow-md w-full h-auto"
            />
          </div>

          {/* Bottom Text */}
          <p className="mt-10 text-white text-[32px] font-medium tracking-[-0.02em]">
            GIS made effortless
          </p>
        </div>

      </div>

    </section>
  );
}
