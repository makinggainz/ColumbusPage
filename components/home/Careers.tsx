"use client";

export const Careers = () => {
  return (
    <div className="w-full flex justify-center">

      {/* 404px Frame with ash background */}
      <div className="w-[404px] bg-[#F3F3F3] px-[20px] pt-[60px] pb-[80px]">

        {/* Top Section */}
        <div className="text-center mb-[60px]">
          <h2 className="text-[28px] font-medium text-black mb-[12px]">
            Hiring Humans.
          </h2>
          <p className="text-[14px] text-black/60">
            Our team is based in Washington DC and Madrid.
          </p>
        </div>

        {/* Title */}
        <div className="mb-[20px]">
          <h3 className="text-[22px] font-semibold text-[#0A1344] mb-[16px]">
            Careers & investment queries
          </h3>

          <p className="text-[14px] text-black/60 leading-[160%]">
            If you're excited about creating paradigm shifts in physical world
            understanding. Join us now.
          </p>
        </div>

        {/* Divider */}
        <div className="border-b border-black/10 mb-[40px]" />

        {/* Form */}
        <form className="space-y-[36px]">

          <input
            type="text"
            placeholder="Name"
            className="w-full bg-transparent border-b border-black/20
                       pb-[12px] text-[14px] outline-none
                       placeholder:text-black/40"
          />

          <textarea
            placeholder="Message"
            rows={2}
            className="w-full bg-transparent border-b border-black/20
                       pb-[12px] text-[14px] outline-none resize-none
                       placeholder:text-black/40"
          />

          <input
            type="email"
            placeholder="Enter email"
            className="w-full bg-transparent border-b border-black/20
                       pb-[12px] text-[14px] outline-none
                       placeholder:text-black/40"
          />

        </form>

        <p className="mt-[40px] text-[13px] text-black/50">
          We accept interns.
        </p>

      </div>

    </div>
  );
};