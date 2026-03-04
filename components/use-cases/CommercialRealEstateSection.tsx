"use client";

import Image from "next/image";

const Pin = ({ top, left }: { top: string; left: string }) => (
  <Image
    src="/use-cases/pins.png"
    alt="pin"
    width={62}
    height={87}
    className="absolute"
    style={{ top, left }}
  />
);

export function CommercialRealEstateSection() {
  return (
    <section className="bg-[#F2F2F2] py-20 lg:py-[140px]">
      <div className="max-w-[1728px] mx-auto px-6 lg:px-[60px] grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-[80px]">

        {/* LEFT TEXT */}
        <div>
          <h2 className="text-3xl lg:text-[38px] leading-tight">
            Commercial
            <br />
            Real Estate
          </h2>

          <p className="mt-6 text-[#7A7A7A] text-base">
            Columbus
          </p>
        </div>

        {/* MAP AREA */}
        <div>

          <div className="relative h-[420px] md:h-[520px] lg:h-[674px] rounded-xl overflow-hidden">

            <Image
              src="/use-cases/comm.png"
              alt="map"
              fill
              className="object-cover"
            />

            {/* PINS */}
            <Pin top="28%" left="68%" />
            <Pin top="32%" left="63%" />
            <Pin top="38%" left="55%" />
            <Pin top="45%" left="60%" />
            <Pin top="48%" left="66%" />
            <Pin top="52%" left="70%" />
            <Pin top="40%" left="72%" />
            <Pin top="50%" left="74%" />

            {/* AI CARD */}
            <div className="absolute left-4 md:left-10 lg:left-[60px] bottom-4 md:bottom-10 lg:bottom-[60px] w-[92%] md:w-[507px] rounded-[20px] overflow-hidden bg-white shadow-2xl">

              {/* TOP AREA */}
              <div className="bg-[#ECECEC] p-6 md:p-8">

                <p className="text-sm text-gray-500">
                  Columbus is thinking...
                </p>

                <ul className="text-sm text-gray-400 mt-3 leading-relaxed space-y-1">
                  <li>Considering demographics of Miami</li>
                  <li>Considering lot prices</li>
                  <li>Considering trade area competition</li>
                  <li>Considering your client’s needs and wants</li>
                </ul>

                <p className="mt-4 text-sm leading-relaxed">
                  Would you like these options in a Report version? Including
                  tenant leasing options or land purchase information?
                </p>

              </div>

              {/* BOTTOM PROMPT */}
              <div className="p-5 md:p-6 flex gap-4">

                <div className="flex-1">

                  <div className="text-xs border border-gray-200 px-3 py-1 rounded-full inline-block mb-3">
                    PrivateEquityClientNeeds
                  </div>

                  <p className="text-sm leading-relaxed">
                    My client wants to develop a multi-use facility in a suburb
                    of Washington DC. The facility would house tenants detailed
                    in the attached file. Show me some good spots and filter by
                    cheaper than $2,000/square foot.
                  </p>

                </div>

                <div className="w-8 h-8 rounded-md bg-[#1F2A6B]" />

              </div>

            </div>

          </div>

          {/* BOTTOM LINKS */}
          <div className="flex justify-between mt-6 font-semibold">
            <span>How we do it?</span>
            <span>Other questions</span>
          </div>

        </div>

      </div>
    </section>
  );
}