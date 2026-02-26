

"use client";

export const Careers = () => {
  return (
    <section className="bg-[#F3F3F3] min-h-screen flex items-center">
      <div className="w-full max-w-[1600px] mx-auto px-[100px]">

        {/* TOP CENTER */}
        <div className="text-center mb-[120px]">
          <h2 className="text-[40px] font-medium text-black mb-[14px]">
            Hiring Humans.
          </h2>
          <p className="text-[16px] text-black/60">
            Our team is based in Washington DC and Madrid.
          </p>
        </div>

        {/* TITLE ROW (JUSTIFIED) */}
        <div className="flex justify-between items-start mb-[40px]">
          <h3 className="text-[38px] font-medium text-[#0A1344]">
            Careers & investment queries
          </h3>

          <p className="max-w-[420px] text-[15px] text-black/60 leading-[160%] text-right">
            If you're excited about creating paradigm shifts in physical world
            understanding. Join us now.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="border-b border-black/10 mb-[100px]" />

        {/* ONLY FORM CENTERED */}
        <div className="flex justify-center">
          <div className="w-[520px]">

            <form className="space-y-[70px]">

              <input
                type="text"
                placeholder="Name"
                className="w-full bg-transparent border-b border-black/20 
                           pb-[14px] text-[16px] outline-none
                           placeholder:text-black/40"
              />

              <textarea
                placeholder="Message"
                rows={2}
                className="w-full bg-transparent border-b border-black/20 
                           pb-[14px] text-[16px] outline-none resize-none
                           placeholder:text-black/40"
              />

              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-transparent border-b border-black/20 
                           pb-[12px] text-[16px] outline-none
                           placeholder:text-black/40"
              />

            </form>

            <p className="mt-[60px] text-[14px] text-black/50 text-right">
              We accept interns.
            </p>

          </div>
        </div>

      </div>
    </section>
  );
};