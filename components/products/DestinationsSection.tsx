"use client";

/**
 * DestinationsSection — a wanderlust band between the bento and the
 * closing CTA: a heading plus two auto-scrolling rows of travel photos.
 * Styled with the site design system (Funnel Display heading, Opening
 * Hours Sans body, 7px corners, 1px gridline borders).
 */

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Heart } from "lucide-react";

// Each marquee tile carries the same place / rating / user-prompt metadata
// the matching photo holds in SeeWhatPeopleSection (section h) — so a
// Mercado Central thumbnail in the scrolling band reads as the same
// artefact a viewer will see again in the section-h grid below.
type DestPhoto = {
  src: string;
  place: string;
  rating: string;
  prompt: string;
  // Avatar of the (fictional) person who asked the prompt — same pravatar
  // seed numbers SeeWhatPeopleSection uses for the matching place, so the
  // marquee tile and the section-h grid card share a "speaker."
  avatar: string;
};

const ROW_A: DestPhoto[] = [
  { src: "/FavoriteSpots/(14).jpeg", place: "Osteria Francescana", rating: "4.9", prompt: "Authentic Italian fine dining in Modena?", avatar: "https://i.pravatar.cc/80?img=35" },
  { src: "/FavoriteSpots/(20).jpeg", place: "Hôtel du Cap",        rating: "4.8", prompt: "Most glamorous hotel on the French Riviera?", avatar: "https://i.pravatar.cc/80?img=16" },
  { src: "/FavoriteSpots/(22).jpeg", place: "Mercado Central",     rating: "4.5", prompt: "Best food market in Madrid?", avatar: "https://i.pravatar.cc/80?img=3" },
  { src: "/FavoriteSpots/(17).jpeg", place: "Oia Village",         rating: "4.7", prompt: "Best spot in Santorini for the sunset?", avatar: "https://i.pravatar.cc/80?img=1" },
  { src: "/FavoriteSpots/(19).jpeg", place: "The Brando",          rating: "4.9", prompt: "Exclusive private island for a honeymoon?", avatar: "https://i.pravatar.cc/80?img=22" },
  { src: "/FavoriteSpots/(21).jpeg", place: "The Ned NYC",         rating: "4.5", prompt: "Coolest NYC rooftop on a summer night?", avatar: "https://i.pravatar.cc/80?img=25" },
];
const ROW_B: DestPhoto[] = [
  { src: "/FavoriteSpots/(23).jpeg", place: "Four Seasons Bali",   rating: "4.9", prompt: "Secluded Bali resort with rice-terrace views?", avatar: "https://i.pravatar.cc/80?img=7" },
  { src: "/FavoriteSpots/(24).jpeg", place: "Catch LA",            rating: "4.6", prompt: "Best LA rooftop dinner with hill views?", avatar: "https://i.pravatar.cc/80?img=44" },
  { src: "/FavoriteSpots/(21).jpeg", place: "Papaya Playa",        rating: "4.5", prompt: "Best Tulum beach club for music + food?", avatar: "https://i.pravatar.cc/80?img=38" },
  { src: "/FavoriteSpots/(19).jpeg", place: "Fushimi Inari",       rating: "4.8", prompt: "Best time to visit Fushimi Inari to skip crowds?", avatar: "https://i.pravatar.cc/80?img=9" },
  { src: "/FavoriteSpots/(14).jpeg", place: "Nobu Malibu",         rating: "4.8", prompt: "Best oceanfront dinner in Malibu?", avatar: "https://i.pravatar.cc/80?img=51" },
  { src: "/FavoriteSpots/(17).jpeg", place: "Koh Lanta",           rating: "4.7", prompt: "Quiet Thai beach resort far from the parties?", avatar: "https://i.pravatar.cc/80?img=57" },
];

const CYCLING_OPTIONS = [
  "cozy bookspot",
  "hangout spot",
  "event",
  "neighborhood",
  "travel inspo",
  "rave spot",
  "niche restaurant",
  "thrift shop",
];

function CyclingTitle() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentOption = CYCLING_OPTIONS[index];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = 1500;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentOption.length) {
          setDisplayText(currentOption.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % CYCLING_OPTIONS.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index]);

  return (
    <div
      style={{
        textAlign: "center",
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 56,
        paddingTop: 140,
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 44,
          fontWeight: 590,
          color: "#000000",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          margin: 0,
          minHeight: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span>Find your next</span>
        <span style={{ minWidth: "520px", textAlign: "left" }}>
          {displayText}
          <span style={{ opacity: 0.5, animation: "blink 1s infinite" }}>|</span>
        </span>
      </h2>
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Marquee({ imgs, reverse }: { imgs: DestPhoto[]; reverse?: boolean }) {
  // Two copies of the list → translating one copy-width loops seamlessly.
  const doubled = [...imgs, ...imgs];
  return (
    <div className="mg-dest-mask">
      <div className={`mg-dest-track${reverse ? " mg-dest-rev" : ""}`}>
        {doubled.map((p, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              flex: "none",
              width: 304,
              height: 208,
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid #E7E7F1",
            }}
          >
            <Image src={p.src} alt="" fill sizes="304px" style={{ objectFit: "cover" }} />
            {/* Top + bottom legibility scrims so the white chrome reads
                cleanly across any photo. */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 32%, transparent 55%, rgba(0,0,0,0.55) 100%)",
                pointerEvents: "none",
              }}
            />
            {/* Place name + star rating chip — top-left, white over the
                gradient. Mirrors the section-h card header exactly. */}
            <div style={{ position: "absolute", top: 10, left: 10, right: 36, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontFamily: "var(--hiw-font-sans, 'Funnel Display', -apple-system, sans-serif)",
                color: "#0F2741",
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "-0.01em",
                textShadow: "0 1px 4px rgba(0,0,0,0.45)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{p.place}</span>
              <div style={{
                display: "flex", alignItems: "center", gap: 3,
                background: "rgba(255,255,255,0.20)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                borderRadius: 4, padding: "2px 6px", flexShrink: 0,
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E46962" />
                </svg>
                <span style={{
                  color: "#0F2741",
                  fontFamily: "var(--hiw-font-sans, 'Funnel Display', -apple-system, sans-serif)",
                  fontWeight: 700,
                  fontSize: 10,
                }}>{p.rating}</span>
              </div>
            </div>
            {/* Heart — top-right. */}
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <Heart size={16} color="#FFFFFF" fill="transparent" strokeWidth={2} />
            </div>
            {/* Avatar + prompt chat-bubble — bottom-left. Avatar sits
                outside the bubble (to its left), so the bubble's sharp
                top-left corner reads as the speech-bubble tail pointing
                back at the speaker. Soft glassy white fill keeps the
                prompt legible without fighting the photo. */}
            <div style={{
              position: "absolute",
              left: 10, right: 10, bottom: 10,
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
            }}>
              <img
                src={p.avatar}
                alt=""
                draggable={false}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "9999px",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1.5px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                }}
              />
              <div style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                borderTopLeftRadius: 4,
                borderTopRightRadius: 12,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                padding: "7px 10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                minWidth: 0,
                flex: "1 1 auto",
              }}>
                <p style={{
                  fontFamily: "var(--hiw-font-sans, 'Funnel Display', -apple-system, sans-serif)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#0B1342",
                  lineHeight: 1.35,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>{p.prompt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DestinationsSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background: "#FFFFFF", overflow: "hidden", paddingTop: 0 }}>
      <style>{`
        .mg-dest-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .mg-dest-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: mg-dest-scroll 52s linear infinite;
        }
        .mg-dest-rev { animation-direction: reverse; }
        .mg-dest-mask:hover .mg-dest-track { animation-play-state: paused; }
        @keyframes mg-dest-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-50% - 10px)); }
        }
        @media (prefers-reduced-motion: reduce) { .mg-dest-track { animation: none; } }
      `}</style>

      {/* "For your city." / "For your travels." titles previously lived
          here as a 2-col header — they were promoted to the dedicated
          ForYouSticky component above this section (their own full-bleed
          backdrops + explanation copy). This section now opens straight
          into the "and everything in between" middle title. */}

      {/* ════ Full-width band — "and everything in between" + bento ════
          Page background `rgb(245, 247, 250)` is what the frosted-glass
          cards rely on bleeding through their semi-transparent fills.
          The band extends edge-to-edge so the colour wraps the entire
          section, not just the centred 1400-px content column. */}
      <div className="eib-band">
        {/* Middle title */}
        <div
          style={{
            textAlign: "center",
            paddingLeft: 40,
            paddingRight: 40,
            paddingBottom: 60,
            paddingTop: 20,
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 44,
              fontWeight: 590,
              color: "#000000",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            and everything in between
          </h2>
        </div>

        {/* ════ Bento grid — 5 cards, Roamy-style 2-row layout ════
            Row 1 (12-col): card 1 spans 7, card 2 spans 5  (highlighted)
            Row 2 (12-col): cards 3/4/5 each span 4         (base)
            Highlighted variant uses a 3-layer composited gradient (white
            wash + sky-blue→white fade + faint dark) for a frosted-glass
            sheen; base cards are a near-transparent dark tint that lets
            the page bg show through. All cards share the same inset
            box-shadow that creates the inner glass highlight.
            Mobile (<640px): all cards stack in a single column. */}
        <div
          style={{
            paddingLeft: 40,
            paddingRight: 40,
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <div className="eib-bento">
            {/* 1 — Stop using Docs (wide top-left, highlighted) */}
            <div className="eib-card eib-card--highlight">
              <div className="eib-text">
                <h3 className="eib-title">Stop using Docs to plan trips.</h3>
                <p className="eib-sub">Do it all together on one map.</p>
              </div>
            </div>

            {/* 2 — Elio can plan a trip for you (top-right, highlighted) */}
            <div className="eib-card eib-card--highlight">
              <div className="eib-text">
                <h3 className="eib-title">Elio can plan a trip for you.</h3>
                <p className="eib-sub">AI-powered itinerary generation.</p>
              </div>
              <ItineraryArt />
            </div>

          {/* 3 — See what's going on around you (bottom-left) */}
          <div className="eib-card">
            <div className="eib-text">
              <h3 className="eib-title">See what&rsquo;s going on around you.</h3>
              <p className="eib-sub">Live events, local things.</p>
            </div>
            <RadarPinArt />
          </div>

          {/* 4 — Gets smarter the more you talk to Elio (bottom-mid) */}
          <div className="eib-card">
            <div className="eib-text">
              <h3 className="eib-title">Gets smarter the more you talk to Elio.</h3>
              <p className="eib-sub">Learns your preferences and travel style.</p>
            </div>
            <ChatBubblesArt />
          </div>

            {/* 5 — Ad-free (bottom-right) */}
            <div className="eib-card">
              <div className="eib-text">
                <h3 className="eib-title">Ad-free.</h3>
                <p className="eib-sub">Find exactly what you&rsquo;re after.</p>
              </div>
              <ShieldCheckArt />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Full-width band — vertical spacing only, no background. */
        .eib-band {
          padding-top: 80px;
          padding-bottom: 80px;
        }

        .eib-bento {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 20px;
        }
        .eib-bento > .eib-card:nth-child(1) { grid-column: span 7; }
        .eib-bento > .eib-card:nth-child(2) { grid-column: span 5; }
        .eib-bento > .eib-card:nth-child(3) { grid-column: span 4; }
        .eib-bento > .eib-card:nth-child(4) { grid-column: span 4; }
        .eib-bento > .eib-card:nth-child(5) { grid-column: span 4; }

        /* Base card — near-transparent dark tint that lets the page bg
           bleed through, plus a double inset white shadow that mimics
           the inner glass highlight on a frosted panel. */
        .eib-card {
          position: relative;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 24px;
          padding: 32px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
          box-shadow:
            rgba(255, 255, 255, 0.21) 0px -2px 12px 0px inset,
            rgba(255, 255, 255, 0.60) 0px  1px  1px 0px inset;
          min-height: 380px;
        }
        @media (min-width: 1200px) {
          .eib-card { border-radius: 28px; padding: 40px; gap: 24px; }
        }

        /* Highlighted variant — three composited background-image
           gradients on top of the base. Layer order (top → bottom):
             1. 20% white wash             (frosted milk)
             2. Sky-blue 15% → white 15%   (vertical sky fade)
             3. 5% black                   (faint depth, keeps it from
                                            looking washed out)
           Slightly larger radius at desktop breakpoints. */
        .eib-card--highlight {
          background-image:
            linear-gradient(90deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.20)),
            linear-gradient(rgba(0, 163, 255, 0.15), rgba(255, 255, 255, 0.15)),
            linear-gradient(90deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05));
        }

        .eib-bento > .eib-card:nth-child(1),
        .eib-bento > .eib-card:nth-child(2) {
          /* Top row sits a touch taller to match the reference's
             phone-mockup-driven proportions. */
          min-height: 420px;
        }

        .eib-text { max-width: 420px; }

        .eib-title {
          font-family: "Axiforma", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #0F1B2D;
          margin: 0 0 10px 0;
        }
        .eib-sub {
          font-family: "Axiforma", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 17px;
          font-weight: 400;
          line-height: 1.5;
          color: #6B7B8C;
          margin: 0;
        }

        /* Tablet — 6-col, top row stays 2-up but at 50/50, bottom stays 3-up */
        @media (max-width: 1023px) {
          .eib-bento { grid-template-columns: repeat(6, 1fr); }
          .eib-bento > .eib-card:nth-child(1) { grid-column: span 6; }
          .eib-bento > .eib-card:nth-child(2) { grid-column: span 6; }
          .eib-bento > .eib-card:nth-child(3),
          .eib-bento > .eib-card:nth-child(4),
          .eib-bento > .eib-card:nth-child(5) { grid-column: span 2; }
        }
        /* Mobile — single column stack */
        @media (max-width: 640px) {
          .eib-bento { grid-template-columns: 1fr; }
          .eib-bento > .eib-card { grid-column: 1 / -1 !important; min-height: 320px; }
          .eib-card { padding: 28px; }
          .eib-title { font-size: 19px; }
        }
      `}</style>

      {/* Title with cycling text */}
      <CyclingTitle />

      {/* Two scrolling photo rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          opacity: vis ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.15s",
          paddingTop: 60,
          paddingBottom: 60,
        }}
      >
        <Marquee imgs={ROW_A} />
        <Marquee imgs={ROW_B} reverse />
      </div>

      {/* "Elio is on desktop and mobile" — section title for the
          mockup. Matches the "and everything in between" + "Find your
          next…" titles in size + weight so the page reads as three
          sibling sections each anchored by a 44px Axiforma h2. */}
      <div
        style={{
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 140,
          paddingBottom: 56,
          maxWidth: 1400,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 44,
            fontWeight: 590,
            color: "#000000",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          <span
            style={{
              background: "linear-gradient(180deg, #00B1D4 0%, #0089A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Elio
          </span>
          <span> is on desktop and mobile</span>
        </h2>
      </div>

      {/* Desktop mockup */}
      <div
        style={{
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 80,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <img
          src="/consumer/elioHome2.png"
          alt="Elio Desktop"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: 40,
            border: "10px solid #000000",
          }}
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  Bento SVG illustrations — minimal, monochrome line art with the
//  Roamy cyan accent. Pure SVG (no asset deps) so the cards render
//  immediately; swap any of these for a richer image later.
// ─────────────────────────────────────────────────────────────────────

/** RadarPinArt — centred pin with concentric pulse rings. */
function RadarPinArt() {
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        height: 96,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <svg viewBox="0 0 120 96" width="120" height="96" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pulse rings — three concentric circles fading outward */}
        <circle cx="36" cy="48" r="44" stroke="#00A3FF" strokeOpacity="0.10" strokeWidth="1.5" />
        <circle cx="36" cy="48" r="30" stroke="#00A3FF" strokeOpacity="0.22" strokeWidth="1.5" />
        <circle cx="36" cy="48" r="16" stroke="#00A3FF" strokeOpacity="0.45" strokeWidth="1.5" />
        {/* Centred pin */}
        <g transform="translate(36 48)">
          <path
            d="M 0 -18 C -8 -18 -13 -12 -13 -5 C -13 4 -6 8 0 20 C 6 8 13 4 13 -5 C 13 -12 8 -18 0 -18 Z"
            fill="#00A3FF"
          />
          <circle cx="0" cy="-5" r="4" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}

/** ChatBubblesArt — three stair-stepped chat bubbles. */
function ChatBubblesArt() {
  return (
    <div aria-hidden style={{ display: "flex", alignItems: "flex-end", height: 100 }}>
      <svg viewBox="0 0 160 100" width="160" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top bubble — outlined navy (user msg) */}
        <rect x="2" y="6" width="78" height="28" rx="14" fill="#FFFFFF" stroke="#0F2741" strokeWidth="1.5" />
        <circle cx="18" cy="20" r="2.5" fill="#0F2741" />
        <circle cx="28" cy="20" r="2.5" fill="#0F2741" />
        <circle cx="38" cy="20" r="2.5" fill="#0F2741" />
        {/* Middle bubble — filled cyan (Elio's reply) */}
        <rect x="40" y="40" width="96" height="28" rx="14" fill="#00A3FF" />
        <rect x="52" y="50" width="42" height="3" rx="1.5" fill="rgba(255,255,255,0.95)" />
        <rect x="52" y="57" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.65)" />
        {/* Bottom bubble — outlined (follow-up) */}
        <rect x="6" y="72" width="62" height="22" rx="11" fill="#FFFFFF" stroke="#0F2741" strokeWidth="1.5" />
        <rect x="18" y="80" width="38" height="3" rx="1.5" fill="#0F2741" opacity="0.5" />
      </svg>
    </div>
  );
}

/** ItineraryArt — vertical timeline with 3 stops and placeholder labels. */
function ItineraryArt() {
  return (
    <div aria-hidden>
      <svg viewBox="0 0 180 100" width="180" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Vertical timeline */}
        <line x1="12" y1="16" x2="12" y2="84" stroke="#0F2741" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
        {/* 3 stops along the timeline */}
        {[16, 50, 84].map((y, i) => (
          <g key={i}>
            <circle cx="12" cy={y} r="6" fill="#FFFFFF" stroke="#00A3FF" strokeWidth="2" />
            <circle cx="12" cy={y} r="2.5" fill="#00A3FF" />
            <rect x="28" y={y - 7} width={i === 1 ? 124 : 96} height="6" rx="3" fill="#0F2741" opacity={i === 1 ? 0.85 : 0.55} />
            <rect x="28" y={y + 3} width={i === 0 ? 70 : 56} height="4" rx="2" fill="#0F2741" opacity="0.30" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** ShieldCheckArt — clean shield silhouette with a centered check. */
function ShieldCheckArt() {
  return (
    <div aria-hidden style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
      <svg viewBox="0 0 100 100" width="92" height="92" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 50 8 L 84 22 L 84 52 C 84 72 68 86 50 92 C 32 86 16 72 16 52 L 16 22 Z"
          fill="#00A3FF"
          fillOpacity="0.10"
          stroke="#00A3FF"
          strokeWidth="2"
        />
        <path
          d="M 32 50 L 46 64 L 70 38"
          stroke="#00A3FF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
