
// "use client";

// import Image from "next/image";

// export function RealEstateSection() {
//   return (
//     <section
//       style={{
//         background: "#F2F2F2",
//         paddingTop: "120px",
//         paddingBottom: "140px",
//       }}
//     >
//       {/* Top label */}
//       <div
//         style={{
//           textAlign: "center",
//           fontSize: "32px",
//           marginBottom: "70px",
//           color: "#6B6B6B",
//         }}
//       >
//         See the case studies ↓
//       </div>

//       <div
//         style={{
//           maxWidth: "1728px",
//           margin: "0 auto",
//           display: "grid",
//           gridTemplateColumns: "260px 1fr",
//           gap: "40px",
//           padding: "0 60px",
//         }}
//       >
//         {/* LEFT PANEL */}
//         <div>
//           <h2
//             style={{
//               fontSize: "38px",
//               lineHeight: "1.3",
//               margin: 0,
//               fontWeight: 600,
//             }}
//           >
//             Real Estate
//             <br />
//             Site Selection
//           </h2>

//           <p
//             style={{
//               marginTop: "20px",
//               fontSize: "16px",
//               color: "#6B7280",
//               lineHeight: "1.6",
//             }}
//           >
//             Enabling faster site-selection
//             <br />
//             for Residential and commercial
//             <br />
//             Real Estate customers, including:
//           </p>

//           <ul
//             style={{
//               marginTop: "20px",
//               padding: 0,
//               listStyle: "none",
//               color: "#6B7280",
//               fontSize: "16px",
//               lineHeight: "1.9",
//             }}
//           >
//             <li>Franchises</li>
//             <li>Consultants</li>
//             <li>CRE</li>
//             <li>Residential Developers</li>
//             <li>Wholesale brokers</li>
//           </ul>
//         </div>

//         {/* MAP AREA */}
//         <div>
//           <div
//             style={{
//               position: "relative",
//               width: "100%",
//               height: "674px",
//               borderRadius: "14px",
//               overflow: "hidden",
//             }}
//           >
//             <Image
//               src="/use-cases/real.png"
//               alt="map"
//               fill
//               style={{ objectFit: "cover" }}
//             />

//             {/* LEFT SEARCH CARD */}
//             <div
//               style={{
//                 position: "absolute",
//                 left: "40px",
//                 bottom: "60px",
//                 width: "480px",
//                 height: "280px",
//                 background: "rgba(255,255,255,0.55)",
//                 backdropFilter: "blur(18px)",
//                 borderRadius: "24px",
//                 padding: "28px",
//               }}
//             >
//               <p style={{ margin: 0, fontSize: "15px" }}>
//                 Give me the best places for a new investment
//               </p>

//               <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
//                 RECENTS
//               </div>

//               <ul
//                 style={{
//                   marginTop: "10px",
//                   padding: 0,
//                   listStyle: "none",
//                   lineHeight: "2",
//                 }}
//               >
//                 <li>Tadaima</li>
//                 <li>Arcana</li>
//                 <li>Cotogna</li>
//                 <li>Beit Rima</li>
//               </ul>
//             </div>

//             {/* RIGHT INSIGHTS CARD */}
//             <div
//               style={{
//                 position: "absolute",
//                 right: "40px",
//                 top: "50px",
//                 width: "355px",
//                 height: "298px",
//                 background: "rgba(255,255,255,0.55)",
//                 backdropFilter: "blur(18px)",
//                 borderRadius: "24px",
//                 padding: "24px",
//               }}
//             >
//               <div style={{ fontSize: "14px", marginBottom: "10px" }}>
//                 Insights
//               </div>

//               <div style={{ fontSize: "13px", color: "#666" }}>RECENTS</div>

//               <ul
//                 style={{
//                   marginTop: "10px",
//                   padding: 0,
//                   listStyle: "none",
//                   lineHeight: "2",
//                 }}
//               >
//                 <li>Tadaima</li>
//                 <li>Arcana</li>
//                 <li>Cotogna</li>
//                 <li>Beit Rima</li>
//               </ul>
//             </div>
//           </div>

//           {/* BOTTOM CAPTIONS */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginTop: "20px",
//               fontSize: "16px",
//               fontWeight: 600,
//             }}
//           >
//             <span>How we do it? What / Where do data we collect, verified</span>
//             <span>Insert text: Marketing towards this specific person</span>
//           </div>
//         </div>
//       </div>

//       {/* Responsive */}
//       <style jsx>{`
//         @media (max-width: 1100px) {
//           div[style*="grid-template-columns"] {
//             grid-template-columns: 1fr;
//           }
//         }

//         @media (max-width: 768px) {
//           div[style*="height: 674px"] {
//             height: 420px;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

"use client";

import Image from "next/image";

export function RealEstateSection() {
  return (
    <section className="bg-[#F2F2F2] pt-20 lg:pt-[120px] pb-24 lg:pb-[140px]">

      {/* Top label */}
      <div className="text-center text-[24px] md:text-[28px] lg:text-[32px] mb-12 lg:mb-[70px] text-[#6B6B6B]">
        See the case studies ↓
      </div>

      <div className="max-w-[1728px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 px-6 md:px-12 lg:px-[60px]">

        {/* LEFT PANEL */}
        <div>
          <h2 className="text-[30px] md:text-[34px] lg:text-[38px] leading-[1.3] font-semibold">
            Real Estate
            <br />
            Site Selection
          </h2>

          <p className="mt-5 text-[16px] text-[#6B7280] leading-[1.6]">
            Enabling faster site-selection
            <br />
            for Residential and commercial
            <br />
            Real Estate customers, including:
          </p>

          <ul className="mt-5 text-[#6B7280] text-[16px] leading-[1.9] space-y-1">
            <li>Franchises</li>
            <li>Consultants</li>
            <li>CRE</li>
            <li>Residential Developers</li>
            <li>Wholesale brokers</li>
          </ul>
        </div>

        {/* MAP AREA */}
        <div>

          <div className="relative w-full h-[420px] md:h-[520px] lg:h-[674px] rounded-[14px] overflow-hidden">

            <Image
              src="/use-cases/real.png"
              alt="map"
              fill
              className="object-cover"
            />

            {/* LEFT SEARCH CARD */}
            <div className="absolute left-4 md:left-8 lg:left-[40px] bottom-4 md:bottom-8 lg:bottom-[60px] w-[85%] sm:w-[420px] lg:w-[480px] bg-white/55 backdrop-blur-[18px] rounded-[24px] p-6">

              <p className="text-[15px]">
                Give me the best places for a new investment
              </p>

              <div className="mt-5 text-[14px] text-[#666]">
                RECENTS
              </div>

              <ul className="mt-2 leading-[2]">
                <li>Tadaima</li>
                <li>Arcana</li>
                <li>Cotogna</li>
                <li>Beit Rima</li>
              </ul>

            </div>

            {/* RIGHT INSIGHTS CARD */}
            <div className="absolute right-4 md:right-8 lg:right-[40px] top-4 md:top-8 lg:top-[50px] w-[240px] md:w-[300px] lg:w-[355px] bg-white/55 backdrop-blur-[18px] rounded-[24px] p-6">

              <div className="text-[14px] mb-2">
                Insights
              </div>

              <div className="text-[13px] text-[#666]">
                RECENTS
              </div>

              <ul className="mt-2 leading-[2]">
                <li>Tadaima</li>
                <li>Arcana</li>
                <li>Cotogna</li>
                <li>Beit Rima</li>
              </ul>

            </div>

          </div>

          {/* BOTTOM CAPTIONS */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-5 text-[16px] font-semibold">
            <span>How we do it? What / Where do data we collect, verified</span>
            <span>Insert text: Marketing towards this specific person</span>
          </div>

        </div>

      </div>

    </section>
  );
}