"use client";

import Image from "next/image";

export const PartnerStrip = () => {
  return (
    <section className="bg-[#F7F8FA] py-[80px] border-b border-[#E8EAF0]">
      <div className="max-w-[1528px] mx-auto px-[100px]">

        <h3 className="text-[50px] font-semibold text-[#1C274C] mb-[10px]">
          Vetted, high-fidelity, and smart datasets
        </h3>

        <p className="text-[21px] text-[#1C274C]/60 mb-[40px]">
          We vet our data with partner organizations
        </p>

        <div className="flex items-center justify-between opacity-80">
          <Image src="/Icon/logo1.png" alt="" width={120} height={40} />
          <Image src="/Icon/logo2.png" alt="" width={120} height={40} />
            <Image src="/Icon/image1.png" alt="" width={120} height={40} />
          <Image src="/Icon/logo4.png" alt="" width={120} height={40} />
            <Image src="/Icon/image2.png" alt="" width={120} height={40} />
          <Image src="/Icon/logo6.png" alt="" width={120} height={40} />
          <Image src="/Icon/logo7.png" alt="" width={120} height={40} />
        </div>
      </div>
    </section>
  );
};