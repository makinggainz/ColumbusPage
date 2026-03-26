import Link from 'next/link';

export const Products = () => {
    return (
        <section className="py-32 pointer-events-auto" id="products">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-20">
                    <span className="text-blue-500 font-bold tracking-wider uppercase text-sm mb-4 block">Our Suite</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Decision-Grade Tools</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        A complete ecosystem for geospatial intelligence. From generative exploration to hard tactical data.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Market Spy - Large Card */}
                    <div className="group relative bg-gray-800 rounded-[2rem] p-8 md:p-12 overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-500">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-900/20">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-4">Columbus Market Spy</h3>
                            <p className="text-gray-400 text-lg mb-8 max-w-sm">
                                The ultimate competitive intelligence dashboard. Track foot traffic, pricing strategies, and customer sentiment of your rivals in real-time.
                            </p>

                            <div className="mt-auto">
                                <Link
                                    href="/market-spy"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-full transition-all group-hover:gap-4"
                                >
                                    Launch Dashboard <span className="transition-transform">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* UI Preview Decor */}
                        <div className="absolute right-[-20%] top-[20%] w-[80%] h-[120%] bg-gray-900 rounded-tl-3xl border-l border-t border-gray-700 shadow-2xl transform rotate-[-5deg] group-hover:rotate-0 transition-all duration-500 pointer-events-none p-4 opacity-50 group-hover:opacity-100">
                            {/* Fake UI Bars */}
                            <div className="flex gap-2 mb-4">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-8 bg-gray-800 rounded w-3/4"></div>
                                <div className="h-32 bg-gray-800 rounded w-full"></div>
                                <div className="h-32 bg-gray-800 rounded w-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* MapsGPT - Large Card */}
                    <div className="group relative bg-gray-800 rounded-[2rem] p-8 md:p-12 overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-500">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-900/20">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-4">MapsGPT</h3>
                            <p className="text-gray-400 text-lg mb-8 max-w-sm">
                                Generative AI travel & discovery. Ask natural questions like &quot;Where are the best hidden jazz bars?&quot; and get curated spatial itineraries.
                            </p>

                            <div className="mt-auto">
                                <Link
                                    href="/maps-gpt"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-full transition-all group-hover:gap-4"
                                >
                                    Try MapsGPT <span className="transition-transform">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* UI Preview Decor */}
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[80px] group-hover:bg-blue-600/30 transition-all"></div>
                    </div>

                    {/* API - Full Width */}
                    <div className="lg:col-span-2 group relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-[2rem] p-8 md:p-12 overflow-hidden border border-gray-700 hover:border-green-500/50 transition-all duration-500 flex flex-col md:flex-row items-center gap-12">

                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold uppercase tracking-wide border border-green-900/50">For Developers</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Columbus API</h3>
                            <p className="text-gray-400 text-lg mb-8">
                                Integrate the core logic of our Large Geospatial Model directly into your stack. Geocoding, Place Enrichment, and Market Scoring via simple REST endpoints.
                            </p>
                            <Link
                                href="#"
                                className="inline-flex items-center gap-2 text-green-400 font-bold hover:text-green-300 transition-colors"
                            >
                                Read Documentation <span className="transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                        </div>

                        <div className="flex-1 w-full max-w-lg bg-black/50 rounded-xl border border-gray-700 p-4 font-mono text-sm text-gray-300 shadow-2xl relative overflow-hidden">
                            {/* Code Snippet */}
                            <div className="flex gap-1.5 mb-4 border-b border-gray-800 pb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="space-y-1 opacity-80">
                                <div className="text-blue-400">POST <span className="text-white">/v1/enrich/place</span></div>
                                <div className="text-gray-500">{"{"}</div>
                                <div className="pl-4">
                                    <span className="text-blue-400">&quot;name&quot;</span>:{" "}
                                    <span className="text-green-400">&quot;Zara Serrano&quot;</span>,
                                </div>
                                <div className="pl-4">
                                    <span className="text-blue-400">&quot;context&quot;</span>: [
                                    <span className="text-green-400">&quot;traffic&quot;</span>,{" "}
                                    <span className="text-green-400">&quot;sentiment&quot;</span>]
                                </div>
                                <div className="text-gray-500">{"}"}</div>
                                <div className="mt-2 text-gray-500">{"// Response (20ms)"}</div>
                                <div className="text-yellow-400">&quot;score&quot;: 98.4</div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            {/* Bottom Blur Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAFAF9] to-transparent z-1 pointer-events-none"></div>
        </section>
    );
};
