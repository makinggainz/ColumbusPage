
"use client";

import Image from "next/image";

export const SiteSelection = () => {
  return (
    <section className="bg-[#F9F9F9] py-[60px] sm:py-[80px] md:py-[120px] px-5 sm:px-10 md:px-[60px] lg:px-[100px]">

      {/* ================= INTRO ================= */}
      <div className="relative max-w-[1528px] mx-auto mb-[24px] md:mb-[40px]">

        {/* Glow bubble */}
        <div className="absolute -left-[28px] -top-[18px] w-[190px] h-[95px] bg-gradient-to-r from-green-300/40 via-blue-300/30 to-purple-300/30 blur-[55px] rounded-full" />

        <div className="relative z-10 flex items-center gap-[10px] md:gap-[14px]">
          <p className="text-[16px] sm:text-[19px] md:text-[23px] tracking-[0.12em] font-bold uppercase text-[#1C274C]/70">
            + Introducing Columbus
          </p>

          <span className="px-[10px] py-[3px] md:px-[12px] md:py-[4px] text-[16px] md:text-[22px] rounded-full bg-[#E6F7EC] text-[#1F7A4D] font-medium">
            New
          </span>
        </div>
      </div>


      {/* ================= CARD ================= */}
      <div className="flex justify-center">

        <div
          className="
            relative
            w-full
            max-w-[1628px]
            min-h-[400px]
            sm:min-h-[500px]
            md:h-[773px]
            rounded-[16px]
            md:rounded-[23px]
            overflow-hidden
            bg-gradient-to-br
            from-[#1B2D5A]
            via-[#13214C]
            to-[#0B163B]
          "
        >

          {/* ================= LEFT CONTENT ================= */}
          <div className="relative md:absolute left-0 md:left-[80px] top-0 md:top-[90px] w-full md:w-[620px] text-white p-6 sm:p-10 md:p-0">

            <h2 className="text-[28px] sm:text-[42px] md:text-[56px] lg:text-[72px] leading-[108%] tracking-[-0.02em] font-semibold mb-[20px] md:mb-[40px]">
              Site Selection Reimagined
            </h2>

            <ul className="space-y-[12px] md:space-y-[18px] text-[15px] sm:text-[17px] md:text-[20px] text-white/85 list-disc pl-[18px] md:pl-[22px] mb-[30px] md:mb-[180px]">
              <li>An end-to-end Site Selection tool.</li>
              <li>Generate new maps, in seconds.</li>
              <li>Find exclusive critical datasets for your decisions.</li>
              <li>Cheaper due diligence.</li>
            </ul>

            <p className="text-[16px] md:text-[20px] text-white/70 mb-[20px] md:mb-[32px]">
              Columbus turns you into a{" "}
              <span className="font-semibold text-white">
                super-explorer.
              </span>
            </p>

            <button className="h-[44px] md:h-[52px] px-[24px] md:px-[38px] bg-white text-[#13214C] font-medium rounded-[10px] text-[14px] md:text-base">
              Check it out →
            </button>

          </div>


          {/* ================= DESKTOP UI ================= */}
          <div
            className="
              hidden md:block
              absolute
              left-[530px]
              top-[205px]
              w-[997px]
              h-[571px]
              rounded-[18px]
              overflow-hidden
              shadow-[0_40px_120px_rgba(0,0,0,0.45)]
            "
          >
            <Image
              src="/Icon/desktop-ui.png"
              alt="Desktop UI"
              fill
              className="object-cover"
            />
          </div>


          {/* ================= MOBILE UI (visible on mobile as inline image) ================= */}
          <div className="relative md:hidden w-full h-[200px] sm:h-[280px] mt-4">
            <Image
              src="/Icon/desktop-ui.png"
              alt="Desktop UI"
              fill
              className="object-contain object-bottom"
            />
          </div>

          <div
            className="
              hidden lg:block
              absolute
              left-[1320px]
              top-[202px]
              w-[266px]
              h-[579px]
              rounded-[32px]
              overflow-hidden
              shadow-[0_40px_120px_rgba(0,0,0,0.55)]
              border-[6px]
              border-white
            "
          >
            <Image
              src="/Icon/mobile-ui.png"
              alt="Mobile UI"
              fill
              className="object-cover"
            />
          </div>


          {/* Bottom glow */}
          <div className="absolute bottom-[-80px] right-[-60px] w-[260px] h-[260px] bg-purple-500/30 blur-[120px] rounded-full" />

        </div>

      </div>

    </section>
  );
};
