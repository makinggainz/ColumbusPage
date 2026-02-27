
"use client";

import Image from "next/image";

export const SiteSelection = () => {
  return (
    <section className="bg-[#F9F9F9] py-12 sm:py-16 md:py-20 lg:py-[120px] px-4 sm:px-6">

      {/* INTRO */}
      <div className="relative w-full max-w-[1528px] mx-auto mb-8 sm:mb-10 md:mb-[40px]">
        <div className="absolute -left-4 -top-2 w-[120px] sm:w-[190px] h-[60px] sm:h-[95px] bg-gradient-to-r from-green-300/40 via-blue-300/30 to-purple-300/30 blur-[40px] sm:blur-[55px] rounded-full" />
        <div className="relative z-10 flex items-center gap-2 sm:gap-[14px]">
          <p className="text-[16px] sm:text-[19px] md:text-[23px] tracking-[0.12em] font-bold uppercase text-[#1C274C]/70">
            + Introducing Columbus
          </p>
          <span className="px-2 sm:px-[12px] py-1 sm:py-[4px] text-[14px] sm:text-[18px] md:text-[22px] rounded-full bg-[#E6F7EC] text-[#1F7A4D] font-medium">
            New
          </span>
        </div>
      </div>

      {/* CARD: responsive layout */}
      <div className="flex justify-center">
        <div
          className="
            relative w-full max-w-[1628px] min-h-[640px] md:min-h-[700px] lg:h-[773px]
            rounded-[12px] sm:rounded-[18px] lg:rounded-[23px]
            overflow-hidden
            bg-gradient-to-br from-[#1B2D5A] via-[#13214C] to-[#0B163B]
            px-6 sm:px-8 md:px-0 pt-8 sm:pt-10 md:pt-0 pb-8 md:pb-0
          "
        >
          {/* LEFT CONTENT: relative on mobile, absolute on lg */}
          <div className="relative md:absolute left-0 md:left-[80px] top-0 md:top-[90px] w-full md:w-[620px] max-w-xl md:max-w-none text-white z-10">
            <h2 className="text-[32px] sm:text-[48px] md:text-[60px] lg:text-[72px] leading-[108%] tracking-[-0.02em] font-semibold mb-6 sm:mb-8 md:mb-[40px]">
              Site Selection Reimagined
            </h2>

            <ul className="space-y-2 sm:space-y-3 md:space-y-[18px] text-[14px] sm:text-[17px] md:text-[20px] text-white/85 list-disc pl-5 sm:pl-[22px] mb-8 sm:mb-12 md:mb-[180px]">
              <li>An end-to-end Site Selection tool.</li>
              <li>Generate new maps, in seconds.</li>
              <li>Find exclusive critical datasets for your decisions.</li>
              <li>Cheaper due diligence.</li>
            </ul>

            <p className="text-[14px] sm:text-[17px] md:text-[20px] text-white/70 mb-6 sm:mb-[32px]">
              Columbus turns you into a <span className="font-semibold text-white">super-explorer.</span>
            </p>

            <button className="h-[44px] sm:h-[52px] px-6 sm:px-[38px] bg-white text-[#13214C] font-medium rounded-[8px] sm:rounded-[10px] text-sm sm:text-base">
              Check it out →
            </button>
          </div>

          {/* MOBILE UI: visible only on < md */}
          <div className="flex md:hidden justify-center px-4 pb-8 mt-8">
            <div className="relative w-[200px] h-[420px] rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-4 border-white/20">
              <Image src="/Icon/mobile-ui.png" alt="Columbus platform" fill className="object-cover" />
            </div>
          </div>

          {/* DESKTOP UI: visible from md, positioned absolute on lg */}
          <div
            className="
              hidden md:block absolute left-[50%] md:left-[530px] top-[320px] md:top-[205px]
              w-[calc(100%-2rem)] md:w-[997px] max-w-[997px]
              h-[280px] sm:h-[360px] lg:h-[571px]
              rounded-[12px] lg:rounded-[18px] overflow-hidden
              shadow-[0_40px_120px_rgba(0,0,0,0.45)]
              -translate-x-1/2 md:translate-x-0
            "
          >
            <Image
              src="/Icon/desktop-ui.png"
              alt="Desktop UI"
              fill
              className="object-cover"
            />
          </div>

          {/* MOBILE UI: visible only on xl */}
          <div
            className="
              hidden xl:block absolute left-[1320px] top-[202px]
              w-[266px] h-[579px]
              rounded-[32px] overflow-hidden
              shadow-[0_40px_120px_rgba(0,0,0,0.55)] border-[6px] border-white
            "
          >
            <Image
              src="/Icon/mobile-ui.png"
              alt="Mobile UI"
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-[-80px] right-[-60px] w-[260px] h-[260px] bg-purple-500/30 blur-[120px] rounded-full pointer-events-none" />
        </div>
      </div>

    </section>
  );
};