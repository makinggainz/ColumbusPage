"use client";

import Image from "next/image";

export function SiteSelectionSection() {
  return (
    <section className="bg-[#F2F2F2] py-20 lg:py-[140px]">

      <div className="max-w-[1728px] mx-auto px-6 lg:px-[60px] grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-[80px]">

        {/* LEFT TEXT */}
        <div>
          <h2 className="text-3xl lg:text-[38px] leading-tight">
            Site Selection
          </h2>

          <p className="mt-6 text-[#7A7A7A]">
            Columbus
          </p>
        </div>

        {/* MAP */}
        <div>

          <div className="relative w-full h-[420px] md:h-[520px] lg:h-[674px] rounded-[12px] overflow-hidden">

            <Image
              src="/use-cases/onsite.png"
              alt="site map"
              fill
              className="object-cover"
            />

            {/* AI CARD */}
            <div className="absolute left-4 md:left-10 lg:left-[60px] bottom-4 md:bottom-10 lg:bottom-[60px] w-[92%] md:w-[507px] rounded-[20px] overflow-hidden bg-white shadow-[0_30px_80px_rgba(0,0,0,0.15)]">

              <div className="bg-[#ECECEC] p-6 md:p-8">

                <p className="text-sm text-gray-500 mb-3">
                  Columbus is thinking...
                </p>

                <ul className="text-sm text-gray-400 leading-relaxed space-y-1">
                  <li>Considering demographics of Miami</li>
                  <li>Considering lot prices</li>
                  <li>Considering trade area competition</li>
                  <li>Considering your customer target</li>
                </ul>

              </div>

              <div className="p-5 md:p-6 flex justify-between gap-4">

                <p className="text-sm leading-relaxed">
                  Where best to open a new branch of my business. We're a local
                  family owned car wash and would like to expand to another
                  state.
                </p>

                <div className="w-8 h-8 rounded-md bg-[#1F2A6B]" />

              </div>

            </div>

          </div>

          <div className="flex justify-between mt-6 font-semibold">
            <span>How we do it?</span>
            <span>Other questions</span>
          </div>

        </div>

      </div>

    </section>
  );
}