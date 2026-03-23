"use client";

import Image from "next/image";
import { GridSection, GridHeader } from "./ContentGrid";

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
      <GridHeader
        title="Vetted, high-fidelity, and smart datasets"
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7">
        {LOGOS.map((src, i) => (
          <div
            key={i}
            className="flex items-center justify-center py-8 px-4 transition-colors duration-200 hover:bg-[rgba(120,120,200,0.04)]"
            style={{  }}
          >
            <Image
              src={src}
              alt=""
              width={175}
              height={62}
              className="object-contain h-8 w-auto"
              style={{ filter: "grayscale(100%)", opacity: 0.5 }}
            />
          </div>
        ))}

        {/* Fill remaining cells on sm (4-col) to avoid gaps */}
        <div className="hidden sm:block md:hidden" />
      </div>
    </GridSection>
  );
};
