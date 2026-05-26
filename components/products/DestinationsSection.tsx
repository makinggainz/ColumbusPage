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

// Avatars below are intentionally all anonymous / stock faces — the
// carousel must NOT show any of the founders (David / Erick / Alex)
// so the marquee reads as "what other people are asking," not a
// founder-curated feed. Use fresh pravatar seeds that aren't already
// in ROW_B below.
const ROW_A: DestPhoto[] = [
  { src: "/FavoriteSpots/(14).jpeg", place: "Osteria Francescana", rating: "4.9", prompt: "Authentic Italian fine dining in Modena?", avatar: "https://i.pravatar.cc/80?img=33" },
  { src: "/FavoriteSpots/(20).jpeg", place: "Hôtel du Cap",        rating: "4.8", prompt: "Most glamorous hotel on the French Riviera?", avatar: "https://i.pravatar.cc/80?img=16" },
  { src: "/FavoriteSpots/(22).jpeg", place: "Mercado Central",     rating: "4.5", prompt: "Best food market in Madrid?", avatar: "https://i.pravatar.cc/80?img=11" },
  { src: "/FavoriteSpots/(17).jpeg", place: "Oia Village",         rating: "4.7", prompt: "Best spot in Santorini for the sunset?", avatar: "https://i.pravatar.cc/80?img=1" },
  { src: "/FavoriteSpots/(19).jpeg", place: "The Brando",          rating: "4.9", prompt: "Exclusive private island for a honeymoon?", avatar: "https://i.pravatar.cc/80?img=5" },
  { src: "/FavoriteSpots/(21).jpeg", place: "The Ned NYC",         rating: "4.5", prompt: "Coolest NYC rooftop on a summer night?", avatar: "https://i.pravatar.cc/80?img=25" },
];
const ROW_B: DestPhoto[] = [
  { src: "/FavoriteSpots/(23).jpeg", place: "Four Seasons Bali",   rating: "4.9", prompt: "Secluded Bali resort with rice-terrace views?", avatar: "/profiles/profile2.png" },
  { src: "/FavoriteSpots/(24).jpeg", place: "Catch LA",            rating: "4.6", prompt: "Best LA rooftop dinner with hill views?", avatar: "https://i.pravatar.cc/80?img=44" },
  { src: "/FavoriteSpots/(21).jpeg", place: "Papaya Playa",        rating: "4.5", prompt: "Best Tulum beach club for music + food?", avatar: "/profiles/profile3.png" },
  { src: "/FavoriteSpots/(19).jpeg", place: "Fushimi Inari",       rating: "4.8", prompt: "Best time to visit Fushimi Inari to skip crowds?", avatar: "https://i.pravatar.cc/80?img=9" },
  { src: "/FavoriteSpots/(14).jpeg", place: "Nobu Malibu",         rating: "4.8", prompt: "Best oceanfront dinner in Malibu?", avatar: "/profiles/profile1.png" },
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

        {/* ════ Bento grid — 5 cards, 4-col layout ════
            Row 1: card 1 spans 2 cols (See whats going on, screenshot
              fills the bottom), card 2 spans 2 cols (Elio can plan a
              trip; mapbento image as backdrop + Day 1/2/3 chip).
            Row 2: card 3 spans 1 col (Ad-free + 5 stars), card 4 spans
              1 col (Import from Anywhere + 5 brand icons + Instagram
              row), card 5 spans 2 cols (plan a trip together + phone
              mockup with three friends in the group chat).
            Tablet (<1024px) collapses to 2 cols; mobile (<640px) to 1. */}
        <div
          style={{
            paddingLeft: 40,
            paddingRight: 40,
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <div className="eib-bento">
            {/* 1 — See whats going on around you (Elio screenshot fills the bottom) */}
            <div className="eib-card eib-card--photo">
              <div className="eib-text">
                <h3 className="eib-title">See whats going on around you.</h3>
                <p className="eib-sub">Live events, local things.</p>
              </div>
              <div className="eib-photo-wrap">
                <Image
                  src="/consumer/elioHome2.png"
                  alt=""
                  fill
                  sizes="(min-width: 1200px) 600px, 90vw"
                  className="eib-photo-img"
                />
              </div>
            </div>

            {/* 2 — Elio can plan a trip for you (mapbento backdrop) */}
            <div className="eib-card eib-card--map">
              <Image
                src="/bento/mapbento.png"
                alt=""
                fill
                sizes="(min-width: 1200px) 600px, 90vw"
                className="eib-map-bg-img"
              />
              <div className="eib-text eib-text--over">
                <h3 className="eib-title">Elio can plan a trip for you.</h3>
                <p className="eib-sub">An AI travel planner</p>
                <div className="eib-day-card">
                  <span>Day 1</span>
                  <span>Day 2</span>
                  <span>Day 3</span>
                </div>
              </div>
            </div>

            {/* 3 — Ad-free (light-blue tinted) */}
            <div className="eib-card eib-card--blue">
              <div className="eib-text">
                <h3 className="eib-title">Ad-free.</h3>
                <h3 className="eib-title">Find exactly what you&rsquo;re after.</h3>
              </div>
              <div className="eib-stars-wrap">
                <Image
                  src="/bento/ad-free.png"
                  alt=""
                  width={731}
                  height={165}
                  className="eib-stars-img"
                />
              </div>
            </div>

            {/* 4 — Import from Anywhere (5 brand icons + Instagram DM row) */}
            <div className="eib-card eib-card--blue">
              <h3 className="eib-title">Import from Anywhere</h3>
              <div className="eib-icon-row">
                <Image src="/bento/tiktok.png" alt="TikTok" width={56} height={56} className="eib-icon" />
                <Image src="/bento/pinterest.png" alt="Pinterest" width={56} height={56} className="eib-icon" />
                <Image src="/bento/google-maps.png" alt="Google Maps" width={56} height={56} className="eib-icon" />
                <Image src="/bento/google-docs.png" alt="Google Docs" width={56} height={56} className="eib-icon" />
                <Image src="/bento/apple-notes.png" alt="Apple Notes" width={56} height={56} className="eib-icon" />
              </div>
              <div className="eib-dm-row">
                <p className="eib-sub eib-sub--dm">or dm us the reel<br />to @Elio</p>
                <Image src="/bento/instagram.png" alt="Instagram" width={48} height={48} className="eib-icon" />
              </div>
            </div>

            {/* 5 — plan a trip together: title + chat UI (left) + phone mockup (right) */}
            <div className="eib-card eib-card--chat">
              <div className="eib-chat-card-grid">
                {/* LEFT column — title above three chat rows, all OUTSIDE the phone */}
                <div className="eib-chat-side">
                  <h3 className="eib-title">plan a trip together<br />with your friends.</h3>
                  <div className="eib-chat-list">
                    {/* Sydney row + SteinCoffee sub-card */}
                    <div className="eib-chat-item">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/bento/profile-sydney.png" alt="" className="eib-chat-avatar-lg" loading="lazy" decoding="async" />
                      <div className="eib-chat-stack">
                        <div className="eib-chat-name-lg">Sydney added</div>
                        <div className="eib-stein-card">
                          <span className="eib-stein-circle" />
                          <div className="eib-stein-text">
                            <span className="eib-stein-name">SteinCoffee</span>
                            <span className="eib-stein-rank"><span className="eib-laurel">🏆</span> ranked #1</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Natalie row + im-in badge */}
                    <div className="eib-chat-item">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/bento/profile-natalie.png" alt="" className="eib-chat-avatar-lg" loading="lazy" decoding="async" />
                      <div className="eib-chat-stack">
                        <div className="eib-chat-name-lg">Natalie</div>
                        <div className="eib-chat-msg-lg">guyssss this is cute</div>
                      </div>
                      <div className="eib-im-in">
                        <span className="eib-im-circle" aria-hidden>👏</span>
                        <span className="eib-im-label">im in</span>
                      </div>
                    </div>

                    {/* Sofiee row + im-in badge */}
                    <div className="eib-chat-item">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/bento/profile-sofiee.png" alt="" className="eib-chat-avatar-lg" loading="lazy" decoding="async" />
                      <div className="eib-chat-stack">
                        <div className="eib-chat-name-lg">Sofiee</div>
                        <div className="eib-chat-msg-lg">oh yes</div>
                      </div>
                      <div className="eib-im-in">
                        <span className="eib-im-circle" aria-hidden>👏</span>
                        <span className="eib-im-label">im in</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT column — phone mockup (map + internal avatar column + place pins) */}
                <GroupTripPhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* 4-col grid: top row [span 2, span 2]; bottom row [span 1, span 1, span 2]. */
        .eib-bento {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: minmax(360px, auto);
          gap: 20px;
        }
        .eib-bento > .eib-card:nth-child(1) { grid-column: span 2; }
        .eib-bento > .eib-card:nth-child(2) { grid-column: span 2; }
        .eib-bento > .eib-card:nth-child(3) { grid-column: span 1; }
        .eib-bento > .eib-card:nth-child(4) { grid-column: span 1; }
        .eib-bento > .eib-card:nth-child(5) { grid-column: span 2; }

        /* Base card — flat light-gray fill, clean editorial rounded block. */
        .eib-card {
          position: relative;
          background: #F4F4F5;
          border-radius: 30px;
          padding: 32px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 1200px) {
          .eib-card { border-radius: 36px; padding: 40px; }
        }

        /* Light-blue tint (Ad-free + Import). */
        .eib-card--blue {
          background: linear-gradient(180deg, #EAF6FF 0%, #F2F8FD 100%);
        }

        /* Card 1 — screenshot fills the bottom half. */
        .eib-card--photo { padding-bottom: 0; }
        .eib-photo-wrap {
          position: relative;
          flex: 1;
          min-height: 240px;
          margin-top: 8px;
        }
        .eib-photo-img {
          object-fit: contain;
          object-position: bottom center;
        }

        /* Card 2 — map fills the entire card; text + Day chip overlay. */
        .eib-card--map {
          padding: 0;
          min-height: 380px;
        }
        .eib-map-bg-img {
          object-fit: cover;
          object-position: center right;
          z-index: 0;
        }
        .eib-text--over {
          position: relative;
          z-index: 1;
          padding: 32px;
          max-width: 360px;
        }
        @media (min-width: 1200px) {
          .eib-text--over { padding: 40px; }
        }
        .eib-day-card {
          display: inline-flex;
          flex-direction: column;
          gap: 4px;
          background: #FFFFFF;
          border-radius: 14px;
          padding: 12px 18px;
          margin-top: 18px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.10);
          font-family: "Axiforma", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #0F1B2D;
          letter-spacing: -0.01em;
        }

        /* Card 3 — stars row at the bottom. */
        .eib-stars-wrap {
          margin-top: auto;
          padding-top: 24px;
        }
        .eib-stars-img {
          width: 100%;
          max-width: 280px;
          height: auto;
          display: block;
        }

        /* Card 4 — brand icon row + Instagram DM row. */
        .eib-icon-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 20px;
        }
        .eib-icon {
          width: 48px;
          height: 48px;
          object-fit: contain;
          display: block;
        }
        @media (min-width: 1200px) {
          .eib-icon { width: 56px; height: 56px; }
        }
        .eib-dm-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: auto;
          padding-top: 24px;
        }
        .eib-sub--dm {
          font-size: 16px;
          line-height: 1.3;
        }

        /* Card 5 — chat UI on the left, phone mockup on the right.
           Bottom padding zeroed so the phone image can sit flush with
           the card's bottom border; chat-side restores its own bottom
           padding so it doesn't touch the edge. */
        .eib-card--chat {
          min-height: 480px;
          overflow: hidden;
          padding-bottom: 0;
        }
        .eib-chat-card-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: stretch;
          height: 100%;
        }
        @media (max-width: 1023px) {
          .eib-chat-card-grid {
            grid-template-columns: 1fr;
          }
        }
        .eib-chat-side {
          display: flex;
          flex-direction: column;
          gap: 22px;
          min-width: 0;
          padding-bottom: 32px;
        }
        @media (min-width: 1200px) {
          .eib-chat-side { padding-bottom: 40px; }
        }
        .eib-chat-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .eib-chat-item {
          display: flex;
          align-items: center;
          gap: 11px;
        }
        .eib-chat-avatar-lg {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          background: #D1D5DB;
          box-shadow: 0 3px 8px rgba(0,0,0,0.10);
        }
        .eib-chat-stack {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          flex: 1;
        }
        .eib-chat-name-lg {
          font-family: "Axiforma", -apple-system, sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #0F1B2D;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .eib-chat-msg-lg {
          font-family: "Axiforma", -apple-system, sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #5B6B7C;
          line-height: 1.3;
        }

        /* SteinCoffee inline card — sub-row under "Sydney added" */
        .eib-stein-card {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border-radius: 14px;
          padding: 6px 13px 6px 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          margin-top: 5px;
          margin-left: 28px;
          align-self: flex-start;
          width: fit-content;
        }
        .eib-stein-circle {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #F4F4F5 0%, #E2E5E9 100%);
          border-radius: 50%;
          box-shadow: inset 0 -2px 5px rgba(0,0,0,0.06), inset 0 2px 3px rgba(255,255,255,0.85);
          flex-shrink: 0;
        }
        .eib-stein-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }
        .eib-stein-name {
          font-family: "Axiforma", -apple-system, sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0F1B2D;
          letter-spacing: -0.02em;
        }
        .eib-stein-rank {
          font-family: "Axiforma", -apple-system, sans-serif;
          font-size: 10px;
          font-weight: 500;
          color: #5B6B7C;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .eib-laurel { font-size: 9px; }

        /* "im in" green badge — right edge of Natalie / Sofiee rows */
        .eib-im-in {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          flex-shrink: 0;
          margin-left: auto;
          padding-left: 6px;
        }
        .eib-im-circle {
          width: 30px;
          height: 30px;
          background: #34C759;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          box-shadow: 0 3px 7px rgba(52, 199, 89, 0.30);
        }
        .eib-im-label {
          font-family: "Axiforma", -apple-system, sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #5B6B7C;
          letter-spacing: -0.01em;
        }

        /* Text */
        .eib-text { max-width: 360px; }
        .eib-title {
          font-family: "Axiforma", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 26px;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #0F1B2D;
          margin: 0 0 2px 0;
        }
        @media (min-width: 1200px) {
          .eib-title { font-size: 30px; }
        }
        .eib-sub {
          font-family: "Axiforma", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 17px;
          font-weight: 400;
          line-height: 1.4;
          color: #5B6B7C;
          margin: 0;
        }

        /* Tablet — 2-col, top row + card 5 stay full-width, ad-free + import side-by-side */
        @media (max-width: 1023px) {
          .eib-bento { grid-template-columns: repeat(2, 1fr); }
          .eib-bento > .eib-card { grid-column: span 1; }
          .eib-bento > .eib-card:nth-child(1),
          .eib-bento > .eib-card:nth-child(2),
          .eib-bento > .eib-card:nth-child(5) { grid-column: span 2; }
        }
        /* Mobile — single column */
        @media (max-width: 640px) {
          .eib-bento { grid-template-columns: 1fr; }
          .eib-bento > .eib-card { grid-column: 1 / -1 !important; }
          .eib-card { padding: 24px; }
          .eib-title { font-size: 22px; }
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
//  GroupTripPhoneMockup — phone-shaped panel sitting in Card 5 with a
//  three-message group-chat UI overlay. Profile photos come from the
//  user-provided /bento/profile-*.png assets; the map underneath is a
//  CSS-only stylized field (warm pastel land + cyan water) so the chat
//  reads as the focal element.
// ─────────────────────────────────────────────────────────────────────
function GroupTripPhoneMockup() {
  return (
    <div className="eib-phone-col" aria-hidden>
      <Image
        src="/bento/planatrip.png"
        alt=""
        width={958}
        height={1164}
        className="eib-phone-img"
        sizes="(min-width: 1200px) 320px, 40vw"
      />
      <style>{`
        .eib-phone-col {
          position: relative;
          align-self: stretch;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }
        .eib-phone-img {
          display: block;
          width: 100%;
          max-width: 278px;
          height: auto;
          object-fit: contain;
          object-position: bottom right;
          /* Rounded top, square bottom — the phone peeks out of the card
             so its bottom edge should sit flush with no chrome. */
          border-radius: 36px 36px 0 0;
          border-top: 6px solid #000000;
          border-left: 6px solid #000000;
          border-right: 6px solid #000000;
          border-bottom: 0;
          box-sizing: border-box;
          background: #000000;
        }
      `}</style>
    </div>
  );
}
