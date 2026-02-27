"use client";

import Image from "next/image";

export const Vision = () => {
  return (
    <section className="bg-[#F9F9F9] py-20 md:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* TITLE */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1C274C] leading-tight text-center mb-12 md:mb-16">
          Our vision of a new kind of AI
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px]">

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
        <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          <p className="text-sm md:text-base text-[#1C274C]/70 max-w-2xl leading-relaxed">
            ColumbusPro-1 processes satellite imagery, terrain data, human activity,
            and temporal patterns to generate actionable intelligence across real estate,
            research, and consumer domains.
          </p>

          <button className="border border-[#1C274C] px-6 md:px-8 py-3 text-sm font-medium tracking-wide rounded-md hover:bg-[#1C274C] hover:text-white transition whitespace-nowrap">
            [ See what we’re building ]
          </button>

        </div>
      </div>
    </section>
  );
};

const Tile = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
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
}: {
  title: string;
  subtitle: string;
  className?: string;
}) => {
  return (
    <div
      className={`bg-white rounded-2xl flex flex-col justify-center items-center text-center px-6 sm:px-8 ${className}`}
    >
      <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-[#1C274C] leading-snug">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#1C274C]/70 mt-2">
        {subtitle}
      </p>
    </div>
  );
};