"use client";

import Image from "next/image";
import { GridSection, GridCell } from "./ContentGrid";

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
      <GridCell className="flex flex-col items-center px-8 md:px-10 pt-16 pb-8">
        <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.02em] leading-[1.1] text-[#1D1D1F] text-center">
          High-fidelity and smart datasets
        </h2>
        <p className="text-[15px] text-[#6E6E73] mt-3 text-center">
          We vet our data with reputable partner organizations
        </p>
      </GridCell>

      <GridCell className="flex items-center justify-center gap-10 md:gap-14 flex-wrap px-8 md:px-10 py-10 pb-32">
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
      </GridCell>
    </GridSection>
  );
};
