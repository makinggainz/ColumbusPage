"use client";

import { useState, type ReactNode } from "react";
import { MistxNav } from "@/components/layout/MistxNav";
import { MapBackground, MapMarker } from "@/components/map/MapBackground";

type Sector = "FASHION" | "RESTAURANTS" | "CAFES";

// Real-world coordinates for Salamanca, Madrid
const SECTOR_MARKERS: Record<Sector, MapMarker[]> = {
    FASHION: [
        { id: 'f1', latitude: 40.426317, longitude: -3.687897, label: 'Zara Serrano' }, // Serrano 23
        { id: 'f2', latitude: 40.4264, longitude: -3.6873, label: 'El Corte Inglés' }, // Serrano 47
        { id: 'f3', latitude: 40.4265, longitude: -3.6875, label: 'Massimo Dutti' }, // Serrano 48
        { id: 'f4', latitude: 40.428867, longitude: -3.6869857, label: 'Mango' }, // Serrano 60
        { id: 'f5', latitude: 40.4255, longitude: -3.6855, label: 'Uniqlo' }, // Goya 6
    ],
    RESTAURANTS: [
        { id: 'r1', latitude: 40.423715, longitude: -3.6851, label: 'Amazónico' }, // Jorge Juan 20
        { id: 'r2', latitude: 40.4278455, longitude: -3.6885096, label: 'Ten Con Ten' }, // Ayala 6
        { id: 'r3', latitude: 40.423913, longitude: -3.685423, label: 'Ultramarinos Quintin' }, // Jorge Juan 17
        { id: 'r4', latitude: 40.4234, longitude: -3.6839, label: 'Numa Pompilio' }, // Velazquez 18
        { id: 'r5', latitude: 40.4238, longitude: -3.6845, label: 'El Paraguas' }, // Jorge Juan 16
    ],
    CAFES: [
        { id: 'c1', latitude: 40.421452, longitude: -3.688316, label: 'Pastelería Mallorca' }, // Serrano 6
        { id: 'c2', latitude: 40.4217, longitude: -3.6878, label: 'Cristina Oria' }, // Conde de Aranda 6
        { id: 'c3', latitude: 40.4200, longitude: -3.6888, label: 'Cappuccino Grand Cafe' }, // Plaza Independencia
        { id: 'c4', latitude: 40.4270, longitude: -3.6875, label: 'Starbucks' }, // Serrano 41
        { id: 'c5', latitude: 40.4276, longitude: -3.6850, label: 'Jurucha' }, // Ayala 19
    ]
};

const FILTERS = [
    "Performance", "Promotions", "Customer Sentiment", "Foot Traffic", "Demographics"
];

type MockPanel = {
    title: string;
    content: ReactNode;
};

// Mock Data Generator Function - Strictly Sector Based
const getMockData = (filter: string, competitorName: string | null, sector: Sector) => {
    const name = competitorName || "Sector Average";
    const offset = competitorName ? competitorName.length : 0;

    // Helper to allow random variation based on name
    const num = (base: number, range: number) => base + (offset % range);

    const data: Record<string, MockPanel> = {
        "Performance": {
            title: `Performance: ${name}`,
            content: (
                <div className="space-y-4">
                    {sector === "FASHION" && (
                        <>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800">Avg. Ticket</span>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+5% YoY</span>
                                </div>
                                <div className="text-2xl font-bold text-primary mb-1">€{num(45, 15)}</div>
                                <p className="text-xs text-gray-500">Items per basket: {num(2, 2)}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800">Return Rate</span>
                                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">High Alert</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${num(15, 10)}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{name}: {num(15, 10)}%</span>
                                    <span>Market: 12%</span>
                                </div>
                            </div>
                        </>
                    )}
                    {sector === "RESTAURANTS" && (
                        <>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800">RevPAR (Seat)</span>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Strong</span>
                                </div>
                                <div className="text-2xl font-bold text-primary mb-1">€{num(55, 20)}</div>
                                <p className="text-xs text-gray-500">Table Turnover: {num(1, 1).toFixed(1)}x</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800">Reservations</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Booked</span>
                                    <span className="font-bold">{num(80, 15)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${num(80, 15)}%` }}></div>
                                </div>
                            </div>
                        </>
                    )}
                    {sector === "CAFES" && (
                        <>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800">Avg. Basket</span>
                                </div>
                                <div className="text-2xl font-bold text-primary mb-1">€{num(6, 4).toFixed(2)}</div>
                                <p className="text-xs text-gray-500">Peak: Breakfast (9-11am)</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800">Takeaway Mix</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 text-center border-r border-gray-100">
                                        <div className="text-lg font-bold text-orange-500">{num(40, 20)}%</div>
                                        <div className="text-xs text-gray-500">To Go</div>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <div className="text-lg font-bold text-blue-500">{100 - num(40, 20)}%</div>
                                        <div className="text-xs text-gray-500">Sit In</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )
        },
        "Promotions": {
            title: `Active Strategy: ${name}`,
            content: (
                <div className="space-y-3">
                    {sector === "FASHION" && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex gap-3">
                            <span className="text-2xl">🏷️</span>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Mid-Season Sale</h4>
                                <p className="text-xs text-gray-600">Up to 30% off Knitwear</p>
                            </div>
                        </div>
                    )}
                    {sector === "RESTAURANTS" && (
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 flex gap-3">
                            <span className="text-2xl">🍷</span>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Testing Menu</h4>
                                <p className="text-xs text-gray-600">€65 Pairing Experience</p>
                            </div>
                        </div>
                    )}
                    {sector === "CAFES" && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
                            <span className="text-2xl">☕</span>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Coffee Combo</h4>
                                <p className="text-xs text-gray-600">Free pastry with Large Latte</p>
                            </div>
                        </div>
                    )}
                </div>
            )
        },
        "Customer Sentiment": {
            title: `Sentiment: ${name}`,
            content: (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center text-green-600 font-bold text-lg">
                            {num(85, 10)}%
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Positive Score</h4>
                            <p className="text-xs text-gray-500">AI analysis of reviews</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase">Top Themes</div>
                        <div className="flex flex-wrap gap-2">
                            {sector === "FASHION" ? (
                                <><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase tracking-wide">Fitting Rooms</span><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase tracking-wide">Collection</span></>
                            ) : sector === "RESTAURANTS" ? (
                                <><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase tracking-wide">Atmosphere</span><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase tracking-wide">Service</span></>
                            ) : (
                                <><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase tracking-wide">Coffee Quality</span><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase tracking-wide">WiFi</span></>
                            )}
                        </div>
                    </div>
                </div>
            )
        },
        "Foot Traffic": {
            title: `Visits: ${name}`,
            content: (
                <div className="space-y-4">
                    <div className="flex items-end gap-1 h-24 border-b border-gray-200 pb-1">
                        {[10, 20, 40, (sector === "RESTAURANTS" ? 20 : 60), (sector === "RESTAURANTS" ? 90 : 40), 50, 30, (sector === "RESTAURANTS" ? 85 : 40), 70, 90, 60, 30].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-500 rounded-t-sm" style={{ height: `${(h + offset) % 100}%` }}></div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        Busiest: <strong>{sector === "RESTAURANTS" ? "21:00" : "18:00"}</strong>
                    </p>
                </div>
            )
        },
        "Demographics": {
            title: `Audience: ${name}`,
            content: (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                        <span className="block text-2xl font-bold text-primary">{num(30, 15)}</span>
                        <span className="text-[10px] text-gray-500">Avg. Age</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                        <span className="block text-2xl font-bold text-primary">{num(60, 20)}%</span>
                        <span className="text-[10px] text-gray-500">Female</span>
                    </div>
                </div>
            )
        }
    };

    return data[filter] || { title: filter, content: <div>No data available</div> };
};

export default function MarketSpyPage() {
    const [activeSector, setActiveSector] = useState<Sector>("FASHION");
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
    const [chatQuery, setChatQuery] = useState("");

    const activeData = activeFilter ? getMockData(activeFilter, selectedMarker?.label || null, activeSector) : null;
    const displayedMarkers = SECTOR_MARKERS[activeSector];

    const handleSectorChange = (sector: Sector) => {
        setActiveSector(sector);
        setSelectedMarker(null); // Clear selection when changing sector
        setActiveFilter(null);
    };

    return (
        <main className="h-screen w-full flex flex-col overflow-hidden bg-white">
            <MistxNav />

            {/* Main Dashboard Content - Starts below navbar */}
            <div className="flex-1 flex pt-20"> {/* pt-20 to clear fixed navbar */}

                {/* Left Panel - UI (40%) */}
                <div className="w-full md:w-[40%] h-full overflow-y-auto p-8 border-r border-gray-100 z-10 bg-white shadow-xl relative">
                    <div className="max-w-xl mx-auto space-y-6">

                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-primary tracking-tight mb-2">
                                Market Spy
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Analyze local competition in real-time.
                            </p>
                        </div>

                        {/* Sector Selector Tabs */}
                        <div className="bg-gray-100 p-1 rounded-xl flex">
                            {(["FASHION", "RESTAURANTS", "CAFES"] as Sector[]).map((sector) => (
                                <button
                                    key={sector}
                                    onClick={() => handleSectorChange(sector)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeSector === sector
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {sector.charAt(0) + sector.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>

                        {/* Selected Context Indicator */}
                        {selectedMarker && (
                            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center justify-between animate-in fade-in">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">📍</span>
                                    <div>
                                        <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">Analyzing</div>
                                        <div className="font-bold text-gray-900">{selectedMarker.label}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setChatQuery(`Tell me interesting facts about ${selectedMarker.label}`)}
                                        className="bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm border border-blue-100 hover:bg-blue-50 transition-colors flex items-center gap-1"
                                    >
                                        <span>✨</span> Ask AI
                                    </button>
                                    <button
                                        onClick={() => setSelectedMarker(null)}
                                        className="p-1 hover:bg-blue-100 rounded-full text-blue-400 hover:text-blue-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Filters / Pills */}
                        <div className="flex flex-wrap gap-2">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter === activeFilter ? null : filter)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-all hover:shadow-md
                                ${activeFilter === filter
                                            ? "bg-primary border-primary text-white"
                                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Dynamic Content Panel */}
                        {activeData ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-800">{activeData.title}</h3>
                                    <button
                                        onClick={() => setActiveFilter(null)}
                                        className="text-xs text-gray-400 hover:text-gray-600"
                                    >
                                        Close
                                    </button>
                                </div>
                                <div className="p-5 bg-white border border-gray-100 shadow-xl rounded-2xl relative overflow-hidden">
                                    {/* Background Decor */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0"></div>
                                    <div className="relative z-10">
                                        {activeData.content}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Helper Text */
                            <div className="text-center py-10 opacity-50">
                                <p className="text-sm">Select a category and a filter to see insights.</p>
                            </div>
                        )}

                        {/* Competitor List */}
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                                {activeSector} Competitors
                            </h3>
                            <ul className="space-y-2">
                                {displayedMarkers.map((m) => (
                                    <li key={m.id} className="flex items-center justify-between text-gray-700 text-sm p-2 hover:bg-gray-50 rounded-lg cursor-pointer group" onClick={() => setSelectedMarker(m)}>
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-3 ${selectedMarker?.id === m.id ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-blue-400'}`}></span>
                                            {m.label}
                                        </div>
                                        <span className="text-xs text-gray-400 group-hover:text-blue-500">View</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Right Panel - Map (60%) */}
                <div className="w-full md:w-[60%] h-full relative">
                    <MapBackground
                        markers={displayedMarkers}
                        initialChapter="spy-dashboard"
                        className="absolute inset-0 w-full h-full"
                        interactive={true}
                        onMarkerClick={setSelectedMarker}
                        focusedMarker={selectedMarker}
                    />
                </div>

            </div>
        </main>
    );
}
