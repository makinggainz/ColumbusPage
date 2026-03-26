import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapBackground } from "@/components/map/MapBackground";
import { Button } from "@/components/ui/Button";

export default function MapsGPTPage() {
    return (
        <main className="min-h-screen relative">
            <MapBackground initialChapter="gpt-intro" />
            <Navbar theme="dark" />

            {/* Content Container - Left 50% on desktop */}
            <div className="relative z-10 w-full md:w-1/2 pointer-events-none">

                {/* Section 1: Intro */}
                <section id="gpt-intro" className="min-h-screen flex flex-col justify-center p-8 md:p-16 pointer-events-auto bg-gradient-to-r from-white/90 to-transparent md:from-white/80">
                    <div className="max-w-xl">
                        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full">
                            Your Intelligent Travel Copilot
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight">
                            MapsGPT
                        </h1>
                        <p className="text-xl text-gray-700 mb-6 leading-relaxed font-medium">
                            Next-generation platform for trip planning and place discovery, powered by Advanced AI.
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Combines cartographic precision with the expert reasoning of language models to create personalized, logical itineraries tailored to your tastes. It&apos;s not just a map, it&apos;s a digital local expert that understands context: from weather and time of day to the local culture of each neighborhood.
                        </p>
                        <div className="flex gap-4">
                            <Link href="https://www.mapsgpt.es" target="_blank">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg border-none text-white">Start Exploring</Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Section 2: Features */}
                <section id="gpt-features" className="min-h-screen flex flex-col justify-center p-8 md:p-16 pointer-events-auto bg-gradient-to-r from-white/95 to-transparent md:from-white/90">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
                            Key Features
                        </h2>

                        <div className="space-y-6">
                            <div className="group">
                                <h3 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                                    📍 Geospatial Intelligence
                                </h3>
                                <p className="text-gray-700">
                                    Understands where you are and calculates real routes. Prioritizes nearby places or takes you to the best destinations in the city.
                                </p>
                            </div>

                            <div className="group">
                                <h3 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                                    🏙️ Zone Discovery
                                </h3>
                                <p className="text-gray-700">
                                    Draw polygons on the map to delimit neighborhoods or areas of interest (e.g., &quot;Party zone in Madrid&quot;).
                                </p>
                            </div>

                            <div className="group">
                                <h3 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                                    💬 Conversational Chat
                                </h3>
                                <p className="text-gray-700">
                                    Talk to the AI like a friend. Ask for changes (&quot;remove the museum and add a park&quot;), ask questions about a place, or request alternatives.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: How to Use */}
                <section id="gpt-how" className="min-h-screen flex flex-col justify-center p-8 md:p-16 pointer-events-auto bg-gradient-to-r from-white/95 to-transparent md:from-white/90">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
                            How to use?
                        </h2>
                        <p className="text-lg text-gray-700 mb-8">
                            Using MapsGPT is as easy as chatting:
                        </p>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                            <h4 className="font-bold text-blue-900 mb-2">1. Type your wish</h4>
                            <p className="text-gray-600 italic">&quot;Plan a 3-day trip to Paris for a couple who likes art and cheap food.&quot;</p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                            <h4 className="font-bold text-blue-900 mb-2">2. Explore the Map</h4>
                            <p className="text-gray-600">The AI will generate markers, routes, and zones on the interactive map. Click on them to see details.</p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                            <h4 className="font-bold text-blue-900 mb-2">3. Refine and Travel</h4>
                            <p className="text-gray-600">Ask the chat for changes and use your plan as a guide on your mobile while exploring the world.</p>
                        </div>

                        <Link href="https://www.mapsgpt.es" target="_blank">
                            <Button variant="outline" size="lg" className="bg-white/80 w-full md:w-auto">
                                View Live Demo
                            </Button>
                        </Link>
                    </div>
                </section>

            </div>

            <Footer />
        </main>
    );
}
