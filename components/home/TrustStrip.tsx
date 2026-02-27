
"use client";

import Image from "next/image";

export const TrustStrip = () => {
  const faqs = [
    "How were the samples in the video and website generated?",
    "How does dialogue generation work?",
    "Is this available over API?",
    "What audio tags are supported?",
    "What languages does it support?",
  ];

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-[120px] px-4 sm:px-6 md:px-12 lg:px-[100px]">
      <div className="max-w-[1528px] mx-auto">

        {/* HEADING */}
        <div className="text-center mb-8 sm:mb-10 md:mb-[50px]">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-[#1C274C] mb-2 sm:mb-[10px]">
            You’re plans <span className="text-[#1FA7A3]">are in good hands</span>
          </h2>
          <p className="text-[14px] sm:text-[16px] md:text-[18px] text-[#1C274C]/60">
            We work with data from reputable brands
          </p>
        </div>

        {/* LOGOS ROW */}
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 sm:gap-4 mb-10 sm:mb-12 md:mb-[60px] opacity-80">
          <Image src="/emoji/gmap.png" alt="Google Maps" width={120} height={34} className="w-[90px] sm:w-[110px] md:w-[140px] h-auto" />
          <Image src="/emoji/fs.png" alt="Foursquare" width={120} height={34} className="w-[90px] sm:w-[110px] md:w-[140px] h-auto" />
          <Image src="/emoji/airbnb.png" alt="Airbnb" width={100} height={34} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto" />
          <Image src="/emoji/idea.png" alt="Idealista" width={100} height={34} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto" />
          <Image src="/emoji/trip.png" alt="Tripadvisor" width={120} height={34} className="w-[90px] sm:w-[110px] md:w-[140px] h-auto" />
          <Image src="/emoji/fork.png" alt="TheFork" width={100} height={34} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto" />
        </div>

        {/* FAQ TITLE */}
        <div className="mb-4 sm:mb-[20px]">
          <h3 className="text-[14px] sm:text-[16px] font-semibold text-[#1FA7A3]">
            See what people are asking
          </h3>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-4 sm:space-y-6 md:space-y-[24px]">
          {faqs.map((question, index) => (
            <div key={index} className="pb-4 sm:pb-[18px] border-b border-dashed border-[#DADADA]">
              <p className="text-[13px] sm:text-[15px] text-[#1C274C]/85">
                {question}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};