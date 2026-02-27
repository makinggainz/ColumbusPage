"use client";

import Image from "next/image";

export const PartnerStrip = () => {
  return (
    <section className="bg-[#F7F8FA] py-10 sm:py-12 md:py-16 lg:py-[80px] border-b border-[#E8EAF0]">
      <div className="max-w-[1528px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[100px]">

        <h3 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-semibold text-[#1C274C] mb-2 sm:mb-[10px]">
          Vetted, high-fidelity, and smart datasets
        </h3>

        <p className="text-[16px] sm:text-[18px] md:text-[21px] text-[#1C274C]/60 mb-6 sm:mb-8 md:mb-[40px]">
          We vet our data with partner organizations
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 sm:gap-4 opacity-80">
          <Image src="/Icon/logo1.png" alt="" width={100} height={33} className="w-[80px] sm:w-[100px] h-auto" />
          <Image src="/Icon/logo2.png" alt="" width={100} height={33} className="w-[80px] sm:w-[100px] h-auto" />
          <Image src="/Icon/image1.png" alt="" width={100} height={33} className="w-[80px] sm:w-[100px] h-auto" />
          <Image src="/Icon/logo4.png" alt="" width={100} height={33} className="w-[80px] sm:w-[100px] h-auto" />
          <Image src="/Icon/image2.png" alt="" width={100} height={33} className="w-[80px] sm:w-[100px] h-auto" />
          <Image src="/Icon/logo6.png" alt="" width={100} height={33} className="w-[80px] sm:w-[100px] h-auto" />
          <Image src="/Icon/logo7.png" alt="" width={100} height={33} className="w-[80px] sm:w-[100px] h-auto" />
        </div>
      </div>
    </section>
  );
};