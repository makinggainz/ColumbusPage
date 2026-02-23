

"use client";

import Image from "next/image";

export const TravelSection = () => {
  return (
    <section className="bg-white py-[120px]">
      <div className="max-w-[1528px] mx-auto">

        {/* MAIN CONTAINER */}
        <div className="relative w-[1528px] h-[793px] rounded-[23px] bg-gradient-to-br from-[#FFE5D4] via-[#FFD8C2] to-[#FFC9A8] overflow-hidden">

          {/* TEXT BLOCK */}
          <div className="absolute left-[100px] top-[120px] w-[496px]">

            <p className="text-[21px] tracking-[0.25em] uppercase text-[#1C274C]/60 mb-[18px]">
              Available everywhere
            </p>

            <h2 className="text-[64px] leading-[105%] font-semibold text-[#1C274C] mb-[22px]">
              Travel like a boss
            </h2>

            <p className="text-[20px] text-[#1C274C]/75 mb-[16px]">
              MapsGPT is local guide in your pocket.
            </p>

            <ul className="space-y-[6px] text-[20px] text-[#1C274C]/75 mb-[232px]">
              <li>• Plan cool trips</li>
              <li>• make itineraries</li>
              <li>• take care of every preference & detail</li>
            </ul>

            <p className="text-[20px] text-[#1C274C]/65 mb-[38px]">
              Find your next hang out spot, easier.
            </p>

            <div className="flex items-center gap-[24px]">
              <button className="h-[40px] px-[20px] bg-white border border-[#1C274C]/30 rounded-[6px] text-[18px] text-[#1C274C]">
                Try it out now →
              </button>

              <button className="text-[18px] text-[#1C274C]">
                Learn more →
              </button>
            </div>
          </div>

          {/* DESKTOP UI */}
          <div className="absolute left-[658px] bottom-[-2px] w-[1001px] h-[573px] rounded-[16px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.08)]">
            <Image
              src="/emoji/desk.png"
              alt="Desktop UI"
              fill
              className="object-cover"
            />
          </div>

          {/* MOBILE UI */}
          <div className="absolute right-[-3px] bottom-[-1px] w-[307px] h-[580px] rounded-[28px] overflow-hidden shadow-[0_35px_70px_rgba(0,0,0,0.12)]">
            <Image
              src="/emoji/mob.png"
              alt="Mobile UI"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};