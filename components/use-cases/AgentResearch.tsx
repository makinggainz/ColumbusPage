"use client";

import Image from "next/image";

export default function AgenticResearch() {
  return (
    <section className="w-full bg-black py-[120px] flex justify-center">
      <div className="w-full max-w-[1728px] px-6">

        {/* TITLE */}
        <h2 className="text-white text-[32px] font-semibold mb-[60px]">
          Agentic geospatial research
        </h2>

        {/* MAIN GRID */}
        <div className="grid grid-cols-[360px_320px_1fr] gap-8 max-xl:grid-cols-1">

          {/* LEFT MENU */}
          <div className="border border-gray-800 text-white flex flex-col">

            <div className="h-[435px] p-6 border-b border-gray-800">
              <h3 className="text-[24px] font-semibold mb-2">
                Research
              </h3>

              <p className="text-gray-400 text-[16px]">
                Research section
              </p>
            </div>

            <div className="px-6 py-5 border-b border-gray-800 text-gray-300">
              Automated audits & due diligence
            </div>

            <div className="px-6 py-5 text-gray-300">
              Easy Regulatory compliance
            </div>

          </div>

          {/* TEMPLATE CARDS */}
          <div className="flex flex-col gap-4">

            <p className="text-gray-400 text-[13px] mb-2">
              Templates
            </p>

            {/* CARD */}
            <div className="h-[151px] bg-[#2a2a2a] rounded-xl p-5 text-white">
              <h4 className="text-[20px]font-semibold mb-2">
                General Report
              </h4>

              <p className="text-[16px] text-gray-300">
                A general review of the parcel,
                considering key variables in construction
              </p>
            </div>

            {/* CARD */}
            <div className="h-[151px] bg-[#2a2a2a] rounded-xl p-5 text-white">
              <h4 className="text-[20px] font-semibold mb-2">
                Geotech/soils report
              </h4>

              <p className="text-[16px] text-gray-300">
                Report for bearing capacity,
                groundwater, rock, slope stability
              </p>
            </div>

            {/* CARD */}
            <div className="h-[151px] bg-[#2a2a2a] rounded-xl p-5 text-white">
              <h4 className="text-[20px] font-semibold mb-2">
                General Geological study
              </h4>

              <p className="text-[16px] text-gray-300">
                Wetlands/flood, stormwater,
                heritage/trees and other constraints
              </p>
            </div>
            <div className="relative bg-[#2a2a2a] rounded-[14px] p-5 text-white w-full max-xl:w-full overflow-hidden">

            <h4 className="font-semibold text-[15px]">
              Advanced Geological study
            </h4>

            {/* Fade effect like figma */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 pointer-events-none" />

          </div>

          </div>

          {/* REPORT PANEL */}
          <div className="bg-white rounded-2xl p-8">

            <p className="text-gray-500 text-[13px] mb-4">
              🌐 Report Produced by Columbus
            </p>

            <h3 className="text-[22px] font-semibold text-[#1f2b5c] mb-4">
              Greenfield Minnesota Copper Porphyrrs
            </h3>

            <p className="text-gray-600 text-[14px] leading-relaxed mb-6">
              A discrete subsurface density anomaly located in central Kansas has been
              identified as a high-priority exploration target for copper and associated
              sulfide mineralization. The target exhibits elevated rock density values
              relative to surrounding formations and aligns with regional structural
              features interpreted as potential pathways for mineralizing fluids.
            </p>

            {/* MAP IMAGE */}
            <div className="relative w-full h-[220px] rounded-xl overflow-hidden mb-4">

              <Image
                src="/use-cases/gmap.png"
                alt="Map"
                fill
                className="object-cover"
              />

              <button className="absolute top-4 left-4 bg-white text-black text-[13px] px-4 py-2 rounded-lg shadow">
                Interact with me
              </button>

            </div>

            {/* INPUT AREA */}
            <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">

              <p className="text-gray-400 text-[13px]">
                Input a list of parcels (parcel ID, address, coordinates)
              </p>

              <div className="flex gap-2">

                <button className="bg-gray-200 text-black text-[13px] px-3 py-2 rounded-md">
                  Upload File
                </button>

                <button className="bg-gray-200 text-black text-[13px] px-3 py-2 rounded-md">
                  Select on map
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}