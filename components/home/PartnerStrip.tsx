"use client";

import Image from "next/image";

export const PartnerStrip = () => {
  return (
    <section className="bg-[#FFFFFF] py-[80px] md:py-[100px]">
      <div className="max-w-[980px] mx-auto px-6">

        {/* Eyebrow */}
        <p className="text-[17px] font-semibold text-[#6E6E73] text-center mb-4">
          Partners
        </p>

        {/* Heading */}
        <h3 className="text-[48px] md:text-[56px] font-semibold tracking-[-0.003em] leading-[1.07] text-[#1D1D1F] text-center mb-16">
          Vetted, high-fidelity, and smart datasets
        </h3>

        {/* Logos */}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
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
  <div className="flex items-center justify-center">
    <Image
      src={src}
      alt=""
      width={175}
      height={62}
      className="object-contain h-9 w-auto transition-opacity duration-300 hover:opacity-80"
      style={{ filter: "grayscale(100%)", opacity: 0.5 }}
    />
  </div>
);
