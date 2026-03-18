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
    transition: `opacity 0.6s ease-out ${delay}, filter 0.6s ease-out ${delay}, transform 0.6s ease-out ${delay}`,
  });

  return (
    <section className="bg-[#F9F9F9] py-3.5 sm:py-11.5 lg:py-19.5">
      <Container>

        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-[23px] bg-linear-to-br from-[#FAEAE2] via-[#FAEAE2] via-90% to-[#E2A383]"
          style={{ height: 773, padding: "49px 64px 0", ...animStyle(cardVisible, "0.1s") }}
        >

          {/* TEXT BLOCK */}
          <div className="flex flex-col" style={{ maxWidth: 500 }}>

            <p className="text-xs sm:text-sm tracking-widest uppercase text-black mb-4">
              Available everywhere
            </p>

            <h2 className="text-[96px] font-normal tracking-[-0.02em] leading-tight whitespace-nowrap text-[#1C274C] mb-6" style={{ fontFamily: cambo.style.fontFamily }}>
              Travel like a boss
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-black mb-4">
              MapsGPT is your local guide in your pocket.
            </p>

            <ul className="space-y-4 list-none pl-0 text-black mb-8" style={{ fontSize: "20px" }}>
              <li className="flex items-center gap-5">
                <span className="rounded-full bg-black w-2 h-2 shrink-0 bullet-halo-dark" aria-hidden />
                <span>Plan cool trips</span>
              </li>
              <li className="flex items-center gap-5">
                <span className="rounded-full bg-black w-2 h-2 shrink-0 bullet-halo-dark" aria-hidden />
                <span>Make itineraries</span>
              </li>
              <li className="flex items-center gap-5">
                <span className="rounded-full bg-black w-2 h-2 shrink-0 bullet-halo-dark" aria-hidden />
                <span>Take care of every preference &<br />detail</span>
              </li>
            </ul>


          </div>

          {/* BUTTONS — absolute bottom like Section F */}
          <div className="absolute" style={{ bottom: 62, left: 64 }}>
            <p className="text-black mb-8" style={{ fontSize: "20px" }}>
              Find your next hang out spot, easier.
            </p>

            <div className="flex flex-row" style={{ gap: 15 }}>
              <Link
                href="/maps-gpt"
                className="bg-white rounded-xs text-[20px] font-semibold text-[#1C274C] inline-flex items-center justify-center"
                style={{ width: 190, height: 46 }}
              >
                Try it out now ↗
              </Link>

              <Link
                href="/technology"
                className="rounded-xs text-[20px] font-semibold text-[#1C274C] inline-flex items-center px-3 bg-transparent hover:bg-[#1C274C]/5 transition-colors"
                style={{ height: 46 }}
              >
                Learn more <span style={{ marginLeft: 7 }}>↗</span>
              </Link>
            </div>
          </div>

          {/* DESKTOP UI */}
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: 997,
              height: 571,
              borderRadius: "6px 0 0 0",
              overflow: "hidden",
              border: "7px solid rgba(0,0,0,0.15)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.25)",
            }}
          >
            <Image
              src="/emoji/desk.png"
              alt="Desktop UI"
              fill
              className="object-cover"
            />
          </div>

          {/* MOBILE UI */}
          <div
            className="absolute bottom-0"
            style={{
              right: 15,
              width: 266,
              height: 579,
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 40px 140px rgba(0,0,0,0.35)",
            }}
          >
            <Image
              src="/emoji/mob.png"
              alt="Mobile UI"
              fill
              className="object-cover"
            />
          </div>

        </div>

      </Container>
    </section>
  );
};
