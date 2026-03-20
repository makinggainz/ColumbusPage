"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";

export const PartnerStrip = () => {
  return (
    <section className="bg-white py-32">
      <Container>
        <div className="pl-0 lg:pl-0">

          {/* Label */}
          <p className="text-[11px] font-medium tracking-[0.15em] text-[#A1A1AA] uppercase mb-8">
            Data Partners
          </p>

          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <h3
              className="font-bold text-[#09090B] leading-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 40px)", letterSpacing: "-0.025em", maxWidth: 540 }}
            >
              Vetted, high-fidelity, and smart datasets
            </h3>
            <p className="text-[15px] text-[#71717A] max-w-xs leading-relaxed">
              We vet our data with partner organizations to ensure precision at every layer.
            </p>
          </div>

          {/* Logos */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-x-10 gap-y-6 w-full">
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
  <div className="flex items-center">
    <Image
      src={src}
      alt=""
      width={175}
      height={62}
      className="object-contain h-9 w-auto transition-opacity duration-300 hover:opacity-100"
      style={{ filter: "grayscale(100%) opacity(0.6)" }}
    />
  </div>
);
