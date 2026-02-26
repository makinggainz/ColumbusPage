"use client";

import Image from "next/image";

export const SiteSelection = () => {
  return (
    <div className="flex justify-center bg-[#F9F9F9]">
      {/* FRAME 404 × 1980 */}
      <section className="relative w-[404px] h-[1980px] bg-[#F9F9F9]">

        {/* INTRO */}
        <div className="absolute left-[19px] top-[28px] flex items-center gap-[10px]">
          <p className="text-[14px] tracking-[0.14em] font-semibold uppercase text-[#1C274C]/70">
            + Introducing Columbus
          </p>
          <span className="px-[10px] py-[3px] text-[12px] rounded-full bg-[#E6F7EC] text-[#1F7A4D] font-medium">
            New
          </span>
        </div>

        {/* MAIN CARD 380 × 1956 */}
        <div className="absolute left-[19px] top-[72px] w-[380px] h-[1956px] rounded-[23px] overflow-hidden bg-gradient-to-br from-[#1B2D5A] via-[#13214C] to-[#0B163B]">

          {/* TITLE */}
          <h2 className="absolute left-[29px] top-[48px] w-[241px] text-[40px] leading-[140%] text-white font-normal">
            Site Selection Reimagined
          </h2>

               {/* DESKTOP_UI */}     
            <div className="absolute left-[14px] top-[164px] w-[351px] h-[616px] rounded-[14px] overflow-hidden bg-white">
              <Image
                src="/Icon/desktop-ui.png"
                alt=""
                fill
                sizes="351px"
                className="object-cover object-top"
              />
            </div>
       

          {/* BULLET SECTION 335 × 224 */}
          <div className="absolute left-[48px] top-[820px] w-[335px] h-[224px] text-white/85">
            <ul className="list-disc pl-[20px] space-y-[18px] text-[20px]">
              <li>An end-to-end Site Selection tool.</li>
              <li>Generate new maps, in seconds.</li>
              <li>Find exclusive critical datasets for your decisions.</li>
              <li>Cheaper due diligence.</li>
            </ul>
          </div>

          {/* MOBILE UI 293 × 638 */}
          <div className="absolute left-[62px] top-[1080px] w-[293px] h-[638px] rounded-[32px] overflow-hidden border-[4px] border-white shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <Image
              src="/Icon/mobile-ui.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          {/* SUBTEXT */}
          <p className="absolute left-[66px] top-[1740px] w-[250px] text-[20px] text-white/70 leading-[140%]">
            Columbus turns you into a{" "}
            <span className="font-semibold text-white">
              super-explorer.
            </span>
          </p>

          {/* BUTTON 226 × 46 */}
          <button className="absolute left-1/2 -translate-x-1/2 top-[1820px] w-[226px] h-[46px] bg-white text-[#13214C] font-medium rounded-[10px]">
            Check it out →
          </button>

          {/* BOTTOM GLOW */}
          <div className="absolute bottom-[-70px] right-[-60px] w-[260px] h-[260px] bg-purple-500/40 blur-[120px] rounded-full" />
        </div>

      </section>
    </div>
  );
};