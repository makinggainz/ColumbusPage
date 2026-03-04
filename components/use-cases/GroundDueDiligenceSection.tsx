"use client";

import Image from "next/image";

export function GroundDueDiligenceSection() {
  return (
    <section className="bg-[#F2F2F2] py-20 lg:py-[140px]">
      <div className="max-w-[1728px] mx-auto px-6 lg:px-[60px] grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-[80px]">

        {/* LEFT TEXT */}
        <div>
          <h2 className="text-3xl lg:text-[38px] leading-tight">
            Ground Due
            <br />
            Diligence
          </h2>

          <p className="mt-6 text-gray-500">Columbus</p>
        </div>

        {/* MAP AREA */}
        <div>
          <div className="relative h-[420px] md:h-[560px] lg:h-[674px] rounded-[9px] overflow-hidden">
            
            <Image
              src="/use-cases/gd.png"
              alt=""
              fill
              className="object-cover"
            />

            {/* LEFT CARD */}
            <div className="absolute left-4 md:left-10 lg:left-[60px] bottom-4 md:bottom-10 lg:bottom-[60px] w-[90%] md:w-[520px] rounded-2xl overflow-hidden bg-white shadow-2xl">

              <div className="bg-[#EDEDED] p-6 md:p-8">
                <div className="text-sm text-gray-500 mb-3">
                  Columbus is thinking...
                </div>

                <ul className="text-xs md:text-sm text-gray-400 leading-relaxed space-y-1">
                  <li>Considering demographics of Miami</li>
                  <li>Considering lot prices</li>
                  <li>Considering trade area competition</li>
                  <li>Considering your client’s needs and wants</li>
                </ul>

                <p className="text-sm mt-4 leading-relaxed">
                  I have produced a Generative Parcel Due Diligence. You can see
                  the Report here.
                </p>

                <p className="text-sm mt-3 leading-relaxed">
                  Would you like me to order a on-the-ground surveying team?
                </p>
              </div>

              <div className="flex justify-between items-center px-5 py-4 border-t">
                <span>/ Full Parcel Due Diligence</span>

                <div className="w-8 h-8 rounded-lg bg-[#1F2A6B]" />
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="hidden md:block absolute right-4 lg:right-[30px] bottom-4 md:bottom-10 lg:bottom-[60px] w-[260px] lg:w-[300px] rounded-xl bg-white p-5 shadow-2xl">

              <div className="font-semibold mb-2">Selected area</div>

              <p className="text-sm text-gray-500">
                Click points on the map to measure distances and research areas.
              </p>

              <div className="mt-4 font-semibold">
                Advanced Measurements
              </div>

              <p className="text-sm">Perimeter size</p>

              <p className="text-sm text-gray-500">
                Min: 456.34 m &nbsp; Median: 356.23 m &nbsp; Max: 1345.35 m
              </p>

              <div className="mt-4 font-semibold">Listed Owners</div>

              <p className="text-sm text-gray-500">
                Janet McArthy (45)
                <br />
                Tom McArthy (52)
              </p>

              <div className="mt-4 font-semibold">Property History</div>

              <p className="text-sm text-gray-500">
                Bought Jan 2023
                <br />
                Last listed price: $345,309
              </p>

              <div className="mt-3">More data</div>
            </div>

          </div>

          {/* BOTTOM TEXT */}
          <div className="flex justify-between mt-6 text-base font-semibold">
            <span>How we do it?</span>
            <span>Other questions</span>
          </div>
        </div>

      </div>
    </section>
  );
}