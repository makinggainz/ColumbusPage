"use client";

import Image from "next/image";

const pipelineColumns = [
    {
        title: "Public Data",
        highlight: false,
        images: [
            { src: "/images/7.png", alt: "Public data document" },
            { src: "/images/14.png", alt: "Administrative data" },
            { src: "/images/15.png", alt: "Official maps" },
            { src: "/images/16.png", alt: "Open Street Map" },
        ],
        description:
            "Public Ministries, partner company data, legacy data, official maps, scientific reporting, legal filings and more",
    },
    {
        title: "Columbus Surveying",
        highlight: false,
        images: [
            { src: "/images/8.png", alt: "Field interview" },
            { src: "/images/9.png", alt: "Ground fieldwork" },
            { src: "/images/10.png", alt: "Aerial imaging" },
            { src: "/images/11.png", alt: "Street photography" },
        ],
        description:
            "We collect proprietary data including local interviews, ground fieldwork, ariel imaging, street photography analysis, geophysics sampling, environmental and sociological research.",
    },
    {
        title: "Data Digestion",
        highlight: false,
        images: [],
        description:
            "We've developed a technology that turns unstructured, broken or un-spatially paired data into useful information",
    },
    {
        title: "Generative Layers",
        highlight: true,
        images: [
            { src: "/heropage.png", alt: "Generative layer output" },
        ],
        description:
            "Our LGM creates highly accurate extrapolations, predictive future data and fills in data gaps where surveying is expensive",
    },
];

export const WhyColumbus = () => {
    return (
        <section
            className="w-full px-4 py-4 sm:px-6 sm:py-6"
            id="why-columbus"
        >
            <div className="relative w-full min-h-screen flex flex-col overflow-hidden rounded-sm">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <Image
                        src="/amazonia.jpg"
                        alt="Columbus satellite view"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-[#0a1628]/40"></div>
                    {/* Grid Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
                        `,
                            backgroundSize: "100px 100px",
                        }}
                    ></div>
                </div>

                {/* Top Blur Gradient */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0a1628] to-transparent z-10 pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10 w-full flex-1 flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-12 md:py-16">
                    {/* Title */}
                    <div className="max-w-4xl mb-12 md:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-tight tracking-tight">
                            The Columbus Aggregated Geospatial Data system
                            <br />
                            fuses versatile data sources into one coherent picture.
                        </h2>
                    </div>

                    {/* Pipeline Columns */}
                    <div className="flex-1 flex flex-col justify-end">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
                            {pipelineColumns.map((col, i) => (
                                <div
                                    key={i}
                                    className={`flex flex-col ${i < pipelineColumns.length - 1
                                        ? "lg:border-r lg:border-white/20"
                                        : ""
                                        } px-4 py-4`}
                                >
                                    {/* Column Title */}
                                    <h3
                                        className={`text-lg md:text-xl font-semibold mb-4 ${col.highlight
                                            ? "text-[#00ff88]"
                                            : "text-white"
                                            }`}
                                    >
                                        {col.title}
                                    </h3>

                                    {/* Images Grid */}
                                    <div className="mb-4">
                                        {col.images.length > 0 ? (
                                            col.title === "Generative Layers" ? (
                                                /* Single large image for Generative Layers */
                                                <div className="relative w-full aspect-square max-w-[200px] overflow-hidden shadow-lg shadow-cyan-500/20">
                                                    <Image
                                                        src={col.images[0].src}
                                                        alt={col.images[0].alt}
                                                        fill
                                                        className="object-cover"
                                                        sizes="200px"
                                                    />
                                                </div>
                                            ) : (
                                                /* 2x2 grid for other columns */
                                                <div className="grid grid-cols-2 gap-1 max-w-[260px]">
                                                    {col.images.map((img, j) => (
                                                        <div
                                                            key={j}
                                                            className="relative aspect-[4/3] overflow-hidden"
                                                        >
                                                            <Image
                                                                src={img.src}
                                                                alt={img.alt}
                                                                fill
                                                                className="object-cover"
                                                                sizes="130px"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        ) : (
                                            /* Placeholder for Data Digestion */
                                            <div className="w-full aspect-[4/3] max-w-[200px] bg-gray-300/50 backdrop-blur-sm"></div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-white/80 leading-relaxed">
                                        {col.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Tagline Bar */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                        <p className="text-xl md:text-2xl text-white font-normal">
                            We turn earth into an intelligence hub for your research
                            and decision making.
                        </p>
                        <a
                            href="/technology"
                            className="text-white font-medium flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap ml-8"
                        >
                            Learn more
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6 4L10 8L6 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Bottom Blur Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAFAF9] to-transparent z-10 pointer-events-none"></div>
            </div>
        </section>
    );
};
