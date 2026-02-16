"use client";

import { useEffect, useState } from "react";
import { shipporiMincho } from "@/lib/fonts";
import Image from "next/image";
import { ScrambleText } from "@/components/ui/ScrambleText";

export const Hero = () => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setIsActive(true), 400);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="relative z-10 mt-[37px] flex w-full min-h-[calc(100vh-76px)] flex-col overflow-hidden">
            {/* Background Image */}
            <Image
                src="/hero-background.jpg"
                alt="Hero background"
                fill
                className="object-cover object-center"
                priority
            />
            {/* Content */}
            <div className="relative z-10 flex flex-1 items-center">
                <div className="mx-auto w-full max-w-[1080px] px-5 lg:px-8">
                    <h1
                        className={[
                            shipporiMincho.className,
                            "max-w-[800px] text-[#0a1628]",
                            "text-[40px] leading-[1.08] tracking-[-0.012em]",
                            "sm:text-[40px] sm:leading-[1.04]",
                            "md:text-[40px] md:leading-[1.02]",
                            "lg:text-[50px] lg:leading-[1] lg:-translate-x-35",
                        ].join(" ")}
                    >
                        <span className="block whitespace-nowrap">
                            <ScrambleText
                                text="The frontier AI Lab"
                                isActive={isActive}
                                delay={0}
                                className={shipporiMincho.className}
                            />
                        </span>
                        <span className="mt-[0.16em] block whitespace-nowrap">
                            <ScrambleText
                                text="building the first in-production"
                                isActive={isActive}
                                delay={200}
                                className={shipporiMincho.className}
                            />
                        </span>
                        <span className="mt-[0.16em] block whitespace-nowrap">
                            <ScrambleText
                                text="Universal Geospatial Model."
                                isActive={isActive}
                                delay={400}
                                className={shipporiMincho.className}
                            />
                        </span>
                    </h1>
                </div>
            </div>
        </section>
    );
};
