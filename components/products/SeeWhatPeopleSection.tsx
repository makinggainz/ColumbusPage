"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Heart } from "lucide-react";

const PHOTOS = [
  `/FavoriteSpots/${encodeURIComponent("(20).jpeg")}`,
  `/FavoriteSpots/${encodeURIComponent("(14).jpeg")}`,
  `/FavoriteSpots/${encodeURIComponent("(17).jpeg")}`,
  `/FavoriteSpots/${encodeURIComponent("(19).jpeg")}`,
  `/FavoriteSpots/${encodeURIComponent("(21).jpeg")}`,
  `/FavoriteSpots/${encodeURIComponent("(23).jpeg")}`,
  `/FavoriteSpots/${encodeURIComponent("(24).jpeg")}`,
  `/FavoriteSpots/${encodeURIComponent("(22).jpeg")}`,
];

type CardData = {
  place: string;
  rating: string;
  photo: string;
  response: string;
  query: string;
  avatar: string;
};

// 6 columns — 2 | 3 | 4 | 4 | 3 | 2 = inverted pyramid, outer columns shorter
const COLUMNS: CardData[][] = [
  // ── Col 1 — 2 cards ──────────────────────────────────────────────────────
  [
    {
      place: "Café de Flore",
      rating: "4.7",
      photo: PHOTOS[0],
      response: "Top match — iconic terrace, legendary people-watching since 1887",
      query: "Best iconic café in Paris for people-watching?",
      avatar: "https://i.pravatar.cc/80?img=47",
    },
    {
      place: "Noma",
      rating: "4.9",
      photo: PHOTOS[1],
      response: "Perfect fit — 4× world's best, hyper-seasonal Nordic tasting menus",
      query: "Where can I find the most creative tasting menu experience in Copenhagen?",
      avatar: "https://i.pravatar.cc/80?img=32",
    },
  ],
  // ── Col 2 — 3 cards ──────────────────────────────────────────────────────
  [
    {
      place: "Amalfi Villa",
      rating: "4.8",
      photo: PHOTOS[2],
      response: "Strong match — private pool, unobstructed sea views, cliffside location",
      query: "Best place to stay on the Amalfi Coast with a private pool and sea views?",
      avatar: "https://i.pravatar.cc/80?img=5",
    },
    {
      place: "Shibuya Sky",
      rating: "4.6",
      photo: PHOTOS[3],
      response: "Great pick — highest outdoor deck in Tokyo, best at golden hour",
      query: "Top observation deck in Tokyo for the best sunset views?",
      avatar: "https://i.pravatar.cc/80?img=11",
    },
    {
      place: "The Ned NYC",
      rating: "4.5",
      photo: PHOTOS[4],
      response: "Top match — rooftop bar, skyline views, buzzing summer atmosphere",
      query: "Coolest members club or rooftop lounge in New York for a summer evening?",
      avatar: "https://i.pravatar.cc/80?img=25",
    },
  ],
  // ── Col 3 — 4 cards ──────────────────────────────────────────────────────
  [
    {
      place: "Four Seasons Bali",
      rating: "4.9",
      photo: PHOTOS[5],
      response: "Perfect fit — secluded villa compound, private pool, rice terrace views",
      query: "Most secluded luxury resort in Bali with rice terrace views and a private villa pool, far from the tourist crowds?",
      avatar: "https://i.pravatar.cc/80?img=7",
    },
    {
      place: "Catch LA",
      rating: "4.6",
      photo: PHOTOS[6],
      response: "Great pick — rooftop venue, sweeping hill and city views, vibrant crowd",
      query: "Best rooftop restaurant in Los Angeles for a special dinner with views of the hills?",
      avatar: "https://i.pravatar.cc/80?img=44",
    },
    {
      place: "Mercado Central",
      rating: "4.5",
      photo: PHOTOS[7],
      response: "Top match — 1,200 local vendors, authentic tapas, real Madrid food culture",
      query: "Best food market in Madrid?",
      avatar: "https://i.pravatar.cc/80?img=3",
    },
    {
      place: "Hôtel du Cap",
      rating: "4.8",
      photo: PHOTOS[0],
      response: "Strong match — clifftop pool above the sea, legendary Riviera glamour",
      query: "Most glamorous hotel on the French Riviera with an infinity pool above the sea?",
      avatar: "https://i.pravatar.cc/80?img=16",
    },
  ],
  // ── Col 4 — 4 cards ──────────────────────────────────────────────────────
  [
    {
      place: "Osteria Francescana",
      rating: "4.9",
      photo: PHOTOS[1],
      response: "Perfect fit — 3 Michelin stars, zero tourist energy, deeply local soul",
      query: "Where can I experience authentic Italian fine dining in Modena that feels deeply local and not touristy?",
      avatar: "https://i.pravatar.cc/80?img=35",
    },
    {
      place: "Oia Village",
      rating: "4.7",
      photo: PHOTOS[2],
      response: "Top match — best sunset on the island, iconic whitewashed clifftop views",
      query: "Best spot in Santorini to watch the sunset?",
      avatar: "https://i.pravatar.cc/80?img=1",
    },
    {
      place: "The Brando",
      rating: "4.9",
      photo: PHOTOS[3],
      response: "Perfect fit — private atoll, 35 villas, total seclusion guaranteed",
      query: "Most exclusive private island resort for a honeymoon with total privacy, crystal-clear water, and absolutely no crowds anywhere?",
      avatar: "https://i.pravatar.cc/80?img=22",
    },
    {
      place: "Papaya Playa",
      rating: "4.5",
      photo: PHOTOS[4],
      response: "Great pick — beachfront setting, great DJs, quintessential Tulum vibes",
      query: "Best beach club in Tulum for a relaxed day with good food and good music?",
      avatar: "https://i.pravatar.cc/80?img=38",
    },
  ],
  // ── Col 5 — 3 cards ──────────────────────────────────────────────────────
  [
    {
      place: "Fushimi Inari",
      rating: "4.8",
      photo: PHOTOS[5],
      response: "Strong match — arrive before 7am for empty torii gates, zero crowds",
      query: "Best time to visit Fushimi Inari in Kyoto to avoid the tourist crowds completely?",
      avatar: "https://i.pravatar.cc/80?img=9",
    },
    {
      place: "Enoteca Pinchiorri",
      rating: "4.9",
      photo: PHOTOS[6],
      response: "Top match — 140,000-bottle cellar, 3 Michelin stars, Florence institution",
      query: "Best Michelin-starred wine dinner experience in Florence?",
      avatar: "https://i.pravatar.cc/80?img=54",
    },
    {
      place: "LIV Miami",
      rating: "4.6",
      photo: PHOTOS[7],
      response: "Great pick — world-class DJs, electric crowd, best dance floor in Miami",
      query: "Best nightlife in Miami for dancing with an incredible atmosphere?",
      avatar: "https://i.pravatar.cc/80?img=62",
    },
  ],
  // ── Col 6 — 2 cards ──────────────────────────────────────────────────────
  [
    {
      place: "Koh Lanta",
      rating: "4.7",
      photo: PHOTOS[0],
      response: "Perfect fit — quiet bay, house reef for snorkeling, west-facing sunsets",
      query: "Find me a quiet beachfront resort in Thailand far from the party scene, with snorkeling and gorgeous sunsets every evening?",
      avatar: "https://i.pravatar.cc/80?img=57",
    },
    {
      place: "Nobu Malibu",
      rating: "4.8",
      photo: PHOTOS[1],
      response: "Strong match — oceanfront deck, celebrity crowd, Black Cod worth the hype",
      query: "Best oceanfront restaurant in Malibu with amazing views and food that actually lives up to the hype?",
      avatar: "https://i.pravatar.cc/80?img=51",
    },
  ],
];

function QueryCard({ place, rating, photo, response, query, avatar }: CardData) {
  return (
    <Link
      href="/maps-gpt"
      style={{
        width: 296,
        background: "#FFFFFF",
        borderRadius: 20,
        boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
        overflow: "hidden",
        flexShrink: 0,
        display: "block",
        textDecoration: "none",
        transition: "transform 0.22s cubic-bezier(0.25,1,0.5,1), box-shadow 0.22s cubic-bezier(0.25,1,0.5,1)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 14px 40px rgba(0,0,0,0.16)";
        const resp = el.querySelector<HTMLElement>("[data-maps-response]");
        if (resp) resp.style.opacity = "1";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 6px 24px rgba(0,0,0,0.10)";
        const resp = el.querySelector<HTMLElement>("[data-maps-response]");
        if (resp) resp.style.opacity = "0";
      }}
    >
      {/* Photo with overlaid header */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
        <img
          src={photo}
          alt=""
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Scrim for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, transparent 55%)",
          }}
        />
        {/* Place name + rating badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "-0.01em",
              textShadow: "0 1px 4px rgba(0,0,0,0.35)",
            }}
          >
            {place}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: 6,
              padding: "2px 6px",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E46962" />
            </svg>
            <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 11 }}>{rating}</span>
          </div>
        </div>
        {/* Heart icon */}
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <Heart size={16} color="white" fill="transparent" strokeWidth={2} />
        </div>

        {/* MapsGPT response — overlaid at bottom of photo */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            right: 10,
            display: "flex",
            alignItems: "flex-start",
            gap: 7,
            background: "rgba(0,0,0,0.05)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: 10,
            padding: "7px 9px",
            opacity: 0,
            transition: "opacity 0.2s ease",
          }}
          data-maps-response
        >
          <div style={{ width: 20, height: 20, borderRadius: "50%", overflow: "hidden", flexShrink: 0, marginTop: 1 }}>
            <img src="/MapsGPT-logo.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <p style={{ fontSize: 11, fontWeight: 500, color: "#FFFFFF", lineHeight: 1.45, margin: 0 }}>
            {response}
          </p>
        </div>
      </div>

      {/* Avatar + query */}
      <div
        style={{
          padding: "13px 14px 18px",
          display: "flex",
          alignItems: "flex-start",
          gap: 9,
        }}
      >
        <img
          src={avatar}
          alt=""
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
            marginTop: 2,
          }}
        />
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#1D1D1F",
            lineHeight: 1.45,
            margin: 0,
          }}
        >
          {query}
        </p>
      </div>
    </Link>
  );
}

export default function SeeWhatPeopleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    filter: visible ? "blur(0px)" : "blur(8px)",
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  });

  return (
    <section ref={sectionRef} className="bg-[#F6F7F8] pt-20 pb-32 relative overflow-hidden">

      {/* Title */}
      <h2
        className="text-center text-[clamp(27px,4vw,48px)] font-semibold text-[#063140] mb-16 px-4 max-w-352 mx-auto"
        style={fadeIn(0)}
      >
        See what people are asking
      </h2>

      {/* 6-column pyramid — outer cols have fewer cards so they end higher */}
      <div
        className="lg:scale-100 scale-50 origin-top"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 20,
          ...fadeIn(0.15),
        }}
      >
        {COLUMNS.map((col, ci) => (
          <div
            key={ci}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              flexShrink: 0,
            }}
          >
            {col.map((card, i) => (
              <QueryCard key={i} {...card} />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom fade — covers last ~2 rows, fades to next section */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          height: 770,
          background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 100%)",
        }}
        aria-hidden
      />
    </section>
  );
}
