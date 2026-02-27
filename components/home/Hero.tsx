"use client";

import { useEffect, useState } from "react";
import { shipporiMincho } from "@/lib/fonts";
import Image from "next/image";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { cormorant } from "@/lib/typography";

export const Hero = () => {
    const [isActive, setIsActive] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setIsActive(true), 400);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="relative flex flex-col bg-[#F9F9F9] min-h-[calc(100vh-76px)] overflow-hidden">
            {/* Mobile: full-bleed background image with overlay (wireframe style) */}
            <div className="absolute inset-0 z-0 md:hidden">
                <Image
                    src="/images/Background_image ColLanding.png"
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                    priority
                />
                <div className="absolute inset-0 bg-[#0A1344]/60" />
            </div>

            {/* Desktop: text block above mesh (no overlay) */}
            <div className="relative z-10 pt-[60px] sm:pt-[80px] md:pt-[100px] lg:pt-[120px] shrink-0 px-4 sm:px-6 md:px-12 lg:px-[100px] flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-full max-w-[1007px]">
                    {/* Eyebrow */}
                    <p className="text-[12px] sm:text-[14px] md:text-[16px] font-medium tracking-[-0.03em] text-white/90 md:text-[#1C274C]/70 uppercase mb-3 sm:mb-5">
                    FRONTIER AI RESEARCH AND PRODUCT COMPANY
                    </p>

                    {/* Main Heading */}
                    <h1
                    className={`${cormorant.className} font-semibold text-[28px] sm:text-[40px] md:text-[52px] lg:text-[66px] leading-[120%] tracking-[-0.02em] text-white md:text-[#0A1344]`}
                    >
                    {mounted ? (
                    <ScrambleText
                        text="The frontier AI Lab building the first in-production Large Geospatial Model."
                        isActive={isActive}
                        delay={0}
                    />
                    ) : (
                    "The frontier AI Lab building the first in-production Large Geospatial Model."
                    )}
                    </h1>

                    {/* Tag */}
                    <p className="mt-4 sm:mt-6 md:mt-[28px] text-[12px] sm:text-[14px] md:text-[15px] font-medium tracking-[0.08em] text-white/80 md:text-[#1C274C]/70">
                    [ COLUMBUS PRO-1 ]
                    </p>

                    {/* Mobile-only: single CTA button (wireframe "Explore More") */}
                    <div className="mt-8 md:hidden">
                        <a
                            href="/maps-gpt"
                            className="inline-block w-full max-w-[280px] py-4 px-8 rounded-lg bg-white text-[#0A1344] font-semibold text-center text-[16px]"
                        >
                            Explore More
                        </a>
                    </div>
                </div>
            </div>

            {/* Mesh: visible on tablet/desktop; hidden on mobile (we use it as hero bg above) */}
            <div className="relative flex-1 min-h-[50vh] sm:min-h-[70vh] md:min-h-[90vh] lg:min-h-[120vh] w-full overflow-hidden -mt-4 md:-mt-[20px] hidden md:block">
                <Image
                    src="/images/Background_image ColLanding.png"
                    alt="Columbus landing grid background"
                    fill
                    className="object-cover object-top w-full"
                    sizes="100vw"
                    priority
                />
            </div>

            </section>
    );
};