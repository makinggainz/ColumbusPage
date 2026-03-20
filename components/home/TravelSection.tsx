"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { cambo } from "@/app/fonts";

export const TravelSection = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCardVisible(true); obs.disconnect(); } },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const animStyle = (visible: boolean, delay = "0s") => ({
    opacity:    visible ? 1 : 0,
    filter:     visible ? "blur(0px)" : "blur(8px)",
    transform:  visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease-out ${delay}, filter 0.7s ease-out ${delay}, transform 0.7s ease-out ${delay}`,
  });

  return (
    <section className="bg-white py-4 sm:py-10 lg:py-16">
      <Container>
        <div
          ref={cardRef}
          className="relative overflow-hidden border border-[#E4E4E7]"
          style={{
            height: 773,
            padding: "52px 64px 0",
            background: "linear-gradient(314deg, #FAFAFA -7%, #F0F0F2 50%, #E8E8EC 108%)",
            ...animStyle(cardVisible, "0.1s"),
          }}
        >

          {/* TEXT BLOCK */}
          <div className="flex flex-col" style={{ maxWidth: 480 }}>
            <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-[#A1A1AA] mb-5">
              Available everywhere
            </p>

            <h2
              className="font-normal leading-none text-[#09090B] mb-6"
              style={{
                fontSize: "clamp(56px, 6vw, 96px)",
                letterSpacing: "-0.02em",
                fontFamily: cambo.style.fontFamily,
              }}
            >
              Travel like
              <br />a boss
            </h2>

            <p className="text-[15px] text-[#71717A] mb-6">
              MapsGPT is your local guide in your pocket.
            </p>

            <ul className="space-y-3.5 list-none pl-0 text-[#09090B]" style={{ fontSize: "17px" }}>
              {[
                "Plan cool trips",
                "Make itineraries",
                "Take care of every preference & detail",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-5">
                  <span className="rounded-full bg-[#09090B]/40 w-1.5 h-1.5 shrink-0 bullet-halo-dark" aria-hidden />
                  <span className="text-[#3F3F46]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* BUTTONS */}
          <div className="absolute" style={{ bottom: 62, left: 64 }}>
            <p className="text-[#71717A] mb-8" style={{ fontSize: "17px" }}>
              Find your next hang out spot, easier.
            </p>
            <div className="flex flex-row gap-3">
              <Link
                href="/maps-gpt"
                className="bg-[#09090B] text-white text-[14px] font-medium hover:bg-[#09090B]/90 transition-colors inline-flex items-center justify-center h-11 px-6"
              >
                Try it out now →
              </Link>
              <Link
                href="/technology"
                className="border border-[#E4E4E7] text-[#3F3F46] text-[14px] font-medium hover:bg-[#FAFAFA] hover:text-[#09090B] transition-all inline-flex items-center px-6 h-11"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* DESKTOP UI */}
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: 997,
              height: 571,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.1)",
            }}
          >
            <Image src="/emoji/desk.png" alt="Desktop UI" fill className="object-cover" />
          </div>

          {/* MOBILE UI */}
          <div
            className="absolute bottom-0"
            style={{
              right: 15,
              width: 266,
              height: 579,
              overflow: "hidden",
              boxShadow: "0 40px 140px rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <Image src="/emoji/mob.png" alt="Mobile UI" fill className="object-cover" />
          </div>

        </div>
      </Container>
    </section>
  );
};
