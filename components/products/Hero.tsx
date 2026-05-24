"use client";

import Image from "next/image";
import MapsGPTGlobe from "@/components/products/MapsGPTGlobe";
import StoreBadges from "@/components/products/StoreBadges";

const ENDING_CARDS = [
  { kind: "dot" as const,              label: "Concerts",        x: -640, y: 240, bob: 0.0 },
  { kind: "place" as const,            label: "Panaria",         sub: "calm cafe", category: "Restaurants", profile: "/consumer/images/hidden-coffee-shop.png", x: -460, y: 360, bob: 0.6 },
  { kind: "category" as const,         label: "activities",      thumb: "/consumer/HeroBack.png", profile: "/consumer/images/local-hiking-trail.png", x: -300, y: 240, bob: 1.0 },
  { kind: "category-profile" as const, label: "group trips",     profile: "/consumer/images/hang-out-spot.png", x: -180, y: 250, bob: 1.4 },
  { kind: "place" as const,            label: "Panaria",         sub: "calm cafe", category: null, profile: "/consumer/images/cozy-bookstore.png", x: 260, y: 290, bob: 0.4 },
  { kind: "category" as const,         label: "events",          thumb: "/consumer/images/rooftop-sunset-bar.png", profile: "/consumer/images/late-night-taco-joint.png", x: 230, y: 380, bob: 1.8 },
  { kind: "category" as const,         label: "trending places", thumbs: ["/consumer/images/hidden-coffee-shop.png", "/consumer/images/late-night-taco-joint.png", "/consumer/images/rooftop-sunset-bar.png"], profile: "/consumer/images/weekend-brunch-place.png", x: 460, y: 230, bob: 0.2 },
  { kind: "dot-label" as const,        label: "spots",           x: 580, y: 380, bob: 1.1 },
  { kind: "place" as const,            label: "Panaria",         sub: "calm cafe", category: "daily utilities", profile: "/consumer/images/quiet-study-cafe.png", x: 690, y: 230, bob: 1.6 },
  { kind: "place" as const,            label: "Panaria",         sub: "calm cafe", category: null, x: -720, y: 380, bob: 0.9 },
] as const;

type EndingCardData = (typeof ENDING_CARDS)[number];

function EndingCard({ card }: { card: EndingCardData }) {
  const pillBase: React.CSSProperties = {
    padding: "5px 11px",
    borderRadius: 10,
    background: "#FFFFFF",
    fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 12,
    fontWeight: 600,
    color: "#0B1B2B",
    letterSpacing: "-0.01em",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.08), 0 8px 24px -8px rgba(0,40,60,0.25)",
    whiteSpace: "nowrap" as const,
  };
  const categoryTag: React.CSSProperties = {
    ...pillBase,
    fontSize: 11,
    fontWeight: 500,
    opacity: 0.92,
    marginBottom: 4,
  };
  if (card.kind === "dot") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6094C1 0%, #2A5B8A 100%)",
            border: "3px solid #FFFFFF",
            boxShadow: "0 4px 14px -4px rgba(0,40,60,0.35)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "2px solid #5CC982",
              borderRightColor: "#FF5454",
              borderBottomColor: "transparent",
              transform: "rotate(35deg)",
            }}
          />
        </div>
        <div style={pillBase}>{card.label}</div>
      </div>
    );
  }
  if (card.kind === "dot-label") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#F45D8B",
            border: "2px solid #FFFFFF",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}
        />
        <div style={pillBase}>{card.label}</div>
      </div>
    );
  }
  if (card.kind === "place") {
    const profile = "profile" in card ? card.profile : undefined;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        {card.category && <div style={categoryTag}>{card.category}</div>}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FFFFFF",
              border: "2px solid #6094C1",
              boxShadow: "0 2px 6px rgba(0,0,0,0.20)",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              ...pillBase,
              padding: "6px 12px",
              lineHeight: 1.15,
            }}
          >
            <div style={{ fontWeight: 600 }}>{card.label}</div>
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.58 }}>{card.sub}</div>
          </div>
          {profile && (
            <img
              src={profile}
              alt=""
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.22)",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>
    );
  }
  if (card.kind === "category-profile") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <img
          src={card.profile}
          alt=""
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #FFFFFF",
            boxShadow: "0 6px 14px -4px rgba(0,40,60,0.30)",
          }}
        />
        <div style={pillBase}>{card.label}</div>
      </div>
    );
  }
  const thumbs = "thumbs" in card ? card.thumbs : undefined;
  const thumb = "thumb" in card ? card.thumb : undefined;
  const catProfile = "profile" in card ? card.profile : undefined;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {(thumbs || thumb) && (
        <div style={{ position: "relative" }}>
          {thumbs ? (
            <div style={{ position: "relative", width: 92, height: 60 }}>
              {thumbs.slice(0, 3).map((t, i) => (
                <img
                  key={t}
                  src={t}
                  alt=""
                  style={{
                    position: "absolute",
                    width: 70,
                    height: 50,
                    left: i * 11,
                    top: i * 5,
                    borderRadius: 8,
                    objectFit: "cover",
                    border: "2.5px solid #FFFFFF",
                    boxShadow: "0 4px 10px -3px rgba(0,40,60,0.30)",
                    zIndex: 3 - i,
                  }}
                />
              ))}
            </div>
          ) : thumb ? (
            <img
              src={thumb}
              alt=""
              style={{
                width: 78,
                height: 56,
                borderRadius: 9,
                objectFit: "cover",
                border: "2.5px solid #FFFFFF",
                boxShadow: "0 6px 14px -4px rgba(0,40,60,0.30)",
              }}
            />
          ) : null}
          {catProfile && (
            <img
              src={catProfile}
              alt=""
              style={{
                position: "absolute",
                right: -8,
                bottom: -8,
                width: 26,
                height: 26,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #FFFFFF",
                boxShadow: "0 3px 8px rgba(0,0,0,0.28)",
                zIndex: 5,
              }}
            />
          )}
        </div>
      )}
      <div style={pillBase}>{card.label}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 80,
        paddingBottom: 60,
        marginTop: -120,
        paddingTop: 200,
        marginBottom: -200,
        backgroundImage: "url(/consumer/elio/ElioEndingBackground.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundClip: "border-box",
        borderRadius: "0 0 24px 24px",
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.1)",
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px))",
      }}
    >
      {/* Floating map-pin and category cards overlay */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {ENDING_CARDS.map((c, i) => (
          <div
            key={`end-${i}`}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${c.x}px, ${c.y}px)`,
              pointerEvents: "auto",
            }}
          >
            <EndingCard card={c} />
          </div>
        ))}
      </div>

      {/* Main content container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 1400,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingX: 40,
        }}
      >
        {/* Elio logo - 3D rotating globe + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            marginBottom: 16,
            filter: "drop-shadow(0px 0px 51px rgba(0, 0, 0, 0.25))",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MapsGPTGlobe />
          </div>
          <Image
            src="/consumer/elioName.png"
            alt="Elio"
            width={260}
            height={110}
            style={{ height: "auto", width: "auto", marginLeft: -30 }}
          />
        </div>

        {/* Main heading with magic star */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginBottom: 16,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 66px)",
              fontWeight: 590,
              color: "#FFFFFF",
              textAlign: "center",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              textShadow: "0px 0px 30px rgba(0, 0, 0, 0.25)",
              maxWidth: 800,
              margin: 0,
            }}
          >
            the social super map
          </h1>
          {/* Magic star */}
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -40,
              width: 26,
              height: 26,
              backgroundColor: "#FFFFFF",
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.25)",
            }}
          />
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 80,
            alignItems: "center",
          }}
        >
          <button
            style={{
              padding: "12px 28px",
              fontSize: "16px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#000000",
              border: "none",
              borderRadius: "24px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#F0F0F0")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
          >
            Try Elio in browser
          </button>

          <StoreBadges />
        </div>

        {/* Three-column layout: Left text | Phone | Right text */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "40px",
            width: "100%",
            alignItems: "center",
            justifyItems: "center",
            marginBottom: 60,
          }}
        >
          {/* Left section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          />

          {/* Center - Phone mockup */}
          <div
            style={{
              position: "relative",
              width: 360,
              height: 780,
              borderRadius: 42,
              overflow: "hidden",
              border: "7px solid #000000",
              boxShadow: "0px 4px 61px rgba(0, 0, 0, 0.25)",
              flexShrink: 0,
              marginTop: 0,
              marginBottom: -200,
              boxSizing: "content-box",
              zIndex: 50,
            }}
          >
            <Image
              src="/consumer/elioHome1.png"
              alt="Elio App"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Right section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          />
        </div>

      </div>
    </section>
  );
}
