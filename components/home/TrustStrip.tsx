
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
    <section className="bg-white py-[60px] sm:py-[80px] md:py-[120px]">
      <div className="max-w-[1528px] mx-auto px-5 sm:px-10 md:px-[100px]">

        {/* HEADING */}
        <div className="text-center mb-[30px] md:mb-[50px]">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-[#1C274C] mb-[8px] md:mb-[10px]">
            Your plans <span className="text-[#1FA7A3]">are in good hands</span>
          </h2>
          <p className="text-[14px] sm:text-[16px] md:text-[18px] text-[#1C274C]/60">
            We work with data from reputable brands
          </p>
        </div>

        {/* LOGOS ROW */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:justify-between mb-[30px] md:mb-[60px] opacity-80">

          <Image src="/emoji/gmap.png" alt="Google Maps" width={140} height={40} className="w-[100px] sm:w-[120px] md:w-[140px] h-auto" />
          <Image src="/emoji/fs.png" alt="Foursquare" width={140} height={40} className="w-[100px] sm:w-[120px] md:w-[140px] h-auto" />
          <Image src="/emoji/airbnb.png" alt="Airbnb" width={120} height={40} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto" />
          <Image src="/emoji/idea.png" alt="Idealista" width={120} height={40} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto hidden sm:block" />
          <Image src="/emoji/trip.png" alt="Tripadvisor" width={140} height={40} className="w-[100px] sm:w-[120px] md:w-[140px] h-auto hidden sm:block" />
          <Image src="/emoji/fork.png" alt="TheFork" width={120} height={40} className="w-[80px] sm:w-[100px] md:w-[120px] h-auto hidden md:block" />

        </div>

        {/* FAQ TITLE */}
        <div className="mb-[16px] md:mb-[20px]">
          <h3 className="text-[14px] md:text-[16px] font-semibold text-[#1FA7A3]">
            See what people are asking
          </h3>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-[16px] md:space-y-[24px]">
          {faqs.map((question, index) => (
            <div key={index} className="pb-[14px] md:pb-[18px] border-b border-dashed border-[#DADADA]">
              <p className="text-[14px] md:text-[15px] text-[#1C274C]/85">
                {question}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
