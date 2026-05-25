"use client";

import Image from "next/image";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#0B1342" strokeWidth="1.6" />
        <circle cx="12" cy="10" r="3" stroke="#0B1342" strokeWidth="1.6" />
      </svg>
    ),
    title: "Real places",
    body: "From a quiet café to a rooftop bar — all on one map.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2l2.39 4.84L20 7.61l-3.95 3.85.93 5.43L12 14.3l-5 2.6.93-5.44L4 7.6l5.61-.78L12 2z" stroke="#0B1342" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    title: "Learns you",
    body: "Tell Elio what you love. It only gets better from there.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M9 3.13a4 4 0 010 7.75M16 3.13a4 4 0 010 7.75" stroke="#0B1342" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="#0B1342" strokeWidth="1.6" />
      </svg>
    ),
    title: "With friends",
    body: "Plan trips together. See where everyone is, in real time.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#0B1342" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: "Ad-free",
    body: "No paid placements. Just what's actually good.",
  },
] as const;

type FeatureCardProps = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  bg: string;
};

function FeatureCard({ eyebrow, title, body, image, bg }: FeatureCardProps) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 24,
        padding: "clamp(28px, 4vw, 44px)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        position: "relative",
        overflow: "hidden",
        minHeight: 460,
      }}
    >
      <div>
        <p
          style={{
            fontFamily:
              "Opening Hours Sans, -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#0081AC",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          {eyebrow}
        </p>
        <h3
          style={{
            fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "clamp(22px, 3vw, 28px)",
            fontWeight: 600,
            color: "#0B1342",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            margin: "0 0 10px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily:
              "Opening Hours Sans, -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 15,
            fontWeight: 400,
            color: "#5A6B7B",
            letterSpacing: "-0.01em",
            lineHeight: 1.5,
            margin: 0,
            maxWidth: 360,
          }}
        >
          {body}
        </p>
      </div>
      <div
        style={{
          marginTop: "auto",
          alignSelf: "center",
          width: "min(220px, 70%)",
          aspectRatio: "320 / 700",
          borderRadius: 30,
          overflow: "hidden",
          border: "6px solid #000000",
          boxShadow: "0 24px 60px -16px rgba(11, 19, 66, 0.30)",
          position: "relative",
          background: "#000",
        }}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="220px"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

const MARQUEE: { src: string; place: string; prompt: string }[] = [
  { src: "/FavoriteSpots/(14).jpeg", place: "Osteria Francescana", prompt: "Best fine-dining in Modena?" },
  { src: "/FavoriteSpots/(20).jpeg", place: "Hôtel du Cap", prompt: "Most glamorous Riviera hotel?" },
  { src: "/FavoriteSpots/(22).jpeg", place: "Mercado Central", prompt: "Best food market in Madrid?" },
  { src: "/FavoriteSpots/(17).jpeg", place: "Oia Village", prompt: "Where to watch Santorini sunsets?" },
  { src: "/FavoriteSpots/(19).jpeg", place: "The Brando", prompt: "Private island for a honeymoon?" },
  { src: "/FavoriteSpots/(21).jpeg", place: "The Ned NYC", prompt: "Coolest NYC rooftop?" },
  { src: "/FavoriteSpots/(23).jpeg", place: "Four Seasons Bali", prompt: "Rice-terrace resort in Bali?" },
  { src: "/FavoriteSpots/(24).jpeg", place: "Catch LA", prompt: "Rooftop dinner with LA views?" },
];

function Marquee() {
  const doubled = [...MARQUEE, ...MARQUEE];
  return (
    <div className="elio-marquee-mask">
      <div className="elio-marquee-track">
        {doubled.map((p, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              flex: "none",
              width: 240,
              height: 320,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <Image src={p.src} alt="" fill sizes="240px" style={{ objectFit: "cover" }} />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 14,
                right: 14,
                bottom: 14,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontFamily:
                    "Opening Hours Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  letterSpacing: "-0.01em",
                }}
              >
                {p.place}
              </span>
              <span
                style={{
                  fontFamily:
                    "Opening Hours Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "-0.01em",
                }}
              >
                "{p.prompt}"
              </span>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .elio-marquee-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          overflow: hidden;
        }
        .elio-marquee-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: elio-scroll 60s linear infinite;
        }
        .elio-marquee-mask:hover .elio-marquee-track { animation-play-state: paused; }
        @keyframes elio-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-50% - 8px)); }
        }
        @media (prefers-reduced-motion: reduce) { .elio-marquee-track { animation: none; } }
      `}</style>
    </div>
  );
}

export default function DestinationsSection() {
  return (
    <section
      style={{
        background: "#FFFFFF",
        paddingTop: "clamp(80px, 12vw, 140px)",
        paddingBottom: "clamp(80px, 12vw, 140px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div className="elio-feature-row">
          {FEATURES.map((f) => (
            <div key={f.title} className="elio-feature-cell">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#F0F7FC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                {f.icon}
              </div>
              <h4
                style={{
                  fontFamily:
                    "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "#0B1342",
                  letterSpacing: "-0.01em",
                  margin: "0 0 6px",
                }}
              >
                {f.title}
              </h4>
              <p
                style={{
                  fontFamily:
                    "Opening Hours Sans, -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#5A6B7B",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>

        <div className="elio-card-grid">
          <FeatureCard
            eyebrow="For your city"
            title="See what's going on around you."
            body="Live events, hidden gems, and what your friends are into — all surfaced from where you are right now."
            image="/consumer/elio/ElioZone.png"
            bg="#F0F7FC"
          />
          <FeatureCard
            eyebrow="For your travels"
            title="Plan a trip without 14 browser tabs."
            body="Elio builds itineraries with the spots, the timing, and the route — together with everyone going."
            image="/consumer/elio/ElioSavedPlaces.png"
            bg="#FFF6F0"
          />
        </div>
      </div>

      <div
        style={{
          marginTop: "clamp(80px, 10vw, 120px)",
          paddingLeft: 24,
        }}
      >
        <h3
          style={{
            fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "clamp(20px, 2.4vw, 24px)",
            fontWeight: 600,
            color: "#0B1342",
            letterSpacing: "-0.02em",
            margin: "0 0 24px",
            paddingRight: 24,
            maxWidth: 1200,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "left",
            width: "100%",
          }}
        >
          What people ask Elio.
        </h3>
        <Marquee />
      </div>

      <style>{`
        .elio-feature-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 24px;
          row-gap: 32px;
        }
        .elio-feature-cell { display: flex; flex-direction: column; }
        .elio-card-grid {
          margin-top: clamp(56px, 8vw, 96px);
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .elio-feature-row { grid-template-columns: repeat(4, 1fr); column-gap: 32px; }
          .elio-card-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
        }
      `}</style>
    </section>
  );
}
