"use client";

import { Container } from "@/components/layout/Container";

export const Careers = () => {
  return (
    <section className="bg-[#07112A] py-[115px] md:py-[147px] lg:py-[179px]">
      <Container>

        {/* TOP CENTER */}
        <div className="text-center mb-36 md:mb-44">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-4">
            Hiring Humans.
          </h2>
          <p className="text-[20px] font-normal tracking-[-0.02em] text-white/70">
            Our team is based in Washington DC and Madrid.
          </p>
        </div>

        {/* TITLE + DESCRIPTION */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-6 md:mb-8">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white">
            Careers & investment queries
          </h3>

          <p className="text-[20px] font-normal tracking-[-0.02em] text-white/70 md:text-right">
            <span className="opacity-70">If you're excited about creating paradigm shifts in<br />physical world understanding. </span>Join us now.
          </p>
        </div>

        {/* DIVIDER — strong red under each text column, fades in the center */}
        <div
          className="h-px mb-16 md:mb-20 -ml-7.5 w-[calc(100%+60px)]"
          style={{
            background: "linear-gradient(to right, rgba(255,0,0,0.45) 0%, rgba(255,0,0,0.25) 20%, rgba(255,0,0,0.04) 45%, rgba(255,0,0,0.04) 55%, rgba(255,0,0,0.25) 80%, rgba(255,0,0,0.45) 100%)",
          }}
          aria-hidden
        />

        {/* FORM */}
        <div className="max-w-xl mx-auto">

          <form className="space-y-10 md:space-y-14">

            <input
              type="text"
              placeholder="Name"
              className="w-full bg-transparent border-b border-white/20 pb-3 text-sm sm:text-base text-white outline-none placeholder:text-white/30"
            />

            <textarea
              placeholder="Message"
              rows={2}
              className="w-full bg-transparent border-b border-white/20 pb-3 text-sm sm:text-base text-white outline-none resize-none placeholder:text-white/30"
            />

            <input
              type="email"
              placeholder="Enter email"
              className="w-full bg-transparent border-b border-white/20 pb-3 text-sm sm:text-base text-white outline-none placeholder:text-white/30"
            />

          </form>

          <p className="mt-3 text-xs sm:text-sm text-white/40 text-right">
            We accept interns.
          </p>

        </div>

      </Container>
    </section>
  );
};