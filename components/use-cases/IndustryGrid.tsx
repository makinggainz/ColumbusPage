

// "use client";

// import Image from "next/image";

// export default function IndustryGrid() {

//   const industries = [
//     { title: "Commercial Real Estate", img: "/use-cases/comercial.png" },

//     {
//   title: "Urban Planning",
//   img: "/use-cases/planning.png",
//   overlay: {
//     heading: "Due diligence faster",
//     text: "Through our proprietary innovations such as asking our mom to go out and collect data around the neighbourhood we have accrued the most expansive data collection that mimosa has ever seen"
//   }
// },

//     { title: "Residential Real Estate", img: "/use-cases/residentila.png" },

//     {
//       title: "Geomarketing",
//       img: "/use-cases/geomarketing.png",
//       overlay: {
//         heading: "Instant Site Selection"
//       }
//     },

//     { title: "Logistics & transport", img: "/use-cases/logistics.png" },

//     { title: "Defence & Security", img: "/use-cases/security.png" },

//     {
//     title: "Research & Science",
//     img: "/use-cases/research.png",
//     overlay: {
//         heading: "Faster, Easier Science",
//         list: [
//         "Predictive warning climate",
//         "environmental response",
//         "Humanitarian aid studies",
//         "environmental watch"
//         ],
//         showLearnMore: true
//     }
//     },

//     { title: "Tourism", img: "/use-cases/tourism.png" },

//     { title: "Environment & response", img: "/use-cases/env.png" },
//   ];

//   return (
//     <section className="w-full bg-black py-[120px] flex justify-center">

//       <div className="w-full max-w-[1728px] px-6">

//         {/* TITLE */}
//         <h2 className="text-white text-[64px] text-center font-semibold mb-[80px] max-md:text-[36px]">
//           Find your industry
//         </h2>

//         {/* GRID */}
//         <div className="grid grid-cols-3 gap-y-[40px] gap-x-0 max-lg:grid-cols-2 max-md:grid-cols-1">

//           {industries.map((item, i) => (
//             <div key={i} className="flex flex-col">

//               {/* IMAGE */}
//               <div className="relative h-[674px] overflow-hidden">

//                 <Image
//                   src={item.img}
//                   alt={item.title}
//                   fill
//                   className="object-cover"
//                 />

//                 {/* BOTTOM OVERLAY STARTING AT 450px */}
//                 {item.overlay && typeof item.overlay === 'object' && (
//                 <div className="absolute left-0 right-0 bottom-0 h-[416px] bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-center items-center text-center px-8 text-white">

//                     {/* heading */}
//                     <h3 className="text-[20px] mb-4">
//                     {item.overlay.heading}
//                     </h3>

//                     {/* bullet list */}
//                     {item.overlay.list && (
//                     <ul className="text-[14px] text-gray-200 mb-6 space-y-1">
//                         {item.overlay.list.map((point, idx) => (
//                         <li key={idx} className="flex items-center gap-2">
//                             <span className="text-white">•</span>
//                             {point}
//                         </li>
//                         ))}
//                     </ul>
//                     )}

//                     {/* CTAs */}
//                     <div className="flex items-center gap-6">

//                     <button className="border border-white rounded-full px-6 py-2 text-[14px] hover:bg-white hover:text-black transition">
//                         Talk to us
//                     </button>

//                     {item.overlay.showLearnMore && (
//                         <button className="text-white text-[14px] flex items-center gap-1 hover:underline">
//                         Learn more →
//                         </button>
//                     )}

//                     </div>

//                 </div>
//                 )}

//               </div>

//               {/* TITLE BAR */}
//               <div className="bg-black h-[42px] flex items-center justify-center">
//                 <p className="text-white text-[14px] tracking-wide">
//                   {item.title}
//                 </p>
//               </div>

//             </div>
//           ))}

//         </div>

//       </div>

//     </section>
//   );
// }

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function IndustryGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  const industries = [
    { title: "Commercial Real Estate", img: "/use-cases/comercial.png" },

    {
      title: "Urban Planning",
      img: "/use-cases/planning.png",
      overlay: {
        heading: "Due diligence faster",
        text: "Through our proprietary innovations such as asking our mom to go out and collect data around the neighbourhood we have accrued the most expansive data collection that mimosa has ever seen"
      }
    },

    { title: "Residential Real Estate", img: "/use-cases/residentila.png" },

    {
      title: "Geomarketing",
      img: "/use-cases/geomarketing.png",
      overlay: {
        heading: "Instant Site Selection"
      }
    },

    { title: "Logistics & transport", img: "/use-cases/logistics.png" },

    { title: "Defence & Security", img: "/use-cases/security.png" },

    {
      title: "Research & Science",
      img: "/use-cases/research.png",
      overlay: {
        heading: "Faster, Easier Science",
        list: [
          "Predictive warning climate",
          "environmental response",
          "Humanitarian aid studies",
          "environmental watch"
        ],
        showLearnMore: true
      }
    },

    { title: "Tourism", img: "/use-cases/tourism.png" },

    { title: "Environment & response", img: "/use-cases/env.png" },
  ];

  return (
    <section className="w-full bg-black flex justify-center">

      <div ref={sectionRef} className="section-lines-dark w-full max-w-[1287px] mx-auto py-[120px]">

        {/* TITLE */}
        <h2 className="text-center mb-[48px] max-md:mb-[36px] px-8 md:px-10" style={anim(0)}>
          <span
            className="inline-block text-[64px] font-semibold max-md:text-[36px] bg-gradient-to-b from-[#EBEBEB] to-[#A6A6A6] bg-clip-text text-transparent"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.5)",
              paintOrder: "stroke fill",
            }}
          >
            Find your industry
          </span>
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-y-[40px] gap-x-0 max-lg:grid-cols-2 max-md:grid-cols-1" style={anim(100)}>

          {industries.map((item, i) => (
            <a
              key={i}
              href="#"
              className="group flex flex-col cursor-pointer block"
            >

              {/* IMAGE */}
              <div className="relative h-[674px] overflow-hidden">

                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />

                {/* OVERLAY: visible on hover, same treatment as Urban Planning */}
                <div className="absolute inset-0 top-[450px] bg-gradient-to-t from-black/95 to-transparent flex flex-col justify-center px-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">

                  {/* Heading */}
                  <h3 className="text-[20px] mb-4 text-center">
                    {item.overlay?.heading ?? item.title}
                  </h3>

                  {/* Paragraph text */}
                  {item.overlay?.text && (
                    <p className="text-[14px] text-gray-200 max-w-[320px] mx-auto text-center mb-6 leading-relaxed">
                      {item.overlay.text}
                    </p>
                  )}

                  {/* Bullet list */}
                  {item.overlay?.list && (
                    <ul className="text-[14px] text-gray-200 mb-6 space-y-2 max-w-[300px] mx-auto text-left">
                      {item.overlay.list.map((point, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span>•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Buttons */}
                  <div className="flex items-center justify-center gap-4">

                    <button
                      type="button"
                      className="group flex items-center gap-3 leading-none whitespace-nowrap hover:opacity-90 transition-all duration-300"
                      style={{ fontSize: 14, fontWeight: 500, height: 45, paddingLeft: 20, paddingRight: 16, backgroundColor: "white", color: "#1D1D1F" }}
                    >
                      <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Talk to us</span>
                      <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 1l5 5-5 5" />
                      </svg>
                    </button>

                    {item.overlay?.showLearnMore && (
                      <button
                        type="button"
                        className="group flex items-center gap-3 leading-none whitespace-nowrap hover:opacity-90 transition-all duration-300"
                        style={{ fontSize: 14, fontWeight: 500, height: 45, paddingLeft: 20, paddingRight: 16, backgroundColor: "white", color: "#1D1D1F" }}
                      >
                        <span className="transition-colors duration-300 group-hover:text-[#2563EB]">Learn more</span>
                        <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="10" height="18" viewBox="0 0 7 12" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 1l5 5-5 5" />
                        </svg>
                      </button>
                    )}

                  </div>

                </div>

              </div>

              {/* TITLE BAR */}
              <div className="bg-black h-[42px] mt-[10px] flex items-center justify-center">
                <p className="text-white text-[24px] font-semibold tracking-wide">
                  {item.title}
                </p>
              </div>

            </a>
          ))}

        </div>

      </div>

    </section>
  );
}