"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { cormorant } from "@/lib/typography";

export const Applications = () => {
  const items = [
    { title: "Residential Real Estate", image: "/UseCases/ResidentialRealEstate.jpg", href: "/applications/residential-real-estate" },
    { title: "Commercial Real Estate", image: "/UseCases/CommercialRealEstate.jpg", href: "/applications/commercial-real-estate" },
    { title: "Generative Geodata", image: "/UseCases/GenDatalayers.png", href: "/applications/generative-geodata" },
    { title: "Logistics Optimization", image: "/UseCases/Logistics.webp", href: "/applications/logistics-optimization" },
    { title: "Urban Planning", image: "/UseCases/UrbanPlanning.jpg", href: "/applications/urban-planning" },
    { title: "Site Selection", image: "/UseCases/SiteSelection.jpg", href: "/applications/site-selection" },
    { title: "Consumer Mapping", image: "/UseCases/ConsumerMapping.jpeg", href: "/applications/consumer-mapping" },
    { title: "Ground Due Diligence", image: "/UseCases/GroundDueDillegence.png", href: "/applications/ground-due-diligence" },
    { title: "More", image: "/UseCases/GeoMarketing.png", href: "/applications" },
  ];

  return (
    <section className="bg-white py-20 md:py-28 lg:py-36">
      <Container>

        {/* HEADER */}
        <div className="mb-5 md:mb-6 max-w-full">
          <h2 className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-semibold tracking-tight text-[#1C274C]`}>
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
              <Link
                key={index}
                href={item.href}
                className="relative group aspect-[16/9] w-full overflow-hidden block"
              >
                {/* IMAGE */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={index < 3}
                />

                {/* Overlay: only on hover */}
                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/60 z-10 pointer-events-none" />

                {/* TEXT — bottom, centered; 10px padding; title higher to fit Learn more below */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center z-20 px-4 pt-6 pb-2.5">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-white opacity-0 translate-y-2 
                                group-hover:opacity-100 
                                group-hover:translate-y-0 
                                group-hover:underline
                                transition-all duration-300 ease-out drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    Learn more →
                  </p>
                </div>

              </Link>
            ))}

          </div>
        </div>

      </Container>
    </section>
  );
};