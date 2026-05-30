"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MapsGPTGlobe from "@/components/products/MapsGPTGlobe";
import StoreBadges from "@/components/products/StoreBadges";
import "@/components/products/how-it-works-tokens.css";

// Floating discovery-card overlays on the globe. Each card is one of
// four visual variants matching the consumer page's pinned-UI design:
//   • "photo"      — photo card with overlapping avatar stack + pill
//   • "place"      — circular place photo + name + subtitle + pill
//   • "stacked"    — three fanned photo cards behind one pill
//   • "place-only" — place chip without a pill below
// Positions are in the 1728×1298 coord space; cards orbit around the
// visible globe and stagger their fade-in entrance.
type DiscoveryCard =
  | { type: "photo"; label: string; img: string; avatars: string[]; left: number; top: number; rot: number; delay: number }
  | { type: "place"; label: string; placeName: string; placeSub: string; img: string; left: number; top: number; rot: number; delay: number }
  | { type: "stacked"; label: string; imgs: [string, string, string]; left: number; top: number; rot: number; delay: number }
  | { type: "place-only"; placeName: string; placeSub: string; img: string; left: number; top: number; rot: number; delay: number };

const DISCOVERY_CARDS: DiscoveryCard[] = [
  {
    type: "photo",
    label: "group trips",
    img: "/FavoriteSpots/(20).jpeg",
    avatars: [
      "/David.png",
      "https://i.pravatar.cc/80?img=35",
      "/profiles/profile2.png",
      "https://i.pravatar.cc/80?img=44",
    ],
    left: 380,
    top: 560,
    rot: -3,
    delay: 0,
  },
  {
    type: "photo",
    label: "activities",
    img: "/FavoriteSpots/(17).jpeg",
    avatars: [
      "/Alex.jpg",
      "https://i.pravatar.cc/80?img=7",
      "/profiles/profile3.png",
    ],
    left: 1310,
    top: 470,
    rot: 4,
    delay: 0.1,
  },
  {
    type: "place",
    label: "Restaraunts",
    placeName: "Panaria",
    placeSub: "calm cafe",
    img: "/FavoriteSpots/(14).jpeg",
    left: 700,
    top: 1030,
    rot: 0,
    delay: 0.22,
  },
  {
    type: "stacked",
    label: "trending places",
    imgs: ["/FavoriteSpots/(19).jpeg", "/FavoriteSpots/(22).jpeg", "/FavoriteSpots/(21).jpeg"],
    left: 1020,
    top: 480,
    rot: -2,
    delay: 0.3,
  },
  {
    type: "place-only",
    placeName: "Lupita",
    placeSub: "tapas bar",
    img: "/FavoriteSpots/(23).jpeg",
    left: 980,
    top: 950,
    rot: 0,
    delay: 0.4,
  },
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
      {/* Section aspect-ratio adds ~47% extra height over the image's own
          1447×1087 so the headline + CTA float higher above the earth
          and the floating discovery cards sit lower in the frame. */}
      <div
        className="lg:hidden relative w-full overflow-hidden"
        style={{ aspectRatio: "1447 / 1600" }}
      >
        {/* Globe artwork — anchored to the BOTTOM at its natural aspect. */}
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{ aspectRatio: "1447 / 1087" }}
        >
          {/* Below-the-fold final CTA — no `priority` (LCP is the hero
              at the top of the page). `sizes` lets the optimizer pick a
              right-sized AVIF/WebP variant for mobile widths. */}
          <Image
            src="/consumer-final-cta-elio-ending.png"
            alt="Elio across the globe"
            fill
            sizes="100vw"
            className="object-cover"
          />

          {/* Floating discovery cards — positioned as % of the image
              wrapper so each card lands in the same spot at any viewport. */}
          {DISCOVERY_CARDS.map((p, i) => {
            const leftPct = (p.left / 1728) * 100;
            const topPct = (p.top / 1298) * 100;
            return (
              <DiscoveryCardView key={i} p={p} leftPct={leftPct} topPct={topPct} mobile visible={pinsVisible} />
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
          {/* MapsGPT globe + "Elio is browser based" eyebrow */}
          <div className="flex items-center justify-center" style={{ gap: 8, marginBottom: "var(--hiw-space-2)" }}>
            <MapsGPTGlobe size={26} />
            <p style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: "var(--hiw-weight-regular)" as unknown as number,
              fontSize: "var(--hiw-text-base)",
              letterSpacing: "0.02em",
              lineHeight: 1.4,
              color: "#0B1342",
            }}>
              <span style={{
                fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
                background: "linear-gradient(180deg, #00B1D4 0%, #0089A3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Elio</span>
              <span>{" "}is also on browser</span>
            </p>
          </div>
          <h2 style={{
            fontFamily: "var(--hiw-font-sans)",
            fontWeight: "var(--hiw-weight-bold)" as unknown as number,
            fontSize: "clamp(28px, 6vw, 44px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "var(--hiw-space-4)",
            color: "#0B1342",
          }}>
            Find your next<br />
            <TypedPhrase />
          </h2>
          {/* Mobile: Browser CTA only — App Store + Google Play badges
              removed so the mobile final-CTA reads as a single primary
              action above the floating globe UI. */}
          <div className="flex items-center justify-center" style={{ gap: 12 }}>
            <a
              href="https://mapsgpt.es"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-button-md bg-cta no-underline transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                height: 43,
                padding: "0 20px",
              }}
            >
              <span style={{
                fontFamily: "var(--hiw-font-sans)",
                fontWeight: 590,
                fontSize: "16px",
                lineHeight: 1,
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
              {/* Desktop variant — same image, sized to the inner frame.
                  Not LCP (this is the page-bottom CTA), so no `priority`. */}
              <Image
                src="/consumer-final-cta-elio-ending.png"
                alt="Elio across the globe"
                fill
                sizes="(min-width: 1728px) 1728px, 100vw"
                className="object-cover"
              />

              {/* Floating discovery cards — five UI overlays scattered
                  over the globe (photo card w/ avatars, photo card
                  selected, place card w/ pill, stacked photo deck,
                  place card only). Each card fades + scales in
                  staggered as the section enters view. Coords are in
                  the 1728×1298 image-wrapper space, not the outer
                  section, so adding sky band doesn't move the cards. */}
              {DISCOVERY_CARDS.map((p, i) => (
                <DiscoveryCardView key={i} p={p} leftPx={p.left} topPx={p.top} visible={pinsVisible} />
              ))}
            </div>
          </div>
        </div>

        {/* TOP-ANCHORED CONTENT — sits over the white sky band at the top
            of the globe image, in dark Columbus-navy ink. */}
        <div className="absolute inset-0 z-10 flex items-start justify-center" style={{ paddingTop: "clamp(48px, 5vw, 96px)" }}>
          <div className="text-center" style={{ maxWidth: 720, paddingInline: "var(--hiw-content-px)" }}>
            {/* MapsGPT globe + "Elio is browser based" eyebrow */}
            <div className="flex items-center justify-center" style={{ gap: 10, marginBottom: "var(--hiw-space-3)" }}>
              <MapsGPTGlobe size={32} />
              <p style={{
                fontFamily: "var(--hiw-font-sans)",
                fontWeight: "var(--hiw-weight-regular)" as unknown as number,
                fontSize: "var(--hiw-text-lg)",
                letterSpacing: "0.02em",
                lineHeight: 1.4,
                color: "#0B1342",
              }}>
                <span style={{
                  fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
                  background: "linear-gradient(180deg, #00B1D4 0%, #0089A3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Elio</span>
                <span>{" "}is also on browser</span>
              </p>
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily: "var(--hiw-font-sans)",
              fontWeight: "var(--hiw-weight-bold)" as unknown as number,
              fontSize: "var(--hiw-text-5xl)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: "var(--hiw-space-8)",
              color: "#0B1342",
            }}>
              Find your next
              <br />
              <TypedPhrase />
            </h2>

            {/* Browser CTA + App Store + Google Play badges — same trio
                the Hero uses, flex-wrapped so the badges drop below the
                navy pill on narrower viewports. */}
            <div className="flex flex-wrap items-center justify-center" style={{ gap: 12 }}>
              <a
                href="https://mapsgpt.es"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-cta no-underline transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  // Height locked to the StoreBadges `--lg` height so the
                  // navy pill lands at the exact same height as the App
                  // Store + Google Play badges next to it. The badges
                  // measure ~61px (14px vertical padding + the stacked
                  // "Download on the / App Store" label, ~33px tall);
                  // matching by padding alone left the single-line pill
                  // ~6–8px shorter and visually off — see the Mobbin
                  // pattern (Oku) for the same-height side-by-side
                  // treatment this mirrors.
                  height: 61,
                  padding: "0 22px",
                  borderRadius: "var(--radius-button-lg, 26px)",
                }}
              >
                <span style={{
                  fontFamily: "var(--hiw-font-sans)",
                  fontWeight: 600,
                  fontSize: "18px",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  color: "#FFFFFF",
                }}>
                  Try Elio it&apos;s free!
                </span>
                <svg width="15" height="15" viewBox="0 0 13 13" fill="none" className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
                  <path d="M2 11L11 2M11 2H4M11 2V9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <StoreBadges size="lg" />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DiscoveryCardView — one floating UI overlay pinned over the globe.
   Renders one of five visual variants (photo / photo-selected / place /
   stacked / place-only) based on `p.type`, with a centered pill label
   below for every variant except `place-only`. Desktop receives px
   coords in the 1728-coord-space; mobile receives percentage coords
   so each card lands in the same map zone at every viewport width.
   ════════════════════════════════════════════════════════════════════ */
type DiscoveryCardViewProps = {
  p: DiscoveryCard;
  leftPx?: number;
  topPx?: number;
  leftPct?: number;
  topPct?: number;
  mobile?: boolean;
  visible: boolean;
};

function DiscoveryCardView({ p, leftPx, topPx, leftPct, topPct, mobile, visible }: DiscoveryCardViewProps) {
  // Mode-specific size table. Desktop values are intentionally compact
  // (the cards read as floating UI accents over the globe, not as the
  // main content), while avatars are kept large relative to the card
  // so the "group of people on this trip" affordance stays prominent.
  const sz = mobile
    ? {
        // Shrunk ~25% from the prior mobile scale so the floating UI
        // reads as smaller accents over the larger sky band above the
        // earth on the taller mobile section.
        photoW: 76, photoH: 54, frame: 3, radius: 10,
        avatar: 20, avatarBorder: 2, avatarOverlap: 8, avatarOffsetX: 6, avatarOffsetY: 5,
        pillFont: 8, pillPadV: 4, pillPadH: 10, pillMargin: 6,
        placeImg: 22, placeName: 9, placeSub: 7, placeGap: 6, placePadH: 11, placePadV: 3,
        stackedSubW: 54, stackedSubH: 38, stackedSubFrame: 3, stackedSubRadius: 8,
      }
    : {
        // Desktop sizes — kept compact so the cards read as floating UI
        // accents over the globe rather than competing with the title +
        // CTA stack above. Roughly 75% of the previous scale.
        photoW: 120, photoH: 86, frame: 5, radius: 14,
        avatar: 36, avatarBorder: 2, avatarOverlap: 14, avatarOffsetX: 9, avatarOffsetY: 9,
        pillFont: 11, pillPadV: 6, pillPadH: 15, pillMargin: 8,
        placeImg: 36, placeName: 14, placeSub: 10, placeGap: 8, placePadH: 16, placePadV: 5,
        stackedSubW: 82, stackedSubH: 58, stackedSubFrame: 5, stackedSubRadius: 11,
      };
  const photoInnerRadius = Math.max(6, sz.radius - sz.frame);
  const cardShadow = "0 10px 26px -8px rgba(0,40,60,0.25), 0 3px 8px rgba(0,0,0,0.08)";

  const pillStyle: React.CSSProperties = {
    marginTop: sz.pillMargin,
    alignSelf: "center",
    background: "#FFFFFF",
    borderRadius: 9999,
    padding: `${sz.pillPadV}px ${sz.pillPadH}px`,
    fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: sz.pillFont,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: "#0B1342",
    boxShadow: "0 8px 20px -8px rgba(0,0,0,0.25), 0 2px 5px rgba(0,0,0,0.08)",
    whiteSpace: "nowrap",
  };

  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none"
      style={{
        left: leftPx != null ? leftPx : `${leftPct}%`,
        top: topPx != null ? topPx : `${topPct}%`,
        transform: `translate(-50%, -50%) ${visible ? "scale(1)" : "scale(0.6)"} rotate(${p.rot}deg)`,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.7s var(--hiw-easing-decel) ${p.delay}s, transform 0.7s var(--hiw-easing-spring) ${p.delay}s`,
      }}
    >
      {/* ── Variant: photo card — white frame + overlapping avatars ── */}
      {p.type === "photo" && (
        <div
          style={{
            position: "relative",
            padding: sz.frame,
            background: "#FFFFFF",
            borderRadius: sz.radius,
            boxShadow: cardShadow,
          }}
        >
          <div style={{ width: sz.photoW, height: sz.photoH, borderRadius: photoInnerRadius, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt="" draggable={false} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          {/* Avatar stack peeks out the card's bottom-left corner */}
          <div style={{ position: "absolute", left: sz.avatarOffsetX, bottom: -sz.avatarOffsetY, display: "flex" }}>
            {p.avatars.map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                src={src}
                alt=""
                draggable={false}
                loading="lazy"
                decoding="async"
                style={{
                  width: sz.avatar,
                  height: sz.avatar,
                  borderRadius: "9999px",
                  border: `${sz.avatarBorder}px solid #FFFFFF`,
                  objectFit: "cover",
                  marginLeft: i === 0 ? 0 : -sz.avatarOverlap,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                  zIndex: p.avatars.length - i,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Variant: place chip — round place photo + name + subtitle ── */}
      {(p.type === "place" || p.type === "place-only") && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: sz.placeGap,
            background: "#FFFFFF",
            borderRadius: 9999,
            padding: `${sz.placePadV}px ${sz.placePadH}px ${sz.placePadV}px ${sz.placePadV + 2}px`,
            boxShadow: cardShadow,
          }}
        >
          <div
            style={{
              width: sz.placeImg,
              height: sz.placeImg,
              borderRadius: "9999px",
              overflow: "hidden",
              flexShrink: 0,
              background: "#D1D5DB",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt="" draggable={false} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{
              fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 700,
              fontSize: sz.placeName,
              color: "#0B1342",
              letterSpacing: "-0.02em",
            }}>{p.placeName}</span>
            <span style={{
              fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 500,
              fontSize: sz.placeSub,
              color: "rgba(11,19,66,0.55)",
              marginTop: 3,
              letterSpacing: "-0.01em",
            }}>{p.placeSub}</span>
          </div>
        </div>
      )}

      {/* ── Variant: stacked photo deck (three fanned cards) ── */}
      {p.type === "stacked" && (() => {
        const SUB_W = sz.stackedSubW;
        const SUB_H = sz.stackedSubH;
        const SUB_FRAME = sz.stackedSubFrame;
        const SUB_RADIUS = sz.stackedSubRadius;
        const SUB_INNER = Math.max(6, SUB_RADIUS - SUB_FRAME);
        const subCard = (posStyle: React.CSSProperties): React.CSSProperties => ({
          position: "absolute",
          padding: SUB_FRAME,
          background: "#FFFFFF",
          borderRadius: SUB_RADIUS,
          boxShadow: cardShadow,
          ...posStyle,
        });
        const subInner: React.CSSProperties = {
          width: SUB_W,
          height: SUB_H,
          borderRadius: SUB_INNER,
          overflow: "hidden",
        };
        return (
          <div style={{ position: "relative", width: SUB_W * 1.85, height: SUB_H * 1.8 }}>
            {/* Back-left card — tilted CCW */}
            <div style={subCard({ left: 0, top: SUB_H * 0.45, transform: "rotate(-7deg)", zIndex: 1 })}>
              <div style={subInner}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imgs[0]} alt="" draggable={false} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>
            {/* Back-right card — tilted CW, sits highest */}
            <div style={subCard({ right: 0, top: 0, transform: "rotate(7deg)", zIndex: 2 })}>
              <div style={subInner}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imgs[1]} alt="" draggable={false} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>
            {/* Front-centre card — slight CCW, sits in front */}
            <div style={subCard({ left: "50%", top: SUB_H * 0.6, transform: "translateX(-50%) rotate(-2deg)", zIndex: 3 })}>
              <div style={subInner}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imgs[2]} alt="" draggable={false} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Pill label below — every variant except place-only */}
      {p.type !== "place-only" && (
        <div style={pillStyle}>{p.label}</div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TypedPhrase — cycles through "find your next ___" phrases with the
   same typewriter mechanic as the Hero's TypedPhrase, but standalone
   so it can be reused without coupling to Hero's video-swap callback.
   Caret is the section's navy ink (#0B1342) since this section's H2 is
   dark-on-light, vs the Hero's white-caret on dark-photo.
   ════════════════════════════════════════════════════════════════════ */
const FINAL_TYPED_PHRASES = [
  "rave spot",
  "hang out",
  "group dinner",
  "weekend trip",
  "date night",
  "favorite cafe",
  "secret beach",
  "city break",
];

function TypedPhrase() {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = FINAL_TYPED_PHRASES[phraseIdx];
    let delay: number;
    if (!deleting && text === full) delay = 2200;
    else if (deleting && text === "") delay = 280;
    else delay = deleting ? 32 : 70;

    const t = setTimeout(() => {
      if (!deleting && text === full) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setPhraseIdx((i) => (i + 1) % FINAL_TYPED_PHRASES.length);
      } else if (deleting) {
        setText(full.slice(0, text.length - 1));
      } else {
        setText(full.slice(0, text.length + 1));
      }
    }, delay);

    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx]);

  return (
    <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
      <span>{text}</span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "0.06em",
          height: "0.9em",
          marginLeft: "0.08em",
          verticalAlign: "-0.08em",
          background: "#0B1342",
          animation: "mgFinalCTACaret 1s steps(1) infinite",
        }}
      />
      <style>{`@keyframes mgFinalCTACaret { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }`}</style>
    </span>
  );
}
