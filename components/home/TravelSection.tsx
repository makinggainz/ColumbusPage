

"use client";

import Image from "next/image";

export const TravelSection = () => {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-[120px] px-4 sm:px-6">
      <div className="max-w-[1528px] mx-auto">

        {/* MAIN CONTAINER: responsive width and height */}
        <div className="relative w-full min-h-[640px] md:min-h-[700px] lg:h-[793px] rounded-[12px] sm:rounded-[18px] lg:rounded-[23px] bg-gradient-to-br from-[#FFE5D4] via-[#FFD8C2] to-[#FFC9A8] overflow-hidden pt-10 sm:pt-12 md:pt-0 pb-0 md:pb-0">

          {/* TEXT BLOCK: relative on mobile, absolute on lg */}
          <div className="relative lg:absolute left-0 lg:left-[100px] top-0 lg:top-[120px] w-full max-w-[496px] lg:w-[496px] z-10 px-4 sm:px-6 md:px-8 lg:px-0">

            <p className="text-[14px] sm:text-[17px] md:text-[21px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#1C274C]/60 mb-3 sm:mb-[18px]">
              Available everywhere
            </p>

            <h2 className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[105%] font-semibold text-[#1C274C] mb-4 sm:mb-[22px]">
              Travel like a boss
            </h2>

            <p className="text-[16px] sm:text-[18px] md:text-[20px] text-[#1C274C]/75 mb-3 sm:mb-[16px]">
              MapsGPT is local guide in your pocket.
            </p>

            <ul className="space-y-1 sm:space-y-[6px] text-[16px] sm:text-[18px] md:text-[20px] text-[#1C274C]/75 mb-8 sm:mb-12 md:mb-[232px]">
              <li>• Plan cool trips</li>
              <li>• make itineraries</li>
              <li>• take care of every preference & detail</li>
            </ul>

            <p className="text-[16px] sm:text-[18px] md:text-[20px] text-[#1C274C]/65 mb-6 sm:mb-[38px]">
              Find your next hang out spot, easier.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-[24px]">
              <button className="h-[40px] px-5 sm:px-[20px] bg-white border border-[#1C274C]/30 rounded-[6px] text-[16px] sm:text-[18px] text-[#1C274C]">
                Try it out now →
              </button>
              <button className="text-[16px] sm:text-[18px] text-[#1C274C]">
                Learn more →
              </button>
            </div>
          </div>

          {/* MOBILE UI: visible only on < md */}
          <div className="flex md:hidden justify-center px-4 pb-10 mt-8">
            <div className="relative w-[220px] h-[440px] rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)]">
              <Image src="/emoji/mob.png" alt="MapsGPT app" fill className="object-cover" />
            </div>
          </div>

          {/* DESKTOP UI: visible from md */}
          <div className="hidden md:block absolute left-1/2 md:left-[658px] bottom-[-2px] -translate-x-1/2 md:translate-x-0 w-[90%] md:w-[1001px] max-w-[1001px] h-[320px] sm:h-[400px] lg:h-[573px] rounded-[12px] lg:rounded-[16px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.08)]">
            <Image
              src="/emoji/desk.png"
              alt="Desktop UI"
              fill
              className="object-cover"
            />
          </div>

          {/* MOBILE UI: visible only on xl */}
          <div className="hidden xl:block absolute right-[-3px] bottom-[-1px] w-[307px] h-[580px] rounded-[28px] overflow-hidden shadow-[0_35px_70px_rgba(0,0,0,0.12)]">
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