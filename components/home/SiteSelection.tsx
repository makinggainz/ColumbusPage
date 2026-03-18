"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import glassStyles from "@/components/ui/GlassButton.module.css";
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

        {/* Outer wrapper — blobs positioned relative to both title and card */}
        <div className="relative">

          {/* Blob A: just to the right of the title text — small, vivid */}
          <div className="absolute pointer-events-none" style={{
            left: 420, top: 10,
            width: 160, height: 130, borderRadius: "50%",
            background: "radial-gradient(ellipse, #33B1EA 0%, #5A83EC 55%, transparent 100%)",
            filter: "blur(52.4px)", zIndex: 0,
            animation: "intro-blob-A 9s linear infinite",
            opacity: titleVisible ? 0.85 : 0,
            transition: "opacity 0.8s ease-out 0.7s",
          }} />

          {/* Blob B: right at the top-left corner of the card */}
          <div className="absolute pointer-events-none" style={{
            left: -40, top: 48,
            width: 260, height: 220, borderRadius: "50%",
            background: "radial-gradient(ellipse, #73E277 0%, #68E9BC 55%, transparent 100%)",
            filter: "blur(52.4px)", zIndex: 0,
            animation: "intro-blob-B 11s linear infinite",
            animationDelay: "-4s",
            opacity: titleVisible ? 0.52 : 0,
            transition: "opacity 0.8s ease-out 0.7s",
          }} />

          {/* Blob C: bottom-right corner of the card */}
          <div className="absolute pointer-events-none" style={{
            right: -55, bottom: -35,
            width: 300, height: 250, borderRadius: "50%",
            background: "radial-gradient(ellipse, #33B1EA 0%, #9973E2 33%, #E96890 66%, #EC5A67 100%)",
            filter: "blur(52.4px)", zIndex: 0,
            animation: "intro-blob-C 13s linear infinite",
            animationDelay: "-7s",
            opacity: titleVisible ? 0.7 : 0,
            transition: "opacity 0.8s ease-out 0.7s",
          }} />

          {/* Title + New badge */}
          <div className="relative mb-4.75 lg:mb-6.75 flex items-center gap-4" style={{ ...animStyle(titleVisible, "0.1s"), zIndex: 1 }}>
            <h2
              ref={titleRef}
              className="font-semibold text-[#242424]"
              style={{ fontSize: "40px" }}
            >
              + Introducing Columbus
            </h2>

            {/* Glass "New" badge */}
            <div className={glassStyles.wrap + " " + glassStyles.wrapNew}>
              <div className={glassStyles.shadow} />
              <button className={glassStyles.btn + " " + glassStyles.btnNew}>
                <span>New</span>
              </button>
            </div>
          </div>

        <div
          ref={cardRef}
          data-navbar-theme="dark"
          className="relative overflow-hidden"
          style={{
            height: 773,
            padding: "49px 64px 0",
            background: "linear-gradient(314.26deg, rgba(10, 19, 66, 0.9) -6.86%, rgba(29, 59, 94, 0.9) 108.55%)",
            borderRadius: "23px",
            ...animStyle(cardVisible, "0.25s"),
          }}
        >

          {/* Noise texture overlay — Figma: Mono, size 1.5, density 100%, #000000 at 25% opacity */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 0,
              opacity: 0.25,
              backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/><feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0' in='t'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")`,
              backgroundSize: "200px 200px",
              backgroundRepeat: "repeat",
            }}
          />

          {/* Heading */}
          <h2
            className={`${cambo.className} font-normal leading-none text-white`}
            style={{ fontSize: "96px", letterSpacing: "-0.02em" }}
          >
            Site Selection Reimagined
          </h2>

          {/* Bullet points — anchored to top of desktop image */}
          <div className="absolute text-white" style={{ top: 202, left: 64, right: 1072 }}>
            <ul className="space-y-4 text-white list-none pl-0" style={{ fontSize: "20px" }}>
              <li className="flex items-center gap-5">
                <span className="rounded-full bg-white w-2 h-2 shrink-0 bullet-halo" aria-hidden />
                <span>An end-to-end Site Selection tool.</span>
              </li>
              <li className="flex items-center gap-5">
                <span className="rounded-full bg-white w-2 h-2 shrink-0 bullet-halo" aria-hidden />
                <span>Generate new maps, in seconds.</span>
              </li>
              <li className="flex items-center gap-5">
                <span className="rounded-full bg-white w-2 h-2 shrink-0 bullet-halo" aria-hidden />
                <span>Find exclusive critical datasets for your decisions.</span>
              </li>
              <li className="flex items-center gap-5">
                <span className="rounded-full bg-white w-2 h-2 shrink-0 bullet-halo" aria-hidden />
                <span>Cheaper due diligence.</span>
              </li>
            </ul>
          </div>

          {/* Paragraph + button — button bottom sits 62px from card bottom edge */}
          <div className="absolute text-white" style={{ bottom: 62, left: 64, right: 1072 }}>
            <p className="text-white mb-8" style={{ fontSize: "20px" }}>
              Columbus turns you into a{" "}
              <br />
              <span className="font-semibold text-white">super-explorer.</span>
            </p>

            <button className="bg-white text-[#13214C] rounded-xs text-[20px] font-semibold" style={{ width: 226, height: 46 }}>
              Check it out <span style={{ marginLeft: 7 }}>→</span>
            </button>
          </div>

          {/* DESKTOP UI — Figma: 997×571 */}
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: 997,
              height: 571,
              borderRadius: "6px 0 0 0",
              overflow: "hidden",
              border: "7px solid rgba(0,0,0,0.30)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.45)",
            }}
          >
            <Image
              src="/Icon/desktop-ui.png"
              alt="Desktop UI"
              fill
              className="object-cover"
            />
          </div>

          {/* MOBILE UI — Figma: 266×579 */}
          <div
            className="absolute bottom-0"
            style={{
              right: 15,
              width: 266,
              height: 579,
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 40px 140px rgba(0,0,0,0.55)",
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
        </div>{/* end outer blob wrapper */}
      </Container>
    </section>
  );
};