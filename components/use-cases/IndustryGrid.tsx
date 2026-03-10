

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
//               <div className="relative h-[866px] overflow-hidden">

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

export default function IndustryGrid() {

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
    <section className="w-full bg-black py-[120px] flex justify-center">

      <div className="w-full max-w-[1728px] px-6">

        {/* TITLE */}
        <h2 className="text-white text-[64px] text-center font-semibold mb-[80px] max-md:text-[36px]">
          Find your industry
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-y-[40px] gap-x-0 max-lg:grid-cols-2 max-md:grid-cols-1">

          {industries.map((item, i) => (
            <div key={i} className="flex flex-col">

              {/* IMAGE */}
              <div className="relative h-[866px] overflow-hidden">

                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />

                {/* OVERLAY STARTING AT 450px */}
                {item.overlay && (
                  <div className="absolute left-0 right-0 top-[450px] bottom-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-center px-8 text-white">

                    {/* Heading */}
                    <h3 className="text-[20px] mb-4 text-center">
                      {item.overlay.heading}
                    </h3>

                    {/* Paragraph text */}
                    {item.overlay.text && (
                      <p className="text-[14px] text-gray-200 max-w-[320px] mx-auto text-center mb-6 leading-relaxed">
                        {item.overlay.text}
                      </p>
                    )}

                    {/* Bullet list */}
                    {item.overlay.list && (
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
                    <div className="flex items-center justify-center gap-6">

                      <button className="border border-white rounded-full px-6 py-2 text-[14px] hover:bg-white hover:text-black transition">
                        Talk to us
                      </button>

                      {item.overlay.showLearnMore && (
                        <button className="text-white text-[14px] flex items-center gap-1 hover:underline">
                          Learn more →
                        </button>
                      )}

                    </div>

                  </div>
                )}

              </div>

              {/* TITLE BAR */}
              <div className="bg-black h-[42px] flex items-center justify-center">
                <p className="text-white text-[14px] tracking-wide">
                  {item.title}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}