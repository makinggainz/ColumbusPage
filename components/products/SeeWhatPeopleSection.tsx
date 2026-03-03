// "use client";

// import Image from "next/image";

// const FRAME_WIDTH = 1730;
// const COLUMN_COUNT = 6;
// const CARD_WIDTH = 250;   // adjust to match figma
// const GAP = 32;           // adjust to match figma

// const cards = [
//   "/see/1.png",
//   "/see/2.png",
//   "/see/3.png",
//   "/see/4.png",
//   "/see/5.png",
//   "/see/6.png",
//   "/see/7.png",
//   "/see/8.png",
//   "/see/9.png",
//   "/see/10.png",
//   "/see/11.png",
//   "/see/12.png",
//   "/see/13.png",
//   "/see/14.png",
//   "/see/15.png",
//   "/see/16.png",
// ];

// // distribution: 2,3,3,3,3,2
// const columns = [
//   cards.slice(0, 2),
//   cards.slice(2, 5),
//   cards.slice(5, 8),
//   cards.slice(8, 11),
//   cards.slice(11, 14),
//   cards.slice(14, 16),
// ];

// // stagger offsets — adjust to match figma perfectly
// const offsets = [40, 0, 60, 20, 80, 30];

// export default function SeeWhatPeopleSection() {
//   return (
//     <section className="bg-[#F6F7F8] py-24 flex justify-center">
//       <div
//         className="origin-top"
//         style={{
//           width: FRAME_WIDTH,
//           transform: "scale(min(1, 100vw / 1730))",
//           transformOrigin: "top center",
//         }}
//       >
//         <h2 className="text-center text-[42px] font-semibold text-[#0E2F44] mb-20">
//           See what people are asking
//         </h2>

//         <div className="flex gap-[32px] justify-center items-start">
//         {columns.map((column, colIndex) => (
//             <div
//             key={colIndex}
//             className="flex flex-col gap-8"
//             style={{
//                 width: CARD_WIDTH,
//             }}
//             >
//             {column.map((img, i) => (
//                 <Card key={i} img={img} />
//             ))}
//             </div>
//         ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// function Card({ img }: { img: string }) {
//   return (
//     <div className="bg-white rounded-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] overflow-hidden">

//       <div className="relative w-full aspect-[4/3]">
//         <Image
//           src={img}
//           alt=""
//           fill
//           className="object-cover"
//         />
//       </div>

//       <div className="p-4 flex gap-3">
//         <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0" />
//         <div className="bg-gray-100 text-xs p-3 rounded-2xl leading-relaxed">
//           Newest chic spots for a coffee in Madrid, with comfy seats
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";

type CardType = {
  img: string;
  text: string;
};

const cards: CardType[] = [
  { img: "/see/1.png", text: "Newest chic spots for a coffee in Madrid, with comfy seats" },
  { img: "/see/2.png", text: "Cozy stays with aesthetic interiors and warm lighting" },
  { img: "/see/3.png", text: "Luxury dining experience overlooking the skyline" },
  { img: "/see/4.png", text: "Beachfront cafes with tropical vibes and sea breeze" },
  { img: "/see/5.png", text: "Cool places to have a picnic with co-founders" },
  { img: "/see/6.png", text: "Underground nightlife with immersive music scenes" },
  { img: "/see/7.png", text: "Minimalist bathroom interiors with warm tones" },
  { img: "/see/8.png", text: "Hidden architectural gems in historic districts" },
  { img: "/see/9.png", text: "Places to take a girl on a first date (she’s allergic to peas)" },
  { img: "/see/10.png", text: "Dog parks perfect for weekend relaxation" },
  { img: "/see/11.png", text: "Sunset beaches with minimal crowds and calm waters" },
  { img: "/see/12.png", text: "Off-grid destinations for adventurous travelers" },
  { img: "/see/13.png", text: "Urban cafes filled with plants and natural light" },
  { img: "/see/14.png", text: "Warm, modern interiors with cozy atmosphere" },
  { img: "/see/15.png", text: "Romantic dining spots for special occasions" },
  { img: "/see/16.png", text: "Unique travel destinations that feel surreal" },
];

// EXACT 2-3-3-3-3-2 distribution
const columns: CardType[][] = [
  cards.slice(0, 2),
  cards.slice(2, 5),
  cards.slice(5, 8),
  cards.slice(8, 11),
  cards.slice(11, 14),
  cards.slice(14, 16),
];

export default function SeeWhatPeopleSection() {
  return (
    <section className="bg-[#F6F7F8] py-20 px-4">
      <div className="max-w-[1730px] mx-auto">

        {/* Title */}
        <h2 className="text-center text-[clamp(28px,4vw,56px)] font-semibold text-[#0E2F44] mb-16">
          See what people are asking
        </h2>

        {/* 6 Column Layout */}
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-6 
            gap-8
          "
        >
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-8">
              {column.map((card, i) => (
                <Card key={i} img={card.img} text={card.text} />
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function Card({ img, text }: CardType) {
  return (
    <div className="bg-white rounded-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] overflow-hidden transition">

      {/* Image (unchanged size) */}
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={img}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Text Bubble */}
      <div className="p-4 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0" />

        {/* Prevent text from stretching card height too much */}
        <div className="bg-gray-100 text-xs p-3 rounded-2xl leading-relaxed line-clamp-3">
          {text}
        </div>
      </div>

    </div>
  );
}