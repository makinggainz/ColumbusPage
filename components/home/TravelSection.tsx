"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
    <section className="bg-[#F5F5F7] py-[80px] md:py-[120px]">
      <div className="max-w-[980px] mx-auto px-6">
        <div
          ref={cardRef}
          className="relative overflow-hidden bg-white rounded-3xl shadow-sm"
          style={{
            height: 773,
            padding: "52px 64px 0",
            ...animStyle(cardVisible, "0.1s"),
          }}
        >

          {/* TEXT BLOCK */}
          <div className="flex flex-col" style={{ maxWidth: 480 }}>
            <p className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#6E6E73] mb-5">
              Available everywhere
            </p>

            <h2
              className="font-semibold leading-none text-[#1D1D1F] mb-6"
              style={{
                fontSize: "clamp(56px, 6vw, 96px)",
                letterSpacing: "-0.02em",
                fontFamily: cambo.style.fontFamily,
              }}
            >
              Travel like
              <br />a boss
            </h2>

            <p className="text-[17px] text-[#6E6E73] mb-6 leading-[1.47]">
              MapsGPT is your local guide in your pocket.
            </p>

            <ul className="space-y-3.5 list-none pl-0">
              {[
                "Plan cool trips",
                "Make itineraries",
                "Take care of every preference & detail",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-[17px]">
                  <span className="rounded-full bg-[#1D1D1F]/30 w-[5px] h-[5px] shrink-0" aria-hidden />
                  <span className="text-[#1D1D1F]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* BUTTONS */}
          <div className="absolute" style={{ bottom: 62, left: 64 }}>
            <p className="text-[#6E6E73] mb-6 text-[17px] leading-[1.47]">
              Find your next hang out spot, easier.
            </p>
            <div className="flex flex-row items-center gap-4">
              <Link
                href="/maps-gpt"
                className="text-[#0066CC] text-[20px] hover:underline"
              >
                Try it out now ›
              </Link>
              <Link
                href="/technology"
                className="bg-[#0071E3] text-white text-[17px] font-normal rounded-full px-[22px] py-[11px] hover:bg-[#0077ED] transition-colors inline-flex items-center"
              >
                Get started
              </Link>
            </div>
          </div>

          {/* DESKTOP UI */}
          <div
            className="absolute bottom-0 right-0 rounded-tl-2xl overflow-hidden"
            style={{
              width: 997,
              height: 571,
              boxShadow: "0 20px 80px rgba(0,0,0,0.08)",
            }}
          >
            <Image src="/emoji/desk.png" alt="Desktop UI" fill className="object-cover" />
          </div>

          {/* MOBILE UI */}
          <div
            className="absolute bottom-0 rounded-t-2xl overflow-hidden"
            style={{
              right: 15,
              width: 266,
              height: 579,
              boxShadow: "0 20px 80px rgba(0,0,0,0.1)",
            }}
          >
            <Image src="/emoji/mob.png" alt="Mobile UI" fill className="object-cover" />
          </div>

        </div>
      </div>
    </section>
  );
};
