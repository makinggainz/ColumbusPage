"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { cambo } from "@/app/fonts";

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
    <section className="bg-black py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="relative">

          {/* Label + Title */}
          <div
            className="mb-6 lg:mb-8"
            style={animStyle(titleVisible, "0.05s")}
          >
            <p className="text-[10px] font-medium tracking-[0.28em] text-white/22 uppercase mb-5">
              Product
            </p>
            <h2
              ref={titleRef}
              className="font-semibold text-white flex items-center gap-4 flex-wrap"
              style={{ fontSize: "clamp(24px, 3vw, 40px)", letterSpacing: "-0.025em" }}
            >
              Introducing Columbus
              <span className="text-[10px] font-medium tracking-[0.22em] text-white/25 border border-white/12 px-3 py-1 uppercase">
                NEW
              </span>
            </h2>
          </div>

          {/* Card */}
          <div
            ref={cardRef}
            data-navbar-theme="dark"
            className="relative overflow-hidden border border-white/[0.07]"
            style={{
              height: 773,
              padding: "52px 64px 0",
              background: "#060606",
              ...animStyle(cardVisible, "0.2s"),
            }}
          >
            {/* Corner glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: -100,
                left: -100,
                width: 500,
                height: 500,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(30,60,200,0.06) 0%, transparent 70%)",
                zIndex: 0,
              }}
              aria-hidden
            />

            {/* Heading */}
            <h2
              className={`${cambo.className} font-normal leading-none text-white relative z-10`}
              style={{ fontSize: "clamp(60px, 6vw, 96px)", letterSpacing: "-0.02em" }}
            >
              Site Selection
              <br />
              Reimagined
            </h2>

            {/* Bullet points */}
            <div className="absolute text-white z-10" style={{ top: 220, left: 64, right: 1072 }}>
              <ul className="space-y-4 list-none pl-0" style={{ fontSize: "17px" }}>
                {[
                  "An end-to-end Site Selection tool.",
                  "Generate new maps, in seconds.",
                  "Find exclusive critical datasets for your decisions.",
                  "Cheaper due diligence.",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-5">
                    <span className="bg-white/50 w-1 h-1 shrink-0" aria-hidden />
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Paragraph + button */}
            <div className="absolute text-white z-10" style={{ bottom: 62, left: 64, right: 1072 }}>
              <p className="text-white/55 mb-8" style={{ fontSize: "17px", lineHeight: 1.5 }}>
                Columbus turns you into a{" "}
                <span className="font-semibold text-white">super-explorer.</span>
              </p>

              <button
                className="bg-white text-black text-[14px] font-semibold hover:bg-white/90 transition-colors h-11 px-8"
              >
                Check it out →
              </button>
            </div>

            {/* DESKTOP UI */}
            <div
              className="absolute bottom-0 right-0 z-10"
              style={{
                width: 997,
                height: 571,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 40px 120px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.5)",
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
                boxShadow: "0 40px 140px rgba(0,0,0,0.95)",
                border: "1px solid rgba(255,255,255,0.04)",
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
