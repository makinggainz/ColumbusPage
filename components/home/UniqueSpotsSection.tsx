


"use client";

export const UniqueSpotsSection = () => {
  const spots = Array(5).fill(null);

  return (
    <section className="bg-white py-[60px] sm:py-[80px] md:py-[120px] overflow-hidden">
      <div className="max-w-[1528px] mx-auto px-5 sm:px-10 md:px-0">

        <h2 className="text-center text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-[#0F766E] mb-[30px] md:mb-[60px]">
          Unique spots people are favoriting
        </h2>

        <div className="relative overflow-hidden">

          <div className="flex gap-[16px] sm:gap-[24px] md:gap-[32px] w-max md:-ml-[231px] overflow-x-auto pb-4">

            {spots.map((_, i) => (
              <div
                key={i}
                className="w-[280px] sm:w-[340px] md:w-[462px] rounded-[11px] bg-white
                           shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                           flex-shrink-0 overflow-hidden"
              >
                {/* IMAGE PLACEHOLDER */}
                <div className="w-full h-[120px] sm:h-[150px] md:h-[180px] bg-gray-200 relative">
                  {/* Rating placeholder */}
                  <div className="absolute top-[12px] right-[12px] 
                                  w-[48px] h-[24px] 
                                  bg-gray-300 rounded-[6px]" />
                </div>

                {/* TEXT PLACEHOLDER BLOCK */}
                <div className="pt-[12px] md:pt-[16px] pl-[12px] md:pl-[16px] pr-[14px] md:pr-[19px] pb-[14px] md:pb-[19px] space-y-[8px] md:space-y-[10px]">

                  {/* Title */}
                  <div className="h-[16px] md:h-[18px] w-[140px] md:w-[160px] bg-gray-300 rounded-[4px]" />

                  {/* Description line 1 */}
                  <div className="h-[12px] md:h-[14px] w-full bg-gray-200 rounded-[4px]" />

                  {/* Description line 2 */}
                  <div className="h-[12px] md:h-[14px] w-[80%] bg-gray-200 rounded-[4px]" />

                  {/* Location */}
                  <div className="h-[12px] md:h-[14px] w-[100px] md:w-[120px] bg-gray-200 rounded-[4px]" />

                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
};
