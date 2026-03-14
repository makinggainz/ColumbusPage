"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

export const TravelSection = () => {
  return (
    <section className="bg-[#F9F9F9] py-3.5 sm:py-11.5 lg:py-19.5">
      <Container>

        <div
          className="relative overflow-hidden px-8 sm:px-12 lg:px-16 pt-4.25 pb-96.75 sm:pt-8.25 sm:pb-100.75 lg:pt-12.25 lg:pb-104.75 rounded-[23px] bg-linear-to-br from-[#FFE5D4] via-[#FFD8C2] to-[#FFC9A8]"
        >

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">

            {/* TEXT BLOCK */}
            <div className="flex flex-col">

              <p className="text-xs sm:text-sm tracking-widest uppercase text-[#1C274C]/60 mb-4">
                Available everywhere
              </p>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-semibold text-[#1C274C] mb-6">
                Travel like a boss
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-[#1C274C]/75 mb-4">
                MapsGPT is your local guide in your pocket.
              </p>

              <ul className="space-y-3 text-sm sm:text-base md:text-lg text-[#1C274C]/75 mb-8">
                <li>• Plan cool trips</li>
                <li>• Make itineraries</li>
                <li>• Take care of every preference & detail</li>
              </ul>

              <div className="mt-auto -mb-85 sm:-mb-80 lg:-mb-90">
                <p className="text-sm sm:text-base md:text-lg text-[#010101] mb-8">
                  Find your next hang out spot, easier.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                  <Link
                    href="/maps-gpt"
                    className="px-6 py-3 bg-white border border-[#1C274C]/30 rounded-xs text-sm sm:text-base text-[#1C274C] w-full sm:w-auto inline-block text-center"
                  >
                    Try it out now →
                  </Link>

                  <Link
                    href="/technology"
                    className="px-6 py-3 border border-[#1C274C]/30 rounded-xs text-sm sm:text-base text-[#1C274C] w-full sm:w-auto inline-block text-center bg-transparent hover:bg-[#1C274C]/5 transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>

            </div>

            {/* Right column spacer for grid layout */}
            <div className="relative min-h-70 lg:min-h-80" aria-hidden />

          </div>

          {/* DESKTOP + MOBILE IMAGE — same dimensions as SiteSelection: bottom-right of card */}
          <div className="absolute bottom-0 right-7.5 w-[min(calc(50%+200px),calc(100%-60px))] aspect-16/10 rounded-none overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
            <Image
              src="/emoji/desk.png"
              alt="Desktop UI"
              fill
              className="object-cover"
            />
            <div
              className="
                absolute
                right-0
                translate-x-1/5
                top-0
                h-full
                aspect-9/16
                rounded-4xl
                overflow-hidden
                border-4
                border-white
                shadow-[0_40px_140px_rgba(0,0,0,0.35)]
              "
            >
              <Image
                src="/emoji/mob.png"
                alt="Mobile UI"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>

      </Container>
    </section>
  );
};
