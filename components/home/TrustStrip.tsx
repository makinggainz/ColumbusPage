"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { cormorant } from "@/lib/typography";

export const TrustStrip = () => {
  const faqs = [
    "How were the samples in the video and website generated?",
    "How does dialogue generation work?",
    "Is this available over API?",
    "What audio tags are supported?",
    "What languages does it support?",
  ];

  return (
    <section className="bg-[#F9F9F9] py-7.5 md:py-15.5 lg:py-19.5">
      <Container>

        {/* HEADING */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className={`${cormorant.className} text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1C274C] mb-3`}>
            Your plans <span className="text-[#1FA7A3]">are in good hands</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#1C274C]/60">
            We work with data from reputable brands
          </p>
        </div>

        {/* LOGOS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center mb-14 opacity-80">
          <Logo src="/emoji/gmap.png" />
          <Logo src="/emoji/fs.png" />
          <Logo src="/emoji/airbnb.png" />
          <Logo src="/emoji/idea.png" />
          <Logo src="/emoji/trip.png" />
          <Logo src="/emoji/fork.png" />
        </div>

        {/* FAQ TITLE */}
        <div className="mb-6">
          <h3 className="text-xs sm:text-sm font-semibold text-[#1FA7A3] uppercase tracking-wider">
            See what people are asking
          </h3>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-6">
          {faqs.map((question, index) => (
            <div
              key={index}
              className="pb-4 border-b border-dashed border-[#DADADA]"
            >
              <p className="text-sm sm:text-base text-[#1C274C]/85">
                {question}
              </p>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};

const Logo = ({ src }: { src: string }) => (
  <div className="flex justify-center">
    <Image
      src={src}
      alt=""
      width={140}
      height={40}
      className="object-contain h-8 sm:h-10 md:h-12 w-auto"
    />
  </div>
);