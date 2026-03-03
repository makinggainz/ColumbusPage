// import type { Metadata } from "next";
// import "./globals.css";

// import { Cormorant_Garamond, Cambo } from "next/font/google";

// export const cormorant = Cormorant_Garamond({
//   subsets: ["latin"],
//   weight: ["600"],
//   display: "swap",
// });

// const cambo = Cambo({
//   weight: "400",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Columbus",
//   description: "AI-powered location and market research",
//   icons: {
//     icon: "/logobueno.png",
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//       </head>

//       {/* Keep global styles simple */}
//       <body className="antialiased bg-[#F9F9F9] min-h-screen">
//         {children}
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";

import { Cormorant_Garamond, Cambo } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const cambo = Cambo({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Columbus",
  description: "AI-powered location and market research",
  icons: {
    icon: "/logobueno.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cormorant.className} antialiased bg-[#F9F9F9] min-h-screen overflow-x-hidden`}
      >
        {/* Global Navbar */}
        <Navbar />

        {/* Offset for fixed navbar height (76px) */}
        <main className="pt-[76px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}