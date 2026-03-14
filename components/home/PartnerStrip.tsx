"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";

export const PartnerStrip = () => {
  return (
    <section className="bg-[#F9F9F9] py-[24px] md:py-[40px] lg:py-[56px] border-b border-[#E8EAF0] relative">
      {/* Vector 4410 */}
      <div
        className="absolute w-0 h-[288px] border-l border-[#E8EAF0]"
        style={{
          left: "99.5px",
          top: 0,
          transform: "matrix(1, 0, 0, -1, 0, 0)",
        }}
        aria-hidden
      />
      {/* Vector 4410 — right side */}
      <div
        className="absolute w-0 h-[288px] border-r border-[#E8EAF0]"
        style={{
          right: "99.5px",
          top: 0,
          transform: "matrix(1, 0, 0, -1, 0, 0)",
        }}
        aria-hidden
      />
      <Container>

        {/* Heading Block */}
        <div className="max-w-5xl mb-10 -translate-x-[120px]">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1C274C] leading-tight">
            Vetted, high-fidelity, and smart datasets
          </h3>

          <p className="mt-3 text-sm sm:text-base md:text-lg text-[#010101]">
            We vet our data with partner organizations
          </p>
        </div>

        {/* Logos Grid — extends from heading left edge to right Vector */}
        <div className="-translate-x-[120px] w-[calc(100%+219.5px)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-y-12 gap-x-10 items-center opacity-80">
          <Logo src="/Icon/logo1.png" />
          <Logo src="/Icon/logo2.png" />
          <Logo src="/Icon/image1.png" />
          <Logo src="/Icon/logo4.png" />
          <Logo src="/Icon/image2.png" />
          <Logo src="/Icon/logo6.png" />
          <Logo src="/Icon/logo7.png" />
        </div>

        </div>
      </Container>
    </section>
  );
};

const Logo = ({ src }: { src: string }) => (
  <div className="flex justify-center items-center min-h-[80px] sm:min-h-[96px] md:min-h-[112px]">
    <Image
      src={src}
      alt=""
      width={180}
      height={64}
      className="object-contain h-12 sm:h-14 md:h-16 lg:h-20 w-auto transition-opacity duration-300 hover:opacity-100"
    />
  </div>
);