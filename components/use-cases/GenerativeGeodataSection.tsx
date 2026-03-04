

// "use client";

// import Image from "next/image";

// export function GenerativeGeodataSection() {
//   return (
//     <section
//       style={{
//         background: "#F2F2F2",
//         padding: "140px 0",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "1728px",
//           margin: "0 auto",
//           padding: "0 60px",
//           display: "grid",
//           gridTemplateColumns: "260px 1fr",
//           gap: "40px",
//         }}
//       >
//         {/* LEFT TEXT */}
//         <div>
//           <h2
//             style={{
//               fontSize: "38px",
//               lineHeight: "1.2",
//               margin: 0,
//             }}
//           >
//             Generative <br />
//             Geodata
//           </h2>

//           <p
//             style={{
//               marginTop: "24px",
//               color: "#6E6E6E",
//               lineHeight: "1.6",
//               fontSize: "16px",
//             }}
//           >
//             Columbus has brought accurate GenAI to GeoData,
//             dynamically creating new layers of geospatial
//             information using our UGM.
//           </p>

//           <p
//             style={{
//               marginTop: "16px",
//               color: "#6E6E6E",
//               lineHeight: "1.6",
//               fontSize: "16px",
//             }}
//           >
//             “Smart Layers” can be used to create creative data
//             layers that would otherwise be time-intensive or
//             expensive to obtain.
//           </p>

//           <p
//             style={{
//               marginTop: "16px",
//               color: "#6E6E6E",
//               lineHeight: "1.6",
//               fontSize: "16px",
//             }}
//           >
//             Smart layers can also be used when data is
//             unavailable or hard to survey.
//           </p>

//           <a
//             href="#"
//             style={{
//               display: "inline-block",
//               marginTop: "20px",
//               fontSize: "16px",
//               color: "#000",
//               textDecoration: "underline",
//               fontWeight: 500,
//             }}
//           >
//             See live Smart Layers ↗
//           </a>
//         </div>

//         {/* MAP */}
//         <div style={{ paddingRight: "80px" }}>
//           <div
//             style={{
//               position: "relative",
//               height: "674px",
//               borderRadius: "9px",
//               overflow: "hidden",
//             }}
//           >
//             <Image
//               src="/use-cases/map.png"
//               alt="map"
//               fill
//               style={{ objectFit: "cover" }}
//             />

//             {/* COLOR SCALE */}
//             <div
//               style={{
//                 position: "absolute",
//                 left: "40px",
//                 top: "90px",
//                 width: "16px",
//                 height: "260px",
//                 borderRadius: "20px",
//                 background:
//                   "linear-gradient(to bottom,#3BFF6B,#FFD84C,#FF3131)",
//               }}
//             />

//             {/* CIRCLE 1 */}
//             <div
//               style={{
//                 position: "absolute",
//                 width: "200px",
//                 height: "200px",
//                 borderRadius: "50%",
//                 border: "3px solid white",
//                 top: "120px",
//                 left: "520px",
//               }}
//             />

//             {/* CIRCLE 2 (adjusted right + up) */}
//             <div
//               style={{
//                 position: "absolute",
//                 width: "200px",
//                 height: "200px",
//                 borderRadius: "50%",
//                 border: "3px solid white",
//                 bottom: "160px",
//                 right: "120px",
//               }}
//             />

//             {/* QUERY BOX */}
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "60px",
//                 left: "120px",
//                 background: "#fff",
//                 borderRadius: "12px",
//                 padding: "20px",
//                 width: "600px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
//                 fontSize: "14px",
//               }}
//             >
//               <span>
//                 I need a data layer of buildings in Havana by
//                 safety score. In the perspective of: City Planning
//               </span>

//               <div
//                 style={{
//                   width: "32px",
//                   height: "32px",
//                   borderRadius: "8px",
//                   background: "#1F2A6B",
//                 }}
//               />
//             </div>

//             {/* BUILT TEXT */}
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "20px",
//                 right: "30px",
//                 color: "#fff",
//                 fontSize: "14px",
//               }}
//             >
//               Built on Columbus Pro
//             </div>
//           </div>

//           {/* BOTTOM TEXT */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginTop: "24px",
//               fontWeight: 600,
//               fontSize: "20px",
//               flexWrap: "wrap",
//               gap: "20px",
//             }}
//           >
//             <span>
//               How we do it? What / Where do data we collect, verified
//             </span>

//             <span>
//               Insert text: Marketing towards this specific person
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* RESPONSIVE */}
//       <style jsx>{`
//         @media (max-width: 1100px) {
//           section div[style*="grid-template-columns"] {
//             grid-template-columns: 1fr !important;
//           }

//           section div[style*="height: 674px"] {
//             height: 520px !important;
//           }

//           section div[style*="width: 600px"] {
//             width: 80% !important;
//             left: 40px !important;
//           }
//         }

//         @media (max-width: 768px) {
//           section {
//             padding: 80px 0 !important;
//           }

//           section div[style*="height: 674px"] {
//             height: 420px !important;
//           }

//           section div[style*="width: 600px"] {
//             width: 90% !important;
//             left: 20px !important;
//             font-size: 13px !important;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

"use client";

import Image from "next/image";

export function GenerativeGeodataSection() {
  return (
    <section className="bg-[#F2F2F2] py-20 lg:py-[140px]">

      <div className="max-w-[1728px] mx-auto px-6 md:px-12 lg:px-[60px] grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">

        {/* LEFT TEXT */}
        <div>
          <h2 className="text-[30px] md:text-[34px] lg:text-[38px] leading-[1.2]">
            Generative <br />
            Geodata
          </h2>

          <p className="mt-6 text-[#6E6E6E] leading-[1.6] text-[16px]">
            Columbus has brought accurate GenAI to GeoData,
            dynamically creating new layers of geospatial
            information using our UGM.
          </p>

          <p className="mt-4 text-[#6E6E6E] leading-[1.6] text-[16px]">
            “Smart Layers” can be used to create creative data
            layers that would otherwise be time-intensive or
            expensive to obtain.
          </p>

          <p className="mt-4 text-[#6E6E6E] leading-[1.6] text-[16px]">
            Smart layers can also be used when data is
            unavailable or hard to survey.
          </p>

          <a
            href="#"
            className="inline-block mt-5 text-[16px] underline font-medium"
          >
            See live Smart Layers ↗
          </a>
        </div>

        {/* MAP */}
        <div className="lg:pr-[80px]">

          <div className="relative h-[420px] md:h-[520px] lg:h-[674px] rounded-[9px] overflow-hidden">

            <Image
              src="/use-cases/map.png"
              alt="map"
              fill
              className="object-cover"
            />

            {/* COLOR SCALE */}
            <div className="absolute left-4 md:left-8 lg:left-[40px] top-16 md:top-20 lg:top-[90px] w-[16px] h-[200px] md:h-[240px] lg:h-[260px] rounded-[20px]"
              style={{
                background:
                  "linear-gradient(to bottom,#3BFF6B,#FFD84C,#FF3131)",
              }}
            />

            {/* CIRCLE 1 */}
            <div className="absolute w-[120px] h-[120px] md:w-[160px] md:h-[160px] lg:w-[200px] lg:h-[200px] rounded-full border-[3px] border-white top-[90px] md:top-[100px] lg:top-[120px] left-[40%]" />

            {/* CIRCLE 2 */}
            <div className="absolute w-[120px] h-[120px] md:w-[160px] md:h-[160px] lg:w-[200px] lg:h-[200px] rounded-full border-[3px] border-white bottom-[100px] md:bottom-[130px] lg:bottom-[160px] right-[10%]" />

            {/* QUERY BOX */}
            <div className="absolute bottom-6 md:bottom-10 lg:bottom-[60px] left-4 md:left-10 lg:left-[120px] w-[90%] md:w-[520px] lg:w-[600px] bg-white rounded-[12px] p-4 md:p-5 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-[13px] md:text-[14px]">

              <span>
                I need a data layer of buildings in Havana by
                safety score. In the perspective of: City Planning
              </span>

              <div className="w-[32px] h-[32px] rounded-[8px] bg-[#1F2A6B]" />

            </div>

            {/* BUILT TEXT */}
            <div className="absolute bottom-4 right-4 md:right-6 lg:right-[30px] text-white text-[12px] md:text-[14px]">
              Built on Columbus Pro
            </div>

          </div>

          {/* BOTTOM TEXT */}
          <div className="flex flex-col md:flex-row md:justify-between mt-6 font-semibold text-[18px] md:text-[20px] gap-4">
            <span>
              How we do it? What / Where do data we collect, verified
            </span>

            <span>
              Insert text: Marketing towards this specific person
            </span>
          </div>

        </div>

      </div>

    </section>
  );
}