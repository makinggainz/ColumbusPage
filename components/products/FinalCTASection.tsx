"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "@/components/products/how-it-works-tokens.css";

// Friends-on-the-globe markers. Positioned in the 1728×1298 coord-space
// so each chip lands over a recognisable continent on the globe artwork.
const FRIEND_PINS = [
  { left: 360,  top: 700,  name: "Mera",   place: "Park", dist: "Nearby", img: "https://i.pravatar.cc/96?img=16", delay: 0 },
  { left: 900,  top: 600,  name: "Diana",  place: "Café", dist: "1 hr",   img: "https://i.pravatar.cc/96?img=35", delay: 0.12 },
  { left: 1020, top: 860,  name: "Adison", place: "Home", dist: "25 min", img: "https://i.pravatar.cc/96?img=3",  delay: 0.24 },
  { left: 460,  top: 960,  name: "Aliza",  place: "Zara", dist: "20 min", img: "https://i.pravatar.cc/96?img=44", delay: 0.36 },
];

export default function FinalCTASection() {
  const FRAME_WIDTH = 1728;
  // Image's own aspect at FRAME_WIDTH (1447×1087 → 1298 at 1728 wide).
  // The image lives in its own wrapper anchored to the BOTTOM of the
  // section; everything above it is empty sky-band so the headline + CTA
  // don't overlap the earth.
  const IMAGE_HEIGHT = 1298;
  const SKY_BAND = 250;
  const HERO_HEIGHT = IMAGE_HEIGHT + SKY_BAND; // 1548

  const sectionRef = useRef<HTMLElement>(null);
  const [pinsVisible, setPinsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setPinsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hiw-scope flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(to bottom, var(--hiw-bg-page) 0%, var(--hiw-bg-subtle) 100%)" }}
    >

      {/* ═══════════ MOBILE HERO (below lg:) ═══════════ */}
      {/* Section aspect-ratio adds ~19% extra height over the image's own
          1447×1087 (≈ desktop's 250px sky band, scaled): mirrors desktop
          so the headline + CTA sit on a clean white sky band above the
          earth, never overlapping it. */}
      <div
        className="lg:hidden relative w-full overflow-hidden"
        style={{ aspectRatio: "1447 / 1304" }}
      >
        {/* Globe artwork — anchored to the BOTTOM at its natural aspect. */}
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{ aspectRatio: "1447 / 1087" }}
        >
          <Image src="/consumer-final-cta-elio-ending.png" alt="Elio across the globe" fill className="object-cover" priority />

          {/* Floating profile pins — positioned as % of the image wrapper
              so each chip lands on the same continent at any viewport. */}
          {FRIEND_PINS.map((p, i) => {
            const leftPct = (p.left / 1728) * 100;
            const topPct = (p.top / 1298) * 100;
            return (
              <FriendPin key={i} p={p} leftPct={leftPct} topPct={topPct} mobile visible={pinsVisible} />
            );
          })}
        </div>

        {/* Text + CTA — anchored to the top of the section, over the sky band */}
        <div
          className="relative z-10 text-center"
          style={{
            paddingInline: "var(--hiw-content-px)",
            paddingTop: "clamp(20px, 5vw, 48px)",
            maxWidth: "var(--hiw-max-width)",
            marginInline: "auto",
            width: "100%",
          }}
        >
          <p style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-regular)" as unknown as number,
            fontSize: "var(--hiw-text-base)",
            letterSpacing: "0.02em",
            lineHeight: 1.4,
            marginBottom: "var(--hiw-space-2)",
            color: "#0B1342",
          }}>
            <span style={{
              fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
              background: "linear-gradient(180deg, #00B1D4 0%, #0089A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Elio</span>
            <span>{" "}is browser based</span>
          </p>
          <h2 style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-bold)" as unknown as number,
            fontSize: "clamp(28px, 6vw, 44px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "var(--hiw-space-2)",
            color: "#0B1342",
          }}>
            We&apos;re always there for you.
          </h2>
          <p style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-regular)" as unknown as number,
            fontSize: "var(--hiw-text-sm)",
            color: "rgba(11, 19, 66, 0.7)",
            letterSpacing: "-0.01em",
            lineHeight: 1.5,
            marginBottom: "var(--hiw-space-4)",
          }}>
            Access your local AI travel pal on any browser.
          </p>
          {/* Navy primary CTA — bg-cta + white text/arrow, matches navbar. */}
          <a
            href="https://mapsgpt.es"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-3 rounded-button bg-cta px-5 py-3 no-underline transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ maxWidth: "fit-content", marginInline: "auto" }}
          >
            <span style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: 590,
              fontSize: "16px",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
            }}>
              Try Elio it&apos;s free!
            </span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
              <path d="M2 11L11 2M11 2H4M11 2V9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>

      {/* ═══════════ DESKTOP HERO (lg: and above) ═══════════ */}
      {/* Section is FRAME_WIDTH × HERO_HEIGHT (1728 × 1548). The globe
          image is anchored to the bottom at its natural 1728×1298 aspect;
          a 250px sky band at the TOP gives the headline + CTA room to
          breathe over pure white, never overlapping the earth. */}
      <div className="hidden lg:block relative w-full overflow-hidden" style={{ height: `min(${HERO_HEIGHT}px, calc(${HERO_HEIGHT} / ${FRAME_WIDTH} * 100vw))` }}>
        <div
          className="absolute inset-0 origin-top overflow-hidden"
          style={{
            width: FRAME_WIDTH,
            height: HERO_HEIGHT,
            transform: `scale(min(1, 100vw / ${FRAME_WIDTH}))`,
            transformOrigin: "top left",
            left: "50%",
            marginLeft: -FRAME_WIDTH / 2,
          }}
        >
          <div className="relative" style={{ width: FRAME_WIDTH, height: HERO_HEIGHT }}>
            {/* Globe artwork — anchored to the BOTTOM of the inner frame,
                at its natural aspect. The top SKY_BAND px stays empty so
                the headline + CTA above sit on pure white sky. */}
            <div
              className="absolute left-0 right-0"
              style={{ bottom: 0, height: IMAGE_HEIGHT }}
            >
              <Image src="/consumer-final-cta-elio-ending.png" alt="Elio across the globe" fill className="object-cover" priority />

              {/* Floating profile-pin markers — friends at locations, drawn
                  over the continents on the globe. Each pin = AT-place
                  label + circular avatar + name·distance chip; fades +
                  scales in staggered as the section enters view. Coords
                  are in the 1728×1298 image-wrapper space, not the outer
                  section, so adding sky band doesn't move the pins. */}
              {FRIEND_PINS.map((p, i) => (
                <FriendPin key={i} p={p} leftPx={p.left} topPx={p.top} visible={pinsVisible} />
              ))}
            </div>
          </div>
        </div>

        {/* TOP-ANCHORED CONTENT — sits over the white sky band at the top
            of the globe image, in dark Columbus-navy ink. */}
        <div className="absolute inset-0 z-10 flex items-start justify-center" style={{ paddingTop: "clamp(48px, 5vw, 96px)" }}>
          <div className="text-center" style={{ maxWidth: 720, paddingInline: "var(--hiw-content-px)" }}>
            {/* Label */}
            <p style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: "var(--hiw-weight-regular)" as unknown as number,
              fontSize: "var(--hiw-text-lg)",
              letterSpacing: "0.02em",
              lineHeight: 1.4,
              marginBottom: "var(--hiw-space-3)",
              color: "#0B1342",
            }}>
              <span style={{
                fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
                background: "linear-gradient(180deg, #00B1D4 0%, #0089A3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Elio</span>
              <span>{" "}is browser based</span>
            </p>

            {/* Title */}
            <h2 style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: "var(--hiw-weight-bold)" as unknown as number,
              fontSize: "var(--hiw-text-5xl)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: "var(--hiw-space-4)",
              color: "#0B1342",
            }}>
              We&apos;re always
              <br />
              there for you.
            </h2>

            {/* Subtitle */}
            <p style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: "var(--hiw-weight-regular)" as unknown as number,
              fontSize: "var(--hiw-text-lg)",
              color: "rgba(11, 19, 66, 0.7)",
              letterSpacing: "-0.01em",
              lineHeight: 1.5,
              marginBottom: "var(--hiw-space-8)",
            }}>
              Access your local AI travel pal
              <br />
              on any browser.
            </p>

            {/* Navy primary CTA — bg-cta (#0B1342) with white text + arrow,
                matches the navbar's "Try Elio" pill. */}
            <a
              href="https://mapsgpt.es"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-button bg-cta px-6 py-4 no-underline transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span style={{
                fontFamily: "var(--hiw-font-sans)",
                fontWeight: 590,
                fontSize: "20px",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
              }}>
                Try Elio it&apos;s free!
              </span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
                <path d="M2 11L11 2M11 2H4M11 2V9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FriendPin — one floating profile marker pinned over the globe.
   Desktop receives px coords in the 1728-coord-space; mobile receives
   percentage coords so each pin lands on the same continent at every
   viewport width.
   ════════════════════════════════════════════════════════════════════ */
type FriendPinProps = {
  p: { name: string; place: string; dist: string; img: string; delay: number };
  leftPx?: number;
  topPx?: number;
  leftPct?: number;
  topPct?: number;
  mobile?: boolean;
  visible: boolean;
};

function FriendPin({ p, leftPx, topPx, leftPct, topPct, mobile, visible }: FriendPinProps) {
  const avatarSize = mobile ? 36 : 64;
  const labelSize = mobile ? 9 : 12;
  const nameSize = mobile ? 10 : 13;
  const distSize = mobile ? 9 : 12;
  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none"
      style={{
        left: leftPx != null ? leftPx : `${leftPct}%`,
        top: topPx != null ? topPx : `${topPct}%`,
        transform: `translate(-50%, -50%) ${visible ? "scale(1)" : "scale(0.6)"}`,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.7s var(--hiw-easing-decel) ${p.delay}s, transform 0.7s var(--hiw-easing-spring) ${p.delay}s`,
      }}
    >
      <span style={{
        fontFamily: "var(--hiw-font-sans)",
        fontWeight: 700,
        fontSize: labelSize,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#0B1342",
        marginBottom: 6,
        whiteSpace: "nowrap",
        textShadow: "0 1px 2px rgba(255,255,255,0.7)",
      }}>
        At {p.place}
      </span>
      <img
        src={p.img}
        alt=""
        draggable={false}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: "9999px",
          objectFit: "cover",
          border: `${mobile ? 2 : 3}px solid #FFFFFF`,
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      />
      <div style={{
        marginTop: mobile ? 4 : 8,
        padding: mobile ? "3px 7px" : "5px 11px",
        borderRadius: 9999,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        gap: mobile ? 4 : 6,
        whiteSpace: "nowrap",
      }}>
        <span style={{
          fontFamily: "var(--hiw-font-sans)",
          fontWeight: 600,
          fontSize: nameSize,
          letterSpacing: "-0.01em",
          color: "#0B1342",
        }}>{p.name}</span>
        <span style={{
          width: 3, height: 3, borderRadius: "9999px", background: "#0B1342", opacity: 0.4,
        }} />
        <span style={{
          fontFamily: "var(--hiw-font-sans)",
          fontWeight: 500,
          fontSize: distSize,
          letterSpacing: "-0.01em",
          color: "rgba(11,19,66,0.6)",
        }}>{p.dist}</span>
      </div>
    </div>
  );
}
