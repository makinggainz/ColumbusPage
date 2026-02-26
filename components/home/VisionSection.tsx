
"use client";

import Image from "next/image";

export const Vision = () => {
  return (
    <section className="bg-[#F9F9F9] py-[140px]">
      <div className="max-w-[1200px] mx-auto">
        <center>
        {/* TITLE */}
        <h2 className="text-[48px] font-semibold text-[#1C274C] leading-[1.2] mb-[64px]">
          Our vision of a new kind of AI
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-6 gap-[16px] auto-rows-[160px]">
        {/* ROW 1 */}
          <Tile src="/image1.png" />

           <TextTile className ="col-span-2 col-start-2"
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
            className="col-span-2 col-start-3"
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
        <div className="mt-[56px] flex items-center justify-between">

          <p className="text-[15px] text-[#1C274C]/70 max-w-[640px] leading-[1.6]">
            ColumbusPro-1 processes satellite imagery, terrain data, human activity,
            and temporal patterns to generate actionable intelligence across real estate,
            research, and consumer domains.
          </p>

          <button className="border border-[#1C274C] px-[32px] py-[14px] text-[14px] font-medium tracking-wide rounded-md hover:bg-[#1C274C] hover:text-white transition">
            [ See what we’re building ]
          </button>

        </div>
        </center>
      </div>
    </section>
  );
};
const Tile = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full h-full rounded-[16px] overflow-hidden">
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
      className={`bg-white rounded-[16px] flex flex-col justify-center items-center text-center px-[40px] ${className}`}
    >
      <h3 className="text-[24px] font-medium text-[#1C274C] leading-[1.3]">
        {title}
      </h3>
      <p className="text-[14px] text-[#1C274C]/70 mt-[6px]">
        {subtitle}
      </p>
    </div>
  );
};