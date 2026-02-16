"use client";

export const Hero = () => {
    return (
        <section className="relative z-10 mt-[37px] flex w-full min-h-[calc(100vh-76px)] flex-col overflow-hidden">
            {/* Content - grid background shows through from GridBackground */}
            <div className="relative z-10 flex flex-1 items-center">
                <div className="w-full pl-12 pr-6 sm:pl-12 sm:pr-10 lg:pl-20 lg:pr-16">
                    <h1
                        id="hero-title"
                        className="max-w-[800px] whitespace-nowrap text-[#0a1628] font-bold text-[56px] leading-[1.08] tracking-[-0.02em] sm:text-[64px] md:text-[72px] lg:text-[150px]"
                    >
                        Columbus Earth
                    </h1>
                    <p className="mt-5 max-w-[640px] text-[#0a1628] text-[25px] leading-[1.5] sm:text-[26px] md:text-[28px]">
                        The frontier AI Lab building the first in-production Large Geocontext Model.
                    </p>
                </div>
            </div>
        </section>
    );
};
