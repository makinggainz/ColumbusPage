"use client";

export const Careers = () => {
  return (
    <section className="bg-[#F3F3F3] py-20 md:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

        {/* TOP CENTER */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-4">
            Hiring Humans.
          </h2>
          <p className="text-sm sm:text-base text-black/60">
            Our team is based in Washington DC and Madrid.
          </p>
        </div>

        {/* TITLE + DESCRIPTION */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-12 md:mb-16">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#0A1344]">
            Careers & investment queries
          </h3>

          <p className="text-sm sm:text-base text-black/60 leading-relaxed md:text-right">
            If you're excited about creating paradigm shifts in physical world
            understanding. Join us now.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="border-b border-black/10 mb-16 md:mb-20" />

        {/* FORM */}
        <div className="max-w-xl mx-auto">

          <form className="space-y-10 md:space-y-14">

            <input
              type="text"
              placeholder="Name"
              className="w-full bg-transparent border-b border-black/20 pb-3 text-sm sm:text-base outline-none placeholder:text-black/40"
            />

            <textarea
              placeholder="Message"
              rows={2}
              className="w-full bg-transparent border-b border-black/20 pb-3 text-sm sm:text-base outline-none resize-none placeholder:text-black/40"
            />

            <input
              type="email"
              placeholder="Enter email"
              className="w-full bg-transparent border-b border-black/20 pb-3 text-sm sm:text-base outline-none placeholder:text-black/40"
            />

          </form>

          <p className="mt-12 text-xs sm:text-sm text-black/50 text-right">
            We accept interns.
          </p>

        </div>

      </div>
    </section>
  );
};