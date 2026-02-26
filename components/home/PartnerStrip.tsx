"use client";

import Image from "next/image";

export const PartnerStrip = () => {
  return (
    <section className="bg-[#F7F8FA] border-b border-[#E8EAF0]">
      <div className="w-[404px] h-[848px] mx-auto px-[24px] pt-[120px]">

        {/* Heading */}
        <h3 className="text-[40px] font-semibold text-[#1C274C] leading-[140%] mb-[22px]">
          Vetted, high-fidelity, and smart datasets
        </h3>

        {/* Subtext */}
        <p className="text-[16px] text-[#1C274C]/60 mb-[40px]">
          We vet our data with partner organizations
        </p>

        {/* ROW 1 */}
        <div className="flex items-center gap-[32px] mb-[40px]">
          <Image src="/Icon/logo1.png" alt="" width={84} height={82} />
          <Image src="/Icon/logo2.png" alt="" width={147} height={55} />
          <Image src="/Icon/image1.png" alt="" width={124} height={77} />
        </div>

        {/* ROW 2 */}
        <div className="flex items-center gap-[48px] mb-[40px]">
          <Image src="/Icon/logo4.png" alt="" width={223} height={78} />
          <Image src="/Icon/logo5.png" alt="" width={113} height={102} />
        </div>

        {/* ROW 3 */}
        <div className="flex items-center gap-[64px]">
          <Image src="/Icon/logo6.png" alt="" width={176} height={55} />
          <Image src="/Icon/logo7.png" alt="" width={91} height={91} />
        </div>

      </div>
    </section>
  );
};