import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapBackground } from "@/components/map/MapBackground";

export default function OurMissionPage() {
    return (
        <main className="relative min-h-screen flex flex-col">
            <Navbar />
            <MapBackground initialChapter="mission" />

            {/* Hero content */}
            <div
                className="relative z-10 mx-auto w-full pt-24 md:pt-32 flex-grow"
                style={{ maxWidth: 1287, paddingLeft: "var(--page-padding)", paddingRight: "var(--page-padding)" }}
            >
                <div className="max-w-292">
                    {/* Eyebrow */}
                    <p
                        className="text-sm md:text-base font-medium tracking-tight text-[#0A1344] uppercase mb-4"
                    >
                        About Columbus
                    </p>

                    {/* Heading */}
                    <h1
                        className="font-light leading-[1.2] text-[#0A1344] text-[39px] md:text-[49px] lg:text-[61px]"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Mapping the future
                        <br />
                        of our planet
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="mt-6 text-[16px] md:text-[20px] leading-[1.5]"
                        style={{ color: "rgba(10, 19, 68, 0.45)", letterSpacing: "-0.015em", fontWeight: 400 }}
                    >
                        We are building detailed, AI-powered spatial intelligence to help humanity understand and navigate the physical world.
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-8 mt-7">
                        <Link
                            href="/contact"
                            className="group flex items-center justify-between gap-5 leading-none rounded-none hover:opacity-90 transition-opacity"
                            style={{ height: 36, paddingLeft: 20, paddingRight: 16, fontSize: 15, fontWeight: 500, borderRadius: 0, backgroundColor: "#000000", color: "white" }}
                        >
                            <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Contact</span>
                            <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 1l5 5-5 5" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer variant={"compact"} />
        </main>
    );
}
