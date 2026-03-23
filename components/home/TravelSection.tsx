"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cambo } from "@/app/fonts";
import { GridSection, GridHeader, GridCell } from "./ContentGrid";

export const TravelSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <GridSection>
      <GridHeader label="08 — MAPSGPT" />

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-5">
        {/* Text — 2 cols */}
        <GridCell className="md:col-span-2 flex flex-col justify-between" style={{ ...anim(0), minHeight: 500 }}>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#0A1344]/30 font-mono mb-5">
              Available everywhere
            </p>

            <h2
              className="font-semibold leading-none text-[#1D1D1F] mb-6"
              style={{
                fontSize: "clamp(48px, 5vw, 80px)",
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

            <ul className="space-y-3.5 list-none pl-0 mb-8">
              {["Plan cool trips", "Make itineraries", "Take care of every preference & detail"].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-[17px]">
                  <span className="w-1.25 h-1.25 bg-[#1D1D1F]/30 shrink-0" aria-hidden />
                  <span className="text-[#1D1D1F]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[#6E6E73] mb-4 text-[15px] leading-[1.47]">
              Find your next hang out spot, easier.
            </p>
            <div className="flex flex-row items-center gap-4">
              <Link href="/maps-gpt" className="text-[#4F46E5] text-sm font-mono tracking-wide hover:underline">
                TRY IT NOW →
              </Link>
              <Link
                href="/technology"
                className="bg-[#0A1344] text-white text-[15px] font-medium px-5 py-2.5 hover:bg-[#0A1344]/85 transition-colors inline-flex items-center"
              >
                Get started
              </Link>
            </div>
          </div>
        </GridCell>

        {/* Image — 3 cols, flush */}
        <GridCell flush hoverable={false} className="md:col-span-3 relative hidden md:block" style={{ ...anim(200), minHeight: 500 }}>
          <div
            className="absolute bottom-0 right-0 overflow-hidden"
            style={{ width: "95%", height: "85%" }}
          >
            <Image src="/emoji/desk.png" alt="Desktop UI" fill className="object-cover" />
          </div>
          <div
            className="absolute bottom-0 overflow-hidden"
            style={{ right: 12, width: 200, height: "88%" }}
          >
            <Image src="/emoji/mob.png" alt="Mobile UI" fill className="object-cover" />
          </div>
        </GridCell>
      </div>
    </GridSection>
  );
};
