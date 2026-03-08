import React from "react";

export default function HumanSupportSection() {
  return (
    <section className="w-full bg-[#F4F3EB]">

      {/* FRAME */}
      <div className="max-w-[1728px] mx-auto grid grid-cols-1 lg:grid-cols-[355px_1274px_99px]">

        {/* LEFT SIDEBAR */}
        <div className="bg-[#EDEAE1] px-8 pt-[94px] pb-[210px]">

          <div className="max-w-[226px]">
            <p className="text-[14px] text-[#6B7280] mb-4">
              Human Customer Support
            </p>

            <p className="text-[16px] leading-[140%] text-[#374151]">
              Work with your map through natural language inputs like if
              you're having a conversation. Our powerful technology allows
              you todo XYZ (WOWzers!)
            </p>
          </div>

        </div>


        {/* CENTER AREA */}
        <div className="pt-[74px] pb-[50px] flex justify-center px-4 lg:px-0">

          {/* WHITE CARD */}
          <div className="w-full max-w-[1274px] bg-white rounded-[10px] p-[64px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row items-center gap-[80px]">

            {/* TEXT */}
            <div className="max-w-[520px]">

              <h2 className="text-[28px] font-semibold mb-6">
                24/7 Help & Columbus Bot
              </h2>

              <ul className="space-y-3 text-[18px] text-[#333]">
                <li>• Find relevant data sets,</li>
                <li>• Show you tips to use our platform,</li>
                <li>• Connect you to a live human agent.</li>
                <li>• A human agent is available 24/7</li>
              </ul>

            </div>


            {/* IMAGE BLOCK */}
            <div className="relative w-[570px] h-[605px] rounded-[23px] overflow-hidden shadow-lg">

              <img
                src="/enterprise/humanbg.png"
                alt="Support Background"
                className="w-full h-full object-cover"
              />

              {/* INNER CHAT */}
              <div className="absolute inset-0 flex items-center justify-center">

                <img
                  src="/enterprise/bot.png"
                  alt="Bot Chat"
                  className="w-[454px] h-[499px]"
                />

              </div>

            </div>

          </div>

        </div>


        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block bg-[#EDEAE1]" />

      </div>

    </section>
  );
}