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
        paddingBottom: 40,
        paddingTop: 60,
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          fontSize: 24,
          fontWeight: 590,
          color: "#000000",
          letterSpacing: "-0.02em",
          margin: 0,
          minHeight: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        <span>Find your next</span>
        <span style={{ minWidth: "280px", textAlign: "left" }}>
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
                color: "#FFFFFF",
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
                  color: "#FFFFFF",
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

      {/* Section titles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 44,
          paddingTop: 60,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 590,
            color: "#000000",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          For your city.
        </h2>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 590,
            color: "#000000",
            letterSpacing: "-0.02em",
            margin: 0,
            textAlign: "right",
          }}
        >
          For your travels.
        </h2>
      </div>

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

      {/* Bento box */}
      <div
        style={{
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 0,
          paddingBottom: 0,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gridTemplateRows: "auto auto auto",
            gap: 20,
            gridAutoRows: "auto",
          }}
        >
          {/* Top left - See whats going on around you (large card) */}
          <div
            style={{
              background: "#0F2741",
              borderRadius: "30px",
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: 240,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                margin: 0,
                marginBottom: 8,
              }}
            >
              See whats going on around you.
            </h3>
            <p
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: "#B0C4DE",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Live events, local things.
            </p>
          </div>

          {/* Top right - Elio can plan a trip for you */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "30px",
              padding: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 240,
            }}
          >
            <h3
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#0F2741",
                letterSpacing: "-0.02em",
                margin: 0,
                lineHeight: 1.3,
                textAlign: "center",
              }}
            >
              Elio can plan a trip for you.
            </h3>
          </div>

          {/* Middle left - Featured in */}
          <div
            style={{
              background: "#F5F5F5",
              borderRadius: "30px",
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: 280,
            }}
          >
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#999999",
                letterSpacing: "0.1em",
                margin: "0 0 30px 0",
                textTransform: "uppercase",
              }}
            >
              Featured in
            </p>
            <h4
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#0F2741",
                margin: "0 0 20px 0",
              }}
            >
              Forbes
            </h4>
            <h4
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#0F2741",
                margin: "0 0 20px 0",
              }}
            >
              Condé Nast Traveler
            </h4>
            <h4
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#0F2741",
                margin: 0,
              }}
            >
              WIRED
            </h4>
          </div>

          {/* Middle center - Stop using Docs to plan trips */}
          <div
            style={{
              background: "linear-gradient(135deg, #D0E8F2 0%, #E8F4FA 100%)",
              borderRadius: "30px",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 40,
              position: "relative",
              overflow: "hidden",
              gridColumn: "2 / 3",
              gridRow: "2 / 4",
            }}
          >
            <h3
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                margin: 0,
                textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                lineHeight: 1.4,
              }}
            >
              Stop using Docs to plan trips. Do it all together on one map.
            </h3>
          </div>

          {/* Middle right - Battery efficient */}
          <div
            style={{
              background: "#2D5016",
              borderRadius: "30px",
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 240,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Battery-efficient
              </h3>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#A8D5A8",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Typically less than 4% battery per day while tracking
              </p>
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#5AC55A",
              }}
            >
              96%
            </div>
          </div>

        </div>
      </div>

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
        }}
      >
        <Marquee imgs={ROW_A} />
        <Marquee imgs={ROW_B} reverse />
      </div>
    </section>
  );
}
