"use client";

import Image from "next/image";

export const PartnerStrip = () => {
  return (
    <section className="bg-[#F7F8FA] py-[40px] sm:py-[60px] md:py-[80px] border-b border-[#E8EAF0]">
      <div className="max-w-[1528px] mx-auto px-5 sm:px-10 md:px-[100px]">

        <h3 className="text-[24px] sm:text-[36px] md:text-[50px] font-semibold text-[#1C274C] mb-[8px] md:mb-[10px]">
          Vetted, high-fidelity, and smart datasets
        </h3>

        <p className="text-[14px] sm:text-[17px] md:text-[21px] text-[#1C274C]/60 mb-[24px] md:mb-[40px]">
          We vet our data with partner organizations
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 sm:gap-4 opacity-80">
          <Image src="/Icon/logo1.png" alt="" width={120} height={40} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto" />
          <Image src="/Icon/logo2.png" alt="" width={120} height={40} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto" />
          <Image src="/Icon/image1.png" alt="" width={120} height={40} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto" />
          <Image src="/Icon/logo4.png" alt="" width={120} height={40} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto" />
          <Image src="/Icon/image2.png" alt="" width={120} height={40} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto hidden sm:block" />
          <Image src="/Icon/logo6.png" alt="" width={120} height={40} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto hidden sm:block" />
          <Image src="/Icon/logo7.png" alt="" width={120} height={40} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto hidden md:block" />
        </div>
      </div>
    </section>
  );
};
