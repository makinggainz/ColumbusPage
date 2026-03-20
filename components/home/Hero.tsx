"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    filter: mounted ? "blur(0px)" : "blur(8px)",
    transform: mounted ? "translateY(0px)" : "translateY(18px)",
    transition: `opacity 1000ms ease ${delay}ms, filter 1000ms ease ${delay}ms, transform 1000ms ease ${delay}ms`,
  });

  return (
    <section
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "#FFFFFF",
        minHeight: "80vh",
        paddingTop: 140,
        paddingBottom: 100,
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.025) 1px, transparent 1px)`,
          backgroundSize: `28px 28px`,
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* Center subtle blue radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          width: 900,
          height: 700,
          background: "radial-gradient(ellipse at center, rgba(20,60,180,0.035) 0%, transparent 65%)",
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-[1024px] mx-auto">

        {/* Eyebrow */}
        <p
          style={{
            color: "#6E6E73",
            fontSize: 17,
            fontWeight: 600,
            marginBottom: 16,
            ...fadeIn(0),
          }}
        >
          Columbus Earth
        </p>

        {/* Main Heading */}
        <h1
          className="text-center"
          style={{
            color: "#1D1D1F",
            fontWeight: 600,
            letterSpacing: "-0.003em",
            lineHeight: 1.05,
            ...fadeIn(80),
          }}
        >
          <span
            className="block text-[40px] md:text-[80px]"
            style={{ fontWeight: 600, letterSpacing: "-0.003em", lineHeight: 1.05 }}
          >
            The frontier AI lab
          </span>
          <span
            className="block text-[40px] md:text-[80px]"
            style={{ fontWeight: 600, letterSpacing: "-0.003em", lineHeight: 1.05 }}
          >
            building the first in&#8209;production
          </span>
          <span
            className="block text-[40px] md:text-[80px]"
            style={{ fontWeight: 600, letterSpacing: "-0.003em", lineHeight: 1.05 }}
          >
            Large Geospatial Model.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[21px] md:text-[28px] text-center"
          style={{
            color: "#6E6E73",
            fontWeight: 400,
            lineHeight: 1.38,
            marginTop: 16,
            ...fadeIn(200),
          }}
        >
          Intelligence for the physical world.
        </p>

        {/* CTA Links */}
        <div
          className="flex items-center gap-8 mt-8"
          style={fadeIn(340)}
        >
          <Link
            href="/technology"
            className="hover:underline transition-all duration-200"
            style={{
              color: "#0066CC",
              fontSize: 20,
            }}
          >
            Learn more &#x203A;
          </Link>
          <Link
            href="/platform"
            className="hover:underline transition-all duration-200"
            style={{
              color: "#0066CC",
              fontSize: 20,
            }}
          >
            Start now &#x203A;
          </Link>
        </div>

      </div>
    </section>
  );
};
