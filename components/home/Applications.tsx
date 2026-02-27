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
    <section className="bg-white py-20 md:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* HEADER */}
        <div className="mb-12 md:mb-16 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-semibold tracking-tight text-[#1C274C]">
            We’re actively exploring various application areas
          </h2>

          <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-[#1C274C]/70">
            We’d love to work within your industry, send us a hey@columbus.earth
          </p>
        </div>

        {/* RESPONSIVE GRID */}
        <div className="overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

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

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/40 transition duration-300 group-hover:bg-black/60 z-10" />

                {/* TEXT */}
                <div className="absolute inset-0 flex items-center justify-center text-center z-20 px-4">
                  <div className="text-white">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm opacity-0 translate-y-2 
                                  group-hover:opacity-100 
                                  group-hover:translate-y-0 
                                  transition-all duration-300 ease-out">
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