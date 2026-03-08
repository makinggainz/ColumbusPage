import React from "react";

export default function MapChatSection() {
  return (
    <section className="w-full bg-[#F4F3EB]">

      {/* container */}
      <div className="max-w-[1728px] mx-auto grid grid-cols-1 lg:grid-cols-[355px_1274px_99px]">

        {/* LEFT SIDEBAR */}
        <div className="bg-[#EDEAE1] px-6 md:px-8 pt-[60px] lg:pt-[94px] pb-[120px] lg:pb-[210px]">

          <div className="max-w-[226px]">
            <p className="text-[14px] text-[#6B7280] mb-4">
              Map Chat
            </p>

            <p className="text-[16px] leading-[140%] text-[#374151]">
              Work with your map through natural language inputs like if
              you're having a conversation. Our powerful technology allows
              you to do XYZ (WOWzers!)
            </p>
          </div>

          <p className="text-[14px] text-[#6B7280] mt-16 lg:mt-[489px]">
            Research Reports
          </p>

        </div>


        {/* CENTER AREA */}
        <div className="bg-[#F4F3EB] pt-12 md:pt-16 lg:pt-[74px] pb-12 md:pb-16 lg:pb-[50px] flex justify-center px-4 md:px-6">

          {/* CARD */}
          <div className="w-full max-w-[941px] lg:w-[941px] bg-white rounded-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] overflow-hidden">

            <img
              src="/enterprise/mapchat.png"
              alt="Map Chat"
              className="w-full h-auto block"
            />

          </div>

        </div>


        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block bg-[#EDEAE1]" />

      </div>

    </section>
  );
}