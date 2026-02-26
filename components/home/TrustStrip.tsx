
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
    <section className="bg-white py-[120px]">
      <div className="max-w-[1528px] mx-auto px-[100px]">

        {/* HEADING */}
        <div className="text-center mb-[50px]">
          <h2 className="text-[32px] font-semibold text-[#1C274C] mb-[10px]">
            You’re plans <span className="text-[#1FA7A3]">are in good hands</span>
          </h2>
          <p className="text-[18px] text-[#1C274C]/60">
            We work with data from reputable brands
          </p>
        </div>

        {/* LOGOS ROW */}
        <div className="flex items-center justify-between mb-[60px] opacity-80">

          <Image src="/emoji/gmap.png" alt="Google Maps" width={140} height={40} />
          <Image src="/emoji/fs.png" alt="Foursquare" width={140} height={40} />
          <Image src="/emoji/airbnb.png" alt="Airbnb" width={120} height={40} />
          <Image src="/emoji/idea.png" alt="Idealista" width={120} height={40} />
          <Image src="/emoji/trip.png" alt="Tripadvisor" width={140} height={40} />
          <Image src="/emoji/fork.png" alt="TheFork" width={120} height={40} />

        </div>

        {/* FAQ TITLE */}
        <div className="mb-[20px]">
          <h3 className="text-[16px] font-semibold text-[#1FA7A3]">
            See what people are asking
          </h3>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-[24px]">
          {faqs.map((question, index) => (
            <div key={index} className="pb-[18px] border-b border-dashed border-[#DADADA]">
              <p className="text-[15px] text-[#1C274C]/85">
                {question}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};