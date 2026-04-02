import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapBackground } from "@/components/map/MapBackground";

export default function OurMissionPage() {
    return (
        <main className="relative min-h-screen flex flex-col">
            <Navbar theme="dark" />
            <MapBackground initialChapter="mission" />

            <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl  flex-grow w-full">
                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-[#1D1D1F]">
                        Our Mission
                    </h1>
                    <p className="text-xl text-[#1D1D1F] leading-relaxed mb-8">
                        We are mapping the future of our planet with detailed, AI-powered spatial intelligence.
                    </p>
                </div>
            </div>

            <Footer variant={"compact"} />
        </main>
    );
}
