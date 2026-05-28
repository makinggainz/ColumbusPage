"use client";

/**
 * DestinationsSection — a wanderlust band between the bento and the
 * closing CTA: a heading plus two auto-scrolling rows of travel photos.
 * Styled with the site design system (Funnel Display heading, Opening
 * Hours Sans body, 7px corners, 1px gridline borders).
 */

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Heart, Plus, CalendarDays, Users, Download, Sparkles, Check } from "lucide-react";

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


/* Bookmark glyph — tucked to the right of each search-result row in
   the "Search for exactly…" bento card. Inherits its outline colour
   from the surrounding text so the icon weight tracks the result-name
   typography. */
function BookmarkIcon() {
  return (
    <svg
      className="eib-search-result-bookmark"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/* 4-point sparkle star — used at the right edge of each row in the
   "3 places added" trip-summary card. fill=currentColor so each row
   can tint the star independently via class colour. */
function SparkStar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 1 L13.6 10.4 L23 12 L13.6 13.6 L12 23 L10.4 13.6 L1 12 L10.4 10.4 Z" />
    </svg>
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
              /* Marquee tile height reduced ~25% (was 208) so the
                 scrolling photo rows are vertically compressed. */
              height: 156,
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
                gradient. Both the place label and the rating number sit
                directly on the photo (the rating chip's glass fill is
                only ~20% opaque), so both need to be white with a soft
                shadow to stay legible against any underlying image. */}
            <div style={{ position: "absolute", top: 10, left: 10, right: 36, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontFamily: "var(--hiw-font-sans, 'Funnel Display', -apple-system, sans-serif)",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "-0.01em",
                textShadow: "0 1px 4px rgba(0,0,0,0.55)",
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
                  color: "#FFFFFF",
                  fontFamily: "var(--hiw-font-sans, 'Funnel Display', -apple-system, sans-serif)",
                  fontWeight: 700,
                  fontSize: 10,
                  textShadow: "0 1px 3px rgba(0,0,0,0.45)",
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
            /* Vertical paddings reduced ~25% (was 60/20). */
            paddingBottom: 45,
            paddingTop: 15,
            /* Canonical content-bounds calc trick — 1287px cap + 20px
               gutter, matches navbar / .content-bounds / site-wide.
               Was maxWidth 1400 + paddingLeft/Right 40 (1400 content
               column on a viewport-wide eib-band background). */
            maxWidth: 1287,
            width: "calc(100% - 2.5rem)",
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

        {/* ════ Bento — 2-col layout: 3 supporting tiles on the left,
            a tall Search anchor + a short Save tile on the right.
            Tablet + mobile (<1024px) collapse to a single column.
            Bounds use the canonical calc trick (1287 cap + 20px
            gutter), matching navbar / site-wide. */}
        <div
          style={{
            maxWidth: 1287,
            width: "calc(100% - 2.5rem)",
            margin: "0 auto",
          }}
        >
          <div className="eib-bento">
            {/* LEFT column — phone mockup with the Search UI inside, +
                a Free-forever tile under it. */}
            <div className="eib-col eib-col--left">
              {/* Phone mockup — black bezel border, hero cityscape fills
                  the screen (same photograph the consumer hero header
                  uses so the bento reads as a slice of that scene),
                  search UI floats over it. */}
              <div className="eib-card eib-card--phone">
                <Image
                  src="/consumer/heroBackground.png"
                  alt=""
                  fill
                  sizes="(min-width: 1200px) 660px, 90vw"
                  className="eib-phone-map"
                />
                {/* Dynamic-Island-style notch — a small black pill at
                    the top center of the phone screen. */}
                <div className="eib-phone-notch" aria-hidden />
                <div className="eib-phone-overlay">
                  <h3 className="eib-title eib-title--hero eib-phone-title">Search for exactly<br />what you&rsquo;re looking for.</h3>
                  <div className="eib-search-mock">
                    <div className="eib-search-bar">
                      <span className="eib-search-icon" aria-hidden>🔍</span>
                      <span className="eib-search-query">hidden hill above the city for a picnic</span>
                      <span className="eib-search-clear" aria-hidden>✕</span>
                    </div>
                    {/* Three results matched to the "hidden hill above the
                        city for a picnic" prompt — quiet lookouts + a
                        grassy park with a city view. Thumbnails are
                        Unsplash photos (images.unsplash.com is allow-
                        listed in next.config.ts > images.remotePatterns)
                        chosen for topical fit: a hilltop city panorama,
                        a Mount-Lofty-style cityscape from a lookout, and
                        Zilker Park's grass lawn with the Austin skyline
                        in the back. */}
                    <div className="eib-search-results">
                      <div className="eib-search-result">
                        <Image
                          src="https://images.unsplash.com/photo-1687077674227-a51adf24e3b2?w=120&h=120&fit=crop&q=75"
                          alt=""
                          width={60}
                          height={60}
                          className="eib-search-thumb"
                        />
                        <div className="eib-search-result-stack">
                          <span className="eib-search-result-name">Cerro del Mirador</span>
                          <span className="eib-search-result-meta">★ 4.9 · 12 min · Open now</span>
                        </div>
                        <BookmarkIcon />
                      </div>
                      <div className="eib-search-result">
                        <Image
                          src="https://images.unsplash.com/photo-1676878791571-72a8b48fcc97?w=120&h=120&fit=crop&q=75"
                          alt=""
                          width={60}
                          height={60}
                          className="eib-search-thumb"
                        />
                        <div className="eib-search-result-stack">
                          <span className="eib-search-result-name">Templo de Debod Hill</span>
                          <span className="eib-search-result-meta">★ 4.7 · 18 min · Open now</span>
                        </div>
                        <BookmarkIcon />
                      </div>
                      <div className="eib-search-result">
                        <Image
                          src="https://images.unsplash.com/photo-1601579112934-17ac2aa86292?w=120&h=120&fit=crop&q=75"
                          alt=""
                          width={60}
                          height={60}
                          className="eib-search-thumb"
                        />
                        <div className="eib-search-result-stack">
                          <span className="eib-search-result-name">Casa de Campo Knoll</span>
                          <span className="eib-search-result-meta">★ 4.6 · 25 min · Open now</span>
                        </div>
                        <BookmarkIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT column — Planner + Friends share the top row, Save
                + Free-forever share the bottom row. Wrapped in two
                .eib-row containers so each row carries its own
                column ratio independently of the other. */}
            <div className="eib-col eib-col--right">
              <div className="eib-row eib-row--top">
              {/* Planner — sky-blue gradient backdrop (set on
                  .eib-card--map); title + Day pills on the left. */}
              <div className="eib-card eib-card--map">
                {/* Cloud-sky backdrop sitting beneath the heading + day
                    pills. The cyan gradient on .eib-card--map stays as a
                    fallback colour. */}
                <Image
                  src="/bento/planner-bg-v2.png"
                  alt=""
                  fill
                  sizes="(min-width: 1200px) 560px, 90vw"
                  className="eib-planner-bg"
                />
                <div className="eib-text eib-text--over">
                  <div className="eib-title-row">
                    <CalendarDays size={22} strokeWidth={2} className="eib-title-icon" aria-hidden />
                    <h3 className="eib-title eib-title--hero">Elio can plan a trip for you.</h3>
                  </div>
                  <p className="eib-sub">An AI travel planner that takes all the stress out of trip planning.</p>
                </div>
                {/* Three-day itinerary stack — a removebg PNG floated in
                    the centre of the card so the trip artefact reads as
                    the planner's hero visual where the Day pills used
                    to sit. */}
                <Image
                  src="/bento/planner-itinerary-v5.png"
                  alt="Three-day Madrid itinerary"
                  width={676}
                  height={369}
                  className="eib-planner-itinerary"
                  sizes="(min-width: 1200px) 540px, 80vw"
                />
              </div>

              {/* Friends — chat content on the left, planatrip phone
                  mockup peeking out of the bottom-right corner. */}
              <div className="eib-card eib-card--chat">
                {/* Same cloud-sky backdrop the planner card uses, so the
                    Friends tile reads as part of the same sky band.
                    Flipped horizontally so the cloud silhouette isn't
                    an exact mirror of the planner card above it. */}
                <Image
                  src="/bento/planner-bg-v2.png"
                  alt=""
                  fill
                  sizes="(min-width: 1200px) 560px, 90vw"
                  className="eib-planner-bg eib-planner-bg--flip"
                />
                <div className="eib-chat-grid">
                  <div className="eib-chat-side">
                    <div className="eib-title-row">
                      <Users size={20} strokeWidth={2} className="eib-title-icon" aria-hidden />
                      <h3 className="eib-title">Plan a trip together<br />with your friends.</h3>
                    </div>
                    <div className="eib-friends-row">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/bento/profile-sydney.png" alt="" className="eib-friend-avatar" loading="lazy" decoding="async" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/bento/profile-natalie.png" alt="" className="eib-friend-avatar" loading="lazy" decoding="async" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/bento/profile-sofiee.png" alt="" className="eib-friend-avatar" loading="lazy" decoding="async" />
                      <span className="eib-friend-add" aria-hidden>
                        <Plus size={18} strokeWidth={2} />
                      </span>
                    </div>
                    {/* "3 places added" trip-summary card — replaces the
                        old SteinCoffee chip stack. White rounded panel with
                        a blue check header, three ranked place rows, and
                        three small white confetti pills at the top-right.
                        The confetti is a SIBLING of the card (not a child)
                        so the card's mask-image fade doesn't clip it. */}
                    <div className="eib-trip-wrap">
                      <div className="eib-trip-card">
                      <div className="eib-trip-header">
                        <span className="eib-trip-check" aria-hidden>
                          <Check size={14} strokeWidth={3} />
                        </span>
                        <span className="eib-trip-title">3 places added</span>
                      </div>
                      <div className="eib-trip-list">
                        <div className="eib-trip-item">
                          <span className="eib-trip-emoji" aria-hidden>🏆</span>
                          <div className="eib-trip-text">
                            <span className="eib-trip-name">SteinCoffee</span>
                            <span className="eib-trip-rank">Ranked #1</span>
                          </div>
                          <SparkStar className="eib-trip-spark eib-trip-spark--yellow" />
                        </div>
                        <div className="eib-trip-item">
                          <span className="eib-trip-emoji" aria-hidden>🍺</span>
                          <div className="eib-trip-text">
                            <span className="eib-trip-name">Bready</span>
                            <span className="eib-trip-rank">Ranked #2</span>
                          </div>
                          <SparkStar className="eib-trip-spark eib-trip-spark--white" />
                        </div>
                        <div className="eib-trip-item">
                          <span className="eib-trip-emoji" aria-hidden>📷</span>
                          <div className="eib-trip-text">
                            <span className="eib-trip-name">
                              Calvin Klein <span className="eib-trip-name-sub">Bnei Brak</span>
                            </span>
                            <span className="eib-trip-rank">Ranked #3</span>
                          </div>
                          <SparkStar className="eib-trip-spark eib-trip-spark--peach" />
                        </div>
                      </div>
                      </div>
                      <span className="eib-trip-confetti" aria-hidden>
                        <span className="eib-confetti-line eib-confetti-line--1" />
                        <span className="eib-confetti-line eib-confetti-line--2" />
                        <span className="eib-confetti-line eib-confetti-line--3" />
                      </span>
                    </div>
                  </div>
                  <div className="eib-chat-phone" aria-hidden>
                    <Image
                      src="/bento/planatrip.png"
                      alt=""
                      width={958}
                      height={1164}
                      className="eib-chat-phone-img"
                      sizes="(min-width: 1200px) 220px, 160px"
                    />
                  </div>
                </div>
              </div>

              </div>{/* /.eib-row--top */}

              <div className="eib-row eib-row--bottom">
              {/* Save places to your map — light-cyan gradient backdrop
                  that picks up where the Planner gradient ends, then
                  fades to a paler tint. Title + sub + source icons on
                  the left. */}
              <div className="eib-card eib-card--save">
                <div className="eib-save-grid">
                  <div className="eib-save-text">
                    <div className="eib-title-row">
                      <Download size={20} strokeWidth={2} className="eib-title-icon" aria-hidden />
                      <h3 className="eib-title">Import from anywhere.</h3>
                    </div>
                    <p className="eib-sub">Pull in spots from Instagram reels, TikTok clips, Google Maps links, screenshots, and more.</p>
                  </div>
                  {/* Phone mockup — anchored to the top of the card so
                      its top edge aligns with the "Import from anywhere"
                      title row; the phone is taller than the card so
                      its bottom hangs past the card edge (clipped by
                      .eib-card overflow:hidden, no bottom border needed). */}
                  <div className="eib-save-phone" aria-hidden>
                    <Image
                      src="/bento/import-mockup.png"
                      alt=""
                      width={853}
                      height={1844}
                      className="eib-save-phone-img"
                      sizes="(min-width: 1200px) 220px, 160px"
                    />
                  </div>
                </div>
                {/* Source-app chips scattered around the phone mockup —
                    each chip carries the same frosted glass-button look
                    as the .coreResearchProduct pills on /technology
                    (under "One model, innumerable granular ground truths"). */}
                <div className="eib-source-chips" aria-hidden>
                  <span className="eib-source-chip eib-source-chip--1">
                    <Image src="/bento/tiktok.png" alt="" width={56} height={56} />
                  </span>
                  <span className="eib-source-chip eib-source-chip--2">
                    <Image src="/bento/pinterest.png" alt="" width={56} height={56} />
                  </span>
                  <span className="eib-source-chip eib-source-chip--3">
                    <Image src="/bento/google-maps.png" alt="" width={56} height={56} />
                  </span>
                  <span className="eib-source-chip eib-source-chip--4">
                    <Image src="/bento/google-docs.png" alt="" width={56} height={56} />
                  </span>
                  <span className="eib-source-chip eib-source-chip--5">
                    <Image src="/bento/apple-notes.png" alt="" width={56} height={56} />
                  </span>
                  <span className="eib-source-chip eib-source-chip--6">
                    <Image src="/bento/instagram.png" alt="" width={56} height={56} />
                  </span>
                </div>
              </div>

              {/* Free forever — single bottom-right tile in the right
                  column. Carries the same hairline border + 20px radius
                  as every other card in the bento. */}
              <div className="eib-card eib-ff-tile">
                {/* Transparent PNG illustration moved over from the
                    Import tile — sits as a decorative backdrop behind
                    the centred title. */}
                <Image
                  src="/bento/save-bg.png"
                  alt=""
                  fill
                  sizes="(min-width: 1200px) 280px, 50vw"
                  className="eib-ff-bg"
                />
                <div className="eib-title-row eib-title-row--center">
                  <Sparkles size={18} strokeWidth={2} className="eib-title-icon" aria-hidden />
                  <h3 className="eib-title eib-ff-title">Free forever.</h3>
                </div>
              </div>
              </div>{/* /.eib-row--bottom */}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Outer 2-column grid. Left column carries three stacked
           supporting tiles (Planner / Friends / Ad-free); right column
           carries a tall Search anchor tile + a shorter Save tile.
           grid-template-rows + a min-height keep both columns at the
           same overall height so the row reads as a unified block. */
        /* Bento grid — overall row height locked back to ~720px so the
           section's vertical footprint matches the earlier design. The
           left column is sized larger than the hero phone width so the
           phone-mockup tile scales UP to fill the full bento height,
           and the right column narrows to accommodate. */
        .eib-bento {
          display: grid;
          grid-template-columns: 280px 1fr;
          grid-template-rows: 480px;
          gap: 15px;
          align-items: stretch;
        }
        @media (min-width: 1200px) {
          .eib-bento {
            grid-template-columns: 420px 1fr;
            grid-template-rows: 720px;
          }
        }
        .eib-col {
          display: flex;
          flex-direction: column;
          gap: 15px;
          min-height: 0;
        }
        /* Phone mockup — fills the full bento row height (set by
           .eib-bento's grid-template-rows). The column carries only
           the phone now; Free-forever moved to the right column's
           bottom-right cell. */
        .eib-col--left > .eib-card:nth-child(1) {
          flex: 1 1 0;
          min-height: 0;
          height: 100%;
        }
        /* Right column: two stacked .eib-row grids so each row can carry
           an independent column ratio (top row no longer dictates the
           bottom row's widths and vice versa). The 7.5px terms on the
           row tracks subtract half the 15px row gap so the two tracks
           plus the gap still total 100% of the column's height. */
        .eib-col--right {
          display: grid;
          grid-template-rows:
            calc(50% - 7.5px + 35px)
            calc(50% - 7.5px - 35px);
          gap: 15px;
          height: 100%;
        }
        .eib-row {
          display: grid;
          gap: 15px;
          min-width: 0;
          min-height: 0;
        }
        /* Top row — Friends is 35px wider than Planner (was 15px). The
           extra 20px each way gives the Friends tile more room for its
           "3 places added" trip-summary card without crowding the phone. */
        .eib-row--top {
          grid-template-columns:
            calc(50% - 7.5px - 35px)
            calc(50% - 7.5px + 35px);
        }
        /* Bottom row — Save spans 2/3 of the row, Free-forever 1/3
           (mirrors the previous 4:2 column-span ratio). */
        .eib-row--bottom {
          grid-template-columns: 2fr 1fr;
        }

        /* Base card — unified surface for every tile in the bento.
           White fill + the business-page hairline border (rgba 0,0,0,0.05,
           the --ent-border-card token). No drop shadow — flat, editorial. */
        .eib-card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: var(--radius-card, 20px);
          padding: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        @media (min-width: 1200px) {
          .eib-card { padding: 32px; }
        }
        /* Friends + Free-forever tiles share the Planner's sky-blue
           gradient so the entire right column reads as one continuous
           sky band (darker cyan at the top, paler cyan at the bottom).
           Hairline border dropped — same reason as .eib-card--map:
           rgba(0,0,0,0.05) reads as a dark rim against the pale end. */
        .eib-card--chat,
        .eib-ff-tile {
          background: linear-gradient(180deg, #0080FF 0%, #B4DDF6 100%);
          border: none;
        }
        .eib-card--chat .eib-title,
        .eib-card--chat .eib-sub,
        .eib-ff-tile .eib-title,
        .eib-ff-tile .eib-sub {
          color: #FFFFFF;
        }

        /* Planner — coastline photo fills the entire card. Title + sub
           + Day pills overlay the photo in white ink with a soft
           text-shadow for legibility on the varied photo backdrop.
           Background gradient mirrors the sky-blue gradient in
           save-globe.png so any pixel that bleeds through the route
           image lands on the same cyan family as the Save tile. */
        .eib-card--map {
          padding: 0;
          background: linear-gradient(180deg, #0080FF 0%, #B4DDF6 100%);
          /* Drop the .eib-card hairline border entirely (not just
             border-color: transparent) — a 1px transparent border
             still occupies space and leaves a faint subpixel hairline
             along the rounded bottom edge against the gradient. */
          border: none;
        }
        .eib-text--over {
          position: relative;
          z-index: 1;
          padding: 24px;
          max-width: 360px;
          /* Flex-column + 6px gap so the title→sub spacing matches the
             Save card's .eib-save-text rhythm. */
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        @media (min-width: 1200px) {
          .eib-text--over { padding: 28px; }
        }
        /* White-ink overrides on the planner card so the heading
           ("Elio can plan a trip for you.") and tagline ("An AI travel
           planner") read crisp white against the sky-blue gradient
           backdrop. Compound selector outranks the global
           .eib-title / .eib-sub color rules declared later. */
        .eib-card--map .eib-title,
        .eib-card--map .eib-sub {
          color: #FFFFFF;
        }
        /* Itinerary stack — three-day Madrid trip card stack on a
           transparent PNG, centred in the lower portion of the
           planner card. Stays inside the card's overflow (rounded
           20px corners) but pushed past the title text so the
           heading stays at the top-left and the artefact occupies
           the visual centre of the tile. */
        /* Cloud-sky backdrop on the planner card — covers the full
           card, sits behind the text overlay and the itinerary stack
           (both already declare z-index:1). Square source is cropped
           with object-fit:cover to the card's rectangular footprint. */
        .eib-planner-bg {
          object-fit: cover;
          /* Anchor the source's top edge so the cloud peaks are NOT
             cropped by cover's default centred crop. Combined with the
             translateY below, the full cloud silhouette lands ~20px
             below the card's top edge. */
          object-position: center top;
          z-index: 0;
          pointer-events: none;
          /* Dropped 60% so the cyan gradient bleeds through the
             sunset-cloud overlay — clouds read as a faint atmospheric
             accent, not the primary surface. */
          opacity: 0.4;
          /* Shift the cloud layer down ~20px so the clouds sit just
             below the heading rather than crowding the title row. */
          transform: translateY(20px);
        }
        /* Horizontally mirrored variant — used on the Friends card so
           its cloud silhouette doesn't read as an exact copy of the
           Planner card directly above it. The mask fades the rendered
           LEFT half to transparent so the "Plan a trip together"
           heading sits on clean gradient (clouds stay anchored on the
           right). The mask is authored in local pre-transform coords,
           so it targets the local RIGHT half — which becomes the
           rendered LEFT after the scaleX(-1) flip. */
        .eib-planner-bg--flip {
          /* Translate reduced from 20px → 10px so the clouds sit a hair
             higher on the Friends card than they do on the Planner.
             Mask inverted: opaque on the rendered LEFT, fading to
             transparent on the right — so clouds now hug the left edge
             (under the heading) and the phone mockup on the right sits
             on a clean gradient. */
          transform: translateY(40px) scaleX(-1);
          -webkit-mask-image: linear-gradient(to right, #000 0%, #000 35%, transparent 75%, transparent 100%);
          mask-image: linear-gradient(to right, #000 0%, #000 35%, transparent 75%, transparent 100%);
        }
        .eib-planner-itinerary {
          position: absolute;
          left: 50%;
          bottom: 6px;
          transform: translateX(-50%);
          width: min(86%, 460px);
          height: auto;
          object-fit: contain;
          pointer-events: none;
          z-index: 1;
          filter: drop-shadow(0 12px 28px rgba(11, 27, 43, 0.18))
                  drop-shadow(0 2px 6px rgba(11, 27, 43, 0.10));
        }
        @media (min-width: 1200px) {
          .eib-planner-itinerary {
            width: min(82%, 540px);
            bottom: 8px;
          }
        }

        /* Phone-mockup tile — left column anchor. The dark "bezel"
           comes from a thicker black border that still reads as a
           device frame, but no drop shadow (matching the rest of the
           bento's flat treatment). */
        .eib-card--phone {
          padding: 0;
          border: 8px solid #0F1B2D;
          border-radius: 36px;
        }
        @media (min-width: 1200px) {
          .eib-card--phone {
            border-width: 10px;
            border-radius: 44px;
          }
        }
        .eib-phone-map {
          object-fit: cover;
          object-position: center;
          z-index: 0;
        }
        /* Dynamic-Island notch — small black pill at top center of the
           phone screen. Width scales with the device size. */
        .eib-phone-notch {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 78px;
          height: 22px;
          background: #000000;
          border-radius: 999px;
          z-index: 2;
          pointer-events: none;
        }
        @media (min-width: 1200px) {
          .eib-phone-notch {
            top: 16px;
            width: 118px;
            height: 30px;
          }
        }
        .eib-phone-overlay {
          position: relative;
          z-index: 1;
          height: 100%;
          /* Top padding bumped to clear the notch (notch top:12 + height:22 + breathing room). */
          padding: 48px 22px 22px 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 0;
        }
        @media (min-width: 1200px) {
          .eib-phone-overlay { padding: 62px 28px 28px 28px; gap: 20px; }
        }
        /* Title sits at the top of the phone screen in plain white.
           Compound selector .eib-title.eib-phone-title bumps specificity
           above the global .eib-title color rule declared later in this
           stylesheet — without it the navy ink wins the cascade and the
           phone title reads dark on the cityscape backdrop. */
        .eib-title.eib-phone-title {
          color: #FFFFFF;
        }
        /* Floating search "panel" — sits below the title on the map.
           White tiles inside, drop shadow lifts the panel off the map. */
        .eib-search-mock {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
          min-height: 0;
        }
        .eib-search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border-radius: 14px;
          padding: 14px 18px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          font-family: "Axiforma", -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .eib-search-icon {
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
        }
        .eib-search-query {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          color: #0F1B2D;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        /* Clear (✕) icon at the right end of the search bar — soft
           neutral grey so it reads as an inline affordance, not a
           primary action. */
        .eib-search-clear {
          font-size: 14px;
          line-height: 1;
          color: rgba(15, 27, 45, 0.45);
          flex-shrink: 0;
          padding-left: 4px;
        }
        .eib-search-results {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .eib-search-result {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border-radius: 14px;
          padding: 10px 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        /* Photo thumbnail at the left of each result row — small
           rounded image standing in for the place's hero photo. */
        .eib-search-thumb {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .eib-search-result-stack {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }
        .eib-search-result-name {
          font-family: "Axiforma", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0F1B2D;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .eib-search-result-meta {
          font-family: "Axiforma", -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #5B6B7C;
          letter-spacing: -0.01em;
          line-height: 1.3;
          margin-top: 2px;
        }
        /* Bookmark glyph at the right end of each row — muted neutral
           so it reads as an affordance, not a primary action. */
        .eib-search-result-bookmark {
          flex-shrink: 0;
          color: #6C7686;
          margin-left: auto;
        }

        /* Friends tile — chat content on the left, a phone mockup
           that peeks out of the bottom-right corner of the card. */
        .eib-card--chat {
          padding: 0;
        }
        .eib-chat-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          height: 100%;
          align-items: stretch;
        }
        .eib-chat-side {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
          padding: 24px 0 24px 24px;
        }
        @media (min-width: 1200px) {
          .eib-chat-side { padding: 32px 0 32px 32px; }
        }
        /* Phone mock — rounded top corners + a top/left/right border,
           NO bottom border so the device hangs off the bottom edge of
           the card. */
        .eib-chat-phone {
          position: relative;
          align-self: stretch;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding-right: 18px;
        }
        @media (min-width: 1200px) {
          .eib-chat-phone { padding-right: 24px; }
        }
        .eib-chat-phone-img {
          display: block;
          width: 180px;
          height: auto;
          object-fit: contain;
          object-position: bottom right;
          border-radius: 24px 24px 0 0;
          border-top: 5px solid #0F1B2D;
          border-left: 5px solid #0F1B2D;
          border-right: 5px solid #0F1B2D;
          border-bottom: 0;
          box-sizing: border-box;
          background: #0F1B2D;
        }
        @media (min-width: 1200px) {
          .eib-chat-phone-img {
            width: 240px;
            border-radius: 30px 30px 0 0;
            border-top-width: 6px;
            border-left-width: 6px;
            border-right-width: 6px;
          }
        }

        .eib-friends-row {
          display: flex;
          align-items: center;
          margin-top: 6px;
        }
        .eib-friend-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 3px solid #FFFFFF;
          margin-right: -8px;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.10);
          /* Sit above the dashed "+" chip so the last avatar overlaps
             and partially covers it (the "+" reads as a back-of-stack
             affordance rather than a 4th peer on top). */
          position: relative;
          z-index: 2;
        }
        .eib-friend-add {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0);
          border: 2px dashed rgba(255, 255, 255, 0.55);
          color: rgba(255, 255, 255, 0.75);
          line-height: 0;
          /* Sit BEHIND the last avatar so it's partially covered by
             the rightmost portrait. -17px margin pulls it under the
             last avatar by a bit less than half the chip's width. */
          position: relative;
          z-index: 1;
          margin-left: -10px;
          flex-shrink: 0;
        }
        /* "3 places added" trip-summary card — a white rounded panel
           with a blue check header, three ranked place rows, and three
           small white confetti pills at the top-right. Replaces the
           older layered-chip stack of SteinCoffee / Verde Bistro /
           Cafe Solaris. */
        /* Wrapper holds the card + the confetti pills as siblings so
           the card's mask-image fade doesn't clip the pills that sit
           outside the card's box. */
        .eib-trip-wrap {
          position: relative;
          margin-top: 10px;
          align-self: flex-start;
          display: inline-block;
        }
        .eib-trip-card {
          position: relative;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 10px;
          box-shadow: 0 6px 18px rgba(11, 27, 43, 0.08),
                      0 1px 4px rgba(11, 27, 43, 0.05);
          display: flex;
          flex-direction: column;
          gap: 6px;
          /* Width matched to the avatar row above (3 overlapping 50px
             avatars + the dashed "+" chip, all overlapping by 8–10px).
             Total visual span ≈ 172px from the left edge of avatar #1
             to the right edge of the dashed "+" circle. box-sizing +
             min-width: 0 keep flex children from forcing the card any
             wider than this explicit width when a row's text is long. */
          box-sizing: border-box;
          width: 140px;
          min-width: 0;
          /* Fade the entire card (background + all child content) from
             fully opaque at the top to transparent at the bottom. mask
             cascades to every descendant so text, rows, check pill and
             title all share the same soft fade — feels cohesive. */
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0) 100%);
        }
        /* Three white pill-shaped confetti lines anchored to the top-
           right corner of the trip card. Container pushed further off
           the corner (top:-18 / right:-24) so the lines read as more
           detached. Decorative only. */
        .eib-trip-confetti {
          position: absolute;
          top: -13px;
          right: -18px;
          width: 38px;
          height: 32px;
          pointer-events: none;
        }
        .eib-confetti-line {
          position: absolute;
          background: #FFFFFF;
          border-radius: 999px;
          width: 7px;
          height: 2px;
          box-shadow: 0 1px 2px rgba(11, 27, 43, 0.10);
        }
        /* Three white pills arranged in a fan that radiates AWAY from
           the card body. Each rotation orients the pill's long axis
           along the radial line out from the card's top-right corner.
           Line #2 is pushed further out along the diagonal than #1/#3
           so the middle pill reads as the "leader" of the burst. */
        .eib-confetti-line--1 { top: 3px;  right: 22px; transform: rotate(-90deg); }
        .eib-confetti-line--2 { top: 5px;  right: 9px;  transform: rotate(-45deg); }
        .eib-confetti-line--3 { top: 20px; right: 4px;  transform: rotate(0deg); }
        /* Header row — blue check pill + "3 places added" label */
        .eib-trip-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 2px 4px 2px 2px;
        }
        .eib-trip-check {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #0080FF;
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .eib-trip-title {
          font-family: "Funnel Display", -apple-system, sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #0B1B2B;
          letter-spacing: -0.01em;
        }
        /* List of ranked place rows */
        .eib-trip-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .eib-trip-item {
          display: flex;
          align-items: center;
          gap: 8px;
          /* Flat black-tinted fill instead of the previous white + drop
             shadow, so each row reads as a soft tinted strip that sits
             flush with the card and fades along with it. */
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
          padding: 5px 8px;
          /* Stop long row text (e.g. "Calvin Klein Bnei Brak") from
             forcing the card wider than its explicit 172px width. */
          min-width: 0;
          overflow: hidden;
        }
        .eib-trip-emoji {
          font-size: 13px;
          line-height: 1;
          flex-shrink: 0;
        }
        .eib-trip-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          line-height: 1.2;
        }
        .eib-trip-name {
          font-family: "Funnel Display", -apple-system, sans-serif;
          font-size: 9px;
          font-weight: 700;
          color: #0B1B2B;
          letter-spacing: -0.01em;
          /* Truncate long names ("Calvin Klein Bnei Brak") with an
             ellipsis so the row stays inside the card's set width. */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }
        .eib-trip-name-sub {
          font-weight: 400;
          color: #5B6B7C;
          margin-left: 2px;
        }
        .eib-trip-rank {
          font-family: "Funnel Display", -apple-system, sans-serif;
          font-size: 8px;
          font-weight: 500;
          color: #8A95A3;
          letter-spacing: -0.01em;
        }
        .eib-trip-spark { flex-shrink: 0; width: 10px; height: 10px; }
        .eib-trip-spark--yellow { color: #FFC83D; }
        .eib-trip-spark--white  { color: #E6EDF4; }
        .eib-trip-spark--peach  { color: #FFA585; }

        /* Free-forever cluster — the bottom-right slot of the right
           column carries a nested 2x2 grid of four standalone cards.
           Each mini-tile inherits the base .eib-card surface (white
           fill, hairline border, 20px radius); the inner grid uses the
           same 15px gap as the outer bento so the four tiles read as
           peers of the surrounding cards. */
        .eib-ff-tile {
          padding: 14px;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 0;
          min-width: 0;
        }
        @media (min-width: 1200px) {
          .eib-ff-tile { padding: 20px; }
        }
        .eib-ff-title {
          margin: 0;
        }

        /* Save-places tile — light-cyan gradient that picks up where
           the Planner gradient ends (#8BD5F4) and fades to a paler
           sky tint. Dark-navy text stays legible across both stops.
           Source icons shrink so all five fit on a single row inside
           the narrower bottom-row tile. */
        .eib-card--save {
          padding: 0;
          background: linear-gradient(180deg, #0080FF 0%, #B4DDF6 100%);
          /* Same reason as .eib-card--map — fully drop the border
             instead of transparent so no 1px subpixel hairline
             survives along the rounded bottom edge. */
          border: none;
        }
        .eib-card--save .eib-title,
        .eib-card--save .eib-sub {
          color: #FFFFFF;
        }
        /* Free-forever tile backdrop — transparent PNG illustration
           sitting above the cyan gradient but below the centred title.
           Contained + bottom-anchored so the subject sits flush with
           the tile's bottom border. */
        .eib-ff-bg {
          object-fit: contain;
          object-position: center bottom;
          z-index: 0;
          pointer-events: none;
        }
        /* Title row inside the Free-forever tile must sit ABOVE the
           backdrop image. */
        .eib-ff-tile .eib-title-row {
          position: relative;
          z-index: 1;
        }
        /* Save card inner grid — text on the left, phone mockup hanging
           off the bottom-right. Mirrors the Friends card's chat-grid
           treatment. */
        .eib-save-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          height: 100%;
          align-items: stretch;
        }
        .eib-save-text {
          padding: 20px 0 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
          /* Tight max-width so the headline + sub wrap onto narrow
             rag-right lines that echo the Friends card's "Plan a trip
             together / with your friends." block. */
          max-width: 180px;
        }
        @media (min-width: 1200px) {
          .eib-save-text { padding: 24px 0 24px 24px; max-width: 210px; }
        }
        /* Phone mock — top/left/right border only, no bottom; the
           device's top aligns with the "Import from anywhere" title
           row (matching padding-top) and the bottom hangs past the
           card's edge, where overflow:hidden clips it. */
        .eib-save-phone {
          position: relative;
          align-self: stretch;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          /* Padding values include a +20px vertical and +45px horizontal
             offset on top of the original 20/18 (sm) and 24/24 (lg)
             alignment values — pushes the phone down + left from the
             title-aligned corner. Extra 15px of right-padding shifts
             the phone an additional 15px leftward. */
          padding-top: 40px;
          padding-right: 63px;
        }
        @media (min-width: 1200px) {
          .eib-save-phone { padding-top: 44px; padding-right: 69px; }
        }
        .eib-save-phone-img {
          display: block;
          width: 160px;
          height: auto;
          object-fit: contain;
          object-position: bottom right;
          border-radius: 24px 24px 0 0;
          border-top: 5px solid #0F1B2D;
          border-left: 5px solid #0F1B2D;
          border-right: 5px solid #0F1B2D;
          border-bottom: 0;
          box-sizing: border-box;
          background: #0F1B2D;
        }
        @media (min-width: 1200px) {
          .eib-save-phone-img {
            width: 220px;
            border-radius: 30px 30px 0 0;
            border-top-width: 6px;
            border-left-width: 6px;
            border-right-width: 6px;
          }
        }

        /* Scattered source-app chips around the phone mockup. Each chip
           is a small circular pill with the same frosted glass-button
           styling used on /technology under "One model, innumerable
           granular ground truths." (.coreResearchProduct). Chip
           positions are absolute so they can be sprinkled around the
           mockup. */
        .eib-source-chips {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          /* Shift the whole orbit 15px left so it stays anchored to
             the phone after the phone's own 15px leftward shift. */
          transform: translateX(-15px);
        }
        .eib-source-chip {
          position: absolute;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          border-radius: 999px;
          -webkit-backdrop-filter: blur(clamp(1px, 0.125em, 4px));
          backdrop-filter: blur(clamp(1px, 0.125em, 4px));
          background: linear-gradient(
            -75deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.35),
            rgba(255, 255, 255, 0.05)
          );
          /* Inset shine layers (frosted-glass interior) + a real
             elevation drop shadow so the chips visibly lift off the
             card surface and the phone behind them. */
          box-shadow:
            inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
            inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5),
            inset 0 0 0.1em 0.25em rgba(255, 255, 255, 0.25),
            0 14px 28px rgba(11, 27, 43, 0.22),
            0 4px 10px rgba(11, 27, 43, 0.14);
        }
        .eib-source-chip img {
          width: 60%;
          height: 60%;
          object-fit: contain;
        }
        @media (max-width: 1023px) {
          /* Chip positions (eib-source-chip--1…--6) are absolute
             percentages tuned for the desktop bento column. When the
             bento collapses to a single column on mobile the chips
             land on top of each other and on top of the phone mockup
             itself — hide them entirely on mobile. The phone + save
             tile carry the value of this card on their own. */
          .eib-source-chips { display: none; }
          .eib-source-chip {
            -webkit-backdrop-filter: none;
            backdrop-filter: none;
          }
        }
        /* Per-chip sizes + positions — mirrors the reference layout:
           - TikTok = biggest, overlaps the phone's mid-right edge
           - Pinterest + Google Docs = large, top-left + top-right orbit
           - Google Maps = medium-large, bottom-right overlap
           - Apple Notes = smallest, overlaps the phone's mid-left edge */
        .eib-source-chip--1 {                          /* TikTok — biggest, mid-LEFT overlap (was mid-right) */
          width: 64px; height: 64px;
          top: 30%; left: 42%;
        }
        .eib-source-chip--2 {                          /* Pinterest — large, top-left orbit */
          width: 58px; height: 58px;
          top: 2%; left: 50%;
        }
        .eib-source-chip--3 {                          /* Google Maps — medium-large, bottom-right overlap */
          width: 54px; height: 54px;
          top: 72%; right: 4%;
        }
        .eib-source-chip--4 {                          /* Google Docs — large, top-right orbit */
          width: 56px; height: 56px;
          top: 6%; right: 6%;
        }
        .eib-source-chip--5 {                          /* Apple Notes — smallest, mid-RIGHT overlap (was mid-left) */
          width: 42px; height: 42px;
          /* Shifted an extra 10px leftward (right edge moved 10px in) so
             the right-most chip pulls a bit closer to the phone. */
          top: 46%; right: calc(-2% + 10px);
        }
        .eib-source-chip--6 {                          /* Instagram — medium, bottom-left orbit */
          width: 56px; height: 56px;
          top: 70%; left: 47%;
        }
        @media (min-width: 1200px) {
          .eib-source-chip--1 { width: 80px; height: 80px; }
          .eib-source-chip--2 { width: 72px; height: 72px; }
          .eib-source-chip--3 { width: 66px; height: 66px; }
          .eib-source-chip--4 { width: 68px; height: 68px; }
          .eib-source-chip--5 { width: 50px; height: 50px; }
          .eib-source-chip--6 { width: 68px; height: 68px; }
        }

        /* Save-tile icon row — small enough that all five icons fit
           on a single row inside the narrower bottom-row tile. */
        .eib-icon-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: nowrap;
          margin-top: auto;
          padding-top: 8px;
        }
        .eib-icon {
          width: 26px;
          height: 26px;
          object-fit: contain;
          display: block;
        }
        @media (min-width: 1200px) {
          .eib-icon-row { gap: 10px; }
          .eib-icon { width: 32px; height: 32px; }
        }

        /* Title row — stacks a small leading icon ABOVE every bento h3.
           The icon inherits currentColor so white-on-cyan cards get a
           white icon and the dark phone-tile default tracks the title
           ink. */
        .eib-title-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        .eib-title-row--center {
          align-items: center;
          justify-content: center;
        }
        .eib-title-icon {
          flex-shrink: 0;
          color: var(--color-ink, #0B1B2B);
        }
        /* Every cyan-gradient or photo-backed card flips its title to
           white — match the icon stroke so it tracks the title colour. */
        .eib-card--map .eib-title-icon,
        .eib-card--chat .eib-title-icon,
        .eib-card--save .eib-title-icon,
        .eib-ff-tile .eib-title-icon,
        .eib-card--phone .eib-title-icon {
          color: #FFFFFF;
        }

        /* Tile typography — matches the homepage bento's .h3 convention
           (Funnel Display, weight 600, dark navy ink). Subs sit in the
           design system's --color-muted grey. */
        .eib-text { max-width: 360px; }
        .eib-title {
          font-family: var(--font-display, "Funnel Display", -apple-system, BlinkMacSystemFont, sans-serif);
          font-size: 1.375rem; /* 22px */
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--color-ink, #0B1B2B);
          margin: 0 0 2px 0;
        }
        @media (min-width: 1200px) {
          .eib-title { font-size: 1.625rem; /* 26px */ }
        }
        /* Hero variant — used by the Planner + Search anchor tiles. One
           clear step up from the supporting tile titles. */
        .eib-title--hero {
          font-size: 1.75rem; /* 28px */
          line-height: 1.1;
        }
        @media (min-width: 1200px) {
          .eib-title--hero { font-size: 2.25rem; /* 36px */ }
        }
        .eib-sub {
          font-family: var(--font-sans, "Opening Hours Sans", -apple-system, BlinkMacSystemFont, sans-serif);
          font-size: 0.9375rem; /* 15px */
          font-weight: 400;
          line-height: 1.4;
          color: var(--color-muted, #5A6B7B);
          margin: 0;
        }

        /* Tablet — collapse the outer 2-col into a single stack. The
           right column also flattens from a 2-col sub-grid to a 1-col
           stack so all four right-side tiles stack vertically. */
        @media (max-width: 1023px) {
          .eib-bento {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }
          .eib-col--right {
            grid-template-rows: auto;
            height: auto;
          }
          /* Collapse both nested rows to single-column stacks on
             tablet/mobile. */
          .eib-row--top,
          .eib-row--bottom {
            grid-template-columns: 1fr;
          }
          .eib-col > .eib-card {
            flex: 0 1 auto;
            min-height: 220px;
          }
          .eib-col--left > .eib-card:nth-child(1) {
            height: auto;
            min-height: 480px;
          }
        }
        /* Mobile — same single-column stack, smaller padding + titles. */
        @media (max-width: 640px) {
          .eib-card { padding: 22px; }
          .eib-title { font-size: 22px; }
          .eib-title--hero { font-size: 26px; }
        }
      `}</style>

      {/* Two scrolling photo rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          /* Inter-row gap + outer vertical paddings reduced ~25%
             (were 20 / 60 / 60). With the previous CyclingTitle block
             above this row removed, the top padding is bumped from
             45 → 100 so the marquees keep clear breathing room from
             the bento above (otherwise they read as butted up against
             the bottom-most bento card). */
          gap: 15,
          opacity: vis ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.15s",
          paddingTop: 100,
          paddingBottom: 45,
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
          /* Vertical paddings reduced ~25% (were 140/56). */
          paddingTop: 105,
          paddingBottom: 42,
          /* Canonical calc-trick bounds — 1287 cap + 20px gutter,
             matches navbar / site-wide. Was maxWidth 1400 +
             paddingLeft/Right 40. */
          maxWidth: 1287,
          width: "calc(100% - 2.5rem)",
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

      {/* Desktop mockup — canonical calc-trick bounds (1287 cap +
          20px gutter, matches navbar / site-wide). Was maxWidth 1400 +
          paddingLeft/Right 40. */}
      <div
        style={{
          /* paddingBottom reduced ~25% (was 80). */
          paddingBottom: 60,
          maxWidth: 1287,
          width: "calc(100% - 2.5rem)",
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

