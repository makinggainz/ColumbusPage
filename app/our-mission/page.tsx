"use client";

import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function OurMissionPage() {
    return (
        <main className="relative min-h-screen" style={{ backgroundColor: "#F9F9F9" }}>
            <Navbar />

            {/* Accent gradient — top of page */}
            <div
                className="absolute left-0 right-0 top-0 pointer-events-none"
                style={{
                    height: "50%",
                    background: "linear-gradient(to bottom, rgba(0, 102, 204, 0.15) 0%, rgba(0, 102, 204, 0.08) 60%, transparent 100%)",
                    zIndex: 1,
                }}
                aria-hidden
            />

            {/* Content */}
            <div className="relative z-10">

                {/* Grid pattern — 300px tall, fades at edges, overlays behind content */}
                <div
                    className="absolute left-0 right-0 top-0 pointer-events-none"
                    style={{ height: 300, zIndex: 0 }}
                    aria-hidden
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(37, 99, 235, 0.08) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(37, 99, 235, 0.08) 1px, transparent 1px)
                            `,
                            backgroundSize: "80px 80px",
                            mask: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                            WebkitMask: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                        }}
                    />
                </div>

                {/* ── OUR MISSION ── */}
                <div className="flex flex-col items-center text-center px-8 md:px-10 pt-32 md:pt-40 pb-16 md:pb-20">
                    <h2
                        className="text-[13px] md:text-[14px] font-bold tracking-[0.08em] uppercase text-[#1D1D1F] mb-8"
                    >
                        OUR MISSION
                    </h2>
                    <p
                        className="text-[18px] md:text-[22px] leading-[1.6] text-[#1D1D1F] max-w-[700px]"
                        style={{ fontWeight: 400 }}
                    >
                        To create intelligence to critically understand our planet better.
                        <br />
                        Deep surveying of all earth. To create a computer brain, able
                        <br />
                        to think across the vastness of our earth&apos;s data.
                    </p>
                    <p
                        className="text-[18px] md:text-[22px] leading-[1.6] text-[#1D1D1F] max-w-[700px] mt-10"
                        style={{ fontWeight: 400 }}
                    >
                        To create the most powerful map platform.
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full" style={{ height: 1, backgroundColor: "rgba(37, 99, 235, 0.08)" }} />

                {/* ── OUR VISION ── */}
                <div className="flex flex-col items-center text-center px-8 md:px-10 py-16 md:py-20">
                    <h2
                        className="text-[13px] md:text-[14px] font-bold tracking-[0.08em] uppercase text-[#1D1D1F] mb-8"
                    >
                        OUR VISION
                    </h2>
                    <p
                        className="text-[18px] md:text-[22px] leading-[1.6] text-[#1D1D1F] max-w-[700px]"
                        style={{ fontWeight: 400 }}
                    >
                        We believe maps, can lead to the journey to a Universal Geospatial Model.
                        <br />
                        A thinking earth.
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full" style={{ height: 1, backgroundColor: "rgba(37, 99, 235, 0.08)" }} />

                {/* ── Founders Quote ── */}
                <div className="flex flex-col items-center text-center px-8 md:px-10 py-20 md:py-28">
                    <h2
                        className="text-[13px] md:text-[14px] font-bold tracking-[0.08em] uppercase text-[#1D1D1F] mb-8"
                    >
                        A QUOTE from our Founders
                    </h2>
                    <p
                        className="text-[18px] md:text-[22px] leading-[1.6] max-w-[600px]"
                        style={{ color: "rgba(29, 29, 31, 0.65)", fontWeight: 400 }}
                    >
                        In a world full of slop, we want reality.
                        <br />
                        Our AI is for reality. None of our content,
                        <br />
                        or coding was Artificial.
                    </p>
                    <p
                        className="text-[18px] md:text-[22px] leading-[1.6] mt-8"
                        style={{ color: "rgba(29, 29, 31, 0.65)", fontWeight: 400 }}
                    >
                        Nature always prevails.
                    </p>

                    {/* Founder avatars */}
                    <div className="flex items-center gap-4 mt-10">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <Image src="/David.png" alt="David" width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <Image src="/Alex.jpg" alt="Alex" width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <Image src="/Erick.png" alt="Erick" width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                <Footer variant={"compact"} />
            </div>
        </main>
    );
}
