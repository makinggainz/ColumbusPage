"use client";

import Image from "next/image";

export function LogisticsSection() {
  return (
    <section className="bg-[#F2F2F2] py-20 lg:py-[140px]">

      <div className="max-w-[1728px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-[80px] px-6 lg:px-[60px]">

        {/* LEFT TEXT */}
        <div className="max-w-full lg:max-w-[260px]">

          <h2 className="text-3xl lg:text-[38px] leading-tight font-medium">
            Logistics
            <br />
            optimization
          </h2>

          <p className="mt-6 text-base text-[#6B7280] leading-relaxed">
            Columbus considers the weather, traffic patterns,
            road quality, regulations, rest-stops, service stops,
            driver-safety and vehicle type and its performance
            under mentioned conditions.
          </p>

          <p className="mt-5 text-base text-[#6B7280] leading-relaxed">
            to create optimized smart itineraries, including for:
          </p>

          <ul className="mt-3 text-[#6B7280] text-base leading-relaxed space-y-1">
            <li>• Multi-courier</li>
            <li>• Multi-route</li>
            <li>• Multi-transport</li>
          </ul>

        </div>

        {/* MAP SECTION */}
        <div className="lg:pr-[80px]">

          <div className="relative h-[420px] md:h-[520px] lg:h-[674px] rounded-[9px] overflow-hidden">

            <Image
              src="/use-cases/logs.png"
              alt="logistics map"
              fill
              className="object-cover"
            />

            {/* AI CARD */}
            <div className="absolute bottom-4 md:bottom-10 lg:bottom-[60px] right-4 md:right-10 lg:right-[80px] w-[92%] md:w-[507px] md:h-[400px] rounded-[24px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]">

              {/* TOP THINKING SECTION */}
              <div className="bg-[#EDEDED] md:h-[70%] p-6 md:p-10">

                <div className="text-[#6B7280] mb-4 text-sm md:text-base">
                  Columbus is thinking...
                </div>

                <ul className="space-y-2 md:space-y-3 text-[#9CA3AF] text-sm md:text-[15px]">
                  <li>Considering traffic regulations</li>
                  <li>Considering traffic patterns</li>
                  <li>Considering stop points, potential parking issues</li>
                  <li>Considering driver happiness</li>
                </ul>

              </div>

              {/* PROMPT SECTION */}
              <div className="bg-white md:h-[30%] p-5 md:p-7 flex justify-between items-center gap-4">

                <div>

                  <div className="inline-block text-xs md:text-[13px] border border-gray-300 px-3 py-1 rounded-full mb-2">
                    Freight_itinerary
                  </div>

                  <p className="text-sm md:text-[15px] text-[#111827] leading-relaxed max-w-[420px]">
                    Generate the fastest route for next Tuesday
                    10am. It’ll be a multi-stop route through
                    Philadelphia. I’ve attached a file with vehicle
                    type and each location.
                  </p>

                </div>

                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#1F2A6B] rounded-lg" />

              </div>

            </div>

          </div>

          {/* BOTTOM TEXT */}
          <div className="flex flex-col md:flex-row md:justify-between mt-6 text-base font-semibold gap-3">

            <span>
              How we do it? What / Where do data we collect, verified
            </span>

            <span>
              Insert text: Marketing towards this specific person
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}