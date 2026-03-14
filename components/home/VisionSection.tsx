"use client";

import Image from "next/image";

export const Vision = () => {
  return (
    <section className="bg-[#FEFEFE] py-20 md:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* TITLE */}
        <h2 className="text-display font-semibold leading-tight text-left mb-12 md:mb-16 -mt-20 bg-linear-to-b from-[#0A1344] to-[#838383] bg-clip-text text-transparent tracking-[-0.015em]">
          A new species of AI
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[5px] auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px] -mt-[30px]">

          {/* ROW 1 */}
          <Tile src="/image1.png" />

          <TextTile
            className="col-span-2 lg:col-span-2"
            title="General Intelligence"
            subtitle="for the physical world"
          />

          <Tile src="/image2.png" />
          <Tile src="/image3.png" />
          <Tile src="/image4.png" />

          {/* ROW 2 */}
          <Tile src="/image5.png" />
          <Tile src="/image6.png" />
          <Tile src="/image7.png" />
          <Tile src="/image8.png" />
          <Tile src="/image9.png" />
          <Tile src="/image10.png" />

          {/* ROW 3 */}
          <Tile src="/image111.png" />
          <Tile src="/image112.png" />

          <TextTile
            className="col-span-2 lg:col-span-2"
            title="Foundational Models"
            subtitle="for Earth"
            align="right"
            paddingRight={44}
          />

          <Tile src="/image113.png" />
          <Tile src="/image114.png" />

          {/* ROW 4 */}
          <Tile src="/image12.png" />
          <Tile src="/image.png" />
          <Tile src="/image14.png" />
          <Tile src="/image15.png" />
          <Tile src="/image16.png" />
          <Tile src="/image17.png" />
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-[28px] md:mt-[44px] flex flex-col md:flex-row items-start justify-between gap-6">

          <p className="text-sm md:text-base text-[#010101] max-w-2xl leading-[1.4]">
            ColumbusPro-1 processes satellite imagery, terrain data, human activity,
            and temporal patterns to generate actionable intelligence across real estate,
            research, and consumer domains.
          </p>

          <button className="border border-[#1C274C] px-[69px] md:px-[77px] py-[14.5px] text-xl font-bold tracking-wide rounded-none hover:bg-[#1C274C] hover:text-white transition whitespace-nowrap">
            [ See what we’re building ]
          </button>

        </div>
      </div>
    </section>
  );
};

const Tile = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
      />
    </div>
  );
};

const TextTile = ({
  title,
  subtitle,
  className = "",
  align = "center",
  paddingLeft,
  paddingRight,
}: {
  title: string;
  subtitle: string;
  className?: string;
  align?: "center" | "right";
  paddingLeft?: number;
  paddingRight?: number;
}) => {
  const alignClass = align === "right" ? "text-right" : "items-center text-center";
  const inlineStyle: React.CSSProperties = {};
  if (paddingLeft !== undefined) inlineStyle.paddingLeft = `${paddingLeft}px`;
  if (paddingRight !== undefined) inlineStyle.paddingRight = `${paddingRight}px`;
  return (
    <div
      className={`bg-white flex flex-col justify-center px-6 sm:px-8 ${alignClass} ${className}`}
      style={inlineStyle}
    >
      <h3 className="text-3xl font-medium text-[#010101] leading-[0.9] tracking-[-0.04em]">
      {title}
      </h3>
      <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#010101] mt-2 tracking-[-0.04em]">
        {subtitle}
      </p>
    </div>
  );
};