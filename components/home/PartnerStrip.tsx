"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";

export const PartnerStrip = () => {
  return (
    <section className="bg-[#F9F9F9] border-b border-[#E8EAF0] relative" style={{ height: 288 }}>
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
        <div className="pl-16 flex flex-col" style={{ paddingTop: 54, height: 234 }}>

          {/* Heading Block */}
          <div className="max-w-5xl">
            <h3 className="font-semibold text-[#1C274C] leading-tight" style={{ fontSize: 40, letterSpacing: "-0.02em" }}>
              Vetted, high-fidelity, and smart datasets
            </h3>

            <p className="font-light text-[#010101]" style={{ fontSize: 20, marginTop: 12 }}>
              We vet our data with partner organizations
            </p>
          </div>

          {/* Logos Grid — vertically centered in remaining space */}
          <div className="flex-1 flex items-center pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-x-10 w-full opacity-80">
              <Logo src="/Icon/logo1.png" />
              <Logo src="/Icon/logo2.png" />
              <Logo src="/Icon/image1.png" />
              <Logo src="/Icon/logo4.png" />
              <Logo src="/Icon/image2.png" />
              <Logo src="/Icon/logo6.png" />
              <Logo src="/Icon/logo7.png" />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

const Logo = ({ src }: { src: string }) => (
  <div className="flex justify-start items-center">
    <Image
      src={src}
      alt=""
      width={175}
      height={62}
      className="object-contain h-[46.5px] sm:h-13.5 md:h-15.5 lg:h-[77.5px] w-auto transition-opacity duration-300 hover:opacity-100"
    />
  </div>
);