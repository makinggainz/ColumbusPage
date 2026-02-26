"use client";

import Image from "next/image";

export const Vision = () => {
  return (
    <div className="w-full flex justify-center bg-[#F9F9F9]">
      
      {/* 404px FIGMA FRAME */}
      <section className="w-[404px] bg-[#F9F9F9] pt-[120px] pb-[80px]">

        {/* TITLE */}
        <h2 className="text-[32px] font-semibold text-[#1C274C] leading-[140%] text-center px-[45px] w-[311px] mx-auto mb-[40px]">
          Our vision of a new kind of AI
        </h2>

        {/* 2-COLUMN GRID */}
        <div className="grid grid-cols-2 gap-[5px] px-[25px]">

          {/* Row 1 */}
          <Tile src="/image1.png" />
          <Tile src="/image2.png" />

          {/* Row 2 */}
          <TextTile
            title="General Intelligence"
            subtitle="for the physical world"
          />
          <Tile src="/image3.png" />

          {/* Row 3 */}
          <Tile src="/image4.png" />
          <TextTile
            title="Foundational Models"
            subtitle="for Earth"
          />

          {/* Row 4 */}
          <Tile src="/image5.png" />
          <Tile src="/image6.png" />

        </div>

        {/* DESCRIPTION */}
        <p className="mt-[48px] px-[28px] text-[16px] leading-[140%] text-[#1C274C]/80 text-center">
          ColumbusPro-1 processes satellite imagery, terrain data, human activity,
          and temporal patterns to generate actionable intelligence across real estate,
          research, and consumer domains.
        </p>

        {/* BUTTON */}
        <div className="mt-[48px] flex justify-center">
          <button className="border border-[#1C274C] w-[351px] h-[48px] text-[16px] font-bold tracking-wide rounded-md">
            [ See what we’re building ]
          </button>
        </div>

      </section>
    </div>
  );
};

const Tile = ({ src }: { src: string }) => {
  return (
    <div className="relative w-[173px] h-[162px] rounded-[12px] overflow-hidden">
      <Image src={src} alt="" fill className="object-cover" />
    </div>
  );
};

const TextTile = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="bg-white w-[173px] h-[162px] rounded-[12px] flex flex-col justify-center items-center text-center px-[16px]">
      <h3 className="text-[16px] font-semibold text-[#1C274C]">
        {title}
      </h3>
      <p className="text-[14px] text-[#1C274C]/70 mt-[6px]">
        {subtitle}
      </p>
    </div>
  );
};