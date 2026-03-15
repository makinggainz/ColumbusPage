"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";

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
        { threshold: 0, rootMargin: "0px 0px -18% 0px" }
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
    transition: `opacity 0.6s ease-out ${delay}, filter 0.6s ease-out ${delay}, transform 0.6s ease-out ${delay}`,
  });

  return (
    <section className="bg-[#FFFFFF] py-16 sm:py-24 lg:py-32">
      <Container>

        <h2
          ref={titleRef}
          className="font-semibold text-[#242424] mb-4.75 lg:mb-6.75"
          style={{ fontSize: "40px", ...animStyle(titleVisible, "0.1s") }}
        >
          + Introducing Columbus
        </h2>

        <div
          ref={cardRef}
          data-navbar-theme="dark"
          className="px-8 sm:px-12 lg:px-16 pt-[17px] pb-[187px] sm:pt-[33px] sm:pb-[203px] lg:pt-[49px] lg:pb-[219px] relative overflow-hidden"
          style={{
            background: "linear-gradient(314.26deg, rgba(10, 19, 66, 0.9) -6.86%, rgba(29, 59, 94, 0.9) 108.55%)",
            borderRadius: "23px",
            ...animStyle(cardVisible, "0.25s"),
          }}
        >

          <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-tight text-white mb-10 lg:mb-12">
            Site Selection Reimagined
          </h2>

          {/* GRID LAYOUT */}
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">

            {/* LEFT CONTENT */}
            <div className="text-white flex flex-col">

              <ul className="space-y-4 text-base sm:text-lg text-[#FFFFFF] list-none pl-0 mb-10">
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-white w-2 h-2 flex-shrink-0 bullet-halo" aria-hidden />
                  <span>An end-to-end Site Selection tool.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-white w-2 h-2 flex-shrink-0 bullet-halo" aria-hidden />
                  <span>Generate new maps, in seconds.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-white w-2 h-2 flex-shrink-0 bullet-halo" aria-hidden />
                  <span>Find exclusive critical datasets for your decisions.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-white w-2 h-2 flex-shrink-0 bullet-halo" aria-hidden />
                  <span>Cheaper due diligence.</span>
                </li>
              </ul>

              <div className="mt-auto mb-[-140px] sm:mb-[-120px] lg:mb-[-160px]">
                <p className="text-base sm:text-lg text-white/70 mb-8">
                  Columbus turns you into a{" "}
                  <br />
                  <span className="font-semibold text-white">
                    super-explorer.
                  </span>
                </p>

                <button className="bg-white text-[#13214C] px-10 py-3 rounded-[2px] font-medium min-w-[200px]">
                  Check it out →
                </button>
              </div>
            </div>

            {/* Right column spacer for grid layout */}
            <div className="relative min-h-[280px] lg:min-h-[320px]" aria-hidden />

          </div>

          {/* DESKTOP + MOBILE IMAGE — positioned at card bottom, right edge 30px from card */}
          <div className="absolute bottom-0 right-[30px] w-[min(calc(50%+200px),calc(100%-60px))] aspect-[102/56] rounded-none overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            <Image
              src="/Icon/desktop-ui.png"
              alt="Desktop UI"
              fill
              className="object-cover"
            />
            <div
              className="
                absolute
                right-0
                translate-x-1/5
                top-0
                h-full
                aspect-[9/16]
                rounded-[32px]
                overflow-hidden
                border-4
                border-white
                shadow-[0_40px_140px_rgba(0,0,0,0.55)]
              "
            >
              <Image
                src="/Icon/mobile-ui.png"
                alt="Mobile UI"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};