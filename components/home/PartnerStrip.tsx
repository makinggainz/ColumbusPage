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
    <GridSection fadeTop={false} fadeBottom={false} style={{ borderTop: "none", paddingTop: 100 }}>
      <div className="flex flex-col items-center px-8 md:px-10 pt-20">
        <h2 className="font-bold tracking-[-0.02em] text-[#1D1D1F] text-center" style={{ fontSize: 36 }}>
          High-fidelity and smart datasets
        </h2>
        <p className="text-[20px] text-[#000000] mt-3 text-center">
          We vet our data with reputable partner organizations
        </p>
      </div>

      <div
        className="flex items-center justify-center gap-10 md:gap-14 flex-wrap px-8 md:px-10 pt-16 pb-28"
      >
        {LOGOS.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt=""
            width={175}
            height={62}
            className="object-contain h-[42px] w-auto"
            style={{ filter: "grayscale(100%)", opacity: 0.45 }}
          />
        ))}
      </div>

      {/* Bottom separator */}
      <div className="flex justify-center px-8 md:px-10 pb-40">
        <div className="w-4/5" style={{ height: 1, borderTop: gl }} />
      </div>
    </GridSection>
  );
};
