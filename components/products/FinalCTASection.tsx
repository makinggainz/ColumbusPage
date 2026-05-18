"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "@/components/products/how-it-works-tokens.css";

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [heartsVisible, setHeartsVisible] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

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
      <div className="lg:hidden relative w-full overflow-hidden flex flex-col">
        <Image src="/ConsumerPageCity3.png" alt="City" fill className="object-cover" priority />
        {/* Bottom-up gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
        {/* Top-down gradient for text readability */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 35%, transparent 65%)" }} />

        {/* Text + CTA */}
        <div
          className="relative z-10 text-white text-center"
          style={{
            paddingInline: "var(--hiw-content-px)",
            paddingTop: "var(--hiw-space-32)",
            paddingBottom: "var(--hiw-space-6)",
            maxWidth: "var(--hiw-max-width)",
            marginInline: "auto",
            width: "100%",
          }}
        >
          {/* Label */}
          <p style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-regular)" as unknown as number,
            fontSize: "var(--hiw-text-lg)",
            letterSpacing: "0.02em",
            lineHeight: 1.4,
            marginBottom: "var(--hiw-space-3)",
          }}>
            <span style={{
              fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
              color: "#FFFFFF",
            }}>MapsGPT</span>
            <span style={{ color: "var(--hiw-text-on-accent)" }}>{" "}is browser based</span>
          </p>
          {/* Title */}
          <h2 style={{
            fontFamily: "var(--hiw-font-display)",
            fontWeight: "var(--hiw-weight-medium)" as unknown as number,
            fontSize: "var(--hiw-text-3xl)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "var(--hiw-space-3)",
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
            marginBottom: "var(--hiw-space-6)",
          }}>
            Access your local AI travel pal<br />on any browser.
          </p>
          <a href="https://mapsgpt.es" className="hiw-cta hiw-cta-light">
            Try MapsGPT it&apos;s free!
            <span className="hiw-cta-arrow">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                <path d="M2 11L11 2M11 2H4M11 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>

        {/* Mock image below text on mobile */}
        <div
          className="relative z-10"
          style={{
            width: "70%",
            maxWidth: 320,
            marginInline: "auto",
            paddingBottom: "var(--hiw-space-4)",
          }}
        >
          <Image
            src="/ConsumerPageCityMock2.png"
            alt="MapsGPT on phone"
            width={320}
            height={600}
            className="w-full h-auto"
            style={{ objectFit: "contain" }}
          />
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
                  color: "#FFFFFF",
                }}>MapsGPT</span>
                <span style={{ color: "var(--hiw-text-on-accent)" }}>{" "}is browser based</span>
              </p>

              {/* Title */}
              <h2 style={{
                fontFamily: "var(--hiw-font-display)",
                fontWeight: "var(--hiw-weight-medium)" as unknown as number,
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

              <a href="https://mapsgpt.es" className="hiw-cta hiw-cta-light">
                Try MapsGPT it&apos;s free!
                <span className="hiw-cta-arrow">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                    <path d="M2 11L11 2M11 2H4M11 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overrides for bottom CTA card */}
      <style>{`
        @media (max-width: 1023px) {
          .hiw-scope .cta-feedback-card {
            height: auto !important;
            min-height: 0 !important;
          }
          .hiw-scope .cta-feedback-card .cta-feedback-text {
            padding: var(--hiw-space-12) var(--hiw-space-8) var(--hiw-space-10) !important;
            align-items: flex-start !important;
          }
          .hiw-scope .cta-feedback-card .cta-feedback-text h3 {
            font-size: 32px !important;
          }
          .hiw-scope .cta-feedback-card .cta-feedback-text p {
            font-size: 20px !important;
          }
        }
      `}</style>

      {/* ================= BOTTOM CTA — creative card ================= */}
      <div
        style={{
          width: "100%",
          paddingTop: "var(--hiw-section-py)",
          paddingBottom: "var(--hiw-section-py)",
          paddingInline: "var(--hiw-content-px)",
        }}
      >
        <div
          className="cta-feedback-card"
          onMouseEnter={() => { if (window.innerWidth >= 1024) setCardHovered(true); }}
          onMouseLeave={() => { if (window.innerWidth >= 1024) setCardHovered(false); }}
          style={{
            position: "relative",
            borderRadius: "var(--hiw-radius-2xl)",
            overflow: "hidden",
            height: 698,
            maxWidth: "var(--hiw-max-width)",
            marginInline: "auto",
            display: "flex",
            alignItems: "center",
            background: `
              radial-gradient(ellipse 80% 80% at 0% 0%, rgba(95,191,241,0.25) 0%, transparent 100%),
              radial-gradient(ellipse 80% 80% at 100% 100%, rgba(1,163,93,0.2) 0%, transparent 100%),
              var(--hiw-bg-subtle)
            `,
          }}
        >
          {/* Floating travel images — right side */}
          <div className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center" style={{ width: "55%" }}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {[
                { src: "(22).jpeg", right: 60, top: 80, w: 220, h: 165, rot: 3, hoverRot: 6, hoverX: 10, hoverY: -12 },
                { src: "(19).jpeg", right: 260, top: 200, w: 240, h: 180, rot: -2, hoverRot: -5, hoverX: -8, hoverY: -10, z: 1 },
                { src: "(24).jpeg", right: 80, top: 380, w: 210, h: 155, rot: 4, hoverRot: 1, hoverX: 12, hoverY: 8 },
                { src: "(17).jpeg", right: 320, top: 420, w: 190, h: 145, rot: -3, hoverRot: -6, hoverX: -10, hoverY: 6 },
                { src: "(20).jpeg", right: 480, top: 120, w: 180, h: 135, rot: -4, hoverRot: -1, hoverX: -6, hoverY: -8 },
              ].map((img, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    right: img.right,
                    top: img.top,
                    width: img.w,
                    height: img.h,
                    borderRadius: "var(--hiw-radius-lg)",
                    overflow: "hidden",
                    boxShadow: cardHovered ? "var(--hiw-shadow-card-hover)" : "var(--hiw-shadow-card)",
                    zIndex: img.z ?? 0,
                    transform: cardHovered
                      ? `rotate(${img.hoverRot}deg) translate(${img.hoverX}px, ${img.hoverY}px)`
                      : `rotate(${img.rot}deg)`,
                    transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease",
                  }}
                >
                  <img src={`/FavoriteSpots/${encodeURIComponent(img.src)}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Text + buttons — left side */}
          <div className="cta-feedback-text" style={{
            position: "relative",
            zIndex: 2,
            padding: "var(--hiw-space-16)",
            paddingLeft: "var(--hiw-space-20)",
            maxWidth: 560,
          }}>
            <h3 style={{
              fontFamily: "var(--hiw-font-display)",
              fontWeight: "var(--hiw-weight-medium)" as unknown as number,
              fontSize: "clamp(var(--hiw-text-2xl), 5vw, var(--hiw-text-4xl))",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--hiw-text-primary)",
              margin: 0,
              marginBottom: "var(--hiw-space-4)",
            }}>
              MapsGPT is updated
              <br />
              regularly.
            </h3>
            <p style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: "var(--hiw-weight-regular)" as unknown as number,
              fontSize: "var(--hiw-text-lg)",
              lineHeight: "var(--hiw-leading-relaxed)" as unknown as number,
              color: "var(--hiw-text-secondary)",
              margin: 0,
              marginBottom: "var(--hiw-space-8)",
              maxWidth: 440,
            }}>
              We&apos;d love to hear your thoughts. Help us shape the future of travel discovery.
            </p>

            <div className="flex flex-wrap" style={{ gap: "var(--hiw-space-4)" }}>
              <Link href="/feedback" className="hiw-cta">
                Request a feature
              </Link>
              <Link href="/feedback" className="hiw-cta">
                Report a bug
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
