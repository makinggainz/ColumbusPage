"use client";

import Image from "next/image";

export default function DataCatalogue() {
  return (
    <section className="w-full bg-black py-[120px] flex justify-center">
      <div className="w-full max-w-[1728px] px-6">

        {/* TITLE */}
        <h2 className="text-white text-[50px] font-semibold mb-[60px] max-md:text-[32px]">
          The most accurate data catalogue
        </h2>

        {/* MAIN GRID */}
        <div className="grid grid-cols-[360px_1fr] gap-10 items-start max-lg:grid-cols-1">

          {/* LEFT PANEL */}
          <div className="border border-gray-800 text-white flex flex-col">

            <div className="h-[312px] p-8">
                <h3 className="text-[24px] font-semibold mb-4">
                Competitive Price per POI
                </h3>

                <ul className="text-gray-400 text-[20px] space-y-1">
                <li>• Our competitors price their</li>
                <li>• more</li>
                <li>• info</li>
                <li>• goes</li>
                <li>• here</li>
                </ul>
            </div>

            <div className="h-[82px] text-[18px] border-t border-gray-800 px-6 py-5 text-gray-300">
                LGM considers wide breadth of data
            </div>

            <div className=" h-[82px] text-[18px] border-t border-gray-800 px-6 py-5 text-gray-300">
                Universal file compatibility
            </div>

            <div className="h-[82px] text-[18px] border-t border-gray-800 px-6 py-5 text-gray-300">
                Access expensive data for free
            </div>

            </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col">

            {/* TABS */}
            <div className="flex gap-6 text-gray-400 text-[15px] mb-6 overflow-x-auto">

              <button className="hover:text-white">My Data</button>
              <button className="hover:text-white">Suggested</button>
              <button className="hover:text-white">All</button>
              <button className="hover:text-white">Base Maps</button>
              <button className="hover:text-white">Overlays</button>
              <button className="hover:text-white">Packs</button>
              <button className="hover:text-white">Environmental</button>
              <button className="hover:text-white">Infrastructure</button>

              <button className="text-white font-semibold border-b border-white pb-1">
                Smart Layers
              </button>

            </div>

            {/* CARDS GRID */}
            <div className="grid grid-cols-3 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">

              {/* CARD 1 */}
              <div className="bg-white rounded-xl overflow-hidden flex flex-col">

                <div className="relative h-[296px]">
                  <Image
                    src="/use-cases/layer1.png"
                    alt="Future Appreciation Zones"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6 flex-1">

                  <h4 className="font-semibold text-[20px] mb-1">
                    Future Appreciation Zones
                  </h4>

                  <p className="text-gray-500 text-[15px] mb-2">
                    55,010 rows
                  </p>

                  <p className="text-gray-600 text-[15px]">
                    Predicts 2–5 year property value growth using migration,
                    job forecasts, and permit trends.
                  </p>

                </div>

              </div>

              {/* CARD 2 */}
              <div className="bg-white rounded-xl overflow-hidden flex flex-col">

                <div className="relative h-[296px]">
                  <Image
                    src="/use-cases/layer2.png"
                    alt="Future Turnover Hotspots"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6 flex-1">

                  <h4 className="font-semibold text-[20px] mb-1">
                    Future Turnover Hotspots
                  </h4>

                  <p className="text-gray-500 text-[15px] mb-2">
                    40,206 rows
                  </p>

                  <p className="text-gray-600 text-[15px]">
                    Predicts high-flip areas (DOM &lt;20 days) from sales
                    velocity, investor inflows, and economic cycles.
                  </p>

                </div>

              </div>

              {/* CARD 3 */}
              <div className="bg-white rounded-xl overflow-hidden flex flex-col">

                <div className="relative h-[296px]">
                  <Image
                    src="/use-cases/layer3.png"
                    alt="Future Displacement Risk Overlay"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6 flex-1">

                  <h4 className="font-semibold text-[20px] mb-1">
                    Future Displacement Risk Overlay
                  </h4>

                  <p className="text-gray-500 text-[15px] mb-2">
                    33,520 rows
                  </p>

                  <p className="text-gray-600 text-[15px]">
                    Flags areas at risk of resident displacement from rising
                    costs, affordable housing site selection.
                  </p>

                </div>

              </div>

            </div>

            {/* FOOTER CTA */}
            <div className="flex justify-end mt-6">

              <button className="text-gray-300 hover:text-white text-[14px] flex items-center gap-1">
                Learn about our data →
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}