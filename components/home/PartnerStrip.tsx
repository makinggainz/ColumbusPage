"use client";

import Image from "next/image";
import { GridSection, gl } from "./ContentGrid";

const LOGOS = [
  "/Icon/logo1.png",
  "/Icon/logo2.png",
  "/Icon/image1.png",
  "/Icon/logo4.png",
  "/Icon/image2.png",
  "/Icon/logo6.png",
  "/Icon/logo7.png",
];

export const PartnerStrip = () => {
  return (
    <GridSection>
      <div
        className="flex flex-col items-center px-8 md:px-10 pt-20 pb-8"
        style={{ borderRight: gl }}
      >
        <h2 className="text-[40px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.08] text-[#1D1D1F] text-center">
          High-fidelity and smart datasets
        </h2>
        <p className="text-[21px] text-[#86868b] mt-5 text-center">
          We vet our data with reputable partner organizations
        </p>
      </div>

      <div
        className="flex items-center justify-center gap-10 md:gap-16 flex-wrap px-8 md:px-10 py-12 pb-24"
        style={{ borderRight: gl, borderBottom: gl }}
      >
        {LOGOS.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt=""
            width={175}
            height={62}
            className="object-contain h-7 w-auto"
            style={{ filter: "grayscale(100%)", opacity: 0.45 }}
          />
        ))}
      </div>
    </GridSection>
  );
};
