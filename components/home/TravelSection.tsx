


"use client";

import Image from "next/image";

export const TravelSection = () => {
  return (
    <section className="bg-white py-[60px] sm:py-[80px] md:py-[120px] px-5 sm:px-10 md:px-[60px]">
      <div className="max-w-[1528px] mx-auto">

        {/* MAIN CONTAINER */}
        <div className="relative w-full min-h-[500px] md:h-[793px] rounded-[16px] md:rounded-[23px] bg-gradient-to-br from-[#FFE5D4] via-[#FFD8C2] to-[#FFC9A8] overflow-hidden">

          {/* TEXT BLOCK */}
          <div className="relative md:absolute left-0 md:left-[100px] top-0 md:top-[120px] w-full md:w-[496px] p-6 sm:p-10 md:p-0">

            <p className="text-[15px] sm:text-[18px] md:text-[21px] tracking-[0.25em] uppercase text-[#1C274C]/60 mb-[12px] md:mb-[18px]">
              Available everywhere
            </p>

            <h2 className="text-[32px] sm:text-[48px] md:text-[64px] leading-[105%] font-semibold text-[#1C274C] mb-[16px] md:mb-[22px]">
              Travel like a boss
            </h2>

            <p className="text-[16px] md:text-[20px] text-[#1C274C]/75 mb-[12px] md:mb-[16px]">
              MapsGPT is local guide in your pocket.
            </p>

            <ul className="space-y-[4px] md:space-y-[6px] text-[16px] md:text-[20px] text-[#1C274C]/75 mb-[30px] md:mb-[232px]">
              <li>• Plan cool trips</li>
              <li>• make itineraries</li>
              <li>• take care of every preference & detail</li>
            </ul>

            <p className="text-[16px] md:text-[20px] text-[#1C274C]/65 mb-[24px] md:mb-[38px]">
              Find your next hang out spot, easier.
            </p>

            <div className="flex items-center gap-[16px] md:gap-[24px]">
              <button className="h-[36px] md:h-[40px] px-[16px] md:px-[20px] bg-white border border-[#1C274C]/30 rounded-[6px] text-[15px] md:text-[18px] text-[#1C274C]">
                Try it out now →
              </button>

              <button className="text-[15px] md:text-[18px] text-[#1C274C]">
                Learn more →
              </button>
            </div>
          </div>

          {/* DESKTOP UI */}
          <div className="hidden md:block absolute left-[658px] bottom-[-2px] w-[1001px] h-[573px] rounded-[16px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.08)]">
            <Image
              src="/emoji/desk.png"
              alt="Desktop UI"
              fill
              className="object-cover"
            />
          </div>

          {/* MOBILE UI - shown inline on small screens */}
          <div className="relative md:hidden w-full h-[200px] sm:h-[280px]">
            <Image
              src="/emoji/desk.png"
              alt="Desktop UI"
              fill
              className="object-contain object-bottom"
            />
          </div>

          {/* MOBILE UI overlay - desktop only */}
          <div className="hidden lg:block absolute right-[-3px] bottom-[-1px] w-[307px] h-[580px] rounded-[28px] overflow-hidden shadow-[0_35px_70px_rgba(0,0,0,0.12)]">
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
