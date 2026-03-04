
// "use client";

// import { useState } from "react";

// export function MoreApplicationsSection() {
//   const [openIndex, setOpenIndex] = useState<number | null>(3);

//   const items = [
//     {
//       title: "Disaster response",
//       content:
//         "AI can analyze geographic signals and predict disaster impact zones.",
//     },
//     {
//       title:
//         "Environmental and Safety Mitigation and Predictive warning",
//       content:
//         "Large-scale spatial models help detect safety risks and environmental hazards.",
//     },
//     {
//       title: "City Security",
//       content:
//         "Geo intelligence helps monitor urban safety and detect anomalies.",
//     },
//     {
//       title: "Retail Analytics",
//       content:
//         "Location intelligence helps businesses analyze consumer flows and expansion opportunities.",
//     },
//     {
//       title: "Academic Research",
//       content:
//         "Researchers can use large-scale geospatial datasets for modeling and prediction.",
//     },
//   ];

//   const toggle = (index: number) => {
//     if (openIndex === index) setOpenIndex(null);
//     else setOpenIndex(index);
//   };

//   return (
//     <section
//       style={{
//         width: "100%",
//         maxWidth: "1728px",
//         margin: "0 auto",
//         padding: "140px 120px",
//       }}
//     >
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "420px 1fr",
//           gap: "80px",
//         }}
//       >
//         {/* LEFT SIDE */}
//         <div>
//           <h2
//             style={{
//               fontSize: "36px",
//               lineHeight: "140%",
//               fontWeight: 500,
//               margin: 0,
//             }}
//           >
//             More applications
//             <br />
//             of our technology.
//           </h2>

//           <p
//             style={{
//               marginTop: "20px",
//               fontSize: "16px",
//               lineHeight: "1.6",
//               color: "#6b7280",
//               maxWidth: "280px",
//             }}
//           >
//             We’re exploring many more use cases. We’re interested to work with
//             people in the industry. Talk to us.
//           </p>

//           {/* CHAT BUTTON WITH GLOW */}
//           <div
//             style={{
//               position: "relative",
//               width: "186px",
//               height: "60px",
//               marginTop: "28px",
//             }}
//           >
//             {/* Glow background */}
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 borderRadius: "50px",
//                 background:
//                   "radial-gradient(circle at 20% 70%, #FFD84D, transparent 60%), radial-gradient(circle at 70% 20%, #6EE7B7, transparent 60%), radial-gradient(circle at 80% 80%, #F472B6, transparent 60%)",
//                 filter: "blur(18px)",
//                 opacity: 0.9,
//               }}
//             />

//             {/* Button */}
//             <button
//               style={{
//                 position: "relative",
//                 width: "186px",
//                 height: "51px",
//                 borderRadius: "45px",
//                 border: "1px solid rgba(255,255,255,0.6)",
//                 background: "rgba(255,255,255,0.15)",
//                 backdropFilter: "blur(12px)",
//                 color: "#fff",
//                 fontSize: "14px",
//                 cursor: "pointer",
//               }}
//             >
//               Chat with us
//             </button>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div>
//           <div
//             style={{
//               fontSize: "12px",
//               letterSpacing: "1px",
//               marginBottom: "24px",
//               color: "#6b7280",
//               textTransform: "uppercase",
//             }}
//           >
//             ↓ APPLICATION AREAS
//           </div>

//           {items.map((item, i) => {
//             const open = openIndex === i;

//             return (
//               <div
//                 key={i}
//                 style={{
//                   borderTop: "1px solid #E0E4EA",
//                   padding: "22px 0",
//                 }}
//               >
//                 <div
//                   onClick={() => toggle(i)}
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "60px 1fr 40px",
//                     alignItems: "center",
//                     fontSize: "20px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {/* NUMBER */}
//                   <span style={{ color: "#9CA3AF" }}>
//                     {(i + 1).toString().padStart(2, "0")}.
//                   </span>

//                   {/* TITLE */}
//                   <span>{item.title}</span>

//                   {/* BUTTON */}
//                   <button
//                     style={{
//                       border: "none",
//                       background: "none",
//                       fontSize: "22px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     {open ? "−" : "+"}
//                   </button>
//                 </div>

//                 {/* EXPAND CONTENT */}
//                 {open && (
//                   <div
//                     style={{
//                       marginTop: "16px",
//                       paddingLeft: "60px",
//                       color: "#6b7280",
//                       fontSize: "16px",
//                       lineHeight: "1.6",
//                       maxWidth: "700px",
//                     }}
//                   >
//                     {item.content}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* RESPONSIVE */}
//       <style jsx>{`
//         @media (max-width: 900px) {
//           section {
//             padding: 80px 40px !important;
//           }

//           div[style*="grid-template-columns: 420px 1fr"] {
//             grid-template-columns: 1fr !important;
//             gap: 60px !important;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

"use client";

import { useState } from "react";

export function MoreApplicationsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(3);

  const items = [
    {
      title: "Disaster response",
      content:
        "AI can analyze geographic signals and predict disaster impact zones.",
    },
    {
      title:
        "Environmental and Safety Mitigation and Predictive warning",
      content:
        "Large-scale spatial models help detect safety risks and environmental hazards.",
    },
    {
      title: "City Security",
      content:
        "Geo intelligence helps monitor urban safety and detect anomalies.",
    },
    {
      title: "Retail Analytics",
      content:
        "Location intelligence helps businesses analyze consumer flows and expansion opportunities.",
    },
    {
      title: "Academic Research",
      content:
        "Researchers can use large-scale geospatial datasets for modeling and prediction.",
    },
  ];

  const toggle = (index: number) => {
    if (openIndex === index) setOpenIndex(null);
    else setOpenIndex(index);
  };

  return (
    <section className="w-full max-w-[1728px] mx-auto px-6 md:px-12 lg:px-[120px] py-20 lg:py-[140px]">

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-16 lg:gap-20">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-[28px] md:text-[32px] lg:text-[36px] leading-[140%] font-medium">
            More applications
            <br />
            of our technology.
          </h2>

          <p className="mt-5 text-[16px] leading-[1.6] text-gray-500 max-w-[280px]">
            We’re exploring many more use cases. We’re interested to work with
            people in the industry. Talk to us.
          </p>

          {/* CHAT BUTTON */}
          <div className="relative w-[186px] h-[60px] mt-7">

            <div
              className="absolute inset-0 rounded-full blur-[18px] opacity-90"
              style={{
                background:
                  "radial-gradient(circle at 20% 70%, #FFD84D, transparent 60%), radial-gradient(circle at 70% 20%, #6EE7B7, transparent 60%), radial-gradient(circle at 80% 80%, #F472B6, transparent 60%)",
              }}
            />

            <button className="relative w-[186px] h-[51px] rounded-[45px] border border-white/60 bg-white/15 backdrop-blur-md text-white text-[14px]">
              Chat with us
            </button>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <div className="text-[12px] tracking-[1px] mb-6 text-gray-500 uppercase">
            ↓ Application Areas
          </div>

          {items.map((item, i) => {
            const open = openIndex === i;

            return (
              <div key={i} className="border-t border-[#E0E4EA] py-[22px]">

                <div
                  onClick={() => toggle(i)}
                  className="grid grid-cols-[40px_1fr_30px] md:grid-cols-[60px_1fr_40px] items-center text-[18px] md:text-[20px] cursor-pointer"
                >
                  <span className="text-gray-400">
                    {(i + 1).toString().padStart(2, "0")}.
                  </span>

                  <span>{item.title}</span>

                  <button className="text-[22px]">
                    {open ? "−" : "+"}
                  </button>
                </div>

                {open && (
                  <div className="mt-4 pl-[40px] md:pl-[60px] text-gray-500 text-[16px] leading-[1.6] max-w-[700px]">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}