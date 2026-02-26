"use client";

import Image from "next/image";

export const Applications = () => {
  const items = [
    { title: "Residential Real Estate", image: "/apps/1.jpg" },
    { title: "Logistics Optimization", image: "/apps/4.jpg" },
    { title: "Consumer Mapping", image: "/apps/7.jpg" },
    { title: "Ground Due Diligence", image: "/apps/8.jpg" },
    { title: "Site Selection", image: "/apps/6.jpg" },
  ];

  return (
    <div className="w-full flex justify-center bg-white">

      {/* 402px Frame */}
      <div className="w-[402px]">

        {/* Header */}
        <div className="px-[20px] pt-[24px] pb-[24px]">
          <h2 className="text-[20px] leading-[130%] font-semibold text-[#1C274C] mb-[10px]">
            We’re actively exploring various application areas
          </h2>

          <p className="text-[14px] text-[#1C274C]/70">
            We’d love to work within your industry — hey@columbus.earth
          </p>
        </div>

        {/* Cards */}
                  <div className="pb-[40px]">

            {items.map((item, index) => (
              <div
                key={index}
                className="relative w-[362px] h-[245px] 
                          mx-auto rounded-[16px] 
                          overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />

                <div className="absolute inset-0 bg-black/35" />

                <div className="absolute bottom-[18px] left-[18px]">
                  <h3 className="text-white text-[16px] font-semibold">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}

          </div>

      </div>  
    </div>
  );
};