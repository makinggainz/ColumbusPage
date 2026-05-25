"use client";

import Image from "next/image";
import MapsGPTGlobe from "@/components/products/MapsGPTGlobe";
import StoreBadges from "@/components/products/StoreBadges";


export default function Hero() {
  return (
    <section
      data-hero-section
      data-hero-outer
      style={{
        position: "relative",
        minHeight: 800,
        width: "100%",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: -120,
        marginBottom: 0,
        backgroundImage: "url(/consumer/heroBackground.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundClip: "border-box",
        borderRadius: "0 0 24px 24px",
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.1)",
      }}
    >
      {/* Top-down dark gradient overlay — sits between the hero photo
          and the foreground content. Extends 100% of the hero height,
          fading to transparent at the bottom. Replaces the navbar's
          previous `darkBackdrop` scrim now that the gradient lives on
          the hero itself. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0) 50%)",
          borderRadius: "0 0 24px 24px",
        }}
      />

      {/* Main content container */}
      <div
        style={{
          position: "relative",
          zIndex: 60,
          width: "100%",
          maxWidth: 1400,
          height: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 140,
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
              fontFamily: "Axiforma, -apple-system, BlinkMacSystemFont, sans-serif",
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
              top: 0,
              right: -20,
              width: 32,
              height: 32,
            }}
          >
            <Image
              src="/consumer/star.png"
              alt="Star"
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 40,
            alignItems: "center",
          }}
        >
          <button
            style={{
              padding: "12px 28px",
              fontSize: "16px",
              fontWeight: 600,
              fontFamily: "Opening Hours Sans, -apple-system, BlinkMacSystemFont, sans-serif",
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


      </div>
    </section>
  );
}
