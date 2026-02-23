

"use client";

export const UniqueSpotsSection = () => {
  const spots = Array(5).fill(null);

  return (
    <section className="bg-white py-[120px] overflow-hidden">
      <div className="max-w-[1528px] mx-auto">

        <h2 className="text-center text-[32px] font-semibold text-[#0F766E] mb-[60px]">
          Unique spots people are favoriting
        </h2>

        <div className="relative overflow-hidden">

          {/* shift left half width (462/2 = 231) */}
          <div className="flex gap-[32px] w-max -ml-[231px]">

            {spots.map((_, i) => (
              <div
                key={i}
                className="w-[462px] rounded-[11px] bg-white
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