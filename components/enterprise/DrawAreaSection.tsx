"use client";

import Image from "next/image";

export default function DrawAreaSection() {
  return (
    <section className="relative w-full bg-white py-24 overflow-hidden">

      {/* Map Background */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">

        <div className="relative w-[1200px] h-[800px]">

          <Image
            src="/enterprise/dmap.png"
            alt="map"
            fill
            className="object-cover"
          />

          {/* Radial fade (figma style vignette) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,white_85%)]" />

        </div>
      </div>

      {/* Content container */}
      <div className="relative max-w-[1200px] mx-auto px-6">

        <div className="grid lg:grid-cols-2 items-center gap-12">

          {/* LEFT TEXT COLUMN */}
          <div className="max-w-[420px]">

            <h2 className="font-[Geist] font-semibold text-[28px] md:text-[36px] leading-[140%] text-[#2563EB]">
              Ask about a drawn area
            </h2>

            <p className="mt-3 text-[18px] leading-[140%] text-black">
              Draw a specific space
              <br />
              and ask
            </p>

            {/* Selected area card */}
            <div className="mt-10 w-[295px] rounded-xl bg-white border border-[#E5E7EB] shadow-lg p-4 text-[13px] leading-[140%]">

              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Selected area</span>
                <span className="text-gray-400">×</span>
              </div>

              <p className="text-gray-500 mb-3">
                Click points on the map to measure
                distances and research areas.
              </p>

              <div className="space-y-3 text-[12px]">

                <div>
                  <p className="font-medium">Advanced Measurements</p>
                  <p className="text-gray-500">
                    Perimeter size
                    <br />
                    Min: 456.34 m Median: 356.23 m
                    <br />
                    Max: 1345.35 m
                  </p>
                </div>

                <div>
                  <p className="font-medium">Listed Owners</p>
                  <p className="text-gray-500">
                    Janet McArthy (age 45)
                    <br />
                    Tom McArthy (age 52)
                  </p>
                </div>

                <div>
                  <p className="font-medium">Property History</p>
                  <p className="text-gray-500">
                    Bought Jan, 2023
                    <br />
                    Last listed price: $345,309
                  </p>
                </div>

              </div>

            </div>

            <p className="mt-10 text-[20px] leading-[140%] max-w-[380px]">
              Or access full advanced
              data about the polygon.
            </p>

          </div>

          {/* RIGHT MAP SIDE */}
          <div className="relative h-[500px]">

            {/* polygon */}
            <Image
              src="/enterprise/polygon.png"
              alt="polygon"
              width={427}
              height={362}
              className="absolute left-[60px] top-[40px]"
            />

            {/* prompt card */}
            <div className="absolute bottom-[80px] left-[80px] w-[503px] rounded-xl bg-white border border-[#E5E7EB] shadow-xl">

              <div className="px-4 py-3 text-sm text-gray-500">
                🌐 Columbus is thinking...
              </div>

              <div className="flex justify-between items-center border-t px-4 py-3">

                <span className="text-[14px]">
                  what is the jewish demographic in this area
                </span>

                <div className="w-6 h-6 rounded-md bg-[#0E1A44]" />

              </div>

            </div>

            {/* right tool buttons */}
            <div className="absolute right-0 top-[120px] flex flex-col gap-4">

              <Image src="/enterprise/tool1.png" alt="" width={36} height={36} />
              <Image src="/enterprise/tool2.png" alt="" width={36} height={36} />
              <Image src="/enterprise/tool3.png" alt="" width={36} height={36} />
              <Image src="/enterprise/tool4.png" alt="" width={44} height={38} />

            </div>

          </div>

        </div>

        {/* button */}
        <div className="flex justify-center mt-20">
          <button className="border border-black px-6 py-2 rounded-md text-[14px]">
            More use cases →
          </button>
        </div>

      </div>

    </section>
  );
}