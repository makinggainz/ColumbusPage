
"use client";

import Image from "next/image";

export const Vision = () => {
  return (
    <section className="bg-[#F9F9F9] py-[60px] sm:py-[100px] md:py-[140px]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 md:px-[100px] lg:px-0">
        <center>
        {/* TITLE */}
        <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-semibold text-[#1C274C] leading-[1.2] mb-[32px] md:mb-[64px]">
          Our vision of a new kind of AI
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-[8px] sm:gap-[12px] md:gap-[16px] auto-rows-[100px] sm:auto-rows-[130px] md:auto-rows-[160px]">
        {/* ROW 1 */}
          <Tile src="/image1.png" />

           <TextTile className="col-span-2"
             title="General Intelligence"
             subtitle="for the physical world"
           />

          <Tile src="/image2.png" className="hidden md:block" />
           <Tile src="/image3.png" className="hidden md:block" />
           <Tile src="/image4.png" className="hidden md:block" />

           {/* ROW 2 */}
           <Tile src="/image5.png" className="hidden md:block" />
           <Tile src="/image6.png" />
           <Tile src="/image7.png" />
           <Tile src="/image8.png" />
           <Tile src="/image9.png" className="hidden md:block" />
           <Tile src="/image10.png" className="hidden md:block" />

           {/* ROW 3 */}
           <Tile src="/image111.png" className="hidden md:block" />
           <Tile src="/image112.png" className="hidden md:block" />
           <TextTile
            className="col-span-2"
             title="Foundational Models"
             subtitle="for Earth"
           />
         <Tile src="/image113.png" className="hidden md:block" />
         <Tile src="/image114.png" className="hidden md:block" />

             {/* ROW 4 */}
           <Tile src="/image12.png" className="hidden md:block" />
          <Tile src="/image.png" className="hidden sm:block" />
         <Tile src="/image14.png" />
          <Tile src="/image15.png" />
           <Tile src="/image16.png" className="hidden sm:block" />
         <Tile src="/image17.png" className="hidden md:block" />
         
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-[32px] md:mt-[56px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <p className="text-[13px] md:text-[15px] text-[#1C274C]/70 max-w-[640px] leading-[1.6] text-left">
            ColumbusPro-1 processes satellite imagery, terrain data, human activity,
            and temporal patterns to generate actionable intelligence across real estate,
            research, and consumer domains.
          </p>

          <button className="border border-[#1C274C] px-[20px] md:px-[32px] py-[10px] md:py-[14px] text-[13px] md:text-[14px] font-medium tracking-wide rounded-md hover:bg-[#1C274C] hover:text-white transition whitespace-nowrap">
            [ See what we&apos;re building ]
          </button>

        </div>
        </center>
      </div>
    </section>
  );
};
const Tile = ({ src, className = "" }: { src: string; className?: string }) => {
  return (
    <div className={`relative w-full h-full rounded-[12px] md:rounded-[16px] overflow-hidden ${className}`}>
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
      className={`bg-white rounded-[12px] md:rounded-[16px] flex flex-col justify-center items-center text-center px-[16px] md:px-[40px] ${className}`}
    >
      <h3 className="text-[16px] sm:text-[20px] md:text-[24px] font-medium text-[#1C274C] leading-[1.3]">
        {title}
      </h3>
      <p className="text-[11px] sm:text-[12px] md:text-[14px] text-[#1C274C]/70 mt-[4px] md:mt-[6px]">
        {subtitle}
      </p>
    </div>
  );
};
