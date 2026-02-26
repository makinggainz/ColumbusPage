"use client";

import Image from "next/image";

export const PartnerStrip = () => {
  return (
    <section className="bg-[#F7F8FA] py-16 md:py-20 lg:py-24 border-b border-[#E8EAF0]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* Heading Block */}
        <div className="max-w-3xl mb-10">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1C274C] leading-tight">
            Vetted, high-fidelity, and smart datasets
          </h3>

          <p className="mt-3 text-sm sm:text-base md:text-lg text-[#1C274C]/60">
            We vet our data with partner organizations
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-y-10 gap-x-8 items-center opacity-80">
          <Logo src="/Icon/logo1.png" />
          <Logo src="/Icon/logo2.png" />
          <Logo src="/Icon/image1.png" />
          <Logo src="/Icon/logo4.png" />
          <Logo src="/Icon/image2.png" />
          <Logo src="/Icon/logo6.png" />
          <Logo src="/Icon/logo7.png" />
        </div>

      </div>
    </section>
  );
};

const Logo = ({ src }: { src: string }) => (
  <div className="flex justify-center items-center">
    <Image
      src={src}
      alt=""
      width={140}
      height={50}
      className="object-contain h-8 sm:h-10 md:h-12 lg:h-14 w-auto transition-opacity duration-300 hover:opacity-100"
    />
  </div>
);