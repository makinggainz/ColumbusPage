
"use client";

import Image from "next/image";

export const SiteSelection = () => {
  return (
    <section className="bg-[#F9F9F9] py-[120px]">

      {/* ================= INTRO OUTSIDE ================= */}
      <div className="relative w-[1528px] mx-auto mb-[40px]">

        {/* Glow bubble */}
        <div className="absolute -left-[28px] -top-[18px] w-[190px] h-[95px] bg-gradient-to-r from-green-300/40 via-blue-300/30 to-purple-300/30 blur-[55px] rounded-full" />

        <div className="relative z-10 flex items-center gap-[14px]">
          <p className="text-[23px] tracking-[0.12em] font-bold uppercase text-[#1C274C]/70 ">
            + Introducing Columbus
          </p>

          <span className="px-[12px] py-[4px] text-[22px] rounded-full bg-[#E6F7EC] text-[#1F7A4D] font-medium">
            New
          </span>
        </div>
      </div>


      {/* ================= EXACT FIGMA CARD ================= */}
      <div className="flex justify-center">

        <div
          className="
            relative
            w-[1628px]
            h-[773px]
            rounded-[23px]
            overflow-hidden
            bg-gradient-to-br
            from-[#1B2D5A]
            via-[#13214C]
            to-[#0B163B]
          "
        >

          {/* ================= LEFT CONTENT ================= */}
          <div className="absolute left-[80px] top-[90px] w-[620px] text-white">

            <h2 className="text-[72px] leading-[108%] tracking-[-0.02em] font-semibold whitespace-nowrap mb-[40px]">
              Site Selection Reimagined
            </h2>

            <ul className="space-y-[18px] text-[20px] text-white/85 list-disc pl-[22px] mb-[180px]">
              <li>An end-to-end Site Selection tool.</li>
              <li>Generate new maps, in seconds.</li>
              <li className="pl-[4px]">Find exclusive critical datasets for<br></br> your decisions.</li>
              <li> Cheaper due diligence.</li>
            </ul>

            <p className="text-[20px] text-white/70 mb-[32px]">
              Columbus turns you into a{" "}
              <span className="font-semibold text-white">
                super- <br></br>explorer.
              </span>
            </p>

            <button className="h-[52px] px-[38px] bg-white text-[#13214C] font-medium rounded-[10px]">
              Check it out →
            </button>

          </div>


          {/* ================= DESKTOP UI ================= */}
          <div
            className="
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


          {/* ================= MOBILE UI ================= */}
          <div
            className="
              absolute
              left-[1320px]   /* 451 + 997 - 266 */
              top-[202px]    /* slight 4px vertical balance */
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


          {/* Bottom glow (as in Figma) */}
          <div className="absolute bottom-[-80px] right-[-60px] w-[260px] h-[260px] bg-purple-500/30 blur-[120px] rounded-full" />

        </div>

      </div>

    </section>
  );
};