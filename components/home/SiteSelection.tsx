"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const SiteSelection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const [cardVisible,  setCardVisible]  = useState(false);

  useEffect(() => {
    const observe = (el: HTMLElement | null, onVisible: () => void) => {
      if (!el) return () => {};
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { onVisible(); obs.disconnect(); } },
        { threshold: 0, rootMargin: "0px 0px -12% 0px" }
      );
      obs.observe(el);
      return () => obs.disconnect();
    };
    const cleanups = [
      observe(titleRef.current, () => setTitleVisible(true)),
      observe(cardRef.current,  () => setCardVisible(true)),
    ];
    return () => cleanups.forEach(fn => fn());
  }, []);

  const animStyle = (visible: boolean, delay = "0s") => ({
    opacity:    visible ? 1 : 0,
    filter:     visible ? "blur(0px)" : "blur(8px)",
    transform:  visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease-out ${delay}, filter 0.7s ease-out ${delay}, transform 0.7s ease-out ${delay}`,
  });

  return (
    <section className="bg-[#FFFFFF] py-[80px] md:py-[120px]">
      <div className="max-w-[980px] mx-auto px-6">

        {/* Centered intro */}
        <div
          className="text-center mb-12"
          style={animStyle(titleVisible, "0.05s")}
        >
          <p className="text-[17px] font-semibold text-[#6E6E73] mb-4">
            Product
          </p>
          <h2
            ref={titleRef}
            className="text-[48px] md:text-[56px] font-semibold tracking-[-0.003em] leading-[1.07] text-[#1D1D1F] text-center"
          >
            Site Selection Reimagined
          </h2>
          <p className="text-[21px] md:text-[24px] font-normal leading-[1.38] text-[#6E6E73] text-center max-w-[600px] mx-auto mt-4">
            An entirely new way to explore, analyze, and decide.
          </p>
        </div>

        {/* Large feature card */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl bg-[#F5F5F7]"
          style={{
            minHeight: 680,
            ...animStyle(cardVisible, "0.2s"),
          }}
        >
          {/* Text content - top left */}
          <div className="relative z-10 p-10 md:p-14 lg:p-16 max-w-[420px]">
            {/* Bullet points */}
            <ul className="space-y-4 mb-10">
              {[
                "An end-to-end Site Selection tool.",
                "Generate new maps, in seconds.",
                "Find exclusive critical datasets for your decisions.",
                "Cheaper due diligence.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[10px] w-[5px] h-[5px] rounded-full bg-[#6E6E73] shrink-0" aria-hidden />
                  <span className="text-[17px] font-normal leading-[1.47] text-[#1D1D1F]">{item}</span>
                </li>
              ))}
            </ul>

            {/* Super-explorer tagline */}
            <p className="text-[17px] leading-[1.47] text-[#6E6E73] mb-8">
              Columbus turns you into a{" "}
              <span className="font-semibold text-[#6E6E73]">super-explorer.</span>
            </p>

            {/* CTA links + pill button */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/platform"
                className="bg-[#0071E3] text-white rounded-full px-[22px] py-[11px] text-[17px] font-normal hover:bg-[#0077ED] transition-colors"
              >
                Start now
              </Link>
              <Link
                href="/technology"
                className="text-[#0066CC] text-[20px] hover:underline transition-colors"
              >
                Learn more &#8250;
              </Link>
              <Link
                href="/platform"
                className="text-[#0066CC] text-[20px] hover:underline transition-colors"
              >
                Try it now &#8250;
              </Link>
            </div>
          </div>

          {/* DESKTOP UI mockup */}
          <div
            className="absolute bottom-0 right-0 z-10 hidden md:block"
            style={{
              width: "62%",
              height: "75%",
              overflow: "hidden",
              borderTopLeftRadius: 12,
              boxShadow: "0 40px 120px rgba(0,0,0,0.08), 0 0 60px rgba(0,0,0,0.04)",
            }}
          >
            <Image
              src="/Icon/desktop-ui.png"
              alt="Desktop UI"
              fill
              className="object-cover object-top-left rounded-tl-xl"
            />
          </div>

          {/* MOBILE UI mockup */}
          <div
            className="absolute bottom-0 z-20 hidden md:block"
            style={{
              right: 16,
              width: 200,
              height: "78%",
              overflow: "hidden",
              borderRadius: 20,
              boxShadow: "0 40px 140px rgba(0,0,0,0.10)",
            }}
          >
            <Image
              src="/Icon/mobile-ui.png"
              alt="Mobile UI"
              fill
              className="object-cover rounded-[20px]"
            />
          </div>

          {/* Mobile-only stacked images */}
          <div className="block md:hidden px-6 pb-6">
            <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-sm">
              <Image
                src="/Icon/desktop-ui.png"
                alt="Desktop UI"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
