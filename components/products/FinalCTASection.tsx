"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [heartsVisible, setHeartsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeartsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const FRAME_WIDTH = 1728;
  const HERO_HEIGHT = 1092;

  return (
    <section ref={sectionRef} className="bg-white flex flex-col items-center overflow-hidden">

      {/* ═══════════ MOBILE HERO (below lg:) ═══════════ */}
      <div className="lg:hidden relative w-full overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <Image src="/ConsumerPageCity.png" alt="City" fill className="object-cover" priority />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 z-10 text-white px-6 pb-8 pt-16">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/MapsGPT-logo.png" alt="MapsGPT" width={24} height={24} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} />
            <p className="font-medium text-white text-[20px]" style={{ letterSpacing: "-0.02em" }}>
              <span className="font-semibold" style={{ color: "#8DF7FF" }}>MapsGPT</span>{" "}is browser based
            </p>
          </div>
          <h2 className="text-[36px] sm:text-[48px] font-semibold leading-[105%] mb-4 tracking-[-0.02em]">
            We&apos;re always<br />there for you.
          </h2>
          <p className="text-[20px] font-medium text-white mb-6 leading-[140%]">
            Access your local AI travel pal<br />on any browser.
          </p>
          <a
            href="https://mapsgpt.es"
            className={`group flex items-center justify-center gap-6 w-full h-[52px] no-underline cursor-pointer active:scale-[0.98] select-none ${glassStyles.btn}`}
            style={{ padding: 0, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
          >
            <span style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 590, fontSize: "20px", letterSpacing: "-0.02em", color: "#ffffff" }}>
              Try it out! It&apos;s completely free
            </span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0" aria-hidden>
              <path d="M2 11L11 2M11 2H4M11 2V9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* ═══════════ DESKTOP HERO (lg: and above) ═══════════ */}
      <div
        className="hidden lg:block origin-top"
        style={{
          width: FRAME_WIDTH,
          height: HERO_HEIGHT,
          transform: "scale(min(1, 100vw / 1728))",
          transformOrigin: "top center",
        }}
      >
        <div className="relative w-[1728px] h-[1092px]">

          {/* ================= HERO IMAGE ================= */}
          <div
            className="absolute left-0 top-0"
            style={{ width: FRAME_WIDTH, height: HERO_HEIGHT }}
          >
            <Image
              src="/ConsumerPageCity.png"
              alt="City"
              fill
              className="object-cover"
              priority
            />

            {/* Rectangle 3299: left overlay gradient */}
            <div
              className="absolute left-0 top-0"
              style={{
                width: 1018,
                height: 1091,
                background: "linear-gradient(261.31deg, rgba(0, 0, 0, 0) 5.79%, rgba(0, 0, 0, 0.6) 56.37%)",
              }}
            />

            {/* LEFT CONTENT */}
            <div
              className="absolute text-white z-10"
              style={{
                left: 160,
                top: 280,
                width: 680,
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Image
                  src="/MapsGPT-logo.png"
                  alt="MapsGPT"
                  width={32}
                  height={32}
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
                />
                <p
                  className="font-medium text-white"
                  style={{ fontSize: 36, letterSpacing: "-0.02em", lineHeight: "140%" }}
                >
                  <span className="font-semibold" style={{ color: "#8DF7FF" }}>MapsGPT</span>
                  {" "}is browser based
                </p>
              </div>

              <h2 className="text-[80px] font-semibold leading-[105%] mb-8">
                We’re always
                <br />
                there for you.
              </h2>

              <p className="text-[36px] font-medium text-white mb-10 leading-[140%]">
                Access your local AI travel pal
                <br />
                on any browser.
              </p>

              <a
                href="https://mapsgpt.es"
                className={`group flex items-center justify-center gap-10 no-underline cursor-pointer active:scale-[0.98] select-none ${glassStyles.btn}`}
                style={{ width: 412, height: 71, padding: 0, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
              >
                <span
                  style={{
                    fontFamily: "’SF Pro’, -apple-system, BlinkMacSystemFont, sans-serif",
                    fontWeight: 590,
                    fontSize: "20px",
                    lineHeight: "140%",
                    letterSpacing: "-0.02em",
                    color: "#ffffff",
                  }}
                >
                  Try it out! It&apos;s completely free
                </span>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                >
                  <path
                    d="M2 11L11 2M11 2H4M11 2V9"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            {/* PHONE SCREEN OVERLAY */}
            <a
              href="https://mapsgpt.es"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute overflow-hidden cursor-pointer"
              style={{
                left: 1151,
                top: 316,
                width: 234,
                height: 545,
                borderRadius: 24,
              }}
            >
              <Image
                src="/MapsGPTMobile.png"
                alt="Phone screen"
                fill
                className="object-cover"
                style={{ borderRadius: 24 }}
              />
            </a>

            {/* FLOATING HEARTS */}
            <Image
              src="/how/heart.png"
              alt=""
              width={180}
              height={180}
              className="absolute"
              style={{
                left: FRAME_WIDTH * 0.75 - 300,
                top: 200,
                opacity: heartsVisible ? 1 : 0,
                transform: heartsVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.3)",
                transition: "opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                animation: heartsVisible ? "heartFloat1 4s ease-in-out 0.6s infinite" : "none",
              }}
            />

            <Image
              src="/how/heart.png"
              alt=""
              width={160}
              height={160}
              className="absolute"
              style={{
                left: FRAME_WIDTH * 0.75 + 150,
                top: 300,
                opacity: heartsVisible ? 1 : 0,
                transform: heartsVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.3)",
                transition: "opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
                animation: heartsVisible ? "heartFloat2 5s ease-in-out 0.8s infinite" : "none",
              }}
            />
          </div>

        </div>
      </div>

      {/* ================= CTA: centered in viewport ================= */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center py-16 px-4 max-w-[1408px] mx-auto">
            <p className="text-[#2C2C2C] text-[27px] sm:text-[36px] leading-[150%] mb-10 max-w-[600px] font-semibold">
              MapsGPT is updated regularly.
              <br />
              We’d love to hear your thoughts.
            </p>

            <div className="flex flex-wrap gap-8 justify-center">
              <Link
                href="/feedback"
                className={`${glassStyles.btn} no-underline text-[#2C2C2C] cursor-pointer`}
                style={{
                  padding: "18px 40px",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Request a feature
              </Link>

              <Link
                href="/feedback"
                className={`${glassStyles.btn} no-underline text-[#2C2C2C] cursor-pointer`}
                style={{
                  padding: "18px 40px",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Report a bug
              </Link>
            </div>
      </div>
    </section>
  );
}