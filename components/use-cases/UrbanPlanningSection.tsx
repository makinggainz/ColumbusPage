"use client";

import Image from "next/image";

export function UrbanPlanningSection() {
  return (
    <section className="bg-[#F2F2F2] py-20 lg:py-[140px]">

      <div className="max-w-[1728px] mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-[80px] px-6 lg:px-[60px]">

        {/* LEFT TEXT */}
        <div>

          <h2 className="text-3xl lg:text-[38px] leading-tight font-medium">
            Urban Planning <br />
            & Infrastructure
          </h2>

          <p className="mt-6 text-base text-[#6B7280]">
            Columbus
          </p>

        </div>


        {/* MAP AREA */}
        <div className="relative h-[420px] md:h-[520px] lg:h-[674px] rounded-[9px] overflow-hidden">

          <Image
            src="/use-cases/urban.png"
            alt="urban planning"
            fill
            className="object-cover"
          />

          {/* AI CARD */}
          <div className="absolute left-4 md:left-10 lg:left-[80px] bottom-4 md:bottom-10 lg:bottom-[60px] w-[92%] md:w-[520px] rounded-[24px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)] bg-white">

            {/* TOP GREY */}
            <div className="bg-[#EDEDED] p-6 md:p-8">

              <p className="text-[#6B7280] mb-3 text-sm">
                Columbus is thinking...
              </p>

              <ul className="space-y-2 text-[#9CA3AF] text-sm">
                <li>Considering demographics of Miami</li>
                <li>Considering lot prices</li>
                <li>Considering trade area competition</li>
                <li>Considering your customer target</li>
              </ul>

              <p className="text-sm mt-4 text-[#111827] leading-relaxed">
                These areas marked have streets that often have had crashes.
                There is poor road signal trafficking. Consumers’ have expressed
                dissatisfaction with this section.
              </p>

              <p className="text-sm mt-3 text-[#111827] leading-relaxed">
                Would you like to order a specific dataset and survey?
                Our partner agents will be dispatched for the study.
              </p>

            </div>


            {/* QUESTION AREA */}
            <div className="p-4 md:p-5 flex justify-between items-center gap-4">

              <p className="text-sm md:text-[15px] max-w-[360px]">
                Where should the Transportation authority
                install a new road-signal for traffic?
              </p>

              <div className="w-8 h-8 md:w-9 md:h-9 bg-[#1F2A6B] rounded-lg" />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}