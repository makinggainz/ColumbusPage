"use client";

import { Container } from "@/components/layout/Container";

export const Careers = () => {
  return (
    <section className="bg-[#F9F9F9] py-[115px] md:py-[147px] lg:py-[179px]">
      <Container>

        {/* TOP CENTER */}
        <div className="text-center mb-36 md:mb-44">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-black mb-4">
            Hiring Humans.
          </h2>
          <p className="text-sm sm:text-base text-black/80">
            Our team is based in Washington DC and Madrid.
          </p>
        </div>

        {/* TITLE + DESCRIPTION */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-6 md:mb-8">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#0A1344]">
            Careers & investment queries
          </h3>

          <p className="text-sm sm:text-base text-black/60 leading-relaxed md:text-right">
            If you're excited about creating paradigm shifts in physical world
            understanding. Join us now.
          </p>
        </div>

        {/* DIVIDER — 60px wider; radial gradient */}
        <div
          className="h-px mb-16 md:mb-20 -ml-[30px] w-[calc(100%+60px)]"
          style={{
            background: "radial-gradient(circle, rgba(255, 0, 0, 1) 0%, rgba(255, 255, 255, 0.35) 100%)",
          }}
          aria-hidden
        />

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

          <p className="mt-3 text-xs sm:text-sm text-black/50 text-right">
            We accept interns.
          </p>

        </div>

      </Container>
    </section>
  );
};