
"use client";

import Image from "next/image";

export const Applications = () => {
  const items = [
    { title: "Residential Real Estate", image: "/apps/1.jpg" },
    { title: "Commercial Real Estate", image: "/apps/2.jpg" },
    { title: "Generative Geodata", image: "/apps/3.jpg" },
    { title: "Logistics Optimization", image: "/apps/4.jpg" },
    { title: "Urban Planning", image: "/apps/5.jpg" },
    { title: "Site Selection", image: "/apps/6.jpg" },
    { title: "Consumer Mapping", image: "/apps/7.jpg" },
    { title: "Ground Due Diligence", image: "/apps/8.jpg" },
    { title: "More", image: "/apps/9.jpg" },
  ];

  return (
    <section className="bg-white py-[60px] sm:py-[100px] md:py-[160px]">
      <div className="max-w-[1731px] mx-auto px-5 sm:px-10 md:px-[100px]">

        {/* HEADER */}
        <div className="mb-[40px] md:mb-[80px]">
          <h2 className="text-[28px] sm:text-[40px] md:text-[56px] leading-[120%] font-semibold tracking-[-0.02em] text-[#1C274C]">
            We&apos;re actively exploring various application areas
          </h2>
          <p className="mt-[12px] md:mt-[20px] text-[14px] sm:text-[16px] md:text-[18px] text-[#1C274C]/70">
            We&apos;d love to work within your industry, send us a hey@columbus.earth
          </p>
        </div>

        {/* COLLAGE GRID */}
        <div className="overflow-hidden rounded-[16px] md:rounded-[24px]">
          <div className="grid grid-cols-2 sm:grid-cols-3">

            {items.map((item, index) => (
              <button
                key={index}
                className="relative group aspect-[16/9] w-full overflow-hidden"
              >
                {/* IMAGE */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={index < 3}
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/40 transition duration-300 group-hover:bg-black/60 z-10" />

                {/* TEXT LAYER */}
                <div className="absolute inset-0 flex items-center justify-center text-center z-20 px-3 md:px-4">
                  <div className="text-white">
                    
                    {/* TITLE (Always Visible) */}
                    <h3 className="text-[14px] sm:text-[17px] md:text-[20px] font-semibold">
                      {item.title}
                    </h3>

                    {/* LEARN MORE (Hover Only) */}
                    <p className="mt-2 md:mt-3 text-[12px] md:text-[14px] opacity-0 translate-y-2 
                                  group-hover:opacity-100 
                                  group-hover:translate-y-0 
                                  transition-all duration-300 ease-out hidden sm:block">
                      Learn more →
                    </p>

                  </div>
                </div>

              </button>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
};
