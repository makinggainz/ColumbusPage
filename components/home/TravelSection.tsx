"use client";

import Image from "next/image";

export const TravelSection = () => {
  return (
    <section className="bg-white py-20 md:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFE5D4] via-[#FFD8C2] to-[#FFC9A8]">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 p-8 sm:p-12 lg:p-16 items-center">

            {/* TEXT BLOCK */}
            <div>

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

              <p className="text-sm sm:text-base md:text-lg text-[#1C274C]/65 mb-8">
                Find your next hang out spot, easier.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-white border border-[#1C274C]/30 rounded-lg text-sm sm:text-base text-[#1C274C] w-full sm:w-auto">
                  Try it out now →
                </button>

                <button className="text-sm sm:text-base text-[#1C274C] w-full sm:w-auto text-left">
                  Learn more →
                </button>
              </div>

            </div>

            {/* UI PREVIEW BLOCK */}
            <div className="relative flex justify-center items-end">

              {/* DESKTOP UI */}
              <div className="relative w-full max-w-[820px] aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.25)]">

                <Image
                  src="/emoji/desk.png"
                  alt="Desktop UI"
                  fill
                  className="object-cover"
                />

                {/* MOBILE UI OVERLAY (same height as desktop) */}
                <div
                  className="
                    absolute
                    top-0
                    right-0
                    translate-x-1/4
                    h-full
                    aspect-[35/56]
                    rounded-[28px]
                    overflow-hidden
                    shadow-[0_40px_120px_rgba(0,0,0,0.35)]
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

          </div>

        </div>

      </div>
    </section>
  );
};