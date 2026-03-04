"use client";

import Image from "next/image";

export function CaseIntroSection() {
  const items = [
    { title: "Residential Real Estate", image: "/use-cases/res.png" },
    { title: "Commercial Real Estate", image: "/use-cases/com.png" },
    { title: "Generative Geodata", image: "/use-cases/gen.png" },
    { title: "Logistics Optimization", image: "/use-cases/log.png" },
    { title: "Urban Planning", image: "/use-cases/ub.png" },
    { title: "Site Selection", image: "/use-cases/site.png" },
    { title: "Consumer Mapping", image: "/use-cases/urb.png" },
    { title: "Ground Due Diligence", image: "/use-cases/due.png" },
    { title: "Geomarketing", image: "/use-cases/geo.png" },
  ];

  return (
    <section className="w-full max-w-[1728px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

      {items.map((item, index) => (
        <div
          key={index}
          className="relative h-[260px] sm:h-[320px] md:h-[360px] lg:h-[413px] overflow-hidden"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Title */}
          <div className="absolute bottom-6 left-6 text-white text-lg md:text-xl font-medium">
            {item.title}
          </div>

          {/* Arrow */}
          <div className="absolute bottom-6 right-6 text-white text-lg md:text-xl">
            ↓
          </div>
        </div>
      ))}

    </section>
  );
}