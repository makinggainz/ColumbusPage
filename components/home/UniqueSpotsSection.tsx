"use client";

export const UniqueSpotsSection = () => {
  return (
    <section className="bg-white py-[120px]">
      <div className="max-w-[440px] mx-auto">

        {/* Heading */}
        <h2 className="text-center text-[22px] font-semibold text-[#0F766E] mb-[60px]">
          Unique spots people are favoriting
        </h2>

        {/* Single Card */}
        <div className="w-[462px] rounded-[11px] bg-white 
                        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                        overflow-hidden mx-auto">

          {/* Image Placeholder */}
          <div className="w-full h-[180px] bg-gray-200 relative">
            <div className="absolute top-[12px] right-[12px] 
                            w-[48px] h-[24px] 
                            bg-gray-300 rounded-[6px]" />
          </div>

          {/* Text Placeholder */}
          <div className="pt-[16px] pl-[16px] pr-[19px] pb-[19px] space-y-[10px]">

            <div className="h-[18px] w-[160px] bg-gray-300 rounded-[4px]" />
            <div className="h-[14px] w-full bg-gray-200 rounded-[4px]" />
            <div className="h-[14px] w-[80%] bg-gray-200 rounded-[4px]" />
            <div className="h-[14px] w-[120px] bg-gray-200 rounded-[4px]" />

          </div>
        </div>

      </div>
    </section>
  );
};