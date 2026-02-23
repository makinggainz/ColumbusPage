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
        <section className="relative bg-[#F9F9F9] min-h-[calc(100vh-76px)] overflow-hidden">

            {/* <Image
                src="/hero-background.jpg"
                alt="Hero background"
                fill
                sizes="100vw"
                className="object-cover"
                priority
            /> */}

            <div className="relative z-10 pt-[120px]">
                <div className="px-[100px]">
                <div className="w-[1007px]">

                    {/* Eyebrow */}
                    <p className=" text-[16px] font-medium tracking-[-0.03em] text-[#1C274C]/70 uppercase mb-[20px]
                    ">
                    FRONTIER AI RESEARCH AND PRODUCT COMPANY
                    </p>

                    {/* Main Heading */}
                    <h1
                    className={`${cormorant.className} font-semibold text-[66px] leading-[120%] tracking-[-0.02em] text-[#0A1344]`}
                    >
                    {/* <ScrambleText
                        text="The frontier AI Lab building the first in-production Large Geospatial Model."
                        isActive={isActive}
                        delay={0}
                    /> */}

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
                    <p className=" mt-[28px] text-[15px] font-medium tracking-[0.08em]text-[#1C274C]/70
                    ">
                    [ COLUMBUS PRO-1 ]
                    </p>

                </div>
                </div>
            </div>

            </section>
    );
};