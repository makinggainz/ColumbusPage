"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import "@/components/products/how-it-works-tokens.css";

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

// 8 columns — wider pyramid with more cards in outer columns
const COLUMNS: CardData[][] = [
  // ── Col 1 — 3 cards ──
  [
    {
      place: "Blue Lagoon",
      rating: "4.8",
      photo: PHOTOS[6],
      response: "Top match — iconic geothermal waters, dramatic lava field setting",
      query: "Best natural hot spring experience in Iceland?",
      avatar: "https://i.pravatar.cc/80?img=60",
    },
    {
      place: "Café de Flore",
      rating: "4.7",
      photo: PHOTOS[0],
      response: "Top match — iconic terrace, legendary people-watching since 1887",
      query: "Best iconic café in Paris for people-watching?",
      avatar: "https://i.pravatar.cc/80?img=47",
    },
    {
      place: "Riad Yasmine",
      rating: "4.6",
      photo: PHOTOS[4],
      response: "Great pick — hidden courtyard pool, traditional zellige tilework",
      query: "Most charming riad in Marrakech with a pool?",
      avatar: "https://i.pravatar.cc/80?img=41",
    },
  ],
  // ── Col 2 — 3 cards ──
  [
    {
      place: "Noma",
      rating: "4.9",
      photo: PHOTOS[1],
      response: "Perfect fit — 4× world's best, hyper-seasonal Nordic tasting menus",
      query: "Where can I find the most creative tasting menu experience in Copenhagen?",
      avatar: "https://i.pravatar.cc/80?img=32",
    },
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
  ],
  // ── Col 3 — 4 cards ──
  [
    {
      place: "The Ned NYC",
      rating: "4.5",
      photo: PHOTOS[4],
      response: "Top match — rooftop bar, skyline views, buzzing summer atmosphere",
      query: "Coolest members club or rooftop lounge in New York for a summer evening?",
      avatar: "https://i.pravatar.cc/80?img=25",
    },
    {
      place: "Four Seasons Bali",
      rating: "4.9",
      photo: PHOTOS[5],
      response: "Perfect fit — secluded villa compound, private pool, rice terrace views",
      query: "Most secluded luxury resort in Bali with rice terrace views and a private villa pool?",
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
  ],
  // ── Col 4 — 4 cards ──
  [
    {
      place: "Hôtel du Cap",
      rating: "4.8",
      photo: PHOTOS[0],
      response: "Strong match — clifftop pool above the sea, legendary Riviera glamour",
      query: "Most glamorous hotel on the French Riviera with an infinity pool above the sea?",
      avatar: "https://i.pravatar.cc/80?img=16",
    },
    {
      place: "Osteria Francescana",
      rating: "4.9",
      photo: PHOTOS[1],
      response: "Perfect fit — 3 Michelin stars, zero tourist energy, deeply local soul",
      query: "Where can I experience authentic Italian fine dining in Modena?",
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
      query: "Most exclusive private island resort for a honeymoon with total privacy?",
      avatar: "https://i.pravatar.cc/80?img=22",
    },
  ],
  // ── Col 5 — 4 cards ──
  [
    {
      place: "Papaya Playa",
      rating: "4.5",
      photo: PHOTOS[4],
      response: "Great pick — beachfront setting, great DJs, quintessential Tulum vibes",
      query: "Best beach club in Tulum for a relaxed day with good food and good music?",
      avatar: "https://i.pravatar.cc/80?img=38",
    },
    {
      place: "Fushimi Inari",
      rating: "4.8",
      photo: PHOTOS[5],
      response: "Strong match — arrive before 7am for empty torii gates, zero crowds",
      query: "Best time to visit Fushimi Inari in Kyoto to avoid the tourist crowds?",
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
  // ── Col 6 — 3 cards ──
  [
    {
      place: "Koh Lanta",
      rating: "4.7",
      photo: PHOTOS[0],
      response: "Perfect fit — quiet bay, house reef for snorkeling, west-facing sunsets",
      query: "Find me a quiet beachfront resort in Thailand far from the party scene?",
      avatar: "https://i.pravatar.cc/80?img=57",
    },
    {
      place: "Nobu Malibu",
      rating: "4.8",
      photo: PHOTOS[1],
      response: "Strong match — oceanfront deck, celebrity crowd, Black Cod worth the hype",
      query: "Best oceanfront restaurant in Malibu with amazing views and food?",
      avatar: "https://i.pravatar.cc/80?img=51",
    },
    {
      place: "Sake no Hana",
      rating: "4.7",
      photo: PHOTOS[5],
      response: "Great pick — sleek Japanese izakaya, hidden garden terrace in Mayfair",
      query: "Best hidden Japanese restaurant in London with a garden terrace?",
      avatar: "https://i.pravatar.cc/80?img=29",
    },
  ],
  // ── Col 7 — 3 cards ──
  [
    {
      place: "Soneva Fushi",
      rating: "4.9",
      photo: PHOTOS[3],
      response: "Perfect fit — barefoot luxury, overwater cinema, private reef snorkeling",
      query: "Best barefoot luxury resort in the Maldives?",
      avatar: "https://i.pravatar.cc/80?img=14",
    },
    {
      place: "Berghain",
      rating: "4.6",
      photo: PHOTOS[7],
      response: "Top match — legendary sound system, industrial cathedral of techno",
      query: "Most iconic nightclub in Berlin for techno?",
      avatar: "https://i.pravatar.cc/80?img=19",
    },
    {
      place: "Villa Cimbrone",
      rating: "4.8",
      photo: PHOTOS[2],
      response: "Strong match — Terrace of Infinity, sweeping Amalfi views, secret garden",
      query: "Most romantic garden in Ravello with panoramic sea views?",
      avatar: "https://i.pravatar.cc/80?img=46",
    },
  ],
  // ── Col 8 — 3 cards ──
  [
    {
      place: "Tulum Ruins",
      rating: "4.7",
      photo: PHOTOS[6],
      response: "Great pick — clifftop Mayan temple, turquoise cove below, best at sunrise",
      query: "Best Mayan ruins near the beach in Mexico?",
      avatar: "https://i.pravatar.cc/80?img=33",
    },
    {
      place: "Aman Venice",
      rating: "4.9",
      photo: PHOTOS[0],
      response: "Perfect fit — 16th century palazzo, Grand Canal views, total serenity",
      query: "Most exclusive boutique hotel in Venice on the Grand Canal?",
      avatar: "https://i.pravatar.cc/80?img=48",
    },
    {
      place: "Cala Conta",
      rating: "4.6",
      photo: PHOTOS[4],
      response: "Top match — crystal water, sunset views, best beach bar on the island",
      query: "Best beach in Ibiza for sunset drinks with crystal clear water?",
      avatar: "https://i.pravatar.cc/80?img=55",
    },
  ],
];

function QueryCard({ place, rating, photo, response, query, avatar }: CardData) {
  return (
    <Link
      href="/maps-gpt"
      style={{
        width: 296,
        background: "var(--hiw-bg-card)",
        borderRadius: "var(--hiw-radius-xl)",
        boxShadow: "var(--hiw-shadow-card)",
        overflow: "hidden",
        flexShrink: 0,
        display: "block",
        textDecoration: "none",
        transition: `box-shadow var(--hiw-duration-normal) var(--hiw-easing-default)`,
      }}
      onMouseEnter={e => {
        if (window.innerWidth < 1024) return;
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "var(--hiw-shadow-card-hover)";
        const resp = el.querySelector<HTMLElement>("[data-maps-response]");
        if (resp) resp.style.opacity = "1";
      }}
      onMouseLeave={e => {
        if (window.innerWidth < 1024) return;
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "var(--hiw-shadow-card)";
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
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, transparent 55%)" }} />
        {/* Place name + rating */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: "var(--hiw-space-2)" }}>
          <span style={{
            fontFamily: "var(--hiw-font-sans)",
            color: "var(--hiw-text-on-accent)",
            fontWeight: "var(--hiw-weight-semibold)" as unknown as number,
            fontSize: "var(--hiw-text-xs)",
            letterSpacing: "-0.01em",
            textShadow: "0 1px 4px rgba(0,0,0,0.35)",
          }}>
            {place}
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: 3,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            borderRadius: "var(--hiw-radius-sm)", padding: "2px 6px",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="var(--hiw-accent-alt)" />
            </svg>
            <span style={{
              fontFamily: "var(--hiw-font-sans)",
              color: "var(--hiw-text-on-accent)",
              fontWeight: "var(--hiw-weight-bold)" as unknown as number,
              fontSize: 11,
            }}>{rating}</span>
          </div>
        </div>
        {/* Heart */}
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <Heart size={16} color="white" fill="transparent" strokeWidth={2} />
        </div>

        {/* MapsGPT response overlay */}
        <div
          style={{
            position: "absolute", bottom: 10, left: 10, right: 10,
            display: "flex", alignItems: "flex-start", gap: "var(--hiw-space-2)",
            background: "rgba(0,0,0,0.05)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            borderRadius: "var(--hiw-radius-md)", padding: "7px 9px",
            opacity: 0,
            transition: `opacity var(--hiw-duration-fast) var(--hiw-easing-default)`,
          }}
          data-maps-response
        >
          <div style={{ width: 20, height: 20, borderRadius: "var(--hiw-radius-full)", overflow: "hidden", flexShrink: 0, marginTop: 1 }}>
            <img src="/MapsGPT-logo.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <p style={{
            fontFamily: "var(--hiw-font-sans)",
            fontSize: 11,
            fontWeight: "var(--hiw-weight-medium)" as unknown as number,
            color: "var(--hiw-text-on-accent)",
            lineHeight: "var(--hiw-leading-normal)" as unknown as number,
            margin: 0,
          }}>
            {response}
          </p>
        </div>
      </div>

      {/* Avatar + query */}
      <div style={{
        padding: "var(--hiw-space-3) var(--hiw-space-4) var(--hiw-space-5)",
        display: "flex", alignItems: "flex-start", gap: "var(--hiw-space-2)",
      }}>
        <img
          src={avatar}
          alt=""
          style={{
            width: 32, height: 32,
            borderRadius: "var(--hiw-radius-full)",
            objectFit: "cover", flexShrink: 0, marginTop: 2,
          }}
        />
        <p style={{
          fontFamily: "var(--hiw-font-sans)",
          fontSize: "var(--hiw-text-sm)",
          fontWeight: "var(--hiw-weight-medium)" as unknown as number,
          color: "var(--hiw-text-primary)",
          lineHeight: "var(--hiw-leading-normal)" as unknown as number,
          margin: 0,
        }}>
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
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
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
    <section
      ref={sectionRef}
      className="hiw-scope relative overflow-hidden"
      style={{
        background: "var(--hiw-bg-page)",
        paddingTop: "var(--hiw-space-32)",
        paddingBottom: "var(--hiw-space-16)",
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontFamily: "var(--hiw-font-sans)",
          fontWeight: "var(--hiw-weight-bold)" as unknown as number,
          fontSize: "clamp(32px, 5vw, var(--hiw-text-4xl))",
          lineHeight: "var(--hiw-leading-tight)" as unknown as number,
          color: "var(--hiw-text-primary)",
          textAlign: "center",
          margin: 0,
          marginBottom: "var(--hiw-space-16)",
          paddingInline: "var(--hiw-space-4)",
          ...fadeIn(0),
        }}
      >
        See what people are asking
      </h2>

      {/* 8-column grid */}
      <div className="relative overflow-hidden" style={{ height: "clamp(500px, 120vw, 900px)" }}>
        <div
          className="lg:scale-100 scale-50 origin-top absolute inset-x-0 top-0"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "var(--hiw-space-5)",
            ...fadeIn(0.15),
          }}
        >
          {COLUMNS.map((col, ci) => (
            <div
              key={ci}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--hiw-space-5)",
                flexShrink: 0,
              }}
            >
              {col.map((card, i) => (
                <QueryCard key={i} {...card} />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom fade */}
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{ height: "40%", background: "linear-gradient(180deg, transparent 0%, var(--hiw-bg-page) 80%)" }}
          aria-hidden
        />
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{ width: "clamp(100px, 22vw, 350px)", background: "linear-gradient(270deg, transparent 0%, var(--hiw-bg-page) 90%)" }}
          aria-hidden
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 pointer-events-none"
          style={{ width: "clamp(100px, 22vw, 350px)", background: "linear-gradient(90deg, transparent 0%, var(--hiw-bg-page) 90%)" }}
          aria-hidden
        />
      </div>
    </section>
  );
}
