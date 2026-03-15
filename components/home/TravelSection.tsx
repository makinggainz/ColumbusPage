"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { cambo } from "@/app/fonts";

export const TravelSection = () => {
  return (
    <section className="bg-[#F9F9F9] py-3.5 sm:py-11.5 lg:py-19.5">
      <Container>

        <div
          className="relative overflow-hidden rounded-[23px] bg-linear-to-br from-[#FAEAE2] via-[#FAEAE2] via-90% to-[#E2A383]"
          style={{ height: 773, padding: "49px 64px 0" }}
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

            <ul className="space-y-3 text-sm sm:text-base md:text-lg text-black mb-8">
              <li>• Plan cool trips</li>
              <li>• Make itineraries</li>
              <li>• Take care of every preference & detail</li>
            </ul>

            <p className="text-sm sm:text-base md:text-lg font-medium text-black mb-8">
              Find your next hang out spot, easier.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
              <Link
                href="/maps-gpt"
                className="px-6 py-3 bg-white border border-[#1C274C]/30 rounded-xs text-[20px] font-semibold text-[#1C274C] w-full sm:w-auto inline-block text-center"
              >
                Try it out now ↗
              </Link>

              <Link
                href="/technology"
                className="px-6 py-3 rounded-xs text-[20px] font-semibold text-[#1C274C] w-full sm:w-auto inline-block text-center bg-transparent hover:bg-[#1C274C]/5 transition-colors"
              >
                Learn more ↗
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
