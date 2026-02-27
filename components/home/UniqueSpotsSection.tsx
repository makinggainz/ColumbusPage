

"use client";

export const UniqueSpotsSection = () => {
  const spots = Array(5).fill(null);

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-[120px] overflow-hidden px-4 sm:px-6">
      <div className="max-w-[1528px] mx-auto">

        <h2 className="text-center text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-[#0F766E] mb-8 sm:mb-12 md:mb-[60px]">
          Unique spots people are favoriting
        </h2>

        <div className="relative overflow-x-auto overflow-y-hidden pb-4 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">

          <div className="flex gap-4 sm:gap-6 md:gap-[32px] w-max md:w-auto md:justify-center md:-ml-[231px]">

            {spots.map((_, i) => (
              <div
                key={i}
                className="w-[280px] sm:w-[340px] md:w-[462px] flex-shrink-0 rounded-[8px] sm:rounded-[11px] bg-white
                           shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                           flex-shrink-0 overflow-hidden"
              >
                {/* IMAGE PLACEHOLDER */}
                <div className="w-full h-[180px] bg-gray-200 relative">
                  {/* Rating placeholder */}
                  <div className="absolute top-[12px] right-[12px] 
                                  w-[48px] h-[24px] 
                                  bg-gray-300 rounded-[6px]" />
                </div>

                {/* TEXT PLACEHOLDER BLOCK */}
                <div className="pt-[16px] pl-[16px] pr-[19px] pb-[19px] space-y-[10px]">

                  {/* Title */}
                  <div className="h-[18px] w-[160px] bg-gray-300 rounded-[4px]" />

                  {/* Description line 1 */}
                  <div className="h-[14px] w-full bg-gray-200 rounded-[4px]" />

                  {/* Description line 2 */}
                  <div className="h-[14px] w-[80%] bg-gray-200 rounded-[4px]" />

                  {/* Location */}
                  <div className="h-[14px] w-[120px] bg-gray-200 rounded-[4px]" />

                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
};