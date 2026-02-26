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
    <div className="w-full flex justify-center bg-[#F4F4F4]">

      {/* 404 FRAME */}
      <div className="w-[404px] bg-[#F4F4F4] flex justify-center">

        {/* INNER WHITE SECTION (392px from screenshot) */}
        <div className="w-[392px] bg-white px-[20px] pt-[32px] pb-[40px]">

          {/* HEADING */}
          <h2 className="text-[18px] font-semibold text-[#1C274C] mb-[6px]">
            You’re plans <span className="text-[#1FA7A3]">are in good hands</span>
          </h2>

          <p className="text-[14px] text-[#1C274C]/60 mb-[24px]">
            We work with data from reputable brands
          </p>

          {/* LOGOS STACKED (NOT ROW) */}
          <div className="space-y-[16px] mb-[30px] opacity-90">

            <Image src="/emoji/gmap.png" alt="Google Maps" width={130} height={36} />
            <Image src="/emoji/trip.png" alt="Tripadvisor" width={130} height={36} />
            <Image src="/emoji/fs.png" alt="Foursquare" width={130} height={36} />
            <Image src="/emoji/airbnb.png" alt="Airbnb" width={110} height={36} />
            <Image src="/emoji/fork.png" alt="TheFork" width={120} height={36} />
            <Image src="/emoji/idea.png" alt="Idealista" width={120} height={36} />

          </div>

          {/* FAQ TITLE */}
          <h3 className="text-[14px] font-semibold text-[#1FA7A3] mb-[16px]">
            See what people are asking
          </h3>

          {/* FAQ LIST */}
          <div>
            {faqs.map((question, index) => (
              <div
                key={index}
                className="py-[14px] border-b border-dashed border-[#DADADA]"
              >
                <p className="text-[14px] text-[#1C274C] leading-[20px]">
                  {question}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};