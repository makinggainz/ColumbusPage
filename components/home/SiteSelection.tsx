"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { spaceGrotesk } from "@/lib/typography";

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
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="relative">

          {/* Label + Title */}
          <div
            className="mb-6 lg:mb-8"
            style={animStyle(titleVisible, "0.05s")}
          >
            <p className="text-[10px] font-medium tracking-[0.28em] text-[#A1A1AA] uppercase mb-5">
              Product
            </p>
            <h2
              ref={titleRef}
              className="font-bold text-[#09090B] flex items-center gap-4 flex-wrap tracking-tight"
              style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
            >
              Introducing Columbus
              <span className="text-[10px] font-medium tracking-[0.22em] text-[#A1A1AA] border border-[#E4E4E7] px-3 py-1 uppercase">
                NEW
              </span>
            </h2>
          </div>

          {/* Card */}
          <div
            ref={cardRef}
            data-navbar-theme="dark"
            className="relative overflow-hidden border border-[#E4E4E7] bg-[#FAFAFA]"
            style={{
              height: 773,
              padding: "52px 64px 0",
              ...animStyle(cardVisible, "0.2s"),
            }}
          >
            {/* Heading */}
            <h2
              className={`${spaceGrotesk.className} font-bold leading-none text-[#09090B] relative z-10`}
              style={{ fontSize: "clamp(60px, 6vw, 96px)", letterSpacing: "-0.02em" }}
            >
              Site Selection
              <br />
              Reimagined
            </h2>

            {/* Bullet points */}
            <div className="absolute text-[#3F3F46] z-10" style={{ top: 220, left: 64, right: 1072 }}>
              <ul className="space-y-4 list-none pl-0" style={{ fontSize: "17px" }}>
                {[
                  "An end-to-end Site Selection tool.",
                  "Generate new maps, in seconds.",
                  "Find exclusive critical datasets for your decisions.",
                  "Cheaper due diligence.",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-5">
                    <span className="bg-[#09090B] w-1 h-1 shrink-0" aria-hidden />
                    <span className="text-[#3F3F46]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Paragraph + buttons */}
            <div className="absolute z-10" style={{ bottom: 62, left: 64, right: 1072 }}>
              <p className="text-[#A1A1AA] mb-8" style={{ fontSize: "17px", lineHeight: 1.5 }}>
                Columbus turns you into a{" "}
                <span className="font-semibold text-[#09090B]">super-explorer.</span>
              </p>

              <div className="flex items-center gap-3">
                <button
                  className="bg-[#09090B] text-white text-[14px] font-medium hover:bg-[#3F3F46] transition-colors h-11 px-8"
                >
                  Check it out &rarr;
                </button>
                <button
                  className="border border-[#E4E4E7] text-[#3F3F46] text-[14px] font-medium hover:bg-[#FAFAFA] transition-colors h-11 px-8"
                >
                  Learn more
                </button>
              </div>
            </div>

            {/* DESKTOP UI */}
            <div
              className="absolute bottom-0 right-0 z-10"
              style={{
                width: 997,
                height: 571,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 40px 120px rgba(0,0,0,0.08), 0 0 60px rgba(0,0,0,0.04)",
              }}
            >
              <Image
                src="/Icon/desktop-ui.png"
                alt="Desktop UI"
                fill
                className="object-cover"
              />
            </div>

            {/* MOBILE UI */}
            <div
              className="absolute bottom-0 z-20"
              style={{
                right: 15,
                width: 266,
                height: 579,
                overflow: "hidden",
                boxShadow: "0 40px 140px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
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
