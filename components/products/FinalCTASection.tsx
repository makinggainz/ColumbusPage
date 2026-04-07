"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import glassStyles from "@/components/ui/GlassButton.module.css";
// @ts-expect-error — CSS side-effect import
import "@/components/products/how-it-works-tokens.css";

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
    <section
      ref={sectionRef}
      className="hiw-scope flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(to bottom, var(--hiw-bg-page) 0%, var(--hiw-bg-subtle) 100%)" }}
    >

      {/* ═══════════ MOBILE HERO (below lg:) ═══════════ */}
      <div className="lg:hidden relative w-full overflow-hidden min-h-dvh flex flex-col justify-end">
        <Image src="/ConsumerPageCity3.png" alt="City" fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
        <div
          className="relative z-10 text-white text-center"
          style={{
            paddingInline: "var(--hiw-content-px)",
            paddingBottom: "var(--hiw-space-12)",
            paddingTop: "var(--hiw-space-16)",
            maxWidth: "var(--hiw-max-width)",
            marginInline: "auto",
            width: "100%",
          }}
        >
          {/* Label */}
          <p style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-regular)" as unknown as number,
            fontSize: "var(--hiw-text-xl)",
            letterSpacing: "0.02em",
            lineHeight: 1.4,
            marginBottom: "var(--hiw-space-4)",
          }}>
            <span style={{
              fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
              background: "linear-gradient(180deg, #8DF7FF 0%, #00B1D4 40%, #0089A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12)) drop-shadow(0 0.5px 1px rgba(0,0,0,0.08))",
            }}>MapsGPT</span>
            <span style={{ color: "var(--hiw-text-on-accent)" }}>{" "}is browser based</span>
          </p>
          {/* Title */}
          <h2 style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-bold)" as unknown as number,
            fontSize: "clamp(var(--hiw-text-3xl), 10vw, var(--hiw-text-5xl))",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "var(--hiw-space-4)",
          }}>
            We&apos;re always<br />there for you.
          </h2>
          {/* Subtitle */}
          <p style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-regular)" as unknown as number,
            fontSize: "var(--hiw-text-lg)",
            color: "rgba(255, 255, 255, 0.8)",
            letterSpacing: "-0.01em",
            lineHeight: 1.4,
            marginBottom: "var(--hiw-space-8)",
          }}>
            Access your local AI travel pal<br />on any browser.
          </p>
          <a
            href="https://mapsgpt.es"
            className={`group flex items-center justify-center gap-6 w-full h-[52px] no-underline cursor-pointer active:scale-[0.98] select-none ${glassStyles.btn}`}
            style={{ padding: 0, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
          >
            <span style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: 590,
              fontSize: "var(--hiw-text-lg)",
              letterSpacing: "-0.02em",
              color: "var(--hiw-text-on-accent)",
            }}>
              Try it out! It&apos;s completely free
            </span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0" aria-hidden>
              <path d="M2 11L11 2M11 2H4M11 2V9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* ═══════════ DESKTOP HERO (lg: and above) ═══════════ */}
      <div className="hidden lg:block relative w-full overflow-hidden" style={{ height: `min(${HERO_HEIGHT}px, calc(${HERO_HEIGHT} / ${FRAME_WIDTH} * 100vw))` }}>
        <div
          className="absolute inset-0 origin-top overflow-hidden"
          style={{
            width: FRAME_WIDTH,
            height: HERO_HEIGHT,
            transform: "scale(min(1, 100vw / 1728))",
            transformOrigin: "top left",
            left: "50%",
            marginLeft: -FRAME_WIDTH / 2,
          }}
        >
          <div className="relative w-[1728px] h-[1092px]">
            <div className="absolute left-0 top-0" style={{ width: FRAME_WIDTH, height: HERO_HEIGHT }}>
              <Image src="/ConsumerPageCity3.png" alt="City" fill className="object-cover" priority />
              <div
                className="absolute left-0 top-0"
                style={{ width: 1018, height: 1091, background: "linear-gradient(261.31deg, rgba(0, 0, 0, 0) 5.79%, rgba(0, 0, 0, 0.6) 56.37%)" }}
              />
              {/* Hand holding phone mock */}
              <div
                className="absolute"
                style={{
                  right: 20,
                  top: 180,
                  width: 620,
                  height: 1000,
                  opacity: heartsVisible ? 1 : 0,
                  transform: heartsVisible ? "translateY(0)" : "translateY(40px)",
                  transition: `opacity 0.8s var(--hiw-easing-decel), transform 0.8s var(--hiw-easing-decel)`,
                }}
              >
                <Image src="/ConsumerPageCityMock2.png" alt="MapsGPT on phone" fill className="object-contain object-top" />
              </div>

              {/* Floating hearts */}
              <Image
                src="/how/heart.png" alt="" width={180} height={180} className="absolute"
                style={{
                  right: 480, top: 220,
                  opacity: heartsVisible ? 1 : 0,
                  transform: heartsVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.3)",
                  transition: `opacity var(--hiw-duration-slow) var(--hiw-easing-spring), transform var(--hiw-duration-slow) var(--hiw-easing-spring)`,
                  animation: heartsVisible ? "heartFloat1 4s ease-in-out 0.6s infinite" : "none",
                }}
              />
              <Image
                src="/how/heart.png" alt="" width={140} height={140} className="absolute"
                style={{
                  right: 60, top: 180,
                  opacity: heartsVisible ? 1 : 0,
                  transform: heartsVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.3)",
                  transition: `opacity var(--hiw-duration-slow) var(--hiw-easing-spring) 0.2s, transform var(--hiw-duration-slow) var(--hiw-easing-spring) 0.2s`,
                  animation: heartsVisible ? "heartFloat2 5s ease-in-out 0.8s infinite" : "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* LEFT CONTENT */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div style={{ maxWidth: "var(--hiw-max-width)", marginInline: "auto", width: "100%", paddingInline: "var(--hiw-content-px)" }}>
            <div className="text-white" style={{ maxWidth: 680 }}>
              {/* Label */}
              <p style={{
                fontFamily: "var(--hiw-font-sans)",
                fontWeight: "var(--hiw-weight-regular)" as unknown as number,
                fontSize: "var(--hiw-text-xl)",
                letterSpacing: "0.02em",
                lineHeight: 1.4,
                marginBottom: "var(--hiw-space-4)",
              }}>
                <span style={{
                  fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
                  background: "linear-gradient(180deg, #8DF7FF 0%, #00B1D4 40%, #0089A3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12)) drop-shadow(0 0.5px 1px rgba(0,0,0,0.08))",
                }}>MapsGPT</span>
                <span style={{ color: "var(--hiw-text-on-accent)" }}>{" "}is browser based</span>
              </p>

              {/* Title */}
              <h2 style={{
                fontFamily: "var(--hiw-font-sans)",
                fontWeight: "var(--hiw-weight-bold)" as unknown as number,
                fontSize: "var(--hiw-text-5xl)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: "var(--hiw-space-6)",
              }}>
                We&apos;re always
                <br />
                there for you.
              </h2>

              {/* Subtitle */}
              <p style={{
                fontFamily: "var(--hiw-font-sans)",
                fontWeight: "var(--hiw-weight-regular)" as unknown as number,
                fontSize: "var(--hiw-text-xl)",
                color: "rgba(255, 255, 255, 0.8)",
                letterSpacing: "-0.01em",
                lineHeight: 1.4,
                marginBottom: "var(--hiw-space-10)",
              }}>
                Access your local AI travel pal
                <br />
                on any browser.
              </p>

              <a
                href="https://mapsgpt.es"
                className={`group inline-flex items-center justify-center gap-6 no-underline cursor-pointer active:scale-[0.98] select-none ${glassStyles.btn}`}
                style={{
                  padding: "var(--hiw-space-4) var(--hiw-space-8)",
                  maxWidth: 412,
                  backdropFilter: "blur(3px)",
                  WebkitBackdropFilter: "blur(3px)",
                }}
              >
                <span style={{
                  fontFamily: "var(--hiw-font-sans)",
                  fontWeight: 590,
                  fontSize: "var(--hiw-text-lg)",
                  lineHeight: "var(--hiw-leading-normal)" as unknown as number,
                  letterSpacing: "-0.02em",
                  color: "var(--hiw-text-on-accent)",
                }}>
                  Try it out! It&apos;s completely free
                </span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
                  <path d="M2 11L11 2M11 2H4M11 2V9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM CTA ================= */}
      <div
        className="relative w-full flex flex-col items-center justify-center text-center"
        style={{
          maxWidth: "var(--hiw-max-width)",
          marginInline: "auto",
          paddingInline: "var(--hiw-content-px)",
          paddingTop: "var(--hiw-section-py)",
          paddingBottom: "var(--hiw-section-py)",
        }}
      >
        <p style={{
          fontFamily: "var(--hiw-font-sans)",
          fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
          fontSize: "clamp(var(--hiw-text-xl), 4vw, var(--hiw-text-2xl))",
          lineHeight: "var(--hiw-leading-normal)" as unknown as number,
          color: "var(--hiw-text-primary)",
          marginBottom: "var(--hiw-space-10)",
          maxWidth: 600,
        }}>
          MapsGPT is updated regularly.
          <br />
          We&apos;d love to hear your thoughts.
        </p>

        <div className="flex flex-wrap justify-center" style={{ gap: "var(--hiw-space-8)" }}>
          <Link
            href="/feedback"
            className={`${glassStyles.btn} no-underline cursor-pointer`}
            style={{
              padding: "var(--hiw-space-5) var(--hiw-space-10)",
              fontFamily: "var(--hiw-font-sans)",
              fontSize: "var(--hiw-text-lg)",
              fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
              letterSpacing: "-0.02em",
              color: "var(--hiw-text-primary)",
            }}
          >
            Request a feature
          </Link>

          <Link
            href="/feedback"
            className={`${glassStyles.btn} no-underline cursor-pointer`}
            style={{
              padding: "var(--hiw-space-5) var(--hiw-space-10)",
              fontFamily: "var(--hiw-font-sans)",
              fontSize: "var(--hiw-text-lg)",
              fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
              letterSpacing: "-0.02em",
              color: "var(--hiw-text-primary)",
            }}
          >
            Report a bug
          </Link>
        </div>
      </div>
    </section>
  );
}
