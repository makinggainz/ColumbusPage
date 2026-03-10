

// "use client";

// import Image from "next/image";

// export default function Chat() {
//   return (
//     <section className="w-full bg-black py-[120px] flex justify-center">
//       <div className="w-full max-w-[1728px] px-6">

//         {/* TITLE */}
//         <div className="mb-[48px]">
//           <h2 className="text-white text-[36px] font-semibold max-md:text-[28px]">
//             Conversational map chat
//           </h2>
//           <div className="w-full h-[1px] bg-[#2a2a2a] mt-4" />
//         </div>

//         {/* MAP FRAME */}
//         <div className="relative w-full overflow-hidden rounded-lg">

//           {/* Map image */}
//           <div className="relative w-full h-[673px] max-lg:h-[520px] max-md:h-[420px]">

//             <Image
//               src="/use-cases/mapchat.png"
//               alt="Map"
//               fill
//               className="object-cover"
//             />

//             {/* LEFT PANEL */}
//             <div className="
//               absolute left-0 top-0 h-full
//               w-[348px]
//               max-lg:w-[280px]
//               max-md:w-full
//               max-md:h-auto
//               max-md:relative
//               bg-black/70 backdrop-blur-md
//               text-white flex flex-col
//             ">

//               {/* City security */}
//               <div className="h-[76px] flex items-center px-6 text-[14px] text-gray-300 border-b border-white/10">
//                 City security
//               </div>

//               {/* Active card */}
//               <div className="px-6 py-6 bg-white/10 max-md:py-5">

//                 <h3 className="text-[24px] font-semibold mb-3 max-md:text-[20px]">
//                   Urban Planning & Infrastructure
//                 </h3>

//                 <p className="text-[16px] text-gray-300 mb-4 leading-relaxed max-md:text-[14px]">
//                   Enabling faster site-selection for Residential and commercial
//                   Real Estate customers, including:
//                 </p>

//                 <ul className="text-[16px] text-gray-300 space-y-2 max-md:text-[14px]">
//                   <li>• Franchises</li>
//                   <li>• Consultants</li>
//                   <li>• CRE</li>
//                   <li>• Residential Developers</li>
//                   <li>• Wholesale brokers</li>
//                 </ul>

//               </div>

//               {/* Menu items */}
//               <div className="h-[76px] flex items-center px-6 border-t border-white/10 text-gray-300">
//                 Environmental
//               </div>

//               <div className="h-[76px] flex items-center px-6 border-t border-white/10 text-gray-300">
//                 Todo list apps
//               </div>

//               <div className="h-[76px] flex items-center px-6 border-t border-white/10 text-gray-300">
//                 Tourism
//               </div>

//             </div>

//             {/* CHAT CARD */}
//             <div className="
//               absolute
//               left-[420px]
//               top-[100px]
//               w-[514px]
//               max-xl:left-[360px]
//               max-xl:w-[440px]
//               max-lg:left-[300px]
//               max-lg:w-[360px]
//               max-md:relative
//               max-md:left-0
//               max-md:top-6
//               max-md:w-full
//               bg-white rounded-xl shadow-xl p-6
//             ">

//               <div className="text-gray-400 text-[14px] mb-10">
//                 🌐 Columbus is thinking...
//               </div>

//               <div className="text-gray-400 text-[13px] space-y-1 mb-10">
//                 <p>Considering demographics of Miami</p>
//                 <p>Considering lot prices</p>
//                 <p>Considering trade area competition</p>
//                 <p>Considering your customer target</p>
//               </div>

//               <div className="text-gray-700 text-[14px] mb-10 leading-relaxed">
//                 These areas marked have streets that often had crashes.
//                 There is poor road signal trafficking. Consumers have
//                 expressed dissatisfaction with this section.
//               </div>

//               <div className="text-gray-700 text-[14px] mb-10">
//                 / Would you like to order a specific dataset and survey?
//                 Our partner agents will be dispatched for the study.
//               </div>

//               <div className="flex items-center justify-between border-t pt-3">

//                 <p className="text-[13px] text-gray-500 max-w-[280px]">
//                   Where should the Transportation authority install a new road
//                   signal for traffic?
//                 </p>

//                 <div className="w-[32px] h-[32px] bg-[#1c2c6b] rounded-md" />

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>
//     </section>
//   );
// }
"use client";

import Image from "next/image";

export default function Chat() {
  return (
    <section className="w-full bg-black py-[120px] flex justify-center">
      <div className="w-full max-w-[1728px] px-6">

        {/* TITLE */}
        <div className="mb-[48px]">
          <h2 className="text-white text-[36px] font-semibold max-md:text-[28px]">
            Conversational map chat
          </h2>
          <div className="w-full h-[1px] bg-[#2a2a2a] mt-4" />
        </div>

        {/* MOBILE SIDEBAR (shows above map) */}
        <div className="hidden max-md:block bg-black/70 backdrop-blur-md text-white rounded-lg overflow-hidden mb-6">

          <div className="h-[76px] flex items-center px-6 text-[14px] text-gray-300 border-b border-white/10">
            City security
          </div>

          <div className="px-6 py-6 bg-white/10">

            <h3 className="text-[20px] font-semibold mb-3">
              Urban Planning & Infrastructure
            </h3>

            <p className="text-[14px] text-gray-300 mb-4">
              Enabling faster site-selection for Residential and commercial
              Real Estate customers, including:
            </p>

            <ul className="text-[14px] text-gray-300 space-y-2">
              <li>• Franchises</li>
              <li>• Consultants</li>
              <li>• CRE</li>
              <li>• Residential Developers</li>
              <li>• Wholesale brokers</li>
            </ul>

          </div>

        </div>

        {/* MAP FRAME */}
        <div className="relative w-full overflow-hidden rounded-lg">

          {/* MAP */}
          <div className="relative w-full h-[673px] max-lg:h-[520px] max-md:h-[420px]">

            <Image
              src="/use-cases/mapchat.png"
              alt="Map"
              fill
              className="object-cover"
              priority
            />

            {/* DESKTOP SIDEBAR */}
            <div className="
              hidden md:flex
              absolute left-0 top-0 h-full
              w-[348px]
              max-lg:w-[280px]
              bg-black/70 backdrop-blur-md
              text-white flex-col
            ">

              <div className="h-[76px] flex items-center px-6 text-[14px] text-gray-300 border-b border-white/10">
                City security
              </div>

              <div className="px-6 py-6 bg-white/10">

                <h3 className="text-[24px] font-semibold mb-3">
                  Urban Planning & Infrastructure
                </h3>

                <p className="text-[16px] text-gray-300 mb-4">
                  Enabling faster site-selection for Residential and commercial
                  Real Estate customers, including:
                </p>

                <ul className="text-[16px] text-gray-300 space-y-2">
                  <li>• Franchises</li>
                  <li>• Consultants</li>
                  <li>• CRE</li>
                  <li>• Residential Developers</li>
                  <li>• Wholesale brokers</li>
                </ul>

              </div>

              <div className="h-[76px] flex items-center px-6 border-t border-white/10 text-gray-300">
                Environmental
              </div>

              <div className="h-[76px] flex items-center px-6 border-t border-white/10 text-gray-300">
                Todo list apps
              </div>

              <div className="h-[76px] flex items-center px-6 border-t border-white/10 text-gray-300">
                Tourism
              </div>

            </div>

            {/* CHAT CARD */}
            <div className="
              absolute
              left-[420px]
              top-[100px]
              w-[514px]
              max-xl:left-[360px]
              max-xl:w-[440px]
              max-lg:left-[300px]
              max-lg:w-[360px]
              max-md:relative
              max-md:left-0
              max-md:top-6
              max-md:w-full
              bg-white rounded-xl shadow-xl p-6
            ">

              <div className="text-gray-400 text-[14px] mb-8">
                🌐 Columbus is thinking...
              </div>

              <div className="text-gray-400 text-[13px] space-y-1 mb-8">
                <p>Considering demographics of Miami</p>
                <p>Considering lot prices</p>
                <p>Considering trade area competition</p>
                <p>Considering your customer target</p>
              </div>

              <div className="text-gray-700 text-[14px] mb-8">
                These areas marked have streets that often had crashes.
                There is poor road signal trafficking. Consumers have
                expressed dissatisfaction with this section.
              </div>

              <div className="text-gray-700 text-[14px] mb-8">
                / Would you like to order a specific dataset and survey?
                Our partner agents will be dispatched for the study.
              </div>

              <div className="flex items-center justify-between border-t pt-3">

                <p className="text-[13px] text-gray-500 max-w-[280px]">
                  Where should the Transportation authority install a new road
                  signal for traffic?
                </p>

                <div className="w-[32px] h-[32px] bg-[#1c2c6b] rounded-md" />

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}